import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  CheckCircle2, 
  XCircle, 
  FileJson,
  Building,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { DATA_PRIVACY_MATRIX } from './citizenData';

export default function PrivacyConsentCenter({ parcel, lang = 'en' }) {
  const isHi = lang === 'hi';
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadData = () => {
    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      governanceFramework: "Digital Personal Data Protection Act (DPDPA 2023) & DILRMP",
      landownerRecord: {
        name: parcel.ownerName,
        aadhaarMasked: parcel.aadhaarMasked,
        bankAccountVerified: parcel.bankAccountVerified,
        bankName: parcel.bankName,
        ifsc: parcel.ifsc
      },
      parcelRecord: {
        ulpin: parcel.ulpin,
        surveyNo: parcel.surveyNo,
        khataNo: parcel.khataNo,
        areaHectares: parcel.areaHectares,
        village: parcel.village,
        district: parcel.district,
        state: parcel.state,
        status: parcel.status,
        coordinates: parcel.coordinates
      },
      compensationRecord: {
        totalAwardAmount: parcel.totalAwardAmount,
        solatiumAmount: parcel.solatiumAmount,
        dbtStatus: parcel.dbtStatus,
        dbtTransactionId: parcel.dbtTransactionId,
        dbtDate: parcel.dbtDate
      },
      statutoryAccessLog: [
        { authority: "Office of District Collector, Gurugram", purpose: "Section 3G Award Determination", date: "2026-08-15" },
        { authority: "PFMS Central Treasury Cell", purpose: "Direct Benefit Transfer Bank Clearance", date: "2026-09-08" },
        { authority: "Survey of India", purpose: "Bhu-Aadhaar ULPIN Drone Verification", date: "2026-08-28" }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BhuSetu_PersonalData_${parcel.ulpin}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "गोपनीयता एवं डेटा सुरक्षा केंद्र" : "PRIVACY, CONSENT & DATA PROTECTION CENTER"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDPA 2023) के अनुसार आपकी जानकारी का पारदर्शी नियंत्रण एवं ऑडिट ट्रेल।"
                : "Transparent disclosure of who can access your land, banking, and legal data under the Digital Personal Data Protection Act."}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadData}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors cursor-pointer shadow-xs"
        >
          <FileJson className="w-4 h-4 text-teal-400" />
          <span>{isHi ? "मेरा संपूर्ण डेटा डाउनलोड करें (JSON)" : "Download My Data (JSON)"}</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-900 flex items-center space-x-3 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">{isHi ? "डेटा सफलतापूर्वक निर्यात किया गया!" : "Personal Data Exported Successfully!"}</p>
            <p className="text-emerald-800">
              {isHi 
                ? "आपकी भूमि, मुआवजा एवं विधिक ऑडिट लॉग की JSON फ़ाइल डाउनलोड हो चुकी है।"
                : "A machine-readable export of your land, financial, and access log records has been saved."}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Data Access Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Role-Based Access Control (RBAC)
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1">
              {isHi ? "आपकी जानकारी तक किसकी पहुंच है?" : "Who Can Access Your Data?"}
            </h3>
          </div>

          <div className="flex items-center space-x-3 text-xs font-medium">
            <span className="flex items-center space-x-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHi ? "अधिकृत पहुंच" : "Authorized"}</span>
            </span>
            <span className="flex items-center space-x-1 text-rose-600">
              <XCircle className="w-4 h-4" />
              <span>{isHi ? "प्रतिबंधित / शून्य पहुंच" : "Restricted (No Access)"}</span>
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">{isHi ? "डेटा श्रेणी" : "Data Record Type"}</th>
                <th className="py-3 px-3 text-center">{isHi ? "जिला अधिकारी (LAO)" : "District Officer"}</th>
                <th className="py-3 px-3 text-center">{isHi ? "वित्त / पीएफएमएस" : "Finance Officer"}</th>
                <th className="py-3 px-3 text-center">{isHi ? "कानूनी अधिकारी" : "Legal Officer"}</th>
                <th className="py-3 px-3 text-center">{isHi ? "सामान्य जनता" : "General Public"}</th>
                <th className="py-3 px-4">{isHi ? "विधिक आधार" : "Statutory Basis"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {DATA_PRIVACY_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {isHi ? row.recordTypeHi : row.recordType}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.districtOfficer ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 inline" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.financeOfficer ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 inline" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.legalOfficer ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 inline" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.publicAccess ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 inline" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {row.statutoryBasis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Disclosures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>{isHi ? "एन्क्रिप्शन एवं डेटा सुरक्षा" : "End-to-End Encryption & Security"}</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {isHi 
                ? "सभी बैंक एवं आधार डेटा AES-256 बिट एन्क्रिप्शन के साथ सुरक्षित रखे जाते हैं और किसी भी वाणिज्यिक तीसरे पक्ष के साथ साझा नहीं किए जाते।"
                : "All personal identifiers, bank account numbers, and Aadhaar linkages are tokenized and stored using AES-256 encryption."}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="font-bold text-slate-900 flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4 text-teal-600" />
              <span>{isHi ? "अपरिवर्तनीय ऑडिट ट्रेल" : "Immutable Audit Trail"}</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {isHi 
                ? "जब भी कोई सरकारी अधिकारी आपके रिकॉर्ड को देखता है या उसमें संशोधन करता है, तो समय-मुहर सहित ऑडिट लॉग दर्ज किया जाता है।"
                : "Every view or document access by an officer generates a tamper-evident audit log with cryptographic timestamps."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
