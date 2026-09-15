import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  Filter, 
  ShieldCheck, 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  Eye,
  Building,
  Compass,
  X,
  Layers
} from 'lucide-react';
import { formatINR } from '../utils/compensationEngine';

// Custom Map Centering Controller
function MapController({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function GISMapView({ projects, parcels, selectedParcel, setSelectedParcel }) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mapStyle, setMapStyle] = useState('OSM'); // OSM, SATELLITE, DARK
  const [showDroneModal, setShowDroneModal] = useState(false);
  const [droneVideoUrl, setDroneVideoUrl] = useState(null);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Tile sources that DO NOT require API keys
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

  // Filter parcels belonging to active project and search query
  const filteredParcels = parcels.filter(parcel => {
    const matchesProject = parcel.projectId === selectedProjectId;
    const matchesQuery = 
      parcel.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.surveyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || parcel.status === statusFilter;
    return matchesProject && matchesQuery && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACQUIRED': return { stroke: '#059669', fill: '#10b981', label: 'Acquired (Possession Taken)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'COMPENSATION_PROCESS': 
      case 'SEC_3G_VALUATION': return { stroke: '#d97706', fill: '#f59e0b', label: 'Sec 3G Award / Valuation', bg: 'bg-amber-50 text-amber-900 border-amber-300' };
      case 'NOTIFICATIONS_NOTICE':
      case 'SEC_3D_DECLARATION': return { stroke: '#2563eb', fill: '#3b82f6', label: 'Sec 3D Gazette Notice', bg: 'bg-blue-50 text-blue-900 border-blue-300' };
      case 'LAND_IDENTIFICATION':
      case 'SEC_3A_NOTICE': return { stroke: '#7c3aed', fill: '#8b5cf6', label: 'Land ID & Sec 3A Notice', bg: 'bg-purple-50 text-purple-900 border-purple-300' };
      case 'LEGAL_OBJECTIONS':
      case 'LEGAL_DISPUTE': return { stroke: '#dc2626', fill: '#ef4444', label: 'Court Dispute / Objections', bg: 'bg-rose-50 text-rose-900 border-rose-300' };
      default: return { stroke: '#059669', fill: '#10b981', label: 'Acquired', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    }
  };

  const openDroneInspector = (url) => {
    setDroneVideoUrl(url);
    setShowDroneModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Project Selector */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Building className="w-5 h-5 text-amber-600" />
          <div className="w-full">
            <label className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Infrastructure Project Corridor</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedParcel(null);
              }}
              className="bg-slate-50 text-slate-900 border border-slate-300 text-xs font-bold rounded-lg px-3 py-1.5 focus:border-amber-500 w-full md:w-80"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.state})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ULPIN / Survey No / Owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex space-x-1">
            {['ALL', 'ACQUIRED', 'COMPENSATION_PROCESS', 'LEGAL_OBJECTIONS'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-[11px] font-extrabold whitespace-nowrap transition-colors ${
                  statusFilter === st 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map + Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[620px]">
        {/* Left Map View (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden relative shadow-md">
          {/* Map Layer Controls (Top Right) */}
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur border border-slate-200 rounded-lg p-2 text-xs space-y-2 shadow-lg">
            <div>
              <div className="font-extrabold text-[10px] uppercase text-slate-600 tracking-wider flex items-center space-x-1">
                <Layers className="w-3 h-3 text-amber-600" />
                <span>Base Map Style</span>
              </div>
              <div className="flex space-x-1 mt-1">
                {[
                  { id: 'OSM', label: 'OSM Standard' },
                  { id: 'SATELLITE', label: 'Satellite' },
                  { id: 'DARK', label: 'Dark Canvas' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMapStyle(m.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      mapStyle === m.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1.5 space-y-1">
              <div className="font-extrabold text-[10px] uppercase text-slate-600 tracking-wider">ULPIN Geo Legend</div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Acquired Land</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Sec 3G Award</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Sec 3D Declaration</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <span>Dispute / Court Stay</span>
              </div>
            </div>
          </div>

          <MapContainer 
            center={[activeProject.centerLat, activeProject.centerLng]} 
            zoom={activeProject.zoom} 
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapController center={[activeProject.centerLat, activeProject.centerLng]} zoom={activeProject.zoom} />
            
            <TileLayer
              key={mapStyle}
              attribution={tileData.attr}
              url={tileData.url}
            />

            {/* Render Land Parcel Polygons */}
            {filteredParcels.map((parcel) => {
              const statusStyle = getStatusColor(parcel.status);
              const isSelected = selectedParcel?.id === parcel.id;

              return (
                <Polygon
                  key={parcel.id}
                  positions={parcel.coordinates}
                  pathOptions={{
                    color: isSelected ? '#000000' : statusStyle.stroke,
                    fillColor: statusStyle.fill,
                    fillOpacity: isSelected ? 0.85 : 0.55,
                    weight: isSelected ? 3 : 2,
                    dashArray: (parcel.status === 'LEGAL_DISPUTE' || parcel.status === 'LEGAL_OBJECTIONS') ? '6, 6' : null
                  }}
                  eventHandlers={{
                    click: () => setSelectedParcel(parcel)
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900">
                      <div className="font-mono text-xs font-extrabold text-amber-800 flex items-center justify-between">
                        <span>ULPIN: {parcel.ulpin}</span>
                      </div>
                      <div className="text-xs font-bold">Owner: {parcel.ownerName}</div>
                      <div className="text-[11px] text-slate-600">Survey No: {parcel.surveyNo} | Area: {parcel.areaHectares} Ha</div>
                      <div className="text-[11px] font-extrabold text-emerald-700">Award: {formatINR(parcel.totalAwardAmount)}</div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>
        </div>

        {/* Right Details Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 overflow-y-auto flex flex-col justify-between shadow-md">
          {selectedParcel ? (
            <div className="space-y-4">
              {/* Parcel Header */}
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
                    Bhu-Aadhaar Record
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${getStatusColor(selectedParcel.status).bg}`}>
                    {getStatusColor(selectedParcel.status).label}
                  </span>
                </div>
                <h3 className="text-lg font-black font-mono text-slate-900 mt-1">{selectedParcel.ulpin}</h3>
                <p className="text-xs text-slate-600 flex items-center space-x-1 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Survey No. {selectedParcel.surveyNo} • Khata {selectedParcel.khataNo} • {selectedParcel.village}</span>
                </p>
              </div>

              {/* Owner & Identity */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
                  <span>Landowner Name:</span>
                  <span className="text-slate-900 font-extrabold">{selectedParcel.ownerName}</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>Aadhaar Status:</span>
                  <span className="text-emerald-700 font-mono font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedParcel.aadhaarMasked}</span>
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>Bank Payout Status:</span>
                  <span className={selectedParcel.bankAccountVerified ? "text-emerald-700 font-bold flex items-center space-x-1" : "text-amber-700 font-bold"}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedParcel.bankAccountVerified ? "PFMS Bank Verified" : "Pending Verification"}</span>
                  </span>
                </div>
              </div>

              {/* Solatium & Award Package */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
                <div className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span>LARR 2013 Statutory Award</span>
                  <span className="text-[10px] text-slate-500 font-mono">Sec 3G Valuation</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Acquisition Area:</span>
                    <span className="text-slate-900 font-mono font-bold">{selectedParcel.areaHectares} Hectares</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Base Market Value:</span>
                    <span className="text-slate-900 font-mono">{formatINR(selectedParcel.marketRatePerHa * selectedParcel.areaHectares)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Rural Multiplier Factor:</span>
                    <span className="text-amber-800 font-mono font-bold">{selectedParcel.multiplier}x</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Compulsory Solatium (100%):</span>
                    <span className="text-emerald-700 font-mono font-bold">{formatINR(selectedParcel.solatiumAmount)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm">
                    <span className="text-slate-900">Total Compensation:</span>
                    <span className="text-emerald-700 font-mono">{formatINR(selectedParcel.totalAwardAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Drone Video Inspector */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-bold flex items-center space-x-1">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Drone Survey Footage</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{selectedParcel.droneSurveyDate}</span>
                </div>
                <button
                  onClick={() => openDroneInspector(selectedParcel.droneSurveyUrl)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect Orthomosaic Drone Video</span>
                </button>
              </div>

              {/* Dispute Warning */}
              {(selectedParcel.status === 'LEGAL_DISPUTE' || selectedParcel.status === 'LEGAL_OBJECTIONS') && (
                <div className="bg-rose-50 border border-rose-300 rounded-lg p-3 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-rose-800 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Active Court Dispute / Title Objection</span>
                  </div>
                  <p className="text-rose-900 text-[11px] leading-relaxed font-medium">
                    {selectedParcel.disputeReason || "High Court stay order pending. Funds moved to Escrow account under RFCTLARR Section 77."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-amber-600">
                <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Parcel Selected</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Click on any land parcel polygon on the GIS map to inspect ULPIN records, LARR 2013 solatium breakdown, and drone imagery.
              </p>
            </div>
          )}

          <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 flex justify-between items-center font-medium">
            <span>DILRMP 3.0 Land Stack API</span>
            <span className="font-mono text-emerald-700 font-bold">SYNCED</span>
          </div>
        </div>
      </div>

      {/* Drone Inspector Video Modal */}
      {showDroneModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-3xl w-full p-4 space-y-3 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Drone Boundary & Encroachment Inspection Viewer</h3>
              </div>
              <button 
                onClick={() => setShowDroneModal(false)}
                className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
              <video 
                src={droneVideoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 px-3 py-1 rounded text-[11px] font-mono text-amber-400 border border-amber-500/20">
                ULPIN: {selectedParcel?.ulpin} | Geo Coordinates Verified
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 pt-1 font-medium">
              <span>Drone Provider: Survey of India (SVAMITVA Fleet)</span>
              <button 
                onClick={() => setShowDroneModal(false)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
