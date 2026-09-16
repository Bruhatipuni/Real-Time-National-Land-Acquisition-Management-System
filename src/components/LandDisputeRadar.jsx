import React, { useState } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  ArrowRight, 
  Sparkles,
  UserCheck,
  Building,
  Layers,
  ExternalLink
} from 'lucide-react';
import { PRIVATE_LAND_DISPUTES } from '../data/nationalHierarchyData';

export default function LandDisputeRadar({ onSelectParcelForInspection }) {
  const [disputes, setDisputes] = useState(PRIVATE_LAND_DISPUTES);
  const [selectedDisputeId, setSelectedDisputeId] = useState(PRIVATE_LAND_DISPUTES[0].id);
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [transmittedNotice, setTransmittedNotice] = useState(false);

  const activeDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];

  const handleTransmitToSDM = () => {
    setDisputes(prev => prev.map(d => {
      if (d.id === activeDispute.id) {
        return {
          ...d,
          status: "Verified & Transmitted to SDM",
          statusStep: 4
        };
      }
      return d;
    }));
    setTransmittedNotice(true);
    setTimeout(() => setTransmittedNotice(false), 3500);
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = 
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.plotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.partyA.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.partyB.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatusFilter === 'ALL' || d.status === activeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case "Verified & Transmitted to SDM":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Under Active Survey":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Court Hearing Scheduled":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Pending Ground Survey":
      default:
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-4 font-sans text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-slate-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white font-mono uppercase">
              PERSON-TO-PERSON LAND DISPUTE VERIFICATION
            </h2>
            <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/30">
              Dispute Radar
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Field boundary verification, cadastral comparison, GPS evidence & inconsistency analysis
          </p>
        </div>

        <div className="flex items-center space-x-3 text-[11px] bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800">
          <span className="text-slate-400">Presiding Role:</span>
          <span className="font-bold text-amber-400 font-mono">Field Surveyor & GIS Nodal</span>
        </div>
      </div>

      {/* Statutory Caveat Alert */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3.5 flex items-start space-x-2.5 text-slate-300">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong className="text-amber-400 uppercase font-mono">Statutory Legal Neutrality Rule:</strong> The AI Inconsistency Radar identifies spatial discrepancies, boundary overlaps, and revenue record variations. <span className="text-white font-semibold">AI does NOT decide legal ownership.</span> Final decision remains solely with the competent Revenue Authority, Sub-Divisional Magistrate (SDM), District Registrar, or Court.
        </div>
      </div>

      {transmittedNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Case dossier and field boundary survey evidence successfully transmitted to SDM Revenue Tribunal!</span>
        </div>
      )}

      {/* Filter and Search Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Case #, Plot, Party Name, Village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Cases (3)' },
            { id: 'Pending Ground Survey', label: '1. Pending Ground Survey' },
            { id: 'Under Active Survey', label: '2. Under Active Survey' },
            { id: 'Court Hearing Scheduled', label: '3. Court Hearing' },
            { id: 'Verified & Transmitted to SDM', label: '4. Transmitted to SDM' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeStatusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Cases List + In-depth Dispute Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Dispute Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDisputes.map((caseItem) => {
            const isSelected = caseItem.id === activeDispute.id;
            return (
              <div
                key={caseItem.id}
                onClick={() => setSelectedDisputeId(caseItem.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-amber-500 shadow-lg ring-1 ring-amber-500/50' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-amber-800'
                  }`}>
                    {caseItem.caseNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(caseItem.status)}`}>
                    {caseItem.status}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm mt-2">
                  {caseItem.disputeType}
                </h4>
                <p className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                  Contested: <strong className="font-mono text-rose-500">{caseItem.contestedArea}</strong> • Plot {caseItem.plotNumber}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/40 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className={`block text-[9px] uppercase font-bold ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Person A (Claimant)</span>
                    <strong className="truncate block font-semibold">{caseItem.partyA.name}</strong>
                  </div>
                  <div>
                    <span className={`block text-[9px] uppercase font-bold ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Person B (Respondent)</span>
                    <strong className="truncate block font-semibold">{caseItem.partyB.name}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: In-depth Evidentiary Dossier & AI Inconsistency Radar (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          {/* Dossier Header */}
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-300">
                  {activeDispute.caseNumber}
                </span>
                <h3 className="text-base font-black text-slate-900">{activeDispute.disputeType}</h3>
              </div>
              <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Plot {activeDispute.plotNumber} • Khata {activeDispute.khataNumber} • {activeDispute.location}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Next Hearing</span>
              <strong className="text-slate-900 font-mono text-xs">{activeDispute.hearingDate}</strong>
            </div>
          </div>

          {/* AI Inconsistency Radar Box */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-4 border border-indigo-500/30 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider">
                  AI Inconsistency Radar
                </span>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                Spatial Overlap: {activeDispute.overlapPercentage}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {activeDispute.aiInconsistencyDetails}
            </p>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-amber-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Recommended Survey Action: {activeDispute.recommendedAction}</span>
            </div>
          </div>

          {/* Parties Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Person A */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-extrabold text-slate-900">Person A (Claimant)</span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                  {activeDispute.partyA.relation}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Full Name</span>
                <strong className="text-slate-800 text-sm">{activeDispute.partyA.name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Claimed Extent</span>
                <span className="font-mono text-slate-700 font-semibold">{activeDispute.partyA.claimedArea}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Submitted Evidence</span>
                <p className="text-slate-600 text-[11px]">{activeDispute.partyA.evidence}</p>
              </div>
            </div>

            {/* Person B */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-extrabold text-slate-900">Person B (Respondent)</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                  {activeDispute.partyB.relation}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Full Name</span>
                <strong className="text-slate-800 text-sm">{activeDispute.partyB.name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Claimed Extent</span>
                <span className="font-mono text-slate-700 font-semibold">{activeDispute.partyB.claimedArea}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Submitted Evidence</span>
                <p className="text-slate-600 text-[11px]">{activeDispute.partyB.evidence}</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              Assigned Field Officer: <strong className="text-slate-800">{activeDispute.assignedSurveyor}</strong>
            </div>

            <div className="flex items-center space-x-2">
              {onSelectParcelForInspection && (
                <button
                  onClick={() => onSelectParcelForInspection(activeDispute.plotNumber)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Inspect on GIS Map</span>
                </button>
              )}

              <button
                onClick={handleTransmitToSDM}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                <span>Transmit Field Report to SDM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
