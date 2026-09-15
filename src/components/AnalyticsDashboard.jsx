import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee,
  ShieldAlert,
  Clock,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  FileCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { STATE_PERFORMANCE_STATS } from '../data/mockData';
import RealtimeParametersBar from './RealtimeParametersBar';

export default function AnalyticsDashboard({ projects, parcels }) {
  const fundData = [
    { name: '100% DBT Disbursed', value: 940, color: '#059669' },
    { name: 'Pending Bank Verification', value: 280, color: '#d97706' },
    { name: 'In Escrow (Court Disputes)', value: 130, color: '#dc2626' }
  ];

  // High risk parcels filtered
  const highRiskParcels = parcels.filter(p => (p.riskScore || 0) >= 30);

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-6 font-sans">
      {/* 1. National Dashboard Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/10 text-amber-800 border border-amber-500/30 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
              National Platform View
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-500">DILRMP 3.0 & PM Gati Shakti Compliant</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-amber-600" />
            <span>NATIONAL LAND ACQUISITION DASHBOARD</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time statutory tracking across 12,450 land parcels, 11 acquisition stages, and state infrastructure corridors.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-mono font-extrabold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live Regional Sync</span>
          </span>
        </div>
      </div>

      {/* 2. 4 National Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Land Parcels</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">12,450</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <span className="text-emerald-600 font-bold">100% ULPIN</span>
            <span>Bhu-Aadhaar mapped</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Under Active Acquisition</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2 font-mono">2,310</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <span className="text-amber-800 font-bold">Stages 01–09</span>
            <span>In active pipeline</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Pending Approval</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900 mt-2 font-mono">412</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <span className="text-purple-700 font-bold">Collector / State</span>
            <span>Award sign-off queue</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Legal Disputes / Stays</span>
            <div className="p-2 bg-red-50 text-red-700 rounded-xl">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-700 mt-2 font-mono">183</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <span className="text-red-600 font-bold">Sec 3C Objections</span>
            <span>Escrow deposit mode</span>
          </div>
        </div>
      </div>

      {/* 3. The 15 Real-Time Key Parameters Bar Component */}
      <RealtimeParametersBar projects={projects} parcels={parcels} />

      {/* 4. Decision Support & Risk Engine Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-800 rounded-xl border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Decision Support System (DSS) — Risk Scoring Engine</h3>
              <p className="text-xs text-slate-500">Automated delay risk calculation (Approval Delay +20, Legal Dispute +30, Compensation Delay +20, Document Missing +15, Deadline +15)</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
            Score Scale: 0–100 Risk Index
          </span>
        </div>

        {/* Risk Items Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parcels.map((parcel) => {
            const score = parcel.riskScore || 25;
            const isHigh = score >= 60;
            const isMed = score >= 31 && score < 60;

            return (
              <div 
                key={parcel.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isHigh 
                    ? 'bg-red-50/40 border-red-300 ring-1 ring-red-400/20' 
                    : isMed 
                    ? 'bg-amber-50/40 border-amber-300' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {parcel.landId || parcel.id}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      isHigh ? 'bg-red-100 text-red-800 border-red-300' :
                      isMed ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {isHigh ? 'HIGH RISK' : isMed ? 'MEDIUM RISK' : 'LOW RISK'} ({score}/100)
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mt-2">
                    Survey #{parcel.surveyNumber || parcel.surveyNo} ({parcel.currentOwner || parcel.ownerName})
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{parcel.village}, {parcel.district}, {parcel.state}</p>

                  <div className="mt-3 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Status:</span>
                      <strong className="font-semibold text-slate-800">{parcel.acquisitionStatus || parcel.status}</strong>
                    </div>
                    {parcel.recommendedAction && (
                      <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 text-slate-700 text-[11px]">
                        <strong className="text-amber-800 block text-[10px] uppercase">Recommended Action:</strong>
                        {parcel.recommendedAction}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>ULPIN: {parcel.ulpin}</span>
                  <span className="font-bold text-slate-700">Area: {parcel.areaHectares || parcel.area} Ha</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): State Acquisition Progress Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>State-wise Acquisition Performance Index</span>
            </h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATE_PERFORMANCE_STATS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="state" stroke="#475569" fontSize={11} fontWeight={600} />
                <YAxis stroke="#475569" fontSize={11} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="totalLands" name="Total Lands" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="activeAcquisition" name="Active Acquisition" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (5 cols): Fund Disbursement Pie Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              <span>Compensation Payout Breakdown (₹ Crores)</span>
            </h3>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fundData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
