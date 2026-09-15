import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Compass, 
  Calculator, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  TreePine,
  Users,
  IndianRupee,
  Layers
} from 'lucide-react';
import { ROUTE_ALIGNMENT_OPTIONS } from '../data/mockData';
import { calculateLARRCompensation, formatINR } from '../utils/compensationEngine';

export default function DecisionSupport() {
  const [selectedAlignment, setSelectedAlignment] = useState(ROUTE_ALIGNMENT_OPTIONS[0].alignmentId);

  // Calculator Form State
  const [calcArea, setCalcArea] = useState(2.5);
  const [calcBaseRate, setCalcBaseRate] = useState(4500000);
  const [calcIsRural, setCalcIsRural] = useState(true);
  const [calcDistanceKm, setCalcDistanceKm] = useState(18);
  const [calcStructureVal, setCalcStructureVal] = useState(500000);
  const [calcMonths, setCalcMonths] = useState(8);

  const calcResult = calculateLARRCompensation({
    areaHectares: parseFloat(calcArea) || 1,
    baseRatePerHectare: parseFloat(calcBaseRate) || 1000000,
    isRural: calcIsRural,
    distanceFromUrbanKm: parseFloat(calcDistanceKm) || 10,
    structureAssetsValue: parseFloat(calcStructureVal) || 0,
    monthsSinceNotification: parseInt(calcMonths) || 6
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border border-purple-500/30 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-lg font-black tracking-tight text-white font-mono">
              AI-POWERED DECISION SUPPORT SYSTEM (DSS)
            </h2>
            <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">
              ML Engine v3.2
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Intelligent route alignment cost & risk optimizer, statutory RFCTLARR 2013 solatium matrix, and bottleneck radar.
          </p>
        </div>
      </div>

      {/* Grid: 2 Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Route Alignment & Risk Optimizer */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Corridor Route Alignment Optimizer</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Corridor Comparison Analysis</span>
          </div>

          {/* Route Options Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROUTE_ALIGNMENT_OPTIONS.map((opt) => {
              const isSelected = selectedAlignment === opt.alignmentId;
              return (
                <div
                  key={opt.alignmentId}
                  onClick={() => setSelectedAlignment(opt.alignmentId)}
                  className={`rounded-xl p-4 border transition-all cursor-pointer space-y-3 ${
                    isSelected 
                      ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/20 shadow-lg' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      opt.score > 80 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {opt.recommendationBadge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Score: {opt.score}/100</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{opt.name}</h4>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Corridor Length:</span>
                      <span className="font-mono font-bold text-white">{opt.lengthKm} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Private Land Needed:</span>
                      <span className="font-mono text-white">{opt.privateLandHa} Ha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Forest Area Intersect:</span>
                      <span className="font-mono text-amber-300">{opt.forestLandHa} Ha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Displaced Families:</span>
                      <span className="font-mono text-rose-300">{opt.displacedFamilies} Families</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                      <span className="text-slate-200">Est. Land Cost:</span>
                      <span className="font-mono text-emerald-400">₹{opt.estimatedCostCrores} Crores</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DSS AI Recommendation Summary */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>DSS Recommendation Synthesis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Route Alpha</strong> is recommended by the AI DSS model. Although it intersects 90 Ha of social forestry, it reduces family displacement by 55% (140 vs 310 families) and saves ₹280 Crores in statutory solatium compensation payouts.
            </p>
          </div>
        </div>

        {/* Right (5 cols): Statutory Solatium & Award Calculator */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>RFCTLARR 2013 Award Calculator</span>
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
              100% Solatium
            </span>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Acquisition Area (Ha)</label>
                <input
                  type="number"
                  value={calcArea}
                  onChange={(e) => setCalcArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base Rate (₹ / Ha)</label>
                <input
                  type="number"
                  value={calcBaseRate}
                  onChange={(e) => setCalcBaseRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Land Setting</label>
                <select
                  value={calcIsRural ? "RURAL" : "URBAN"}
                  onChange={(e) => setCalcIsRural(e.target.value === "RURAL")}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-500"
                >
                  <option value="RURAL">Rural Land (Multiplier 1.25x-2.0x)</option>
                  <option value="URBAN">Urban Land (Multiplier 1.0x)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distance from Urban (Km)</label>
                <input
                  type="number"
                  value={calcDistanceKm}
                  onChange={(e) => setCalcDistanceKm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Structures / Assets Value (₹)</label>
              <input
                type="number"
                value={calcStructureVal}
                onChange={(e) => setCalcStructureVal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-amber-500"
              />
            </div>
          </div>

          {/* Award Breakdown Box */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between">
              <span>Statutory Compensation Matrix</span>
              <span>Multiplier: {calcResult.multiplier}x</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Multiplied Base Value:</span>
                <span className="font-mono text-white">{formatINR(calcResult.multipliedLandValue)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Structure & Crop Value:</span>
                <span className="font-mono text-white">{formatINR(calcResult.structureAssetsValue)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Compulsory Solatium (100%):</span>
                <span className="font-mono text-emerald-400 font-bold">{formatINR(calcResult.solatium)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Statutory Interest (12% p.a.):</span>
                <span className="font-mono text-amber-300">{formatINR(calcResult.interestAmount)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-black text-base">
                <span className="text-white">Total Award:</span>
                <span className="font-mono text-emerald-400">{formatINR(calcResult.totalAwardAmount)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
