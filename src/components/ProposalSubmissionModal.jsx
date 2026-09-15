import React, { useState } from 'react';
import { 
  Send, 
  X, 
  UploadCloud, 
  FileCheck, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function ProposalSubmissionModal({ isOpen, onClose, onAddProposal }) {
  const [formData, setFormData] = useState({
    projectName: '',
    agency: 'National Highways Authority of India (NHAI)',
    ministry: 'Ministry of Road Transport and Highways',
    state: 'Haryana',
    district: 'Gurugram',
    proposedAreaHa: '',
    budgetCrores: '',
    displacedFamilies: '',
    corridorType: 'HIGHWAY_EXPRESSWAY',
    surveyDocument: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectName || !formData.proposedAreaHa) {
      alert("Please fill in the project title and proposed land area.");
      return;
    }

    const newProj = {
      id: `PROJ-${Math.floor(Math.random()*9000)+1000}`,
      name: formData.projectName,
      agency: formData.agency,
      ministry: formData.ministry,
      state: formData.state,
      districts: [formData.district],
      totalParcels: Math.ceil(parseFloat(formData.proposedAreaHa) * 1.5),
      acquiredParcels: 0,
      totalAreaHa: parseFloat(formData.proposedAreaHa),
      acquiredAreaHa: 0,
      budgetAllocatedCrores: parseFloat(formData.budgetCrores) || 500,
      budgetDisbursedCrores: 0,
      status: "SUBMITTED_DIGITAL_SCRUTINY",
      currentStage: "LAND_IDENTIFICATION",
      displacedFamilies: parseInt(formData.displacedFamilies) || 45,
      rehabilitatedFamilies: 0,
      activeDisputes: 0,
      dssOptimizationScore: 94,
      centerLat: 28.1487,
      centerLng: 76.9312,
      zoom: 11
    };

    onAddProposal(newProj);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-tight">
                ONLINE LAND ACQUISITION PROPOSAL SUBMISSION & SCRUTINY PORTAL
              </h3>
              <p className="text-xs text-slate-400">Implementing Agency Digital Filing for Central/State Approvals</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Corridor Title</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi-Amritsar Expressway Segment II"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Implementing Agency</label>
                <select
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 font-medium"
                >
                  <option>National Highways Authority of India (NHAI)</option>
                  <option>Dedicated Freight Corridor Corporation (DFCCIL)</option>
                  <option>Ministry of Railways (Indian Railways)</option>
                  <option>Coal India Limited (CIL)</option>
                  <option>Solar Energy Corporation of India (SECI)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State / Union Territory</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500"
                >
                  <option>Haryana</option>
                  <option>Maharashtra</option>
                  <option>Uttar Pradesh</option>
                  <option>Gujarat</option>
                  <option>Madhya Pradesh</option>
                  <option>Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District Nodal Authority</label>
                <input
                  type="text"
                  placeholder="e.g. Gurugram / Palghar"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Proposed Land (Hectares)</label>
                <input
                  type="number"
                  placeholder="e.g. 450.5"
                  value={formData.proposedAreaHa}
                  onChange={(e) => setFormData({ ...formData, proposedAreaHa: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Acquisition Budget (₹ Cr)</label>
                <input
                  type="number"
                  placeholder="e.g. 850"
                  value={formData.budgetCrores}
                  onChange={(e) => setFormData({ ...formData, budgetCrores: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Affected Families</label>
                <input
                  type="number"
                  placeholder="e.g. 120"
                  value={formData.displacedFamilies}
                  onChange={(e) => setFormData({ ...formData, displacedFamilies: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white focus:border-amber-500"
                />
              </div>
            </div>

            {/* Document Upload Area */}
            <div className="bg-slate-950 border border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 text-center space-y-2 cursor-pointer transition-colors">
              <UploadCloud className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-xs text-slate-300 font-semibold">Upload Feasibility Report & Survey Map KML/GeoJSON</div>
              <p className="text-[10px] text-slate-500">Supported formats: GeoJSON, KML, PDF Gazette Copy (Max 25MB)</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Automated Routing to District Collector & Ministry</span>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Proposal for Scrutiny</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <h4 className="text-sm font-bold text-white">Proposal Digital Scrutiny Initiated</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Proposal registered under Ref <strong>PROJ-2026-9081</strong>. Automated workflow notification sent to District Collector (LAO) & Ministry for Joint Survey verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
