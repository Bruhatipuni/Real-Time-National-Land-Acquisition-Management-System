import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Map, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  IndianRupee, 
  Scale, 
  BarChart3, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  FileText, 
  ChevronRight, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Sparkles, 
  ExternalLink, 
  X, 
  Folder, 
  Bell, 
  BrainCircuit, 
  Compass, 
  ShieldCheck,
  Check,
  Radio,
  FileCheck,
  MapPin,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  AlertCircle
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
  Cell,
  CartesianGrid
} from 'recharts';
import { 
  PROJECTS_DATA, 
  PARCELS_DATA, 
  STAGES_LIST, 
  NATIONAL_COMMAND_KPIS, 
  CRITICAL_CASES_DATA, 
  BOTTLENECK_ANALYTICS_DATA, 
  DETAILED_STATE_STATS, 
  COMPENSATION_ANALYTICS_DATA, 
  MINISTRY_DECISION_INSIGHTS, 
  RECENT_AUDIT_LOGS,
  LEGAL_CASES_DATA,
  NOTIFICATIONS_DATA 
} from '../data/mockData';
import { calculateAcquisitionRisk } from '../utils/riskScoringEngine';
import { exportToCSV, generateMinistryPDFReport } from '../utils/reportGenerator';
import { formatINR } from '../utils/compensationEngine';
import ProjectDetailsView from './ProjectDetailsView';

