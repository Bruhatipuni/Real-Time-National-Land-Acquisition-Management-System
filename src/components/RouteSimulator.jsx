import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Trees, 
  Droplets, 
  Building, 
  Hospital, 
  GraduationCap, 
  Landmark, 
  Users, 
  Sliders, 
  Download, 
  Check, 
  Route, 
  BookmarkCheck,
  ChevronDown
} from 'lucide-react';
import { 
  ALL_36_STATES_AND_UTS, 
  DISTRICTS_BY_STATE, 
  PROJECT_SECTORS, 
  NATIONAL_PROJECTS, 
  calculateRouteMCDAScore 
} from '../data/nationalHierarchyData';
import { formatINR } from '../utils/compensationEngine';

// Map controller to smoothly pan/fit bounds
function MapBoundsController({ bounds, center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 1.0 });
      } catch (e) {
        if (center) map.flyTo(center, zoom || 12);
      }
    } else if (center) {
      map.flyTo(center, zoom || 12);
    }
  }, [bounds, center, zoom, map]);
  return null;
}

// Custom Leaflet Icons for Start / End Nodes
const startPinIcon = L.divIcon({
  className: 'route-start-pin',
  html: `<div style="background-color: #10b981; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">▶</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

const endPinIcon = L.divIcon({
  className: 'route-end-pin',
  html: `<div style="background-color: #ef4444; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">◼</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

export default function RouteSimulator({ onInspectParcel }) {
  // Active Main Subtab ('comparison' | 'envSocial' | 'whatIf' | 'report')
  const [activeSimulatorTab, setActiveSimulatorTab] = useState('comparison');

  // Hierarchy Selection States
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedProject, setSelectedProject] = useState('PROJ-HR-DME'); // Delhi-Mumbai Expressway (Haryana Section)
  const [selectedVillage, setSelectedVillage] = useState('All');

  // Basemap Tile Style ('Voyager' | 'Satellite')
  const [tileStyle, setTileStyle] = useState('Voyager');

  // Active Routes Toggles
  const [visibleRoutes, setVisibleRoutes] = useState({
    ROUTE_A: true,
    ROUTE_B: true,
    ROUTE_C: true
  });

  // Active Corridor Buffer: '50m' | '100m' | '200m'
  const [activeBuffer, setActiveBuffer] = useState('100m');

  // Environmental & Social GIS Layer Toggles
  const [envLayers, setEnvLayers] = useState({
    forest: true,
    water: true,
    schools: false,
    hospitals: false,
    heritage: false,
    community: false
  });

  // Adopted Status Notice
  const [adoptedRoute, setAdoptedRoute] = useState(false);

  // What-If Weight Adjusters
  const [weights, setWeights] = useState({
    land: 30,
    social: 25,
    legal: 20,
    compensation: 15,
    delay: 10
  });

  // Candidate Routes Data around Delhi-Mumbai Expressway (Haryana Section - Sohna / Taoru / Nuh)
  const [candidateRoutes, setCandidateRoutes] = useState([
    {
      id: "ROUTE_A",
      name: "Route A (Original DPR Alignment)",
      code: "Route A",
      color: "#ef4444", // Red
      landRequiredAcres: 2400,
      affectedFamilies: 620,
      disputedParcels: 48,
      highRiskParcels: 31,
      estimatedCompensationCr: 2200,
      estimatedDurationMonths: 14,
      forestAreaKm: 4.8,
      riverCrossings: 3,
      coordinates: [
        [28.2520, 77.0650], // Sohna
        [28.2100, 77.0100], // Taoru bypass
        [28.1487, 76.9312], // Nuh
        [28.0200, 76.8500],
        [27.8920, 76.7820]
      ]
    },
    {
      id: "ROUTE_B",
      name: "Route B (Northern Periphery Bypass)",
      code: "Route B",
      color: "#f97316", // Orange
      landRequiredAcres: 2100,
      affectedFamilies: 380,
      disputedParcels: 27,
      highRiskParcels: 18,
      estimatedCompensationCr: 1950,
      estimatedDurationMonths: 9,
      forestAreaKm: 3.2,
      riverCrossings: 2,
      coordinates: [
        [28.2520, 77.0650],
        [28.2350, 76.9800],
        [28.1650, 76.9050],
        [28.0500, 76.8200],
        [27.8920, 76.7820]
      ]
    },
    {
      id: "ROUTE_C",
      name: "Route C (Eco & Habitation Optimized Alignment)",
      code: "Route C",
      color: "#10b981", // Green
      landRequiredAcres: 2300,
      affectedFamilies: 250,
      disputedParcels: 12,
      highRiskParcels: 9,
      estimatedCompensationCr: 1850,
      estimatedDurationMonths: 8,
      forestAreaKm: 0.8,
      riverCrossings: 1,
      coordinates: [
        [28.2520, 77.0650],
        [28.2200, 77.0300],
        [28.1550, 76.9450],
        [28.0350, 76.8650],
        [27.8920, 76.7820]
      ]
    }
  ]);

  // Dynamic MCDA Calculation
  const scoredRoutes = useMemo(() => {
    return candidateRoutes.map(route => {
      const score = calculateRouteMCDAScore(route);
      return {
        ...route,
        score
      };
    });
  }, [candidateRoutes]);

  const recommendedRoute = useMemo(() => {
    return [...scoredRoutes].sort((a, b) => a.score - b.score)[0];
  }, [scoredRoutes]);

  const routeA = scoredRoutes.find(r => r.id === 'ROUTE_A') || scoredRoutes[0];
  const routeB = scoredRoutes.find(r => r.id === 'ROUTE_B') || scoredRoutes[1];
  const routeC = scoredRoutes.find(r => r.id === 'ROUTE_C') || scoredRoutes[2];

  // Tile URL setup (clean without watermark)
  const tileUrl = useMemo(() => {
    if (tileStyle === 'Satellite') {
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    }
    // High-resolution clean OpenStreetMap / Carto without token errors
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }, [tileStyle]);

  const tileAttr = useMemo(() => {
    if (tileStyle === 'Satellite') return "&copy; Esri World Imagery";
    return "&copy; OpenStreetMap contributors";
  }, [tileStyle]);

  // Route bounds for map centering
  const allRouteCoords = useMemo(() => {
    return candidateRoutes.flatMap(r => r.coordinates);
  }, [candidateRoutes]);

  const toggleRouteVisibility = (routeId) => {
    setVisibleRoutes(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  const toggleEnvLayer = (layerKey) => {
    setEnvLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const handleAdoptRouteC = () => {
    setAdoptedRoute(true);
    setTimeout(() => setAdoptedRoute(false), 4000);
  };

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* ========================================================================= */}
      {/* 1. ALTERNATIVE ROUTE SIMULATOR HEADER BOX (Matches Screenshot 1)          */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          {/* Orange Square Icon */}
          <div className="w-11 h-11 rounded-xl bg-[#ea580c] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0 mt-0.5">
            <Route className="w-6 h-6 text-white stroke-[2.5]" />
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                Alternative Route Simulator
              </h2>
              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                PRE-ACQUISITION DECISION SUPPORT
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                SYNTHETIC DEMO DATA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Multi-Criteria Decision Analysis (MCDA) • Environmental &amp; Social GIS • What-If Scenario Simulator
            </p>
          </div>
        </div>

        {/* 4 Action Pills on Right */}
        <div className="flex items-center space-x-1.5 self-start lg:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveSimulatorTab('comparison')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSimulatorTab === 'comparison'
                ? 'bg-white border-2 border-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Route Comparison</span>
          </button>

          <button
            onClick={() => setActiveSimulatorTab('envSocial')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSimulatorTab === 'envSocial'
                ? 'bg-white border-2 border-emerald-500 text-slate-950 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span>Environmental &amp; Social</span>
            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">GIS</span>
          </button>

          <button
            onClick={() => setActiveSimulatorTab('whatIf')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSimulatorTab === 'whatIf'
                ? 'bg-white border-2 border-purple-500 text-slate-950 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-600" />
            <span>What-If Simulator</span>
            <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">MCDA</span>
          </button>

          <button
            onClick={() => setActiveSimulatorTab('report')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSimulatorTab === 'report'
                ? 'bg-white border-2 border-slate-800 text-slate-950 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DARK FILTER & CONTROL BAR (Matches Screenshot 1 & 2)                  */}
      {/* ========================================================================= */}
      <div className="bg-[#0b1329] text-white rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
        {/* Top Breadcrumb + Tile Style Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-300">
            <span className="text-amber-400 font-mono font-black tracking-wide flex items-center space-x-1">
              <span>⚡ NATIONAL HIERARCHY:</span>
            </span>
            <span className="text-slate-400">India</span>
            <span>&rarr;</span>
            <span className="text-amber-400 font-bold">All States</span>
            <span>&rarr;</span>
            <span className="text-slate-300">All Districts</span>
            <span>&rarr;</span>
            <span className="text-emerald-400 font-semibold truncate max-w-[200px]">Delhi-Mumbai Industrial E...</span>
            <span>&rarr;</span>
            <span className="text-purple-400">All Villages</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-400 font-mono">Tile Style:</span>
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setTileStyle('Voyager')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-colors cursor-pointer ${
                  tileStyle === 'Voyager' ? 'bg-[#d97706] text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Voyager
              </button>
              <button
                onClick={() => setTileStyle('Satellite')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-colors cursor-pointer ${
                  tileStyle === 'Satellite' ? 'bg-[#d97706] text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>
        </div>

        {/* 5 Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-[11px]">
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">1. STATE / UT</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:border-amber-500 font-medium truncate"
            >
              <option value="All">🔵 All Indian States</option>
              {ALL_36_STATES_AND_UTS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">2. DISTRICT</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All Districts</option>
              {(DISTRICTS_BY_STATE["Haryana"] || []).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">3. PROJECT SECTOR</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All Project Sectors</option>
              {PROJECT_SECTORS.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">4. INFRASTRUCTURE PROJECT</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:border-amber-500 font-medium truncate"
            >
              <option value="PROJ-HR-DME">[HIGHWAY] Delhi-Mumbai Indu...</option>
              <option value="PROJ-MAH-HSR">[RAILWAY] Mumbai-Ahmedabad HSR</option>
              <option value="PROJ-AP-POLA">[IRRIGATION] Polavaram Multi-Purpose</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">5. REVENUE VILLAGE</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full bg-[#111936] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:border-amber-500 font-medium truncate"
            >
              <option value="All">All Revenue Villages</option>
              <option value="Sohna">Sohna Rural</option>
              <option value="Taoru">Taoru</option>
              <option value="Nuh">Nuh City Outskirts</option>
            </select>
          </div>
        </div>

        {/* Bottom Controls: Routes Checkboxes (Left) + Corridor Buffer (Right) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Left: Routes Checkboxes */}
          <div className="flex items-center space-x-4 font-bold font-mono">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">ROUTES:</span>
            
            {/* Route A */}
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={visibleRoutes.ROUTE_A}
                onChange={() => toggleRouteVisibility('ROUTE_A')}
                className="w-3.5 h-3.5 accent-blue-600 rounded"
              />
              <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444] inline-block"></span>
              <span className="text-white text-[11px]">Route A</span>
            </label>

            {/* Route B */}
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={visibleRoutes.ROUTE_B}
                onChange={() => toggleRouteVisibility('ROUTE_B')}
                className="w-3.5 h-3.5 accent-blue-600 rounded"
              />
              <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316] inline-block"></span>
              <span className="text-white text-[11px]">Route B</span>
            </label>

            {/* Route C */}
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={visibleRoutes.ROUTE_C}
                onChange={() => toggleRouteVisibility('ROUTE_C')}
                className="w-3.5 h-3.5 accent-blue-600 rounded"
              />
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981] inline-block"></span>
              <span className="text-white text-[11px]">Route C</span>
            </label>
          </div>

          {/* Right: Corridor Buffer */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              CORRIDOR BUFFER:
            </span>
            <div className="flex bg-[#111936] p-0.5 rounded-lg border border-slate-700">
              {['50m', '100m', '200m'].map(buf => (
                <button
                  key={buf}
                  onClick={() => setActiveBuffer(buf)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-colors cursor-pointer ${
                    activeBuffer === buf ? 'bg-[#d97706] text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {buf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ENVIRONMENTAL & SOCIAL GIS LAYERS STRIP (Matches Screenshot 2)        */}
      {/* ========================================================================= */}
      <div className="bg-[#052822] text-emerald-300 border border-emerald-700/50 rounded-2xl p-3.5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-bold font-mono tracking-wider text-emerald-300">
            <span>🍃 ENVIRONMENTAL &amp; SOCIAL GIS LAYERS (SYNTHETIC DEMO OVERLAYS)</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">
            Click layer to toggle on GIS map
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Forest */}
          <button
            onClick={() => toggleEnvLayer('forest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              envLayers.forest
                ? 'bg-[#0f766e] text-white border border-teal-400 shadow-xs'
                : 'bg-[#0b3b33] text-emerald-300/80 border border-emerald-800'
            }`}
          >
            <span>🌲 Forest &amp; Protected Areas</span>
          </button>

          {/* Water Bodies */}
          <button
            onClick={() => toggleEnvLayer('water')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              envLayers.water
                ? 'bg-[#0284c7] text-white border border-cyan-400 shadow-xs'
                : 'bg-[#0b3b33] text-emerald-300/80 border border-emerald-800'
            }`}
          >
            <span>💧 Water Bodies &amp; Canals</span>
          </button>

          {/* Schools */}
          <button
            onClick={() => toggleEnvLayer('schools')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              envLayers.schools
                ? 'bg-[#7c3aed] text-white border border-purple-400 shadow-xs'
                : 'bg-[#0b3b33] text-emerald-300/80 border border-emerald-800'
            }`}
          >
            <span>🏫 Schools</span>
          </button>

          {/* Hospitals */}
          <button
            onClick={() => toggleEnvLayer('hospitals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              envLayers.hospitals
                ? 'bg-[#e11d48] text-white border border-rose-400 shadow-xs'
                : 'bg-[#0b3b33] text-emerald-300/80 border border-emerald-800'
            }`}
          >
            <span>🏥 Hospitals</span>
          </button>

          {/* Heritage */}
          <button
            onClick={() => toggleEnvLayer('heritage')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              envLayers.heritage
                ? 'bg-[#d97706] text-white border border-amber-400 shadow-xs'
                : 'bg-[#0b3b33] text-emerald-300/80 border border-emerald-800'
            }`}
          >
            <span>🏛️ Heritage &amp; Religious Sites</span>
          </button>

          {/* Community */}
          <button
            onClick={() => toggleEnvLayer('community')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              envLayers.community
                ? 'bg-[#059669] text-white border border-emerald-400 shadow-xs'
                : 'bg-[#0b3b33] text-emerald-300/80 border border-emerald-800'
            }`}
          >
            <span>🏘️ Community Assets</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. GIS MAP: MULTI-LAYER OVERLAY (Matches Screenshot 3)                     */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md flex flex-col relative">
        {/* Map Header & Title Strip */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-extrabold text-slate-900 text-xs font-mono">
              GIS Multi-Layer Overlay • Delhi-Mumbai Industrial Expressway (Haryana Section)
            </span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
              3 Parcels Displayed
            </span>
          </div>

          {/* Map Legend */}
          <div className="flex items-center space-x-3 text-[11px] text-slate-600 font-medium">
            <span className="font-bold text-slate-800 font-mono text-[10px] uppercase">GIS Legend:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span>Verified Parcel</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
              <span>High Risk Parcel</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span>
              <span>Disputed Parcel</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
              <span>Forest Reserve</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
              <span>Water Body</span>
            </span>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <div className="h-[480px] w-full relative z-0">
          {/* Floating Candidate Alignments Card on Top-Right of Map (Matches Screenshot 3) */}
          <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-3 shadow-xl space-y-2 min-w-[200px]">
            <div className="font-mono font-bold text-[10px] text-slate-500 uppercase tracking-wider">
              CANDIDATE ALIGNMENTS:
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {/* Route A */}
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                  <span className="font-bold text-slate-800">Route A</span>
                </div>
                <span className="font-bold text-slate-600">82/100</span>
              </div>

              {/* Route B */}
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
                  <span className="font-bold text-slate-800">Route B</span>
                </div>
                <span className="font-bold text-slate-600">61/100</span>
              </div>

              {/* Route C (Highlighted in Dark Box with Gold Trophy) */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#032e26] text-white border border-emerald-500/50 shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                  <span className="font-black text-white">Route C 🏆</span>
                </div>
                <span className="font-black text-emerald-400">39/100</span>
              </div>
            </div>
          </div>

          <MapContainer
            center={[28.1487, 76.9312]} // Nuh / Sohna / Haryana
            zoom={11}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapBoundsController bounds={allRouteCoords} center={[28.1487, 76.9312]} zoom={11} />
            <TileLayer attribution={tileAttr} url={tileUrl} />

            {/* Environmental Overlays (Simulated Polygons) */}
            {envLayers.forest && (
              <Polygon
                positions={[
                  [28.1800, 76.9800],
                  [28.2100, 77.0100],
                  [28.1700, 77.0300],
                  [28.1500, 76.9900]
                ]}
                pathOptions={{
                  color: '#047857',
                  fillColor: '#059669',
                  fillOpacity: 0.35,
                  weight: 1
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <strong>Aravalli Eco-Sensitive Forest Buffer</strong>
                    <div className="text-slate-500">2.1 km Reserve Forest Section</div>
                  </div>
                </Popup>
              </Polygon>
            )}

            {envLayers.water && (
              <Polygon
                positions={[
                  [28.1200, 76.9100],
                  [28.1400, 76.9300],
                  [28.1100, 76.9400]
                ]}
                pathOptions={{
                  color: '#0284c7',
                  fillColor: '#38bdf8',
                  fillOpacity: 0.40,
                  weight: 1
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <strong>Nuh Canal &amp; Wetland System</strong>
                    <div className="text-slate-500">Water Resource Protection Zone</div>
                  </div>
                </Popup>
              </Polygon>
            )}

            {/* Candidate Route Alignments & Buffers */}
            {candidateRoutes.map((route) => {
              const isVisible = visibleRoutes[route.id];
              if (!isVisible) return null;

              const isRecommended = route.id === 'ROUTE_C';
              const bufferWeight = activeBuffer === '200m' ? 32 : (activeBuffer === '100m' ? 18 : 10);

              return (
                <React.Fragment key={route.id}>
                  {/* Buffer Polyline */}
                  <Polyline
                    positions={route.coordinates}
                    pathOptions={{
                      color: route.color,
                      weight: bufferWeight,
                      opacity: isRecommended ? 0.25 : 0.12,
                      lineCap: 'round',
                      lineJoin: 'round'
                    }}
                  />

                  {/* Core Centerline */}
                  <Polyline
                    positions={route.coordinates}
                    pathOptions={{
                      color: route.color,
                      weight: isRecommended ? 5 : 3,
                      opacity: isRecommended ? 1.0 : 0.70,
                      dashArray: route.id === 'ROUTE_A' ? '8, 6' : null
                    }}
                  >
                    <Popup>
                      <div className="p-1 font-sans text-xs space-y-1">
                        <strong className="block text-slate-900">{route.name}</strong>
                        <div className="text-slate-600">MCDA Impact Score: <strong className="font-mono">{route.score}/100</strong></div>
                        <div className="text-slate-600">Affected Families: <strong className="font-mono">{route.affectedFamilies}</strong></div>
                        <div className="text-slate-600">Disputed Parcels: <strong className="font-mono">{route.disputedParcels}</strong></div>
                        <div className="text-emerald-700 font-bold">Estimated Cost: ₹{route.estimatedCompensationCr} Cr</div>
                      </div>
                    </Popup>
                  </Polyline>
                </React.Fragment>
              );
            })}

            {/* Start and End Terminus Pins */}
            <Marker position={[28.2520, 77.0650]} icon={startPinIcon}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong>Corridor Origin Node</strong>
                  <div className="text-slate-500">Sohna Interchange, Gurugram</div>
                </div>
              </Popup>
            </Marker>

            <Marker position={[27.8920, 76.7820]} icon={endPinIcon}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong>Corridor Terminus Node</strong>
                  <div className="text-slate-500">Ferozepur Jhirka / Alwar Border</div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DECISION SUPPORT RECOMMENDATION CARD (Matches Screenshot 2 Exactly)    */}
      {/* ========================================================================= */}
      <div className="bg-[#032e26] text-white border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Top Header Row with Icon, Title, and Adopt Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-emerald-700/40 pb-3.5">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
              <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-300 tracking-wider">
                  DECISION SUPPORT RECOMMENDATION
                </span>
                <span className="text-[10px] font-mono font-black text-emerald-300">
                  Impact Score: 39/100 – Lowest Estimated Impact
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                Recommended Route: Route C
              </h3>
            </div>
          </div>

          <button
            onClick={handleAdoptRouteC}
            className="bg-[#10b981] hover:bg-[#059669] text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Adopt Route C for Section 3A / 4(1)</span>
          </button>
        </div>

        {adoptedRoute && (
          <div className="bg-emerald-900/80 border border-emerald-400 p-2.5 rounded-xl text-xs text-emerald-100 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Route C alignment coordinates adopted for preliminary statutory e-Gazette draft!</span>
          </div>
        )}

        {/* Subtitle */}
        <div className="text-xs text-emerald-200 font-semibold flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Compared with Route A, Route C has approximately:</span>
        </div>

        {/* 4 Quantified Cards Grid (Matches Screenshot 2 Exactly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: FAMILIES */}
          <div className="bg-[#02241e] border border-emerald-700/40 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300 uppercase">
              <span>FAMILIES</span>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-black text-emerald-300 font-sans mt-1">
              60% fewer affected families
            </div>
            <p className="text-[11px] text-emerald-100/70 font-medium">
              250 affected families vs 620 along Route A
            </p>
          </div>

          {/* Card 2: DISPUTES */}
          <div className="bg-[#02241e] border border-emerald-700/40 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300 uppercase">
              <span>DISPUTES</span>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-black text-emerald-300 font-sans mt-1">
              75% fewer disputed parcels
            </div>
            <p className="text-[11px] text-emerald-100/70 font-medium">
              12 disputed parcels vs 48 along Route A
            </p>
          </div>

          {/* Card 3: COMPENSATION */}
          <div className="bg-[#02241e] border border-emerald-700/40 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300 uppercase">
              <span>COMPENSATION</span>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-black text-emerald-300 font-sans mt-1">
              ₹350 Cr lower estimated compensation
            </div>
            <p className="text-[11px] text-emerald-100/70 font-medium">
              Estimated compensation difference based on synthetic/demo data: ₹1850 Cr vs ₹2200 Cr
            </p>
          </div>

          {/* Card 4: DURATION */}
          <div className="bg-[#02241e] border border-emerald-700/40 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300 uppercase">
              <span>DURATION</span>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-black text-emerald-300 font-sans mt-1">
              6 months shorter estimated duration
            </div>
            <p className="text-[11px] text-emerald-100/70 font-medium">
              Estimated duration of 8 months vs 14 months for Route A
            </p>
          </div>
        </div>

        {/* Bottom Rationale Box */}
        <div className="pt-2 text-[11px] text-emerald-100/80 leading-relaxed border-t border-emerald-800/40">
          <strong className="text-white font-bold">Rationale:</strong> Route C has the lowest estimated overall impact because it affects the fewest families, has the lowest dispute and high-risk parcel counts, requires the shortest estimated acquisition duration, and has the lowest estimated compensation in this synthetic dataset.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. WHAT-IF SCENARIO WEIGHTS & COMPARISON TABLE (If Subtab Active)          */}
      {/* ========================================================================= */}
      {activeSimulatorTab === 'whatIf' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 font-mono">
                Multi-Criteria Decision Analysis (MCDA) What-If Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Adjust statutory and social weighting factors to observe dynamic real-time score shifts across all candidate routes.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded border border-purple-200">
              Total Weight: {weights.land + weights.social + weights.legal + weights.compensation + weights.delay}%
            </span>
          </div>

          {/* Weight Sliders Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Land Impact</span>
              <strong className="text-slate-900 font-mono">{weights.land}%</strong>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={weights.land}
                onChange={(e) => setWeights({ ...weights, land: parseInt(e.target.value) })}
                className="w-full accent-amber-500 mt-2" 
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Social Impact</span>
              <strong className="text-slate-900 font-mono">{weights.social}%</strong>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={weights.social}
                onChange={(e) => setWeights({ ...weights, social: parseInt(e.target.value) })}
                className="w-full accent-amber-500 mt-2" 
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Legal / Disputes</span>
              <strong className="text-slate-900 font-mono">{weights.legal}%</strong>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={weights.legal}
                onChange={(e) => setWeights({ ...weights, legal: parseInt(e.target.value) })}
                className="w-full accent-amber-500 mt-2" 
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Compensation Cost</span>
              <strong className="text-slate-900 font-mono">{weights.compensation}%</strong>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={weights.compensation}
                onChange={(e) => setWeights({ ...weights, compensation: parseInt(e.target.value) })}
                className="w-full accent-amber-500 mt-2" 
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Time / Delay</span>
              <strong className="text-slate-900 font-mono">{weights.delay}%</strong>
              <input 
                type="range" 
                min="5" 
                max="30" 
                value={weights.delay}
                onChange={(e) => setWeights({ ...weights, delay: parseInt(e.target.value) })}
                className="w-full accent-amber-500 mt-2" 
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. DETAILED ROUTE COMPARISON MATRIX TABLE                                */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-mono font-bold text-xs uppercase text-slate-800 tracking-wider flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Side-by-Side Candidate Alignment Matrix</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            MCDA Engine 0–100 Scale (Lower Score = Better Alignment)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-mono font-bold text-[10px] uppercase border-b border-slate-200">
                <th className="p-2.5">Alignment</th>
                <th className="p-2.5">Land Required</th>
                <th className="p-2.5">Affected Families</th>
                <th className="p-2.5">Disputed Parcels</th>
                <th className="p-2.5">High-Risk Parcels</th>
                <th className="p-2.5">Est. Compensation</th>
                <th className="p-2.5">Est. Duration</th>
                <th className="p-2.5">MCDA Score</th>
                <th className="p-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {scoredRoutes.map(r => (
                <tr key={r.id} className={r.id === recommendedRoute.id ? "bg-emerald-50/60 font-semibold" : "hover:bg-slate-50"}>
                  <td className="p-2.5 flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }}></span>
                    <strong className="text-slate-900">{r.name}</strong>
                  </td>
                  <td className="p-2.5 font-mono">{r.landRequiredAcres} Acres</td>
                  <td className="p-2.5 font-mono">{r.affectedFamilies} Families</td>
                  <td className="p-2.5 font-mono text-rose-600">{r.disputedParcels}</td>
                  <td className="p-2.5 font-mono text-amber-600">{r.highRiskParcels}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-900">₹{r.estimatedCompensationCr} Cr</td>
                  <td className="p-2.5 font-mono">{r.estimatedDurationMonths} Months</td>
                  <td className="p-2.5 font-mono font-black text-sm" style={{ color: r.color }}>
                    {r.score}/100
                  </td>
                  <td className="p-2.5 text-right">
                    {r.id === recommendedRoute.id ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                        RECOMMENDED 🏆
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Candidate</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. STATUTORY DISCLAIMER FOOTER NOTE                                       */}
      {/* ========================================================================= */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 leading-relaxed">
        <strong className="text-slate-700">Statutory Notice:</strong> This pre-acquisition decision-support tool calculates analytical comparisons based on synthetic demonstration data. Final route selection and acquisition remain subject to competent authority approvals under RFCTLARR 2013 / Section 3A of NH Act.
      </div>
    </div>
  );
}
