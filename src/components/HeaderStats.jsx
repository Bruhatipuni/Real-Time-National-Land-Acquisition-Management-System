import React from 'react';
import { Layers, CheckCircle2, IndianRupee, AlertTriangle } from 'lucide-react';

export default function HeaderStats({ projects }) {
  const totalParcels = projects.reduce((acc, p) => acc + p.totalParcels, 0);
  const acquiredParcels = projects.reduce((acc, p) => acc + p.acquiredParcels, 0);
  const totalArea = projects.reduce((acc, p) => acc + p.totalAreaHa, 0);
  const acquiredArea = projects.reduce((acc, p) => acc + p.acquiredAreaHa, 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + p.budgetDisbursedCrores, 0);
  const totalDisputes = projects.reduce((acc, p) => acc + p.activeDisputes, 0);

  const stats = [
    {
      title: "Parcels Tracked",
      value: totalParcels.toLocaleString('en-IN'),
      subtext: `${acquiredParcels} Acquired (${Math.round((acquiredParcels/totalParcels)*100)}%)`,
      icon: Layers,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200"
    },
    {
      title: "Land Acquired",
      value: `${acquiredArea.toFixed(1)} Ha`,
      subtext: `Target: ${totalArea.toFixed(1)} Ha`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200"
    },
    {
      title: "DBT Disbursed",
      value: `₹${totalDisbursed.toFixed(1)} Cr`,
      subtext: "100% PFMS Verified",
      icon: IndianRupee,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200"
    },
    {
      title: "Active Objections",
      value: totalDisputes,
      subtext: "Sec 3C Dispute Radar",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-200"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all"
          >
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">{item.title}</span>
              <div className="text-lg font-black text-slate-900 font-mono tracking-tight mt-0.5">{item.value}</div>
              <div className="text-[10px] font-medium text-slate-600 mt-0.5">{item.subtext}</div>
            </div>
            <div className={`p-2.5 rounded-xl border ${item.bg}`}>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
