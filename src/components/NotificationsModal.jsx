import React from 'react';
import { Bell, Check, ShieldAlert, FileText, CheckCircle, Clock, X } from 'lucide-react';
import { NOTIFICATIONS_DATA } from '../data/mockData';

export default function NotificationsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-50 text-base">Real-time Statutory Alerts</h3>
              <p className="text-xs text-slate-400">Approvals, High Risk Warnings & Statutory Gazette Notifications</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {NOTIFICATIONS_DATA.map(notif => (
            <div 
              key={notif.id}
              className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
                notif.read ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/20'
              }`}
            >
              <div className={`p-2 rounded-xl mt-0.5 ${
                notif.type === 'ALERT' ? 'bg-red-100 text-red-700' :
                notif.type === 'APPROVAL' ? 'bg-amber-100 text-amber-800' :
                notif.type === 'FINANCE' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {notif.type === 'ALERT' ? <ShieldAlert className="w-5 h-5" /> :
                 notif.type === 'APPROVAL' ? <Clock className="w-5 h-5" /> :
                 notif.type === 'FINANCE' ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400">{notif.date}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">4 Active System Notifications</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
