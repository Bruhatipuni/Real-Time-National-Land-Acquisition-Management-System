import React from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  AlertCircle 
} from 'lucide-react';
import { CITIZEN_DEADLINES } from './citizenData';

export default function ImportantDeadlines({ parcel, lang = 'en', onNavigateTab }) {
  const isHi = lang === 'hi';

  const getPriorityStyle = (priority, status) => {
    if (status === 'COMPLETED') {
      return {
        badge: isHi ? 'पूर्ण' : 'COMPLETED',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cardClass: 'border-slate-200 bg-slate-50/60'
      };
    }
    if (priority === 'URGENT') {
      return {
        badge: isHi ? 'अति महत्वपूर्ण / अंतिम तिथि निकट' : 'URGENT DEADLINE',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        cardClass: 'border-rose-300 bg-rose-50/20 shadow-xs'
      };
    }
    return {
      badge: isHi ? 'निर्धारित' : 'SCHEDULED',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      cardClass: 'border-slate-200 bg-white shadow-xs'
    };
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "महत्वपूर्ण तिथियां एवं वैधानिक समय-सीमाएं" : "IMPORTANT DATES & STATUTORY DEADLINES"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "कार्रवाई-उन्मुख अनुस्मारक: आपत्ति दर्ज करने की समय-सीमा, सुनवाई की तिथि और बैंक सत्यापन।"
                : "Action-oriented calendar: Stay informed on statutory objection periods, hearing dates, and handover deadlines."}
            </p>
          </div>
        </div>
      </div>

      {/* Deadlines Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CITIZEN_DEADLINES.map((dl) => {
          const style = getPriorityStyle(dl.priority, dl.status);
          const isCompleted = dl.status === 'COMPLETED';

          return (
            <div 
              key={dl.id}
              className={`border rounded-2xl p-5 space-y-4 transition-all ${style.cardClass}`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${style.badgeClass}`}>
                    {style.badge}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 pt-1">
                    {isHi ? dl.titleHi : dl.title}
                  </h3>
                </div>

                {!isCompleted ? (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black font-mono text-rose-700 bg-rose-100/80 px-2 py-1 rounded-lg border border-rose-200">
                      {dl.daysRemaining} {isHi ? "दिन शेष" : "days left"}
                    </span>
                  </div>
                ) : (
                  <div className="text-right shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                  </div>
                )}
              </div>

              {/* Deadline Date Box */}
              <div className="bg-white/80 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="font-bold">{isHi ? "निर्धारित तिथि:" : "Scheduled Date:"}</span>
                </div>
                <span className="font-black text-slate-900 text-sm">{dl.deadlineDate}</span>
              </div>

              {/* Action Required & Authority */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{isHi ? "अपेक्षित कार्रवाई:" : "Action Required:"}</span>
                  <strong className="text-slate-900">{isHi ? dl.actionRequiredHi : dl.actionRequired}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{isHi ? "प्राधिकारी:" : "Authority:"}</span>
                  <span className="truncate max-w-[200px]">{dl.authority}</span>
                </div>
              </div>

              {/* Action CTA Button */}
              {!isCompleted && (
                <div className="pt-2 border-t border-slate-200/80">
                  <button
                    onClick={() => onNavigateTab('legal')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>{isHi ? "आवश्यक कार्रवाई करें" : "Take Required Action"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
