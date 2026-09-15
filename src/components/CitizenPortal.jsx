import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  IndianRupee, 
  MessageSquare, 
  Send,
  Check
} from 'lucide-react';
import { formatINR } from '../utils/compensationEngine';

export default function CitizenPortal({ parcels }) {
  const [searchQuery, setSearchQuery] = useState('06-12-8891-K9X2A4');
  const [activeParcel, setActiveParcel] = useState(parcels[0]);
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = parcels.find(p => 
      p.ulpin.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    if (found) {
      setActiveParcel(found);
    } else {
      alert("No parcel found matching search query. Try: 06-12-8891-K9X2A4 or 45/2A");
    }
  };

  const handleGrievanceSubmit = (e) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    setGrievanceSubmitted(true);
    setTimeout(() => {
      setGrievanceSubmitted(false);
      setGrievanceText('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black tracking-tight text-slate-900 flex items-center space-x-2 font-mono">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>CITIZEN & LANDOWNER TRANSPARENCY PORTAL</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Check ULPIN land record status, statutory solatium award, Direct Benefit Transfer (DBT) bank payout progress, and file grievances.
          </p>
        </div>

        {/* Quick ULPIN Search Form */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Enter ULPIN (e.g. 06-12-8891...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:border-amber-500 w-full md:w-64"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>
        </form>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Land Parcel Status & DBT Tracker */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Record Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  Verified Bhu-Aadhaar Record
                </span>
                <h3 className="text-xl font-black font-mono text-slate-900 mt-1">{activeParcel.ulpin}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                  {activeParcel.status.replace(/_/g, ' ')}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Village: {activeParcel.village}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Landowner Name</span>
                <p className="font-extrabold text-slate-900 text-sm">{activeParcel.ownerName}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Survey Plot & Khata</span>
                <p className="font-mono font-bold text-slate-900 text-sm">Plot {activeParcel.surveyNo} ({activeParcel.khataNo})</p>
              </div>
            </div>

            {/* DBT Compensation Status Stepper */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  Direct Benefit Transfer (DBT) Tracker
                </span>
                <span className="text-xs font-mono font-black text-emerald-700">
                  Total Award: {formatINR(activeParcel.totalAwardAmount)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                  <span>PFMS Account Verification</span>
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeParcel.bankName} ({activeParcel.ifsc})</span>
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      activeParcel.dbtStatus === 'DISBURSED_100' ? 'w-full bg-emerald-600' : 'w-1/2 bg-amber-500'
                    }`}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-600 pt-1 font-medium">
                  <span>Sec 3G Award Finalized</span>
                  <span>Bank Verified</span>
                  <span className={activeParcel.dbtStatus === 'DISBURSED_100' ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-bold'}>
                    {activeParcel.dbtStatus === 'DISBURSED_100' ? '100% Funds Credited' : 'Processing In Bank Queue'}
                  </span>
                </div>
              </div>

              {activeParcel.dbtTransactionId && (
                <div className="bg-white p-2.5 rounded-lg text-xs font-mono text-slate-800 flex items-center justify-between border border-slate-200">
                  <span>Ref Txn ID: <strong className="text-amber-800">{activeParcel.dbtTransactionId}</strong></span>
                  <span className="text-[10px] text-slate-500">Date: {activeParcel.dbtDate}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right (5 cols): Grievance & Objection Filing */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Section 3C Public Grievance / Objection Filing</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">Submit legal objections or compensation disputes directly to the Competent Authority</p>
          </div>

          <form onSubmit={handleGrievanceSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">ULPIN Reference</label>
              <input
                type="text"
                value={activeParcel.ulpin}
                disabled
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Objection Category</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500">
                <option>Compensation Valuation Dispute (Rate per Hectare)</option>
                <option>Boundary & Survey Area Discrepancy</option>
                <option>Joint Ownership & Khata Split Claim</option>
                <option>Structure / Tree Valuation Revision</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Detailed Statement of Objection</label>
              <textarea
                rows={4}
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                placeholder="Describe your objection details under Section 3C..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Submit Statutory Objection to LAO</span>
            </button>
          </form>

          {grievanceSubmitted && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-xs text-emerald-900 font-medium flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Grievance registered successfully! Ref ID: <strong>GRV-2026-90812</strong>. Competent Authority notified.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
