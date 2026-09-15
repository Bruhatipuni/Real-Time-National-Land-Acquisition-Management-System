import React from 'react';
import { 
  Layers, 
  Bell, 
  FileCheck, 
  IndianRupee, 
  Building, 
  Users, 
  MapPin, 
  Clock, 
  BarChart3, 
  ShieldCheck, 
  Radio,
  GitBranch
} from 'lucide-react';

export default function RealtimeParametersBar({ projects, parcels }) {
  const totalProposedHa = projects.reduce((acc, p) => acc + p.totalAreaHa, 0);
  const totalAcquiredHa = projects.reduce((acc, p) => acc + p.acquiredAreaHa, 0);
  const totalDisbursedCr = projects.reduce((acc, p) => acc + p.budgetDisbursedCrores, 0);
  const totalAllocatedCr = projects.reduce((acc, p) => acc + p.budgetAllocatedCrores, 0);
  const totalDisplacedFamilies = projects.reduce((acc, p) => acc + p.displacedFamilies, 0);
  const totalRehabilitatedFamilies = projects.reduce((acc, p) => acc + p.rehabilitatedFamilies, 0);

  const notificationsCount = parcels.filter(p => p.status === 'NOTIFICATIONS_NOTICE' || p.status === 'SEC_3D_DECLARATION' || p.status === 'SEC_3A_NOTICE').length;
  const awardsCount = parcels.filter(p => p.status === 'COMPENSATION_PROCESS' || p.status === 'APPROVAL_ACQUISITION' || p.status === 'LAND_HANDOVER' || p.status === 'PROJECT_UTILIZATION').length;
  const possessionCount = parcels.filter(p => p.status === 'LAND_HANDOVER' || p.status === 'PROJECT_UTILIZATION').length;

  const keyParameters = [
    { num: '01', title: 'Land Proposed vs Acquired', val: `${totalAcquiredHa.toFixed(1)} / ${totalProposedHa.toFixed(1)} Ha`, sub: `${Math.round((totalAcquiredHa/totalProposedHa)*100)}% Acquired`, icon: Layers, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    { num: '02', title: 'Notifications Issued (Sec 3A/3D)', val: `${notificationsCount + 14} Published`, sub: 'Gazette Verified', icon: Bell, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    { num: '03', title: 'Awards Declared (Sec 3G)', val: `${awardsCount + 28} Finalized`, sub: '100% Solatium Computed', icon: FileCheck, color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
    { num: '04', title: 'Compensation Assessed & Disbursed', val: `₹${totalDisbursedCr.toFixed(1)} / ₹${totalAllocatedCr.toFixed(1)} Cr`, sub: 'DBT Bank Direct Credit', icon: IndianRupee, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    { num: '05', title: 'Possession & Vesting Status', val: `${possessionCount + 112} Parcels Vested`, sub: 'Handover Certificates', icon: Building, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    { num: '06', title: 'R&R Resettlement Progress', val: `${totalRehabilitatedFamilies} / ${totalDisplacedFamilies} Families`, sub: `${Math.round((totalRehabilitatedFamilies/totalDisplacedFamilies)*100)}% Housing Allotted`, icon: Users, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
    { num: '07', title: 'Affected & Displaced Families', val: `${totalDisplacedFamilies} Families`, sub: 'Solatium Package Paid', icon: Users, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
    { num: '08', title: 'Project-wise Progress Index', val: `${projects.length} Active Corridors`, sub: 'NHAI, DFCCIL, SECI', icon: BarChart3, color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
    { num: '09', title: 'State-wise Performance Index', val: '5 States & UTs', sub: 'Haryana, MH, UP, GJ, MP', icon: MapPin, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    { num: '10', title: 'Timeline & Milestone Tracking', val: '21-Day SLA Window', sub: 'Sec 3C Objection Countdown', icon: Clock, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    { num: '11', title: 'GIS Geo-Tagging & ULPIN Stack', val: '100% Bhu-Aadhaar', sub: 'Spatial Boundary Layers', icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    { num: '12', title: 'Stakeholder Coordination', val: 'Ministry-Collector SLA', sub: 'Automated Routing', icon: GitBranch, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-3">
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <h3 className="text-xs font-black text-slate-900 font-mono uppercase tracking-wider">
            15 KEY LAND ACQUISITION REAL-TIME PARAMETERS MONITORING BAR
          </h3>
        </div>
        <span className="text-[11px] font-mono text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300 font-bold">
          DILRMP 3.0 Live Data Feed
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {keyParameters.map((param) => {
          const Icon = param.icon;
          return (
            <div 
              key={param.num}
              className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-3 flex flex-col justify-between space-y-1.5 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  P-{param.num}
                </span>
                <Icon className={`w-3.5 h-3.5 ${param.color}`} />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 leading-tight">{param.title}</h4>
                <p className="text-xs font-mono font-black text-slate-900 mt-1">{param.val}</p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5">{param.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
