import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { RECENT_AUDIT_LOGS } from '../data/mockData';

export default function AuditLogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl relative text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900 font-mono uppercase">BHUSTACK IMMUTABLE AUDIT LEDGER</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto text-xs">
          {RECENT_AUDIT_LOGS.map((log) => (
            <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber-800 font-bold">{log.action}</span>
                <span className="text-[10px] text-slate-500 font-mono font-medium">{log.timestamp}</span>
              </div>
              <p className="text-slate-800 text-xs font-medium">{log.details}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-600 border-t border-slate-200">
                <span>By: {log.user} (ULPIN: {log.ulpin})</span>
                <span className="font-mono text-emerald-700 font-bold">Hash: {log.txHash}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 font-medium">
          <span>Cryptographic Hash Ledger Verified</span>
          <button 
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
