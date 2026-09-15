import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  ShieldCheck, 
  TreePine, 
  Building, 
  Layers, 
  ArrowRight,
  Eye,
  FileText,
  Clock
} from 'lucide-react';
import InteractivePolygonNodeEditor from './InteractivePolygonNodeEditor';
import { NATIONAL_PARCELS, PRIVATE_LAND_DISPUTES } from '../data/nationalHierarchyData';

export default function FieldSurveyStudio({ 
  parcels, 
  selectedParcel, 
  setSelectedParcel, 
  onSaveCoordinates,
  onLogAudit,
  onNavigateToDisputes
}) {
  const [activeSubTab, setActiveSubTab] = useState('ACQUISITION'); // 'ACQUISITION' or 'DISPUTES'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [inspectedParcel, setInspectedParcel] = useState(selectedParcel || NATIONAL_PARCELS[0]);

  const surveyParcels = parcels && parcels.length > 0 ? parcels : NATIONAL_PARCELS;

  const filteredParcels = surveyParcels.filter(p => {
    const matchesSearch = 
      (p.ulpin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.plotNumber || p.surveyNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ownerName || p.landowner || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.village || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.district || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.surveyStatus === statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEditor = (parcel) => {
    setInspectedParcel(parcel);
    if (setSelectedParcel) setSelectedParcel(parcel);
    setIsEditorOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-4 font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-slate-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white font-mono uppercase">
              FIELD SURVEY & GIS DEMARCATION STUDIO
            </h2>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
              Surveyor Console
            </span>
          </div>
          <p className="text-xs text-slate-400">
            "On-ground Joint Measurement Survey (JMS), GPS location capture, geotagged evidence & conflict detection"
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-[11px]">
          <span className="text-slate-400">Surveyor:</span>
          <span className="font-bold text-amber-400 font-mono">Anish Kumar (Senior Surveyor)</span>
        </div>
      </div>

      {/* Two Subtabs: 1. Project Acquisition Parcels, 2. Assigned Private Land Disputes */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSubTab('ACQUISITION')}
          className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'ACQUISITION'
              ? 'border-amber-600 text-amber-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Project Acquisition Parcels ({surveyParcels.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DISPUTES')}
          className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'DISPUTES'
              ? 'border-amber-600 text-amber-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>2. Assigned Private Land Disputes ({PRIVATE_LAND_DISPUTES.length})</span>
        </button>
      </div>

      {activeSubTab === 'ACQUISITION' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Parcel ID, Plot, Owner, Village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
              {['ALL', 'Survey Done → Handed to LAO', 'Under Active Survey', 'Survey Complete', 'Requires Reverification'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-amber-500 text-slate-950 shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All Statuses' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Modal / Drawer when Editing a Parcel */}
          {isEditorOpen && inspectedParcel && (
            <div className="bg-slate-950 p-1 rounded-2xl">
              <InteractivePolygonNodeEditor
                parcel={inspectedParcel}
                onSaveCoordinates={(id, nodes, groundAssets, status) => {
                  if (onSaveCoordinates) onSaveCoordinates(id, nodes, groundAssets, status);
                  setIsEditorOpen(false);
                }}
                onClose={() => setIsEditorOpen(false)}
                onLogAudit={onLogAudit}
              />
            </div>
          )}

          {/* Table / Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                Joint Measurement Survey (JMS) Field Verification Queue
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Showing {filteredParcels.length} of {surveyParcels.length} Cadastral Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider">
                    <th className="p-3">Parcel ID & Plot</th>
                    <th className="p-3">Owner Name</th>
                    <th className="p-3">Area (Official / Surveyed)</th>
                    <th className="p-3">Land Type & Location</th>
                    <th className="p-3">Score & Alerts</th>
                    <th className="p-3">GIS Demarcation</th>
                    <th className="p-3">Ground Assets</th>
                    <th className="p-3">Encroachment Risk</th>
                    <th className="p-3">Survey Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredParcels.map((p) => {
                    const isMismatch = (p.alert && p.alert.toLowerCase().includes('mismatch')) || (p.officialArea !== p.surveyedArea);
                    return (
                      <tr 
                        key={p.id}
                        className="hover:bg-amber-50/40 transition-colors group"
                      >
                        <td className="p-3">
                          <strong className="font-mono text-slate-900 text-xs block">Plot {p.plotNumber || p.surveyNo}</strong>
                          <span className="font-mono text-[10px] text-slate-500 truncate block max-w-[130px]">{p.ulpin || p.id}</span>
                        </td>
                        <td className="p-3">
                          <strong className="text-slate-800 font-semibold">{p.ownerName || p.landowner}</strong>
                          <span className="text-[10px] text-slate-400 block font-mono">Khata {p.khataNo || p.khataNumber}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-slate-800 font-bold block">{p.officialArea || p.areaHectares} Ha</span>
                          {p.surveyedArea && p.surveyedArea !== p.officialArea ? (
                            <span className="text-[10px] font-mono text-rose-600 font-bold block">
                              Survey: {p.surveyedArea} Ha (Mismatch)
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-600 block">
                              Survey: {p.surveyedArea || p.officialArea} Ha (Match)
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800 block">{p.landClassification || p.landType}</span>
                          <span className="text-[10px] text-slate-500 block">{p.village}, {p.district}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono ${
                              (p.verificationScore || 100) >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.verificationScore || 100}%
                            </span>
                          </div>
                          {p.alert && (
                            <span className={`text-[10px] font-semibold block mt-1 ${
                              p.alertType === 'danger' ? 'text-rose-600' : 'text-amber-700'
                            }`}>
                              {p.alert}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                            {p.gisDemarcation || "Demarcated (4 Coordinates)"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="text-[11px] text-slate-600 space-y-0.5">
                            <span>Trees: <strong className="text-slate-800">{p.groundAssets?.trees || 14}</strong></span>
                            <span className="block">Wells: <strong className="text-slate-800">{p.groundAssets?.wells || 1}</strong></span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            p.encroachmentRisk === 'HIGH'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {p.encroachmentRisk || "LOW"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-bold text-slate-800 block">
                            {p.surveyStatus || "Under Active Survey"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenEditor(p)}
                            className="bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 ml-auto text-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Boundary</span>
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
      ) : (
        /* Subtab 2: Assigned Private Land Disputes */
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-extrabold text-amber-900 text-sm">Assigned Person-to-Person Land Disputes</h4>
              <p className="text-xs text-amber-800">
                You have 3 active dispute assignments scheduled for DGPS ground boundary verification.
              </p>
            </div>
            {onNavigateToDisputes && (
              <button
                onClick={onNavigateToDisputes}
                className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 text-xs shadow-xs"
              >
                <span>Open Full Dispute Radar</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRIVATE_LAND_DISPUTES.map(d => (
              <div key={d.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {d.caseNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {d.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{d.disputeType}</h4>
                  <p className="text-xs text-slate-500">Plot {d.plotNumber} • {d.location}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <div className="text-slate-600">
                    <strong>Person A:</strong> {d.partyA.name}
                  </div>
                  <div className="text-slate-600">
                    <strong>Person B:</strong> {d.partyB.name}
                  </div>
                  <div className="text-rose-600 font-semibold pt-1 border-t border-slate-200">
                    Contested Extent: {d.contestedArea}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToDisputes && onNavigateToDisputes(d.id)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Verify Evidence & Inconsistency
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
