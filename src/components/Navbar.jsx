import React from 'react';
import { 
  Building2, 
  Map, 
  GitPullRequest, 
  UserCheck, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  Plus,
  ChevronDown,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { PRESET_ROLES } from './LoginModal';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser,
  onLogout,
  onOpenAuditLog,
  onOpenProposalModal 
}) {
  const roleObj = currentUser?.roleObj || PRESET_ROLES[0];
  const roleId = roleObj.id || 'MINISTRY';
  const userName = currentUser?.name || roleObj.user;

  // Master Nav Items definitions
  const allNavItems = [
    { 
      id: 'gis', 
      label: 'Home / GIS Map', 
      icon: Map, 
      roles: ['MINISTRY', 'LAO', 'SURVEYOR', 'AGENCY'] 
    },
    { 
      id: 'workflow', 
      label: 'Land Management', 
      icon: GitPullRequest,
      roles: ['MINISTRY', 'LAO', 'SURVEYOR', 'AGENCY'],
      dropdown: ['Land Identification', 'Land Verification', 'Acquisition Proposal', 'Notifications & Notices', 'Compensation Process', 'Legal & Objections', 'Approval & Acquisition', 'Land Handover', 'Project Utilization']
    },
    { 
      id: 'citizen', 
      label: 'Citizen & DBT Portal', 
      icon: UserCheck, 
      roles: ['MINISTRY', 'CITIZEN', 'LAO'] 
    },
    { 
      id: 'award', 
      label: 'Notice & Award', 
      icon: FileText, 
      roles: ['MINISTRY', 'LAO', 'CITIZEN'] 
    },
    { 
      id: 'analytics', 
      label: 'National Dashboard', 
      icon: BarChart3, 
      roles: ['MINISTRY', 'LAO', 'AGENCY'] 
    }
  ];

  // Filter allowed navigation tabs based on logged-in role
  const navItems = roleId === 'MINISTRY' 
    ? allNavItems // Full Access Superadmin sees ALL tabs
    : allNavItems.filter(item => item.roles.includes(roleId));

  // Determine action permissions
  const canSubmitProposal = ['MINISTRY', 'LAO', 'AGENCY'].includes(roleId);
  const canViewLedger = ['MINISTRY', 'LAO', 'SURVEYOR'].includes(roleId);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* 1. Main Branding Header: BHUSETU + Slogan */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: BHUSETU Title & Slogan */}
        <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab(navItems[0]?.id || 'gis')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0">
            <Building2 className="w-6 h-6 text-slate-950" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-mono">
                BHU<span className="text-amber-600">SETU</span>
              </h1>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                roleId === 'MINISTRY' 
                  ? 'bg-purple-100 text-purple-900 border-purple-300 font-mono' 
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                {roleId === 'MINISTRY' ? 'SUPERADMIN FULL ACCESS' : `${roleObj.badge}`}
              </span>
            </div>
            <p className="text-xs font-black text-amber-800 tracking-wide italic">
              "Your Land, Our Responsibility"
            </p>
          </div>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          {canSubmitProposal && (
            <button
              onClick={onOpenProposalModal}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Submit Proposal</span>
            </button>
          )}

          {/* User Profile Tag */}
          <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-[11px]">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-extrabold text-slate-900 text-[11px] leading-tight">{userName}</div>
              <div className="text-[10px] font-bold text-amber-800 leading-tight">{roleObj.title}</div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            title="Sign Out / Switch Account"
            className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs p-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Menu Bar */}
      <div className="bg-slate-100 border-t border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-extrabold whitespace-nowrap transition-all border-b-2 ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' 
                        : 'text-slate-800 hover:bg-slate-200/80 border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-700'}`} />
                    <span>{item.label}</span>
                    {item.dropdown && <ChevronDown className="w-3 h-3 text-slate-600" />}
                  </button>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div className="hidden group-hover:block absolute top-full left-0 w-64 bg-slate-900 border border-slate-800 shadow-2xl rounded-b-lg overflow-hidden z-50">
                      <div className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-2 border-b border-amber-600">
                        {item.label} Stages
                      </div>
                      {item.dropdown.map((sub, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setActiveTab(item.id)}
                          className="px-3 py-2 text-xs text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-medium cursor-pointer border-b border-slate-800/60 transition-colors"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Ledger Button (Only for authorized roles) */}
          {canViewLedger && (
            <div className="hidden lg:flex items-center py-1">
              <button 
                onClick={onOpenAuditLog}
                title="Immutable BhuStack Audit Ledger"
                className="bg-white hover:bg-slate-50 text-slate-800 text-xs px-3 py-1.5 rounded border border-slate-300 font-bold transition-colors cursor-pointer flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ledger</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
