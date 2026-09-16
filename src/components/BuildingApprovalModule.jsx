import React, { useState, useMemo } from 'react';
import {
  Building,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Filter,
  Check,
  X,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize2,
  Eye,
  Calendar,
  Layers,
  Award,
  AlertCircle,
  FileCheck,
  Printer,
  Compass,
  ArrowRight,
  CornerDownRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import {
  BUILDING_APPLICATIONS_DATA,
  BUILDING_STATS,
  STATUTORY_CORRECTION_CHECKLIST,
  BUILDING_STATUS_TIMELINE_STEPS
} from '../data/buildingApprovalData';

export default function BuildingApprovalModule({ currentUser }) {
  // Application Data State
  const [applications, setApplications] = useState(BUILDING_APPLICATIONS_DATA);
  const [selectedAppId, setSelectedAppId] = useState(BUILDING_APPLICATIONS_DATA[0]?.applicationId);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTIONS_REQUESTED'
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Commercial' | 'Residential' | 'Industrial'
  const [ulbFilter, setUlbFilter] = useState('ALL');

  // Active Blueprint Viewer Tab ('site' | 'floor' | 'elevation' | 'setback')
  const [blueprintTab, setBlueprintTab] = useState('site');
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [isFullscreenDrawingOpen, setIsFullscreenDrawingOpen] = useState(false);

  // Action Modals State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isSanctionPermitOpen, setIsSanctionPermitOpen] = useState(false);

  // Form Inputs for Modals
  const [approveConditions, setApproveConditions] = useState(
    '1. Rainwater harvesting mandatory before occupancy.\n2. Construction debris must not infringe municipal Right-of-Way.\n3. Plinth level verification notice must be submitted within 6 months.'
  );
  const [approveValidityYears, setApproveValidityYears] = useState(3);
  
  const [rejectionGrounds, setRejectionGrounds] = useState('');
  const [rejectionStatute, setRejectionStatute] = useState('Sec 247(1) - Right-of-Way Infringement');
  
  const [correctionItems, setCorrectionItems] = useState([
    'FAR_VIOLATION',
    'SETBACK_INFRINGE'
  ]);
  const [correctionDirective, setCorrectionDirective] = useState('');
  const [correctionDeadlineDays, setCorrectionDeadlineDays] = useState(15);

  // Flash Feedback Notification
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const officerName = currentUser?.name || 'Sanjay Deshmukh (Municipal Officer)';
  const officerDept = currentUser?.roleObj?.department || 'Town Planning & Municipal Cadastre Cell';

  // Selected Application
  const selectedApp = useMemo(() => {
    return applications.find(a => a.applicationId === selectedAppId) || applications[0] || null;
  }, [applications, selectedAppId]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        app.applicationId.toLowerCase().includes(q) ||
        app.propertyId.toLowerCase().includes(q) ||
        app.ulpin.toLowerCase().includes(q) ||
        app.ownerName.toLowerCase().includes(q) ||
        app.architectName.toLowerCase().includes(q) ||
        app.wardNo.toLowerCase().includes(q) ||
        app.buildingCategory.toLowerCase().includes(q)
      );

      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || app.buildingCategory.toLowerCase().includes(categoryFilter.toLowerCase());
      const matchesUlb = ulbFilter === 'ALL' || app.municipality.includes(ulbFilter);

      return matchesSearch && matchesStatus && matchesCategory && matchesUlb;
    });
  }, [applications, searchQuery, statusFilter, categoryFilter, ulbFilter]);

  // Dynamic KPI Stats
  const dynamicStats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'PENDING').length;
    const approved = applications.filter(a => a.status === 'APPROVED').length;
    const rejected = applications.filter(a => a.status === 'REJECTED').length;
    const corrections = applications.filter(a => a.status === 'CORRECTIONS_REQUESTED').length;
    return {
      total,
      pending,
      approved,
      rejected,
      corrections,
      complianceRate: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  }, [applications]);

  // Show Flash Feedback
  const showFeedback = (text, type = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  // HANDLER: APPROVE APPLICATION
  const handleApproveConfirm = () => {
    if (!selectedApp) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const todayDate = new Date().toISOString().split('T')[0];
    const expiryDate = new Date(Date.now() + approveValidityYears * 365 * 86400000).toISOString().split('T')[0];
    const permitNo = `MCG/BP-SANCTION/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newHistoryItem = {
      date: nowStr,
      officer: `${officerName} (Municipal Officer, ULB Nodal)`,
      action: 'PERMIT_SANCTIONED',
      note: `Building Sanction Permit #${permitNo} issued. All statutory bylaws, setbacks, and structural certificates approved.`
    };

    const updatedTimeline = (selectedApp.timeline || []).map(step => {
      if (step.step === 4 || step.step === 5) {
        return {
          ...step,
          status: 'COMPLETED',
          date: todayDate,
          officer: `${officerName}`,
          remark: step.step === 5 ? `Sanction Permit #${permitNo} signed and issued.` : 'Setback & ground coverage verified compliant.'
        };
      }
      return step;
    });

    const sanctionPermitObj = {
      permitNo,
      sanctionDate: todayDate,
      validityYears: approveValidityYears,
      expiryDate,
      permittedFar: selectedApp.proposedFar,
      permittedFloors: selectedApp.proposedFloors,
      conditions: approveConditions
    };

    setApplications(prev => prev.map(app => {
      if (app.applicationId === selectedApp.applicationId) {
        return {
          ...app,
          status: 'APPROVED',
          rejectionReason: null,
          correctionsRequested: null,
          sanctionPermit: sanctionPermitObj,
          timeline: updatedTimeline,
          history: [newHistoryItem, ...(app.history || [])]
        };
      }
      return app;
    }));

    setIsApproveModalOpen(false);
    showFeedback(`Building Application ${selectedApp.applicationId} APPROVED! Permit #${permitNo} released.`, 'success');
  };

  // HANDLER: REJECT APPLICATION
  const handleRejectConfirm = () => {
    if (!selectedApp) return;
    if (!rejectionGrounds.trim()) {
      alert('Please enter detailed statutory rejection grounds.');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const todayDate = new Date().toISOString().split('T')[0];

    const newHistoryItem = {
      date: nowStr,
      officer: `${officerName} (Municipal Officer)`,
      action: 'APPLICATION_REJECTED',
      note: `Application rejected under ${rejectionStatute}. Reason: ${rejectionGrounds.trim()}`
    };

    const updatedTimeline = (selectedApp.timeline || []).map(step => {
      if (step.step === 4 || step.step === 5) {
        return {
          ...step,
          status: 'REJECTED',
          date: todayDate,
          officer: officerName,
          remark: `Rejected under ${rejectionStatute}: ${rejectionGrounds.trim()}`
        };
      }
      return step;
    });

    setApplications(prev => prev.map(app => {
      if (app.applicationId === selectedApp.applicationId) {
        return {
          ...app,
          status: 'REJECTED',
          rejectionReason: `${rejectionStatute} — ${rejectionGrounds.trim()}`,
          sanctionPermit: null,
          timeline: updatedTimeline,
          history: [newHistoryItem, ...(app.history || [])]
        };
      }
      return app;
    }));

    setIsRejectModalOpen(false);
    setRejectionGrounds('');
    showFeedback(`Application ${selectedApp.applicationId} REJECTED under Municipal Act.`, 'error');
  };

  // HANDLER: REQUEST CORRECTIONS
  const handleCorrectionConfirm = () => {
    if (!selectedApp) return;
    if (correctionItems.length === 0) {
      alert('Please select at least one statutory deficiency item.');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const todayDate = new Date().toISOString().split('T')[0];
    const deadlineDate = new Date(Date.now() + correctionDeadlineDays * 86400000).toISOString().split('T')[0];

    const selectedChecklistItems = STATUTORY_CORRECTION_CHECKLIST
      .filter(item => correctionItems.includes(item.id))
      .map(item => item.label);

    const correctionObj = {
      memoDate: todayDate,
      resubmissionDeadline: deadlineDate,
      issuedBy: officerName,
      deficiencies: selectedChecklistItems,
      instructions: correctionDirective.trim() || 'Revise architectural drawings to rectify setback and FAR violations within 15 days.'
    };

    const newHistoryItem = {
      date: nowStr,
      officer: `${officerName} (Municipal Officer)`,
      action: 'CORRECTIONS_ISSUED',
      note: `Deficiency memo issued with ${selectedChecklistItems.length} items. Resubmission deadline: ${deadlineDate}.`
    };

    const updatedTimeline = (selectedApp.timeline || []).map(step => {
      if (step.step === 4) {
        return {
          ...step,
          status: 'CORRECTIONS_REQUESTED',
          date: todayDate,
          officer: officerName,
          remark: `Deficiency memo dispatched. Resubmission due: ${deadlineDate}`
        };
      }
      return step;
    });

    setApplications(prev => prev.map(app => {
      if (app.applicationId === selectedApp.applicationId) {
        return {
          ...app,
          status: 'CORRECTIONS_REQUESTED',
          correctionsRequested: correctionObj,
          timeline: updatedTimeline,
          history: [newHistoryItem, ...(app.history || [])]
        };
      }
      return app;
    }));

    setIsCorrectionModalOpen(false);
    setCorrectionDirective('');
    showFeedback(`Correction Memo dispatched to Architect for ${selectedApp.applicationId}.`, 'info');
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className={`fixed top-20 right-6 z-[2000] px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center space-x-2.5 animate-bounce transition-all ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-900/95 text-emerald-100 border-emerald-500/50 shadow-emerald-950/50' 
            : feedbackMessage.type === 'error'
            ? 'bg-rose-900/95 text-rose-100 border-rose-500/50 shadow-rose-950/50'
            : 'bg-amber-900/95 text-amber-100 border-amber-500/50 shadow-amber-950/50'
        }`}>
          {feedbackMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {feedbackMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {feedbackMessage.type === 'info' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Dockets</span>
            <Building className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">{dynamicStats.total}</p>
          <span className="text-[10px] text-slate-400 font-medium">ULB Town Planning</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <p className="text-xl font-black text-amber-600 mt-1 font-mono">{dynamicStats.pending}</p>
          <span className="text-[10px] text-amber-600/80 font-medium">Under Statutory Scrutiny</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Sanctioned</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-600 mt-1 font-mono">{dynamicStats.approved}</p>
          <span className="text-[10px] text-emerald-600/80 font-medium">Permits Released</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-2xs bg-blue-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Corrections</span>
            <AlertTriangle className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-black text-blue-600 mt-1 font-mono">{dynamicStats.corrections}</p>
          <span className="text-[10px] text-blue-600/80 font-medium">Deficiency Memo Sent</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-black text-rose-600 mt-1 font-mono">{dynamicStats.rejected}</p>
          <span className="text-[10px] text-rose-600/80 font-medium">Bylaw Non-Compliance</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">SLA Benchmark</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-black text-purple-600 mt-1 font-mono">{BUILDING_STATS.slaCompliancePct}%</p>
          <span className="text-[10px] text-slate-400 font-medium">Avg {BUILDING_STATS.averageSanctionDays} Days</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Pending & Applications Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search App ID, Owner, Architect, ULPIN..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-slate-400 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-100">
              {[
                { id: 'ALL', label: 'All', count: applications.length },
                { id: 'PENDING', label: 'Pending', count: dynamicStats.pending },
                { id: 'CORRECTIONS_REQUESTED', label: 'Corrections', count: dynamicStats.corrections },
                { id: 'APPROVED', label: 'Approved', count: dynamicStats.approved },
                { id: 'REJECTED', label: 'Rejected', count: dynamicStats.rejected }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all flex items-center space-x-1 cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-slate-900 text-amber-400 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                    statusFilter === tab.id ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sub-Filters: Type & Municipality */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Building Type</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium text-xs focus:outline-hidden"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Municipality</label>
                <select
                  value={ulbFilter}
                  onChange={(e) => setUlbFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium text-xs focus:outline-hidden"
                >
                  <option value="ALL">All Municipalities</option>
                  <option value="Gurugram">MCG Gurugram</option>
                  <option value="Surat">SMC Surat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List Queue */}
          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredApplications.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No building applications match criteria</p>
                <p className="text-[11px] text-slate-400">Try adjusting your search keywords or status filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); setUlbFilter('ALL'); }}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer mt-1"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredApplications.map(app => {
                const isSelected = selectedApp?.applicationId === app.applicationId;
                return (
                  <div
                    key={app.applicationId}
                    onClick={() => setSelectedAppId(app.applicationId)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-amber-50/50 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    {/* Status Pill & Application ID */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black font-mono text-slate-900 group-hover:text-amber-600 transition-colors">
                            {app.applicationId}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            • {app.propertyId}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1">
                          {app.buildingCategory}
                        </h4>
                      </div>

                      {/* Status Badges */}
                      {app.status === 'PENDING' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1 shrink-0">
                          <Clock className="w-2.5 h-2.5 text-amber-600 animate-pulse" />
                          <span>Pending</span>
                        </span>
                      )}
                      {app.status === 'APPROVED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Sanctioned</span>
                        </span>
                      )}
                      {app.status === 'CORRECTIONS_REQUESTED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center space-x-1 shrink-0">
                          <AlertTriangle className="w-2.5 h-2.5 text-blue-600" />
                          <span>Corrections</span>
                        </span>
                      )}
                      {app.status === 'REJECTED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center space-x-1 shrink-0">
                          <XCircle className="w-2.5 h-2.5 text-rose-600" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </div>

                    {/* Owner & Architect Details */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{app.ownerName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{app.wardNo}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="truncate max-w-[200px]">{app.architectName}</span>
                        <span className="font-mono">{app.plotAreaSqYd} sq.yd</span>
                      </div>
                    </div>

                    {/* Technical Parameter Tags & SLA Urgency */}
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                          app.proposedFar <= app.permissibleFar
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-700 border border-rose-200'
                        }`}>
                          FAR {app.proposedFar} / {app.permissibleFar}
                        </span>
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          {app.proposedFloors.split(' ')[0]}
                        </span>
                      </div>

                      {/* SLA Urgency Tag */}
                      <span className={`font-mono font-bold ${
                        app.slaDaysRemaining <= 7
                          ? 'text-rose-600 animate-pulse'
                          : app.slaDaysRemaining <= 15
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}>
                        ⏱ {app.slaDaysRemaining}d SLA
                      </span>
                    </div>

                    {/* Active Selection Indicator */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Application Dossier & Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedApp ? (
            <>
              {/* Top Action Header for Selected Application */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black font-mono text-slate-950">
                        {selectedApp.applicationId}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 font-mono">
                        ULPIN: {selectedApp.ulpin}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {selectedApp.buildingCategory} • {selectedApp.proposalType}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {selectedApp.municipality} • {selectedApp.wardNo}
                    </p>
                  </div>

                  {/* Primary Officer Action Buttons */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {/* If already approved, show View Sanction Permit */}
                    {selectedApp.status === 'APPROVED' && selectedApp.sanctionPermit && (
                      <button
                        onClick={() => setIsSanctionPermitOpen(true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Sanction Permit</span>
                      </button>
                    )}

                    {/* Request Corrections Button */}
                    <button
                      onClick={() => setIsCorrectionModalOpen(true)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Request Corrections</span>
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reject</span>
                    </button>

                    {/* Approve Button */}
                    <button
                      onClick={() => setIsApproveModalOpen(true)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Sanction</span>
                    </button>
                  </div>
                </div>

                {/* Sub-header Summary Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Applicant / Owner</span>
                    <span className="font-bold text-slate-800">{selectedApp.ownerName}</span>
                    <span className="text-slate-500 block text-[10px]">{selectedApp.ownerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Licensed Architect</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{selectedApp.architectName}</span>
                    <span className="text-emerald-600 block text-[10px] font-bold">CoA Registered</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Filing & SLA Deadline</span>
                    <span className="font-bold text-slate-800">{selectedApp.filingDate}</span>
                    <span className="text-amber-600 block text-[10px] font-mono">Due: {selectedApp.slaDeadlineDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Scrutiny Fee & Status</span>
                    <span className="font-bold text-emerald-700">{selectedApp.scrutinyFeeStatus.split(' ')[0]}</span>
                    <span className="text-slate-500 block text-[10px]">{selectedApp.scrutinyFeeStatus.split('(')[1]?.replace(')', '') || 'Paid'}</span>
                  </div>
                </div>
              </div>

              {/* Status Banner (if Rejection or Corrections Active) */}
              {selectedApp.status === 'REJECTED' && selectedApp.rejectionReason && (
                <div className="bg-rose-50 border-l-4 border-rose-600 p-3.5 rounded-r-xl shadow-2xs space-y-1">
                  <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>APPLICATION REJECTED UNDER STATUTORY BYLAW</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {selectedApp.rejectionReason}
                  </p>
                </div>
              )}

              {selectedApp.status === 'CORRECTIONS_REQUESTED' && selectedApp.correctionsRequested && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-3.5 rounded-r-xl shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <span>DEFICIENCY MEMO DISPATCHED — AWAITING ARCHITECT RESUBMISSION</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-bold">
                      Due: {selectedApp.correctionsRequested.resubmissionDeadline}
                    </span>
                  </div>
                  <ul className="text-xs text-blue-800 list-disc list-inside space-y-0.5 font-medium">
                    {selectedApp.correctionsRequested.deficiencies.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-blue-700 italic">
                    Instructions: "{selectedApp.correctionsRequested.instructions}"
                  </p>
                </div>
              )}

              {/* FEATURE 2: VIEW UPLOADED BUILDING PLANS & BLUEPRINTS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Blueprint Header with Tab Switcher */}
                <div className="p-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider font-mono">
                      Uploaded Architectural Blueprints &amp; Technical Drawings
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {selectedApp.drawings.length} Drawings
                    </span>
                  </div>

                  {/* Blueprint Tab Buttons */}
                  <div className="flex items-center space-x-1">
                    {[
                      { id: 'site', label: 'Site Plan' },
                      { id: 'floor', label: 'Floor Layout' },
                      { id: 'elevation', label: 'Elevation' },
                      { id: 'setback', label: 'Setback Table' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setBlueprintTab(tab.id)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                          blueprintTab === tab.id
                            ? 'bg-amber-500 text-slate-950 shadow-2xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blueprint Tab Content Area */}
                <div className="p-4">
                  {blueprintTab === 'setback' ? (
                    /* Setback & Technical Parameters Comparison Table */
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                        <Compass className="w-4 h-4 text-amber-600" />
                        <span>National Building Code (NBC 2016) & Zonal Setback Audit</span>
                      </h5>

                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase">
                            <tr>
                              <th className="p-2.5">Parameter</th>
                              <th className="p-2.5">Permissible Limit</th>
                              <th className="p-2.5">Proposed Value</th>
                              <th className="p-2.5">Compliance Status</th>
                              <th className="p-2.5">Variance / Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px]">
                            {/* Front Setback */}
                            <tr className={selectedApp.setbacks.front.compliant ? 'bg-white' : 'bg-rose-50/50'}>
                              <td className="p-2.5 font-bold text-slate-800">Front Setback (RoW Line)</td>
                              <td className="p-2.5 font-mono">{selectedApp.setbacks.front.required}m</td>
                              <td className="p-2.5 font-mono font-bold">{selectedApp.setbacks.front.proposed}m</td>
                              <td className="p-2.5">
                                {selectedApp.setbacks.front.compliant ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-fit">
                                    <Check className="w-3 h-3" />
                                    <span>Compliant</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1 w-fit">
                                    <X className="w-3 h-3" />
                                    <span>Infringement</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500">
                                {selectedApp.setbacks.front.proposed >= selectedApp.setbacks.front.required
                                  ? `+${(selectedApp.setbacks.front.proposed - selectedApp.setbacks.front.required).toFixed(1)}m buffer clearing RoW`
                                  : `${(selectedApp.setbacks.front.proposed - selectedApp.setbacks.front.required).toFixed(1)}m encroaches masterplan`}
                              </td>
                            </tr>

                            {/* Rear Setback */}
                            <tr className={selectedApp.setbacks.rear.compliant ? 'bg-white' : 'bg-rose-50/50'}>
                              <td className="p-2.5 font-bold text-slate-800">Rear Setback</td>
                              <td className="p-2.5 font-mono">{selectedApp.setbacks.rear.required}m</td>
                              <td className="p-2.5 font-mono font-bold">{selectedApp.setbacks.rear.proposed}m</td>
                              <td className="p-2.5">
                                {selectedApp.setbacks.rear.compliant ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-fit">
                                    <Check className="w-3 h-3" />
                                    <span>Compliant</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1 w-fit">
                                    <X className="w-3 h-3" />
                                    <span>Violation</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500">Light & ventilation shaft adequate</td>
                            </tr>

                            {/* Side Left Setback */}
                            <tr className={selectedApp.setbacks.sideLeft.compliant ? 'bg-white' : 'bg-rose-50/50'}>
                              <td className="p-2.5 font-bold text-slate-800">Side (Left) Setback</td>
                              <td className="p-2.5 font-mono">{selectedApp.setbacks.sideLeft.required}m</td>
                              <td className="p-2.5 font-mono font-bold">{selectedApp.setbacks.sideLeft.proposed}m</td>
                              <td className="p-2.5">
                                {selectedApp.setbacks.sideLeft.compliant ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-fit">
                                    <Check className="w-3 h-3" />
                                    <span>Compliant</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1 w-fit">
                                    <X className="w-3 h-3" />
                                    <span>Violation</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500">Separation from adjacent parcel boundary</td>
                            </tr>

                            {/* Floor Area Ratio (FAR) */}
                            <tr className={selectedApp.proposedFar <= selectedApp.permissibleFar ? 'bg-white' : 'bg-rose-50/50'}>
                              <td className="p-2.5 font-bold text-slate-800">Floor Area Ratio (FAR)</td>
                              <td className="p-2.5 font-mono">{selectedApp.permissibleFar}</td>
                              <td className="p-2.5 font-mono font-bold">{selectedApp.proposedFar}</td>
                              <td className="p-2.5">
                                {selectedApp.proposedFar <= selectedApp.permissibleFar ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-fit">
                                    <Check className="w-3 h-3" />
                                    <span>Within Limits</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1 w-fit">
                                    <X className="w-3 h-3" />
                                    <span>Excess FAR</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500">
                                {selectedApp.proposedFar <= selectedApp.permissibleFar
                                  ? `${((1 - selectedApp.proposedFar / selectedApp.permissibleFar) * 100).toFixed(1)}% unutilized FAR margin`
                                  : `Exceeds master plan cap by ${((selectedApp.proposedFar - selectedApp.permissibleFar) * 100).toFixed(1)}%`}
                              </td>
                            </tr>

                            {/* Ground Coverage */}
                            <tr className={selectedApp.proposedCoveragePct <= selectedApp.permissibleCoveragePct ? 'bg-white' : 'bg-rose-50/50'}>
                              <td className="p-2.5 font-bold text-slate-800">Ground Coverage %</td>
                              <td className="p-2.5 font-mono">{selectedApp.permissibleCoveragePct}%</td>
                              <td className="p-2.5 font-mono font-bold">{selectedApp.proposedCoveragePct}%</td>
                              <td className="p-2.5">
                                {selectedApp.proposedCoveragePct <= selectedApp.permissibleCoveragePct ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-fit">
                                    <Check className="w-3 h-3" />
                                    <span>Compliant</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1 w-fit">
                                    <X className="w-3 h-3" />
                                    <span>Excess</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500">Open green area maintained</td>
                            </tr>

                            {/* Parking Spaces */}
                            <tr className={selectedApp.parkingProvidedEcs >= selectedApp.parkingRequiredEcs ? 'bg-white' : 'bg-amber-50/50'}>
                              <td className="p-2.5 font-bold text-slate-800">Parking Equivalent Spaces (ECS)</td>
                              <td className="p-2.5 font-mono">{selectedApp.parkingRequiredEcs} ECS</td>
                              <td className="p-2.5 font-mono font-bold">{selectedApp.parkingProvidedEcs} ECS</td>
                              <td className="p-2.5">
                                {selectedApp.parkingProvidedEcs >= selectedApp.parkingRequiredEcs ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-fit">
                                    <Check className="w-3 h-3" />
                                    <span>Surplus</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center space-x-1 w-fit">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Deficit</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500">
                                {selectedApp.parkingProvidedEcs >= selectedApp.parkingRequiredEcs
                                  ? `+${selectedApp.parkingProvidedEcs - selectedApp.parkingRequiredEcs} surplus bays provided`
                                  : 'Deficit must be resolved via mechanical stack'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Drawing Visual Preview Mode */
                    <div className="space-y-3">
                      {/* Drawing Selector Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {selectedApp.drawings.map(dwg => {
                          const isCategoryMatch = 
                            (blueprintTab === 'site' && dwg.category.toLowerCase().includes('site')) ||
                            (blueprintTab === 'floor' && dwg.category.toLowerCase().includes('floor')) ||
                            (blueprintTab === 'elevation' && (dwg.category.toLowerCase().includes('elevation') || dwg.category.toLowerCase().includes('section')));
                          
                          return (
                            <div
                              key={dwg.id}
                              onClick={() => setSelectedDrawing(dwg)}
                              className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                selectedDrawing?.id === dwg.id || (!selectedDrawing && isCategoryMatch)
                                  ? 'bg-amber-50/60 border-amber-400 ring-1 ring-amber-400'
                                  : isCategoryMatch
                                  ? 'bg-white border-slate-200 hover:border-slate-300'
                                  : 'bg-slate-50/60 border-slate-200 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                <span>{dwg.id}</span>
                                <span>{dwg.scale}</span>
                              </div>
                              <p className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1">
                                {dwg.title}
                              </p>
                              <span className="text-[9px] text-amber-700 font-medium">
                                {dwg.category}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Display Selected Drawing Preview Canvas */}
                      {(() => {
                        const activeDrawing = selectedDrawing || 
                          selectedApp.drawings.find(d => 
                            (blueprintTab === 'site' && d.category.toLowerCase().includes('site')) ||
                            (blueprintTab === 'floor' && d.category.toLowerCase().includes('floor')) ||
                            (blueprintTab === 'elevation' && (d.category.toLowerCase().includes('elevation') || d.category.toLowerCase().includes('section')))
                          ) || selectedApp.drawings[0];

                        return (
                          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 relative group">
                            {/* Visual Blueprint Image */}
                            <div className="h-64 sm:h-72 w-full relative overflow-hidden flex items-center justify-center">
                              <img
                                src={activeDrawing.url}
                                alt={activeDrawing.title}
                                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                              {/* Blueprint Grid Overlay Effect */}
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf815_1px,transparent_1px),linear-gradient(to_bottom,#38bdf815_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                              {/* Top Drawing Badge */}
                              <div className="absolute top-3 left-3 flex items-center space-x-2">
                                <span className="px-2.5 py-1 rounded bg-slate-900/90 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold">
                                  {activeDrawing.id}: {activeDrawing.scale}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[10px]">
                                  {activeDrawing.fileType}
                                </span>
                              </div>

                              {/* Fullscreen Zoom Button */}
                              <button
                                onClick={() => {
                                  setSelectedDrawing(activeDrawing);
                                  setIsFullscreenDrawingOpen(true);
                                }}
                                className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/90 text-white hover:text-amber-400 border border-slate-700 hover:border-amber-400/50 shadow-md transition-all cursor-pointer"
                                title="Expand Fullscreen Blueprint"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>

                              {/* Bottom Drawing Notes & Legend */}
                              <div className="absolute bottom-3 left-3 right-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                  <h6 className="text-xs font-bold text-white flex items-center space-x-1.5">
                                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{activeDrawing.title}</span>
                                  </h6>
                                  <p className="text-[11px] text-slate-300 mt-0.5">
                                    {activeDrawing.notes}
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30">
                                    CAD Layer Verified
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* STATUTORY NOC CLEARANCES CHECKLIST */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Single-Window Statutory NOC Clearances</span>
                  </h5>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {selectedApp.clearances.filter(c => c.status === 'APPROVED').length} of {selectedApp.clearances.length} Cleared
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedApp.clearances.map((c, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                        c.status === 'APPROVED'
                          ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                          : c.status === 'REJECTED'
                          ? 'bg-rose-50/40 border-rose-200 text-rose-900'
                          : 'bg-amber-50/40 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-slate-800">{c.name}</span>
                        <span className="text-[10px] text-slate-500">{c.authority}</span>
                        {c.certNo && (
                          <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                            NOC: {c.certNo}
                          </span>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        {c.status === 'APPROVED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Approved
                          </span>
                        )}
                        {c.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            Denied
                          </span>
                        )}
                        {c.status === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Scrutiny
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FEATURE 6: BUILDING STATUS TIMELINE STEPPER */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Statutory Sanction Progression Timeline</span>
                  </h5>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold border border-purple-200">
                    5-Stage Protocol
                  </span>
                </div>

                {/* Timeline Stepper Container */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedApp.timeline.map((stepItem, idx) => {
                    const isDone = stepItem.status === 'COMPLETED';
                    const isInProg = stepItem.status === 'IN_PROGRESS';
                    const isRejected = stepItem.status === 'REJECTED';
                    const isCorrection = stepItem.status === 'CORRECTIONS_REQUESTED';

                    return (
                      <div key={idx} className="relative group">
                        {/* Step Marker Circle */}
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-transform group-hover:scale-110 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isRejected
                            ? 'bg-rose-600 text-white'
                            : isCorrection
                            ? 'bg-blue-600 text-white'
                            : isInProg
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isDone ? <Check className="w-3 h-3" /> : isRejected ? <X className="w-3 h-3" /> : stepItem.step}
                        </div>

                        {/* Step Details */}
                        <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/80 text-xs space-y-1 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <h6 className="font-bold text-slate-900 flex items-center space-x-1.5">
                              <span>Step {stepItem.step}: {stepItem.title}</span>
                              {isDone && <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Done</span>}
                              {isInProg && <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded">In Progress</span>}
                              {isCorrection && <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded">Corrections</span>}
                              {isRejected && <span className="text-[9px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded">Defect/Rejected</span>}
                            </h6>
                            <span className="text-[10px] font-mono text-slate-400 font-medium">
                              {stepItem.date}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600">
                            {stepItem.remark}
                          </p>

                          {stepItem.officer && (
                            <div className="text-[10px] text-slate-500 flex items-center space-x-1 pt-0.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>{stepItem.officer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FEATURE 5: APPROVAL HISTORY AUDIT TRAIL */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                    <span>Statutory Approval History &amp; Audit Log</span>
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono">
                    SHA-256 Verified Trail
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedApp.history.map((hist, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs space-y-1 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            hist.action.includes('SANCTION') || hist.action.includes('APPROVED')
                              ? 'bg-emerald-100 text-emerald-800'
                              : hist.action.includes('REJECT')
                              ? 'bg-rose-100 text-rose-800'
                              : hist.action.includes('CORRECTION')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-200 text-slate-800'
                          }`}>
                            {hist.action}
                          </span>
                          <span className="font-bold text-slate-800">{hist.officer}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{hist.date}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {hist.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Select an Application from the Queue</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Choose a pending building application to inspect drawings, evaluate setback bylaws, and approve or reject permits.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: APPROVE APPLICATION & ISSUE SANCTION PERMIT                      */}
      {/* ========================================================================= */}
      {isApproveModalOpen && selectedApp && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-mono">
                    ISSUE BUILDING SANCTION PERMIT
                  </h3>
                  <p className="text-xs text-slate-500">
                    Application #{selectedApp.applicationId} • {selectedApp.ownerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Compliance Verification Passed</span>
                </p>
                <p className="text-[11px] text-emerald-800">
                  By confirming, you certify that FAR ({selectedApp.proposedFar}), ground coverage ({selectedApp.proposedCoveragePct}%), and setbacks strictly conform to the National Building Code (NBC 2016) and Master Plan regulations.
                </p>
              </div>

              {/* Sanction Validity Years */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Permit Validity Duration
                </label>
                <select
                  value={approveValidityYears}
                  onChange={(e) => setApproveValidityYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden"
                >
                  <option value={1}>1 Year (Minor Residential Construction)</option>
                  <option value={2}>2 Years (Standard Commercial / Multi-Family)</option>
                  <option value={3}>3 Years (Statutory Standard for Urban ULBs)</option>
                  <option value={5}>5 Years (Mega Infrastructure / Industrial)</option>
                </select>
              </div>

              {/* Sanction Conditions */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Sanction Permit Conditions & Covenants
                </label>
                <textarea
                  value={approveConditions}
                  onChange={(e) => setApproveConditions(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-slate-800 font-mono leading-relaxed"
                />
              </div>

              {/* Digital Signature Confirmation */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Signatory: <strong>{officerName}</strong></span>
                <span className="text-emerald-700 font-bold font-mono">DSC Ready (e-Sign)</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Confirm & Release Sanction Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REJECT APPLICATION WITH STATUTORY GROUNDS                        */}
      {/* ========================================================================= */}
      {isRejectModalOpen && selectedApp && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-mono">
                    REJECT BUILDING SANCTION PROPOSAL
                  </h3>
                  <p className="text-xs text-slate-500">
                    Application #{selectedApp.applicationId} • Statutory Notice
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Statutory Notice of Refusal under Municipal Act</span>
                </p>
                <p className="text-[11px] text-rose-800">
                  Refusal will be entered into the state land registry and communicated to the applicant architect with a 30-day appellate window.
                </p>
              </div>

              {/* Legal Statute Clause */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Statutory Rejection Provision
                </label>
                <select
                  value={rejectionStatute}
                  onChange={(e) => setRejectionStatute(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden"
                >
                  <option value="Sec 247(1) - Right-of-Way Infringement">Section 247(1) - Right-of-Way & Road Widening Line Infringement</option>
                  <option value="Sec 248 - Excess Floor Area Ratio (FAR)">Section 248 - Unlawful Excess Floor Area Ratio (FAR) Beyond Permissible Limits</option>
                  <option value="Sec 250 - Fire & Life Safety Hazards">Section 250 - Non-compliance with NBC Part 4 Fire Tender Radius & Egress</option>
                  <option value="Sec 252 - Judicial Stay / Title Dispute">Section 252 - Parcel Sub-Judice or Pending High Court Demarcation Stay</option>
                  <option value="Sec 254 - Hazardous Zone Encroachment">Section 254 - Wetland / Forest / NGT Buffer Zone Restriction</option>
                </select>
              </div>

              {/* Detailed Grounds */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Detailed Legal Grounds & Specific Violations
                </label>
                <textarea
                  value={rejectionGrounds}
                  onChange={(e) => setRejectionGrounds(e.target.value)}
                  rows={4}
                  placeholder="Specify laser setback measurement deficits, master plan corridor clash, fire turning radius denial..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-slate-800 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Execute Statutory Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REQUEST CORRECTIONS / DEFICIENCY MEMO                            */}
      {/* ========================================================================= */}
      {isCorrectionModalOpen && selectedApp && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-mono">
                    DISPATCH DEFICIENCY MEMO & CORRECTION NOTICE
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct Architect / Applicant to Revise Blueprint
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCorrectionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Select the technical deficiencies identified during scrutiny. The architect will receive an encrypted notification to resubmit corrected drawings.
              </p>

              {/* Deficiency Checklist */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                {STATUTORY_CORRECTION_CHECKLIST.map(item => {
                  const isChecked = correctionItems.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex items-start space-x-2.5 p-1.5 rounded hover:bg-white cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setCorrectionItems(prev => prev.filter(x => x !== item.id));
                          } else {
                            setCorrectionItems(prev => [...prev, item.id]);
                          }
                        }}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 block text-xs">{item.label}</span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                          <span>Clause: {item.code}</span>
                          <span>•</span>
                          <span className={
                            item.severity === 'CRITICAL' ? 'text-rose-600 font-bold' : item.severity === 'HIGH' ? 'text-amber-600 font-bold' : 'text-blue-600'
                          }>
                            {item.severity} Severity
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Resubmission Deadline */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Resubmission Window (Days)
                </label>
                <select
                  value={correctionDeadlineDays}
                  onChange={(e) => setCorrectionDeadlineDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden"
                >
                  <option value={7}>7 Calendar Days (Urgent)</option>
                  <option value={15}>15 Calendar Days (Standard ULB Window)</option>
                  <option value={30}>30 Calendar Days (Extensive Redesign)</option>
                </select>
              </div>

              {/* Specific Officer Directives */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Officer Directives & Specific Rectification Notes
                </label>
                <textarea
                  value={correctionDirective}
                  onChange={(e) => setCorrectionDirective(e.target.value)}
                  rows={3}
                  placeholder="e.g., Set back front building line by 0.6m to accommodate 30m RoW corridor. Provide 4 additional EV charging bays in stilt area."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-800 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsCorrectionModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCorrectionConfirm}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Issue Statutory Deficiency Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FULLSCREEN BLUEPRINT CAD VIEWER                                  */}
      {/* ========================================================================= */}
      {isFullscreenDrawingOpen && selectedDrawing && (
        <div className="fixed inset-0 z-[3500] bg-slate-950/95 backdrop-blur-md flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black font-mono tracking-wide">
                  {selectedDrawing.title} ({selectedDrawing.id})
                </h3>
                <p className="text-xs text-slate-400">
                  Scale {selectedDrawing.scale} • {selectedDrawing.category} • {selectedApp?.applicationId}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open(selectedDrawing.url, '_blank')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open High-Res</span>
              </button>
              <button
                onClick={() => setIsFullscreenDrawingOpen(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
            <img
              src={selectedDrawing.url}
              alt={selectedDrawing.title}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
            />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf80f_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <p className="font-mono">
              Notes: {selectedDrawing.notes}
            </p>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              National Building Code (NBC 2016) Geometric Scrutiny
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: OFFICIAL MUNICIPAL BUILDING SANCTION ORDER PERMIT               */}
      {/* ========================================================================= */}
      {isSanctionPermitOpen && selectedApp?.sanctionPermit && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Statutory Permitting Document
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Permit</span>
                </button>
                <button
                  onClick={() => setIsSanctionPermitOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Certificate Canvas */}
            <div className="border-4 border-double border-slate-900 p-6 rounded-xl bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10 text-slate-900 relative space-y-4">
              {/* Emblem Header */}
              <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900">
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-slate-900 flex items-center justify-center bg-amber-500/10 mb-1">
                  <Building className="w-6 h-6 text-slate-950" />
                </div>
                <h2 className="text-base font-black uppercase tracking-wider font-mono">
                  {selectedApp.municipality}
                </h2>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                  OFFICE OF THE MUNICIPAL COMMISSIONER &amp; TOWN PLANNING AUTHORITY
                </h4>
                <p className="text-[10px] text-slate-500 font-serif italic">
                  Sanction Granted under Section 247 of the Municipal Corporation Act &amp; National Building Code (NBC 2016)
                </p>
              </div>

              {/* Permit Identification */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono bg-slate-100 p-2.5 rounded-lg border border-slate-300">
                <div>
                  <span className="text-slate-500 text-[10px] block">PERMIT SANCTION NUMBER:</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedApp.sanctionPermit.permitNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DATE OF ISSUE:</span>
                  <span className="font-bold text-slate-900">{selectedApp.sanctionPermit.sanctionDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">VALID TILL:</span>
                  <span className="font-bold text-emerald-700">{selectedApp.sanctionPermit.expiryDate} ({selectedApp.sanctionPermit.validityYears} Yrs)</span>
                </div>
              </div>

              {/* Main Grant Text */}
              <p className="text-xs leading-relaxed text-slate-800 font-serif text-justify">
                Sanction is hereby accorded to <strong>{selectedApp.ownerName}</strong> for the proposed construction of <strong>{selectedApp.buildingCategory}</strong> ({selectedApp.sanctionPermit.permittedFloors}) on Plot bearing Property ID <strong>{selectedApp.propertyId}</strong> and Bhu-Aadhaar (ULPIN) <strong>{selectedApp.ulpin}</strong> situated at {selectedApp.wardNo}, subject to strict adherence to the approved architectural drawings and statutory covenants set forth hereunder.
              </p>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-amber-50/50 p-3 rounded-lg border border-amber-200">
                <div>
                  <span className="text-slate-500 font-mono text-[10px]">Permitted FAR:</span>
                  <span className="font-bold font-mono ml-1">{selectedApp.sanctionPermit.permittedFar}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px]">Plot Area:</span>
                  <span className="font-bold font-mono ml-1">{selectedApp.plotAreaSqYd} sq.yd ({selectedApp.plotAreaSqM} sq.m)</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px]">Permitted Floors:</span>
                  <span className="font-bold ml-1">{selectedApp.sanctionPermit.permittedFloors}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px]">Fire NOC Ref:</span>
                  <span className="font-bold ml-1">{selectedApp.clearances[0]?.certNo || 'CLEARED'}</span>
                </div>
              </div>

              {/* Conditions */}
              <div className="text-[11px] text-slate-700 space-y-1">
                <span className="font-bold uppercase tracking-wide text-[10px] text-slate-900">Statutory Conditions:</span>
                <pre className="whitespace-pre-wrap font-sans bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px] text-slate-600 leading-normal">
                  {selectedApp.sanctionPermit.conditions}
                </pre>
              </div>

              {/* Signatures */}
              <div className="pt-4 flex items-end justify-between text-xs border-t border-slate-300">
                <div className="text-center space-y-1">
                  <div className="w-16 h-16 border border-slate-400 bg-slate-50 flex items-center justify-center font-mono text-[9px] text-slate-400">
                    [QR SEAL]
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block">NIC Cloud Validated</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-script text-slate-700 text-sm italic">
                    Digitally Signed
                  </div>
                  <p className="font-bold text-slate-900 text-[11px]">{officerName}</p>
                  <p className="text-[10px] text-slate-500">Authorized Municipal Officer &amp; ULB Nodal</p>
                  <p className="text-[9px] font-mono text-emerald-700">SHA-256 e-Sign Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
