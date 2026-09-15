import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  User, 
  Building2,
  Check,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function GrievanceTracker({ parcel, lang = 'en' }) {
  const isHi = lang === 'hi';

  const [grievances, setGrievances] = useState([
    {
      id: "GRV-2026-0182",
      category: "DBT Payment Issue",
      categoryHi: "डीबीटी भुगतान समस्या",
      subject: "PFMS UTR Confirmation for Bank Account Ending in 4921",
      subjectHi: "बैंक खाते में पीएफएमएस यूटीआर पुष्टिकरण",
      submissionDate: "2026-09-09",
      status: "IN_PROGRESS", // SUBMITTED | ASSIGNED | UNDER_REVIEW | RESOLVED
      assignedOfficer: "District Treasury Officer & PFMS Helpdesk",
      expectedDays: "3 working days",
      expectedDaysHi: "3 कार्य दिवस",
      timeline: [
        { title: "Submitted", titleHi: "दर्ज", done: true, date: "09 Sep" },
        { title: "Assigned", titleHi: "अधिकारी को सौंपा गया", done: true, date: "10 Sep" },
        { title: "Under Review", titleHi: "जांच जारी", done: false, active: true, date: "11 Sep" },
        { title: "Resolved", titleHi: "निस्तारित", done: false, date: "Expected 14 Sep" }
      ],
      officialRemarks: "Bank verification successfully acknowledged. Credit confirmation verified through RBI NEFT gateway."
    },
    {
      id: "GRV-2026-0094",
      category: "Land Record Issue",
      categoryHi: "भू-अभिलेख सुधार समस्या",
      subject: "Khata K-1082 Area spelling mismatch between Jamabandi and ULPIN record",
      subjectHi: "जमाबंदी एवं भू-आधार में नाम की वर्तनी में विसंगति",
      submissionDate: "2026-07-14",
      status: "RESOLVED",
      assignedOfficer: "Revenue Tehsildar, Sohna",
      expectedDays: "Resolved in 4 days",
      expectedDaysHi: "4 दिनों में निस्तारित",
      timeline: [
        { title: "Submitted", titleHi: "दर्ज", done: true, date: "14 Jul" },
        { title: "Assigned", titleHi: "अधिकारी को सौंपा गया", done: true, date: "15 Jul" },
        { title: "Under Review", titleHi: "जांच जारी", done: true, date: "17 Jul" },
        { title: "Resolved", titleHi: "निस्तारित", done: true, date: "18 Jul" }
      ],
      officialRemarks: "Correction order passed by Sub-Divisional Magistrate. ULPIN record updated on State Cadastral portal."
    }
  ]);

  const [category, setCategory] = useState('Compensation Issue');
  const [description, setDescription] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTicketId, setNewTicketId] = useState(null);

  const handleFileAttach = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleGrievanceSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `GRV-2026-0${Math.floor(200 + Math.random() * 800)}`;
      const newGrievance = {
        id: generatedId,
        category: category,
        categoryHi: category,
        subject: description.slice(0, 50) + "...",
        subjectHi: description.slice(0, 50) + "...",
        submissionDate: new Date().toISOString().split('T')[0],
        status: "ASSIGNED",
        assignedOfficer: "Public Grievance Redressal Officer, Gurugram Collectorate",
        expectedDays: "3 working days",
        expectedDaysHi: "3 कार्य दिवस",
        timeline: [
          { title: "Submitted", titleHi: "दर्ज", done: true, date: "Today" },
          { title: "Assigned", titleHi: "अधिकारी को सौंपा गया", done: true, date: "Today" },
          { title: "Under Review", titleHi: "जांच जारी", done: false, active: true, date: "Pending" },
          { title: "Resolved", titleHi: "निस्तारित", done: false, date: "Expected in 3 days" }
        ],
        officialRemarks: "Complaint logged and dispatched to the Competent Authority. Action report scheduled within 72 hours."
      };

      setGrievances([newGrievance, ...grievances]);
      setIsSubmitting(false);
      setNewTicketId(generatedId);
      setDescription('');
      setAttachedFileName('');

      setTimeout(() => setNewTicketId(null), 6000);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "नागरिक शिकायत एवं समस्या निवारण पोर्टल" : "CITIZEN GRIEVANCE & COMPLAINT REDRESSAL"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "भू-अभिलेख, मुआवजा गणना, डीबीटी भुगतान अथवा विधिक विसंगतियों की शिकायत दर्ज करें और समाधान की प्रगति ट्रैक करें।"
                : "Submit administrative complaints regarding land valuation, DBT delay, or records with 72-hour guaranteed review turnaround."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Form (5 cols), Right Grievances List (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: File Grievance Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              Quick Redressal
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1">
              {isHi ? "नई शिकायत दर्ज करें" : "Submit Citizen Grievance"}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {isHi ? "सीधे जिला लोक शिकायत निवारण अधिकारी को प्रेषित की जाएगी।" : "Forwarded directly to the District Public Grievance Officer."}
            </p>
          </div>

          <form onSubmit={handleGrievanceSubmit} className="space-y-3.5 text-xs">
            {/* Category Select */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "शिकायत की श्रेणी" : "Grievance Category"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:border-orange-500 focus:outline-none"
              >
                <option value="Compensation Issue">Compensation Issue (Calculation / Circle Rate Discrepancy)</option>
                <option value="DBT Issue">DBT Issue (Delayed Payment / Bank Account Mismatch)</option>
                <option value="Land Record Issue">Land Record Issue (Survey Plot Area / Khata Mismatch)</option>
                <option value="Ownership Issue">Ownership Issue (Joint Name / Title Mutation)</option>
                <option value="Document Issue">Document Issue (Missing Notice / Stamp Delay)</option>
                <option value="Legal Issue">Legal Issue (Hearing Schedule / Objection Status)</option>
                <option value="Other">Other Grievance / Inquiry</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "शिकायत का विस्तृत विवरण" : "Description of Grievance"}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isHi ? "कृपया समस्या का विवरण, प्रासंगिक तारीख और अपेक्षित समाधान स्पष्ट रूप से लिखें..." : "Detail the problem, bank or land reference, and desired resolution..."}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            {/* Attachment Button */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "संलग्न साक्ष्य (वैकल्पिक)" : "Attach Proof / Evidence (Optional)"}
              </label>
              <div className="flex items-center space-x-2">
                <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1.5 cursor-pointer">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{isHi ? "फ़ाइल संलग्न करें" : "Attach File"}</span>
                  <input type="file" onChange={handleFileAttach} className="hidden" />
                </label>
                <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  {attachedFileName || (isHi ? "कोई फ़ाइल चयनित नहीं" : "No file chosen")}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (isHi ? "दर्ज की जा रही है..." : "Logging Ticket...") : (isHi ? "शिकायत दर्ज करें" : "Submit Grievance")}</span>
            </button>
          </form>

          {newTicketId && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center space-x-2 font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? "शिकायत सफलतापूर्वक दर्ज!" : "Grievance Logged Successfully!"}</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Ticket ID: <strong>{newTicketId}</strong>. Expected response within 3 working days.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Active Grievances & Live Stepper */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                  {isHi ? "आपकी दर्ज शिकायतें" : "CITIZEN COMPLAINT TRACKER"}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {isHi ? "शिकायत निवारण स्थिति एवं इतिहास" : "Grievance Resolution Lifecycle"}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                {grievances.length} {isHi ? "शिकायतें" : "Tickets"}
              </span>
            </div>

            <div className="space-y-4">
              {grievances.map((grv) => {
                const isResolved = grv.status === 'RESOLVED';
                return (
                  <div 
                    key={grv.id} 
                    className={`border rounded-xl p-4 space-y-3 text-xs ${
                      isResolved ? 'bg-slate-50/50 border-slate-200' : 'bg-orange-50/20 border-orange-200 shadow-xs'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-slate-900 text-sm">{grv.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                          {isHi ? grv.categoryHi : grv.category}
                        </span>
                      </div>
                      
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        isResolved 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-orange-100 text-orange-900 border-orange-300'
                      }`}>
                        {isResolved ? (isHi ? '✓ निस्तारित' : '✓ RESOLVED') : (isHi ? '⏳ प्रगति पर' : '⏳ IN PROGRESS')}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800 leading-snug">
                      {isHi ? grv.subjectHi : grv.subject}
                    </p>

                    {/* 4-Stage Stepper */}
                    <div className="grid grid-cols-4 gap-1 pt-1 pb-1">
                      {(grv.timeline || []).map((step, idx) => (
                        <div key={idx} className="text-center space-y-1">
                          <div className={`h-1.5 rounded-full ${
                            step.done ? 'bg-emerald-500' : step.active ? 'bg-orange-500 animate-pulse' : 'bg-slate-200'
                          }`} />
                          <p className={`text-[10px] font-bold truncate ${
                            step.done ? 'text-emerald-700' : step.active ? 'text-orange-900' : 'text-slate-400'
                          }`}>
                            {isHi ? step.titleHi : step.title}
                          </p>
                          <span className="text-[9px] text-slate-400 font-mono block">{step.date}</span>
                        </div>
                      ))}
                    </div>

                    {/* Officer & Remarks */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Assigned Officer: <strong className="text-slate-800">{grv.assignedOfficer}</strong></span>
                        <span className="font-mono text-orange-800 font-bold">{isHi ? grv.expectedDaysHi : grv.expectedDays}</span>
                      </div>
                      <p className="text-slate-700 pt-0.5">
                        <strong className="text-slate-900">Official Action Note:</strong> {grv.officialRemarks}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
