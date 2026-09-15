import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polyline, 
  Polygon, 
  Marker, 
  Popup, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Scale, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Download, 
  Layers, 
  Compass, 
  Eye, 
  Sparkles, 
  BrainCircuit, 
  Building2, 
  Flag, 
  Route, 
  Maximize2, 
  Minimize2, 
  Check, 
  ChevronRight, 
  ExternalLink,
  Share2,
  Filter,
  TrendingUp,
  AlertCircle,
  FileCheck,
  ShieldAlert,
  User,
  X
} from 'lucide-react';
import { calculateAcquisitionRisk } from '../utils/riskScoringEngine';
import { generateMinistryPDFReport, exportToCSV } from '../utils/reportGenerator';
import { STAGES_LIST } from '../data/mockData';

// Map controller to automatically fit bounds and center on corridor
function CorridorMapController({ bounds, center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      try {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 1.2 });
      } catch (e) {
        if (center) map.flyTo(center, zoom || 10, { duration: 1.2 });
      }
    } else if (center) {
      map.flyTo(center, zoom || 10, { duration: 1.2 });
    }
  }, [bounds, center, zoom, map]);
  return null;
}

// Custom Leaflet DivIcons to avoid missing default PNG assets
const createCustomIcon = (type, label) => {
  let bg = '#0f172a';
  let text = '#ffffff';
  let iconHtml = '📍';

  if (type === 'START') {
    bg = '#059669';
    iconHtml = '🏁';
  } else if (type === 'END') {
    bg = '#dc2626';
    iconHtml = '🎯';
  } else if (type === 'HIGH_RISK') {
    bg = '#ea580c';
    iconHtml = '⚠️';
  } else {
    bg = '#2563eb';
    iconHtml = '•';
  }

  return L.divIcon({
    className: 'custom-gis-marker',
    html: `
      <div style="
        background: ${bg};
        color: ${text};
        padding: 3px 7px;
        border-radius: 9999px;
        font-family: monospace;
        font-size: 10px;
        font-weight: 800;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
        border: 2px solid #ffffff;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>${iconHtml}</span>
        <span>${label || ''}</span>
      </div>
    `,
    iconSize: [80, 24],
    iconAnchor: [40, 12]
  });
};

