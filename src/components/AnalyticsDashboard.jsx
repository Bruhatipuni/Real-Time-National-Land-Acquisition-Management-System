import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee 
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <span>National Real-Time Analytics & Monitoring Dashboard</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium">State performance heatmaps, DBT fund disbursement, and statutory parameters tracking</p>
        </div>
        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-mono font-extrabold px-3 py-1 rounded-full hidden sm:inline">
          DILRMP 3.0 Live Feed
        </span>
      </div>

      {/* 15 Real-time Key Land Acquisition Parameters Section */}
      <RealtimeParametersBar projects={projects} parcels={parcels} />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): State Acquisition Progress Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>State-wise Acquisition Target vs Progress (Hectares)</span>
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
                <Bar dataKey="targetHa" name="Target Land (Ha)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="acquiredHa" name="Acquired Land (Ha)" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (5 cols): Fund Disbursement Pie Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
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
