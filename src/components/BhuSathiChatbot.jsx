import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/compensationEngine';
import { getNextActionDetails } from './citizen/citizenData';

export default function BhuSathiChatbot({ parcels, selectedParcel, currentUser, activeTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const activeParcel = selectedParcel || parcels[0];
  const nextAction = getNextActionDetails(activeParcel.status, activeParcel);

  const isSurveyorMode = activeTab === 'surveyor' || currentUser?.roleObj?.id === 'LAND_OFFICER';

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: isSurveyorMode
        ? `Namaste Surveyor! I am your AI Field Survey Assistant for BHUSETU DGPS / CORS workbench. Synced with CORS Network Station DL-ROHINI-04. How can I assist with GNSS coordinates, boundary mismatch analysis, route planning, or Form VII-A reporting?`
        : `Namaste ${activeParcel.ownerName}! I am your AI Bhu-Sathi Assistant for BHOOMISETU. I am currently synched with your parcel Plot ${activeParcel.surveyNo} (ULPIN: ${activeParcel.ulpin}). How can I assist you with your land acquisition, compensation award, or hearing schedule today?`
    }
  ]);

  const citizenQuickPrompts = [
    "Why haven't I received my compensation?",
    "What happens next for my land?",
    "When is my legal hearing?",
    "Explain my solatium calculation"
  ];

  const surveyorQuickPrompts = [
    "Which parcels have boundary mismatches?",
    "Show pending surveys within 5 km",
    "Generate today's survey report",
    "Which surveys have deadlines this week?"
  ];

  const quickPrompts = isSurveyorMode ? surveyorQuickPrompts : citizenQuickPrompts;

  const handleSend = (textToSend) => {
    const queryText = (typeof textToSend === 'string' ? textToSend : input).trim();
    if (!queryText) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    if (typeof textToSend !== 'string') setInput('');

    const query = queryText.toLowerCase();

    setTimeout(() => {
      let botReply = "";

      // Surveyor-specific queries
      if (isSurveyorMode && (query.includes('boundary') || query.includes('mismatch') || query.includes('deviation') || query.includes('encroach') || query.includes('tolerance'))) {
        botReply = `🛰️ Boundary & Area Mismatch Intelligence (Statutory Tolerance: ±1.5%):\n\n` +
          `• LND-00125 (Kherki Daula): Measured 2.48 Ha vs 2.43 Ha (+2.06% deviation) - Exceeds 1.5% threshold. Collector review required.\n` +
          `• LND-00126 (Manesar): Measured 1.76 Ha vs 1.82 Ha (-3.29% deviation) - Encroachment along Western Canal boundary (Points P3-P4).\n` +
          `• LND-00128 (Badshahpur): Measured 1.85 Ha vs 1.80 Ha (+2.78% deviation) - Dense tree foliage caused GNSS multipath error; re-survey scheduled.\n` +
          `• LND-00127 & LND-00130: Within statutory tolerance (0.00% and -0.76%). Verification passed!`;
      }
      else if (isSurveyorMode && (query.includes('5 km') || query.includes('route') || query.includes('nearby') || query.includes('pending survey') || query.includes('plan'))) {
        botReply = `📍 Optimized Field Survey Route Plan:\n\n` +
          `• Hub: District Collectorate Field Camp (28.4595° N, 77.0266° E)\n` +
          `• Total Parcels: 6 Parcels queued along Dwarka Expressway & CPR\n` +
          `• Waypoint Sequence: Field Camp → LND-00125 (Kherki Daula) → LND-00126 (Manesar) → LND-00127 → LND-00128 → LND-00130 → Return to Camp\n` +
          `• Total Route Distance: 38.4 km | Est. Travel & Survey Time: 5 hrs 20 mins\n\n` +
          `Click the "Field Route (6 Parcels)" button on the Surveyor Workbench header to open the interactive map and export GPX waypoints.`;
      }
      else if (isSurveyorMode && (query.includes('report') || query.includes('form vii') || query.includes('generate') || query.includes('certificate'))) {
        botReply = `📄 Form VII-A Statutory Land Survey & Demarcation Certificate:\n\n` +
          `• Format: Prescribed Government of India statutory field survey certificate.\n` +
          `• Includes: 14-digit ULPIN Bhu-Aadhaar, WGS-84 UTM Zone 43N coordinates table, RTK fix accuracies (±1.8m), variance computation, geo-tagged watermarked evidence photos, and owner Aadhaar verification.\n` +
          `• Signature: Surveyor Digital Signature + CALA Land Officer Counter-signature with QR verification code.\n\n` +
          `Click "Official Survey Report (Form VII-A)" or the "Report" button on any parcel row to view and print the statutory PDF.`;
      }
      else if (isSurveyorMode && (query.includes('deadline') || query.includes('week') || query.includes('urgent') || query.includes('today'))) {
        botReply = `⏰ High Priority Survey Deadlines:\n\n` +
          `1. LND-00125 (Plot 402/1, Kherki Daula): DEADLINE TODAY 17:00 IST (Interchange Corridor - Critical Path)\n` +
          `2. LND-00126 (Plot 188/3, Manesar): DEADLINE 16 SEP 2026 12:00 IST (Encroachment verification)\n` +
          `3. LND-00128 (Plot 512, Badshahpur): DEADLINE 18 SEP 2026 18:00 IST (Re-survey with total station)\n\n` +
          `Recommended: Open "My Assigned Parcels", filter by "High Priority" or "Today", and tap "START SURVEY".`;
      }
      // Citizen & general queries
      else if (query.includes('compensation') || query.includes('why haven') || query.includes('payment') || query.includes('dbt') || query.includes('money')) {
        const dbtMsg = activeParcel.dbtStatus === 'DISBURSED_100'
          ? `✓ 100% Funds Credited via Direct Benefit Transfer (DBT) to ${activeParcel.bankName} (Ref: ${activeParcel.dbtTransactionId || "DBT2026091299841"}) on ${activeParcel.dbtDate || "08 Sep 2026"}.`
          : `⏳ Payment is in Bank Verification / Escrow Queue under PFMS. Next step is finance disbursement approval.`;

        botReply = `I checked your land record for Plot ${activeParcel.surveyNo} (ULPIN: ${activeParcel.ulpin}):\n\n` +
          `• Registered Owner: ${activeParcel.ownerName}\n` +
          `• Total Award Amount: ${formatINR(activeParcel.totalAwardAmount)}\n` +
          `• Statutory Status: ${activeParcel.status.replace(/_/g, ' ')}\n` +
          `• Payout Status: ${dbtMsg}\n\n` +
          `You can view line-by-line breakdown in the "Compensation & DBT" tab or file a grievance if you notice any delay.`;
      } 
      else if (query.includes('next') || query.includes('what happens') || query.includes('stage') || query.includes('step')) {
        botReply = `Here is what happens next for your land (Plot ${activeParcel.surveyNo}):\n\n` +
          `• Current Stage: ${nextAction.stageTitle}\n` +
          `• Immediate Next Action: ${nextAction.nextAction}\n` +
          `• Responsible Authority: ${nextAction.responsibleAuthority}\n` +
          `• Estimated Timeline: ${nextAction.timeline}\n\n` +
          `You can track the complete 9-stage journey under the "Acquisition Journey" tab.`;
      }
      else if (query.includes('hearing') || query.includes('dispute') || query.includes('objection') || query.includes('case')) {
        botReply = `Regarding your legal status for ULPIN ${activeParcel.ulpin}:\n\n` +
          `• Active Case: CASE-2026-GGM-102 (Title & Co-Sharer Partition Dispute)\n` +
          `• Next Statutory Hearing: 28 September 2026 at 11:30 AM\n` +
          `• Presiding Officer: Court of District Collector / CALA, Gurugram\n` +
          `• Action: You may attend the hearing in person or upload supporting ownership proofs in the "Document Vault" tab.`;
      }
      else if (query.includes('solatium') || query.includes('calculate') || query.includes('formula')) {
        botReply = `Under the RFCTLARR Act 2013, your solatium is legally determined as follows:\n\n` +
          `1. Base Land Value: ${formatINR(activeParcel.marketRatePerHa * activeParcel.areaHectares)} (${activeParcel.areaHectares} Ha at circle rate)\n` +
          `2. Rural Distance Factor: 1.5x Multiplier\n` +
          `3. Solatium: 100% compulsory statutory allowance (${formatINR(activeParcel.solatiumAmount || 12487500)})\n` +
          `4. Additional Interest: 12% per annum from Sec 3A notification date\n` +
          `• Total Determined Solatium Award: ${formatINR(activeParcel.totalAwardAmount)}`;
      }
      else if (query.includes('ulpin') || query.includes('bhu aadhaar') || query.includes('survey')) {
        botReply = `Your parcel details:\n\n` +
          `• ULPIN (Bhu-Aadhaar): ${activeParcel.ulpin}\n` +
          `• Survey Plot: ${activeParcel.surveyNo} (Khata: ${activeParcel.khataNo})\n` +
          `• Location: ${activeParcel.village}, District ${activeParcel.district}, ${activeParcel.state}\n` +
          `• Area: ${activeParcel.areaHectares} Hectares (${(activeParcel.areaHectares * 2.471).toFixed(2)} Acres)\n` +
          `• Boundary: Digitally mapped and verified by Survey of India drone orthomosaics.`;
      }
      else {
        botReply = isSurveyorMode
          ? `As your DGPS / RTK Field Survey Assistant, I can help analyze boundary deviations, calculate parcel acreage, format coordinate tables, or provide dispute resolution protocols under Survey of India DILRMP guidelines. How can I help?`
          : `Under the RFCTLARR Act 2013 and National Highways Act 1956, land acquisition guarantees 100% compulsory solatium, transparent ULPIN GIS demarcation, and direct bank payouts. How can I help you specifically regarding Plot ${activeParcel.surveyNo}?`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[2000]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 border border-amber-300 cursor-pointer"
        >
          <Bot className="w-6 h-6 text-slate-950" />
          <span className="text-xs font-mono tracking-wide hidden md:inline font-bold">Bhu-Sathi AI Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping hidden md:inline" />
        </button>
      ) : (
        <div className="bg-white border border-slate-300 rounded-3xl w-84 md:w-[420px] shadow-2xl flex flex-col overflow-hidden text-slate-900 border-2">
          
          {/* Chat Header */}
          <div className="bg-slate-900 p-3.5 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center space-x-1.5 font-mono">
                  <span>Bhu-Sathi Contextual AI</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Synced: Plot {activeParcel.surveyNo} ({activeParcel.ownerName})</span>
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Context Banner */}
          <div className="bg-amber-50/90 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-amber-950">
            <span>ULPIN: <strong>{activeParcel.ulpin}</strong></span>
            <span className="font-bold text-emerald-800">{formatINR(activeParcel.totalAwardAmount)}</span>
          </div>

          {/* Messages Container */}
          <div className="p-3.5 space-y-3 h-80 overflow-y-auto text-xs font-medium bg-slate-50/50">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed shadow-xs ${
                    m.sender === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-sans'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Prompts Carousel */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-[10px]">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 px-2 py-1 rounded-lg shrink-0 transition-colors font-medium cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about Plot ${activeParcel.surveyNo}, compensation, hearing...`}
              className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-xl transition-colors cursor-pointer shrink-0 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
