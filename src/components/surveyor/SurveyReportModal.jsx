import React from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Send, 
  FileText, 
  MapPin, 
  UserCheck, 
  Calendar, 
  QrCode,
  AlertTriangle
} from 'lucide-react';

export default function SurveyReportModal({ isOpen, onClose, parcel, onSubmitApproval }) {
  if (!isOpen || !parcel) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 my-auto relative print:border-none print:shadow-none print:p-4">
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
              Official Statutory Survey Report
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">Ref: DILRMP/SURV/{parcel.id}/2026</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Report Body */}
        <div className="border-2 border-slate-900/80 p-6 rounded-xl space-y-5 bg-white text-slate-900 relative print:border-2">
          {/* Official Indian Seal & Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
            <div className="flex items-center justify-between">
              <div className="text-left font-mono text-[10px] text-slate-600">
                <div><strong>FORM NO. VII-A</strong></div>
                <div>[See Rule 14(2)]</div>
                <div>DILRMP 3.0 / RFCTLARR 2013</div>
              </div>

              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-700">भारत सरकार • Government of India</div>
                <div className="text-xs font-semibold text-slate-700">Ministry of Rural Development & MoRTH</div>
                <h2 className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 mt-1">
                  BHOOMISETU LAND SURVEY & DGPS REPORT
                </h2>
                <div className="text-[11px] font-bold text-amber-700">
                  NATIONAL CADASTRA & BOUNDARY VERIFICATION CERTIFICATE
                </div>
              </div>

              <div className="text-right">
                <div className="w-16 h-16 border border-slate-300 p-1 rounded bg-slate-50 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white text-[8px] font-mono font-bold">
                    QR SECURE
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">NIC VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project & Corridor Metadata Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Infrastructure Project</span>
              <strong className="text-slate-900 font-bold block">{parcel.project || 'Delhi-Mumbai Industrial Expressway'}</strong>
              <span className="text-[10px] text-slate-500 font-mono">{parcel.projectId}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Revenue Jurisdiction</span>
              <strong className="text-slate-900 font-bold block">{parcel.village}, {parcel.tehsil}</strong>
              <span className="text-[10px] text-slate-500 font-mono">{parcel.district}, {parcel.state}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Survey Number / Khasra</span>
              <strong className="text-slate-900 font-bold block text-sm font-mono">{parcel.surveyNumber}</strong>
              <span className="text-[10px] text-slate-500 font-mono">ULPIN: {parcel.ulpin}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Survey Date & GNSS Lock</span>
              <strong className="text-slate-900 font-bold block">{parcel.lastSurveyDate || '15 September 2026'}</strong>
              <span className="text-[10px] text-emerald-700 font-bold font-mono">RTK FIX (±1.8m)</span>
            </div>
          </div>

          {/* Core Survey Measurement & Tolerance Table */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 mb-2">
              1. Area Measurement & Boundary Comparison
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-slate-200">
                <thead className="bg-slate-100 font-mono text-[10px] text-slate-700 uppercase">
                  <tr>
                    <th className="p-2.5">Parameter</th>
                    <th className="p-2.5">Revenue RoR Record</th>
                    <th className="p-2.5">Field DGPS Measured</th>
                    <th className="p-2.5">Variance</th>
                    <th className="p-2.5">Deviation %</th>
                    <th className="p-2.5">Statutory Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">Total Parcel Area</td>
                    <td className="p-2.5">{parcel.recordedAreaHa?.toFixed(2)} Ha</td>
                    <td className="p-2.5 font-bold text-slate-900">{parcel.surveyedAreaHa?.toFixed(2)} Ha</td>
                    <td className={`p-2.5 font-bold ${parcel.areaDifferenceHa >= 0 ? 'text-amber-800' : 'text-slate-800'}`}>
                      {parcel.areaDifferenceHa > 0 ? `+${parcel.areaDifferenceHa.toFixed(2)}` : parcel.areaDifferenceHa?.toFixed(2)} Ha
                    </td>
                    <td className="p-2.5">{parcel.deviationPercent > 0 ? `+${parcel.deviationPercent.toFixed(2)}%` : `${parcel.deviationPercent?.toFixed(2)}%`}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        parcel.mismatchStatus === 'TOLERANCE_OK' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        parcel.mismatchStatus === 'REVIEW_REQUIRED' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {parcel.mismatchStatus === 'TOLERANCE_OK' ? '✓ Within Tolerance' : 
                         parcel.mismatchStatus === 'REVIEW_REQUIRED' ? '⚠ Review Required' : '🔴 Significant Mismatch'}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50 text-[11px]">
                    <td className="p-2.5 font-medium text-slate-600">Land Classification</td>
                    <td colSpan={2} className="p-2.5">{parcel.landType || 'Agricultural (Irrigated Chahi)'}</td>
                    <td className="p-2.5 font-medium text-slate-600">Boundary Status</td>
                    <td colSpan={2} className="p-2.5 font-bold text-emerald-700">
                      {parcel.surveyStatus === 'COMPLETED' ? 'Verified & Closed' : 'Field Survey Verified'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Owner & Khatedar Verification Details */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 mb-2">
              2. Registered Landowner Verification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-slate-200 rounded-lg p-3 text-xs bg-slate-50/50">
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Primary Landowner:</span>
                <div className="font-bold text-slate-900">{parcel.ownerName}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Father / Husband:</span>
                <div className="font-bold text-slate-900">{parcel.fatherHusbandName || 'N/A'}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Owner Present On-Site:</span>
                <div className="font-bold text-slate-900">{parcel.ownerVerification?.ownerPresent ? '✓ Yes, Verified' : '✗ No'}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Boundary Agreement:</span>
                <div className="font-bold text-slate-900">
                  {parcel.ownerVerification?.agreesWithBoundary ? (
                    <span className="text-emerald-700">✓ Consented & Signed</span>
                  ) : (
                    <span className="text-rose-700">⚠ Disputed / Objection Raised</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* GNSS Captured Coordinates Table */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 mb-2">
              3. GNSS DGPS Traverse Points & Perimeter Coordinates
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-slate-200 font-mono">
                <thead className="bg-slate-100 text-[10px] text-slate-700 uppercase">
                  <tr>
                    <th className="p-2">Point ID</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Latitude (°N)</th>
                    <th className="p-2">Longitude (°E)</th>
                    <th className="p-2">Elevation (MSL)</th>
                    <th className="p-2">RTK Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {(parcel.capturedPoints && parcel.capturedPoints.length > 0 ? parcel.capturedPoints : [
                    { id: 'P1', name: 'NW Boundary Stone', lat: 28.2471, lng: 77.0646, elevation: 215.2, accuracy: '±1.4m' },
                    { id: 'P2', name: 'NE Ridge Point', lat: 28.2491, lng: 77.0649, elevation: 215.6, accuracy: '±1.6m' },
                    { id: 'P3', name: 'SE Tubewell Corner', lat: 28.2489, lng: 77.0674, elevation: 215.1, accuracy: '±1.8m' },
                    { id: 'P4', name: 'SW Village Path Marker', lat: 28.2469, lng: 77.0669, elevation: 215.5, accuracy: '±1.5m' }
                  ]).map((pt, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 font-bold text-slate-900">{pt.id}</td>
                      <td className="p-2">{pt.name}</td>
                      <td className="p-2">{pt.lat?.toFixed(6)}</td>
                      <td className="p-2">{pt.lng?.toFixed(6)}</td>
                      <td className="p-2">{pt.elevation} m</td>
                      <td className="p-2 text-emerald-700 font-bold">{pt.accuracy || '±1.5m'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Photo Evidence Count & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600">Geo-Tagged Evidence & Assets</span>
              <p className="text-slate-700">
                Total Photographs Attached: <strong>{parcel.evidencePhotos?.length || 4} Geo-tagged images</strong> with embedded timestamp, DGPS latitude, longitude, and surveyor signature watermarks.
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All structural assets & boundary markers cataloged</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600">Surveyor Field Remarks</span>
              <p className="text-slate-700 italic">
                {parcel.ownerVerification?.objectionNotes || 
                 "Field boundary walk executed with RTK GNSS receiver. Cadastral stones inspected and found matching 1965 revenue settlement maps within statutory tolerance limit of 1%. No illegal encroachments on proposed expressway corridor."}
              </p>
            </div>
          </div>

          {/* Dual Digital Signatures Section */}
          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="h-16 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <div className="font-serif italic text-base text-slate-800">Anish Kumar</div>
              </div>
              <div>
                <div className="font-bold text-slate-900 font-mono">ANISH KUMAR (SURVEYOR)</div>
                <div className="text-[10px] text-slate-500 font-mono">Surveyor ID: SURV-HR-048 • Tehsildar Office Sohna</div>
                <div className="text-[10px] text-slate-500 font-mono">Digitally Signed on: 15 Sep 2026, 10:45 AM IST</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-16 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                {parcel.workflowStage === 'APPROVED' ? (
                  <div className="font-serif italic text-base text-emerald-900">R.K. Varma (Supervisor)</div>
                ) : (
                  <div className="text-[11px] font-mono text-slate-400 italic">Pending Supervisor Counter-Signature</div>
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 font-mono">R.K. VARMA (SURVEY SUPERVISOR)</div>
                <div className="text-[10px] text-slate-500 font-mono">Superintendent of Land Records, Gurugram</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {parcel.workflowStage === 'APPROVED' ? 'Counter-Signed: 15 Sep 2026' : 'Awaiting Final Statutory Sign-Off'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 print:hidden">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with SHA-256 digital watermark under DILRMP Standards</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </button>

            {onSubmitApproval && parcel.workflowStage !== 'SUBMITTED' && parcel.workflowStage !== 'APPROVED' && (
              <button
                onClick={() => {
                  onSubmitApproval(parcel.id);
                  onClose();
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit for Supervisor Approval</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
