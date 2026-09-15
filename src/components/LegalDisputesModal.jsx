import React, { useState } from 'react';
import { Scale, AlertTriangle, ShieldCheck, UserCheck, Calendar, FileText, CheckCircle2, X } from 'lucide-react';
import { LEGAL_CASES_DATA } from '../data/mockData';

export default function LegalDisputesModal({ isOpen, onClose, parcels }) {
  const [cases, setCases] = useState(LEGAL_CASES_DATA);
  const [selectedCase, setSelectedCase] = useState(LEGAL_CASES_DATA[0]);
  const [resolutionNote, setResolutionNote] = useState('');

  if (!isOpen) return null;

  const handleResolveCase = (caseId) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        return { ...c, status: 'Resolved & Cleared', resolution: resolutionNote || 'Resolved by Legal Officer after Section 3C hearing' };
      }
      return c;
    }));
    setResolutionNote('');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-50">Legal & Objection Dispute Management</h2>
              <p className="text-xs text-slate-400">Section 3C Objections, High Court Stay Orders & Solatium Dispute Resolution</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Case List Sidebar */}
          <div className="border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Registered Legal Cases ({cases.length})</h3>
            {cases.map(c => (
              <button
                key={c.caseId}
                onClick={() => setSelectedCase(c)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  selectedCase?.caseId === c.caseId
                    ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {c.caseId}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'Resolved & Cleared'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 mt-2 line-clamp-2">{c.issue}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  <span>Land: <strong className="font-mono text-slate-700">{c.landId}</strong></span>
                  <span className="text-red-600 font-medium">Priority: {c.priority}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Case Details */}
          <div className="col-span-2 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            {selectedCase && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        Case #{selectedCase.caseId}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedCase.issue}</h3>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      selectedCase.status === 'Resolved & Cleared'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {selectedCase.status}
                    </span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Target Land Parcel:</span>
                      <span className="font-bold font-mono text-slate-800 text-sm">{selectedCase.landId} (Survey #{selectedCase.surveyNumber})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Court / Forum:</span>
                      <span className="font-semibold text-slate-800">{selectedCase.courtName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Petitioner / Objector:</span>
                      <span className="font-semibold text-slate-800">{selectedCase.petitioner}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Assigned Legal Officer:</span>
                      <span className="font-semibold text-slate-800">{selectedCase.assignedOfficer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Next Hearing Date:</span>
                      <span className="font-bold text-amber-700">{selectedCase.nextHearingDate || 'To be scheduled'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">ULPIN Bhu-Aadhaar:</span>
                      <span className="font-mono text-slate-800">{selectedCase.ulpin}</span>
                    </div>
                  </div>

                  {/* Resolution Form */}
                  {selectedCase.status !== 'Resolved & Cleared' && (
                    <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Legal Officer Hearing & Dispute Resolution</span>
                      </h4>
                      <textarea
                        rows={3}
                        placeholder="Enter Section 3C objection hearing findings and resolution order..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        className="w-full text-xs p-3 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => handleResolveCase(selectedCase.caseId)}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Dispute Clearance & Resolve Case</span>
                      </button>
                    </div>
                  )}

                  {selectedCase.resolution && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <h4 className="text-xs font-bold text-emerald-900 mb-1">Resolution Clearance Record:</h4>
                      <p className="text-xs text-emerald-800 italic">"{selectedCase.resolution}"</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center text-xs text-slate-500">
          <span>Active Statutory Disputes: <strong className="text-red-700 font-bold">{cases.filter(c => c.status !== 'Resolved & Cleared').length}</strong></span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
}
