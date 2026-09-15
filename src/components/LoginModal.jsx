import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Compass, 
  Building, 
  Lock, 
  Key, 
  CheckCircle2,
  X,
  User,
  ArrowRight
} from 'lucide-react';

export const PRESET_ROLES = [
  {
    id: 'MINISTRY',
    title: 'Central Ministry Admin',
    department: 'Ministry of Rural Development & MoRTH',
    user: 'Dr. Rajesh Sharma (Joint Secretary)',
    icon: Building2,
    badge: 'FULL SYSTEM ACCESS',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    description: 'National overview, project portfolio approval, state heatmaps, fund allocation & policy decision support.'
  },
  {
    id: 'LAO',
    title: 'Land Acquisition Officer (LAO)',
    department: 'Office of District Collector, Gurugram',
    user: 'Shri Vikramaditya Singh (IAS / LAO)',
    icon: ShieldCheck,
    badge: 'STATUTORY AUTHORITY',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Section 3C objection hearings, Section 3G solatium award determination, gazette notices, and possession orders.'
  },
  {
    id: 'SURVEYOR',
    title: 'Field Surveyor & GIS Nodal',
    department: 'Survey of India / District Nodal',
    user: 'Anish Kumar (Senior Surveyor)',
    icon: Compass,
    badge: 'FIELD INSPECTOR',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'ULPIN Bhu-Aadhaar geo-tagging, plot boundary verification, orthomosaic drone video upload, and encumbrance checks.'
  },
  {
    id: 'CITIZEN',
    title: 'Citizen / Displaced Landowner',
    department: 'Public Citizen Portal',
    user: 'Rameshwar Singh Yadav (Landowner)',
    icon: UserCheck,
    badge: 'PUBLIC ACCESS',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Check land status, view LARR 2013 solatium calculation, track DBT bank payouts, and file Section 3C objections.'
  },
  {
    id: 'AGENCY',
    title: 'Implementing Project Agency',
    department: 'National Highways Authority of India (NHAI)',
    user: 'Er. Meenakshi Sundaram (Chief Engineer)',
    icon: Building,
    badge: 'PROPOSER & EXECUTOR',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    description: 'Submit land acquisition proposals, route alignment optimization requests, land handover taking, and project utilization tracking.'
  }
];

export default function LoginModal({ isOpen, onClose, onSelectRole, currentRole }) {
  const [selectedRole, setSelectedRole] = useState(currentRole || 'MINISTRY');

  if (!isOpen) return null;

  const handleLogin = (roleId) => {
    const roleObj = PRESET_ROLES.find(r => r.id === roleId);
    onSelectRole(roleObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-white font-mono tracking-tight">
                BHU-SETU NATIONAL AUTHENTICATION & ROLE GATEWAY
              </h3>
              <p className="text-xs text-slate-400">Select a Role Persona to access customized RBAC views & statutory workflows</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {PRESET_ROLES.map((role) => {
            const Icon = role.icon;
            const isCurrent = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative ${
                  isCurrent 
                    ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/20 shadow-lg' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-white">{role.title}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-300 pl-1">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <User className="w-3 h-3 text-slate-500" />
                    <span className="font-semibold text-amber-300">{role.user}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{role.description}</p>
                </div>

                {isCurrent && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Login Action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Encrypted OAuth2 / MeriPehchaan National Single Sign-On</span>
          </div>
          <button
            onClick={() => handleLogin(selectedRole)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Authenticate & Launch Role Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
