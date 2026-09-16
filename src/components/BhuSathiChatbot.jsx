import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User, HelpCircle, ArrowRight, ShieldCheck, Compass, AlertTriangle } from 'lucide-react';
import { formatINR } from '../utils/compensationEngine';
import { getNextActionDetails } from './citizen/citizenData';

export default function BhuSathiChatbot({ parcels, selectedParcel, currentUser, activeTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const activeParcel = selectedParcel || parcels[0] || {
    plotNumber: "112/3B",
    surveyNo: "112/3B",
    ulpin: "27-14-9021-M8H2B1",
    ownerName: "Dattatray Pandurang Patil",
    village: "Kalyan East",
    district: "Thane",
    state: "Maharashtra",
    status: "VERIFICATION",
    totalAwardAmount: 30160000,
    riskScore: 78,
    riskLevel: "HIGH"
  };

  const isSurveyorMode = activeTab === 'surveyor' || currentUser?.roleObj?.id === 'LAND_OFFICER';

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: isSurveyorMode
        ? `Namaste Surveyor! I am your AI Field Survey Assistant for Bhoomi Setu DGPS / CORS workbench. Synced with CORS Network Station DL-ROHINI-04. How can I assist with GNSS coordinates, boundary mismatch analysis, route planning, or Form VII-A reporting?`
        : `Namaste${activeParcel.ownerName ? ' ' + activeParcel.ownerName : ''}! I am your Bhu-Sathi AI Decision Support Assistant for Bhoomi Setu.\n\nI am currently synced with parcel Plot ${activeParcel.plotNumber || activeParcel.surveyNo} (ULPIN: ${activeParcel.ulpin}) in ${activeParcel.village || 'Thane'}.\n\nHow can I assist you with parcel status, field demarcation, compensation awards, risk scores, alternative routes, or active disputes today?`
    }
  ]);

  const citizenQuickPrompts = [
    "What is the status of this parcel?",
    "Why is this parcel high risk?",
    "Why haven't I received my compensation?",
    "What happens next for my land?",
    "Which route has the lowest impact?",
    "Show parcels with area mismatch."
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
          `• LND-00125 (Plot 142/3, Sohna Rural • Rameshwar Singh Yadav): Measured 4.47 Ha vs 4.50 Ha (-0.67% deviation) - Within statutory tolerance.\n` +
          `• LND-00126 (Plot 142/4, Sohna Rural • Sunita Devi & Harish Yadav): Measured 3.10 Ha vs 3.20 Ha (-3.12% deviation) - Western Canal boundary encroachment (Points P3-P4 overlap).\n` +
          `• LND-00127 (Plot 112/1, Taurupath • Gurdeep Singh Sandhu): Measured 3.10 Ha vs 3.10 Ha (0.00% deviation) - Physical boundary verified; title under High Court Case CASE-102 stay.\n` +
          `• LND-00128 (Plot 88/C, Taurupath • Devendra Prakash Sharma): Measured 1.23 Ha vs 1.20 Ha (+2.50% deviation) - Northern orchard multipath GNSS interference; re-survey scheduled.\n` +
          `• LND-00129 & LND-00130: Fully aligned with revenue Khatauni records (0.00% to -0.48%).`;
      }
      else if (isSurveyorMode && (query.includes('5 km') || query.includes('route') || query.includes('nearby') || query.includes('pending survey') || query.includes('plan'))) {
        botReply = `📍 Optimized Field Survey Route Plan (Delhi-Mumbai Expressway Spur):\n\n` +
          `• Hub: Tehsildar & Survey Field Office, Sohna (28.1500° N, 76.9200° E)\n` +
          `• Active Section: Sohna Rural & Taurupath corridor (KM 38.2 to 44.8)\n` +
          `• Waypoint Sequence: Sohna Field Office → LND-00125 (Plot 142/3, Rameshwar Singh) → LND-00126 (Plot 142/4, Sunita Devi) → LND-00130 (Plot 12/4, Rakesh Bishnoi) → LND-00127 (Plot 112/1, Gurdeep Sandhu) → LND-00128 (Plot 88/C, Devendra Sharma) → LND-00129 (Plot 90/A, Mahesh Saini) → Return to Sohna Base\n` +
          `• Total Route Distance: 28.6 km | Est. Travel & Survey Time: 4 hrs 45 mins\n\n` +
          `Click "Optimize Field Route" on the Surveyor Workbench header to open the interactive map and export GPX waypoints.`;
      }
      else if (isSurveyorMode && (query.includes('report') || query.includes('form vii') || query.includes('generate') || query.includes('certificate'))) {
        botReply = `📄 Form VII-A Statutory Land Survey & Demarcation Certificate:\n\n` +
          `• Format: Prescribed Government of India statutory field survey certificate.\n` +
          `• Includes: 14-digit ULPIN Bhu-Aadhaar, WGS-84 UTM Zone 43N coordinates table, RTK fix accuracies (±1.8m), variance computation, geo-tagged watermarked evidence photos, and owner Aadhaar verification.\n` +
          `• Signature: Surveyor Digital Signature + CALA Land Officer Counter-signature with QR verification code.\n\n` +
          `Click "Preview Official Survey Report" on any parcel in the workbench to view and print the statutory PDF.`;
      }
      else if (isSurveyorMode && (query.includes('deadline') || query.includes('week') || query.includes('urgent') || query.includes('today'))) {
        botReply = `⏰ High Priority Survey Deadlines:\n\n` +
          `1. LND-00125 (Plot 142/3, Sohna Rural • Rameshwar Singh Yadav): DEADLINE TODAY 17:00 IST (Critical Path Interchange Corridor)\n` +
          `2. LND-00126 (Plot 142/4, Sohna Rural • Sunita Devi & Harish Yadav): DEADLINE 16 SEP 2026 12:00 IST (Encroachment Demarcation)\n` +
          `3. LND-00128 (Plot 88/C, Taurupath • Devendra Prakash Sharma): DEADLINE 18 SEP 2026 18:00 IST (Total Station Re-Survey)\n\n` +
          `Recommended: Open "My Assigned Parcels", filter by "High Priority" or "Today", and tap "START SURVEY".`;
      }
      else if (query.includes('status of this parcel') || query.includes('parcel status')) {
        botReply = `📌 Status for Plot ${activeParcel.plotNumber || activeParcel.surveyNo} (ULPIN: ${activeParcel.ulpin}):\n\n` +
          `• Registered Owner: ${activeParcel.landowner || activeParcel.ownerName}\n` +
          `• Survey Status: ${activeParcel.surveyStatus || 'Survey Done → Handed to LAO'}\n` +
          `• Official Area: ${activeParcel.officialArea || activeParcel.areaHectares} Ha | Surveyed Area: ${activeParcel.surveyedArea || activeParcel.officialArea} Ha\n` +
          `• GIS Demarcation: ${activeParcel.gisDemarcation || 'Demarcated (4 Coordinates)'}\n` +
          `• Verification Score: ${activeParcel.verificationScore || 100}%\n` +
          `• Expected Action: ${activeParcel.expectedNextAction || 'LAO Section 3G Solatium Award determination'}`;
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
      else if (query.includes('high risk') || query.includes('why is this parcel') || query.includes('risk score') || query.includes('risk')) {
        botReply = `⚠️ Risk Analysis for Plot ${activeParcel.plotNumber || activeParcel.surveyNo} (Score: ${activeParcel.riskScore || 78}/100 - ${activeParcel.riskLevel || 'HIGH'}):\n\n` +
          `1. Discrepancy Alert: ${activeParcel.alert || 'Land Classification variation between 7/12 RoR and ground inspection'}\n` +
          `2. Encroachment Risk: ${activeParcel.encroachmentRisk || 'LOW'} (boundary pinned via 4 DGPS RTK ground markers)\n` +
          `3. Corridor Delay Probability: ${activeParcel.delayProbability || '78%'}\n` +
          `4. Recommended Action: Prioritize joint spot inspection and resolve title verification before statutory Section 19 notification.`;
      }
      else if (query.includes('lowest impact') || query.includes('which route') || query.includes('route simulator') || query.includes('recommend')) {
        botReply = `🏆 Pre-Acquisition Route Recommendation (MCDA Engine):\n\n` +
          `• Recommended Route: ROUTE C (Impact Score: 39/100)\n` +
          `• Compared to Route A (Score 82/100):\n` +
          `   - 60% fewer affected families (250 vs 620)\n` +
          `   - 75% fewer legal disputes (12 vs 48 cases)\n` +
          `   - ₹350 Cr lower estimated statutory compensation (₹1,850 Cr vs ₹2,200 Cr)\n` +
          `   - 6 months shorter estimated duration (8 vs 14 months)\n\n` +
          `* Note: Route C is recommended in the synthetic demonstration dataset; final selection remains subject to competent authority approvals.`;
      }
      else if (query.includes('dispute') || query.includes('active disputes') || query.includes('objection')) {
        botReply = `⚖️ Active Disputes in Project Corridor:\n\n` +
          `1. Case LD-1042 (Plot 45/2A): Boundary Encroachment between Rameshwar Singh Yadav and Harpal Singh Yadav (0.16 Ha fence mismatch).\n` +
          `2. Case LD-1043 (Plot 88/1A): Coparcener Share Exclusion (Sunita Manohar Deshmukh claiming 0.70 Ha statutory share under Hindu Succession Act).\n` +
          `3. Case LD-1044 (Plot 92/4): Overlapping Deed Registrations in Hosakote Rural (0.28 Ha duplicate polygon).\n\n` +
          `You can inspect detailed spatial overlays and evidentiary files under the "Land Dispute Radar" tab.`;
      }
      else if (query.includes('area mismatch') || query.includes('mismatch')) {
        botReply = `🔍 Parcels Flagged with Area Mismatch:\n\n` +
          `• Parcel 27-14-9022-P9K1A3 (Plot 88/1A, Shahapur, Palghar):\n` +
          `   Official Area: 2.10 Ha | Surveyed Area: 2.38 Ha (0.28 Ha Variance - 13.3% mismatch).\n` +
          `• Parcel 06-12-8891-K9X2A4 (Plot 45/2A, Sohna Rural, Gurugram):\n` +
          `   Official Area: 1.82 Ha | Surveyed Area: 1.66 Ha (0.16 Ha Encroached by respondent fence).\n\n` +
          `Recommendation: Open the "Interactive Polygon Node Editor" to re-verify boundary pins and update BhuStack ledger.`;
      }
      else if (query.includes('compensation') || query.includes('payment') || query.includes('solatium')) {
        botReply = `💰 Compensation Summary for Plot ${activeParcel.plotNumber || activeParcel.surveyNo}:\n\n` +
          `• Base Valuation: ${formatINR((activeParcel.marketRatePerHa || 5200000) * (activeParcel.officialArea || 1.45))}\n` +
          `• RFCTLARR 2013 100% Solatium: ${formatINR(activeParcel.solatiumAmount || 15080000)}\n` +
          `• Total Award Amount: ${formatINR(activeParcel.totalAwardAmount || 30160000)}\n` +
          `• Disbursal Mode: Direct Benefit Transfer (DBT) to authenticated bank account via PFMS.`;
      }
      else {
        botReply = isSurveyorMode
          ? `As your DGPS / RTK Field Survey Assistant, I can help analyze boundary deviations, calculate parcel acreage, format coordinate tables, or provide dispute resolution protocols under Survey of India DILRMP guidelines. How can I help?`
          : `Under the BhuSetu National Land Acquisition & Management Platform, I can assist with:\n\n` +
            `• Parcel ULPIN lookup and boundary verification status\n` +
            `• AI Risk prioritization and mismatch detection\n` +
            `• Pre-acquisition Route Simulator MCDA scoring\n` +
            `• Person-to-person land disputes (LD-1042, LD-1043, LD-1044)\n` +
            `• RFCTLARR 2013 solatium and R&R entitlement tracking.\n\n` +
            `What would you like to examine next?`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[2000] font-sans">
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
        <div className="bg-white border border-slate-300 rounded-3xl w-84 md:w-[440px] shadow-2xl flex flex-col overflow-hidden text-slate-900 border-2">
          {/* Chat Header */}
          <div className="bg-slate-900 p-3.5 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center space-x-1.5 font-mono">
                  <span>Bhu-Sathi Decision Support AI</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Synced: Plot {activeParcel.plotNumber || activeParcel.surveyNo} ({activeParcel.landowner || activeParcel.ownerName})</span>
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
            <span className="font-bold text-emerald-800">{formatINR(activeParcel.totalAwardAmount || 30160000)}</span>
          </div>

          {/* Messages Container */}
          <div className="p-3.5 space-y-3 h-84 overflow-y-auto text-xs font-medium bg-slate-50/50">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed shadow-2xs ${
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
                className="bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0 transition-colors font-semibold cursor-pointer"
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
              placeholder={`Ask about Plot ${activeParcel.plotNumber || activeParcel.surveyNo}, route comparison, disputes...`}
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
