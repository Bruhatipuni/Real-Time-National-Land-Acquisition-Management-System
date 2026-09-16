import React from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  Route, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ArrowRight,
  Compass,
  Car,
  ShieldCheck
} from 'lucide-react';
import { SURVEYOR_ROUTE_PLAN } from '../../data/surveyorData';

export default function SurveyRouteModal({ isOpen, onClose, onSelectParcel }) {
  if (!isOpen) return null;

  const plan = SURVEYOR_ROUTE_PLAN;

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-5 shadow-2xl space-y-4 my-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full uppercase">
                  Field AI Route Optimizer
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">{plan.routeId}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {plan.routeName}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Highlights Pill Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Total Distance</span>
            <span className="text-xl font-black font-mono text-slate-900 mt-0.5 block">{plan.totalDistanceKm} km</span>
            <span className="text-[10px] text-slate-500">Optimized Path</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Est. Field Duration</span>
            <span className="text-xl font-black font-mono text-amber-700 mt-0.5 block">{plan.estimatedTime}</span>
            <span className="text-[10px] text-slate-500">Incl. Survey Stops</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Target Parcels</span>
            <span className="text-xl font-black font-mono text-emerald-700 mt-0.5 block">5 Parcels</span>
            <span className="text-[10px] text-slate-500">Scheduled Today</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Base Office</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block truncate">Sohna Tehsildar</span>
            <span className="text-[10px] text-slate-500">Start & Finish Hub</span>
          </div>
        </div>

        {/* Corridor Context */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-amber-700 shrink-0" />
            <span><strong>Target Alignment:</strong> {plan.corridor}</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
            Fastest Sequence
          </span>
        </div>

        {/* Waypoints Sequence List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            Optimized Traversal Order (Start → Finish)
          </h4>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {(plan?.waypoints || []).map((wp, idx) => {
              const isBase = wp.type === 'BASE';
              return (
                <div 
                  key={idx}
                  className={`p-3 flex items-center justify-between transition-colors ${
                    isBase ? 'bg-slate-50' : 'bg-white hover:bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      isBase ? 'bg-slate-800 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {wp.order}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{wp.name}</span>
                        {wp.parcelId && (
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {wp.parcelId}
                          </span>
                        )}
                        {wp.priority && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                            wp.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            wp.priority === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                            'bg-blue-100 text-blue-800 border-blue-300'
                          }`}>
                            {wp.priority}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-2 mt-0.5">
                        <span>Lat: {wp.lat.toFixed(4)}, Lng: {wp.lng.toFixed(4)}</span>
                        <span>•</span>
                        <span>Stop Duration: {wp.stopDuration}</span>
                      </div>
                    </div>
                  </div>

                  {!isBase && onSelectParcel && (
                    <button
                      onClick={() => {
                        onSelectParcel(wp.parcelId);
                        onClose();
                      }}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1 cursor-pointer bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg"
                    >
                      <span>Survey Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Calculated using DILRMP 3.0 Real-time Road Network & CORS Elevation</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                alert(`Exporting Field Route Manifest (${plan.routeId}) with turn-by-turn GPS waypoints to device storage.`);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GPX / KML</span>
            </button>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
            >
              Close & Proceed to Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