export default function ProjectDetailsView({ 
  project, 
  parcels = [], 
  onBack, 
  onNavigateSection 
}) {
  if (!project) return null;

  // Map state
  const [mapStyle, setMapStyle] = useState('OSM'); // OSM, SATELLITE, DARK
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);

  // Layer Toggles
  const [layers, setLayers] = useState({
    route: true,
    acquired: true,
    pending: true,
    highRisk: true,
    disputes: true
  });

  // Selected Parcel for Inspector Panel
  const projectParcels = useMemo(() => {
    return parcels.filter(p => p.projectId === project.id);
  }, [parcels, project.id]);

  const [selectedParcel, setSelectedParcel] = useState(projectParcels[0] || null);
  const [fullParcelModalOpen, setFullParcelModalOpen] = useState(false);

  // When project changes, reset selected parcel
  useEffect(() => {
    setSelectedParcel(projectParcels[0] || null);
  }, [project.id, projectParcels]);

  // Risk calculation from scoring engine
  const riskAnalysis = useMemo(() => {
    return calculateAcquisitionRisk(project);
  }, [project]);

  // Map tile URLs
  const getTileData = () => {
    switch (mapStyle) {
      case 'SATELLITE':
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attr: "&copy; Esri World Imagery"
        };
      case 'DARK':
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          attr: "&copy; Esri World Dark Gray Base"
        };
      case 'OSM':
      default:
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attr: "&copy; OpenStreetMap contributors"
        };
    }
  };

  const tileData = getTileData();

  // Bounds computation for route polyline
  const routeBounds = useMemo(() => {
    if (project.routeCoordinates && project.routeCoordinates.length > 0) {
      return project.routeCoordinates;
    }
    return [
      [project.centerLat - 0.05, project.centerLng - 0.05],
      [project.centerLat + 0.05, project.centerLng + 0.05]
    ];
  }, [project]);

  // Format INR Cr
  const formatCr = (val) => {
    if (val === undefined || val === null) return '0.00';
    return Number(val).toLocaleString('en-IN', { maximumFractionDigits: 1 });
  };

  // Status color styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEAR_COMPLETION':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'CRITICAL_BOTTLENECK':
      case 'DELAYED':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'IN_PROGRESS':
      default:
        return 'bg-amber-50 text-amber-900 border-amber-300';
    }
  };

  // Toggle fullscreen for map container
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Export full project dossier PDF
  const handleExportPDF = () => {
    generateMinistryPDFReport({
      title: `${project.name} - Project Monitoring Dossier`,
      subtitle: `${project.agency} • ${project.ministry} • Government of India`,
      stats: [
        { label: 'Total Corridor Length', value: `${project.totalLengthKm || 0} km` },
        { label: 'Land Required / Acquired', value: `${project.acquiredAreaHa} / ${project.totalAreaHa} Ha (${project.acquisitionProgress || 0}%)` },
        { label: 'Compensation Budget', value: `₹${project.budgetAllocatedCrores} Cr (Paid: ₹${project.budgetDisbursedCrores} Cr)` },
        { label: 'Current Statutory Stage', value: project.currentStage },
        { label: 'Risk Score & Pacing', value: `${riskAnalysis.score}/100 (${riskAnalysis.tier} Risk)` },
        { label: 'SLA Pacing Status', value: project.delayDays > 0 ? `+${project.delayDays} Days Overdue` : 'On Schedule' }
      ],
      tableHeaders: ['Milestone Event', 'Responsible Authority', 'Statutory Status', 'Doc Reference'],
      tableRows: (project.timeline || []).map(t => [t.event, t.authority, t.status, t.docRef || 'Pending']),
      filename: `${project.id}_Corridor_Dossier.pdf`
    });
  };

  // Export project parcels CSV
  const handleExportCSV = () => {
    const rows = projectParcels.map(p => ({
      'Project ID': project.id,
      'Corridor Name': project.name,
      'Parcel ID': p.id,
      'ULPIN (Bhu-Aadhaar)': p.ulpin,
      'Survey Number': p.surveyNumber || p.surveyNo,
      'Village': p.village,
      'Tehsil': p.tehsil,
      'District': p.district,
      'State': p.state,
      'Area (Ha)': p.areaHectares || p.area,
      'Status': p.status,
      'Primary Owner': p.currentOwner || p.ownerName,
      'Solatium Award (INR)': p.totalAwardAmount,
      'DBT Status': p.dbtStatus,
      'Risk Score': p.riskScore
    }));
    exportToCSV(rows, `${project.id}_Parcels_Inventory.csv`);
  };

  return (
    <div className="space-y-4 font-sans pb-8 animate-fadeIn">
      
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-mono">
          <button 
            onClick={() => onNavigateSection ? onNavigateSection('overview') : onBack()} 
            className="hover:text-amber-600 transition-colors font-semibold cursor-pointer"
          >
            Central Ministry
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={onBack} 
            className="hover:text-amber-600 transition-colors font-semibold cursor-pointer"
          >
            Projects
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">National Mega Project Monitoring</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[220px] sm:max-w-md">{project.name}</span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Back to Projects</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. Project Details Header Banner */}
      <div className="gov-card rounded-2xl p-5 bg-gradient-to-r from-amber-50/40 via-white to-slate-50/60 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Route className="w-32 h-32 text-slate-800" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-mono font-black text-xs px-2.5 py-0.5 rounded shadow-xs">
                {project.id}
              </span>
              <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded border uppercase ${
                project.status === 'NEAR_COMPLETION' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                project.status === 'CRITICAL_BOTTLENECK' || project.status === 'DELAYED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {project.status.replace('_', ' ')}
              </span>
              <span className="text-slate-500 text-xs font-mono font-medium">
                {project.agency} • {project.ministry}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
              {project.name}
            </h1>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {project.corridorName || 'Access-controlled national logistics corridor under PM Gati Shakti National Master Plan.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-700 font-mono">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span><strong className="text-slate-900">States:</strong> {(project.states || [project.state]).join(', ')}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span><strong className="text-slate-900">Districts:</strong> {project.districts.join(' → ')}</span>
              </div>
            </div>
          </div>

          {/* Key Status Pill Badges */}
          <div className="flex flex-wrap lg:flex-col items-end gap-2.5 shrink-0">
            {/* Risk Score Pill */}
            <div className="bg-slate-100/90 border border-slate-200 px-3.5 py-2 rounded-xl text-right shadow-2xs">
              <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Acquisition Risk</div>
              <div className="flex items-center justify-end space-x-1.5 mt-0.5">
                <span className="text-xl font-black font-mono text-slate-950">{riskAnalysis.score}</span>
                <span className="text-xs text-slate-500">/100</span>
                <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border ${riskAnalysis.tierColor}`}>
                  {riskAnalysis.tier}
                </span>
              </div>
            </div>

            {/* Current Stage & Delay */}
            <div className="flex items-center space-x-2">
              <div className="bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
                <span className="text-[10px] text-slate-500 block font-mono font-medium">Current Stage</span>
                <strong className="text-amber-800 font-mono text-xs">{project.currentStage}</strong>
              </div>
              <div className="bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
                <span className="text-[10px] text-slate-500 block font-mono font-medium">SLA Timeline</span>
                {project.delayDays > 0 ? (
                  <strong className="text-rose-700 font-mono text-xs">+{project.delayDays}d Overdue</strong>
                ) : (
                  <strong className="text-emerald-700 font-mono text-xs">On Schedule</strong>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 11 Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Corridor Length</span>
          <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">{project.totalLengthKm || 0} km</span>
          <span className="text-[10px] text-slate-500">Alignment Length</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Land Required</span>
          <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">{project.totalAreaHa} Ha</span>
          <span className="text-[10px] text-slate-500">Total Statutory Target</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Land Acquired</span>
          <span className="text-base font-black font-mono text-emerald-700 mt-0.5 block">{project.acquiredAreaHa} Ha</span>
          <span className="text-[10px] text-emerald-600 font-bold">{project.acquisitionProgress || ((project.acquiredAreaHa / project.totalAreaHa) * 100).toFixed(1)}% Vested</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Land Pending</span>
          <span className="text-base font-black font-mono text-amber-700 mt-0.5 block">
            {(project.totalAreaHa - project.acquiredAreaHa).toFixed(1)} Ha
          </span>
          <span className="text-[10px] text-amber-700 font-medium">Under Award/Notice</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Districts / Parcels</span>
          <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">
            {project.districts.length} Dist / {project.totalParcels}
          </span>
          <span className="text-[10px] text-slate-500">{project.acquiredParcels} Parcels Acquired</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Landowners (PFMS)</span>
          <span className="text-base font-black font-mono text-blue-700 mt-0.5 block">
            {project.beneficiaries || 1284}
          </span>
          <span className="text-[10px] text-blue-600 font-medium">{project.beneficiariesPaid || 1052} Disbursed</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Total Compensation</span>
          <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">₹{formatCr(project.budgetAllocatedCrores)} Cr</span>
          <span className="text-[10px] text-slate-500">100% Solatium Included</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Compensation Paid</span>
          <span className="text-base font-black font-mono text-emerald-700 mt-0.5 block">₹{formatCr(project.budgetDisbursedCrores)} Cr</span>
          <span className="text-[10px] text-emerald-600 font-bold">
            {((project.budgetDisbursedCrores / project.budgetAllocatedCrores) * 100).toFixed(1)}% DBT Success
          </span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Compensation Pending</span>
          <span className="text-base font-black font-mono text-amber-700 mt-0.5 block">
            ₹{formatCr(project.budgetAllocatedCrores - project.budgetDisbursedCrores)} Cr
          </span>
          <span className="text-[10px] text-amber-700 font-medium">Bank/Escrow Pending</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Displaced / R&R</span>
          <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">
            {project.rehabilitatedFamilies} / {project.displacedFamilies}
          </span>
          <span className="text-[10px] text-slate-500">Resettlement Colonies</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Active Legal Stays</span>
          <span className="text-base font-black font-mono text-rose-700 mt-0.5 block">
            {project.activeDisputes} Disputes
          </span>
          <span className="text-[10px] text-rose-600 font-medium">High Court / NGT</span>
        </div>

        <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Pacing Status</span>
          <span className={`text-base font-black font-mono mt-0.5 block ${project.delayDays > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {project.delayDays > 0 ? `+${project.delayDays} Days` : 'On Target'}
          </span>
          <span className="text-[10px] text-slate-500">Statutory SLA Window</span>
        </div>
      </div>

      {/* 4. Large Interactive GIS Map & Route Station-to-Station Flow */}
      <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-3">
        
        {/* Map Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                Interactive GIS Corridor Route & Cadastral Parcels Layer
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live OpenStreetMap polyline corridor from <strong className="text-slate-800">{project.startLocation || 'Start'}</strong> to <strong className="text-slate-800">{project.endLocation || 'End'}</strong> with cadastral plots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Map Style Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-[11px] font-mono font-bold">
              {['OSM', 'SATELLITE', 'DARK'].map((style) => (
                <button
                  key={style}
                  onClick={() => setMapStyle(style)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    mapStyle === style ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Layer Toggles Dropdown/Pills */}
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 p-1 rounded-xl text-[10px] font-mono">
              <button 
                onClick={() => setLayers(prev => ({ ...prev, route: !prev.route }))}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${layers.route ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}
              >
                Route
              </button>
              <button 
                onClick={() => setLayers(prev => ({ ...prev, acquired: !prev.acquired }))}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${layers.acquired ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}
              >
                Acquired
              </button>
              <button 
                onClick={() => setLayers(prev => ({ ...prev, pending: !prev.pending }))}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${layers.pending ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setLayers(prev => ({ ...prev, disputes: !prev.disputes }))}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${layers.disputes ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}
              >
                Disputes
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Route Station-to-Station Flow Line */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 overflow-x-auto">
          <div className="flex items-center min-w-max space-x-3 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold shrink-0">Corridor Route:</span>
            
            {/* Start Node */}
            <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded-lg font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>START: {project.startLocation || project.districts[0]}</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* Intermediate Districts */}
            {project.districts.map((dst, dIdx) => (
              <React.Fragment key={dst}>
                <div className="flex items-center space-x-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>{dst}</span>
                </div>
                {dIdx < project.districts.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            ))}

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* End Node */}
            <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-300 text-rose-900 px-2.5 py-1 rounded-lg font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>END: {project.endLocation || project.districts[project.districts.length - 1]}</span>
            </div>

            <span className="text-[10px] font-mono text-slate-400 ml-auto pl-4 shrink-0">
              Total Corridor: <strong>{project.totalLengthKm || 0} km</strong>
            </span>
          </div>
        </div>

        {/* Map Grid Layout: Map (8 cols) + Side Information & Parcel Inspector (4 cols) */}
        <div ref={mapContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* Main Leaflet Map View (8 cols) */}
          <div className="lg:col-span-8 relative rounded-xl overflow-hidden border border-slate-300 shadow-inner h-[460px] lg:h-[540px]">
            <MapContainer
              center={[project.centerLat || 28.1487, project.centerLng || 76.9312]}
              zoom={project.zoom || 11}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <CorridorMapController 
                bounds={project.routeCoordinates} 
                center={[project.centerLat, project.centerLng]} 
                zoom={project.zoom} 
              />
              
              <TileLayer url={tileData.url} attribution={tileData.attr} />

              {/* 1. Project Route Polyline Layer */}
              {layers.route && project.routeCoordinates && project.routeCoordinates.length > 1 && (
                <>
                  {/* Outer glowing halo polyline */}
                  <Polyline 
                    positions={project.routeCoordinates} 
                    pathOptions={{ color: '#0284c7', weight: 8, opacity: 0.35 }} 
                  />
                  {/* Core sharp route polyline */}
                  <Polyline 
                    positions={project.routeCoordinates} 
                    pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.95, dashArray: '8, 6' }} 
                  />
                </>
              )}

              {/* 2. Route Waypoint Markers */}
              {(project.routeWaypoints || []).map((wp, wpIdx) => (
                <Marker
                  key={wpIdx}
                  position={[wp.lat, wp.lng]}
                  icon={createCustomIcon(wp.type, wp.name)}
                >
                  <Popup>
                    <div className="text-xs space-y-1 p-1 font-sans">
                      <div className="font-bold text-slate-900">{wp.name}</div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        {wp.district}, {wp.state} • Chainage: {wp.chainage}
                      </div>
                      <div className="text-[10px] font-mono text-amber-700 font-bold">
                        Node Role: {wp.type}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* 3. Cadastral Land Parcel Polygons */}
              {projectParcels.map((parcel) => {
                const isSelected = selectedParcel?.id === parcel.id;
                const isDisputed = parcel.status === 'LEGAL' || (parcel.legalIssues && parcel.legalIssues.length > 0);
                const isAcquired = parcel.status === 'ACQUIRED' || parcel.status === 'HANDOVER' || parcel.status === 'UTILIZATION';
                const isPending = !isAcquired && !isDisputed;

                if (isAcquired && !layers.acquired) return null;
                if (isPending && !layers.pending) return null;
                if (isDisputed && !layers.disputes) return null;

                const polygonColor = isDisputed ? '#dc2626' : (isAcquired ? '#059669' : '#d97706');
                const fillColor = isDisputed ? '#f87171' : (isAcquired ? '#34d399' : '#fbbf24');

                return (
                  <Polygon
                    key={parcel.id}
                    positions={parcel.coordinates}
                    pathOptions={{
                      color: polygonColor,
                      weight: isSelected ? 4 : 2,
                      fillColor: fillColor,
                      fillOpacity: isSelected ? 0.65 : 0.45,
                      dashArray: isSelected ? null : (isDisputed ? '4, 4' : null)
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedParcel(parcel);
                      }
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1.5 p-1 font-sans">
                        <div className="font-bold text-slate-900 border-b pb-1">
                          Survey No: {parcel.surveyNumber || parcel.surveyNo} ({parcel.id})
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <div><strong>Owner:</strong> {parcel.currentOwner || parcel.ownerName}</div>
                          <div><strong>Area:</strong> {parcel.areaHectares || parcel.area} Hectares</div>
                          <div><strong>Status:</strong> <span className="font-mono font-bold text-amber-800">{parcel.status}</span></div>
                          <div><strong>Compensation:</strong> ₹{((parcel.totalAwardAmount || 0) / 10000000).toFixed(2)} Cr</div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setFullParcelModalOpen(true);
                          }}
                          className="w-full mt-1 bg-slate-900 text-white text-[10px] font-bold py-1 rounded cursor-pointer"
                        >
                          View Cadastral Dossier
                        </button>
                      </div>
                    </Popup>
                  </Polygon>
                );
              })}
            </MapContainer>

            {/* Map Bottom Legend / Disclaimer Overlay */}
            <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-300 shadow-md text-[10px] font-mono flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-1 bg-blue-600 inline-block"></span>
                <span>Corridor Polyline</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded bg-emerald-500 inline-block"></span>
                <span>Acquired ({project.acquiredParcels})</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded bg-amber-500 inline-block"></span>
                <span>Pending ({project.totalParcels - project.acquiredParcels})</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded bg-rose-600 inline-block"></span>
                <span>Dispute ({project.activeDisputes})</span>
              </div>
            </div>
          </div>

          {/* Side Panel (4 cols): Corridor Info & Live Land Parcel Inspector */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            
            {/* Land Parcel Details Inspector */}
            <div className="gov-card rounded-xl p-4 bg-white border border-slate-200 shadow-xs flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black text-slate-900 font-mono uppercase">
                    Cadastral Parcel Inspector
                  </h4>
                </div>
                {selectedParcel && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedParcel.id}
                  </span>
                )}
              </div>

              {selectedParcel ? (
                <div className="space-y-2.5 mt-2.5 text-xs flex-1">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">Cadastral Survey Number</div>
                    <div className="text-sm font-black text-slate-900 font-mono">
                      Plot #{selectedParcel.surveyNumber || selectedParcel.surveyNo} ({selectedParcel.village || 'Rural'})
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono">
                      Bhu-Aadhaar (ULPIN): <strong>{selectedParcel.ulpin}</strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-600 text-[11px] divide-y divide-slate-100">
                    <div className="flex justify-between py-1">
                      <span>Primary Khatedar / Owner:</span>
                      <strong className="text-slate-900 text-right truncate max-w-[150px]">{selectedParcel.currentOwner || selectedParcel.ownerName}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Tehsil & District:</span>
                      <strong className="text-slate-900">{selectedParcel.tehsil || 'Central'}, {selectedParcel.district}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Plot Area:</span>
                      <strong className="font-mono text-slate-900">{selectedParcel.areaHectares || selectedParcel.area} Hectares</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Acquisition Stage:</span>
                      <strong className="font-mono text-amber-800 font-bold">{selectedParcel.status}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Compensation Award:</span>
                      <strong className="font-mono text-emerald-700">₹{((selectedParcel.totalAwardAmount || 0) / 10000000).toFixed(2)} Cr</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>PFMS DBT Status:</span>
                      <strong className="font-mono text-slate-900">{selectedParcel.dbtStatus || 'VERIFIED'}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Legal Status:</span>
                      <strong className={`font-mono ${selectedParcel.legalIssues?.length ? 'text-rose-700 font-bold' : 'text-emerald-700'}`}>
                        {selectedParcel.legalIssues?.length ? `${selectedParcel.legalIssues.length} Dispute Appeal` : 'Clear Title (No Dispute)'}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Parcel Risk Level:</span>
                      <strong className="font-mono text-amber-700">{selectedParcel.riskTier || 'MEDIUM'} ({selectedParcel.riskScore || 25}/100)</strong>
                    </div>
                  </div>

                  {/* Expected Next Action Box */}
                  <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-2.5 space-y-1">
                    <span className="font-bold text-amber-950 block text-[9px] uppercase font-mono">Expected Next Statutory Action:</span>
                    <p className="text-[10px] text-amber-900 leading-tight font-medium">
                      {selectedParcel.expectedNextAction || 'Proceed with standard solatium disbursal & revenue mutation.'}
                    </p>
                  </div>

                  <button 
                    onClick={() => setFullParcelModalOpen(true)}
                    className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Complete Parcel Dossier</span>
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs flex-1 flex flex-col items-center justify-center">
                  <MapPin className="w-8 h-8 text-slate-300 mb-2" />
                  <span>Click any land parcel on the map to inspect survey and owner details.</span>
                </div>
              )}
            </div>

            {/* Quick Parcels List Picker */}
            <div className="gov-card rounded-xl p-3 bg-white border border-slate-200">
              <div className="flex items-center justify-between pb-1.5 text-xs font-mono font-bold text-slate-700">
                <span>Corridor Parcels ({projectParcels.length}):</span>
                <button onClick={handleExportCSV} className="text-[10px] text-blue-600 hover:underline flex items-center space-x-1 cursor-pointer">
                  <Download className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs">
                {projectParcels.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedParcel(p)}
                    className={`p-1.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-[11px] ${
                      selectedParcel?.id === p.id 
                        ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate max-w-[160px]">
                      <span className="font-bold text-slate-900">#{p.surveyNumber || p.surveyNo}</span>
                      <span className="text-slate-500 font-mono text-[10px] ml-1">({p.village})</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      p.status === 'ACQUIRED' || p.status === 'HANDOVER' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                      p.status === 'LEGAL' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 5. Acquisition Lifecycle (12 Statutory Stages) */}
      <div className="gov-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                Statutory 12-Stage Acquisition Lifecycle Progression
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory sequencing under RFCTLARR Act 2013 with SLA duration tracking. Current Stage: <strong className="text-amber-800 font-mono">{project.currentStage}</strong>
            </p>
          </div>

          <span className="text-xs font-mono bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-lg font-bold">
            Total SLA Budget: 365 Days
          </span>
        </div>

        {/* 12-Stage Horizontal Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
          {STAGES_LIST.map((st, sIdx) => {
            const currentStageObj = STAGES_LIST.find(s => s.id === project.currentStage) || STAGES_LIST[7];
            const currentIndex = STAGES_LIST.findIndex(s => s.id === currentStageObj.id);
            const isCompleted = sIdx < currentIndex;
            const isCurrent = sIdx === currentIndex;
            const isUpcoming = sIdx > currentIndex;
            const daysSpent = (project.stageDays && project.stageDays[st.id]) || (isCompleted ? st.slaDays : (isCurrent ? project.delayDays + 20 : 0));

            return (
              <div 
                key={st.id}
                className={`p-2.5 rounded-xl border transition-all text-xs ${
                  isCurrent 
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-xs' 
                    : (isCompleted 
                        ? 'bg-emerald-50/40 border-emerald-200 text-slate-800' 
                        : 'bg-slate-50/50 border-slate-200 text-slate-400')
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black text-slate-400">
                    Stage {st.step}
                  </span>
                  {isCompleted && <span className="text-emerald-600 font-bold text-xs">✓ Done</span>}
                  {isCurrent && <span className="text-amber-700 font-bold font-mono text-[10px] bg-amber-200/70 px-1.5 py-0.2 rounded">Current</span>}
                  {isUpcoming && <span className="text-slate-400 font-mono text-[10px]">Pending</span>}
                </div>

                <div className="font-bold text-slate-900 mt-1 truncate" title={st.title}>
                  {st.title}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-1.5 border-t border-slate-200/60">
                  <span className="text-slate-500">SLA: {st.slaDays}d</span>
                  <span className={`font-bold ${daysSpent > st.slaDays ? 'text-rose-700' : 'text-slate-700'}`}>
                    {daysSpent}d Spent
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Two-Column Layout: Project Timeline (6 cols) & Delay Analysis (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left (6 cols): Chronological Project Milestone Timeline */}
        <div className="lg:col-span-6 gov-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                Project Milestone Timeline
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              {(project.timeline || []).length} Milestones Recorded
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {(project.timeline || []).map((ev, evIdx) => (
              <div key={evIdx} className="flex items-start space-x-3 text-xs">
                {/* Timeline connector dot */}
                <div className="flex flex-col items-center mt-1">
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    ev.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-200' :
                    ev.status === 'IN_PROGRESS' || ev.status === 'DELAYED' ? 'bg-amber-500 border-amber-200 animate-pulse' :
                    'bg-slate-300 border-slate-100'
                  }`} />
                  {evIdx < (project.timeline.length - 1) && (
                    <div className="w-0.5 h-10 bg-slate-200 my-0.5" />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{ev.date}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded border ${
                      ev.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                      ev.status === 'DELAYED' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">{ev.event}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>Authority: <strong className="text-slate-700">{ev.authority}</strong></span>
                    {ev.docRef && (
                      <span className="text-blue-600 font-bold">Ref: {ev.docRef}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (6 cols): Delay Analysis ("WHY IS THIS PROJECT DELAYED?") */}
        <div className="lg:col-span-6 gov-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                Why is this Project Delayed?
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded font-bold">
              Root-Cause Contribution Analysis
            </span>
          </div>

          {/* Breakdown Percentage Bars */}
          <div className="space-y-3 pt-1">
            {(project.delayBreakdown || [
              { cause: "Compensation processing & PFMS bank validation", percentage: 42, impact: "High" },
              { cause: "Landowner verification & inheritance mutations", percentage: 28, impact: "Medium" },
              { cause: "Section 3C legal review & court stays", percentage: 20, impact: "Medium" },
              { cause: "Forest clearance & utility shifting documentation", percentage: 10, impact: "Low" }
            ]).map((d, dIdx) => (
              <div key={dIdx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{d.cause}</span>
                  <span className="font-mono font-black text-slate-900">{d.percentage}% Contribution</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      d.percentage >= 40 ? 'bg-rose-500' : (d.percentage >= 25 ? 'bg-amber-500' : 'bg-blue-500')
                    }`}
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Action Box from Risk Engine */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 mt-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Recommended Central Ministry Action:</span>
            </div>
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              "{riskAnalysis.recommendedAction || 'Prioritize compensation verification for pending parcels and coordinate with District Collector for expedited PFMS DBT sign-off.'}"
            </p>
            <div className="text-[10px] text-amber-800/80 font-mono">
              Grounding: Rule-based explainable decision support engine v3.2 based on RFCTLARR SLA & court stay status.
            </div>
          </div>
        </div>

      </div>

      {/* 7. Risk Intelligence & Compensation & Legal Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Risk Intelligence */}
        <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-1.5">
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-black text-slate-900 font-mono uppercase">Risk Intelligence</h4>
            </div>
            <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border ${riskAnalysis.tierColor}`}>
              {riskAnalysis.tier} RISK
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-slate-500 font-medium">Composite Risk Score</span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {riskAnalysis.score}<span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Contributing Risk Factors:
            </span>
            {riskAnalysis.factors.map((f, fIdx) => (
              <div key={fIdx} className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg text-[11px]">
                <span className="font-medium text-slate-700 truncate max-w-[200px]">{f.detail}</span>
                <span className="font-mono font-bold text-rose-700 ml-1 shrink-0">{f.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Compensation Summary */}
        <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black text-slate-900 font-mono uppercase">Compensation Summary</h4>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              PFMS DBT
            </span>
          </div>

          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Solatium Award:</span>
              <strong className="font-mono text-slate-900">₹{formatCr(project.budgetAllocatedCrores)} Cr</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Disbursed into Accounts:</span>
              <strong className="font-mono text-emerald-700">₹{formatCr(project.budgetDisbursedCrores)} Cr</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pending Disbursal:</span>
              <strong className="font-mono text-amber-700">
                ₹{formatCr(project.budgetAllocatedCrores - project.budgetDisbursedCrores)} Cr
              </strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Credited Landowners:</span>
              <strong className="font-mono text-slate-900">{project.beneficiariesPaid || 1052} / {project.beneficiaries || 1284}</strong>
            </div>
          </div>

          {/* Paid vs Pending Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
              <span>Disbursed: {((project.budgetDisbursedCrores / project.budgetAllocatedCrores) * 100).toFixed(1)}%</span>
              <span>Pending: {(100 - (project.budgetDisbursedCrores / project.budgetAllocatedCrores) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-600 h-full"
                style={{ width: `${(project.budgetDisbursedCrores / project.budgetAllocatedCrores) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Legal & Disputes Summary */}
        <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-1.5">
              <Scale className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-black text-slate-900 font-mono uppercase">Legal Disputes & Stays</h4>
            </div>
            <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
              {project.activeDisputes || 0} Cases
            </span>
          </div>

          <div className="space-y-1.5 text-xs pt-1">
            {(project.disputes || []).length === 0 ? (
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-medium text-center">
                ✓ No active judicial stays or Section 3C disputes recorded.
              </div>
            ) : (
              (project.disputes || []).slice(0, 2).map((disp, dpIdx) => (
                <div key={dpIdx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-rose-700">{disp.caseId}</span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">{disp.status}</span>
                  </div>
                  <div className="font-bold text-slate-900 truncate">{disp.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono flex justify-between pt-0.5">
                    <span>{disp.court}</span>
                    {disp.nextHearing && <span>Hearing: {disp.nextHearing}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 8. Statutory Documents Vault & Project Status History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Documents Table (7 cols) */}
        <div className="lg:col-span-7 gov-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-slate-800" />
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                Statutory Corridor Documents Vault
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              {(project.documents || []).length} Verified Files
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white text-[10px] uppercase font-mono">
                <tr>
                  <th className="py-2 px-3">Document Title</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Uploaded Date</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(project.documents || []).map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{doc.size || '2.4 MB'} • By {doc.uploadedBy}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">
                      {doc.type}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">
                      {doc.uploadDate}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <a 
                          href={doc.url || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href={doc.url || '#'} 
                          download
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Status Change Audit Trail (5 cols) */}
        <div className="lg:col-span-5 gov-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                Status Change Audit Log
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              Ministry Transparency Log
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {(project.statusHistory || []).map((h, hIdx) => (
              <div key={hIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500 font-bold">{h.date}</span>
                  <div className="flex items-center space-x-1">
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">{h.fromStatus}</span>
                    <span>→</span>
                    <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">{h.toStatus}</span>
                  </div>
                </div>
                <div className="font-medium text-slate-800 leading-snug">{h.remarks}</div>
                <div className="text-[10px] text-slate-500 font-mono pt-0.5">
                  Officer: <strong className="text-slate-700">{h.changedBy}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 9. Central Ministry Action Buttons Toolbar */}
      <div className="gov-card rounded-2xl p-4 bg-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <strong className="block text-white font-bold">Central Ministry Executive Controls</strong>
            <span className="text-slate-400 font-mono text-[10px]">Authorized Joint Secretary / Super Admin Actions</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => alert(`Status Update Action Triggered for ${project.name} (${project.id}).\nNotification dispatched to Competent Authority & State Land Secretary.`)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Update Status
          </button>
          <button 
            onClick={() => {
              const remark = prompt(`Add official Ministry Remark for ${project.id}:`);
              if (remark) alert(`Ministry Remark Recorded:\n"${remark}"\nTimestamped & added to statutory audit ledger.`);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Add Official Remark
          </button>
          <button 
            onClick={() => alert(`Project ${project.id} Flagged for High-Power Cabinet Committee Intervention.\nPriority alert logged in Ministry Attention Center.`)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Flag for Intervention
          </button>
          <button 
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>

      {/* Full Cadastral Parcel Modal */}
      {fullParcelModalOpen && selectedParcel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 font-mono">
                  Cadastral Plot Dossier: {selectedParcel.surveyNumber || selectedParcel.surveyNo} ({selectedParcel.id})
                </h3>
              </div>
              <button 
                onClick={() => setFullParcelModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Bhu-Aadhaar (ULPIN)</span>
                <strong className="text-sm font-mono text-slate-900 block mt-0.5">{selectedParcel.ulpin}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Plot Land Area</span>
                <strong className="text-sm font-mono text-emerald-700 block mt-0.5">{selectedParcel.areaHectares || selectedParcel.area} Hectares</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Khatauni Khata Number</span>
                <strong className="text-sm font-mono text-slate-900 block mt-0.5">{selectedParcel.khataNo || 'K-1082'}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">RFCTLARR Solatium Award</span>
                <strong className="text-sm font-mono text-blue-700 block mt-0.5">
                  ₹{((selectedParcel.totalAwardAmount || 0) / 10000000).toFixed(2)} Cr
                </strong>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Khatedar / Landowner Name:</span>
                <strong>{selectedParcel.currentOwner || selectedParcel.ownerName}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Tehsil & Village:</span>
                <strong>{selectedParcel.tehsil || 'Sohna'}, {selectedParcel.village || 'Sohna Rural'}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>District & State:</span>
                <strong>{selectedParcel.district}, {selectedParcel.state}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Bank Disbursal Status:</span>
                <strong className="font-mono">{selectedParcel.dbtStatus || 'COMPLETED'}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button 
                onClick={() => setFullParcelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
