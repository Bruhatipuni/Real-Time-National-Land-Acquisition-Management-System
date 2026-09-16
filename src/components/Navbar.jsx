import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Building,
  Map, 
  Compass, 
  GitPullRequest, 
  UserCheck, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  User, 
  Bell, 
  Folder, 
  Scale, 
  Users, 
  Clock, 
  Globe 
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
  onOpenNotifications,
  onOpenRnRFamilies
}) {
  const roleObj = currentUser?.roleObj || {
    id: 'LAND_OFFICER',
    title: 'Field Surveyor & GIS Nodal',
    user: 'Anish Kumar (Senior Surveyor)',
    badge: 'FIELD INSPECTOR'
  };

  const isMunicipalOfficer = roleObj?.id === 'MUNICIPAL_OFFICER';

  const userName = currentUser?.name || roleObj.user || 'Anish Kumar (Senior Surveyor)';
  const userSubtitle = roleObj.title || 'Field Surveyor & GIS Nodal';

  // Live time ticker
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

  return (
    <header className="sticky top-0 z-50 shadow-md font-sans">
      {/* 0. Sovereign Indian National Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* 1. Official Sovereign Top Strip */}
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
            <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 relative">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
              </span>
              <span className="text-[10px] font-bold tracking-tight">NIC Gateway Synced</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1 text-slate-400 font-mono text-[10px]">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{currentTime || 'New Delhi, India'}</span>
            </div>

            <div className="flex items-center space-x-1 text-slate-400">
              <Globe className="w-3 h-3 text-slate-400" />
              <span className="text-white font-semibold">EN</span>
              <span className="text-slate-600">|</span>
              <span className="hover:text-amber-400 cursor-pointer transition-colors">हिन्दी</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Branding & Command Header (Matches Screenshot 1 & 2) */}
      <div className="gov-glass-header px-4 py-2 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Logo + FIELD INSPECTOR + Tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab(isMunicipalOfficer ? 'municipal' : 'gis')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black font-mono tracking-tight text-slate-950">
                  BHU<span className="text-amber-600">SETU</span>
                </h1>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-md font-mono uppercase tracking-wider shadow-2xs">
                  {roleObj.badge || 'FIELD INSPECTOR'}
                </span>
              </div>
              <p className="text-xs font-bold text-amber-700 italic leading-tight">
                "Your Land, Our Responsibility"
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* R&R Families Button */}
            <button
              onClick={onOpenRnRFamilies}
              title="Rehabilitation & Resettlement Families Registry"
              className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-xl border border-purple-200 font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>R&amp;R Families</span>
            </button>

            {/* Notifications with Badge '3' */}
            <button
              onClick={onOpenNotifications}
              title="Notifications Center"
              className="relative bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            {/* Profile Badge: Anish Kumar (Senior Surveyor) */}
            <div className="bg-slate-50 border border-slate-200 pl-2 pr-3.5 py-1 rounded-xl flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-slate-900 text-[11px] leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] font-bold text-amber-700 leading-tight">
                  {userSubtitle}
                </div>
              </div>
            </div>

            {/* Logout Icon */}
            <button
              onClick={onLogout}
              title="Switch Officer Profile / Sign Out"
              className="bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 p-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Navigation Bar (Matches Screenshot 1 & 2) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Main Navigation Tabs */}
          <nav className="flex items-center space-x-1.5 py-1 overflow-x-auto">
            {/* 1. Home / GIS Map */}
            <button
              onClick={() => setActiveTab('gis')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'gis'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Map className={`w-3.5 h-3.5 ${activeTab === 'gis' ? 'text-slate-950' : 'text-amber-600'}`} />
              <span>Home / GIS Map</span>
            </button>

            {/* 2. Field Survey & Demarcation (Dropdown) */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('survey')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'survey' || activeTab === 'disputes'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Compass className={`w-3.5 h-3.5 ${activeTab === 'survey' ? 'text-slate-950' : 'text-amber-600'}`} />
                <span>Field Survey & Demarcation</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              <div className="hidden group-hover:block absolute top-full left-0 w-72 bg-slate-900 border border-slate-800 shadow-2xl rounded-xl overflow-hidden z-50 py-1.5 mt-0.5">
                <div 
                  onClick={() => setActiveTab('survey')}
                  className="px-3.5 py-2 text-xs flex items-center space-x-2 text-slate-200 hover:bg-amber-500 hover:text-slate-950 cursor-pointer font-medium transition-colors"
                >
                  <Map className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Project Acquisition Parcels</span>
                </div>
                <div 
                  onClick={() => setActiveTab('disputes')}
                  className="px-3.5 py-2 text-xs flex items-center space-x-2 text-slate-200 hover:bg-amber-500 hover:text-slate-950 cursor-pointer font-medium transition-colors"
                >
                  <Scale className="w-3.5 h-3.5 text-rose-400" />
                  <span>2. Assigned Private Land Disputes</span>
                </div>
              </div>
            </div>

            {/* 3. Route Simulator */}
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'simulator' ? 'text-slate-950' : 'text-amber-600'}`} />
              <span>Route Simulator</span>
            </button>

            {/* 4. Municipal Property Verification - Strictly visible ONLY for Municipal Officer */}
            {isMunicipalOfficer && (
              <button
                onClick={() => setActiveTab('municipal')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'municipal'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Building className={`w-3.5 h-3.5 ${activeTab === 'municipal' ? 'text-slate-950' : 'text-amber-600'}`} />
                <span>Municipal Property Verification</span>
              </button>
            )}

            {/* Additional Modules Dropdown (To preserve existing features) */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <span>More Modules</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="hidden group-hover:block absolute top-full left-0 w-64 bg-slate-900 border border-slate-800 shadow-2xl rounded-xl overflow-hidden z-50 py-1 mt-0.5">
                <div 
                  onClick={() => setActiveTab('workflow')}
                  className={`px-3 py-2 text-xs flex items-center space-x-2 text-slate-300 hover:bg-slate-800 cursor-pointer ${activeTab === 'workflow' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-amber-500" />
                  <span>Statutory 10-Stage Pipeline</span>
                </div>
                <div 
                  onClick={() => setActiveTab('citizen')}
                  className={`px-3 py-2 text-xs flex items-center space-x-2 text-slate-300 hover:bg-slate-800 cursor-pointer ${activeTab === 'citizen' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Citizen &amp; DBT Portal</span>
                </div>
                <div 
                  onClick={() => setActiveTab('award')}
                  className={`px-3 py-2 text-xs flex items-center space-x-2 text-slate-300 hover:bg-slate-800 cursor-pointer ${activeTab === 'award' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Notice &amp; Award Certificate</span>
                </div>
                <div 
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 text-xs flex items-center space-x-2 text-slate-300 hover:bg-slate-800 cursor-pointer ${activeTab === 'analytics' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>National Command Center</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Right: [Ledger] Button (Matches Screenshot 1 & 2) */}
          <div className="flex items-center py-1">
            <button
              onClick={onOpenAuditLog}
              title="BhuStack SHA-256 Immutable Audit Ledger"
              className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ledger</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
