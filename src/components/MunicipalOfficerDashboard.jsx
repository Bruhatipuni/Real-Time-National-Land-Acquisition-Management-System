import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Upload, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  FolderCheck, 
  Filter, 
  Check, 
  X, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  Maximize2, 
  RefreshCw, 
  Eye, 
  Trash2, 
  Tag, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { MUNICIPAL_PROPERTIES_DATA, MUNICIPAL_STATS } from '../data/municipalPropertiesData';
import LAODocumentManagement from './LAODocumentManagement';

export default function MunicipalOfficerDashboard({ currentUser }) {
  // Sub-module navigation state: 'verification' (Property Verification Queue) | 'documents' (LAO Document Management)
  const [activeSubModule, setActiveSubModule] = useState('verification');

  // Local state for properties to support live interactive updates
  const [properties, setProperties] = useState(MUNICIPAL_PROPERTIES_DATA);
  const [selectedPropertyId, setSelectedPropertyId] = useState(MUNICIPAL_PROPERTIES_DATA[0]?.propertyId);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED'
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'Commercial' | 'Residential' | 'Industrial' | 'Mixed Use'
  const [ulbFilter, setUlbFilter] = useState('ALL');

  // Remarks draft state
  const [draftRemark, setDraftRemark] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Photo Lightbox modal state
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  // Rejection modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Digital Certificate Modal state
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Add Photo Modal state & data
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [newPhotoData, setNewPhotoData] = useState({
    title: '',
    tag: 'Setback Compliance',
    url: '',
    geotag: '',
    notes: ''
  });

  // Current logged in officer info
  const officerName = currentUser?.name || "Sanjay Deshmukh (Municipal Officer)";
  const officerDept = currentUser?.roleObj?.department || "Urban Local Body / Municipal Corporation";

  // Selected property object
  const selectedProperty = useMemo(() => {
    return properties.find(p => p.propertyId === selectedPropertyId) || properties[0];
  }, [properties, selectedPropertyId]);

  // Filtered properties based on Search Query, Status, Type, ULB
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        prop.propertyId.toLowerCase().includes(q) ||
        prop.ownerId.toLowerCase().includes(q) ||
        prop.ownerName.toLowerCase().includes(q) ||
        prop.aadhaarMasked.toLowerCase().includes(q) ||
        prop.ulpin.toLowerCase().includes(q) ||
        prop.surveyNo.toLowerCase().includes(q) ||
        prop.khataNo.toLowerCase().includes(q)
      );

      const matchesStatus = statusFilter === 'ALL' || prop.verificationStatus === statusFilter;
      const matchesType = typeFilter === 'ALL' || prop.landType === typeFilter;
      const matchesUlb = ulbFilter === 'ALL' || prop.municipality.includes(ulbFilter);

      return matchesSearch && matchesStatus && matchesType && matchesUlb;
    });
  }, [properties, searchQuery, statusFilter, typeFilter, ulbFilter]);

  // Dynamic KPI Stats calculated from current state
  const stats = useMemo(() => {
    const total = properties.length;
    const verified = properties.filter(p => p.verificationStatus === 'VERIFIED').length;
    const pending = properties.filter(p => p.verificationStatus === 'PENDING').length;
    const rejected = properties.filter(p => p.verificationStatus === 'REJECTED').length;
    return {
      total,
      verified,
      pending,
      rejected,
      complianceRate: total > 0 ? Math.round((verified / total) * 100) : 0
    };
  }, [properties]);

  // Flash feedback toast notification
  const showFeedback = (text, type = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // Handler: Approve Verification
  const handleApprove = () => {
    if (!selectedProperty) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRemarkItem = {
      date: now,
      officer: officerName,
      status: 'VERIFIED',
      note: draftRemark.trim() || 'Municipal boundary & masterplan zoning verified and approved for statutory land acquisition.'
    };

    setProperties(prev => prev.map(p => {
      if (p.propertyId === selectedProperty.propertyId) {
        return {
          ...p,
          verificationStatus: 'VERIFIED',
          rejectionReason: null,
          inspectionDate: new Date().toISOString().split('T')[0],
          inspectedBy: officerName,
          officerRemarks: draftRemark.trim() || p.officerRemarks,
          remarksHistory: [newRemarkItem, ...(p.remarksHistory || [])],
          checklist: {
            boundaryMatch: true,
            zoningCompliance: true,
            setbackApproved: true,
            noIllegalEncroachment: true,
            taxNocCleared: true
          }
        };
      }
      return p;
    }));

    setDraftRemark('');
    showFeedback(`Property ${selectedProperty.propertyId} has been successfully VERIFIED & sign-off recorded!`, 'success');
  };

  // Handler: Reject Verification
  const handleRejectConfirm = () => {
    if (!selectedProperty || !rejectionReasonInput.trim()) {
      alert("Please state the official statutory grounds for rejection.");
      return;
    }
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const reasonText = rejectionReasonInput.trim();
    const newRemarkItem = {
      date: now,
      officer: officerName,
      status: 'REJECTED',
      note: `REJECTED: ${reasonText}`
    };

    setProperties(prev => prev.map(p => {
      if (p.propertyId === selectedProperty.propertyId) {
        return {
          ...p,
          verificationStatus: 'REJECTED',
          rejectionReason: reasonText,
          inspectionDate: new Date().toISOString().split('T')[0],
          inspectedBy: officerName,
          officerRemarks: `REJECTED: ${reasonText}`,
          remarksHistory: [newRemarkItem, ...(p.remarksHistory || [])]
        };
      }
      return p;
    }));

    setRejectionReasonInput('');
    setIsRejectModalOpen(false);
    showFeedback(`Property ${selectedProperty.propertyId} verification has been REJECTED. Objection logged.`, 'error');
  };

  // Handler: Reset / Mark Pending
  const handleResetPending = () => {
    if (!selectedProperty) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRemarkItem = {
      date: now,
      officer: officerName,
      status: 'PENDING',
      note: 'Status reverted to PENDING for additional on-site inspection & document re-scrutiny.'
    };

    setProperties(prev => prev.map(p => {
      if (p.propertyId === selectedProperty.propertyId) {
        return {
          ...p,
          verificationStatus: 'PENDING',
          rejectionReason: null,
          remarksHistory: [newRemarkItem, ...(p.remarksHistory || [])]
        };
      }
      return p;
    }));

    showFeedback(`Property ${selectedProperty.propertyId} reverted to PENDING status.`, 'info');
  };

  // Handler: Toggle Checklist Item
  const handleToggleChecklist = (key) => {
    if (!selectedProperty) return;
    setProperties(prev => prev.map(p => {
      if (p.propertyId === selectedProperty.propertyId) {
        return {
          ...p,
          checklist: {
            ...p.checklist,
            [key]: !p.checklist?.[key]
          }
        };
      }
      return p;
    }));
  };

  // Handler: Append Officer Remark
  const handleSaveRemark = () => {
    if (!draftRemark.trim() || !selectedProperty) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRemarkItem = {
      date: now,
      officer: officerName,
      status: selectedProperty.verificationStatus,
      note: draftRemark.trim()
    };

    setProperties(prev => prev.map(p => {
      if (p.propertyId === selectedProperty.propertyId) {
        return {
          ...p,
          officerRemarks: draftRemark.trim(),
          remarksHistory: [newRemarkItem, ...(p.remarksHistory || [])]
        };
      }
      return p;
    }));

    setDraftRemark('');
    showFeedback("Officer observation saved to immutable inspection log.", 'success');
  };

  // Quick Remark Templates
  const applyTemplate = (text) => {
    setDraftRemark(prev => prev ? `${prev} ${text}` : text);
  };

  // Handler: Upload Real Photos via File Input
  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProperty) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target.result;
        const now = new Date().toLocaleString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const newPhoto = {
          id: `PHT-UPL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: file.name.replace(/\.[^/.]+$/, "") || "On-Site Inspection Photo",
          tag: "Field Verification",
          url: dataUrl,
          timestamp: `${now}`,
          geotag: "28.4595° N, 77.0266° E (Device GPS)",
          notes: `Uploaded by ${officerName} via Mobile Inspection Gateway`
        };

        setProperties(prev => prev.map(p => {
          if (p.propertyId === selectedProperty.propertyId) {
            return {
              ...p,
              photos: [newPhoto, ...(p.photos || [])]
            };
          }
          return p;
        }));

        showFeedback(`Uploaded inspection photo: ${file.name}`, 'success');
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Handler: Delete photo
  const handleDeletePhoto = (photoId) => {
    if (!selectedProperty) return;
    setProperties(prev => prev.map(p => {
      if (p.propertyId === selectedProperty.propertyId) {
        return {
          ...p,
          photos: (p.photos || []).filter(ph => ph.id !== photoId)
        };
      }
      return p;
    }));
    showFeedback("Inspection photo removed.", 'info');
  };

  // Handler: Add Photo manually (via URL or Form)
  const handleAddPhotoManual = (e) => {
    e?.preventDefault?.();
    if (!selectedProperty) return;
    if (!newPhotoData.title.trim() && !newPhotoData.url.trim()) {
      showFeedback("Please provide a photo title or image link.", 'error');
      return;
    }

    const now = new Date().toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const addedPhoto = {
      id: `PHT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: newPhotoData.title.trim() || "Field Inspection Photo",
      tag: newPhotoData.tag || "Field Verification",
      url: newPhotoData.url.trim() || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%230f172a'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-family='sans-serif' font-weight='bold' font-size='15'>PHOTO EVIDENCE RECORDED</text></svg>",
      timestamp: `${now}`,
      geotag: newPhotoData.geotag.trim() || `${selectedProperty.zone || '28.4595° N, 77.0266° E'}`,
      notes: newPhotoData.notes.trim() || `Recorded by ${officerName}`
    };

    setProperties(prev => prev.map(p => {
      if (p.propertyId === selectedProperty.propertyId) {
        return {
          ...p,
          photos: [addedPhoto, ...(p.photos || [])]
        };
      }
      return p;
    }));

    setIsAddPhotoModalOpen(false);
    setNewPhotoData({
      title: '',
      tag: 'Setback Compliance',
      url: '',
      geotag: '',
      notes: ''
    });
    showFeedback("Inspection evidence photo added successfully.", 'success');
  };

  const handleOpenAddPhotoForSlot = (slotTitle, slotTag, defaultNotes) => {
    setNewPhotoData({
      title: slotTitle,
      tag: slotTag,
      url: '',
      geotag: '28.4595° N, 77.0266° E (Site Peg)',
      notes: defaultNotes || ''
    });
    setIsAddPhotoModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5 font-sans">
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

      {/* Header Banner - Municipal Officer Portal */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black font-mono tracking-tight text-white">
                  MUNICIPAL OFFICER PROPERTY VERIFICATION
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  ULB NODAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5 font-medium">
                <span>{officerName}</span>
                <span>•</span>
                <span className="text-amber-400">{officerDept}</span>
                <span>•</span>
                <span className="text-slate-500">Masterplan Zoning & Cadastral Verification</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block font-mono text-[11px]">
              <div className="text-slate-400">Statutory Authority:</div>
              <div className="text-emerald-400 font-bold">Section 3A / DILRMP 3.0</div>
            </div>
            <button
              onClick={() => {
                setProperties(MUNICIPAL_PROPERTIES_DATA);
                showFeedback("Re-synced properties dataset from NIC ULB Cloud Database.", 'info');
              }}
              title="Sync latest records from NIC Gateway"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 flex items-center space-x-1.5 font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Sync Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Module Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubModule('verification')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubModule === 'verification'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Property Verification Queue</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeSubModule === 'verification' ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 text-slate-700'
            }`}>
              {properties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubModule('documents')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubModule === 'documents'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>LAO Statutory Document Management</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeSubModule === 'documents' ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              6 Docs
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium px-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Municipal Portal Active • {officerName}</span>
        </div>
      </div>

      {activeSubModule === 'documents' ? (
        <LAODocumentManagement currentUser={currentUser} properties={properties} />
      ) : (
        <>
          {/* KPI Stats Bar with Sovereign Status Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Properties */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider block">
              Under Jurisdiction
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              {stats.total}
            </div>
            <span className="text-[10px] font-semibold text-slate-500">
              Corridor urban parcels
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Verified Badge Counter */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">
              Verified Properties
            </span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
              {stats.verified}
            </div>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.complianceRate}% Completed</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white rounded-xl p-4 border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-amber-800 tracking-wider block">
              Pending Verification
            </span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">
              {stats.pending}
            </div>
            <span className="text-[10px] font-bold text-amber-700 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Inspection in progress</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Rejected Verification */}
        <div className="bg-white rounded-xl p-4 border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-rose-800 tracking-wider block">
              Rejected / Flagged
            </span>
            <div className="text-2xl font-black text-rose-600 font-mono mt-0.5">
              {stats.rejected}
            </div>
            <span className="text-[10px] font-bold text-rose-700 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Bylaw & RoW violations</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Module Layout: Master Search & List (Left) + Detailed Verification Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Search Property ID / Owner ID & Property Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Module Section Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <Search className="w-4 h-4 text-amber-600" />
                <span>Property Verification Queue</span>
              </h3>
              <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full">
                {filteredProperties.length} / {properties.length}
              </span>
            </div>

            {/* Search Input: Property ID / Owner ID */}
            <div className="relative mb-2.5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Property ID, Owner ID, Aadhaar, ULPIN..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Badges (All, Verified, Pending, Rejected) */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] font-extrabold">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({properties.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-2 py-1 rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${
                  statusFilter === 'PENDING'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Pending ({stats.pending})</span>
              </button>
              <button
                onClick={() => setStatusFilter('VERIFIED')}
                className={`px-2 py-1 rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${
                  statusFilter === 'VERIFIED'
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>Verified ({stats.verified})</span>
              </button>
              <button
                onClick={() => setStatusFilter('REJECTED')}
                className={`px-2 py-1 rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${
                  statusFilter === 'REJECTED'
                    ? 'bg-rose-600 text-white font-black shadow-xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <X className="w-3 h-3" />
                <span>Rejected ({stats.rejected})</span>
              </button>
            </div>

            {/* Secondary Filter: Property Type */}
            <div className="mt-2.5 flex items-center space-x-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center space-x-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Type:</span>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Property Types</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed Use">Mixed Use</option>
              </select>
            </div>
          </div>

          {/* Properties List Scroll Area */}
          <div className="max-h-[640px] overflow-y-auto divide-y divide-slate-100">
            {filteredProperties.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Building className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <div className="text-xs font-bold text-slate-600">No matching properties</div>
                <p className="text-[11px] text-slate-400">
                  Try searching by different Property ID (e.g. PROP-MCG-2026-081) or Owner ID.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setTypeFilter('ALL'); }}
                  className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredProperties.map((prop) => {
                const isSelected = prop.propertyId === selectedProperty?.propertyId;
                return (
                  <div
                    key={prop.propertyId}
                    onClick={() => setSelectedPropertyId(prop.propertyId)}
                    className={`p-3.5 transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'bg-amber-50/50 border-l-4 border-l-amber-500' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {/* Property ID & Owner ID */}
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-mono text-xs font-black text-slate-900">
                            {prop.propertyId}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {prop.ownerId}
                          </span>
                        </div>

                        {/* Owner Name */}
                        <div className="text-xs font-bold text-slate-700 mt-1 flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{prop.ownerName}</span>
                        </div>

                        {/* Municipality & Ward */}
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{prop.wardNo}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 flex flex-col items-end space-y-1">
                        {prop.verificationStatus === 'VERIFIED' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Verified</span>
                          </span>
                        )}
                        {prop.verificationStatus === 'PENDING' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                        {prop.verificationStatus === 'REJECTED' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                            <X className="w-3 h-3 stroke-[3]" />
                            <span>Rejected</span>
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-400">
                          {prop.landType}
                        </span>
                      </div>
                    </div>

                    {/* Footer Row: Photo count & Survey No */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Survey: {prop.surveyNo} (Khata {prop.khataNo})</span>
                      <span className="flex items-center space-x-1 font-bold text-slate-600">
                        <Camera className="w-3 h-3 text-slate-400" />
                        <span>{prop.photos?.length || 0} photos</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Property Details Verification Dossier (8 cols) */}
        {selectedProperty && (
          <div className="lg:col-span-8 space-y-5">
            
            {/* 1. Master Property Dossier Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-base font-black font-mono text-slate-900">
                      {selectedProperty.propertyId}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 text-amber-400">
                      ULPIN: {selectedProperty.ulpin}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      Owner ID: {selectedProperty.ownerId}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center space-x-2">
                    <span>{selectedProperty.ownerName}</span>
                    <span className="text-xs font-medium text-slate-500 font-mono">
                      (Aadhaar: {selectedProperty.aadhaarMasked})
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{selectedProperty.municipality}</span>
                    <span>•</span>
                    <span>{selectedProperty.wardNo}</span>
                  </p>
                </div>

                {/* Prominent Status Badge & Digital Stamp Link */}
                <div className="flex flex-col sm:items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    {selectedProperty.verificationStatus === 'VERIFIED' && (
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        <span className="text-xs font-black tracking-wide uppercase font-mono">
                          STATUS: VERIFIED
                        </span>
                      </div>
                    )}
                    {selectedProperty.verificationStatus === 'PENDING' && (
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 shadow-xs animate-pulse">
                        <Clock className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                        <span className="text-xs font-black tracking-wide uppercase font-mono">
                          STATUS: PENDING
                        </span>
                      </div>
                    )}
                    {selectedProperty.verificationStatus === 'REJECTED' && (
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-300 shadow-xs">
                        <XCircle className="w-4 h-4 text-rose-600 stroke-[2.5]" />
                        <span className="text-xs font-black tracking-wide uppercase font-mono">
                          STATUS: REJECTED
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedProperty.verificationStatus === 'VERIFIED' && (
                    <button
                      onClick={() => setIsCertModalOpen(true)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 hover:underline cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View ULB Verification Certificate</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rejection Alert Banner if status is REJECTED */}
              {selectedProperty.verificationStatus === 'REJECTED' && selectedProperty.rejectionReason && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start space-x-3 text-rose-900">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-black uppercase tracking-wide text-rose-700">
                      Official Rejection Grounds (Municipal Notice Issued)
                    </div>
                    <p className="text-xs font-medium text-rose-800 leading-relaxed">
                      {selectedProperty.rejectionReason}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Comprehensive Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Column 1: Municipal Masterplan & Zoning */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Masterplan & Zoning</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Master Plan 2031:</span>
                    <span className="font-bold text-slate-900">{selectedProperty.masterPlanZoning}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Zone / Corridor:</span>
                    <span className="font-bold text-slate-900">{selectedProperty.zone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Land Classification:</span>
                    <span className="font-extrabold text-amber-700">{selectedProperty.landType}</span>
                  </div>
                </div>

                {/* Column 2: Dimensions & Structures */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>Physical Dimensions</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Plot / Cadastral Area:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {selectedProperty.totalAreaSqYards.toLocaleString()} sq.yd ({selectedProperty.areaHectares} Ha)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Built-up Area:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {selectedProperty.builtUpAreaSqFt.toLocaleString()} sq.ft
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Structure Type:</span>
                    <span className="font-bold text-slate-800">{selectedProperty.constructionType}</span>
                  </div>
                </div>

                {/* Column 3: Legal, Tax & Valuations */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tax & Valuation</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Property Tax Status:</span>
                    <span className="font-bold text-slate-900">{selectedProperty.propertyTaxStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Encumbrance (EC):</span>
                    <span className="font-bold text-slate-900">{selectedProperty.encumbranceCertificate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Assessed Compensation:</span>
                    <span className="font-mono font-black text-emerald-700">
                      ₹{selectedProperty.compensationAssessedCr} Crores
                    </span>
                  </div>
                </div>
              </div>

              {/* Setback Status Callout */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Right-of-Way & Setback Compliance: </span>
                    <span className="text-slate-700">{selectedProperty.setbackStatus}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0 ml-2">
                  Survey: {selectedProperty.surveyNo}
                </span>
              </div>

              {/* 3. Interactive Municipal Verification Checklist */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Statutory Municipal Verification Checklist</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Toggle items to verify during field inspection
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center space-x-2.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProperty.checklist?.boundaryMatch || false}
                      onChange={() => handleToggleChecklist('boundaryMatch')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">
                      Cadastral Boundary matches DILRMP geo-coordinates
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProperty.checklist?.zoningCompliance || false}
                      onChange={() => handleToggleChecklist('zoningCompliance')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">
                      Masterplan 2031 land-use zoning compliant
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProperty.checklist?.setbackApproved || false}
                      onChange={() => handleToggleChecklist('setbackApproved')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">
                      Front & side setbacks conform to ULB building bylaws
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProperty.checklist?.noIllegalEncroachment || false}
                      onChange={() => handleToggleChecklist('noIllegalEncroachment')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">
                      Zero unauthorized encroachment on municipal road RoW
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer md:col-span-2">
                    <input
                      type="checkbox"
                      checked={selectedProperty.checklist?.taxNocCleared || false}
                      onChange={() => handleToggleChecklist('taxNocCleared')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">
                      Municipal property tax, water betterment dues & urban cess cleared
                    </span>
                  </label>
                </div>
              </div>

              {/* 4. Action Buttons: Approve / Reject Verification */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-slate-500">
                  Last Inspection: <span className="font-bold text-slate-800">{selectedProperty.inspectionDate || 'Not recorded'}</span> by <span className="text-amber-700 font-semibold">{selectedProperty.inspectedBy || officerName}</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  {/* Revert / Re-open Button if already decided */}
                  {selectedProperty.verificationStatus !== 'PENDING' && (
                    <button
                      onClick={handleResetPending}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-300 font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Re-Open Verification</span>
                    </button>
                  )}

                  {/* Reject Verification Button */}
                  <button
                    onClick={() => {
                      setRejectionReasonInput(selectedProperty.rejectionReason || '');
                      setIsRejectModalOpen(true);
                    }}
                    className={`text-xs px-4 py-2 rounded-xl border font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      selectedProperty.verificationStatus === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800 border-rose-300 cursor-default'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border-rose-300 shadow-xs'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{selectedProperty.verificationStatus === 'REJECTED' ? 'Edit Rejection' : 'Reject Verification'}</span>
                  </button>

                  {/* Approve Verification Button */}
                  <button
                    onClick={handleApprove}
                    className={`text-xs px-4 py-2 rounded-xl font-black transition-all flex items-center space-x-1.5 shadow-md cursor-pointer ${
                      selectedProperty.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
                    <span>{selectedProperty.verificationStatus === 'VERIFIED' ? 'Approved (Re-Confirm)' : 'Approve Verification'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Inspection Photos Module (Upload, Add & Evidence Layout) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Inspection Photos &amp; Visual Evidence</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Upload or attach geotagged field photos, structural elevation, and RoW setback evidence
                  </p>
                </div>

                {/* Upload & Add Buttons */}
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="photo-upload-input"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload-input"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                    <span>Upload From Device</span>
                  </label>

                  <button
                    onClick={() => {
                      setNewPhotoData({
                        title: '',
                        tag: 'Setback Compliance',
                        url: '',
                        geotag: '28.4595° N, 77.0266° E (Site Peg)',
                        notes: ''
                      });
                      setIsAddPhotoModalOpen(true);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all border border-slate-200 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Add Photo Link</span>
                  </button>
                </div>
              </div>

              {/* Photo Evidence Slots & Layout */}
              {(!selectedProperty.photos || selectedProperty.photos.length === 0) ? (
                <div className="space-y-4">
                  {/* Empty state Dropzone */}
                  <div 
                    onClick={() => document.getElementById('photo-upload-input')?.click()}
                    className="p-8 text-center border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/60 hover:bg-amber-50/20 rounded-2xl transition-all cursor-pointer group space-y-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs">
                      <Camera className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800">
                        Drag &amp; drop inspection photos here, or <span className="text-amber-600 underline">browse files</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Upload field camera shots, drone cadastral orthophotos, or geo-pegging snapshots (JPG, PNG, WebP)
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        Max 15MB/file
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        GPS Geotag Auto-Extraction
                      </span>
                    </div>
                  </div>

                  {/* Statutory Evidence Template Slots */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Statutory Required Photo Slots for {selectedProperty.propertyId}</span>
                      <span className="text-amber-700 font-mono text-[10px]">3 Standard Angles</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Slot 1: Front Elevation & RoW Setback */}
                      <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                              Mandatory Setback
                            </span>
                            <Camera className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">
                            Front Elevation &amp; RoW Setback
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Capture 4.5m front yard setback measurement with reference to right-of-way corridor.
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenAddPhotoForSlot(
                            "Front Elevation & RoW Setback Buffer", 
                            "Setback Compliance",
                            "Front setback verified with laser tape."
                          )}
                          className="w-full bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-400 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Upload className="w-3 h-3 text-amber-600" />
                          <span>+ Add Photo</span>
                        </button>
                      </div>

                      {/* Slot 2: Cadastral Boundary Marker Peg */}
                      <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                              Boundary Validation
                            </span>
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">
                            Cadastral Boundary Peg #01
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Photograph fixed pillar/peg corner aligning with DILRMP ULPIN cadastral map.
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenAddPhotoForSlot(
                            "Municipal Boundary Pillar Peg", 
                            "Cadastral Boundary",
                            "ULPIN benchmark monument verified firmly intact."
                          )}
                          className="w-full bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-400 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Upload className="w-3 h-3 text-amber-600" />
                          <span>+ Add Photo</span>
                        </button>
                      </div>

                      {/* Slot 3: Utility Corridor & Drainage Easement */}
                      <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                              Easement Check
                            </span>
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">
                            Side Access &amp; Utility Easement
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Verify side setback and clear access lane free of unauthorized sheds or overhangs.
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenAddPhotoForSlot(
                            "Structure Side Access & Drainage Easement", 
                            "Utility Easement",
                            "Clear side passage without unauthorized temporary shed."
                          )}
                          className="w-full bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-400 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Upload className="w-3 h-3 text-amber-600" />
                          <span>+ Add Photo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Gallery Grid when photos are uploaded */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {selectedProperty.photos.map((photo) => (
                    <div 
                      key={photo.id}
                      className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-xs"
                    >
                      {/* Thumbnail Image */}
                      <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%230f172a'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-family='sans-serif' font-weight='bold' font-size='14'>PHOTO RECORDED</text></svg>";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 justify-between">
                          <button
                            onClick={() => setActivePhotoModal(photo)}
                            className="bg-white/90 hover:bg-white text-slate-900 p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            title="Remove photo"
                            className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg shadow-sm cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Photo Tag Badge */}
                        <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-950/80 text-amber-400 backdrop-blur-xs font-mono border border-slate-800">
                          {photo.tag}
                        </span>
                      </div>

                      {/* Metadata Strip below photo */}
                      <div className="p-2.5 bg-white text-slate-800 space-y-1">
                        <div className="text-xs font-bold truncate text-slate-900">
                          {photo.title}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center space-x-1 truncate">
                            <MapPin className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                            <span className="truncate">{photo.geotag || 'GPS Tagged'}</span>
                          </span>
                          <span className="shrink-0">{photo.timestamp?.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Another Photo Card */}
                  <div
                    onClick={() => {
                      setNewPhotoData({
                        title: '',
                        tag: 'Field Verification',
                        url: '',
                        geotag: '28.4595° N, 77.0266° E (Site Peg)',
                        notes: ''
                      });
                      setIsAddPhotoModalOpen(true);
                    }}
                    className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all aspect-video"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-700">+ Add Another Photo</div>
                    <div className="text-[10px] text-slate-400 text-center">Upload file or paste link</div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Officer Remarks & Statutory Observations Module */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Municipal Officer Remarks & Field Inspection Notes</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Officer: <strong className="text-slate-800">{officerName}</strong>
                </span>
              </div>

              {/* Quick Remark Template Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Quick Insert Statutory Templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyTemplate("All municipal setbacks and master plan zoning parameters verified compliant with ULB bylaws.")}
                    className="text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    + Fully Compliant with Bylaws
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("Physical inspection completed. Zero encroachment detected along right-of-way corridor.")}
                    className="text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    + Zero RoW Encroachment
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("Setback violation observed with cantilever projection encroaching 0.65m into municipal buffer.")}
                    className="text-[11px] bg-slate-100 hover:bg-rose-100 hover:text-rose-900 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    + Setback Violation Detected
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("Pending municipal property tax dues. Regularization certificate withheld pending receipt.")}
                    className="text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    + Pending Property Tax
                  </button>
                </div>
              </div>

              {/* Active Remarks Textarea */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={draftRemark}
                  onChange={(e) => setDraftRemark(e.target.value)}
                  placeholder="Record detailed field survey remarks, setbacks measurements, building plan sanction details, or conditions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Official record will be cryptographically hashed to BhuStack DILRMP 3.0 Ledger
                  </span>
                  <button
                    onClick={handleSaveRemark}
                    disabled={!draftRemark.trim()}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      draftRemark.trim()
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />
                    <span>Save & Log Officer Remark</span>
                  </button>
                </div>
              </div>

              {/* Chronological Remarks History */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Remarks History & Audit Trail:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(selectedProperty.remarksHistory || []).map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-slate-800">{item.officer}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                            item.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-slate-400">{item.date}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* REJECTION REASON MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-700">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-black uppercase tracking-wide">
                  Reject Property Verification
                </h3>
              </div>
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                You are rejecting verification for property <strong className="text-slate-900 font-mono">{selectedProperty?.propertyId}</strong> ({selectedProperty?.ownerName}). Please declare the statutory grounds:
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Preset Statutory Grounds:
                </label>
                <div className="space-y-1.5">
                  {[
                    "Encroachment on municipal road buffer & Right-of-Way (RoW)",
                    "Unauthorized structure exceeding permissible Floor Area Ratio (FAR)",
                    "Severe setback violation along corridor utility alignment",
                    "Boundary overlap discrepancy with municipal stormwater easement",
                    "Active court stay / litigation pending under High Court caveat"
                  ].map((ground, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRejectionReasonInput(ground)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-900 border border-slate-200 hover:border-rose-300 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                    >
                      • {ground}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Detailed Rejection Justification / Order Note:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="Specify measurements, violation act section, and required remedial action..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-4 py-2 rounded-xl font-black shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Confirm Rejection & Issue Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PHOTO EVIDENCE MODAL */}
      {isAddPhotoModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900 relative">
            <button
              onClick={() => setIsAddPhotoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Camera className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Add Inspection Photo Evidence</h3>
                <p className="text-[11px] text-slate-500 font-medium">Property: {selectedProperty.propertyId} • {selectedProperty.municipality}</p>
              </div>
            </div>

            <form onSubmit={handleAddPhotoManual} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Photo Title / Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Front Setback Laser Measurement Peg #01"
                  value={newPhotoData.title}
                  onChange={(e) => setNewPhotoData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Evidence Category
                  </label>
                  <select
                    value={newPhotoData.tag}
                    onChange={(e) => setNewPhotoData(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Setback Compliance">Setback Compliance</option>
                    <option value="Cadastral Boundary">Cadastral Boundary</option>
                    <option value="Structural Integrity">Structural Integrity</option>
                    <option value="Utility Easement">Utility Easement</option>
                    <option value="Encroachment Evidence">Encroachment Evidence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Geotag / GPS Coordinate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 28.4595° N, 77.0266° E"
                    value={newPhotoData.geotag}
                    onChange={(e) => setNewPhotoData(prev => ({ ...prev, geotag: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Photo Link / Image URL (Optional or upload local file below)
                </label>
                <div className="relative">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    placeholder="https://... or paste image URL / data URI"
                    value={newPhotoData.url}
                    onChange={(e) => setNewPhotoData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Officer Field Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Record laser measurements, pillar condition, or bylaw observation..."
                  value={newPhotoData.notes}
                  onChange={(e) => setNewPhotoData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label 
                  htmlFor="photo-upload-input"
                  onClick={() => setIsAddPhotoModalOpen(false)}
                  className="text-amber-700 hover:text-amber-800 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose local file instead</span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPhotoModalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Add Evidence Photo
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO LIGHTBOX MODAL */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-3">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold">{activePhotoModal.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  {activePhotoModal.tag}
                </span>
              </div>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High Resolution Image */}
            <div className="max-h-[500px] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.title}
                className="max-h-[480px] w-auto object-contain"
              />
            </div>

            {/* Metadata Footer */}
            <div className="p-4 bg-slate-950 text-slate-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 text-amber-400 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>GPS: {activePhotoModal.geotag || '28.4595° N, 77.0266° E'}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {activePhotoModal.notes || 'Verified field inspection photograph'}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono text-right">
                <div>Timestamp: {activePhotoModal.timestamp}</div>
                <div>Hash: SHA256-IMG-{activePhotoModal.id}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL VERIFICATION CERTIFICATE MODAL */}
      {isCertModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border-4 border-double border-amber-500/40 space-y-4 text-slate-900 relative">
            <button
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-1 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-400 text-amber-800 mx-auto flex items-center justify-center font-bold">
                <Building className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                GOVERNMENT OF INDIA • URBAN LOCAL BODY NODAL AUTHORITY
              </div>
              <h3 className="text-base font-black tracking-tight text-slate-900 font-serif">
                STATUTORY MUNICIPAL PROPERTY VERIFICATION CERTIFICATE
              </h3>
              <div className="text-[10px] font-mono text-slate-500">
                Certificate Ref: BHOOMI/ULB-NOC/{selectedProperty.propertyId}/2026
              </div>
            </div>

            {/* Certificate Body */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>
                This is to officially certify that the property detailed below has undergone rigorous on-site physical inspection, municipal masterplan zoning verification, and cadastral boundary validation under the provisions of the <em>Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act (RFCTLARR 2013)</em> and relevant State Municipal Corporation Bylaws.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Property ID:</span>
                  <span className="font-bold text-slate-900">{selectedProperty.propertyId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Owner ID / Aadhaar:</span>
                  <span className="font-bold text-slate-900">{selectedProperty.ownerId} ({selectedProperty.aadhaarMasked})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Khata & Survey No:</span>
                  <span className="font-bold text-slate-900">{selectedProperty.khataNo} / {selectedProperty.surveyNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ULPIN Bhu-Aadhaar:</span>
                  <span className="font-bold text-amber-700">{selectedProperty.ulpin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Jurisdiction ULB:</span>
                  <span className="font-bold text-slate-900">{selectedProperty.municipality}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Verification Date:</span>
                  <span className="font-bold text-emerald-700">{selectedProperty.inspectionDate || '15 Sep 2026'}</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[11px] text-emerald-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>VERDICT: FULLY COMPLIANT.</strong> Masterplan setbacks, right-of-way buffer, and municipal dues are cleared for statutory award disbursement.
                </span>
              </div>
            </div>

            {/* Digital Signatures */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Digitally Signed by:</div>
                <div className="font-extrabold text-slate-900">{officerName}</div>
                <div className="text-[10px] text-amber-700 font-medium">ULB Nodal Officer • Municipal Corporation</div>
              </div>
              <div className="text-right">
                <div className="w-20 h-10 border-2 border-emerald-600 rounded flex items-center justify-center text-emerald-700 font-bold font-mono text-[10px] uppercase rotate-[-3deg]">
                  ✓ VERIFIED
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-1">NIC-DSIGN-SHA256</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Print / Export Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
