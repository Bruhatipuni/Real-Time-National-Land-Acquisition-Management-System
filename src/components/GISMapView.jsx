import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  FileText, 
  DollarSign, 
  Clock, 
  TreePine, 
  Users, 
  Edit3, 
  ExternalLink,
  ChevronDown,
  Info,
  Scale
} from 'lucide-react';
import { 
  ALL_36_STATES_AND_UTS, 
  DISTRICTS_BY_STATE, 
  PROJECT_SECTORS, 
  NATIONAL_PROJECTS, 
  NATIONAL_PARCELS, 
  NATIONAL_DASHBOARD_METRICS,
  getDemoProjectForSelection
} from '../data/nationalHierarchyData';
import { formatINR } from '../utils/compensationEngine';
import InteractivePolygonNodeEditor from './InteractivePolygonNodeEditor';

// Controller to smoothly pan/zoom Leaflet map
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet pin icon for project center
const projectPinIcon = L.divIcon({
  className: 'custom-pin-icon',
  html: `<div style="background-color: #2563eb; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">•</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

export default function GISMapView({ 
  projects = NATIONAL_PROJECTS, 
  parcels = NATIONAL_PARCELS, 
  selectedParcel, 
  setSelectedParcel,
  onNavigateToSimulator,
  onNavigateToDisputes,
  onLogAudit
}) {
  // 1. NATIONAL HIERARCHY FILTER STATES
  const [selectedState, setSelectedState] = useState('All'); // 'All' or specific state
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState(NATIONAL_PROJECTS[0].id);
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [searchParcelInput, setSearchParcelInput] = useState('');
  const [universalSearch, setUniversalSearch] = useState('');

  // 2. Active Tab in Inspector (Right Panel): 'project' or 'parcel'
  const [inspectorTab, setInspectorTab] = useState('project'); // 'project' | 'parcel'
  const [parcelSubTab, setParcelSubTab] = useState('overview'); // 'overview' | 'verification' | 'demarcation' | 'sla' | 'aiRisk' | 'docs'
  
  // 3. Map Settings
  const [mapStyle, setMapStyle] = useState('OSM'); // 'OSM' | 'SATELLITE' | 'DARK'
  const [isNodeEditorOpen, setIsNodeEditorOpen] = useState(false);

  // Active Project resolution
  const activeProject = useMemo(() => {
    if (selectedProjectId && selectedProjectId !== 'All') {
      const found = projects.find(p => p.id === selectedProjectId);
      if (found) return found;
    }
    return getDemoProjectForSelection(selectedState !== 'All' ? selectedState : 'Maharashtra', selectedDistrict !== 'All' ? selectedDistrict : 'Thane', selectedSector !== 'All' ? selectedSector : 'Railway');
  }, [projects, selectedProjectId, selectedState, selectedDistrict, selectedSector]);

  // Available districts dependent on selected state
  const availableDistricts = useMemo(() => {
    if (selectedState === 'All') return [];
    return DISTRICTS_BY_STATE[selectedState] || [];
  }, [selectedState]);

  // Available projects dependent on State & District & Sector
  const availableProjects = useMemo(() => {
    return projects.filter(p => {
      const matchState = selectedState === 'All' || p.state === selectedState;
      const matchDistrict = selectedDistrict === 'All' || p.district === selectedDistrict || (p.districts && p.districts.includes(selectedDistrict));
      const matchSector = selectedSector === 'All' || p.sector === selectedSector || p.projectType === selectedSector;
      return matchState && matchDistrict && matchSector;
    });
  }, [projects, selectedState, selectedDistrict, selectedSector]);

  // Available revenue villages dependent on project
  const availableVillages = useMemo(() => {
    if (activeProject && activeProject.villages) {
      return activeProject.villages;
    }
    return ["Kalyan East", "Shahapur", "Datiwali", "Kopar", "Bhilad", "Sohna Rural", "Polavaram Rural"];
  }, [activeProject]);

  // Active Parcel resolution
  const currentParcel = selectedParcel || parcels[0] || NATIONAL_PARCELS[0];

  // Filtered Parcels for Map and List
  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      // Universal search match
      if (universalSearch.trim()) {
        const q = universalSearch.toLowerCase();
        const matchesUniversal = 
          (p.projectName || '').toLowerCase().includes(q) ||
          (p.state || '').toLowerCase().includes(q) ||
          (p.district || '').toLowerCase().includes(q) ||
          (p.village || '').toLowerCase().includes(q) ||
          (p.ulpin || '').toLowerCase().includes(q) ||
          (p.plotNumber || p.surveyNo || '').toLowerCase().includes(q) ||
          (p.khataNumber || p.khataNo || '').toLowerCase().includes(q) ||
          (p.landowner || p.ownerName || '').toLowerCase().includes(q);
        if (!matchesUniversal) return false;
      }

      // Search parcel input match
      if (searchParcelInput.trim()) {
        const q = searchParcelInput.toLowerCase();
        const matchesParcelInput = 
          (p.ulpin || '').toLowerCase().includes(q) ||
          (p.plotNumber || p.surveyNo || '').toLowerCase().includes(q) ||
          (p.landowner || p.ownerName || '').toLowerCase().includes(q);
        if (!matchesParcelInput) return false;
      }

      // Dropdown hierarchy matches
      if (selectedState !== 'All' && p.state !== selectedState) return false;
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;
      if (selectedVillage !== 'All' && p.village !== selectedVillage && p.revenueVillage !== selectedVillage) return false;

      return true;
    });
  }, [parcels, universalSearch, searchParcelInput, selectedState, selectedDistrict, selectedVillage]);

  // When universal search matches a parcel, select it automatically
  const handleUniversalSearchChange = (value) => {
    setUniversalSearch(value);
    if (!value.trim()) return;
    const match = parcels.find(p => 
      p.ulpin.toLowerCase().includes(value.toLowerCase()) ||
      (p.plotNumber || '').toLowerCase().includes(value.toLowerCase()) ||
      (p.landowner || '').toLowerCase().includes(value.toLowerCase())
    );
    if (match) {
      setSelectedParcel(match);
      setInspectorTab('parcel');
    }
  };

  // Basemap Tile Providers
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

  // Status color styling
  const getStatusColor = (parcel) => {
    if (parcel.disputeStatus && parcel.disputeStatus.toLowerCase().includes('active')) {
      return { stroke: '#dc2626', fill: '#ef4444', label: 'Disputed Parcel' };
    }
    if (parcel.riskLevel === 'CRITICAL' || parcel.riskScore > 80) {
      return { stroke: '#dc2626', fill: '#ef4444', label: 'High Risk' };
    }
    if (parcel.status === 'VERIFICATION' || parcel.verificationScore === 100) {
      return { stroke: '#059669', fill: '#10b981', label: 'Verified Parcel' };
    }
    return { stroke: '#d97706', fill: '#f59e0b', label: 'In Progress' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-3 font-sans text-xs">
      {/* ========================================================================= */}
      {/* 1. DARK NATIONAL HIERARCHY FILTER BANNER (Matches User Image 1 Exactly)   */}
      {/* ========================================================================= */}
      <div className="bg-[#0b1329] text-white rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-black text-amber-400 tracking-wider uppercase flex items-center space-x-1">
              <span>NATIONAL HIERARCHY:</span>
            </span>
            <span className="bg-amber-500/20 text-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center space-x-1">
              <span>🇮🇳</span>
              <span>All India (36 States/UTs)</span>
            </span>
          </div>

          <button 
            onClick={() => {
              setSelectedState('All');
              setSelectedDistrict('All');
              setSelectedSector('All');
              setSelectedVillage('All');
              setSearchParcelInput('');
              setUniversalSearch('');
            }}
            className="text-[11px] font-bold text-slate-400 hover:text-amber-400 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>⚡ Filters</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Universal Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Universal National Search: Project Name, Agency, District, State, ULPIN (Bhu-Aadhaar), Survey No, or Landowner..."
            value={universalSearch}
            onChange={(e) => handleUniversalSearchChange(e.target.value)}
            className="w-full bg-[#080d1d] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-400 font-medium focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 6 Dependent Dropdown Selectors Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-[11px]">
          {/* 1. STATE / UT (36) */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
              1. STATE / UT (36)
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedVillage('All');
              }}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All India (36 States & UTs)</option>
              {ALL_36_STATES_AND_UTS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 2. DISTRICT */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
              2. DISTRICT ({availableDistricts.length > 0 ? availableDistricts.length : '786'})
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedVillage('All');
              }}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All Districts</option>
              {availableDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 3. SECTOR / TYPE */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
              3. SECTOR / TYPE ({PROJECT_SECTORS.length})
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All Sectors ({PROJECT_SECTORS.length})</option>
              {PROJECT_SECTORS.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* 4. PROJECT */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
              4. PROJECT ({availableProjects.length > 0 ? availableProjects.length : '58'})
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedVillage('All');
              }}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All Projects</option>
              {availableProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* 5. REVENUE VILLAGE */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
              5. REVENUE VILLAGE ({availableVillages.length})
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All Villages</option>
              {availableVillages.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* 6. PARCEL / ULPIN */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
              6. PARCEL / ULPIN ({filteredParcels.length})
            </label>
            <select
              value={currentParcel?.id || ''}
              onChange={(e) => {
                const found = parcels.find(p => p.id === e.target.value);
                if (found) {
                  setSelectedParcel(found);
                  setInspectorTab('parcel');
                }
              }}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 font-medium truncate"
            >
              <option value="">All Parcels ({filteredParcels.length})</option>
              {filteredParcels.map(p => (
                <option key={p.id} value={p.id}>
                  Plot {p.plotNumber || p.surveyNo} - {p.landowner || p.ownerName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP 4 NATIONAL DASHBOARD METRIC CARDS (Matches Image 1 Exactly)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: PARCELS TRACKED */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              PARCELS TRACKED
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              41,876
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              36403 Acquired (87%)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: LAND ACQUIRED */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              LAND ACQUIRED
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              150043.4 Ha
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Target: 178615.0 Ha
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: DBT DISBURSED */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              DBT DISBURSED
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              ₹682680.9 Cr
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              100% PFMS Verified
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <span className="font-bold text-base font-mono">₹</span>
          </div>
        </div>

        {/* Card 4: ACTIVE OBJECTIONS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              ACTIVE OBJECTIONS
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              793
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Sec 3C Dispute Radar
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RENAMED PROJECT ACQUISITION STRIP & PILLS (Requirement 11)             */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black text-slate-900 font-mono uppercase tracking-tight">
                LAND ACQUISITION & MANAGEMENT
              </h2>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-300 font-mono">
                ENGINE 1: STATUTORY LARR
              </span>
            </div>
            <p className="text-xs text-slate-500">
              End-to-end land acquisition, parcel verification, compensation, R&R and project monitoring
            </p>
          </div>
        </div>

        {/* 3 Action Navigation Pills */}
        <div className="flex items-center space-x-1.5 self-start lg:self-auto">
          <button
            onClick={() => setInspectorTab('project')}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>📄 1. Project Acquisition</span>
          </button>
          
          <button
            onClick={onNavigateToDisputes}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>📡 2. Land Dispute Radar</span>
            <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">NEW</span>
          </button>

          <button
            onClick={onNavigateToSimulator}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>⚡ 3. Route Simulator</span>
            <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">MCDA</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. NATIONAL SPATIAL HIERARCHY FILTERS STRIP (Matches Images 1 & 2)       */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-extrabold text-slate-900 tracking-wider">
            <span>🌐 NATIONAL SPATIAL HIERARCHY FILTERS</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Displaying: <strong className="text-slate-800 font-bold">{filteredParcels.length}</strong> of {parcels.length} Parcels ({projects.length} Projects)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {/* STATE */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">1. STATE</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedVillage('All');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:border-amber-500 text-xs"
            >
              <option value="All">All India (National)</option>
              {ALL_36_STATES_AND_UTS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* DISTRICT */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">2. DISTRICT</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedVillage('All');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:border-amber-500 text-xs"
            >
              <option value="All">All Districts</option>
              {availableDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* PROJECT TYPE */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">3. PROJECT TYPE</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:border-amber-500 text-xs"
            >
              <option value="All">All Project Types</option>
              {PROJECT_SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* PROJECT */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">4. PROJECT</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedVillage('All');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:border-amber-500 text-xs"
            >
              <option value="All">All Projects</option>
              {availableProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* REVENUE VILLAGE */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">5. REVENUE VILLAGE</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:border-amber-500 text-xs"
            >
              <option value="All">All Villages</option>
              {availableVillages.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* SEARCH PARCEL */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">6. SEARCH PARCEL</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="ULPIN / Plot / Owner..."
                value={searchParcelInput}
                onChange={(e) => setSearchParcelInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-2.5 py-1 text-slate-800 font-medium focus:border-amber-500 text-xs placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MAIN SPLIT LAYOUT: GIS MAP (Left) & DUAL TAB INSPECTOR (Right)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
        {/* LEFT: GIS MAP VIEW (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden relative shadow-md flex flex-col">
          {/* Basemap Switcher Controls */}
          <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-1 flex space-x-1 shadow-md">
            {['OSM', 'SATELLITE', 'DARK'].map(m => (
              <button
                key={m}
                onClick={() => setMapStyle(m)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                  mapStyle === m ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <MapContainer
            center={[activeProject.centerLat, activeProject.centerLng]}
            zoom={activeProject.zoom || 13}
            scrollWheelZoom={true}
            className="w-full h-full min-h-[580px] z-0"
          >
            <MapController center={[activeProject.centerLat, activeProject.centerLng]} zoom={activeProject.zoom || 13} />
            <TileLayer attribution={tileData.attr} url={tileData.url} />

            {/* Project Center Marker */}
            <Marker position={[activeProject.centerLat, activeProject.centerLng]} icon={projectPinIcon}>
              <Popup>
                <div className="p-1 space-y-1 text-slate-900 font-sans text-xs">
                  <strong className="block text-slate-900">{activeProject.name}</strong>
                  <div className="text-slate-600">{activeProject.agency}</div>
                  <div className="text-emerald-700 font-bold">{activeProject.district}, {activeProject.state}</div>
                </div>
              </Popup>
            </Marker>

            {/* Render Land Parcel Polygons */}
            {filteredParcels.map((p) => {
              const statusColors = getStatusColor(p);
              const isSelected = currentParcel?.id === p.id;

              return (
                <Polygon
                  key={p.id}
                  positions={p.coordinates}
                  pathOptions={{
                    color: isSelected ? '#000000' : statusColors.stroke,
                    fillColor: statusColors.fill,
                    fillOpacity: isSelected ? 0.75 : 0.50,
                    weight: isSelected ? 3.5 : 2,
                    dashArray: (p.disputeStatus && p.disputeStatus.toLowerCase().includes('active')) ? '6, 6' : null
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedParcel(p);
                      setInspectorTab('parcel');
                    }
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900 font-sans text-xs">
                      <div className="font-mono font-bold text-amber-800">Plot {p.plotNumber || p.surveyNo}</div>
                      <div className="font-bold">{p.landowner || p.ownerName}</div>
                      <div className="text-slate-600">Area: {p.officialArea || p.areaHectares} Ha</div>
                      <div className="text-emerald-700 font-mono font-bold">ULPIN: {p.ulpin}</div>
                      <button
                        onClick={() => {
                          setSelectedParcel(p);
                          setInspectorTab('parcel');
                        }}
                        className="mt-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold block"
                      >
                        Inspect Parcel Details
                      </button>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>
        </div>

        {/* RIGHT: DUAL TAB INSPECTOR (5 Cols) - Project Intelligence & Parcel Inspection */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-md flex flex-col justify-between overflow-y-auto space-y-4">
          <div>
            {/* Top Tabs Switcher */}
            <div className="flex border-b border-slate-200 pb-2 space-x-2">
              <button
                onClick={() => setInspectorTab('project')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  inspectorTab === 'project'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>📊 Project Intelligence</span>
              </button>

              <button
                onClick={() => setInspectorTab('parcel')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  inspectorTab === 'parcel'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>📄 Parcel Inspection ({currentParcel?.plotNumber || "Plot 112/3B"})</span>
              </button>
            </div>

            {/* TAB 1 CONTENT: PROJECT INTELLIGENCE (Matches Image 2 & Image 3) */}
            {inspectorTab === 'project' && (
              <div className="space-y-3 mt-3">
                {/* Cross-Pillar Header */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      CROSS-PILLAR PROJECT INTELLIGENCE
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-600">
                      {activeProject.code || activeProject.id}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    {activeProject.name}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600 border-t border-slate-200/80">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">State:</span>
                      <strong className="text-slate-800">{activeProject.state}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 block uppercase">Agency:</span>
                      <strong className="text-slate-800 truncate block">{activeProject.agency}</strong>
                    </div>
                  </div>
                </div>

                {/* 4 Risk Cards Grid (Matches Image 2 Exactly) */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Card 1: ACQUISITION RISK */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-500">ACQUISITION RISK</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                        {activeProject.acquisitionRiskLevel || "HIGH"}
                      </span>
                    </div>
                    <div className="text-lg font-mono font-black text-slate-900">
                      {activeProject.acquisitionRiskScore || 78}/100
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {activeProject.delayProbability || "78%"} Delay Probability
                    </span>
                  </div>

                  {/* Card 2: ENVIRONMENTAL RISK */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-500">ENVIRONMENTAL RISK</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        {activeProject.environmentalRiskTag || "ESG"}
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-900">
                      {activeProject.environmentalRisk || "MEDIUM"}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {activeProject.environmentalDetails || "2.1 km Forest • 1 River"}
                    </span>
                  </div>

                  {/* Card 3: SOCIAL IMPACT */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-500">SOCIAL IMPACT</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {activeProject.socialImpactTag || "R&R"}
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-900">
                      {activeProject.socialImpact || "HIGH"}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {activeProject.familiesAffected || 620} Families Affected
                    </span>
                  </div>

                  {/* Card 4: LEGAL DISPUTES */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-500">LEGAL DISPUTES</span>
                    </div>
                    <div className="text-base font-black text-slate-900">
                      {activeProject.legalDisputesCount || 48} Cases
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {activeProject.highRiskParcelsCount || 31} High-Risk Parcels
                    </span>
                  </div>
                </div>

                {/* Estimated Compensation & Duration Row (Matches Image 3) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">ESTIMATED COMPENSATION</span>
                    <strong className="text-base font-mono font-black text-slate-900 block mt-0.5">
                      ₹{activeProject.estimatedCompensationCr || 2200} Cr
                    </strong>
                    <span className="text-[10px] text-slate-500 block">PFMS DBT Workflow</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">ESTIMATED DURATION</span>
                    <strong className="text-base font-mono font-black text-slate-900 block mt-0.5">
                      {activeProject.estimatedDurationMonths || 14} Months
                    </strong>
                    <span className="text-[10px] text-slate-500 block">6 Mos Faster on Route C</span>
                  </div>
                </div>

                {/* PRE-ACQUISITION RECOMMENDED ROUTE CARD (Matches Image 3 Exactly) */}
                <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-emerald-900 uppercase tracking-wider flex items-center space-x-1">
                      <span>✨ PRE-ACQUISITION RECOMMENDED ROUTE</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                      ROUTE C • 39/100
                    </span>
                  </div>

                  <div className="text-slate-800 text-xs font-semibold">
                    Quantified Advantages vs Route A:
                  </div>

                  <ul className="text-[11px] text-slate-700 space-y-1 font-medium pl-1">
                    <li>• <strong className="text-slate-900">60% fewer</strong> affected families (620 vs 1,450)</li>
                    <li>• <strong className="text-slate-900">75% fewer</strong> legal disputes (48 vs 180 cases)</li>
                    <li>• <strong className="text-slate-900">₹350 Cr lower</strong> estimated statutory compensation</li>
                    <li>• <strong className="text-slate-900">6 months faster</strong> statutory notification-to-possession</li>
                  </ul>

                  {onNavigateToSimulator && (
                    <button
                      onClick={onNavigateToSimulator}
                      className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 text-xs shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open Alternative Route Simulator & ESG Layer &gt;</span>
                    </button>
                  )}
                </div>

                {/* TOP 5 PRIORITY DECISION SUPPORT ACTIONS (Matches Image 3 Exactly) */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-[10px] font-mono font-extrabold uppercase text-slate-600 tracking-wider">
                    TOP 5 PRIORITY DECISION SUPPORT ACTIONS:
                  </h4>
                  <ol className="text-[11px] text-slate-700 space-y-1.5 pl-4 list-decimal leading-relaxed">
                    <li>Prioritize dispute resolution and compensation verification before proceeding to Section 19 notification.</li>
                    <li>Implement Schedule II Rehabilitation &amp; Resettlement consultation for 142 affected claims.</li>
                    <li>Accelerate Joint Measurement Surveys (JMS) for 18 parcels with area mismatches using offline field mode.</li>
                    <li>Deposit disputed compensation in court escrow to proceed with undisputed chainages.</li>
                    <li>Select Route C alignment to bypass eco-sensitive forest zone and reduce rehabilitation burden by 60%.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 2 CONTENT: PARCEL INSPECTION STUDIO */}
            {inspectorTab === 'parcel' && (
              <div className="space-y-3 mt-3">
                {/* Parcel Header */}
                <div className="border-b border-slate-200 pb-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      ULPIN: {currentParcel.ulpin}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                      {currentParcel.surveyStatus || "Demarcated"}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Plot #{currentParcel.plotNumber || currentParcel.surveyNo} • {currentParcel.landowner || currentParcel.ownerName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Khata {currentParcel.khataNumber || currentParcel.khataNo} • {currentParcel.village}, {currentParcel.district}, {currentParcel.state}
                  </p>
                </div>

                {/* Parcel Subtabs */}
                <div className="flex border-b border-slate-200 gap-1 text-[11px] overflow-x-auto pb-1">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'verification', label: 'Verification (Score)' },
                    { id: 'demarcation', label: 'Field Demarcation & Editor' },
                    { id: 'sla', label: 'Timeline & SLA' },
                    { id: 'aiRisk', label: 'AI Risk & DSS' },
                    { id: 'docs', label: 'Documents' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setParcelSubTab(tab.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                        parcelSubTab === tab.id ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Subtab 1: Overview */}
                {parcelSubTab === 'overview' && (
                  <div className="space-y-2.5">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Expected Next Action</span>
                      <p className="text-xs font-semibold text-slate-800">
                        {currentParcel.expectedNextAction || "Complete JMS spot verification with Revenue Inspector"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[9px] uppercase">Official Area</span>
                        <strong className="text-slate-800 font-mono text-xs">{currentParcel.officialArea} Ha</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[9px] uppercase">Surveyed Area</span>
                        <strong className="text-slate-800 font-mono text-xs">{currentParcel.surveyedArea || currentParcel.officialArea} Ha</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[9px] uppercase">Land Classification</span>
                        <strong className="text-slate-800">{currentParcel.landClassification}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[9px] uppercase">RFCTLARR Solatium Award</span>
                        <strong className="text-emerald-700 font-mono">{formatINR(currentParcel.totalAwardAmount || 30160000)}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab 2: Verification */}
                {parcelSubTab === 'verification' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Field Verification Score</span>
                        <strong className="text-lg font-mono font-black text-slate-900">{currentParcel.verificationScore || 100}%</strong>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        DGPS Verified
                      </span>
                    </div>

                    {currentParcel.alert && (
                      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span><strong>Discrepancy Flagged:</strong> {currentParcel.alert}</span>
                      </div>
                    )}

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cadastral RoR Status:</span>
                        <span className="font-semibold text-slate-800">7/12 Mutation Verified</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Encroachment Risk:</span>
                        <span className="font-bold text-slate-800">{currentParcel.encroachmentRisk || "LOW"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">GIS Demarcation:</span>
                        <span className="font-semibold text-slate-800">{currentParcel.gisDemarcation}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab 3: Field Demarcation & Editor */}
                {parcelSubTab === 'demarcation' && (
                  <div className="space-y-3">
                    <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                          Interactive Polygon Node Editor
                        </span>
                        <button
                          onClick={() => setIsNodeEditorOpen(!isNodeEditorOpen)}
                          className="bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isNodeEditorOpen ? "Close Editor" : "Open Node Editor"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Fine-tune boundary nodes, adjust DGPS latitude/longitude vertices, and commit boundary revisions to BhuStack ledger.
                      </p>
                    </div>

                    {isNodeEditorOpen && (
                      <InteractivePolygonNodeEditor
                        parcel={currentParcel}
                        onSaveCoordinates={(id, nodes, groundAssets, status) => {
                          currentParcel.coordinates = nodes;
                          currentParcel.groundAssets = groundAssets;
                          currentParcel.surveyStatus = status;
                          setIsNodeEditorOpen(false);
                        }}
                        onClose={() => setIsNodeEditorOpen(false)}
                        onLogAudit={onLogAudit}
                      />
                    )}

                    {/* Ground Assets Breakdown */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 text-[11px]">
                      <span className="font-bold uppercase text-slate-500 text-[9px] block">Enumerated Ground Assets</span>
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[9px]">Trees</span>
                          <strong className="text-emerald-700 font-mono text-xs">{currentParcel.groundAssets?.trees || 14}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[9px]">Wells / Borewells</span>
                          <strong className="text-cyan-700 font-mono text-xs">{(currentParcel.groundAssets?.wells || 1) + (currentParcel.groundAssets?.borewells || 1)}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[9px]">Structures</span>
                          <strong className="text-amber-700 font-mono text-xs">{(currentParcel.groundAssets?.buildings || 0) + (currentParcel.groundAssets?.utilityStructures || 1)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab 4: Timeline & SLA */}
                {parcelSubTab === 'sla' && (
                  <div className="space-y-2">
                    {(currentParcel.timeline || [
                      { stage: "Identification", date: "15 Oct 2025", status: "On Time", details: "ULPIN generated via Bhu-Aadhaar engine" },
                      { stage: "Field Survey", date: "18 Feb 2026", status: "On Time", details: "DGPS field boundary pegged with 4 ground markers" },
                      { stage: "Record Verification", date: "26 Feb 2026", status: "On Time", details: "100% score; zero area variance detected" },
                      { stage: "Solatium Award", date: "Pending", status: "At Risk", details: "Awaiting LAO Section 3G approval" }
                    ]).map((tl, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start justify-between text-[11px]">
                        <div>
                          <strong className="text-slate-900 block">{tl.stage} ({tl.date})</strong>
                          <span className="text-slate-500 text-[10px]">{tl.details}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          tl.status === 'On Time' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {tl.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtab 5: AI Risk & DSS */}
                {parcelSubTab === 'aiRisk' && (
                  <div className="space-y-2.5">
                    <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono uppercase block">AI Risk Prioritization</span>
                        <strong className="text-lg font-mono font-black">{currentParcel.riskScore || 78}/100</strong>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {currentParcel.riskLevel || "HIGH"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                      <span className="text-slate-500 uppercase text-[9px] font-mono block">Primary Risk Factors:</span>
                      <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                        <li>Classification variation between RoR and Field Survey</li>
                        <li>Proximity to railway alignment buffer</li>
                        <li>Pending Solatium signature by District Collector</li>
                      </ul>
                      <div className="pt-2 border-t border-slate-200 text-amber-900 font-semibold">
                        Recommended Action: Prioritize field verification and Section 19 notification.
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab 6: Documents */}
                {parcelSubTab === 'docs' && (
                  <div className="space-y-2">
                    {(currentParcel.documents || [
                      { id: "DOC-01", title: "Khatauni Revenue Extract 7/12", type: "REVENUE_RECORD", date: "12 Jan 2026", status: "VERIFIED", officer: "Talathi Officer Kalyan" },
                      { id: "DOC-02", title: "Joint Measurement Survey (JMS) Field Sheet", type: "SURVEY_SHEET", date: "18 Feb 2026", status: "VERIFIED", officer: "Anish Kumar (Senior Surveyor)" }
                    ]).map(doc => (
                      <div key={doc.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <div>
                            <strong className="text-slate-900 block truncate max-w-[180px]">{doc.title}</strong>
                            <span className="text-[9px] text-slate-400">{doc.date} • {doc.officer}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Notice */}
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>BhuSetu Spatial Engine v2.6</span>
            <span>NIC / MoRTH Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
