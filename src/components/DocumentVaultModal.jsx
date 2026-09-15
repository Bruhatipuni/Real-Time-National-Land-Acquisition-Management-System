import React, { useState } from 'react';
import { FileText, Download, Eye, Upload, Search, CheckCircle, ShieldAlert, FileCheck, X } from 'lucide-react';

export default function DocumentVaultModal({ isOpen, onClose, parcels }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  if (!isOpen) return null;

  // Aggregate all documents across all land parcels
  const allDocuments = parcels.flatMap(p => 
    (p.documents || []).map(doc => ({
      ...doc,
      landId: p.landId || p.id,
      surveyNumber: p.surveyNumber || p.surveyNo,
      ownerName: p.currentOwner || p.ownerName,
      village: p.village,
      district: p.district
    }))
  );

  const filteredDocs = allDocuments.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.landId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-50">Document Management Vault</h2>
              <p className="text-xs text-slate-400">Statutory Gazette Notices, Revenue Records, Solatium Awards & Legal Documents</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Land ID, Survey #, Title, Owner..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Document Type:</span>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Types</option>
              <option value="OWNERSHIP_PROOF">Ownership Proof / Khatauni</option>
              <option value="SURVEY_MAP">Survey Map / Geo-Tagging</option>
              <option value="NOTICE">Gazette Notification (Sec 3A)</option>
              <option value="AWARD_CERT">Solatium Award (Sec 3G)</option>
              <option value="LEGAL_DOCUMENT">Legal / Objection Stay Order</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold text-sm">No statutory documents match your query.</p>
              <p className="text-slate-400 text-xs mt-1">Try resetting the search terms or document type filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{doc.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                            {doc.landId}
                          </span>
                          <span className="text-xs text-slate-500">
                            Survey #{doc.surveyNumber} ({doc.ownerName})
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
                      doc.status === 'VERIFIED' || doc.status === 'SIGNED' || doc.status === 'APPROVED' || doc.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Uploaded: <strong className="text-slate-700">{doc.date}</strong></span>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                      <a 
                        href={doc.url} 
                        download
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center text-xs text-slate-500">
          <span>Total Documents Registered: <strong className="text-slate-800 font-bold">{allDocuments.length}</strong></span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
}
