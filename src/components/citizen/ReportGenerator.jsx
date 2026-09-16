import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Printer, 
  CheckCircle2, 
  Calendar,
  Building2,
  FileText,
  IndianRupee,
  Share2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatINR } from '../../utils/compensationEngine';

export default function ReportGenerator({ parcel, lang = 'en' }) {
  const isHi = lang === 'hi';
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const generatePDF = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryColor = [15, 23, 42]; // slate-900
      const accentColor = [5, 150, 105]; // emerald-600
      const amberColor = [217, 119, 6]; // amber-600

      // 1. Top Header Banner
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("BHOOMI SETU - NATIONAL LAND ACQUISITION SYSTEM", 105, 12, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(245, 158, 11);
      doc.text("MINISTRY OF RURAL DEVELOPMENT & NATIONAL HIGHWAYS AUTHORITY OF INDIA", 105, 18, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text("OFFICIAL LANDOWNER DOSSIER & STATUTORY AUDIT REPORT", 105, 24, { align: 'center' });

      // Verification Bar
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 38, 182, 10, 'F');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.text(`REPORT ISSUED: ${currentDate}`, 20, 44);
      doc.text(`VERIFICATION HASH: 0x8F91A...K9X2A4`, 120, 44);

      // Section 1: Landowner & Bhu-Aadhaar Identification
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text("1. LANDOWNER & BHU-AADHAAR (ULPIN) PROFILE", 14, 56);
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 58, 196, 58);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);

      doc.text("Registered Landowner:", 14, 66);
      doc.setFont('helvetica', 'bold');
      doc.text(parcel.ownerName || "Rameshwar Singh Yadav", 60, 66);

      doc.setFont('helvetica', 'normal');
      doc.text("Aadhaar Reference:", 120, 66);
      doc.setFont('helvetica', 'bold');
      doc.text(parcel.aadhaarMasked || "XXXX-XXXX-8921", 160, 66);

      doc.setFont('helvetica', 'normal');
      doc.text("Bhu-Aadhaar (ULPIN):", 14, 74);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...amberColor);
      doc.text(parcel.ulpin, 60, 74);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.text("Survey Plot & Khata:", 120, 74);
      doc.setFont('helvetica', 'bold');
      doc.text(`Plot ${parcel.surveyNo} (${parcel.khataNo})`, 160, 74);

      doc.setFont('helvetica', 'normal');
      doc.text("Acquired Area:", 14, 82);
      doc.setFont('helvetica', 'bold');
      doc.text(`${parcel.areaHectares} Hectares (${(parcel.areaHectares * 2.471).toFixed(2)} Acres)`, 60, 82);

      doc.setFont('helvetica', 'normal');
      doc.text("Village & Tehsil:", 120, 82);
      doc.setFont('helvetica', 'bold');
      doc.text(`${parcel.village}, Tehsil Sohna`, 160, 82);

      doc.setFont('helvetica', 'normal');
      doc.text("District & State:", 14, 90);
      doc.setFont('helvetica', 'bold');
      doc.text(`${parcel.district}, ${parcel.state}`, 60, 90);

      doc.setFont('helvetica', 'normal');
      doc.text("Land Classification:", 120, 90);
      doc.setFont('helvetica', 'bold');
      doc.text(parcel.landType.replace(/_/g, ' '), 160, 90);

      // Section 2: Acquisition Lifecycle Status
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text("2. STATUTORY ACQUISITION MILESTONES & STATUS", 14, 102);
      doc.line(14, 104, 196, 104);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);

      doc.text("Current Stage:", 14, 112);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentColor);
      doc.text(parcel.status.replace(/_/g, ' '), 60, 112);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.text("National Project:", 120, 112);
      doc.setFont('helvetica', 'bold');
      doc.text(parcel.projectId, 160, 112);

      doc.setFont('helvetica', 'normal');
      doc.text("Gazette Notification (Sec 3A):", 14, 120);
      doc.text("SO-1048(E) Published 10 May 2026", 60, 120);

      doc.text("Declaration of Vesting (Sec 3D):", 120, 120);
      doc.text("SO-1492(E) Published 18 July 2026", 160, 120);

      doc.text("Section 3G Solatium Award:", 14, 128);
      doc.text("Finalized 15 Aug 2026 by LAO Gurugram", 60, 128);

      doc.text("Handover & Possession (Sec 3E):", 120, 128);
      doc.text("Completed 08 Sep 2026", 160, 128);

      // Section 3: Compensation & Financial Payout Breakdown
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text("3. STATUTORY SOLATIUM COMPENSATION BREAKDOWN (RFCTLARR 2013)", 14, 140);
      doc.line(14, 142, 196, 142);

      // Financial box
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 146, 182, 34, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, 146, 182, 34, 'S');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);

      doc.text("Base Land Value (Circle Rate):", 20, 153);
      doc.text("Rural Multiplier Factor:", 115, 153);

      doc.text("Compulsory 100% Solatium (Sec 30):", 20, 161);
      doc.text("Additional 12% Annual Interest:", 115, 161);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(formatINR(parcel.marketRatePerHa * parcel.areaHectares), 75, 153);
      doc.text("1.5x (Rural Distance)", 165, 153);
      doc.text(formatINR(parcel.solatiumAmount || 12487500), 75, 161);
      doc.text(formatINR(945000), 165, 161);

      doc.setFillColor(236, 253, 245);
      doc.rect(14, 168, 182, 12, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentColor);
      doc.text("TOTAL STATUTORY SOLATIUM AWARD:", 20, 175);
      doc.text(formatINR(parcel.totalAwardAmount), 160, 175);

      // Section 4: DBT Payout & Bank Verification
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text("4. DIRECT BENEFIT TRANSFER (DBT) RECONCILIATION", 14, 188);
      doc.line(14, 190, 196, 190);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);

      doc.text("Beneficiary Bank Name:", 14, 198);
      doc.setFont('helvetica', 'bold');
      doc.text(parcel.bankName, 60, 198);

      doc.setFont('helvetica', 'normal');
      doc.text("Bank IFSC Code:", 120, 198);
      doc.setFont('helvetica', 'bold');
      doc.text(parcel.ifsc, 160, 198);

      doc.setFont('helvetica', 'normal');
      doc.text("DBT Payout Status:", 14, 206);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentColor);
      doc.text(parcel.dbtStatus === 'DISBURSED_100' ? "100% DISBURSED & CREDITED" : "PENDING", 60, 206);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.text("PFMS Transaction Ref ID:", 120, 206);
      doc.setFont('helvetica', 'bold');
      doc.text(parcel.dbtTransactionId || "DBT2026091299841", 160, 206);

      // Section 5: Legal Disclosures & Security Seal
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text("5. LEGAL DISCLOSURES & DIGITAL AUDIT TRAIL", 14, 218);
      doc.line(14, 220, 196, 220);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Dispute Status:", 14, 228);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("Case Under Review (Hearing scheduled 28 Sep 2026 before CALA)", 50, 228);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Documents Vault:", 14, 235);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("5 Official Certified Documents Verified on Portal", 50, 235);

      // Digital Seal Box
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 245, 182, 30, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 245, 182, 30, 'S');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text("GOVERNMENT OF INDIA - DIGITAL RECORD INTEGRITY", 20, 252);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("This document is generated automatically from the Bhoomi Setu National Land Records Ledger.", 20, 258);
      doc.text("Any alteration or tampering is punishable under the Information Technology Act 2000.", 20, 263);
      doc.text("QR Verification Code: [BHOOMI-SETU-VERIFY-06-12-8891-K9X2A4]", 20, 269);

      doc.setFont('helvetica', 'bold');
      doc.text("Competent Authority (CALA)", 150, 269);

      // Footer
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Page 1 of 1 • Bhoomi Setu Land Acquisition Management System • Confidential Citizen Record", 105, 290, { align: 'center' });

      // Save PDF
      doc.save(`Bhoomi_Setu_LandReport_${parcel.ulpin}.pdf`);
      setIsGenerating(false);
      setGeneratedSuccess(true);
      setTimeout(() => setGeneratedSuccess(false), 4000);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating PDF report. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "नागरिक भूमि रिपोर्ट — एक-क्लिक आधिकारिक पीडीएफ" : "DOWNLOAD OFFICIAL LANDOWNER REPORT"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "भू-आधार, वैधानिक मुआवजा, बैंक भुगतान और विधिक स्थिति का पूर्ण आधिकारिक रिकॉर्ड एक ही पीडीएफ दस्तावेज़ में प्राप्त करें।"
                : "Instant, one-click downloadable PDF report compiling your ULPIN, compensation award, DBT receipt, and verification QR."}
            </p>
          </div>
        </div>

        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? (isHi ? "पीडीएफ तैयार हो रही है..." : "Generating Dossier...") : (isHi ? "संपूर्ण भूमि रिपोर्ट डाउनलोड करें (PDF)" : "Download Complete Land Report")}</span>
        </button>
      </div>

      {generatedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-900 flex items-center space-x-3 font-medium">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">{isHi ? "भूमि रिपोर्ट सफलतापूर्वक डाउनलोड की गई!" : "Landowner Report Downloaded Successfully!"}</p>
            <p className="text-emerald-800">
              {isHi 
                ? `फ़ाइल Bhoomi_Setu_LandReport_${parcel.ulpin}.pdf आपके डिवाइस पर सुरक्षित कर ली गई है।`
                : `File Bhoomi_Setu_LandReport_${parcel.ulpin}.pdf has been saved to your downloads with digital verification seal.`}
            </p>
          </div>
        </div>
      )}

      {/* On-Screen Document Preview Card */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto space-y-6">
        
        {/* Header Preview */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black font-mono text-[10px] text-center shadow-sm leading-tight p-1">
              BHOOMI SETU
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-mono tracking-tight">
                BHOOMI SETU — NATIONAL LAND ACQUISITION DOSSIER
              </h3>
              <p className="text-[10px] font-mono text-amber-800 font-bold uppercase">
                Digital India Land Records Modernization Programme (DILRMP)
              </p>
            </div>
          </div>

          <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-center sm:text-right">
            <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">Official Verification Seal</span>
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-700 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DIGITALLY SIGNED</span>
            </div>
          </div>
        </div>

        {/* Data Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isHi ? "भू-स्वामी" : "Landowner"}</span>
            <p className="font-extrabold text-slate-900 text-sm">{parcel.ownerName}</p>
            <p className="text-[10px] text-slate-500 font-mono">Aadhaar: {parcel.aadhaarMasked}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">ULPIN Bhu-Aadhaar</span>
            <p className="font-mono font-black text-amber-900 text-sm">{parcel.ulpin}</p>
            <p className="text-[10px] text-slate-500 font-mono">14-Digit Standard ID</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isHi ? "खसरा / सर्वे प्लॉट" : "Survey Number"}</span>
            <p className="font-mono font-bold text-slate-900 text-sm">Plot {parcel.surveyNo} ({parcel.khataNo})</p>
            <p className="text-[10px] text-slate-500">{parcel.village}, {parcel.district}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isHi ? "अधिग्रहित क्षेत्रफल" : "Acquired Area"}</span>
            <p className="font-black text-slate-900 text-sm">{parcel.areaHectares} Hectares</p>
            <p className="text-[10px] text-slate-500">({(parcel.areaHectares * 2.471).toFixed(2)} Acres)</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isHi ? "अधिग्रहण स्थिति" : "Acquisition Status"}</span>
            <p className="font-bold text-emerald-800 text-xs">{parcel.status.replace(/_/g, ' ')}</p>
            <p className="text-[10px] text-slate-500 font-mono">Milestone: 8 / 9 Handover</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isHi ? "कुल मुआवजा" : "Total Compensation"}</span>
            <p className="font-mono font-black text-emerald-700 text-sm">{formatINR(parcel.totalAwardAmount)}</p>
            <p className="text-[10px] text-emerald-800 font-bold">100% Solatium Included</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">DBT Disbursement</span>
            <p className="font-bold text-emerald-800 text-xs">100% Credited to Bank</p>
            <p className="text-[10px] font-mono text-slate-500">Ref: {parcel.dbtTransactionId || "DBT2026091299841"}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isHi ? "कानूनी स्थिति" : "Legal Dispute Status"}</span>
            <p className="font-bold text-amber-900 text-xs">Hearing Scheduled (28 Sep 2026)</p>
            <p className="text-[10px] text-slate-500 font-mono">Case: CASE-2026-GGM-102</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isHi ? "सत्यापित दस्तावेज़" : "Document Vault"}</span>
            <p className="font-bold text-slate-900 text-xs">5 Certified Files</p>
            <p className="text-[10px] text-slate-500 font-mono">Gazette, Award, DBT Receipt</p>
          </div>

        </div>

        {/* QR Verification Mockup Footer */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1 shrink-0">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">{isHi ? "डिजिटल क्यूआर सत्यापन कोड" : "Official QR Verification Code"}</span>
              <p className="text-[11px] text-slate-500 leading-snug">
                {isHi 
                  ? "इस क्यूआर कोड को किसी भी स्मार्टफ़ोन से स्कैन कर सीधे राष्ट्रीय भू-अभिलेख पोर्टल पर प्रामाणिकता जांची जा सकती है।"
                  : "Scan with any government mobile app or browser to instantly verify the cryptographic signature on Bhoomi Setu."}
              </p>
            </div>
          </div>

          <button
            onClick={generatePDF}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isHi ? "रिपोर्ट प्रिंट करें" : "Print Official PDF"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
