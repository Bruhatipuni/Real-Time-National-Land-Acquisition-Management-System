import React, { useState } from 'react';
import { ShieldCheck, X, Search, CheckCircle2, Lock, ExternalLink } from 'lucide-react';
import { RECENT_AUDIT_LOGS } from '../data/mockData';

export default function AuditLogModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLogs = RECENT_AUDIT_LOGS.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative text-slate-900 font-sans">
        {/* Top Tricolor Accent */}
        <div className="gov-tricolor-bar" />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                    BHUSTACK IMMUTABLE AUDIT LEDGER
                  </h3>
                  <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    SHA-256
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  National Statutory Land Acquisition Cryptographic Chain of Custody
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by Action, Officer, ULPIN, or Tx Hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>

          {/* Logs List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 text-xs">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-800 font-black text-xs">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-semibold">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-800 text-xs font-medium leading-relaxed">{log.details}</p>
                  <div className="flex flex-wrap items-center justify-between gap-1 pt-2 text-[10px] text-slate-600 border-t border-slate-200/80">
                    <span>Officer: <strong className="text-slate-900">{log.user}</strong> (ULPIN: <span className="font-mono font-bold text-slate-800">{log.ulpin}</span>)</span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Tx: {log.txHash}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No ledger entries matched "{searchQuery}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-1.5 text-emerald-700 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographic Hash Ledger Verified & Immutable (NIC MeitY Standard)</span>
            </div>
            <button 
              onClick={onClose}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-4 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Close Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

