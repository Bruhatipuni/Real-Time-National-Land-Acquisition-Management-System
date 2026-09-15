import React, { useState, useEffect } from 'react';
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
  Bell, 
  Folder, 
  Scale,
  Activity,
  Globe,
  Clock,
  ExternalLink,
  Crosshair
} from 'lucide-react';
import { PRESET_ROLES } from './LoginModal';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser,
  onLogout,
  onOpenAuditLog,
  onOpenProposalModal,
  onOpenDocuments,
  onOpenLegal,
  onOpenNotifications
}) {
  const roleObj = currentUser?.roleObj || PRESET_ROLES[0];
  const roleId = roleObj.id || 'SUPER_ADMIN';
  const userName = currentUser?.name || roleObj.user;

  // Live time ticker for sovereign header
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + ' | ' + now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Master Nav Items definitions
  const allNavItems = [
    { 
      id: 'gis', 
      label: 'Land & GIS Map', 
      icon: Map, 
      badge: 'Live GIS',
      roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_OFFICER', 'LAND_OFFICER', 'PROJECT_OFFICER'] 
    },
    { 
      id: 'surveyor', 
      label: 'Surveyor Workbench', 
      icon: Crosshair, 
      badge: 'DGPS / RTK',
      roles: ['SUPER_ADMIN', 'LAND_OFFICER', 'STATE_ADMIN', 'DISTRICT_OFFICER'] 
    },
    { 
      id: 'workflow', 
      label: 'Statutory 10-Stage Pipeline', 
      icon: GitPullRequest,
      badge: 'RFCTLARR 2013',
      roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_OFFICER', 'LAND_OFFICER', 'FINANCE_OFFICER', 'LEGAL_OFFICER', 'PROJECT_OFFICER'],
      dropdown: [
        { num: '01', name: 'Land Identification & Khata Cadastral' },
        { num: '02', name: 'Field Survey & Verification' },
        { num: '03', name: 'Corridor Acquisition Proposal' },
        { num: '04', name: 'Sec 3A/3D Gazette Notifications' },
        { num: '05', name: 'RFCTLARR Compensation & Solatium' },
        { num: '06', name: 'Sec 3C Objections & Legal Disputes' },
        { num: '07', name: 'Sec 3G Statutory Award Approval' },
        { num: '08', name: 'Statutory Land Vesting & Acquisition' },
        { num: '09', name: 'Possession Certificate & R&R Handover' },
        { num: '10', name: 'Post-Acquisition Corridor Utilization' }
      ]
    },
    { 
      id: 'citizen', 
      label: 'Citizen & DBT Portal', 
      icon: UserCheck, 
      badge: 'PFMS Live',
      roles: ['SUPER_ADMIN', 'CITIZEN', 'DISTRICT_OFFICER', 'FINANCE_OFFICER'] 
    },
    { 
      id: 'award', 
      label: 'Notice & Award Certificate', 
      icon: FileText, 
      badge: 'e-Sign',
      roles: ['SUPER_ADMIN', 'DISTRICT_OFFICER', 'FINANCE_OFFICER', 'CITIZEN'] 
    },
    { 
      id: 'analytics', 
      label: 'National Command Center', 
      icon: BarChart3, 
      badge: 'Ministry DSS',
      roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_OFFICER', 'PROJECT_OFFICER'] 
    }
  ];

  // Filter allowed navigation tabs based on logged-in role
  const navItems = roleId === 'SUPER_ADMIN' 
    ? allNavItems 
    : allNavItems.filter(item => item.roles.includes(roleId));

  // Action permissions
  const canSubmitProposal = ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_OFFICER', 'LAND_OFFICER', 'PROJECT_OFFICER'].includes(roleId);
  const canViewLedger = ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_OFFICER', 'LAND_OFFICER', 'LEGAL_OFFICER'].includes(roleId);

  return (
    <header className="sticky top-0 z-50 shadow-md font-sans">
      {/* 0. Sovereign Indian National Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* 1. Official Government of India Sovereign Top Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ministry & Gov Identity */}
          <div className="flex items-center space-x-3 divide-x divide-slate-700">
            <div className="flex items-center space-x-1.5 font-medium">
              <span className="text-amber-400 font-bold">भारत सरकार</span>
              <span className="text-slate-500">|</span>
              <span className="text-white font-semibold tracking-wide">Government of India</span>
            </div>
            <div className="pl-3 hidden md:flex items-center space-x-2 text-slate-400">
              <span>Ministry of Rural Development</span>
              <span>•</span>
              <span>MoRTH</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-semibold">DILRMP 3.0</span>
            </div>
          </div>

          {/* Right: Real-time Gateway status & live clock */}
          <div className="flex items-center space-x-4 text-[11px]">
            {/* Live Gateway Status Beacon */}
            <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 relative">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
              </span>
              <span className="text-[10px] font-bold tracking-tight">NIC Gateway Synced</span>
            </div>

            {/* Time / Location */}
            <div className="hidden lg:flex items-center space-x-1 text-slate-400 font-mono text-[10px]">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{currentTime || 'New Delhi, India'}</span>
            </div>

            {/* Portal Language indicator */}
            <div className="flex items-center space-x-1 text-slate-400">
              <Globe className="w-3 h-3 text-slate-400" />
              <span className="text-white font-semibold">EN</span>
              <span className="text-slate-600">|</span>
              <span className="hover:text-amber-400 cursor-pointer transition-colors">हिन्दी</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Branding & Command Header */}
      <div className="gov-glass-header px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Emblem, Portal Logo & Tagline */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer group" 
            onClick={() => setActiveTab(navItems[0]?.id || 'gis')}
          >
            {/* Ashoka Gold Crest Emblem */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/25 shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-slate-950" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight font-mono text-slate-900">
                  BHU<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">SETU</span>
                </h1>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border tracking-wider uppercase font-mono ${
                  roleId === 'SUPER_ADMIN' 
                    ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 border-purple-700 shadow-xs' 
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {roleId === 'SUPER_ADMIN' ? 'CENTRAL MINISTRY' : `${roleObj.badge || roleId}`}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
                <span>National Land Acquisition & Management Portal</span>
                <span className="text-slate-300">•</span>
                <span className="italic text-amber-700">"Your Land, Our Responsibility"</span>
              </p>
            </div>
          </div>

          {/* Right: Quick Action Command Group & Officer Profile */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Document Vault Button */}
            <button
              onClick={onOpenDocuments}
              title="Statutory Document Repository"
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 text-xs px-2.5 py-2 rounded-xl border border-slate-200 hover:border-blue-300 font-semibold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Folder className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Documents</span>
            </button>

            {/* Legal Radar Button */}
            <button
              onClick={onOpenLegal}
              title="Legal Objections & Court Disputes Radar"
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-700 text-xs px-2.5 py-2 rounded-xl border border-slate-200 hover:border-rose-300 font-semibold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Scale className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Legal Radar</span>
            </button>

            {/* Notifications Center */}
            <button
              onClick={onOpenNotifications}
              title="System Alerts & Gazette Notifications"
              className="relative bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs p-2 rounded-xl border border-slate-200 hover:border-amber-300 transition-all shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                4
              </span>
            </button>

            {/* Submit Proposal Gradient CTA Button */}
            {canSubmitProposal && (
              <button
                onClick={onOpenProposalModal}
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span className="tracking-tight">New Proposal</span>
              </button>
            )}

            {/* Officer Profile Badge */}
            <div className="bg-slate-50 border border-slate-200/90 pl-2 pr-3 py-1.5 rounded-xl flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-[11px] shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-extrabold text-slate-900 text-[11px] leading-tight flex items-center space-x-1">
                  <span>{userName}</span>
                </div>
                <div className="text-[9px] font-bold text-amber-700 leading-tight">
                  {roleObj.title.split('/')[0]}
                </div>
              </div>
            </div>

            {/* Logout / Switch Account */}
            <button 
              onClick={onLogout}
              title="Sign Out / Switch Officer Profile"
              className="bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs p-2 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Government Navigation Bar & Ledger Quick Link */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30' 
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-600'}`} />
                    <span>{item.label}</span>
                    {item.dropdown && <ChevronDown className={`w-3 h-3 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />}
                  </button>

                  {/* High-definition 10-stage dropdown */}
                  {item.dropdown && (
                    <div className="hidden group-hover:block absolute top-full left-0 w-80 bg-slate-900 border border-slate-800 shadow-2xl rounded-xl overflow-hidden z-50 py-1.5 mt-0.5">
                      <div className="bg-slate-800/80 px-3 py-1.5 border-b border-slate-700/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                          Statutory Land Acquisition Workflow
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">RFCTLARR 2013</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto py-1">
                        {item.dropdown.map((sub, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setActiveTab(item.id)}
                            className="px-3 py-2 text-xs flex items-center space-x-2.5 text-slate-300 hover:bg-amber-500 hover:text-slate-950 font-medium cursor-pointer transition-colors border-b border-slate-800/40 last:border-b-0"
                          >
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 group-hover:bg-slate-950 group-hover:text-white font-bold shrink-0">
                              {sub.num}
                            </span>
                            <span className="truncate">{sub.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right: Cryptographic Immutable Ledger Shortcut */}
          {canViewLedger && (
            <div className="hidden lg:flex items-center py-1">
              <button 
                onClick={onOpenAuditLog}
                title="BhuStack SHA-256 Immutable Audit Ledger"
                className="bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>BhuStack Ledger</span>
                <span className="text-[9px] font-mono font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  SHA-256
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

