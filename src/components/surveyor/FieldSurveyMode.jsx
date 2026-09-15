import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  ArrowLeft, 
  MapPin, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Camera, 
  Mic, 
  MicOff, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Download, 
  Layers, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Signature, 
  Send, 
  Clock, 
  Split, 
  Merge, 
  Ruler, 
  Edit3, 
  Undo, 
  Redo, 
  Trash2, 
  Eye, 
  X, 
  Plus, 
  Sliders, 
  Compass, 
  Check, 
  Play, 
  Square,
  HelpCircle
} from 'lucide-react';
import SurveyReportModal from './SurveyReportModal';
import { NEARBY_GIS_FEATURES } from '../../data/surveyorData';

// Custom Leaflet Markers
const createSurveyPointIcon = (label, color = '#d97706') => {
  return L.divIcon({
    className: 'custom-survey-marker',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #ffffff; font-family: monospace; font-weight: 900; font-size: 10px;">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const surveyorLocationIcon = L.divIcon({
  className: 'custom-surveyor-beacon',
  html: `
    <div style="position: relative; width: 20px; height: 20px;">
      <div style="position: absolute; inset: 0; border-radius: 50%; background-color: #3b82f6; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: absolute; inset: 3px; border-radius: 50%; background-color: #1d4ed8; border: 2px solid #ffffff; box-shadow: 0 0 10px #3b82f6;"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 17);
    }
  }, [center, zoom, map]);
  return null;
}

export default function FieldSurveyMode({ parcel, onBack, onUpdateParcel }) {
  const [currentParcel, setCurrentParcel] = useState(parcel);

  // Active Map State
  const [mapStyle, setMapStyle] = useState('OSM'); // 'OSM', 'SATELLITE'
  const [mapCenter, setMapCenter] = useState(parcel.mapCenter || [28.2480, 77.0660]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Layer Toggles
  const [layers, setLayers] = useState({
    cadastralBoundary: true,
    currentSurvey: true,
    surveyPoints: true,
    surveyorLocation: true,
    nearbyParcels: true,
    roads: true,
    waterBodies: true,
    infrastructure: true,
    villageBoundary: true,
    disputedParcels: true
  });
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Live GNSS Panel State
  const [gnssConnected, setGnssConnected] = useState(true);
  const [isWalking, setIsWalking] = useState(false);
  const [capturedPoints, setCapturedPoints] = useState(parcel.capturedPoints || []);

  // Measured Polygon & Area state
  const [surveyPolygon, setSurveyPolygon] = useState(parcel.surveyPolygon || parcel.cadastralPolygon);
  const [measuredAreaHa, setMeasuredAreaHa] = useState(parcel.surveyedAreaHa || parcel.recordedAreaHa);
  const [measuredPerimeterM, setMeasuredPerimeterM] = useState(842);
  const [activeTool, setActiveTool] = useState(null); // 'POINT', 'DRAW', 'MOVE', 'MEASURE_DIST', 'MEASURE_AREA'

  // Map Comparison State
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareOpacity, setCompareOpacity] = useState(50); // 0 (Cadastral) to 100 (Survey)

  // Owner Verification State
  const [ownerVerification, setOwnerVerification] = useState(parcel.ownerVerification || {
    ownerPresent: true,
    identityVerified: true,
    agreesWithBoundary: true,
    hasSignature: false,
    signatureDate: '',
    objectionNotes: ''
  });
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // Evidence Photos State
  const [evidencePhotos, setEvidencePhotos] = useState(parcel.evidencePhotos || []);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [photoCategory, setPhotoCategory] = useState('Boundary Marker');

  // Voice Notes State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState(parcel.voiceNotes || []);
  const [voiceRecordingSeconds, setVoiceRecordingSeconds] = useState(0);

  // Offline Mode State
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [offlinePackageDownloaded, setOfflinePackageDownloaded] = useState(true);

  // Modals & Report
  const [showReportModal, setShowReportModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('survey'); // 'survey', 'owner', 'evidence', 'documents', 'timeline'

  // Dynamic difference & deviation calculation
  const recordedArea = currentParcel.recordedAreaHa || 4.50;
  const areaDifference = parseFloat((measuredAreaHa - recordedArea).toFixed(3));
  const deviationPercent = parseFloat(((areaDifference / recordedArea) * 100).toFixed(2));
  const isSignificantMismatch = Math.abs(deviationPercent) > 5.0;
  const isReviewRequired = Math.abs(deviationPercent) > 1.5 && !isSignificantMismatch;

  // Voice recording timer effect
  useEffect(() => {
    let interval = null;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setVoiceRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Handle Capture GNSS Point
  const handleCapturePoint = () => {
    const nextNum = capturedPoints.length + 1;
    const newPt = {
      id: `P${nextNum}`,
      name: `P${nextNum} - GNSS Boundary Coordinate`,
      lat: (currentParcel.currentLatitude || 28.2478) + (Math.random() - 0.5) * 0.001,
      lng: (currentParcel.currentLongitude || 77.0654) + (Math.random() - 0.5) * 0.001,
      elevation: parseFloat((215.0 + Math.random() * 2).toFixed(1)),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      accuracy: '±1.8m',
      type: 'GNSS_POINT'
    };
    const updated = [...capturedPoints, newPt];
    setCapturedPoints(updated);

    // If more than 3 points, recalculate simulated polygon area
    if (updated.length >= 3) {
      const calculatedArea = parseFloat((recordedArea + (Math.random() - 0.5) * 0.08).toFixed(2));
      setMeasuredAreaHa(calculatedArea);
    }
  };

  // Handle Boundary Walk Toggle
  const handleToggleBoundaryWalk = () => {
    if (!isWalking) {
      setIsWalking(true);
      alert("GNSS Boundary Walk Mode Activated: Move along the parcel ridge to continuously sample RTK coordinates.");
    } else {
      setIsWalking(false);
      handleCapturePoint();
      alert("Boundary Walk Completed. Polygon closed and measured area verified.");
    }
  };

  // Nudge vertex tool (simulates vertex move)
  const handleNudgeVertex = (delta = 0.02) => {
    const newArea = parseFloat((measuredAreaHa + delta).toFixed(2));
    setMeasuredAreaHa(newArea);
    alert(`Survey vertex shifted. Measured area updated: ${newArea} Ha (Deviation: ${(((newArea - recordedArea) / recordedArea) * 100).toFixed(2)}%)`);
  };

  // Save voice note simulation
  const handleStopVoiceNote = () => {
    setIsRecordingVoice(false);
    const mockTranscripts = [
      "North boundary is approximately 45 metres and an existing irrigation channel is present along the east ridge.",
      "Inspected eastern boundary stone. Fully intact with zero encroachment observed.",
      "Owner pointed out an electric transmission pole inside the boundary that requires clearance documentation."
    ];
    const transcript = mockTranscripts[voiceNotes.length % mockTranscripts.length];
    const newNote = {
      id: `VN-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      duration: `0:${voiceRecordingSeconds < 10 ? '0' : ''}${voiceRecordingSeconds || 28}`,
      transcript,
      surveyor: 'Anish Kumar'
    };
    setVoiceNotes([newNote, ...voiceNotes]);
  };

  // Offline Sync Simulation
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncProgress(15);
    const step1 = setTimeout(() => setSyncProgress(45), 600);
    const step2 = setTimeout(() => setSyncProgress(85), 1200);
    const step3 = setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1800);
  };

  // Smart Validation Checklist
  const handleRunValidation = () => {
    const checks = [
      { id: 'gnss', label: 'GPS / RTK Coordinates Captured', passed: capturedPoints.length >= 3, detail: `${capturedPoints.length} points logged` },
      { id: 'boundary', label: 'Cadastral Boundary Closed & Verified', passed: surveyPolygon.length >= 3, detail: 'Polygon geometry valid' },
      { id: 'area', label: 'Surveyed Area Computed', passed: measuredAreaHa > 0, detail: `${measuredAreaHa} Ha` },
      { id: 'owner', label: 'Owner Presence & Identity Verified', passed: ownerVerification.ownerPresent && ownerVerification.identityVerified, detail: ownerVerification.identityVerified ? 'Aadhaar Verified' : 'Missing Identity Verification' },
      { id: 'signature', label: 'Digital Owner Signature Captured', passed: ownerVerification.hasSignature, detail: ownerVerification.hasSignature ? 'Signed on-site' : 'Owner Signature Required' },
      { id: 'photos', label: 'Mandatory Field Evidence Photographs', passed: evidencePhotos.length >= 2, detail: `${evidencePhotos.length} photos uploaded (Min: 2)` },
      { id: 'timestamp', label: 'Statutory Date & Time Watermark Stamped', passed: true, detail: '15 Sep 2026 IST' }
    ];

    const hasMissing = checks.some(c => !c.passed);
    setValidationResult({ checks, isValid: !hasMissing });
    setShowValidationModal(true);
  };

  // Handle Workflow Submission
  const handleSubmitSurvey = () => {
    const updated = {
      ...currentParcel,
      surveyStatus: 'COMPLETED',
      workflowStage: 'SUBMITTED',
      surveyedAreaHa: measuredAreaHa,
      capturedPoints,
      evidencePhotos,
      ownerVerification
    };
    setCurrentParcel(updated);
    if (onUpdateParcel) onUpdateParcel(updated);
    setShowValidationModal(false);
    alert(`Survey for Parcel ${currentParcel.id} successfully validated and submitted for Supervisor Review!`);
  };

  // Supervisor Approval simulation
  const handleSupervisorApproval = (status) => {
    const updated = {
      ...currentParcel,
      surveyStatus: status === 'APPROVED' ? 'COMPLETED' : 'RE_SURVEY',
      workflowStage: status === 'APPROVED' ? 'APPROVED' : 'RETURNED'
    };
    setCurrentParcel(updated);
    if (onUpdateParcel) onUpdateParcel(updated);
    alert(status === 'APPROVED' 
      ? `Supervisor Approved: Land Survey Report signed off for ${currentParcel.id}`
      : `Supervisor Returned survey for Parcel ${currentParcel.id} with correction remarks.`
    );
  };

  return (
    <div className={`space-y-4 font-sans ${isFullscreen ? 'fixed inset-0 z-[3500] bg-slate-100 p-4 overflow-y-auto' : ''}`}>
      {/* 1. High-Contrast Field Survey Mode Header */}
      <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Left info */}
          <div className="flex items-start space-x-3">
            <button
              onClick={onBack}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer shrink-0 mt-0.5"
              title="Return to Surveyor Workbench"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  Field Survey Mode
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-mono font-bold text-slate-900">{currentParcel.id}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-mono text-slate-600">ULPIN: {currentParcel.ulpin}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  currentParcel.workflowStage === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  currentParcel.workflowStage === 'SUBMITTED' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  currentParcel.workflowStage === 'RETURNED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {currentParcel.workflowStage || 'FIELD_SURVEY'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-950 font-mono mt-1">
                Survey Number: {currentParcel.surveyNumber} — {currentParcel.village}, {currentParcel.district}
              </h2>

              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Project Alignment: <strong>{currentParcel.project}</strong> • Surveyor: <strong>{currentParcel.surveyorAssigned}</strong>
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Split Screen Map Comparison Button */}
            <button
              onClick={() => setIsCompareOpen(!isCompareOpen)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>{isCompareOpen ? 'Close Comparison' : 'Compare Map'}</span>
            </button>

            {/* Offline Mode Toggle Button */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer border ${
                isOffline ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isOffline ? 'Offline Active' : 'Online Mode'}</span>
            </button>

            {/* Validation & Submit CTA */}
            <button
              onClick={handleRunValidation}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart Validation</span>
            </button>

            {/* Generate Survey Report Button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Boundary Mismatch Alert Banner (Appears if mismatch detected) */}
        {isSignificantMismatch && (
          <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-950">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>⚠ BOUNDARY MISMATCH DETECTED: </strong>
                <span>
                  Recorded: <strong>{recordedArea} Ha</strong> | Surveyed: <strong>{measuredAreaHa} Ha</strong> | 
                  Diff: <strong>{areaDifference > 0 ? `+${areaDifference}` : areaDifference} Ha ({deviationPercent > 0 ? `+${deviationPercent}` : deviationPercent}%)</strong>
                </span>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  Field boundary discrepancy exceeds statutory 5% limit. Collectorate Dispute review required.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button 
                onClick={() => alert("Marked for official re-survey review.")}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Mark For Re-Survey
              </button>
              <button 
                onClick={() => alert("Boundary dispute flagged to Competent Authority (CALA).")}
                className="bg-white border border-rose-300 text-rose-800 font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer hover:bg-rose-50"
              >
                Raise Dispute
              </button>
            </div>
          </div>
        )}

        {/* Offline Sync In-Progress Banner */}
        {isSyncing && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5 text-xs text-amber-950">
            <div className="flex items-center justify-between font-mono font-bold">
              <span>Uploading 5 offline field survey records to State DILRMP server...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {syncSuccess && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>✓ All 5 local field survey records synchronized with Central BHOOMISETU Ledger.</span>
          </div>
        )}
      </div>

      {/* 2. Main Work Area: Interactive Field Map + Floating Toolbars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left GIS Field Map Canvas (8 Columns) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="gov-card rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative h-[560px] flex flex-col">
            
            {/* Floating Live GPS / GNSS Status Panel */}
            <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-lg max-w-[260px] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${gnssConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <strong className="text-slate-900 uppercase font-black text-[11px]">GNSS RTK STATUS</strong>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  {currentParcel.gnssQuality || 'RTK FIX'}
                </span>
              </div>

              <div className="space-y-1 text-[10px] text-slate-600">
                <div className="flex justify-between">
                  <span>GPS Accuracy:</span>
                  <strong className="text-slate-900">{currentParcel.gpsAccuracy || '±1.8 m'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Satellites:</span>
                  <strong className="text-slate-900">{currentParcel.satellitesTracked || 19} (GPS+GLO+NAV)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Latitude:</span>
                  <strong className="text-slate-900">{currentParcel.currentLatitude?.toFixed(6) || '28.247852'}° N</strong>
                </div>
                <div className="flex justify-between">
                  <span>Longitude:</span>
                  <strong className="text-slate-900">{currentParcel.currentLongitude?.toFixed(6) || '77.065418'}° E</strong>
                </div>
                <div className="flex justify-between">
                  <span>Altitude:</span>
                  <strong className="text-slate-900">{currentParcel.altitudeMeters || 215.4} m MSL</strong>
                </div>
                <div className="flex justify-between">
                  <span>CORS Station:</span>
                  <strong className="text-emerald-700 font-bold">CONNECTED</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                <button
                  onClick={handleCapturePoint}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Capture Point</span>
                </button>

                <button
                  onClick={handleToggleBoundaryWalk}
                  className={`font-black text-[10px] py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 cursor-pointer ${
                    isWalking ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isWalking ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isWalking ? 'Stop Walk' : 'Walk Boundary'}</span>
                </button>
              </div>
            </div>

            {/* Floating Boundary Survey Tools Floating Toolbar */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 p-2 rounded-xl shadow-lg flex items-center space-x-1 text-xs">
              <button
                onClick={handleCapturePoint}
                className={`p-2 rounded-lg font-bold text-[10px] flex items-center space-x-1 cursor-pointer transition-colors ${
                  activeTool === 'POINT' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-100 text-slate-700'
                }`}
                title="Capture GPS Point"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Point</span>
              </button>

              <button
                onClick={() => {
                  setActiveTool('MOVE');
                  handleNudgeVertex(0.01);
                }}
                className={`p-2 rounded-lg font-bold text-[10px] flex items-center space-x-1 cursor-pointer transition-colors ${
                  activeTool === 'MOVE' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-100 text-slate-700'
                }`}
                title="Move Boundary Vertex"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Nudge Vertex</span>
              </button>

              <button
                onClick={() => alert("Parcel Split tool active: Select two boundary points to bisect plot.")}
                className="p-2 rounded-lg font-bold text-[10px] flex items-center space-x-1 hover:bg-slate-100 text-slate-700 cursor-pointer"
                title="Split Parcel"
              >
                <Split className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Split</span>
              </button>

              <button
                onClick={() => alert("Parcel Merge tool active: Select adjacent parcel to unite.")}
                className="p-2 rounded-lg font-bold text-[10px] flex items-center space-x-1 hover:bg-slate-100 text-slate-700 cursor-pointer"
                title="Merge Parcel"
              >
                <Merge className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Merge</span>
              </button>

              <button
                onClick={() => {
                  setMeasuredAreaHa(recordedArea);
                  alert("Reset survey boundary to recorded cadastral baseline.");
                }}
                className="p-2 rounded-lg font-bold text-[10px] hover:bg-slate-100 text-slate-700 cursor-pointer"
                title="Reset / Undo Changes"
              >
                <Undo className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* Top Right Map Layer Controls */}
            <div className="absolute top-3 right-3 z-[1000] flex items-center space-x-2">
              <button
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className="bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 font-bold text-xs p-2 rounded-xl shadow-md hover:bg-slate-100 flex items-center space-x-1.5 cursor-pointer"
                title="Toggle GIS Map Layers"
              >
                <Layers className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Layers</span>
              </button>

              <button
                onClick={() => setMapStyle(mapStyle === 'OSM' ? 'SATELLITE' : 'OSM')}
                className="bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 font-bold text-xs p-2 rounded-xl shadow-md hover:bg-slate-100 cursor-pointer"
                title="Switch Map Base Style"
              >
                {mapStyle === 'OSM' ? 'Satellite' : 'OSM Map'}
              </button>

              <button
                onClick={() => setMapCenter([28.2480, 77.0660])}
                className="bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 p-2 rounded-xl shadow-md hover:bg-slate-100 cursor-pointer"
                title="Locate Current Surveyor Position"
              >
                <Crosshair className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            {/* Layer Toggles Menu Dropdown */}
            {showLayerMenu && (
              <div className="absolute top-14 right-3 z-[1001] bg-white border border-slate-200 rounded-xl p-3 shadow-xl w-60 text-xs font-mono space-y-2 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <strong className="text-slate-900 uppercase">10 Statutory Layers</strong>
                  <button onClick={() => setShowLayerMenu(false)} className="text-slate-400 hover:text-slate-800">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.cadastralBoundary} 
                      onChange={(e) => setLayers({ ...layers, cadastralBoundary: e.target.checked })} 
                      className="rounded text-amber-600"
                    />
                    <span>Cadastral Boundary (Record)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.currentSurvey} 
                      onChange={(e) => setLayers({ ...layers, currentSurvey: e.target.checked })} 
                      className="rounded text-emerald-600"
                    />
                    <span>Current DGPS Survey Polygon</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.surveyPoints} 
                      onChange={(e) => setLayers({ ...layers, surveyPoints: e.target.checked })} 
                      className="rounded text-blue-600"
                    />
                    <span>Captured DGPS Points (P1..Pn)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.surveyorLocation} 
                      onChange={(e) => setLayers({ ...layers, surveyorLocation: e.target.checked })} 
                      className="rounded text-blue-600"
                    />
                    <span>Surveyor GNSS Beacon</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.roads} 
                      onChange={(e) => setLayers({ ...layers, roads: e.target.checked })} 
                      className="rounded text-slate-600"
                    />
                    <span>Corridor ROW & Access Roads</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.waterBodies} 
                      onChange={(e) => setLayers({ ...layers, waterBodies: e.target.checked })} 
                      className="rounded text-blue-600"
                    />
                    <span>Canals & Water Bodies</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.infrastructure} 
                      onChange={(e) => setLayers({ ...layers, infrastructure: e.target.checked })} 
                      className="rounded text-amber-600"
                    />
                    <span>Electric & Irrigation Utilities</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={layers.villageBoundary} 
                      onChange={(e) => setLayers({ ...layers, villageBoundary: e.target.checked })} 
                      className="rounded text-slate-600"
                    />
                    <span>Village Settlement Boundary</span>
                  </label>
                </div>
              </div>
            )}

            {/* The Actual Leaflet Map Canvas */}
            <div className="flex-1 w-full h-full relative">
              <MapContainer 
                center={mapCenter} 
                zoom={17} 
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >
                <MapController center={mapCenter} zoom={17} />

                {/* Base Tile Layer */}
                {mapStyle === 'SATELLITE' ? (
                  <TileLayer 
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri World Imagery"
                  />
                ) : (
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="OpenStreetMap"
                  />
                )}

                {/* 1. Cadastral Boundary (Recorded Revenue Baseline - Dashed Orange) */}
                {layers.cadastralBoundary && currentParcel.cadastralPolygon && (
                  <Polygon 
                    positions={currentParcel.cadastralPolygon}
                    pathOptions={{
                      color: '#d97706',
                      fillColor: '#f59e0b',
                      fillOpacity: 0.15,
                      weight: 2.5,
                      dashArray: '6, 6'
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 font-mono">
                        <strong className="text-amber-800 block">Record of Rights (RoR) Boundary</strong>
                        <div>Survey No: {currentParcel.surveyNumber}</div>
                        <div>Recorded Area: {recordedArea} Ha</div>
                        <div>Owner: {currentParcel.ownerName}</div>
                      </div>
                    </Popup>
                  </Polygon>
                )}

                {/* 2. Measured Field Survey Polygon (Solid Green/Amber) */}
                {layers.currentSurvey && (
                  <Polygon 
                    positions={surveyPolygon}
                    pathOptions={{
                      color: isSignificantMismatch ? '#dc2626' : '#059669',
                      fillColor: isSignificantMismatch ? '#ef4444' : '#10b981',
                      fillOpacity: 0.25,
                      weight: 3
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 font-mono">
                        <strong className="text-emerald-800 block">DGPS Field Survey Boundary</strong>
                        <div>Measured Area: {measuredAreaHa} Ha</div>
                        <div>Difference: {areaDifference} Ha ({deviationPercent}%)</div>
                        <div>Status: {isSignificantMismatch ? 'Significant Mismatch' : 'Within Tolerance'}</div>
                      </div>
                    </Popup>
                  </Polygon>
                )}

                {/* 3. Numbered Survey Points (P1, P2, P3...) */}
                {layers.surveyPoints && capturedPoints.map((pt, idx) => (
                  <Marker 
                    key={pt.id || idx} 
                    position={[pt.lat, pt.lng]}
                    icon={createSurveyPointIcon(pt.id || `P${idx + 1}`, '#0f172a')}
                  >
                    <Popup>
                      <div className="text-xs p-1 font-mono">
                        <strong className="block text-slate-900">{pt.name || pt.id}</strong>
                        <div>Lat: {pt.lat.toFixed(6)}° N</div>
                        <div>Lng: {pt.lng.toFixed(6)}° E</div>
                        <div>Elevation: {pt.elevation} m</div>
                        <div>Time: {pt.time}</div>
                        <div className="text-emerald-700 font-bold">Accuracy: {pt.accuracy || '±1.8m'}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* 4. Current Surveyor GNSS Live Location Beacon */}
                {layers.surveyorLocation && (
                  <Marker 
                    position={[currentParcel.currentLatitude || 28.2478, currentParcel.currentLongitude || 77.0654]}
                    icon={surveyorLocationIcon}
                  >
                    <Popup>
                      <div className="text-xs p-1 font-mono">
                        <strong className="block text-blue-900">Surveyor Location (Anish Kumar)</strong>
                        <div>Device: Trimble R12i GNSS Receiver</div>
                        <div>RTK Status: Connected to CORS</div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* 5. Expressway Corridor ROW Polyline */}
                {layers.roads && NEARBY_GIS_FEATURES.roads.map((rd, i) => (
                  <Polyline 
                    key={i}
                    positions={rd.coordinates}
                    pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.7 }}
                  >
                    <Popup>
                      <div className="text-xs p-1 font-mono font-bold text-blue-900">{rd.name}</div>
                    </Popup>
                  </Polyline>
                ))}

                {/* 6. Irrigation Canal */}
                {layers.waterBodies && NEARBY_GIS_FEATURES.waterBodies.map((wb, i) => (
                  <Polyline 
                    key={i}
                    positions={wb.coordinates}
                    pathOptions={{ color: '#0284c7', weight: 3, dashArray: '4, 4' }}
                  />
                ))}
              </MapContainer>
            </div>

            {/* Split Screen Map Comparison Bar (When Compare Map Active) */}
            {isCompareOpen && (
              <div className="p-3 bg-slate-900 text-white border-t border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-bold">CADASTRAL REVENUE MAP (1965)</span>
                    <span className="text-slate-400">vs</span>
                    <span className="text-emerald-400 font-bold">CURRENT DGPS FIELD SURVEY</span>
                  </div>

                  <div className="text-right text-[11px]">
                    Recorded: <strong>{recordedArea} Ha</strong> | Surveyed: <strong>{measuredAreaHa} Ha</strong> | 
                    Diff: <strong className={areaDifference > 0 ? 'text-amber-400' : 'text-emerald-400'}>{areaDifference > 0 ? `+${areaDifference}` : areaDifference} Ha</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-[10px] font-mono text-slate-400">OLD CADASTRAL</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={compareOpacity}
                    onChange={(e) => setCompareOpacity(e.target.value)}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400">CURRENT SURVEY</span>
                </div>
              </div>
            )}

            {/* Bottom Realtime Measurements Strip */}
            <div className="bg-slate-50 border-t border-slate-200 p-2.5 px-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Recorded Area: </span>
                  <strong className="text-slate-900 font-bold">{recordedArea.toFixed(2)} Ha</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Measured Area: </span>
                  <strong className="text-slate-900 font-bold">{measuredAreaHa.toFixed(2)} Ha</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Perimeter: </span>
                  <strong className="text-slate-900 font-bold">{measuredPerimeterM} m</strong>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-500 text-[10px] uppercase">Tolerance Verdict: </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isSignificantMismatch ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  isReviewRequired ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {isSignificantMismatch ? '🔴 Significant Mismatch (>5%)' :
                   isReviewRequired ? '⚠ Review Required (1.5% - 5%)' :
                   '✓ Within Tolerance (<1.5%)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tabbed Details & Verification Inspector (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="gov-card rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-4">
            
            {/* Sub-tab Switchers */}
            <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl text-[10px] font-mono font-bold text-slate-600">
              <button
                onClick={() => setActiveSubTab('survey')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'survey' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-950'
                }`}
              >
                Survey
              </button>
              <button
                onClick={() => setActiveSubTab('owner')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'owner' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-950'
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => setActiveSubTab('evidence')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'evidence' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-950'
                }`}
              >
                Evidence
              </button>
              <button
                onClick={() => setActiveSubTab('documents')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'documents' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-950'
                }`}
              >
                Docs ({currentParcel.documents?.length || 0})
              </button>
            </div>

            {/* TAB 1: SURVEY DETAILS & CAPTURED POINTS */}
            {activeSubTab === 'survey' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Khasra / Survey #:</span>
                    <strong className="text-slate-900 font-mono">{currentParcel.surveyNumber}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">ULPIN Bhu-Aadhaar:</span>
                    <strong className="text-slate-900 font-mono">{currentParcel.ulpin}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Revenue Village:</span>
                    <strong className="text-slate-900">{currentParcel.village}, {currentParcel.district}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Land Classification:</span>
                    <strong className="text-slate-900">{currentParcel.landType}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Survey Deadline:</span>
                    <strong className="text-amber-800 font-bold">{currentParcel.deadline} ({currentParcel.daysRemaining} days left)</strong>
                  </div>
                </div>

                {/* Captured Points List */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-600">
                      Captured Coordinates ({capturedPoints.length})
                    </span>
                    <button 
                      onClick={handleCapturePoint}
                      className="text-[10px] font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Pt</span>
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                    {capturedPoints.map((pt, i) => (
                      <div key={i} className="p-2 flex items-center justify-between text-[11px] font-mono hover:bg-slate-50">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center">
                            {pt.id || `P${i+1}`}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{pt.name || pt.id}</div>
                            <div className="text-[9px] text-slate-500">{pt.lat.toFixed(5)}, {pt.lng.toFixed(5)}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold">{pt.accuracy || '±1.8m'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice Note Component */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-600 flex items-center space-x-1">
                      <Mic className="w-3.5 h-3.5 text-amber-600" />
                      <span>Surveyor Field Voice Notes</span>
                    </span>
                    {isRecordingVoice && (
                      <span className="text-[10px] font-mono text-rose-600 font-bold animate-pulse">
                        ● Recording {voiceRecordingSeconds}s...
                      </span>
                    )}
                  </div>

                  {!isRecordingVoice ? (
                    <button
                      onClick={() => setIsRecordingVoice(true)}
                      className="w-full bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-amber-600" />
                      <span>🎙 Start Voice Note</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopVoiceNote}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer animate-pulse"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop & Transcribe Note</span>
                    </button>
                  )}

                  {voiceNotes.length > 0 && (
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pt-1">
                      {voiceNotes.map((vn, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-2 rounded-lg text-[10px] space-y-1">
                          <div className="flex items-center justify-between text-slate-500 font-mono">
                            <span>{vn.timestamp} ({vn.duration})</span>
                            <span className="text-amber-700 font-bold">{vn.surveyor}</span>
                          </div>
                          <p className="text-slate-800 italic">"{vn.transcript}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: OWNER & PROPERTY VERIFICATION */}
            {activeSubTab === 'owner' && (
              <div className="space-y-3.5 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Current Owner:</span>
                    <strong className="text-slate-900 font-bold">{currentParcel.ownerName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Father / Husband:</span>
                    <strong className="text-slate-900">{currentParcel.fatherHusbandName || 'Mahendra Singh Yadav'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Contact Number:</span>
                    <strong className="text-slate-900">{currentParcel.ownerPhone || '+91 98120 44102'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Co-Owners:</span>
                    <strong className="text-slate-900">{currentParcel.coOwners || 'None'}</strong>
                  </div>
                </div>

                {/* Interactive Verification Checks */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                    Statutory Field Checklist
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Owner Present On-Site?</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setOwnerVerification({ ...ownerVerification, ownerPresent: true })}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            ownerVerification.ownerPresent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setOwnerVerification({ ...ownerVerification, ownerPresent: false })}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            !ownerVerification.ownerPresent ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Identity & Aadhaar Verified?</span>
                      <input 
                        type="checkbox" 
                        checked={ownerVerification.identityVerified} 
                        onChange={(e) => setOwnerVerification({ ...ownerVerification, identityVerified: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Agrees With Boundary?</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setOwnerVerification({ ...ownerVerification, agreesWithBoundary: true })}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            ownerVerification.agreesWithBoundary ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setOwnerVerification({ ...ownerVerification, agreesWithBoundary: false })}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            !ownerVerification.agreesWithBoundary ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature or Objection Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowSignatureModal(true)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Signature className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ownerVerification.hasSignature ? '✓ Owner Signature Captured' : 'Capture Owner Signature'}</span>
                  </button>

                  {!ownerVerification.agreesWithBoundary && (
                    <button
                      onClick={() => {
                        const note = prompt("Enter Landowner Objection grounds for official Section 3C dispute register:");
                        if (note) {
                          setOwnerVerification({ ...ownerVerification, objectionNotes: note });
                          alert("Objection recorded and transferred to CALA Legal Hearing schedule.");
                        }
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Raise Section 3C Objection</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: FIELD EVIDENCE (PHOTOS & VIDEOS) */}
            {activeSubTab === 'evidence' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-600">
                    Field Photographs ({evidencePhotos.length})
                  </span>
                  <button
                    onClick={() => setShowAddPhotoModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Evidence Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {evidencePhotos.map((photo, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 space-y-1">
                      <div className="h-20 bg-slate-200 relative overflow-hidden">
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white font-mono text-[8px] px-1 rounded">
                          {photo.category}
                        </span>
                      </div>
                      <div className="p-1.5 text-[9px] font-mono space-y-0.5 text-slate-600">
                        <div className="font-bold text-slate-900 truncate">{photo.title}</div>
                        <div>{photo.timestamp}</div>
                        <div className="text-emerald-700">GPS: {photo.lat?.toFixed(4)}, {photo.lng?.toFixed(4)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>GPS Watermarked Photos</span>
                  <button 
                    onClick={() => alert("Launching field camera with automated DILRMP geo-coordinates overlay.")}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Open Live Camera
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: DOCUMENTS VAULT */}
            {activeSubTab === 'documents' && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                  Statutory Dossier Documents
                </span>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  {(currentParcel.documents || []).map((doc, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                      <div className="space-y-0.5 max-w-[170px]">
                        <div className="font-bold text-slate-900 truncate">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{doc.issuedDate} • {doc.authority}</div>
                      </div>
                      <button
                        onClick={() => alert(`Opening official document preview: ${doc.title}`)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supervisor Review Progression Box (Only for Submitted / Supervisor stage) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                Supervisor Approval Workflow
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSupervisorApproval('APPROVED')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center space-x-1 transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Survey</span>
                </button>

                <button
                  onClick={() => handleSupervisorApproval('RETURNED')}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Return for Fix</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD PHOTO EVIDENCE MODAL */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-[4500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 font-mono">Upload Geo-Tagged Field Evidence</h3>
              <button onClick={() => setShowAddPhotoModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block mb-1">Asset Category</label>
                <select 
                  value={photoCategory} 
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                >
                  <option value="Boundary Marker">Boundary Marker / Cadastral Stone</option>
                  <option value="Land Photo">Land Photo / Crop Cultivation</option>
                  <option value="Existing Structure">Existing Structure / Pump House</option>
                  <option value="Road Access">Road Access / PWD Approach</option>
                  <option value="Encroachment">Encroachment / Fence Discrepancy</option>
                  <option value="Landmark">Geographical Landmark</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block mb-1">Photo Title / Caption</label>
                <input 
                  type="text" 
                  placeholder="e.g. Western Ridge Boundary Pillar" 
                  defaultValue={`${photoCategory} - Survey #${currentParcel.surveyNumber}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center space-y-2 bg-slate-50">
                <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-[11px] text-slate-600">Simulate Camera Capture with GNSS Watermark</p>
                <span className="text-[9px] text-emerald-700 font-mono block">
                  Embedding Lat: {currentParcel.currentLatitude}° N, Lng: {currentParcel.currentLongitude}° E
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddPhotoModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newImg = {
                    id: `IMG-${Date.now()}`,
                    category: photoCategory,
                    title: `${photoCategory} at Survey #${currentParcel.surveyNumber}`,
                    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60',
                    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    lat: currentParcel.currentLatitude,
                    lng: currentParcel.currentLongitude,
                    surveyorId: 'SURV-HR-048'
                  };
                  setEvidencePhotos([newImg, ...evidencePhotos]);
                  setShowAddPhotoModal(false);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Save & Stamp Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: OWNER SIGNATURE CAPTURE MODAL */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-[4500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 font-mono">Digital Signature Consent</h3>
              <button onClick={() => setShowSignatureModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700">
                I, <strong>{currentParcel.ownerName}</strong>, hereby acknowledge that the DGPS survey of Survey Number <strong>{currentParcel.surveyNumber}</strong> ({currentParcel.village}) was executed in my presence.
              </p>

              {/* Signature Canvas Box */}
              <div className="border-2 border-slate-300 rounded-xl p-3 h-28 bg-slate-50 flex flex-col justify-between relative">
                <span className="text-[9px] font-mono text-slate-400">Sign within boundary box:</span>
                <div className="font-serif italic text-2xl text-slate-800 text-center select-none">
                  Rameshwar Singh
                </div>
                <span className="text-[8px] font-mono text-slate-400 text-right">UIDAI Aadhaar Verified</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOwnerVerification({
                    ...ownerVerification,
                    hasSignature: true,
                    signatureDate: new Date().toLocaleString('en-IN')
                  });
                  setShowSignatureModal(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Confirm & Seal Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SMART SURVEY VALIDATION MODAL */}
      {showValidationModal && validationResult && (
        <div className="fixed inset-0 z-[4500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900 font-mono">Smart Survey Pre-Submission Audit</h3>
              </div>
              <button onClick={() => setShowValidationModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {validationResult.checks.map((chk) => (
                <div 
                  key={chk.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    chk.passed ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-bold">{chk.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-600">{chk.detail}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                {validationResult.isValid ? (
                  <span className="text-emerald-700">✓ All 7 statutory criteria verified!</span>
                ) : (
                  <span className="text-rose-700">⚠ Resolve missing criteria before submission</span>
                )}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Back to Editing
                </button>
                <button
                  disabled={!validationResult.isValid}
                  onClick={handleSubmitSurvey}
                  className={`font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs ${
                    validationResult.isValid 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Supervisor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SURVEY REPORT GENERATOR MODAL */}
      <SurveyReportModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        parcel={currentParcel} 
        onSubmitApproval={handleSubmitSurvey} 
      />
    </div>
  );
}
