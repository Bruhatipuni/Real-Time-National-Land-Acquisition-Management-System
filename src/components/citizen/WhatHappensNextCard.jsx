import React from 'react';
import { ArrowRight, Clock, ShieldAlert, Building2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { getNextActionDetails } from './citizenData';

export default function WhatHappensNextCard({ parcel, lang = 'en', onNavigateTab }) {
  const nextInfo = getNextActionDetails(parcel.status, parcel);
  const isHi = lang === 'hi';

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">
                {isHi ? "त्वरित मार्गदर्शन" : "DECISION SUPPORT FOR LANDOWNER"}
              </span>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <span>{isHi ? "आगे क्या होगा? (अपेक्षित अगला कदम)" : "WHAT HAPPENS NEXT?"}</span>
              </h3>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHi ? nextInfo.stageTitleHi : nextInfo.stageTitle}</span>
          </div>
        </div>

        {/* 4-Box Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Box 1: Current Status */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isHi ? "वर्तमान स्थिति" : "Current Status"}
            </span>
            <p className="font-semibold text-slate-200 text-xs">
              {isHi ? nextInfo.currentStatusHi : nextInfo.currentStatus}
            </p>
          </div>

          {/* Box 2: Immediate Next Action */}
          <div className="bg-emerald-950/40 border border-emerald-600/40 p-3 rounded-xl space-y-1 md:col-span-1">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span>{isHi ? "अपेक्षित अगला कदम" : "Immediate Next Action"}</span>
            </span>
            <p className="font-bold text-white text-xs">
              {isHi ? nextInfo.nextActionHi : nextInfo.nextAction}
            </p>
          </div>

          {/* Box 3: Responsible Authority */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>{isHi ? "उत्तरदायी प्राधिकारी" : "Responsible Authority"}</span>
            </span>
            <p className="font-semibold text-slate-200 text-xs">
              {isHi ? nextInfo.responsibleAuthorityHi : nextInfo.responsibleAuthority}
            </p>
          </div>

          {/* Box 4: Estimated Timeline */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{isHi ? "अनुमानित समय सीमा" : "Estimated Timeline"}</span>
            </span>
            <p className="font-mono font-bold text-amber-300 text-xs">
              {isHi ? nextInfo.timelineHi : nextInfo.timeline}
            </p>
          </div>
        </div>

        {/* Call to action button */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {isHi 
              ? "यह पोर्टल स्वचालित रूप से आपकी भूमि अधिग्रहण प्रक्रिया के हर चरण में आपका मार्गदर्शन करता है।"
              : "This automated guide tracks every statutory milestone from notice to final DBT payment."}
          </p>

          <button
            onClick={() => onNavigateTab(nextInfo.targetTab)}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <span>{isHi ? nextInfo.actionBtnTextHi : nextInfo.actionBtnText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