export default function CentralMinistryCommandCenter({ projects = PROJECTS_DATA, parcels = PARCELS_DATA }) {
  // Navigation sub-view state
  const [activeSection, setActiveSection] = useState('overview'); // overview, map, lifecycle, critical, risk, bottlenecks, states, projects, compensation, legal, dss, reports, notifications, audit
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  
  // Data freshness & refresh
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Global search state
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  // Map state
  const [selectedMapState, setSelectedMapState] = useState('Haryana');
  const [selectedMapProject, setSelectedMapProject] = useState(projects[0]);
  const [selectedParcelDetail, setSelectedParcelDetail] = useState(parcels[0]);
  const [isParcelDrawerOpen, setIsParcelDrawerOpen] = useState(false);

  // Critical cases severity filter
  const [criticalSeverityFilter, setCriticalSeverityFilter] = useState('ALL');
  const [selectedCriticalCase, setSelectedCriticalCase] = useState(null);

  // Projects table filters
  const [projectStateFilter, setProjectStateFilter] = useState('ALL');
  const [projectRiskFilter, setProjectRiskFilter] = useState('ALL');
  const [projectSearch, setProjectSearch] = useState('');

  // State comparison multi-select
  const [comparedStates, setComparedStates] = useState(['Haryana', 'Maharashtra', 'Uttar Pradesh']);

  // Notifications state
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  // Report generator modal state
  const [selectedReportType, setSelectedReportType] = useState('NATIONAL_SUMMARY');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Manual Refresh action
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 600);
  };

  // Categorized Global Search Results
  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return null;
    const query = globalSearch.toLowerCase();
    
    const matchedProjects = projects.filter(p => 
      p.id.toLowerCase().includes(query) || 
      p.name.toLowerCase().includes(query) || 
      p.state.toLowerCase().includes(query) ||
      p.districts.some(d => d.toLowerCase().includes(query))
    );

    const matchedParcels = parcels.filter(p => 
      p.id.toLowerCase().includes(query) || 
      p.ulpin.toLowerCase().includes(query) || 
      (p.surveyNumber || '').toLowerCase().includes(query) ||
      p.state.toLowerCase().includes(query) ||
      p.district.toLowerCase().includes(query)
    );

    const matchedCases = CRITICAL_CASES_DATA.filter(c =>
      c.caseId.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.district.toLowerCase().includes(query)
    );

    return {
      projects: matchedProjects,
      parcels: matchedParcels,
      cases: matchedCases,
      totalCount: matchedProjects.length + matchedParcels.length + matchedCases.length
    };
  }, [globalSearch, projects, parcels]);

  // Dynamic state metrics for map drill-down
  const activeStateMetrics = useMemo(() => {
    const found = DETAILED_STATE_STATS.find(s => s.state.toLowerCase() === selectedMapState.toLowerCase());
    if (found) return found;
    return DETAILED_STATE_STATS[0];
  }, [selectedMapState]);

  // State projects
  const stateProjects = useMemo(() => {
    return projects.filter(p => p.state.toLowerCase() === selectedMapState.toLowerCase());
  }, [projects, selectedMapState]);

  // Filtered Critical Cases
  const filteredCriticalCases = useMemo(() => {
    if (criticalSeverityFilter === 'ALL') return CRITICAL_CASES_DATA;
    return CRITICAL_CASES_DATA.filter(c => c.severity.toUpperCase() === criticalSeverityFilter.toUpperCase());
  }, [criticalSeverityFilter]);

  // Filtered Projects for Master Table
  const filteredProjectsList = useMemo(() => {
    return projects.filter(p => {
      const matchState = projectStateFilter === 'ALL' || p.state === projectStateFilter;
      const matchRisk = projectRiskFilter === 'ALL' || p.riskTier === projectRiskFilter;
      const matchQuery = p.name.toLowerCase().includes(projectSearch.toLowerCase()) || 
                         p.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
                         p.agency.toLowerCase().includes(projectSearch.toLowerCase());
      return matchState && matchRisk && matchQuery;
    });
  }, [projects, projectStateFilter, projectRiskFilter, projectSearch]);

  // Sub-navigation Tabs Config
  const NAV_SECTIONS = [
    { id: 'overview', label: 'Command Dashboard', icon: Building2 },
    { id: 'map', label: 'India GIS Map', icon: Map },
    { id: 'projects', label: 'National Projects', icon: BarChart3 },
    { id: 'lifecycle', label: 'Lifecycle Tracker', icon: Clock },
    { id: 'critical', label: 'Ministry Attention', icon: AlertTriangle, badge: '6 Actionable' },
    { id: 'risk', label: 'Risk Intelligence', icon: BrainCircuit },
    { id: 'bottlenecks', label: 'Bottleneck Analytics', icon: Layers },
    { id: 'states', label: 'State Benchmarking', icon: MapPin },
    { id: 'compensation', label: 'Compensation & DBT', icon: IndianRupee },
    { id: 'legal', label: 'Legal Disputes', icon: Scale },
    { id: 'dss', label: 'Decision Support', icon: Sparkles },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'notifications', label: 'Smart Alerts', icon: Bell, badge: '4' },
    { id: 'audit', label: 'Admin Audit Trail', icon: ShieldCheck }
  ];

  // Report download handler
  const handleDownloadReport = (type) => {
    if (type === 'NATIONAL_SUMMARY') {
      generateMinistryPDFReport({
        title: 'National Land Acquisition Master Summary',
        subtitle: 'Ministry of Rural Development & MoRTH • Government of India',
        stats: [
          { label: 'Total Corridors', value: projects.length },
          { label: 'Total Area Acquired', value: '2,895.7 Ha' },
          { label: 'Compensation Paid', value: '₹29,516 Cr' },
          { label: 'Active Objections', value: '64 Cases' }
        ],
        tableHeaders: ['Project ID', 'Corridor Name', 'State', 'Acquired Area', 'Budget (Cr)', 'Status'],
        tableRows: projects.map(p => [p.id, p.name, p.state, `${p.acquiredAreaHa} Ha`, `₹${p.budgetAllocatedCrores}`, p.status]),
        filename: 'National_Acquisition_Summary.pdf'
      });
    } else if (type === 'STATE_PERFORMANCE') {
      generateMinistryPDFReport({
        title: 'State Land Acquisition Performance Report',
        subtitle: 'DILRMP 3.0 Inter-State Benchmarking Dossier',
        stats: [
          { label: 'States Ranked', value: DETAILED_STATE_STATS.length },
          { label: 'Top Performer', value: 'Madhya Pradesh (96%)' },
          { label: 'Attention Required', value: 'Maharashtra (67.9%)' },
          { label: 'National Average SLA', value: '12.4 Months' }
        ],
        tableHeaders: ['State', 'Total Projects', 'Completed', 'Delayed', 'High Risk', 'Completion %'],
        tableRows: DETAILED_STATE_STATS.map(s => [s.state, s.totalProjects, s.completed, s.delayed, s.highRisk, `${s.completionRate}%`]),
        filename: 'State_Performance_Report.pdf'
      });
    } else if (type === 'COMPENSATION_PFMS') {
      generateMinistryPDFReport({
        title: 'National Solatium & DBT Disbursal Audit Report',
        subtitle: 'RFCTLARR 2013 Statutory Compliance Matrix',
        stats: [
          { label: 'Allocated Budget', value: `₹${COMPENSATION_ANALYTICS_DATA.totalAllocatedCr} Cr` },
          { label: 'Disbursed (DBT)', value: `₹${COMPENSATION_ANALYTICS_DATA.totalDisbursedCr} Cr` },
          { label: 'Beneficiaries Paid', value: COMPENSATION_ANALYTICS_DATA.beneficiariesPaid.toLocaleString('en-IN') },
          { label: 'PFMS Success Rate', value: `${COMPENSATION_ANALYTICS_DATA.pfmsSuccessRate}%` }
        ],
        tableHeaders: ['State', 'Allocated (Cr)', 'Disbursed (Cr)', 'Pending (Cr)', 'Disputes'],
        tableRows: DETAILED_STATE_STATS.map(s => [s.state, `₹${s.compensationAllocatedCr}`, `₹${s.compensationDisbursedCr}`, `₹${s.compensationPendingCr}`, s.legalDisputes]),
        filename: 'Compensation_DBT_Report.pdf'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-4 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 0. Top Executive Command & Decision Support Header */}
      <div className="gov-card rounded-2xl p-5 bg-gradient-to-r from-amber-50/40 via-white to-slate-50/60 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                Central Ministry Command Center
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">
                MoRTH & Ministry of Rural Development • DILRMP 3.0
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black font-mono tracking-tight text-slate-950 mt-1.5 flex items-center space-x-2">
              <span>NATIONAL LAND ACQUISITION COMMAND & DECISION SUPPORT CENTER</span>
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
              Consolidated national intelligence, statutory corridor tracking, automated bottleneck detection, and high-court dispute radar across 8 Indian States.
            </p>
          </div>

          {/* Right Controls: Freshness, Refresh & Report CTA */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Live Data Freshness Badge */}
            <div className="bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center space-x-2 text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-500 font-medium">Last Updated:</span>
              <span className="text-slate-900 font-bold">{lastUpdated}</span>
              <button 
                onClick={handleManualRefresh}
                title="Refresh live national pipeline data"
                className={`p-1 hover:bg-slate-200 rounded-lg transition-all cursor-pointer ${isRefreshing ? 'animate-spin text-amber-600' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Report Download Button */}
            <button
              onClick={() => handleDownloadReport('NATIONAL_SUMMARY')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Export Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* 6-Step Statutory Command & Decision Workflow Strip */}
        <div className="mt-3.5 pt-3 border-t border-slate-200/90 overflow-x-auto">
          <div className="flex items-center space-x-2 text-[10px] font-mono whitespace-nowrap">
            <span className="text-amber-800 font-bold uppercase tracking-wider">Command Decision Cycle:</span>
            <span className="bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">1. REAL-TIME DATA</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">2. GIS MONITORING</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">3. BOTTLENECK DETECTION</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">4. RISK INTELLIGENCE</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">5. RECOMMENDED ACTION</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="bg-emerald-600 text-white font-black px-2 py-0.5 rounded shadow-2xs">6. MINISTRY DECISION</span>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <div className="gov-card rounded-xl px-3.5 py-2.5 flex items-center space-x-2.5 shadow-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text"
            placeholder="Global Command Search: Project ID, Corridor Name, State, District, Survey #, ULPIN, or Case..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {globalSearch && (
            <button 
              onClick={() => {
                setGlobalSearch('');
                setSearchResultsOpen(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown Overlay */}
        {searchResultsOpen && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto p-3 space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-900">Search Results ({searchResults.totalCount} found)</span>
              <button 
                onClick={() => setSearchResultsOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-[11px] font-bold"
              >
                Close
              </button>
            </div>

            {searchResults.totalCount === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">No records found matching "{globalSearch}"</div>
            ) : (
              <>
                {searchResults.projects.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Projects ({searchResults.projects.length})</span>
                    <div className="space-y-1 mt-1">
                      {searchResults.projects.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setSelectedProjectDetail(p);
                            setSelectedMapProject(p);
                            setSelectedMapState(p.state);
                            setActiveSection('projects');
                            setSearchResultsOpen(false);
                          }}
                          className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{p.name}</span>
                            <span className="text-[10px] text-slate-500 ml-2 font-mono">({p.state} • {p.id})</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                            {p.currentStage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.parcels.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Land Parcels ({searchResults.parcels.length})</span>
                    <div className="space-y-1 mt-1">
                      {searchResults.parcels.slice(0, 4).map(pcl => (
                        <div 
                          key={pcl.id}
                          onClick={() => {
                            setSelectedParcelDetail(pcl);
                            setIsParcelDrawerOpen(true);
                            setSearchResultsOpen(false);
                          }}
                          className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">Survey {pcl.surveyNumber || pcl.surveyNo}</span>
                            <span className="text-[10px] text-slate-500 ml-2 font-mono">ULPIN: {pcl.ulpin} ({pcl.district}, {pcl.state})</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {pcl.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Sub-navigation Command Tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1.5 rounded-xl shadow-xs min-w-max">
          {NAV_SECTIONS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-black ${
                    isActive ? 'bg-amber-500 text-slate-950' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: COMMAND CENTER DASHBOARD (10 KPI CARDS WITH DRILL-DOWN & TRENDS) */}
      {/* ========================================================================= */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          {/* 10 National KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {NATIONAL_COMMAND_KPIS.map((kpi) => (
              <div 
                key={kpi.id}
                onClick={() => setActiveSection(kpi.targetSection)}
                className="gov-card rounded-xl p-3.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                    {kpi.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                </div>

                <div className="mt-2">
                  <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 font-mono mt-0.5">
                    {kpi.unit}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className={`font-mono font-bold flex items-center space-x-1 ${
                    kpi.trendPositive ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    <span>{kpi.trend}</span>
                  </span>
                  <span className="text-slate-400 text-[9px] truncate max-w-[80px]">
                    {kpi.trendLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Dual Panels: Bottleneck Radar + High Risk Corridors */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left (7 cols): Bottlenecks Summary Chart */}
            <div className="lg:col-span-7 gov-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wide">
                    National Statutory Bottleneck Radar
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveSection('bottlenecks')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Detailed Analytics</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BOTTLENECK_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="stage" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(val, name) => [name === 'casesCount' ? `${val} Cases` : `${val} Days Delay`, name === 'casesCount' ? 'Affected Parcels' : 'Average SLA Delay']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }} 
                    />
                    <Bar dataKey="casesCount" fill="#d97706" radius={[4, 4, 0, 0]} name="casesCount" />
                    <Bar dataKey="avgDelayDays" fill="#dc2626" radius={[4, 4, 0, 0]} name="avgDelayDays" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Key National Bottleneck Insight:</strong>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    <strong>Compensation Disbursal (Sec 3G)</strong> represents the single largest statutory delay factor across India, accounting for <strong>31% of all delayed cases</strong> (avg delay: 74 days).
                  </p>
                </div>
              </div>
            </div>

            {/* Right (5 cols): Critical Cases Needing Attention */}
            <div className="lg:col-span-5 gov-card rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <h3 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wide">
                      Ministry Attention Required
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveSection('critical')}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View All (6)</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {CRITICAL_CASES_DATA.slice(0, 3).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setSelectedCriticalCase(item);
                        setActiveSection('critical');
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer space-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{item.title}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          item.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {item.severity} ({item.delayDays}d overdue)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{item.reason}</p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.project} • {item.district}, {item.state}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">3 Escrow/Stay notices active</span>
                <button 
                  onClick={() => setActiveSection('dss')}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Run DSS Synthesis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: INDIA GIS MONITORING MAP (DRILL-DOWN: NATIONAL → STATE → PARCEL) */}
      {/* ========================================================================= */}
      {activeSection === 'map' && (
        <div className="space-y-4">
          <div className="gov-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wide flex items-center space-x-2">
                <Map className="w-4 h-4 text-amber-600" />
                <span>INTERACTIVE NATIONAL GIS MONITORING MAP</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-level spatial drill-down: Select state or corridor to inspect cadastral boundaries, court stay overlays, and solatium status.
              </p>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
              <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Completed</span>
              </span>
              <span className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                <span>In Progress</span>
              </span>
              <span className="flex items-center space-x-1 bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                <span>Delayed</span>
              </span>
              <span className="flex items-center space-x-1 bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                <span>High Risk / Stay</span>
              </span>
              <span className="flex items-center space-x-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                <span>Proposed</span>
              </span>
            </div>
          </div>

          {/* Map & Inspector Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left (8 cols): Interactive State Selector Grid & Corridor Cards */}
            <div className="lg:col-span-8 space-y-4">
              {/* State Pills Selector */}
              <div className="gov-card rounded-xl p-3 flex flex-wrap items-center gap-2 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">Select State:</span>
                {DETAILED_STATE_STATS.map((st) => (
                  <button
                    key={st.state}
                    onClick={() => {
                      setSelectedMapState(st.state);
                      const stateProj = projects.find(p => p.state === st.state);
                      if (stateProj) setSelectedMapProject(stateProj);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedMapState === st.state 
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st.state} ({st.totalProjects})
                  </button>
                ))}
              </div>

              {/* State Summary Inspector Card */}
              <div className="gov-card rounded-2xl p-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                      {activeStateMetrics.code}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{activeStateMetrics.state} State Corridor Portfolio</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    activeStateMetrics.performanceTier === 'Leader' || activeStateMetrics.performanceTier === 'Excellent'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}>
                    {activeStateMetrics.performanceTier} ({activeStateMetrics.completionRate}% Completion)
                  </span>
                </div>

                {/* State Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Total Area Target</span>
                    <span className="text-sm font-black font-mono text-slate-900">{activeStateMetrics.totalAreaHa} Ha</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Area Acquired</span>
                    <span className="text-sm font-black font-mono text-emerald-700">{activeStateMetrics.acquiredAreaHa} Ha</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Compensation Disbursed</span>
                    <span className="text-sm font-black font-mono text-blue-700">₹{activeStateMetrics.compensationDisbursedCr} Cr</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Active Legal Disputes</span>
                    <span className="text-sm font-black font-mono text-rose-700">{activeStateMetrics.legalDisputes} Cases</span>
                  </div>
                </div>

                {/* Projects within Selected State */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    Active Projects in {selectedMapState} ({stateProjects.length})
                  </span>
                  {stateProjects.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                      State portfolio managed under regional state administration.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {stateProjects.map(sp => (
                        <div 
                          key={sp.id}
                          onClick={() => setSelectedMapProject(sp)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedMapProject?.id === sp.id 
                              ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900 truncate max-w-[180px]">{sp.name}</span>
                            <span className="text-[9px] font-mono font-bold text-slate-500">{sp.id}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                            <span>Stage: <strong className="text-slate-800">{sp.currentStage}</strong></span>
                            <span className="font-mono text-amber-700 font-bold">Risk: {sp.riskScore}/100</span>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-slate-100 flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProjectDetail(sp);
                                setActiveSection('projects');
                              }}
                              className="text-[10px] font-mono text-amber-700 hover:text-amber-900 font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Inspect Corridor Dossier</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Land Parcels within corridor */}
              <div className="gov-card rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase font-mono">
                    Cadastral Land Parcels (Survey Numbers in Corridor)
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Click parcel to inspect</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {parcels.slice(0, 6).map((pcl) => (
                    <div 
                      key={pcl.id}
                      onClick={() => {
                        setSelectedParcelDetail(pcl);
                        setIsParcelDrawerOpen(true);
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">Survey {pcl.surveyNumber || pcl.surveyNo}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          pcl.status === 'UTILIZATION' || pcl.status === 'HANDOVER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          pcl.status === 'LEGAL' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {pcl.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono">ULPIN: {pcl.ulpin}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>Area: {pcl.areaHectares} Ha</span>
                        <span className="font-mono text-amber-800 font-bold">Risk: {pcl.riskScore || 20}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right (4 cols): Detailed Parcel / Project Information Inspector Panel */}
            <div className="lg:col-span-4 gov-card rounded-2xl p-4 space-y-3 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wide flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cadastral Inspector Panel</span>
                  </h3>
                  <span className="text-[10px] font-mono bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                    ULPIN Certified
                  </span>
                </div>

                {selectedParcelDetail ? (
                  <div className="space-y-3 mt-3 text-xs">
                    {/* Identification Header */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono">Cadastral Survey Number</div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        {selectedParcelDetail.surveyNumber || selectedParcelDetail.surveyNo} ({selectedParcelDetail.id})
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        Bhu-Aadhaar (ULPIN): <strong>{selectedParcelDetail.ulpin}</strong>
                      </div>
                    </div>

                    {/* Corridor & Geography */}
                    <div className="space-y-1 text-slate-600 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Project Corridor:</span>
                        <span className="font-bold text-slate-900 text-right truncate max-w-[160px]">{selectedParcelDetail.projectName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Location:</span>
                        <span className="font-bold text-slate-900">{selectedParcelDetail.district}, {selectedParcelDetail.state}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Plot Area:</span>
                        <span className="font-mono font-bold text-slate-900">{selectedParcelDetail.areaHectares} Hectares</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Acquisition Stage:</span>
                        <span className="font-mono font-bold text-amber-800">{selectedParcelDetail.status}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Compensation Award:</span>
                        <span className="font-mono font-bold text-emerald-700">₹{(selectedParcelDetail.totalAwardAmount / 10000000).toFixed(2)} Cr</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>DBT Status:</span>
                        <span className="font-mono font-bold text-slate-900">{selectedParcelDetail.dbtStatus}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Legal Issues:</span>
                        <span className="font-mono font-bold text-rose-700">
                          {selectedParcelDetail.legalIssues?.length ? `${selectedParcelDetail.legalIssues.length} Case Registered` : 'None (Clear Title)'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Risk Score:</span>
                        <span className="font-mono font-bold text-amber-700">{selectedParcelDetail.riskScore || 25}/100</span>
                      </div>
                    </div>

                    {/* Actionable Next Step Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1 text-xs">
                      <span className="font-bold text-amber-950 block text-[10px] uppercase font-mono">Expected Next Statutory Action:</span>
                      <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                        {selectedParcelDetail.expectedNextAction || 'Proceed with standard corridor milestone.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Select a parcel from the left to view detailed cadastral dossier.
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDownloadReport('NATIONAL_SUMMARY')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Parcel Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ACQUISITION LIFECYCLE TRACKING (12 STATUTORY STAGES) */}
      {/* ========================================================================= */}
      {activeSection === 'lifecycle' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Statutory 12-Stage National Acquisition Lifecycle Tracking
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Full statutory lifecycle tracking under RFCTLARR Act 2013 & National Highways Act with SLA breach alerts.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-bold">
              12 Stages Active • SLA Target: 365 Days Total
            </span>
          </div>

          {/* Stepper Grid of 12 Statutory Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {STAGES_LIST.map((st, idx) => {
              const isCompensation = st.id === 'COMPENSATION';
              const isObjection = st.id === 'OBJECTION';
              const hasBottleneck = isCompensation || isObjection;

              return (
                <div 
                  key={st.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    hasBottleneck 
                      ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                      Stage {st.step}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      SLA: {st.slaDays} Days
                    </span>
                  </div>

                  <h4 className="font-black text-xs text-slate-900 mt-2">{st.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{st.desc}</p>

                  {/* Bottleneck Warning Banner */}
                  {hasBottleneck && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200/80 text-[10px] text-rose-800 font-medium space-y-0.5">
                      <div className="flex items-center space-x-1 font-bold text-rose-900">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Bottleneck Overdue Alert</span>
                      </div>
                      <p>
                        {isCompensation ? 'Pending for 74 days — Above expected processing SLA.' : 'Section 3C hearings pending for 49 days.'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: MINISTRY ATTENTION REQUIRED (CRITICAL CASES) */}
      {/* ========================================================================= */}
      {activeSection === 'critical' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-3 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Cases Requiring Central Ministry Intervention
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically flagged cases where compensation, legal dispute, or administrative approval has exceeded national SLA thresholds.
              </p>
            </div>

            {/* Severity Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setCriticalSeverityFilter(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    criticalSeverityFilter === sev 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-3">
            {filteredCriticalCases.map((c) => (
              <div 
                key={c.id} 
                className="gov-card rounded-xl p-4 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${
                      c.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-300' :
                      c.severity === 'High' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}>
                      {c.severity} Priority
                    </span>
                    <span className="text-xs font-black font-mono text-slate-900">{c.caseId}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-700">{c.title}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{c.reason}</p>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 text-xs text-amber-950 font-medium">
                    <strong className="text-amber-900">Recommended Ministry Action:</strong> {c.recommendedAction}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                    <span>Project: <strong className="text-slate-800">{c.project}</strong></span>
                    <span>State: <strong className="text-slate-800">{c.state} ({c.district})</strong></span>
                    <span>SLA Delay: <strong className="text-rose-700">{c.delayDays} Days Overdue</strong></span>
                    <span>Assigned: <strong className="text-slate-800">{c.officer}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      alert(`Case Dossier Opened: ${c.caseId}\n\nProject: ${c.project}\nState: ${c.state}\nDelay: ${c.delayDays} Days\nRecommended Action: ${c.recommendedAction}\n\nNotice dispatched to: ${c.officer}`);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Open Case Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: AI-BASED ACQUISITION RISK INTELLIGENCE */}
      {/* ========================================================================= */}
      {activeSection === 'risk' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Acquisition Risk Intelligence & Explainable Scoring Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rule-based decision support system scoring corridor risk (0–100) based on statutory SLA duration, court stays, and missing documentation.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 rounded-lg font-bold">
              Configurable Rule Matrix v3.2 (ML Model Ready)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => {
              const riskAnalysis = calculateAcquisitionRisk(proj);

              return (
                <div key={proj.id} className="gov-card rounded-xl p-4 space-y-3 bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{proj.id}</span>
                      <h4 className="text-xs font-black text-slate-900">{proj.name}</h4>
                      <span className="text-[10px] text-slate-500">{proj.state} • {proj.agency}</span>
                    </div>

                    {/* Big Score Badge */}
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono tracking-tight text-slate-900">
                        {riskAnalysis.score}<span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border ${riskAnalysis.tierColor}`}>
                        {riskAnalysis.tier} RISK
                      </span>
                    </div>
                  </div>

                  {/* Factor Breakdown Chips */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                      Contributing Risk Factors:
                    </span>
                    {riskAnalysis.factors.length === 0 ? (
                      <span className="text-xs text-emerald-700 font-medium">No active risk flags detected. Normal statutory pacing.</span>
                    ) : (
                      <div className="space-y-1">
                        {riskAnalysis.factors.map((f, fIdx) => (
                          <div key={fIdx} className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg text-[11px]">
                            <span className="font-medium text-slate-700">{f.detail}</span>
                            <span className="font-mono font-black text-rose-700 shrink-0 ml-2">{f.weight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recommended Action */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-950 space-y-0.5">
                    <span className="font-bold text-[10px] uppercase font-mono block text-amber-900">
                      Recommended Decision Action:
                    </span>
                    <p className="text-[11px] leading-snug">
                      {riskAnalysis.recommendations[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: BOTTLENECK ANALYTICS */}
      {/* ========================================================================= */}
      {activeSection === 'bottlenecks' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  National Statutory Bottleneck Analytics & Root Causes
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quantified funnel analysis showing where acquisition cases are getting stuck and duration exceedance.
              </p>
            </div>
            <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg font-bold">
              6 Funnel Stages Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BOTTLENECK_ANALYTICS_DATA.map((b) => (
              <div key={b.key} className="gov-card rounded-xl p-4 bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{b.stage}</span>
                  <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {b.pctTotalCases}% of Delays
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-mono">Affected Cases</span>
                    <span className="text-base font-black font-mono text-slate-900">{b.casesCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-mono">Avg SLA Delay</span>
                    <span className="text-base font-black font-mono text-rose-700">+{b.avgDelayDays} Days</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 leading-snug pt-1 border-t border-slate-100">
                  <strong className="text-slate-800">Primary Root Cause:</strong> {b.rootCause}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: STATE PERFORMANCE COMPARISON & BENCHMARKING */}
      {/* ========================================================================= */}
      {activeSection === 'states' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  State Performance Benchmarking & Multi-State Comparison
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Inter-state comparative audit of acquisition timelines, pending solatium awards, and completion rates.
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport('STATE_PERFORMANCE')}
              className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export State Report (PDF)</span>
            </button>
          </div>

          {/* Full Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white text-[10px] uppercase font-mono tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Projects</th>
                  <th className="py-2.5 px-3">Completed</th>
                  <th className="py-2.5 px-3">In Progress</th>
                  <th className="py-2.5 px-3">Delayed</th>
                  <th className="py-2.5 px-3">Avg Time</th>
                  <th className="py-2.5 px-3">Compensation Pending</th>
                  <th className="py-2.5 px-3">Disputes</th>
                  <th className="py-2.5 px-3">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {DETAILED_STATE_STATS.map((s) => (
                  <tr key={s.state} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                      <span>{s.state}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{s.totalProjects}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{s.completed}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-700">{s.inProgress}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-700 font-bold">{s.delayed}</td>
                    <td className="py-2.5 px-3 font-mono">{s.avgAcquisitionMonths} mos</td>
                    <td className="py-2.5 px-3 font-mono font-bold">₹{s.compensationPendingCr} Cr</td>
                    <td className="py-2.5 px-3 font-mono">{s.legalDisputes}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${s.completionRate}%` }} />
                        </div>
                        <span className="font-mono font-bold text-slate-800">{s.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: NATIONAL PROJECT MONITORING TABLE */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 8: NATIONAL PROJECT MONITORING REPOSITORY & PROJECT DETAILS VIEW */}
      {/* ========================================================================= */}
      {activeSection === 'projects' && (
        selectedProjectDetail ? (
          <ProjectDetailsView 
            project={selectedProjectDetail}
            parcels={parcels}
            onBack={() => setSelectedProjectDetail(null)}
            onNavigateSection={(sec) => {
              setSelectedProjectDetail(null);
              setActiveSection(sec);
            }}
          />
        ) : (
          <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-3 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                    National Mega Project Monitoring Repository
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comprehensive tracking across NHAI, DFCCIL, SECI, and MoRTH mega corridors.
                </p>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-2">
                <input 
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />

                <select 
                  value={projectStateFilter}
                  onChange={(e) => setProjectStateFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="ALL">All States</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                </select>

                <select 
                  value={projectRiskFilter}
                  onChange={(e) => setProjectRiskFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="ALL">All Risk Tiers</option>
                  <option value="HIGH">High Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="LOW">Low Risk</option>
                </select>
              </div>
            </div>

            {/* Interactive Drill-Down Helper Callout */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-950 font-medium">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Interactive GIS Drill-Down:</strong> Click anywhere on any mega project row below to inspect its live GIS route polyline, cadastral land parcels, 12-stage lifecycle, and root-cause delay breakdown.
                </span>
              </div>
              <span className="hidden md:inline-block font-mono text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded font-bold">
                {filteredProjectsList.length} Corridors Active
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white text-[10px] uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Project ID</th>
                    <th className="py-2.5 px-3">Corridor Name</th>
                    <th className="py-2.5 px-3">State & Districts</th>
                    <th className="py-2.5 px-3">Acquired / Total</th>
                    <th className="py-2.5 px-3">Current Stage</th>
                    <th className="py-2.5 px-3">Risk Score</th>
                    <th className="py-2.5 px-3">Delay</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredProjectsList.map((p) => (
                    <tr 
                      key={p.id} 
                      onClick={() => setSelectedProjectDetail(p)}
                      className="hover:bg-amber-50/70 transition-all cursor-pointer group"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        <div className="flex items-center space-x-1">
                          <span className="group-hover:text-amber-700 transition-colors">{p.id}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {p.agency}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {p.state} <span className="text-[10px] text-slate-400">({p.districts.join(', ')})</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">
                        <div>{p.acquiredAreaHa} / {p.totalAreaHa} Ha</div>
                        <div className="text-[10px] text-emerald-600 font-normal">
                          {p.acquisitionProgress || ((p.acquiredAreaHa / p.totalAreaHa) * 100).toFixed(1)}% Acquired
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800">
                          {p.currentStage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-black text-amber-700">
                        {p.riskScore}/100
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {p.delayDays > 0 ? (
                          <span className="text-rose-700 font-bold">+{p.delayDays}d</span>
                        ) : (
                          <span className="text-emerald-700 font-bold">On Schedule</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          p.status === 'NEAR_COMPLETION' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          p.status === 'CRITICAL_BOTTLENECK' || p.status === 'DELAYED' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProjectDetail(p);
                          }}
                          className="px-2.5 py-1 bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-white rounded-lg text-[10px] font-bold inline-flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* SECTION 9: COMPENSATION & DBT MONITORING */}
      {/* ========================================================================= */}
      {activeSection === 'compensation' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  National Solatium & PFMS Direct Benefit Transfer Dashboard
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                100% Solatium computation under RFCTLARR 2013 and Direct Benefit Transfer reconciliation with PFMS.
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport('COMPENSATION_PFMS')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export DBT Audit (PDF)</span>
            </button>
          </div>

          {/* 4 Financial Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Compensation Budget</span>
              <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
                ₹{COMPENSATION_ANALYTICS_DATA.totalAllocatedCr.toLocaleString('en-IN')} Cr
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">100% Solatium + Base Value</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Disbursed (PFMS)</span>
              <span className="text-2xl font-black font-mono text-emerald-700 mt-1 block">
                ₹{COMPENSATION_ANALYTICS_DATA.totalDisbursedCr.toLocaleString('en-IN')} Cr
              </span>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                {COMPENSATION_ANALYTICS_DATA.beneficiariesPaid.toLocaleString('en-IN')} Landowners Credited
              </span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Pending Disbursal</span>
              <span className="text-2xl font-black font-mono text-amber-700 mt-1 block">
                ₹{COMPENSATION_ANALYTICS_DATA.totalPendingCr.toLocaleString('en-IN')} Cr
              </span>
              <span className="text-[10px] text-amber-700 font-medium mt-1 block">
                {COMPENSATION_ANALYTICS_DATA.beneficiariesPending.toLocaleString('en-IN')} Pending Beneficiaries
              </span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Average Payment Turnaround</span>
              <span className="text-2xl font-black font-mono text-blue-700 mt-1 block">
                {COMPENSATION_ANALYTICS_DATA.avgDisbursalDays} Days
              </span>
              <span className="text-[10px] text-blue-600 font-medium mt-1 block">
                {COMPENSATION_ANALYTICS_DATA.pfmsSuccessRate}% First-Time Direct Credit
              </span>
            </div>
          </div>

          {/* Severely Delayed Compensation Cases */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-black text-slate-900 font-mono uppercase">
              Severely Delayed Compensation Cases Flagged for Ministry Audit
            </span>
            <div className="space-y-2">
              {COMPENSATION_ANALYTICS_DATA.severelyDelayedCases.map(c => (
                <div key={c.id} className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{c.project} — {c.district}, {c.state}</span>
                    <p className="text-[11px] text-rose-900 mt-0.5">{c.reason}</p>
                    <span className="text-[10px] text-slate-500 font-mono">Beneficiaries impacted: {c.beneficiaries} families</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-rose-700">₹{c.pendingCr} Cr</span>
                    <span className="block text-[10px] font-mono text-rose-800 font-bold">+{c.delayDays} Days Delayed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 10: LEGAL & DISPUTE DASHBOARD */}
      {/* ========================================================================= */}
      {activeSection === 'legal' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  National Legal Disputes & Court Stay Radar
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Section 3C public objections, High Court interim stays, and Land Acquisition Tribunal hearings.
              </p>
            </div>
            <span className="text-xs font-mono bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-lg font-bold">
              64 Active Disputes Tracked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LEGAL_CASES_DATA.map(cs => (
              <div key={cs.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900">{cs.caseId} (Survey {cs.surveyNumber})</span>
                  <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                    {cs.priority} Priority
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{cs.issue}</h4>
                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                  <div>Court / Tribunal: <strong className="text-slate-900">{cs.courtName}</strong></div>
                  <div>Petitioner: <strong>{cs.petitioner}</strong></div>
                  <div>Assigned: <strong>{cs.assignedOfficer}</strong></div>
                  <div>Next Statutory Hearing: <strong className="text-amber-800 font-mono">{cs.nextHearingDate}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 11: MINISTRY DECISION SUPPORT & AUTOMATED INSIGHTS */}
      {/* ========================================================================= */}
      {activeSection === 'dss' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Central Ministry Automated Decision Support & Strategic Q&A
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Synthesized policy insights answering high-level questions for proactive ministerial intervention.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 rounded-lg font-bold">
              AI Decision Synthesis Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {MINISTRY_DECISION_INSIGHTS.map((d, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-mono text-[10px] flex items-center justify-center font-bold">
                      Q{idx + 1}
                    </span>
                    <span>{d.question}</span>
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    d.severity === 'CRITICAL' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {d.metric}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{d.summary}</p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-950 space-y-0.5">
                  <strong className="text-[10px] font-mono uppercase text-amber-900 block">Ministry Recommended Decision:</strong>
                  <p className="text-[11px] leading-snug">{d.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 12: REPORTS & EXPORT */}
      {/* ========================================================================= */}
      {activeSection === 'reports' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Statutory Report Generation & Export Center
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate official Ministry dossier reports formatted with DILRMP 3.0 standards, downloadable in PDF and CSV.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'NATIONAL_SUMMARY', title: 'National Acquisition Master Report', desc: 'Consolidated summary of all 8 national mega projects, total hectares, and completion indices.', type: 'NATIONAL_SUMMARY' },
              { id: 'STATE_PERFORMANCE', title: 'State-wise Performance & Ranking Dossier', desc: 'Inter-state SLA turnaround comparison, completion rates, and delay rankings.', type: 'STATE_PERFORMANCE' },
              { id: 'COMPENSATION_PFMS', title: 'Compensation & PFMS DBT Reconciliation Report', desc: 'RFCTLARR 2013 solatium calculation, bank transfer logs, and beneficiary accounts.', type: 'COMPENSATION_PFMS' }
            ].map(rpt => (
              <div key={rpt.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{rpt.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{rpt.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadReport(rpt.type)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => exportToCSV(projects, `${rpt.id}.csv`)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    title="Export CSV"
                  >
                    CSV
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 13: SMART NOTIFICATIONS */}
      {/* ========================================================================= */}
      {activeSection === 'notifications' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Smart System Alerts & Event Notifications
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time alerts triggered by statutory SLA deadlines, new litigation stays, or solatium milestones.
              </p>
            </div>
            <button 
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  n.read ? 'bg-white border-slate-200' : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{n.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">({n.date})</span>
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {n.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 14: ADMIN AUDIT TRAIL */}
      {/* ========================================================================= */}
      {activeSection === 'audit' && (
        <div className="gov-card rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Administrative Audit Trail & Chain of Custody
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable record of who created, verified, modified, or approved land acquisition awards.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-bold">
              SHA-256 Ledger Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {RECENT_AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-800">{log.action}</span>
                  <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-800">{log.details}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[10px] text-slate-500 font-mono">
                  <span>Officer: <strong className="text-slate-800">{log.user} ({log.role})</strong></span>
                  <span>Entity: <strong className="text-slate-800">{log.entity} ({log.entityId})</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
