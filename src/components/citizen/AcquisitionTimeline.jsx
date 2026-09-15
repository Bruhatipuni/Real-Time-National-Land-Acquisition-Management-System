import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  FileText, 
  Building2, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { STAGES_LIST } from '../../data/mockData';

export default function AcquisitionTimeline({ parcel, lang = 'en', onNavigateTab }) {
  const isHi = lang === 'hi';
  
  // 9-Stage sequence for the citizen journey
  const JOURNEY_STAGES = [
    {
      id: 'LAND_IDENTIFICATION',
      title: 'Land Identified & Boundary Demarcation',
      titleHi: 'भूमि की पहचान एवं सीमांकन',
      statute: 'Section 3A(1) / ULPIN',
      date: '12 March 2026',
      authority: 'Survey of India & Revenue Tehsildar',
      docName: 'Preliminary Survey Map & Cadastral Overlay',
      notes: 'Initial alignment demarcation and 14-digit ULPIN Bhu-Aadhaar assignment to the parcel.',
      notesHi: 'प्रारंभिक गलियारा सीमांकन एवं 14-अंकीय भू-आधार (ULPIN) का आवंटन।'
    },
    {
      id: 'LAND_VERIFICATION',
      title: 'Land Record & Khata Verification',
      titleHi: 'राजस्व अभिलेख एवं खाता सत्यापन',
      statute: 'Revenue Code & Encumbrance Check',
      date: '28 March 2026',
      authority: 'Tehsildar Office, Sohna',
      docName: 'Jamabandi Khata K-1082 Certificate',
      notes: 'Verification of clear title, non-encumbrance verification, and Aadhaar authentication of landowner.',
      notesHi: 'स्पष्ट मालिकाना हक, भारमुक्ति सत्यापन और भू-स्वामी का आधार प्रमाणीकरण।'
    },
    {
      id: 'ACQUISITION_PROPOSAL',
      title: 'Acquisition Proposal Formalized',
      titleHi: 'अधिग्रहण प्रस्ताव औपचारिककरण',
      statute: 'MoRTH / NHAI Alignment Proposal',
      date: '15 April 2026',
      authority: 'NHAI Project Implementation Unit (PIU)',
      docName: 'Expressway Feasibility & Land Acquisition Plan',
      notes: 'Official submission of the corridor land requirements to the Competent Authority.',
      notesHi: 'सक्षम प्राधिकारी को गलियारे की भूमि आवश्यकताओं का औपचारिक प्रस्ताव।'
    },
    {
      id: 'NOTIFICATIONS_NOTICE',
      title: 'Section 3A Gazette Notification Published',
      titleHi: 'धारा 3A राजपत्र अधिग्रहण अधिसूचना',
      statute: 'Section 3A, National Highways Act 1956',
      date: '10 May 2026',
      authority: 'Ministry of Road Transport and Highways (MoRTH)',
      docName: 'Gazette Notification No. SO-1048(E)',
      notes: 'Declaration of intent to acquire land. Formal public notice published in national and regional daily newspapers.',
      notesHi: 'भूमि अधिग्रहण के आशय की घोषणा। राष्ट्रीय एवं क्षेत्रीय समाचार पत्रों में प्रकाशित।'
    },
    {
      id: 'LEGAL_OBJECTIONS',
      title: 'Objection Period & Section 3C Hearings',
      titleHi: 'आपत्ति अवधि एवं धारा 3C सुनवाई',
      statute: 'Section 3C, RFCTLARR Act 2013',
      date: '20 June 2026',
      authority: 'Court of Competent Authority (CALA / LAO)',
      docName: 'Section 3C Summary Hearing Record',
      notes: '21-day statutory objection window for landowners regarding area measurement or title disputes.',
      notesHi: 'क्षेत्रफल माप या स्वामित्व विवाद के लिए 21 दिनों की वैधानिक आपत्ति खिड़की।'
    },
    {
      id: 'APPROVAL_ACQUISITION',
      title: 'Section 3D Declaration of Vesting',
      titleHi: 'धारा 3D अधिग्रहण अंतिम घोषणा',
      statute: 'Section 3D Statutory Declaration',
      date: '18 July 2026',
      authority: 'Competent Authority for Land Acquisition',
      docName: 'Gazette of India SO-1492(E)',
      notes: 'Land vests absolutely in the Central Government free from all encumbrances.',
      notesHi: 'भूमि सभी भारों से मुक्त होकर पूर्णतः केंद्र सरकार में निहित होती है।'
    },
    {
      id: 'COMPENSATION_PROCESS',
      title: 'Section 3G Solatium Award Determination',
      titleHi: 'धारा 3G वैधानिक तोषणा निर्णय निर्धारण',
      statute: 'Section 3G & RFCTLARR Act 2013',
      date: '15 August 2026',
      authority: 'District Collector / LAO Gurugram',
      docName: 'Statutory Award Calculation Sheet (100% Solatium)',
      notes: 'Determination of market value multiplied by 1.5x rural factor, 100% compulsory solatium, and 12% additional interest.',
      notesHi: '1.5x ग्रामीण गुणांक, 100% अनिवार्य तोषणा और 12% ब्याज सहित मुआवजे का निर्धारण।'
    },
    {
      id: 'LAND_HANDOVER',
      title: 'Direct Benefit Transfer (DBT) & Handover',
      titleHi: 'प्रत्यक्ष लाभ अंतरण (DBT) एवं भौतिक कब्जा',
      statute: 'PFMS Direct Credit & Section 3E Possession',
      date: '08 September 2026',
      authority: 'Public Financial Management System & PIU',
      docName: 'DBT Credit Receipt & Possession Handover Order',
      notes: '100% funds transferred directly to Aadhaar-linked bank account. Formal possession certificate signed.',
      notesHi: '100% मुआवजा राशि सीधे बैंक खाते में जमा। कब्जा प्रमाण पत्र जारी।'
    },
    {
      id: 'PROJECT_UTILIZATION',
      title: 'Corridor Construction & Asset Utilization',
      titleHi: 'गलियारा निर्माण एवं उपयोग',
      statute: 'National Infrastructure Pipeline (NIP)',
      date: 'Ongoing 2026–2027',
      authority: 'NHAI Expressway Engineering Division',
      docName: 'Project Construction Milestone Report',
      notes: 'Earthwork, bridge construction, and expressway pavement laying across the acquired corridor.',
      notesHi: 'अधिग्रहित गलियारे पर एक्सप्रेसवे निर्माण कार्य एवं प्रगति।'
    }
  ];

  // Stage order index mapping
  const stageIndexMap = {
    'LAND_IDENTIFICATION': 0,
    'LAND_VERIFICATION': 1,
    'ACQUISITION_PROPOSAL': 2,
    'NOTIFICATIONS_NOTICE': 3,
    'LEGAL_OBJECTIONS': 4,
    'APPROVAL_ACQUISITION': 5,
    'COMPENSATION_PROCESS': 6,
    'LAND_HANDOVER': 7,
    'PROJECT_UTILIZATION': 8
  };

  const currentStageIndex = stageIndexMap[parcel.status] ?? 7;
  const [selectedStage, setSelectedStage] = useState(JOURNEY_STAGES[currentStageIndex]);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
            <span>{isHi ? "भूमि अधिग्रहण यात्रा — चरण-दर-चरण टाइमलाइन" : "LAND ACQUISITION JOURNEY — 9 STAGE TIMELINE"}</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {isHi 
              ? "पहचान से लेकर अंतिम डीबीटी भुगतान और निर्माण तक अपनी भूमि के अधिग्रहण के प्रत्येक चरण की स्थिति ट्रैक करें।"
              : "Track the end-to-end statutory milestones of your land from notice publication to bank credit and handover."}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-500 font-bold">{isHi ? "कुल चरण:" : "Milestones Completed:"}</span>
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-black">
            {currentStageIndex + 1} / 9 {isHi ? "पूर्ण" : "Achieved"}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Vertical Stepper (7 cols), Right Selected Stage Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Timeline Stepper */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 font-mono">
            {isHi ? "अधिग्रहण यात्रा अनुक्रम" : "ACQUISITION JOURNEY SEQUENCE"}
          </h3>

          <div className="space-y-0 relative">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isUpcoming = idx > currentStageIndex;
              const isSelected = selectedStage.id === stage.id;

              return (
                <div 
                  key={stage.id} 
                  onClick={() => setSelectedStage(stage)}
                  className={`flex items-start space-x-4 p-3 rounded-xl transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-amber-50/80 border border-amber-300 shadow-xs' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Vertical Connecting Line */}
                  {idx !== JOURNEY_STAGES.length - 1 && (
                    <div 
                      className={`absolute left-7 top-10 w-0.5 h-10 ${
                        idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} 
                    />
                  )}

                  {/* Stage Icon */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    {isCompleted && (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md animate-pulse">
                        <Clock className="w-4 h-4" />
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Stage Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-black truncate ${
                        isCompleted ? 'text-slate-900' : isCurrent ? 'text-amber-900 font-extrabold' : 'text-slate-500'
                      }`}>
                        {isHi ? stage.titleHi : stage.title}
                      </h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isCompleted 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : isCurrent 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isCompleted ? (isHi ? 'पूर्ण' : 'COMPLETED') : isCurrent ? (isHi ? 'प्रक्रियाधीन' : 'IN PROGRESS') : (isHi ? 'आगामी' : 'UPCOMING')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="font-mono text-slate-600">{stage.date}</span>
                      <span>•</span>
                      <span className="truncate">{stage.authority}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 self-center ${isSelected ? 'text-amber-700' : 'text-slate-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Stage Inspector Details */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 sticky top-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {isHi ? "चयनित चरण का विवरण" : "STAGE MILESTONE DOSSIER"}
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                {isHi ? selectedStage.titleHi : selectedStage.title}
              </h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{selectedStage.statute}</p>
            </div>

            {/* Stage Attributes */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{isHi ? "निर्णय / अधिसूचना तिथि" : "Record / Notification Date"}</span>
                </span>
                <p className="font-mono font-bold text-slate-900">{selectedStage.date}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{isHi ? "सक्षम प्राधिकारी" : "Statutory Authority"}</span>
                </span>
                <p className="font-bold text-slate-900">{selectedStage.authority}</p>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-emerald-700" />
                  <span>{isHi ? "संलग्न वैधानिक दस्तावेज़" : "Statutory Document"}</span>
                </span>
                <p className="font-semibold text-slate-900">{selectedStage.docName}</p>
                <div className="pt-1">
                  <button 
                    onClick={() => onNavigateTab('documents')}
                    className="text-emerald-700 hover:text-emerald-800 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isHi ? "दस्तावेज़ तिजोरी में देखें (PDF)" : "View in Document Vault (PDF)"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                  <Info className="w-3 h-3 text-slate-400" />
                  <span>{isHi ? "विस्तृत विवरण एवं विधिक प्रभाव" : "Legal Significance & Notes"}</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {isHi ? selectedStage.notesHi : selectedStage.notes}
                </p>
              </div>
            </div>

            {/* Navigation back to other citizen views */}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => onNavigateTab('compensation')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <span>{isHi ? "मुआवजा एवं डीबीटी विवरण देखें" : "Check Solatium & DBT Payout"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
