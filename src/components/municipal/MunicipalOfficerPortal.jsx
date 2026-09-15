import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Shield, 
  Zap, 
  Droplets, 
  TreePine, 
  Flame, 
  Landmark, 
  ArrowUpRight, 
  Check, 
  Eye, 
  RefreshCw, 
  Calendar, 
  Users, 
  FileCheck, 
  Layers, 
  Sliders, 
  FileSpreadsheet,
  ExternalLink,
  ChevronRight,
  Crosshair,
  BadgeAlert,
  Percent
} from 'lucide-react';

import {
  ULB_DETAILS,
  MUNICIPAL_ZONING_RECORDS,
  STATUTORY_MUNICIPAL_NOCS,
  URBAN_UTILITIES_INVENTORY,
  MUNICIPAL_PROPERTY_TAX_RECORDS,
  JOINT_INSPECTION_SCHEDULE
} from '../../data/municipalData';

export default function MunicipalOfficerPortal({ 
  parcels = [], 
  onSelectParcel, 
  onNavigateToSurveyor, 
  onNavigateToGIS 
}) {
  // State management
  const [activeSubTab, setActiveSubTab] = useState('zoning'); // 'zoning' | 'noc' | 'utilities' | 'tax' | 'inspection'
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [nocCategoryFilter, setNocCategoryFilter] = useState('ALL');
  
  // Interactive state for NOCs
  const [nocsList, setNocsList] = useState(STATUTORY_MUNICIPAL_NOCS);
  const [taxRecords, setTaxRecords] = useState(MUNICIPAL_PROPERTY_TAX_RECORDS);
  const [utilitiesList, setUtilitiesList] = useState(URBAN_UTILITIES_INVENTORY);
  const [inspectionList, setInspectionList] = useState(JOINT_INSPECTION_SCHEDULE);

  // Selected item modals
  const [selectedZoningModal, setSelectedZoningModal] = useState(null);
  const [selectedNocModal, setSelectedNocModal] = useState(null);
  const [isSignNocOpen, setIsSignNocOpen] = useState(false);
  const [targetNocToSign, setTargetNocToSign] = useState(null);
  const [signingStipulation, setSigningStipulation] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Calculations & KPIs
  const totalParcels = MUNICIPAL_ZONING_RECORDS.length;
  const compliantParcels = MUNICIPAL_ZONING_RECORDS.filter(p => p.setbackStatus === 'COMPLIANT').length;
  const zoningComplianceRate = Math.round((compliantParcels / totalParcels) * 100);

  const approvedNocs = nocsList.filter(n => n.status === 'APPROVED').length;
  const pendingNocs = nocsList.filter(n => n.status.includes('PENDING') || n.status.includes('CONDITIONAL')).length;
  
  const totalUtilityBudgetLakhs = utilitiesList.reduce((acc, u) => acc + u.approvedCostLakhs, 0);
  const avgUtilityProgress = Math.round(
    utilitiesList.reduce((acc, u) => acc + u.progressPercent, 0) / utilitiesList.length
  );

  const totalTaxArrears = taxRecords.reduce((acc, t) => acc + t.totalDuesPayable, 0);

  // Filtered Zoning Records
  const filteredZoning = MUNICIPAL_ZONING_RECORDS.filter(p => {
    const matchesSearch = 
      p.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ulpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.surveyNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = zoneFilter === 'ALL' || p.zoneCode === zoneFilter;
    return matchesSearch && matchesZone;
  });

  // Filtered NOCs
  const filteredNocs = nocsList.filter(n => {
    const matchesSearch = 
      n.nocId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ulpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = nocCategoryFilter === 'ALL' || n.category === nocCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Action to issue / sign an NOC
  const handleConfirmSignNoc = () => {
    if (!targetNocToSign) return;
    setNocsList(prev => prev.map(item => {
      if (item.nocId === targetNocToSign.nocId) {
        return {
          ...item,
          status: 'APPROVED',
          statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          disposalDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          digitalSignature: `CERT-MCG-DESHMUKH-${Math.floor(100000 + Math.random() * 900000)}`,
          stipulation: signingStipulation || item.stipulation
        };
      }
      return item;
    }));
    triggerToast(`Statutory Municipal NOC ${targetNocToSign.nocId} digitally signed & issued with sovereign cryptographic stamp.`);
    setIsSignNocOpen(false);
    setTargetNocToSign(null);
    setSigningStipulation('');
  };

  // Action to generate / issue Property Tax NDC
  const handleIssueNdc = (record) => {
    setTaxRecords(prev => prev.map(item => {
      if (item.parcelId === record.parcelId) {
        return {
          ...item,
          status: 'NO_DUES_CERTIFICATE_ISSUED',
          statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          ndcIssued: true,
          totalDuesPayable: 0,
          ndcNumber: `NDC-MCG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          statutoryAction: '100% Tax & Betterment charges reconciled. Cleared for RFCTLARR compensation disbursement.'
        };
      }
      return item;
    }));
    triggerToast(`Municipal No-Dues Certificate (NDC) issued for Plot ${record.surveyNo} (${record.parcelId}).`);
  };

  // Action to mark utility progress step
  const handleIncrementUtilityProgress = (utilityId) => {
    setUtilitiesList(prev => prev.map(u => {
      if (u.utilityId === utilityId) {
        const next = Math.min(100, u.progressPercent + 10);
        return {
          ...u,
          progressPercent: next,
          status: next === 100 ? 'CLEARED_AND_COMMISSIONED' : u.status,
          statusColor: next === 100 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : u.statusColor
        };
      }
      return u;
    }));
    triggerToast(`Utility shifting milestone progress updated (+10%).`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SOVEREIGN ULB AUTHORITY HEADER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center space-x-1">
                <Building2 className="w-3 h-3 mr-1 inline" />
                ULB NODAL PORTAL
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs font-mono text-slate-300 font-bold">{ULB_DETAILS.ulbName}</span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs text-amber-400 font-mono">Master Plan 2031 Enforced</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Urban Local Body & Town Planning Command Center</span>
            </h1>

            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Autonomous statutory console for <strong className="text-white">Municipal Master Plan Zoning</strong>, 
              building setback approvals, <strong className="text-orange-400">Statutory Multi-Department NOCs</strong>, 
              urban utility shifting synchronization, and municipal property tax recovery before statutory land handover.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <span className="text-slate-500">Officer:</span>
                <strong className="text-white">{ULB_DETAILS.officerName}</strong>
                <span className="text-orange-400 font-mono">({ULB_DETAILS.empId})</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center space-x-1">
                <span className="text-slate-500">Corridor:</span>
                <span className="text-slate-200 font-mono font-medium">{ULB_DETAILS.activeCorridor}</span>
              </span>
            </div>
          </div>

          {/* Quick Cross-Functional Actions */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2 w-full lg:w-auto">
            {onNavigateToSurveyor && (
              <button
                onClick={onNavigateToSurveyor}
                className="flex-1 lg:flex-initial px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Surveyor Workbench</span>
              </button>
            )}

            {onNavigateToGIS && (
              <button
                onClick={onNavigateToGIS}
                className="flex-1 lg:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Corridor GIS Map</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXECUTIVE ULB KPI DASHBOARD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Zoning Compliance */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase text-[10px] tracking-wider">Master Plan Zoning</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline space-x-1.5">
            <span>{zoningComplianceRate}%</span>
            <span className="text-xs font-medium text-emerald-400 font-sans">Compliant</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>{compliantParcels} of {totalParcels} urban plots</span>
            <span className="text-amber-400 font-bold">1 Encroachment</span>
          </div>
        </div>

        {/* Card 2: Statutory NOCs */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase text-[10px] tracking-wider">Municipal NOCs</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono flex items-baseline space-x-1.5">
            <span>{approvedNocs}</span>
            <span className="text-xs font-medium text-slate-400 font-sans">of {nocsList.length} Approved</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>{pendingNocs} In Scrutiny</span>
            <span className="text-red-400 font-bold">1 Disputed</span>
          </div>
        </div>

        {/* Card 3: Utility Shifting Progress */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase text-[10px] tracking-wider">Utility Shifting</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono flex items-baseline space-x-1.5">
            <span>{avgUtilityProgress}%</span>
            <span className="text-xs font-medium text-slate-400 font-sans">Physical Progress</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>₹{totalUtilityBudgetLakhs.toFixed(1)} Lakhs Budget</span>
            <span className="text-cyan-400 font-bold">4 Major Lines</span>
          </div>
        </div>

        {/* Card 4: Property Tax Arrears */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase text-[10px] tracking-wider">Tax & Betterment</span>
            <Landmark className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono flex items-baseline space-x-1.5">
            <span>₹{(totalTaxArrears / 1000).toFixed(1)}k</span>
            <span className="text-xs font-medium text-slate-400 font-sans">Arrears Dues</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Auto-offset in Sec 3G</span>
            <span className="text-emerald-400 font-bold">3 NDC Issued</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION TABS HEADER */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('zoning')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === 'zoning' 
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Master Plan & Zoning ({MUNICIPAL_ZONING_RECORDS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('noc')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === 'noc' 
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Statutory NOCs ({nocsList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('utilities')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === 'utilities' 
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Utility Shifting ({utilitiesList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tax')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === 'tax' 
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Property Tax & NDC ({taxRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inspection')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === 'inspection' 
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Joint Inspection Docket ({inspectionList.length})</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search parcel, ULPIN, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MASTER PLAN ZONING & SETBACK COMPLIANCE MATRIX */}
      {/* ========================================================================= */}
      {activeSubTab === 'zoning' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-mono text-[11px] uppercase">Filter by Master Plan Zone:</span>
              <div className="flex flex-wrap gap-1">
                {['ALL', 'C-1', 'R-2', 'GB-ECO', 'PSP', 'TT', 'IND'].map(z => (
                  <button
                    key={z}
                    onClick={() => setZoneFilter(z)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                      zoneFilter === z ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">Showing {filteredZoning.length} urban corridor parcels</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredZoning.map(plot => (
              <div 
                key={plot.parcelId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-orange-400">{plot.parcelId}</span>
                        <span className="text-slate-600">•</span>
                        <strong className="text-white text-xs">Plot {plot.surveyNo}</strong>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 truncate max-w-[200px]">
                        {plot.ownerName}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${plot.zoneColor}`}>
                      {plot.zoneCode}
                    </span>
                  </div>

                  {/* Zone description */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Master Plan 2031 Classification</span>
                    <span className="text-slate-200 font-medium leading-snug block text-[11px]">{plot.masterPlanZone}</span>
                  </div>

                  {/* Setback and Encroachment status */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Sectoral RoW Setback</span>
                      <span className="text-white font-mono font-bold">{plot.setbackReqMeters}m Req</span>
                      <span className="text-[10px] text-slate-400 block font-mono">({plot.setbackObservedMeters}m observed)</span>
                    </div>

                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">RoW Status</span>
                      <span className={`text-[10px] font-mono font-bold block mt-0.5 ${
                        plot.setbackStatus === 'COMPLIANT' ? 'text-emerald-400' :
                        plot.setbackStatus === 'ENCROACHMENT_FLAGGED' ? 'text-red-400' :
                        'text-amber-400'
                      }`}>
                        {plot.setbackStatus === 'COMPLIANT' ? '✓ Compliant' :
                         plot.setbackStatus === 'ENCROACHMENT_FLAGGED' ? `⚠️ Encroachment (+${plot.setbackDiffMeters}m)` :
                         `Buffer Clearance Required`}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/40 p-2 rounded border border-slate-800/50">
                    {plot.setbackNote}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    ULPIN: {plot.ulpin.slice(0, 14)}...
                  </span>

                  <button
                    onClick={() => setSelectedZoningModal(plot)}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Inspect Zoning Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STATUTORY MUNICIPAL NOC CLEARANCE ENGINE */}
      {/* ========================================================================= */}
      {activeSubTab === 'noc' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-mono text-[11px] uppercase">Filter by Department:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'ALL', label: 'All Departments' },
                  { id: 'TOWN_PLANNING', label: 'Town Planning' },
                  { id: 'WATER_SEWERAGE', label: 'Jal Board / Sewerage' },
                  { id: 'TREE_AUTHORITY', label: 'Tree Authority' },
                  { id: 'ELECTRIC_UTILITY', label: 'Electricity / HT' },
                  { id: 'FIRE_EMERGENCY', label: 'Fire & Rescue' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNocCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      nocCategoryFilter === cat.id ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">{filteredNocs.length} statutory records</span>
          </div>

          {/* NOC Cards */}
          <div className="space-y-3">
            {filteredNocs.map(noc => (
              <div
                key={noc.nocId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                      {noc.category === 'TOWN_PLANNING' && <Building2 className="w-4 h-4" />}
                      {noc.category === 'WATER_SEWERAGE' && <Droplets className="w-4 h-4" />}
                      {noc.category === 'TREE_AUTHORITY' && <TreePine className="w-4 h-4" />}
                      {noc.category === 'ELECTRIC_UTILITY' && <Zap className="w-4 h-4" />}
                      {noc.category === 'FIRE_EMERGENCY' && <Flame className="w-4 h-4" />}
                      {noc.category === 'MUNICIPAL_LAND_TRANSFER' && <Landmark className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-orange-400">{noc.nocId}</span>
                        <span className="text-slate-600">•</span>
                        <strong className="text-white text-sm">{noc.title}</strong>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {noc.department} • Ref: {noc.fileRef}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${noc.statusColor}`}>
                    {noc.status === 'APPROVED' ? '✓ STATUTORY NOC ISSUED' :
                     noc.status === 'CONDITIONAL_APPROVAL' ? '⚠️ CONDITIONAL APPROVAL' :
                     noc.status.includes('REJECTED') ? '✕ APPLICATION REJECTED' :
                     '⏱ PENDING FIELD SCRUTINY'}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Parcel & ULPIN</span>
                    <strong className="text-white font-mono">{noc.parcelId} (Plot {noc.surveyNo})</strong>
                    <span className="text-[10px] text-slate-400 block truncate">{noc.ulpin}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Registered Landowner</span>
                    <span className="text-white font-medium block truncate">{noc.ownerName}</span>
                    <span className="text-[10px] text-slate-400 block">Submitted: {noc.submissionDate}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Inspecting Authority</span>
                    <span className="text-slate-200 block truncate">{noc.officer}</span>
                    <span className="text-[10px] text-emerald-400 font-mono block">Disposed: {noc.disposalDate}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Statutory Scrutiny Fee</span>
                    <strong className="text-white font-mono">
                      {noc.requiredFee > 0 ? `₹${noc.requiredFee.toLocaleString('en-IN')}` : 'Exempt (Govt Transfer)'}
                    </strong>
                    <span className="text-[10px] text-emerald-400 font-mono block font-bold">{noc.feeStatus}</span>
                  </div>
                </div>

                {/* Stipulations Box */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                    <span>Statutory Stipulations & Conditions Precedent:</span>
                    <span className="text-orange-400 font-bold">{noc.digitalSignature}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{noc.stipulation}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedNocModal(noc)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View NOC Order</span>
                  </button>

                  {noc.status !== 'APPROVED' && (
                    <button
                      onClick={() => {
                        setTargetNocToSign(noc);
                        setSigningStipulation(noc.stipulation);
                        setIsSignNocOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Issue & Digital Sign NOC</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: URBAN UTILITY SHIFTING MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'utilities' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Urban Utility Relocation & Shifting Inventory</span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Statutory tracking of water mains, HT electrical feeders, box drains, and smart city optical fibers within corridor limits.
              </p>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <span className="text-slate-400">Total Approved Budget:</span>
              <strong className="text-emerald-400 text-sm">₹{totalUtilityBudgetLakhs.toFixed(2)} Lakhs</strong>
            </div>
          </div>

          {/* Utilities List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {utilitiesList.map(u => (
              <div 
                key={u.utilityId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3.5 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-[11px]">{u.utilityId}</span>
                    <strong className="text-white text-sm block mt-0.5">{u.title}</strong>
                    <span className="text-[11px] text-slate-400 block">{u.typeBadge} • Chainage {u.chainage}</span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap ${u.statusColor}`}>
                    {u.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Physical Relocation Progress:</span>
                    <span className="text-white font-bold">{u.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        u.progressPercent >= 80 ? 'bg-emerald-500' :
                        u.progressPercent >= 40 ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${u.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Specifications & Agencies */}
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Executing Agency</span>
                    <span className="text-white font-medium block truncate">{u.executingAgency}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{u.contactPerson}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Relocation Cost</span>
                    <strong className="text-emerald-400 font-mono block">₹{u.approvedCostLakhs.toFixed(2)} Lakhs</strong>
                    <span className="text-[10px] text-slate-400 block font-mono">Target: {u.targetCompletionDate}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  <strong className="text-slate-300 font-medium">Field Status:</strong> {u.fieldNotes}
                </p>

                {/* Footer and Sign-off */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                    <span>Joint Co-Signed with {u.inspectionSurveyor}</span>
                  </span>

                  {u.progressPercent < 100 && (
                    <button
                      onClick={() => handleIncrementUtilityProgress(u.utilityId)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      + Update +10%
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MUNICIPAL PROPERTY TAX & NO-DUES RECONCILIATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'tax' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Landmark className="w-4 h-4 text-purple-400" />
                <span>Municipal Corporation Property Tax & No Dues Reconciliation</span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Statutory offset under Section 93: Pending municipal taxes are flagged for direct adjustment in RFCTLARR solatium compensation.
              </p>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <span className="text-slate-400">Total Arrears Flagged:</span>
              <strong className="text-red-400 text-sm">₹{totalTaxArrears.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Tax Cards Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Parcel & Plot</th>
                    <th className="py-3 px-4">Property Tax ID</th>
                    <th className="py-3 px-4">Owner / Taxpayer</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Arrears Due</th>
                    <th className="py-3 px-4">Status & NDC</th>
                    <th className="py-3 px-4 text-right">Statutory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {taxRecords.map(r => (
                    <tr key={r.parcelId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-orange-400">{r.parcelId}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Plot {r.surveyNo}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-300 font-medium">
                        {r.propertyId}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{r.ownerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Year: {r.assessmentYear}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {r.taxCategory}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {r.totalDuesPayable > 0 ? (
                          <span className="text-red-400 font-bold">₹{r.totalDuesPayable.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">₹0 (Nil Dues)</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap ${r.statusColor}`}>
                          {r.ndcIssued ? `NDC: ${r.ndcNumber}` : r.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {!r.ndcIssued && r.totalDuesPayable > 0 ? (
                          <button
                            onClick={() => handleIssueNdc(r)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-all cursor-pointer shadow-xs"
                          >
                            Mark Paid & Issue NDC
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Clearance Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: JOINT SURVEYOR-MUNICIPAL FIELD INSPECTION DOCKET */}
      {/* ========================================================================= */}
      {activeSubTab === 'inspection' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Joint Surveyor & Municipal Officer Field Inspection Calendar</span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Coordinated on-site verification with Surveyor Anish Kumar for boundary reconciliation and DGPS ground marker verification.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {inspectionList.map(item => (
              <div 
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-cyan-400">{item.id}</span>
                    <strong className="text-white text-sm">{item.location}</strong>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.statusBadge}`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Scheduled Date & Time</span>
                    <span className="text-white font-mono font-bold">{item.date} at {item.time}</span>
                    <span className="text-[10px] text-slate-400 block font-sans mt-0.5">Agenda: {item.purpose}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Inspection Team</span>
                    <span className="text-white font-medium block">{item.surveyor}</span>
                    <span className="text-orange-400 font-medium block">{item.municipalOfficer}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Outcome & Equipment</span>
                    <span className="text-slate-200 block text-[11px] leading-snug">{item.outcomeTarget}</span>
                    <span className="text-[10px] text-cyan-400 font-mono block mt-1">Tools: {item.equipment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ZONING DOSSIER DETAIL */}
      {/* ========================================================================= */}
      {selectedZoningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">
                  Urban Master Plan Scrutiny Dossier
                </span>
                <h3 className="text-base font-black text-white">
                  Plot {selectedZoningModal.surveyNo} ({selectedZoningModal.parcelId})
                </h3>
              </div>
              <button
                onClick={() => setSelectedZoningModal(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Zone Classification</span>
                  <strong className="text-orange-400 text-sm">{selectedZoningModal.masterPlanZone}</strong>
                  <span className="text-[10px] text-slate-400 block mt-1">{selectedZoningModal.permittedLandUse}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Floor Space Index (FAR)</span>
                  <span className="text-white font-mono text-sm block">
                    Permitted: {selectedZoningModal.fsiPermitted} | Utilized: {selectedZoningModal.fsiUtilized}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1 font-mono">
                    Status: {selectedZoningModal.fsiStatus}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Building Setback & RoW Notes</span>
                <p className="text-slate-300 leading-relaxed">{selectedZoningModal.setbackNote}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Existing Structures: {selectedZoningModal.existingConstruction}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Municipal Corporation Title Claim</span>
                <p className="text-slate-300 font-medium">{selectedZoningModal.ulbClaimDetails}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedZoningModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ISSUE & DIGITAL SIGN NOC */}
      {/* ========================================================================= */}
      {isSignNocOpen && targetNocToSign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">
                  Statutory Municipal NOC Issuance
                </span>
                <h3 className="text-base font-black text-white">
                  Digital Sign NOC: {targetNocToSign.nocId}
                </h3>
              </div>
              <button
                onClick={() => setIsSignNocOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Parcel & Clearance</span>
                <span className="text-white font-bold block">{targetNocToSign.title}</span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  ULPIN: {targetNocToSign.ulpin} • Plot {targetNocToSign.surveyNo} ({targetNocToSign.ownerName})
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">
                  Statutory Stipulations / Conditions of Approval:
                </label>
                <textarea
                  value={signingStipulation}
                  onChange={(e) => setSigningStipulation(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="Enter statutory stipulations or conditional compliance instructions..."
                />
              </div>

              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300 text-[11px] space-y-1">
                <strong className="block font-bold">Cryptographic Authority Stamp:</strong>
                <p className="text-[10px] leading-relaxed">
                  Signing as <strong>{ULB_DETAILS.officerName}</strong>, {ULB_DETAILS.designation}. 
                  This digital sign conforms to Section 5 of the Information Technology Act, 2000 and Section 161 of State Municipal Corporation Act.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setIsSignNocOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignNoc}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black flex items-center space-x-1.5 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Affix Signature & Issue NOC</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
