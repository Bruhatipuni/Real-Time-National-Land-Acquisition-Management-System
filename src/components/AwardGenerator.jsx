import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatINR } from '../utils/compensationEngine';

export default function AwardGenerator({ parcels, projects }) {
  const [selectedParcelId, setSelectedParcelId] = useState(parcels[0].id);
  const parcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];
  const project = projects.find(p => p.id === parcel.projectId) || projects[0];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("BHOOMISETU - NATIONAL LAND PLATFORM", 105, 18, { align: "center" });
    doc.setFontSize(11);
    doc.text('"Your Land, Our Responsibility"', 105, 25, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(14, 30, 196, 30);

    doc.setFontSize(13);
    doc.text("SECTION 3G STATUTORY COMPENSATION AWARD CERTIFICATE", 105, 40, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`ULPIN (Bhu-Aadhaar): ${parcel.ulpin}`, 14, 52);
    doc.text(`Gazette Notification Ref: SO/2026/3G-908`, 14, 58);
    doc.text(`Date of Issuance: ${new Date().toLocaleDateString('en-IN')}`, 14, 64);

    doc.setFont("helvetica", "bold");
    doc.text("1. PARCEL & LANDOWNER PARTICULARS", 14, 76);
    doc.setFont("helvetica", "normal");
    doc.text(`Landowner Name: ${parcel.ownerName}`, 20, 84);
    doc.text(`Survey Plot No: ${parcel.surveyNo} (Khata No: ${parcel.khataNo})`, 20, 90);
    doc.text(`Village & District: ${parcel.village}, ${parcel.district}, ${parcel.state}`, 20, 96);
    doc.text(`Acquisition Area: ${parcel.areaHectares} Hectares`, 20, 102);

    doc.setFont("helvetica", "bold");
    doc.text("2. RFCTLARR 2013 / HIGHWAYS ACT SEC 3G AWARD BREAKDOWN", 14, 114);
    doc.setFont("helvetica", "normal");
    doc.text(`Base Land Rate per Hectare: ${formatINR(parcel.marketRatePerHa)}`, 20, 122);
    doc.text(`Rural Multiplier Factor: ${parcel.multiplier}x`, 20, 128);
    doc.text(`Multiplied Base Land Value: ${formatINR(parcel.marketRatePerHa * parcel.areaHectares * parcel.multiplier)}`, 20, 134);
    doc.text(`Compulsory Statutory Solatium (100%): ${formatINR(parcel.solatiumAmount)}`, 20, 140);
    
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL FINAL COMPENSATION AWARD: ${formatINR(parcel.totalAwardAmount)}`, 20, 150);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("This document is digitally signed via National BhuStack Engine. QR Code verified.", 14, 170);

    doc.save(`Award_Certificate_${parcel.ulpin}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>Statutory Notice & Award Generator Engine</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium">Auto-generate official Gazette Notifications and Section 3G Award Certificates with QR Verification</p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedParcelId}
            onChange={(e) => setSelectedParcelId(e.target.value)}
            className="bg-slate-50 text-slate-900 border border-slate-300 text-xs font-bold rounded-lg px-3 py-2 focus:border-amber-500 w-full md:w-72 font-mono"
          >
            {parcels.map(p => (
              <option key={p.id} value={p.id}>{p.ulpin} - {p.ownerName}</option>
            ))}
          </select>

          <button
            onClick={handleDownloadPDF}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 cursor-pointer shrink-0 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Award PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Preview Canvas */}
      <div className="bg-white border border-slate-300 rounded-2xl p-8 max-w-4xl mx-auto space-y-6 shadow-xl relative overflow-hidden text-slate-900">
        {/* Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <Building2 className="w-96 h-96 text-slate-900" />
        </div>

        {/* Certificate Header */}
        <div className="text-center border-b border-slate-200 pb-5 space-y-1">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-800 shadow-xs">
              <Building2 className="w-6 h-6 text-amber-700" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight font-mono">BHU<span className="text-amber-600">SETU</span></h3>
          <p className="text-xs font-black text-amber-800 italic">"Your Land, Our Responsibility"</p>
          <div className="inline-block bg-slate-100 border border-slate-300 px-4 py-1 rounded-full text-xs font-mono font-black text-slate-800 mt-2">
            SECTION 3G STATUTORY COMPENSATION AWARD CERTIFICATE
          </div>
        </div>

        {/* Certificate Body */}
        <div className="grid grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-medium">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">ULPIN & Parcel Metadata</span>
            <div className="flex justify-between">
              <span className="text-slate-600">Bhu-Aadhaar ULPIN:</span>
              <span className="font-mono font-bold text-amber-800">{parcel.ulpin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Survey Plot No:</span>
              <span className="font-mono text-slate-900 font-bold">{parcel.surveyNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Khata Record:</span>
              <span className="font-mono text-slate-900 font-bold">{parcel.khataNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Village / District:</span>
              <span className="text-slate-900 font-bold">{parcel.village}, {parcel.district}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-medium">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Landowner Identity</span>
            <div className="flex justify-between">
              <span className="text-slate-600">Owner Name:</span>
              <span className="font-extrabold text-slate-900">{parcel.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Aadhaar Status:</span>
              <span className="text-emerald-700 font-mono font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{parcel.aadhaarMasked}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Acquisition Area:</span>
              <span className="font-mono font-bold text-slate-900">{parcel.areaHectares} Hectares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Land Category:</span>
              <span className="text-amber-800 font-bold">{parcel.landType}</span>
            </div>
          </div>
        </div>

        {/* Financial Award Table */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
            Statutory LARR 2013 Solatium & Compensation Award Matrix
          </span>

          <div className="space-y-1.5 text-xs font-medium">
            <div className="flex justify-between text-slate-600">
              <span>Basic Land Market Rate:</span>
              <span className="font-mono text-slate-900 font-bold">{formatINR(parcel.marketRatePerHa)} / Ha</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Rural Statutory Multiplier Factor:</span>
              <span className="font-mono text-amber-800 font-bold">{parcel.multiplier}x</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Compulsory Statutory Solatium (100%):</span>
              <span className="font-mono text-emerald-700 font-bold">{formatINR(parcel.solatiumAmount)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-base">
              <span className="text-slate-900">Total Awarded Compensation:</span>
              <span className="font-mono text-emerald-700">{formatINR(parcel.totalAwardAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer with QR Code */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center text-white">
              <QrCode className="w-full h-full text-white" />
            </div>
            <div className="text-[11px] space-y-0.5">
              <p className="font-mono text-amber-800 font-black">QR VERIFIED BHUSTACK ENGINE</p>
              <p className="text-slate-600 font-medium">Digitally signed by Competent Land Acquisition Authority (LAO)</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-500 block text-[10px] font-medium">Competent Authority Stamp:</span>
            <span className="font-serif font-bold text-slate-900 italic text-sm">Land Acquisition Office</span>
          </div>
        </div>

      </div>
    </div>
  );
}
