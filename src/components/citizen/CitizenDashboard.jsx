import React from 'react';
import { 
  Compass, 
  IndianRupee, 
  Calendar, 
  FileText, 
  Scale, 
  MessageSquare, 
  Download, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  MapPin,
  Scroll
} from 'lucide-react';
import WhatHappensNextCard from './WhatHappensNextCard';
import { formatINR } from '../../utils/compensationEngine';
import { CITIZEN_DEADLINES } from './citizenData';

export default function CitizenDashboard({ parcel, lang = 'en', onNavigateTab }) {
  const isHi = lang === 'hi';
  const urgentDeadline = CITIZEN_DEADLINES.find(d => d.priority === 'URGENT') || CITIZEN_DEADLINES[0];

  const quickActions = [
    {
      id: 'gis',
      title: isHi ? 'मेरी भूमि (GIS नक्शा)' : 'My Land (GIS Map)',
      desc: isHi ? 'भू-सीमा, सैटेलाइट दृश्य एवं ड्रोन सर्वे' : 'Geo-referenced boundary & satellite view',
      icon: Compass,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
    },
    {
      id: 'timeline',
      title: isHi ? 'अधिग्रहण यात्रा' : 'Acquisition Timeline',
      desc: isHi ? '9-चरणों का संपूर्ण विधिक सफर' : '9-stage end-to-end statutory progress',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-700 border-amber-300'
    },
    {
      id: 'compensation',
      title: isHi ? 'मुआवजा एवं डीबीटी' : 'Compensation & DBT',
      desc: isHi ? 'तोषणा गणना एवं बैंक भुगतान स्थिति' : 'LARR 2013 solatium formula & payment track',
      icon: IndianRupee,
      color: 'bg-blue-500/10 text-blue-700 border-blue-300'
    },
    {
      id: 'documents',
      title: isHi ? 'दस्तावेज़ तिजोरी' : 'Document Vault',
      desc: isHi ? 'सरकारी आदेश एवं साक्ष्य अपलोड' : 'Certified orders & citizen upload center',
      icon: FileText,
      color: 'bg-purple-500/10 text-purple-700 border-purple-300'
    },
    {
      id: 'applyPapers',
      title: isHi ? 'दस्तावेज़ हेतु आवेदन' : 'Apply for Papers',
      desc: isHi ? 'जमाबंदी नकल, भू-आधार नक्शा एवं भारमुक्ति पत्र' : 'Certified Jamabandi, ULPIN map & NEC',
      icon: Scroll,
      color: 'bg-teal-500/10 text-teal-700 border-teal-300'
    },
    {
      id: 'legal',
      title: isHi ? 'मेरा कानूनी मामला' : 'My Legal Case',
      desc: isHi ? 'धारा 3C आपत्ति एवं सुनवाई विवरण' : 'Dispute status & hearing calendar',
      icon: Scale,
      color: 'bg-rose-500/10 text-rose-700 border-rose-300'
    },
    {
      id: 'grievances',
      title: isHi ? 'जन शिकायत निवारण' : 'File Grievance',
      desc: isHi ? '72-घंटे में त्वरित समाधान टिकट' : '72-hr guaranteed response complaint tracker',
      icon: MessageSquare,
      color: 'bg-orange-500/10 text-orange-700 border-orange-300'
    },
    {
      id: 'report',
      title: isHi ? 'भूमि रिपोर्ट (PDF)' : 'Download Land Report',
      desc: isHi ? 'एक-क्लिक में आधिकारिक रिपोर्ट' : 'Official certified dossier with QR seal',
      icon: Download,
      color: 'bg-teal-500/10 text-teal-700 border-teal-300'
    },
    {
      id: 'authority',
      title: isHi ? 'प्राधिकारी से संपर्क' : 'Contact Authority',
      desc: isHi ? 'जिला कलेक्टर एवं नोडल अधिकारी' : 'District LAO office & case handlers',
      icon: Building2,
      color: 'bg-indigo-500/10 text-indigo-700 border-indigo-300'
    }
  ];

  return (
    <div className="space-y-5">
      {/* 1. What Happens Next Card (Feature 15) */}
      <WhatHappensNextCard 
        parcel={parcel} 
        lang={lang} 
        onNavigateTab={onNavigateTab} 
      />

      {/* 2. Key Metrics Snapshot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card A: Parcel Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-mono font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Bhu-Aadhaar
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {parcel.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{isHi ? "भू-स्वामी" : "Registered Owner"}</span>
            <h3 className="text-base font-black text-slate-900">{parcel.ownerName}</h3>
            <p className="font-mono text-xs text-amber-900 font-bold mt-0.5">{parcel.ulpin}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-500 block">{isHi ? "सर्वे / खसरा प्लॉट" : "Survey Plot"}</span>
              <span className="font-bold text-slate-900">Plot {parcel.surveyNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">{isHi ? "क्षेत्रफल" : "Acquired Area"}</span>
              <span className="font-bold text-slate-900">{parcel.areaHectares} Ha ({(parcel.areaHectares * 2.471).toFixed(2)} Ac)</span>
            </div>
          </div>
        </div>

        {/* Card B: Compensation & DBT Snapshot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-mono font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              RFCTLARR 2013
            </span>
            <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PFMS Verified</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{isHi ? "कुल निर्धारित मुआवजा" : "Total Determined Award"}</span>
            <h3 className="text-xl font-black font-mono text-emerald-700">{formatINR(parcel.totalAwardAmount)}</h3>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              {isHi ? "100% वैधानिक तोषणा एवं 1.5x ग्रामीण गुणांक सहित" : "Includes 100% Solatium & 1.5x Rural Factor"}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-2 rounded-xl text-xs flex items-center justify-between border border-emerald-200">
            <span className="text-[11px] text-emerald-900 font-bold">
              {parcel.dbtStatus === 'DISBURSED_100' ? (isHi ? "100% बैंक में जमा" : "100% DBT Credited") : "In Bank Queue"}
            </span>
            <span className="font-mono text-[10px] text-emerald-800 font-bold">{parcel.dbtDate || "08 Sep 2026"}</span>
          </div>
        </div>

        {/* Card C: Urgent Deadline Alert */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
            <span className="text-[10px] font-mono font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
              {isHi ? "निकटतम समय-सीमा" : "Upcoming Deadline"}
            </span>
            <span className="text-xs font-black font-mono text-rose-700">
              {urgentDeadline.daysRemaining} {isHi ? "दिन शेष" : "days left"}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-amber-800 uppercase font-bold block">{urgentDeadline.authority}</span>
            <h4 className="text-sm font-black text-slate-900 mt-0.5">{isHi ? urgentDeadline.titleHi : urgentDeadline.title}</h4>
            <p className="font-mono text-xs font-bold text-amber-950 mt-1">
              Due Date: {urgentDeadline.deadlineDate}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('deadlines')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>{isHi ? "समय-सीमा विवरण देखें" : "View Deadline & Act"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 3. Quick Action Hub */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
              Quick Navigation
            </span>
            <h3 className="text-base font-black text-slate-900">
              {isHi ? "नागरिक त्वरित सेवाएं एवं उपकरण" : "Citizen Quick Services & Portals"}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.id}
                onClick={() => onNavigateTab(qa.id)}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-3.5 rounded-xl text-left transition-all space-y-2 cursor-pointer group hover:shadow-xs"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${qa.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                    {qa.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {qa.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
