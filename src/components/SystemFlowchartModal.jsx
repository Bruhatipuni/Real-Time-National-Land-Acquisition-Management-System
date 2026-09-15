import React from 'react';
import { 
  GitPullRequest, 
  X, 
  ArrowDown, 
  Lock, 
  Users, 
  BarChart3, 
  Layers, 
  MapPin, 
  FileCheck, 
  Send, 
  Bell, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  Construction,
  ExternalLink
} from 'lucide-react';

export const SYSTEM_WORKFLOW_NODES = [
  { id: 'auth', title: '1. LOGIN / AUTH', icon: Lock, color: 'border-purple-500 bg-purple-500/10 text-purple-300', desc: 'Secure OAuth2 / MeriPehchaan Citizen & Official Login Gateway' },
  { id: 'rbac', title: '2. ROLE-BASED ACCESS (RBAC)', icon: Users, color: 'border-blue-500 bg-blue-500/10 text-blue-300', desc: 'Ministry, District Collector (LAO), Field Surveyor, Landowner, Project Agency' },
  { id: 'dashboard', title: '3. NATIONAL DASHBOARD', icon: BarChart3, color: 'border-amber-500 bg-amber-500/10 text-amber-300', desc: 'High-level KPI statistics, state acquisition heatmaps & fund disbursement' },
  { id: 'land_management', title: '4. LAND MANAGEMENT LIFECYCLE', icon: Layers, color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', desc: 'End-to-End 9-Stage Statutory Acquisition & Project Utilization Engine' }
];

export const STAGE_NODES = [
  { id: 'LAND_IDENTIFICATION', step: '01', title: 'Land Identification', icon: MapPin, desc: 'Geo-tagging, Survey plot boundary mapping, ULPIN Bhu-Aadhaar assignment', color: 'border-purple-500/40 bg-purple-950/40 text-purple-300' },
  { id: 'LAND_VERIFICATION', step: '02', title: 'Land Verification', icon: FileCheck, desc: 'Encumbrance check, Khata record verification, Aadhaar title authentication', color: 'border-blue-500/40 bg-blue-950/40 text-blue-300' },
  { id: 'ACQUISITION_PROPOSAL', step: '03', title: 'Acquisition Proposal', icon: Send, desc: 'Implementing Agency proposal submission (NHAI, Railways, Coal)', color: 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300' },
  { id: 'NOTIFICATIONS_NOTICE', step: '04', title: 'Notifications / Stakeholder Notice', icon: Bell, desc: 'Section 3A Gazette publication & public stakeholder notices', color: 'border-amber-500/40 bg-amber-950/40 text-amber-300' },
  { id: 'COMPENSATION_PROCESS', step: '05', title: 'Compensation Process', icon: IndianRupee, desc: 'RFCTLARR 2013 solatium calculation (100% solatium) & DBT bank payout', color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300' },
  { id: 'LEGAL_OBJECTIONS', step: '06', title: 'Legal / Objections', icon: AlertTriangle, desc: 'Section 3C public objection hearings, court stay tracking & dispute radar', color: 'border-rose-500/40 bg-rose-950/40 text-rose-300' },
  { id: 'APPROVAL_ACQUISITION', step: '07', title: 'Approval / Acquisition', icon: CheckCircle2, desc: 'Section 3G award approval & vesting order declaration', color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300' },
  { id: 'LAND_HANDOVER', step: '08', title: 'Land Handover', icon: Building, desc: 'Possession certificate issuance & Rehabilitation & Resettlement (R&R)', color: 'border-orange-500/40 bg-orange-950/40 text-orange-300' },
  { id: 'PROJECT_UTILIZATION', step: '09', title: 'Project Utilization', icon: Construction, desc: 'Corridor construction tracking & post-acquisition asset monitoring', color: 'border-green-500/40 bg-green-950/40 text-green-300' }
];

export default function SystemFlowchartModal({ isOpen, onClose, onNavigateNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-mono tracking-tight">
                NATIONAL LAND ACQUISITION SYSTEM ARCHITECTURE & FLOWCHART
              </h3>
              <p className="text-xs text-slate-400">Statutory Land Lifecycle & Role-Based Decision Flow</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Flowchart Stack */}
        <div className="flex flex-col items-center space-y-3 py-2">
          
          {/* Top 4 System Nodes */}
          {SYSTEM_WORKFLOW_NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={node.id}>
                <div 
                  onClick={() => {
                    onNavigateNode(node.id);
                    onClose();
                  }}
                  className={`w-full max-w-lg p-3.5 rounded-xl border ${node.color} flex items-center justify-between hover:scale-[1.02] transition-all cursor-pointer shadow-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold font-mono tracking-wide">{node.title}</h4>
                      <p className="text-[11px] text-slate-300">{node.desc}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <ArrowDown className="w-4 h-4 text-slate-500 animate-bounce" />
              </React.Fragment>
            );
          })}

          {/* 9 Land Management Stage Sub-nodes */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                STAGE-BY-STAGE LAND MANAGEMENT LIFECYCLE (9 STAGES)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {STAGE_NODES.map((stg) => {
                const Icon = stg.icon;
                return (
                  <div
                    key={stg.id}
                    onClick={() => {
                      onNavigateNode('workflow', stg.id);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border ${stg.color} flex flex-col justify-between space-y-2 hover:border-amber-400 transition-all cursor-pointer shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Step {stg.step}</span>
                      <Icon className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{stg.title}</h5>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{stg.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Click any workflow node above to navigate directly to its module</span>
          <button 
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg"
          >
            Close Flowchart
          </button>
        </div>
      </div>
    </div>
  );
}
