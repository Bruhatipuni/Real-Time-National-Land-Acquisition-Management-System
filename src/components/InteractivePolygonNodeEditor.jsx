import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  ShieldCheck, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Layers,
  TreePine,
  Building,
  Home,
  Droplets,
  Activity
} from 'lucide-react';

export default function InteractivePolygonNodeEditor({ 
  parcel, 
  onSaveCoordinates, 
  onClose,
  onLogAudit
}) {
  // Coordinates state as array of [lat, lng]
  const [nodes, setNodes] = useState(
    parcel?.coordinates && parcel.coordinates.length > 0 
      ? parcel.coordinates.map(pt => [parseFloat(pt[0]), parseFloat(pt[1])])
      : [
          [19.2185, 72.9780],
          [19.2230, 72.9840],
          [19.2170, 72.9890],
          [19.2130, 72.9815]
        ]
  );

  // Ground Assets State
  const [groundAssets, setGroundAssets] = useState(
    parcel?.groundAssets || {
      buildings: 0,
      houses: 0,
      trees: 14,
      wells: 1,
      borewells: 1,
      waterBodies: 0,
      roads: 0,
      utilityStructures: 1,
      agriculturalAssets: 2
    }
  );

  // Survey status
  const [surveyStatus, setSurveyStatus] = useState(parcel?.surveyStatus || "Survey Done → Handed to LAO");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [bhuStackSuccess, setBhuStackSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle node coordinate change
  const handleCoordChange = (index, coordIdx, value) => {
    const val = parseFloat(value);
    const newNodes = [...nodes];
    newNodes[index] = [...newNodes[index]];
    newNodes[index][coordIdx] = isNaN(val) ? 0 : val;
    setNodes(newNodes);
    setSavedSuccess(false);
    setValidationError('');
  };

  // Add new node
  const handleAddNode = () => {
    if (nodes.length >= 12) {
      setValidationError('Maximum 12 boundary vertices allowed for this parcel demo.');
      return;
    }
    // Interpolate midpoint between last and first node
    const last = nodes[nodes.length - 1];
    const first = nodes[0];
    const newNode = [
      parseFloat(((last[0] + first[0]) / 2).toFixed(6)),
      parseFloat(((last[1] + first[1]) / 2).toFixed(6))
    ];
    setNodes([...nodes, newNode]);
    setSavedSuccess(false);
  };

  // Remove node
  const handleRemoveNode = (index) => {
    if (nodes.length <= 3) {
      setValidationError('A minimum of 3 vertices is required to define a closed spatial parcel polygon.');
      return;
    }
    const newNodes = nodes.filter((_, idx) => idx !== index);
    setNodes(newNodes);
    setSavedSuccess(false);
  };

  // Validate coordinates
  const validateNodes = () => {
    for (let i = 0; i < nodes.length; i++) {
      const [lat, lng] = nodes[i];
      if (lat < 6 || lat > 38 || lng < 68 || lng > 98) {
        setValidationError(`Node #${i + 1} coordinates [${lat}, ${lng}] fall outside sovereign Indian coordinates.`);
        return false;
      }
    }
    return true;
  };

  // Save boundary locally & update map
  const handleSaveBoundary = () => {
    if (!validateNodes()) return;
    if (onSaveCoordinates) {
      onSaveCoordinates(parcel.id, nodes, groundAssets, surveyStatus);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Save to BhuStack Immutable Ledger
  const handleSaveToBhuStack = () => {
    if (!validateNodes()) return;
    if (onSaveCoordinates) {
      onSaveCoordinates(parcel.id, nodes, groundAssets, surveyStatus);
    }
    if (onLogAudit) {
      onLogAudit({
        user: "Anish Kumar (Senior Surveyor)",
        action: "DGPS Boundary Demarcation Verified & Saved to BhuStack",
        parcelId: parcel.id || parcel.ulpin,
        details: `Updated ${nodes.length} polygon boundary vertices. Status: ${surveyStatus}`
      });
    }
    setBhuStackSuccess(true);
    setTimeout(() => setBhuStackSuccess(false), 3500);
  };

  // Ground Asset counter change
  const updateAssetCount = (key, delta) => {
    setGroundAssets(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl p-5 shadow-2xl space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-white font-mono uppercase">
              Interactive Polygon Node Editor
            </h3>
            <p className="text-[11px] text-slate-400">
              Joint Measurement Survey (JMS) • DGPS Boundary Pinning for Plot {parcel?.plotNumber || parcel?.surveyNo}
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mandatory Statutory Caveat */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-400">Statutory Notice:</strong> The polygon represents the surveyed / digitized geographical boundary. It does not independently determine legal ownership.
        </p>
      </div>

      {validationError && (
        <div className="bg-rose-950/60 border border-rose-600/40 text-rose-300 p-2.5 rounded-xl text-[11px] flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 p-2.5 rounded-xl text-[11px] flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Boundary polygon coordinates saved and updated on GIS map layer!</span>
        </div>
      )}

      {bhuStackSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-2.5 rounded-xl text-[11px] flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Committed to BhuStack Immutable SHA-256 Ledger (Block #88921 verified by Senior Surveyor)!</span>
        </div>
      )}

      {/* Node Coordinate Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Boundary Nodes ({nodes.length} Vertices)</span>
          <button
            onClick={handleAddNode}
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Node</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
          {nodes.map((node, idx) => (
            <div 
              key={idx} 
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="font-bold text-amber-400">Node #{idx + 1}</span>
                {nodes.length > 3 && (
                  <button 
                    onClick={() => handleRemoveNode(idx)}
                    title="Remove Vertex"
                    className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-[9px] text-slate-500 block uppercase font-mono">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={node[0]}
                    onChange={(e) => handleCoordChange(idx, 0, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 block uppercase font-mono">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={node[1]}
                    onChange={(e) => handleCoordChange(idx, 1, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ground Assets Capture Section */}
      <div className="border-t border-slate-800 pt-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <TreePine className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enumerated Ground Assets</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">RFCTLARR Schedule I Valuation</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Timber & Fruit Trees</span>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <button 
                onClick={() => updateAssetCount('trees', -1)} 
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >-</button>
              <span className="font-mono font-bold text-emerald-400 text-sm">{groundAssets.trees || 0}</span>
              <button 
                onClick={() => updateAssetCount('trees', 1)} 
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >+</button>
            </div>
          </div>

          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Wells & Borewells</span>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <button 
                onClick={() => updateAssetCount('borewells', -1)} 
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >-</button>
              <span className="font-mono font-bold text-cyan-400 text-sm">{(groundAssets.borewells || 0) + (groundAssets.wells || 0)}</span>
              <button 
                onClick={() => updateAssetCount('borewells', 1)} 
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >+</button>
            </div>
          </div>

          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Buildings / Sheds</span>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <button 
                onClick={() => updateAssetCount('buildings', -1)} 
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >-</button>
              <span className="font-mono font-bold text-amber-400 text-sm">{(groundAssets.buildings || 0) + (groundAssets.houses || 0)}</span>
              <button 
                onClick={() => updateAssetCount('buildings', 1)} 
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Workflow Status */}
      <div className="border-t border-slate-800 pt-3 space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Field Survey Status
        </label>
        <select
          value={surveyStatus}
          onChange={(e) => setSurveyStatus(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
        >
          <option value="Pending GIS Demarcation">Pending GIS Demarcation</option>
          <option value="Pending Ground Survey">Pending Ground Survey</option>
          <option value="Under Active Survey">Under Active Survey</option>
          <option value="Survey Complete">Survey Complete</option>
          <option value="Survey Done → Handed to LAO">Survey Done → Handed to LAO</option>
          <option value="Requires Reverification">Requires Reverification</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        {onClose && (
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSaveBoundary}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 border border-slate-600 transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-amber-400" />
          <span>Save Boundary</span>
        </button>
        <button
          onClick={handleSaveToBhuStack}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Save to BhuStack</span>
        </button>
      </div>
    </div>
  );
}
