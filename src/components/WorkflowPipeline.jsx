import React, { useState } from 'react';
import { 
  GitPullRequest, 
  CheckCircle2, 
  ChevronRight, 
  Building, 
  MapPin, 
  FileCheck, 
  Send, 
  Bell, 
  IndianRupee, 
  AlertTriangle, 
  Construction,
  Layers
} from 'lucide-react';
import { formatINR } from '../utils/compensationEngine';
import { STAGES_LIST } from '../data/mockData';

export default function WorkflowPipeline({ projects, parcels, onAdvanceStage, targetStageFilter }) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [selectedStageId, setSelectedStageId] = useState(targetStageFilter || 'ALL');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const getStageIcon = (stageId) => {
    switch(stageId) {
      case 'LAND_IDENTIFICATION': return MapPin;
      case 'LAND_VERIFICATION': return FileCheck;
      case 'ACQUISITION_PROPOSAL': return Send;
      case 'NOTIFICATIONS_NOTICE': return Bell;
      case 'COMPENSATION_PROCESS': return IndianRupee;
      case 'LEGAL_OBJECTIONS': return AlertTriangle;
      case 'APPROVAL_ACQUISITION': return CheckCircle2;
      case 'LAND_HANDOVER': return Building;
      case 'PROJECT_UTILIZATION': return Construction;
      default: return Layers;
    }
  };

  const projectParcels = parcels.filter(p => {
    const matchesProj = p.projectId === selectedProjectId;
    const matchesStage = selectedStageId === 'ALL' || p.status === selectedStageId;
    return matchesProj && matchesStage;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-4">
      {/* Top Corridor Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <GitPullRequest className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-mono uppercase">Statutory Land Lifecycle Engine</h2>
            <p className="text-[11px] text-slate-600 font-medium">Digitized 9-stage acquisition pipeline & handover management</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-600 font-bold hidden sm:inline">Active Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-50 text-slate-900 border border-slate-300 text-xs font-bold rounded-lg px-3 py-1.5 focus:border-amber-500 w-full md:w-80"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.state})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sleek Horizontal Stepper Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs overflow-x-auto">
        <div className="flex items-center min-w-max space-x-2">
          <button
            onClick={() => setSelectedStageId('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              selectedStageId === 'ALL' 
                ? 'bg-amber-500 text-slate-950 shadow-xs' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Stages ({parcels.filter(p => p.projectId === selectedProjectId).length})
          </button>

          <div className="h-4 w-px bg-slate-300 my-auto" />

          {STAGES_LIST.map((stg) => {
            const Icon = getStageIcon(stg.id);
            const count = parcels.filter(p => p.projectId === selectedProjectId && p.status === stg.id).length;
            const isSelected = selectedStageId === stg.id;

            return (
              <button 
                key={stg.id}
                onClick={() => setSelectedStageId(stg.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isSelected 
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-700' : 'text-slate-500'}`} />
                <span>{stg.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parcels Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
              Parcels Queue • {activeProject.name}
            </h3>
          </div>
          <span className="text-xs text-slate-600 font-mono font-bold">Showing {projectParcels.length} Parcels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {projectParcels.map((parcel) => (
            <div 
              key={parcel.id}
              className="bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-xl p-4 space-y-3 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black font-mono text-amber-800">{parcel.ulpin}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800">
                  Plot {parcel.surveyNo}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Landowner:</span>
                  <span className="font-extrabold text-slate-900">{parcel.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Acquisition Area:</span>
                  <span className="font-mono text-slate-900 font-bold">{parcel.areaHectares} Ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory Award:</span>
                  <span className="font-bold text-emerald-700 font-mono">{formatINR(parcel.totalAwardAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Current Stage:</span>
                  <span className="font-extrabold text-amber-800 text-[11px]">{parcel.status.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px] text-slate-600 font-bold">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Title Verified</span>
                </div>
                <button
                  onClick={() => onAdvanceStage(parcel.id)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                >
                  <span>Advance Stage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
