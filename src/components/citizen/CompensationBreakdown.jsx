import React, { useState } from 'react';
import { 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Download, 
  ExternalLink,
  Info,
  X,
  FileCheck,
  Building,
  ArrowRight
} from 'lucide-react';
import { calculateLARRCompensation, formatINR } from '../../utils/compensationEngine';

export default function CompensationBreakdown({ parcel, lang = 'en', onNavigateTab }) {
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const isHi = lang === 'hi';

  const baseRate = parcel.marketRatePerHa || 4500000;
  const area = parcel.areaHectares || 1.85;

  const compData = calculateLARRCompensation({
    areaHectares: area,
    baseRatePerHectare: baseRate,
    isRural: true,
    distanceFromUrbanKm: 18,
    structureAssetsValue: 350000,
    treeCropAssetsValue: 210000,
    monthsSinceNotification: 6
  });

  const totalAward = parcel.totalAwardAmount || compData.totalAwardAmount;

  // DBT progress stage tracker
  const dbtStages = [
    {
      id: 1,
      title: "Sec 3G Award Approved",
      titleHi: "धारा 3G निर्णय अनुमोदित",
      desc: "Order signed by District Collector",
      descHi: "जिला कलेक्टर द्वारा हस्ताक्षरित",
      done: true,
      date: "15 Aug 2026"
    },
    {
      id: 2,
      title: "PFMS Bank KYC Verified",
      titleHi: "पीएफएमएस बैंक खाता सत्यापित",
      desc: `${parcel.bankName} (${parcel.ifsc})`,
      descHi: `${parcel.bankName} (${parcel.ifsc})`,
      done: parcel.bankAccountVerified ?? true,
      date: "25 Aug 2026"
    },
    {
      id: 3,
      title: "DBT Payment Batch Dispatched",
      titleHi: "डीबीटी भुगतान प्रेषित",
      desc: parcel.dbtTransactionId ? `Ref: ${parcel.dbtTransactionId}` : "Batch queuing in RBI e-Kuber",
      descHi: parcel.dbtTransactionId ? `संदर्भ: ${parcel.dbtTransactionId}` : "आरबीआई ई-कुबेर में प्रक्रियाधीन",
      done: !!parcel.dbtTransactionId,
      date: parcel.dbtDate || "02 Sep 2026"
    },
    {
      id: 4,
      title: "100% Funds Credited to Bank",
      titleHi: "100% राशि बैंक खाते में जमा",
      desc: parcel.dbtStatus === 'DISBURSED_100' ? "Credited directly via NEFT/PFMS" : "Awaiting clearance",
      descHi: parcel.dbtStatus === 'DISBURSED_100' ? "सीधे बैंक खाते में जमा" : "समाशोधन प्रतीक्षित",
      done: parcel.dbtStatus === 'DISBURSED_100',
      date: parcel.dbtDate || "08 Sep 2026"
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "पारदर्शी मुआवजा विवरण एवं डीबीटी ट्रैकर" : "TRANSPARENT COMPENSATION BREAKDOWN & DBT TRACKER"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "RFCTLARR अधिनियम 2013 के अनुसार 100% तोषणा (Solatium) एवं ग्रामीण गुणांक सहित पूर्ण विधिक गणना।"
                : "Audited statutory solatium breakdown under RFCTLARR Act 2013 and real-time PFMS bank payout tracking."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExplanationModal(true)}
          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-amber-700" />
          <span>{isHi ? "मुआवजे की गणना कैसे की गई?" : "How was my compensation calculated?"}</span>
        </button>
      </div>

      {/* Main Grid: Left Breakdown (7 cols), Right DBT Stepper (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Line-Item Compensation Breakdown */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                {isHi ? "वैधानिक गणना विवरणी" : "STATUTORY AWARD SCHEDULE (SEC 3G)"}
              </span>
              <h3 className="text-base font-black text-slate-900">
                {isHi ? "मुआवजा गणना विवरण" : "Itemized Compensation Breakdown"}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">{isHi ? "कुल निर्धारित मुआवजा" : "Total Determined Award"}</span>
              <span className="text-xl font-black font-mono text-emerald-700">{formatINR(totalAward)}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2 text-xs">
            {/* Item 1: Base Land Value */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{isHi ? "1. आधार भूमि मूल्य (सर्किल दर)" : "1. Base Market Land Value"}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {parcel.areaHectares} Ha × {formatINR(baseRate)} / Ha (Circle Rate)
                </p>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatINR(compData.baseLandValue)}
              </span>
            </div>

            {/* Item 2: Rural Multiplier Factor */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{isHi ? "2. ग्रामीण दूरी गुणांक कारक" : "2. Rural Multiplier Factor (1.5x)"}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHi ? "शहरी सीमा से 10-20 किमी दूरी हेतु 1.5x का गुणक" : "RFCTLARR 2013 First Schedule (Distance > 10 km from urban limits)"}
                </p>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                +{formatINR(compData.multipliedLandValue - compData.baseLandValue)}
              </span>
            </div>

            {/* Item 3: Assets on Land (Structures & Trees) */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{isHi ? "3. परिसंपत्तियां (वृक्ष एवं संरचनाएं)" : "3. Land Assets (Trees, Wells, Structures)"}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  14 mature timber trees + 1 tubewell evaluated by Horticulture Dept
                </p>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatINR(compData.structureAssetsValue + compData.treeCropAssetsValue)}
              </span>
            </div>

            {/* Item 4: Statutory 100% Solatium */}
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <p className="font-bold text-emerald-900">{isHi ? "4. अनिवार्य तोषणा (100% Solatium)" : "4. Compulsory Solatium (100%)"}</p>
                  <span className="text-[9px] font-black uppercase bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">
                    LARR 2013 SEC 30
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  {isHi ? "मूल भूमि एवं परिसंपत्ति मूल्य के समतुल्य 100% अनिवार्य अतिरिक्त राहत" : "Mandatory 100% statutory allowance added on basic compensation"}
                </p>
              </div>
              <span className="font-mono font-black text-emerald-800 text-sm">
                +{formatINR(compData.solatium)}
              </span>
            </div>

            {/* Item 5: Additional 12% Interest */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{isHi ? "5. 12% प्रति वर्ष अतिरिक्त ब्याज राशि" : "5. 12% Per Annum Additional Interest"}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHi ? "धारा 3A अधिसूचना से निर्णय तक 6 माह का ब्याज" : "Computed from Sec 3A notification date to date of award (6 months)"}
                </p>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                +{formatINR(compData.interestAmount)}
              </span>
            </div>
          </div>

          {/* Total Grand Summary Box */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                {isHi ? "अंतिम निर्धारित मुआवजा राशि" : "FINAL STATUTORY SOLATIUM AWARD"}
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                {isHi ? "समस्त विधिक कटौती एवं ब्याज समायोजन उपरांत" : "Including 100% Solatium, Multiplier & Statutory Interest"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-emerald-400">{formatINR(totalAward)}</span>
              <span className="text-[10px] text-slate-400 block font-mono">({compData.formattedAwardCrores})</span>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Benefit Transfer (DBT) Tracker */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PFMS / e-Kuber Payout
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                {isHi ? "डीबीटी बैंक भुगतान ट्रैकर" : "Direct Benefit Transfer (DBT) Tracker"}
              </h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {/* Bank Account Verification Badge */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{isHi ? "सत्यापित बैंक खाता" : "Verified Bank Account"}</span>
              <span className="text-emerald-700 font-bold flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PFMS Verified</span>
              </span>
            </div>
            <div className="font-mono text-slate-900 font-bold">
              {parcel.bankName}
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>IFSC: <strong>{parcel.ifsc}</strong></span>
              <span>A/C: <strong>XXXX-XXXX-4921</strong></span>
            </div>
          </div>

          {/* 4-Stage Stepper */}
          <div className="space-y-4 pt-1">
            {dbtStages.map((st, i) => (
              <div key={st.id} className="flex items-start space-x-3 text-xs relative">
                {/* Connecting bar */}
                {i !== dbtStages.length - 1 && (
                  <div className={`absolute left-3.5 top-6 w-0.5 h-8 ${st.done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}

                <div className="relative z-10 shrink-0">
                  {st.done ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                      {st.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className={`font-black ${st.done ? 'text-slate-900' : 'text-slate-500'}`}>
                      {isHi ? st.titleHi : st.title}
                    </h5>
                    <span className="text-[10px] font-mono text-slate-500">{st.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono truncate">{isHi ? st.descHi : st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ref Txn details */}
          {parcel.dbtTransactionId && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-emerald-800">
                <span>{isHi ? "यूटीआर / लेनदेन संदर्भ संख्या" : "UTR / Transaction Ref"}</span>
                <span className="font-bold">{parcel.dbtDate}</span>
              </div>
              <p className="font-mono font-black text-emerald-950 text-sm">
                {parcel.dbtTransactionId}
              </p>
            </div>
          )}

          {/* Quick Grievance Link */}
          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('grievances')}
              className="w-full text-center text-xs text-amber-800 hover:text-amber-900 font-bold hover:underline cursor-pointer"
            >
              {isHi ? "मुआवजा राशि या बैंक खाते से संबंधित समस्या? शिकायत दर्ज करें →" : "Dispute in valuation or delayed bank credit? File Grievance →"}
            </button>
          </div>
        </div>

      </div>

      {/* Explanation Modal: How was compensation calculated? */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-sm">
                  {isHi ? "मुआवजे की गणना कैसे की गई? (RFCTLARR अधिनियम 2013 विधिक सूत्र)" : "How Was My Compensation Calculated? (LARR 2013 Formula)"}
                </h4>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <p className="font-bold text-amber-950">
                  {isHi 
                    ? "भारत सरकार के 'उचित प्रतिकर एवं पारदर्शिता का अधिकार अधिनियम (RFCTLARR 2013)' के तहत सभी गणनाएं पूर्णतः पारदर्शी और स्वचालित हैं।"
                    : "Under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, compensation is legally calculated in 4 distinct steps:"}
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-1">
                <h5 className="font-black text-slate-900 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">1</span>
                  <span>{isHi ? "कदम 1: सर्किल दर एवं आधार भूमि मूल्य निर्धारण" : "Step 1: Base Market Value Determination (Sec 26)"}</span>
                </h5>
                <p className="pl-6 text-slate-600 leading-relaxed">
                  The Competent Authority assesses the average registered sale deeds of similar land in the vicinity or the State Revenue circle rate (whichever is higher).
                  Formula: <code>Acquired Area (Ha) × Circle Rate per Ha</code>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-1">
                <h5 className="font-black text-slate-900 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">2</span>
                  <span>{isHi ? "कदम 2: ग्रामीण दूरी गुणांक कारक (1.25x – 2.0x)" : "Step 2: Rural Multiplier Factor (First Schedule)"}</span>
                </h5>
                <p className="pl-6 text-slate-600 leading-relaxed">
                  For agricultural rural land, the base market value is multiplied by a statutory factor based on distance from the nearest municipal boundary (1.25x for 0-10km, 1.5x for 10-30km, and 2.0x for beyond 30km).
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-1">
                <h5 className="font-black text-slate-900 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">3</span>
                  <span>{isHi ? "कदम 3: 100% अनिवार्य तोषणा (Solatium under Sec 30)" : "Step 3: Compulsory 100% Solatium (Section 30)"}</span>
                </h5>
                <p className="pl-6 text-slate-600 leading-relaxed">
                  The law mandates an additional 100% statutory allowance (Solatium) over the total value of multiplied land plus any attached immovable assets (buildings, trees, wells).
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-1">
                <h5 className="font-black text-slate-900 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">4</span>
                  <span>{isHi ? "कदम 4: 12% प्रति वर्ष अतिरिक्त ब्याज राशि" : "Step 4: Additional 12% Annual Interest (Section 30(2))"}</span>
                </h5>
                <p className="pl-6 text-slate-600 leading-relaxed">
                  An additional 12% per annum interest is paid on the basic land value from the date of Section 3A publication until the award is officially pronounced.
                </p>
              </div>

              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-800">
                <strong>Statutory Formula:</strong><br />
                <code>Total Award = (Base Land Value × Multiplier + Assets) × 2.0 (Solatium 100%) + 12% Annual Interest</code>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
              >
                Understood / Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
