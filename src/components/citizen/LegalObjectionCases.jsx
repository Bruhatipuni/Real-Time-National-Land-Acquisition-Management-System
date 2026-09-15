import React, { useState } from 'react';
import { 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  User, 
  FileText, 
  Upload, 
  Send, 
  Check,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { CITIZEN_LEGAL_CASE } from './citizenData';

export default function LegalObjectionCases({ parcel, lang = 'en', onNavigateTab }) {
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState('activeCase'); // 'activeCase' | 'fileNew'
  const [showOrderModal, setShowOrderModal] = useState(false);

  // New objection form state
  const [objectionCategory, setObjectionCategory] = useState('Compensation Valuation Dispute');
  const [statement, setStatement] = useState('');
  const [objectionSubmitted, setObjectionSubmitted] = useState(false);

  const handleSubmitObjection = (e) => {
    e.preventDefault();
    if (!statement.trim()) return;

    setObjectionSubmitted(true);
    setTimeout(() => {
      setObjectionSubmitted(false);
      setStatement('');
      setActiveTab('activeCase');
    }, 3500);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "मेरा कानूनी मामला एवं धारा 3C आपत्तियां" : "MY LEGAL CASE & SECTION 3C OBJECTIONS"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "सरलीकृत नागरिक दृश्य: अपनी कानूनी आपत्ति की स्थिति, सुनवाई की तिथि एवं निर्णय आदेश ट्रैक करें।"
                : "Simplified citizen tracking: Monitor your statutory objection hearing date, assigned legal officer, and court orders."}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('activeCase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'activeCase' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? "सक्रिय कानूनी मामला" : "Active Case (CASE-102)"}
          </button>
          <button
            onClick={() => setActiveTab('fileNew')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'fileNew' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? "+ नई आपत्ति दर्ज करें" : "+ File New Objection"}
          </button>
        </div>
      </div>

      {activeTab === 'activeCase' ? (
        /* Case Details & Simplified Timeline */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Active Legal Case Card */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  {CITIZEN_LEGAL_CASE.section}
                </span>
                <h3 className="text-xl font-black font-mono text-slate-900 mt-1">
                  {CITIZEN_LEGAL_CASE.caseId}
                </h3>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>{isHi ? "समीक्षाधीन" : "UNDER REVIEW"}</span>
              </span>
            </div>

            {/* Issue Description */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {isHi ? "आपत्ति का विषय" : "Primary Legal Issue"}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                {isHi ? CITIZEN_LEGAL_CASE.issueHi : CITIZEN_LEGAL_CASE.issue}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHi ? CITIZEN_LEGAL_CASE.descriptionHi : CITIZEN_LEGAL_CASE.description}
              </p>
            </div>

            {/* Authority & Hearing Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{isHi ? "नियुक्त कानूनी अधिकारी" : "Assigned Authority"}</span>
                </span>
                <p className="font-bold text-slate-900">{CITIZEN_LEGAL_CASE.assignedAuthority}</p>
                <p className="text-[10px] text-slate-500 font-mono">Designated by Competent Authority</p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-300 space-y-1">
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-amber-700" />
                  <span>{isHi ? "आगामी सुनवाई तिथि" : "Next Hearing Session"}</span>
                </span>
                <p className="font-black font-mono text-amber-950 text-sm">{CITIZEN_LEGAL_CASE.hearingDate}</p>
                <p className="text-[10px] text-amber-800 font-bold">13 days remaining • Gurugram Collectorate</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowOrderModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isHi ? "अंतरिम आदेश देखें (PDF)" : "View Interim Order"}</span>
              </button>

              <button
                onClick={() => onNavigateTab('documents')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isHi ? "साक्ष्य दस्तावेज़ अपलोड करें" : "Upload Supporting Evidence"}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Citizen Dispute Lifecycle Stepper */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                Resolution Workflow
              </span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                {isHi ? "मामला निस्तारण यात्रा" : "Dispute Resolution Timeline"}
              </h3>
            </div>

            <div className="space-y-4 relative pt-1">
              {CITIZEN_LEGAL_CASE.timeline.map((step, i) => (
                <div key={step.step} className="flex items-start space-x-3 text-xs relative">
                  {/* Vertical Connector */}
                  {i !== CITIZEN_LEGAL_CASE.timeline.length - 1 && (
                    <div 
                      className={`absolute left-3.5 top-6 w-0.5 h-8 ${
                        step.done ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} 
                    />
                  )}

                  <div className="relative z-10 shrink-0">
                    {step.done ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : step.active ? (
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black animate-pulse shadow-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                        {step.step}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className={`font-black ${step.done ? 'text-slate-900' : step.active ? 'text-amber-900 font-extrabold' : 'text-slate-500'}`}>
                        {isHi ? step.titleHi : step.title}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-500">{step.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {step.done ? (isHi ? 'पूर्ण' : 'Verified') : step.active ? (isHi ? 'प्रक्रियाधीन' : 'Scheduled & Awaiting Action') : (isHi ? 'प्रतीक्षित' : 'Pending')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1 mt-2">
              <span className="font-bold text-slate-800">{isHi ? "नागरिक अधिकार सूचना:" : "Citizen Legal Rights:"}</span>
              <p>
                {isHi 
                  ? "यदि आप सक्षम प्राधिकारी के आदेश से असंतुष्ट हैं, तो धारा 3H(4) के तहत 60 दिनों में उच्च न्यायालय या मध्यस्थता पंचाट में अपील का अधिकार सुरक्षित है।"
                  : "If dissatisfied with CALA's Section 3G decision, landowners retain statutory right to appeal before the Central Arbitrator within 60 days."}
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* File New Objection Tab */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              Section 3C Statutory Objection
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              {isHi ? "सक्षम प्राधिकारी के समक्ष नई आपत्ति दर्ज करें" : "File Formal Section 3C Legal Objection"}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "धारा 3A अधिसूचना प्रकाशन के 21 दिनों के भीतर क्षेत्रफल, मुआवजा दर या स्वामित्व के संबंध में आपत्ति दर्ज करें।"
                : "Under Section 3C, landowners can challenge area demarcation, valuation rate, or title disputes."}
            </p>
          </div>

          <form onSubmit={handleSubmitObjection} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  ULPIN Reference
                </label>
                <input
                  type="text"
                  value={parcel.ulpin}
                  disabled
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  Survey Plot / Khata
                </label>
                <input
                  type="text"
                  value={`Plot ${parcel.surveyNo} (${parcel.khataNo})`}
                  disabled
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "आपत्ति की श्रेणी चुनें" : "Objection Ground Category"}
              </label>
              <select
                value={objectionCategory}
                onChange={(e) => setObjectionCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              >
                <option>Compensation Valuation Dispute (Rate per Hectare)</option>
                <option>Boundary & Survey Area Discrepancy (Khata Demarcation)</option>
                <option>Joint Ownership & Khata Co-Sharer Partition Claim</option>
                <option>Structure / Tubewell / Fruit Tree Valuation Revision</option>
                <option>Public Right of Way / Alternate Alignment Request</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "विस्तृत विधिक आपत्ति विवरण" : "Statement of Objection & Grounds"}
              </label>
              <textarea
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder={isHi ? "अपनी आपत्ति के तथ्य, संबंधित खसरा नंबर और सुधार का स्पष्ट विवरण दें..." : "Detail the facts, survey discrepancy, and legal grounds under Section 3C..."}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>{isHi ? "सक्षम प्राधिकारी (CALA) को वैधानिक आपत्ति प्रस्तुत करें" : "Submit Statutory Section 3C Objection"}</span>
            </button>
          </form>

          {objectionSubmitted && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 flex items-center space-x-2 font-medium">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">{isHi ? "आपत्ति सफलतापूर्वक दर्ज की गई!" : "Objection Registered Successfully!"}</p>
                <p className="text-[11px] text-emerald-800">
                  Ref Case ID: <strong>CASE-2026-GGM-103</strong>. Assigned to Legal Nodal Officer. Notice for hearing will be issued within 7 days.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-sm">
                  {isHi ? "सक्षम प्राधिकारी अंतरिम आदेश" : "CALA Interim Hearing Order"} - {CITIZEN_LEGAL_CASE.caseId}
                </h4>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-800">
              <div className="border-b border-slate-200 pb-2 flex justify-between font-mono text-[11px] text-slate-500">
                <span>Case No: CASE-2026-GGM-102</span>
                <span>Date: 24 August 2026</span>
              </div>
              <p className="font-semibold text-slate-900">
                BEFORE THE COURT OF COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA), GURUGRAM
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed space-y-2">
                <p>
                  <strong>In the matter of:</strong> Objection by Rameshwar Singh Yadav concerning Plot 45/2A, Village Sohna Rural.
                </p>
                <p>
                  <strong>Interim Direction:</strong> The Field Surveyor & Horticulture Nodal are directed to conduct a joint spot inspection of the 14 timber trees on Plot 45/2A on or before 20 September 2026 and submit a revised joint valuation sheet.
                </p>
                <p>
                  <strong>Next Date of Hearing:</strong> 28 September 2026 at 11:30 AM in the Courtroom of District Collector, Gurugram.
                </p>
              </div>
              <div className="text-right pt-2 font-mono text-[11px] text-slate-600">
                Signed by: <strong>Shri Vikramaditya Singh, IAS (CALA)</strong>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
