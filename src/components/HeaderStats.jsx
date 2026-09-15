import React from 'react';
import { Layers, CheckCircle2, IndianRupee, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

export default function HeaderStats({ projects }) {
  const totalParcels = projects.reduce((acc, p) => acc + p.totalParcels, 0);
  const acquiredParcels = projects.reduce((acc, p) => acc + p.acquiredParcels, 0);
  const totalArea = projects.reduce((acc, p) => acc + p.totalAreaHa, 0);
  const acquiredArea = projects.reduce((acc, p) => acc + p.acquiredAreaHa, 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + p.budgetDisbursedCrores, 0);
  const totalAllocated = projects.reduce((acc, p) => acc + p.budgetAllocatedCrores, 0);
  const totalDisputes = projects.reduce((acc, p) => acc + p.activeDisputes, 0);

  const parcelPct = totalParcels > 0 ? Math.round((acquiredParcels / totalParcels) * 100) : 0;
  const areaPct = totalArea > 0 ? Math.round((acquiredArea / totalArea) * 100) : 0;
  const disbursedPct = totalAllocated > 0 ? Math.round((totalDisbursed / totalAllocated) * 100) : 0;

  const stats = [
    {
      title: "Parcels Tracked",
      code: "ULPIN REGISTER",
      value: totalParcels.toLocaleString('en-IN'),
      unit: "Cadastral Units",
      pct: parcelPct,
      subtext: `${acquiredParcels.toLocaleString('en-IN')} Vested & Acquired`,
      badge: `${parcelPct}% Cleared`,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: Layers,
      color: "text-amber-600",
      accentBar: "bg-gradient-to-r from-amber-500 to-amber-600",
      bg: "bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Land Acquired",
      code: "POSSESSION REGISTER",
      value: `${acquiredArea.toFixed(1)}`,
      unit: "Hectares",
      pct: areaPct,
      subtext: `Target: ${totalArea.toFixed(1)} Ha Corridor`,
      badge: `${areaPct}% Target`,
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: CheckCircle2,
      color: "text-emerald-600",
      accentBar: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      bg: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "DBT Disbursed",
      code: "PFMS RECONCILIATION",
      value: `₹${totalDisbursed.toFixed(1)}`,
      unit: "Crore INR",
      pct: disbursedPct,
      subtext: `Allocated: ₹${totalAllocated.toFixed(1)} Cr (100% Solatium)`,
      badge: "PFMS 100% Verified",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      icon: IndianRupee,
      color: "text-blue-600",
      accentBar: "bg-gradient-to-r from-blue-600 to-indigo-600",
      bg: "bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Active Objections",
      code: "SECTION 3C RADAR",
      value: totalDisputes,
      unit: "Hearing Cases",
      pct: Math.min(100, totalDisputes * 15),
      subtext: "Tribunal & High Court Disputes",
      badge: totalDisputes > 5 ? "Action Required" : "Hearing Active",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      icon: AlertTriangle,
      color: "text-rose-600",
      accentBar: "bg-gradient-to-r from-rose-500 to-red-600",
      bg: "bg-rose-500/10 border-rose-500/20"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="gov-card rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${item.accentBar}`} />

              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase">
                      {item.code}
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-0.5">
                    {item.title}
                  </h3>
                </div>

                <div className={`p-2 rounded-xl border ${item.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>

              {/* Number Value + Unit */}
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {item.value}
                </span>
                <span className="text-[11px] font-bold text-slate-600 font-mono">
                  {item.unit}
                </span>
              </div>

              {/* Micro Progress Bar */}
              <div className="mt-2.5">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${item.accentBar}`}
                    style={{ width: `${Math.min(100, Math.max(5, item.pct))}%` }}
                  />
                </div>
              </div>

              {/* Bottom Info & Status Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-600 font-medium truncate max-w-[150px]">
                  {item.subtext}
                </span>
                <span className={`font-mono font-bold px-1.5 py-0.5 rounded border text-[9px] shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

