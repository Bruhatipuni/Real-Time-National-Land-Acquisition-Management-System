import React, { useState } from 'react';
import { 
  Users, 
  X, 
  Search, 
  Home, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ExternalLink,
  MapPin,
  FileCheck
} from 'lucide-react';
import { formatINR } from '../utils/compensationEngine';

export default function RnRFamiliesModal({ isOpen, onClose, projects, selectedProject }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!isOpen) return null;

  const demoFamilies = [
    {
      id: "RNR-MAH-01",
      headOfFamily: "Dattatray Pandurang Patil",
      membersCount: 5,
      plotNumber: "112/3B",
      ulpin: "27-14-9021-M8H2B1",
      village: "Kalyan East",
      district: "Thane",
      state: "Maharashtra",
      project: "Mumbai-Ahmedabad High-Speed Rail Corridor",
      displaced: false,
      rehabStatus: "SCHEDULE_II_CONSULTED",
      rehabBadge: "Schedule II Consulted",
      rehabColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      resettlementColony: "Not Displaced (Agricultural Plot Only)",
      consultationDate: "14 Jan 2026",
      statutoryAllowanceCr: 0.12,
      dbtStatus: "VERIFIED_PFMS"
    },
    {
      id: "RNR-MAH-02",
      headOfFamily: "Sunita Manohar Deshmukh",
      membersCount: 4,
      plotNumber: "88/1A",
      ulpin: "27-14-9022-P9K1A3",
      village: "Shahapur",
      district: "Palghar",
      state: "Maharashtra",
      project: "Mumbai-Ahmedabad High-Speed Rail Corridor",
      displaced: true,
      rehabStatus: "ALLOTMENT_IN_PROGRESS",
      rehabBadge: "R&R Plot Allotment In Progress",
      rehabColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      resettlementColony: "Shahapur Phase-1 Resettlement Complex (Plot #42)",
      consultationDate: "20 Jan 2026",
      statutoryAllowanceCr: 0.25,
      dbtStatus: "ESCROW_DISPUTED"
    },
    {
      id: "RNR-HR-03",
      headOfFamily: "Rameshwar Singh Yadav",
      membersCount: 6,
      plotNumber: "45/2A",
      ulpin: "06-12-8891-K9X2A4",
      village: "Sohna Rural",
      district: "Gurugram",
      state: "Haryana",
      project: "Delhi-Mumbai Industrial Expressway (Section IV)",
      displaced: false,
      rehabStatus: "COMPENSATION_DEPOSITED",
      rehabBadge: "Annuity / Cash in Lieu Paid",
      rehabColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      resettlementColony: "N/A (Livelihood Grant Paid)",
      consultationDate: "05 Feb 2026",
      statutoryAllowanceCr: 0.18,
      dbtStatus: "VERIFIED_PFMS"
    },
    {
      id: "RNR-AP-04",
      headOfFamily: "K. Satyanarayana Murthy & Clan",
      membersCount: 9,
      plotNumber: "56/2",
      ulpin: "28-09-7712-A1B2C3",
      village: "Polavaram Rural",
      district: "Eluru",
      state: "Andhra Pradesh",
      project: "Polavaram Multi-Purpose Irrigation Project",
      displaced: true,
      rehabStatus: "COLONY_ALLOTTED",
      rehabBadge: "Phase-2 R&R Colony Vested",
      rehabColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      resettlementColony: "Polavaram Model Resettlement Colony Sector-C",
      consultationDate: "18 Nov 2025",
      statutoryAllowanceCr: 0.45,
      dbtStatus: "PARTIAL_DISBURSED"
    }
  ];

  const filtered = demoFamilies.filter(f => {
    const matchesSearch = 
      f.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.ulpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'DISPLACED' ? f.displaced : !f.displaced);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 font-sans overflow-hidden">
        {/* Tricolor Ribbon */}
        <div className="gov-tricolor-bar" />

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white font-mono tracking-tight uppercase">
                  Rehabilitation & Resettlement (R&R) Family Registry
                </h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">
                  RFCTLARR 2013 Schedule II
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Statutory tracking of affected and displaced families, livelihood grants, and resettlement colony allotments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Affected Families</span>
            <span className="text-lg font-black text-white font-mono">620 Families</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Displaced for Resettlement</span>
            <span className="text-lg font-black text-amber-400 font-mono">184 Families</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Resettlement Colonies</span>
            <span className="text-lg font-black text-emerald-400 font-mono">4 Developed</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">R&R Assistance Grant</span>
            <span className="text-lg font-black text-purple-400 font-mono">100% PFMS Linked</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search family head, ULPIN, plot, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
          <div className="flex items-center space-x-1 self-start sm:self-auto">
            {['ALL', 'DISPLACED', 'NON-DISPLACED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Family Cards Queue */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((family) => (
            <div 
              key={family.id} 
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2 transition-colors text-xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 mr-2">{family.id}</span>
                  <span className="font-bold text-white text-sm">{family.headOfFamily}</span>
                  <span className="text-[11px] text-slate-400 ml-2">({family.membersCount} Family Members)</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${family.rehabColor}`}>
                  {family.rehabBadge}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Plot & ULPIN</span>
                  <strong className="text-white font-mono">{family.plotNumber}</strong>
                  <span className="text-[10px] text-slate-400 block truncate">{family.ulpin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Location</span>
                  <span className="text-white font-medium">{family.village}, {family.district}</span>
                  <span className="text-[10px] text-slate-400 block">{family.state}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Resettlement Colony</span>
                  <span className="text-slate-200">{family.resettlementColony}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Statutory Livelihood Grant</span>
                  <strong className="text-emerald-400 font-mono">₹{(family.statutoryAllowanceCr * 100).toFixed(0)} Lakhs</strong>
                  <span className="text-[10px] text-slate-400 block">PFMS Status: {family.dbtStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>* All demonstration family records are synthetically mapped to RFCTLARR 2013 Schedule II.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
