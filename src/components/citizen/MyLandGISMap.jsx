import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { 
  MapPin, 
  Layers, 
  Video, 
  ExternalLink, 
  Compass, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Scale, 
  IndianRupee,
  Maximize2,
  Eye
} from 'lucide-react';
import { formatINR } from '../../utils/compensationEngine';

// Centering Controller for Leaflet
function MapRecenter({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

export default function MyLandGISMap({ parcel, lang = 'en', onNavigateTab }) {
  const [mapType, setMapType] = useState('OSM'); // 'OSM' | 'SATELLITE'
  const [showDroneModal, setShowDroneModal] = useState(false);
  const isHi = lang === 'hi';

  const center = parcel.center || [28.1515, 76.9277];
  const coordinates = parcel.coordinates || [
    [center[0] - 0.002, center[1] - 0.002],
    [center[0] + 0.002, center[1] - 0.002],
    [center[0] + 0.002, center[1] + 0.002],
    [center[0] - 0.002, center[1] + 0.002]
  ];

  const areaAcres = (parcel.areaHectares * 2.47105).toFixed(2);

  // Status color badge
  const getStatusColor = (status) => {
    switch (status) {
      case 'PROJECT_UTILIZATION':
      case 'LAND_HANDOVER':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', fill: '#059669' };
      case 'COMPENSATION_PROCESS':
      case 'APPROVAL_ACQUISITION':
        return { bg: 'bg-blue-50 text-blue-800 border-blue-300', fill: '#2563eb' };
      case 'LEGAL_OBJECTIONS':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-300', fill: '#e11d48' };
      default:
        return { bg: 'bg-amber-50 text-amber-800 border-amber-300', fill: '#d97706' };
    }
  };

  const statusStyle = getStatusColor(parcel.status);

  const tileLayer = mapType === 'SATELLITE' ? {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "&copy; Esri World Imagery"
  } : {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr: "&copy; OpenStreetMap contributors"
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "मेरी भूमि — भू-आधार (GIS) दृश्य" : "MY LAND — INTERACTIVE GIS PARCEL MAP"}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {isHi ? "सत्यापित भू-अभिलेख" : "SURVEY CERTIFIED"}
              </span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "सर्वे ऑफ इंडिया के ऑर्थोमोसेक ड्रोन डेटा द्वारा सत्यापित भू-खंड की भू-संदर्भित सीमा रेखा।"
                : "Geo-referenced boundary map of your acquired parcel with GIS survey layer and coordinates."}
            </p>
          </div>
        </div>

        {/* Map View Toggle */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setMapType('OSM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapType === 'OSM' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? "मानचित्र दृश्य" : "Street Map"}
          </button>
          <button
            onClick={() => setMapType('SATELLITE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapType === 'SATELLITE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? "उपग्रह (सैटेलाइट)" : "Satellite View"}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Map (8 cols), Right Details (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Leaflet Map */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ULPIN: <strong className="text-amber-400">{parcel.ulpin}</strong></span>
            </div>
            <span className="text-slate-400">
              Center: {center[0].toFixed(4)}° N, {center[1].toFixed(4)}° E
            </span>
          </div>

          <div className="relative h-[480px] w-full bg-slate-100">
            <MapContainer
              center={center}
              zoom={15}
              scrollWheelZoom={true}
              className="h-full w-full z-10"
            >
              <MapRecenter center={center} />
              <TileLayer
                url={tileLayer.url}
                attribution={tileLayer.attr}
              />
              <Polygon
                positions={coordinates}
                pathOptions={{
                  color: statusStyle.fill,
                  fillColor: statusStyle.fill,
                  fillOpacity: 0.45,
                  weight: 3,
                  dashArray: '4, 4'
                }}
              >
                <Popup>
                  <div className="text-xs p-1 space-y-1 font-sans text-slate-900">
                    <p className="font-mono font-black text-amber-900">ULPIN: {parcel.ulpin}</p>
                    <p className="font-bold">Landowner: {parcel.ownerName}</p>
                    <p>Survey Plot: {parcel.surveyNo} ({parcel.khataNo})</p>
                    <p>Area: {parcel.areaHectares} Ha ({areaAcres} Acres)</p>
                    <p className="font-semibold text-emerald-800">Status: {parcel.status.replace(/_/g, ' ')}</p>
                  </div>
                </Popup>
              </Polygon>
            </MapContainer>

            {/* Drone Inspection Button Overlay */}
            {parcel.droneSurveyUrl && (
              <div className="absolute bottom-4 right-4 z-[500]">
                <button
                  onClick={() => setShowDroneModal(true)}
                  className="bg-slate-950/90 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 backdrop-blur-md cursor-pointer transition-all hover:scale-105"
                >
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>{isHi ? "ड्रोन सर्वे वीडियो देखें" : "View Drone Survey"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Map Footer Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/50 border border-emerald-600" />
                <span>{isHi ? "स्वामित्व भू-सीमा" : "Acquired Boundary"}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isHi ? "सत्यापित राजस्व नक्शा" : "Cadastral Geo-Referenced"}</span>
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              Survey Date: {parcel.droneSurveyDate || "2026-08-28"}
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Parcel Inspector Card */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                  {isHi ? "भू-अभिलेख विवरण" : "PARCEL SUMMARY CARD"}
                </span>
                <h3 className="text-xl font-black font-mono text-slate-900 mt-0.5">Plot {parcel.surveyNo}</h3>
                <p className="text-xs text-slate-600 font-medium">Khata No: {parcel.khataNo}</p>
              </div>

              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${statusStyle.bg}`}>
                {parcel.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-slate-500 text-[10px] font-bold uppercase">{isHi ? "क्षेत्रफल (हेक्टेयर)" : "Area (Hectares)"}</span>
                <p className="font-mono font-black text-slate-900 text-sm">{parcel.areaHectares} Ha</p>
                <span className="text-[10px] text-slate-500">({areaAcres} Acres)</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-slate-500 text-[10px] font-bold uppercase">{isHi ? "भूमि का प्रकार" : "Land Type"}</span>
                <p className="font-bold text-slate-900 text-xs truncate">{parcel.landType.replace(/_/g, ' ')}</p>
                <span className="text-[10px] text-emerald-700 font-bold">Encumbrance: Low</span>
              </div>
            </div>

            {/* Location & Project details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{isHi ? "ग्राम / तहसील" : "Village / Tehsil"}</span>
                <span className="font-bold text-slate-900">{parcel.village}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{isHi ? "जिला एवं राज्य" : "District & State"}</span>
                <span className="font-bold text-slate-900">{parcel.district}, {parcel.state}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{isHi ? "संबद्ध राष्ट्रीय परियोजना" : "Associated Project"}</span>
                <span className="font-mono font-bold text-amber-800 truncate max-w-[170px]">{parcel.projectId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{isHi ? "मुआवजा राशि" : "Total Award"}</span>
                <span className="font-mono font-black text-emerald-700">{formatINR(parcel.totalAwardAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">{isHi ? "डीबीटी स्थिति" : "DBT Payout"}</span>
                <span className="font-bold text-emerald-800 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{parcel.dbtStatus === 'DISBURSED_100' ? (isHi ? 'खाते में जमा' : '100% Disbursed') : 'In Bank Queue'}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Navigation Links */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => onNavigateTab('timeline')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center space-x-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isHi ? "अधिग्रहण यात्रा टाइमलाइन देखें" : "View Acquisition Timeline"}</span>
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => onNavigateTab('compensation')}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer border border-emerald-200"
              >
                <span className="flex items-center space-x-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isHi ? "मुआवजा गणना विवरण देखें" : "View Compensation Breakdown"}</span>
                </span>
                <span>→</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Drone Modal */}
      {showDroneModal && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-sm">
                  {isHi ? "ड्रोन ऑर्थोमोसेक सर्वेक्षण सत्यापन" : "Drone Orthomosaic Survey Inspection"} - Plot {parcel.surveyNo}
                </h4>
              </div>
              <button
                onClick={() => setShowDroneModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4">
              <video
                src={parcel.droneSurveyUrl}
                controls
                autoPlay
                className="w-full h-72 rounded-xl bg-black object-cover"
              />
              <p className="text-xs text-slate-400 mt-2 font-mono">
                ULPIN: {parcel.ulpin} | Survey Date: {parcel.droneSurveyDate} | Camera: High-res RGB Lidar Payload
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
