import React, { useState } from 'react';
import { 
  Crosshair, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Navigation, 
  Bell, 
  Eye, 
  ArrowRight, 
  ChevronRight, 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  Sliders, 
  Wifi, 
  WifiOff,
  Compass,
  Play,
  Calendar,
  Layers,
  X,
  Plus
} from 'lucide-react';
import { 
  ASSIGNED_PARCELS_DATA, 
  SURVEYOR_KPIS, 
  SURVEYOR_NOTIFICATIONS 
} from '../../data/surveyorData';
import FieldSurveyMode from './FieldSurveyMode';
import SurveyRouteModal from './SurveyRouteModal';
import SurveyReportModal from './SurveyReportModal';

export default function SurveyorWorkbench({ onAdvanceStage }) {
  const [parcels, setParcels] = useState(ASSIGNED_PARCELS_DATA);
  const [selectedParcel, setSelectedParcel] = useState(ASSIGNED_PARCELS_DATA[0]);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'TODAY', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'RE_SURVEY', 'DISPUTED', 'HIGH_PRIORITY'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Field survey mode launcher
  const [isSurveyModeActive, setIsSurveyModeActive] = useState(false);
  const [activeSurveyParcel, setActiveSurveyParcel] = useState(null);

  // Modals & Drawers
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Offline and sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [offlinePackageReady, setOfflinePackageReady] = useState(false);

  // Inspector tab
  const [inspectorTab, setInspectorTab] = useState('overview'); // 'overview', 'map', 'documents', 'owner', 'timeline', 'audit'

  // Filtered parcels logic
  const filteredParcels = parcels.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      p.id.toLowerCase().includes(query) ||
      p.ulpin.toLowerCase().includes(query) ||
      p.surveyNumber.toLowerCase().includes(query) ||
      p.ownerName.toLowerCase().includes(query) ||
      p.village.toLowerCase().includes(query) ||
      p.district.toLowerCase().includes(query);

    let matchesFilter = true;
    switch(activeFilter) {
      case 'TODAY':
        matchesFilter = p.assignedToday;
        break;
      case 'PENDING':
        matchesFilter = p.surveyStatus === 'PENDING';
        break;
      case 'IN_PROGRESS':
        matchesFilter = p.surveyStatus === 'IN_PROGRESS';
        break;
      case 'COMPLETED':
        matchesFilter = p.surveyStatus === 'COMPLETED';
        break;
      case 'RE_SURVEY':
        matchesFilter = p.surveyStatus === 'RE_SURVEY';
        break;
      case 'DISPUTED':
        matchesFilter = p.surveyStatus === 'DISPUTED' || p.mismatchStatus === 'SIGNIFICANT_MISMATCH';
        break;
      case 'HIGH_PRIORITY':
        matchesFilter = p.priority === 'CRITICAL' || p.priority === 'HIGH';
        break;
      case 'ALL':
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  // Handle Starting Survey
  const handleStartSurvey = (parcelToSurvey) => {
    setActiveSurveyParcel(parcelToSurvey);
    setIsSurveyModeActive(true);
  };

  // Handle returning from survey mode with updated parcel data
  const handleUpdateParcelFromSurvey = (updatedParcel) => {
    setParcels(prev => prev.map(p => p.id === updatedParcel.id ? updatedParcel : p));
    if (selectedParcel.id === updatedParcel.id) {
      setSelectedParcel(updatedParcel);
    }
  };

  // Offline Package Download Simulation
  const handleDownloadPackage = () => {
    alert("Downloading Offline Survey Cache:\n• High-Res Cadastral Maps (Sohna Rural)\n• RoR Jamabandi Records\n• 32 Parcel Coordinates\n• Offline BHOOMISETU Ledger DB");
    setOfflinePackageReady(true);
  };

  // Sync Simulation
  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncProgress(20);
    setTimeout(() => setSyncProgress(60), 600);
    setTimeout(() => setSyncProgress(90), 1200);
    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1700);
  };

  // If in dedicated Field Survey Mode, render FieldSurveyMode component
  if (isSurveyModeActive && activeSurveyParcel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-3">
        <FieldSurveyMode 
          parcel={activeSurveyParcel}
          onBack={() => setIsSurveyModeActive(false)}
          onUpdateParcel={handleUpdateParcelFromSurvey}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-4 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 0. Official Sovereign Header Banner */}
      <div className="gov-card rounded-2xl p-5 bg-gradient-to-r from-amber-50/40 via-white to-slate-50/60 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                Field Surveyor Digital Workbench
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">
                DILRMP 3.0 Real-time DGPS Cadastral Mapping
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-mono font-bold text-emerald-700 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>CORS RTK Connected (±1.8m)</span>
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black font-mono tracking-tight text-slate-950 mt-1.5 flex items-center space-x-2">
              <span>FIELD SURVEYOR WORKBENCH & CADASTRE ENGINE</span>
            </h1>

            <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
              Logged in as <strong>Anish Kumar (Surveyor)</strong> • Tehsildar & Land Revenue Office, Sohna, Gurugram. Direct synchronization with Haryana DILRMP CORS network.
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Optimize Route Button */}
            <button
              onClick={() => setIsRouteModalOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>Optimize Field Route</span>
            </button>

            {/* Offline Package Download */}
            <button
              onClick={handleDownloadPackage}
              className={`font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer border ${
                offlinePackageReady 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>{offlinePackageReady ? 'Package Ready' : 'Download Field Package'}</span>
            </button>

            {/* Sync Now Button */}
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm shadow-amber-500/25 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl relative transition-colors cursor-pointer border border-slate-200"
              title="Surveyor Alerts"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Sync Progress Bar if Active */}
        {isSyncing && (
          <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-amber-950">
            <div className="flex justify-between font-mono font-bold">
              <span>Uploading offline field survey records...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {syncSuccess && (
          <div className="mt-3.5 pt-3 border-t border-slate-200 text-xs text-emerald-800 font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>✓ All 5 pending field survey records synchronized with State Land Ledger!</span>
          </div>
        )}
      </div>

      {/* 1. Six Primary KPI Cards Grid + Today's Progress Bar */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Assigned Today */}
          <div 
            onClick={() => setActiveFilter('TODAY')}
            className="gov-card rounded-xl p-3 bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-amber-400 transition-all"
          >
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Assigned Today</span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-0.5 block">{SURVEYOR_KPIS.assignedToday}</span>
            <span className="text-[10px] text-slate-500 font-mono">Sohna & Tauru Sector</span>
          </div>

          {/* Completed */}
          <div 
            onClick={() => setActiveFilter('COMPLETED')}
            className="gov-card rounded-xl p-3 bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-all"
          >
            <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">Completed</span>
            <span className="text-2xl font-black font-mono text-emerald-700 mt-0.5 block">{SURVEYOR_KPIS.completedToday}</span>
            <span className="text-[10px] text-slate-500 font-mono">DGPS Verified</span>
          </div>

          {/* Pending */}
          <div 
            onClick={() => setActiveFilter('PENDING')}
            className="gov-card rounded-xl p-3 bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-amber-400 transition-all"
          >
            <span className="text-[10px] font-mono uppercase text-amber-700 font-bold block">Pending</span>
            <span className="text-2xl font-black font-mono text-amber-700 mt-0.5 block">{SURVEYOR_KPIS.pendingSurveys}</span>
            <span className="text-[10px] text-slate-500 font-mono">Awaiting Inspection</span>
          </div>

          {/* Re-survey Required */}
          <div 
            onClick={() => setActiveFilter('RE_SURVEY')}
            className="gov-card rounded-xl p-3 bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-rose-400 transition-all"
          >
            <span className="text-[10px] font-mono uppercase text-rose-700 font-bold block">Re-Survey Req.</span>
            <span className="text-2xl font-black font-mono text-rose-700 mt-0.5 block">{SURVEYOR_KPIS.resurveyRequired}</span>
            <span className="text-[10px] text-slate-500 font-mono">Supervisor Returned</span>
          </div>

          {/* Boundary Disputes */}
          <div 
            onClick={() => setActiveFilter('DISPUTED')}
            className="gov-card rounded-xl p-3 bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-purple-400 transition-all"
          >
            <span className="text-[10px] font-mono uppercase text-purple-700 font-bold block">Boundary Disputes</span>
            <span className="text-2xl font-black font-mono text-purple-700 mt-0.5 block">{SURVEYOR_KPIS.boundaryDisputes}</span>
            <span className="text-[10px] text-slate-500 font-mono">Section 3C Objections</span>
          </div>

          {/* Offline Sync Pending */}
          <div 
            onClick={handleSyncNow}
            className="gov-card rounded-xl p-3 bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
          >
            <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">Offline Sync</span>
            <span className="text-2xl font-black font-mono text-blue-700 mt-0.5 block">{SURVEYOR_KPIS.offlineSyncPending}</span>
            <span className="text-[10px] text-slate-500 font-mono">Pending Upload</span>
          </div>
        </div>

        {/* Today's Progress Bar */}
        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold text-slate-900">Today's Field Target Progress:</span>
            <span className="text-slate-600 font-mono font-medium">
              <strong>{SURVEYOR_KPIS.completedToday}</strong> of <strong>{SURVEYOR_KPIS.assignedToday}</strong> parcels surveyed ({SURVEYOR_KPIS.todayProgressPercent}%)
            </span>
          </div>

          <div className="w-full sm:w-64 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${SURVEYOR_KPIS.todayProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Notifications Drawer (Toggled by Bell) */}
      {isNotificationsOpen && (
        <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <strong className="text-xs font-mono font-bold text-slate-900 uppercase">
                Field Surveyor Notifications & Action Queue
              </strong>
            </div>
            <button 
              onClick={() => setIsNotificationsOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {SURVEYOR_NOTIFICATIONS.map((n) => (
              <div key={n.id} className="py-2 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{n.title}</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Main Work Area: Assigned Parcels Table + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Filterable Master Table (8 Columns) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-3">
            
            {/* Search & Filter Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="Search Parcel ID / ULPIN / Survey No. / Owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Counter Badge */}
              <span className="text-xs font-mono font-bold text-slate-500 shrink-0 self-center">
                Showing <strong>{filteredParcels.length}</strong> of {parcels.length} Parcels
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] font-mono font-bold">
              {[
                { id: 'ALL', label: 'All Parcels' },
                { id: 'TODAY', label: "Today's Queue" },
                { id: 'PENDING', label: 'Pending' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'COMPLETED', label: 'Completed' },
                { id: 'RE_SURVEY', label: 'Re-Survey' },
                { id: 'DISPUTED', label: 'Disputes' },
                { id: 'HIGH_PRIORITY', label: 'High Priority' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === tab.id 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Data Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 font-mono text-[10px] text-slate-600 uppercase">
                  <tr>
                    <th className="p-2.5">Parcel / Survey #</th>
                    <th className="p-2.5">ULPIN & Village</th>
                    <th className="p-2.5">Owner Name</th>
                    <th className="p-2.5">Area</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Priority</th>
                    <th className="p-2.5">Deadline</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredParcels.map((p) => {
                    const isSelected = selectedParcel.id === p.id;
                    const isUrgent = p.daysRemaining <= 2;

                    return (
                      <tr 
                        key={p.id}
                        onClick={() => setSelectedParcel(p)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-amber-50/60 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Parcel ID & Survey */}
                        <td className="p-2.5">
                          <div className="font-mono font-bold text-slate-900">{p.id}</div>
                          <div className="text-[10px] font-mono text-slate-500 font-medium">#{p.surveyNumber}</div>
                        </td>

                        {/* ULPIN & Village */}
                        <td className="p-2.5">
                          <div className="font-mono text-[11px] text-slate-800">{p.ulpin}</div>
                          <div className="text-[10px] text-slate-500">{p.village}, {p.district}</div>
                        </td>

                        {/* Owner */}
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900">{p.ownerName}</div>
                          <div className="text-[10px] text-slate-500">{p.landType}</div>
                        </td>

                        {/* Area */}
                        <td className="p-2.5 font-mono">
                          <div className="font-bold text-slate-900">{p.recordedAreaHa?.toFixed(2)} Ha</div>
                          {p.surveyedAreaHa && (
                            <div className="text-[10px] text-emerald-700">DGPS: {p.surveyedAreaHa?.toFixed(2)} Ha</div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            p.surveyStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                            p.surveyStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            p.surveyStatus === 'RE_SURVEY' ? 'bg-amber-100 text-amber-900' :
                            p.surveyStatus === 'DISPUTED' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {p.surveyStatus?.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="p-2.5">
                          <span className={`text-[10px] font-mono font-bold flex items-center space-x-1 ${
                            p.priority === 'CRITICAL' ? 'text-rose-700' :
                            p.priority === 'HIGH' ? 'text-orange-700' :
                            p.priority === 'MEDIUM' ? 'text-amber-700' :
                            'text-slate-600'
                          }`}>
                            <span>{p.priority === 'CRITICAL' ? '🔴' : p.priority === 'HIGH' ? '🟠' : p.priority === 'MEDIUM' ? '🟡' : '🟢'}</span>
                            <span>{p.priority}</span>
                          </span>
                        </td>

                        {/* Deadline */}
                        <td className="p-2.5 font-mono text-[10px]">
                          <div className="text-slate-800">{p.deadline}</div>
                          {isUrgent && (
                            <span className="text-rose-600 font-bold">⚠ {p.daysRemaining}d left</span>
                          )}
                        </td>

                        {/* Action: START SURVEY CTA */}
                        <td className="p-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartSurvey(p);
                            }}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs transition-all cursor-pointer ml-auto"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>START SURVEY</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Tabbed Inspector Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-4">
            
            {/* Inspector Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {selectedParcel.id}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">Survey #{selectedParcel.surveyNumber}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-1">
                  {selectedParcel.village}, {selectedParcel.district}
                </h3>
              </div>

              {/* Start Field Survey Button */}
              <button
                onClick={() => handleStartSurvey(selectedParcel)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-3 py-2 rounded-xl flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Field Mode</span>
              </button>
            </div>

            {/* Inspector Tab Switcher */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-[10px] font-mono font-bold text-slate-600 overflow-x-auto">
              {['overview', 'survey', 'owner', 'documents', 'timeline'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInspectorTab(tab)}
                  className={`py-1.5 px-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    inspectorTab === tab ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-950'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {inspectorTab === 'overview' && (
              <div className="space-y-2.5 text-xs">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden p-3 bg-slate-50 space-y-2">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">ULPIN Bhu-Aadhaar:</span>
                    <strong className="text-slate-900 font-mono">{selectedParcel.ulpin}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Khasra / Survey #:</span>
                    <strong className="text-slate-900 font-mono">{selectedParcel.surveyNumber}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Owner Name:</span>
                    <strong className="text-slate-900 font-bold">{selectedParcel.ownerName}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Recorded Area:</span>
                    <strong className="text-slate-900 font-mono">{selectedParcel.recordedAreaHa} Ha</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Surveyed Area:</span>
                    <strong className="text-slate-900 font-mono">
                      {selectedParcel.surveyedAreaHa ? `${selectedParcel.surveyedAreaHa} Ha` : 'Pending Field Visit'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Land Classification:</span>
                    <strong className="text-slate-900">{selectedParcel.landType}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Boundary Status:</span>
                    <span className="text-emerald-700 font-bold">
                      {selectedParcel.surveyStatus === 'COMPLETED' ? '✓ Verified & Mapped' : 'Under Field Survey'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Preview Official Survey Report</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: SURVEY METRICS */}
            {inspectorTab === 'survey' && (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">GNSS Accuracy:</span>
                    <strong className="text-slate-900">{selectedParcel.gpsAccuracy || '±1.8m'}</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Satellites Locked:</span>
                    <strong className="text-slate-900">{selectedParcel.satellitesTracked || 19}</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Tolerance Variance:</span>
                    <strong className={selectedParcel.areaDifferenceHa > 0 ? 'text-amber-800' : 'text-slate-900'}>
                      {selectedParcel.areaDifferenceHa ? `${selectedParcel.areaDifferenceHa} Ha` : '0.00 Ha'}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => handleStartSurvey(selectedParcel)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open DGPS Boundary Tool</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: OWNER VERIFICATION */}
            {inspectorTab === 'owner' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Owner Name:</span>
                    <strong className="text-slate-900">{selectedParcel.ownerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Father / Husband:</span>
                    <strong className="text-slate-900">{selectedParcel.fatherHusbandName || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <strong className="text-slate-900">{selectedParcel.ownerPhone || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Signature On-Site:</span>
                    <strong className={selectedParcel.ownerVerification?.hasSignature ? 'text-emerald-700' : 'text-rose-700'}>
                      {selectedParcel.ownerVerification?.hasSignature ? '✓ Captured' : 'Pending'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DOCUMENTS */}
            {inspectorTab === 'documents' && (
              <div className="space-y-1.5 text-xs max-h-56 overflow-y-auto">
                {(selectedParcel.documents || []).map((d, idx) => (
                  <div key={idx} className="p-2 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50">
                    <div className="truncate max-w-[180px]">
                      <strong className="text-slate-900 block truncate">{d.title}</strong>
                      <span className="text-[10px] text-slate-500">{d.issuedDate}</span>
                    </div>
                    <button 
                      onClick={() => alert(`Viewing document: ${d.title}`)}
                      className="text-amber-700 font-bold hover:underline text-[10px]"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: TIMELINE */}
            {inspectorTab === 'timeline' && (
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto">
                {(selectedParcel.timeline || []).map((tl, i) => (
                  <div key={i} className="pl-3 border-l-2 border-amber-500 space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-500 block">{tl.date}</span>
                    <div className="font-bold text-slate-900">{tl.title}</div>
                    <div className="text-[10px] text-slate-600">{tl.note}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: OPTIMIZE FIELD ROUTE */}
      <SurveyRouteModal 
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSelectParcel={(pId) => {
          const target = parcels.find(p => p.id === pId);
          if (target) handleStartSurvey(target);
        }}
      />

      {/* MODAL 2: OFFICIAL SURVEY REPORT */}
      <SurveyReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        parcel={selectedParcel}
        onSubmitApproval={(pId) => alert(`Survey report submitted for ${pId}`)}
      />
    </div>
  );
}
