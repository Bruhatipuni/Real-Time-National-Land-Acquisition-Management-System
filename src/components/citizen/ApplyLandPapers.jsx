import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Download, 
  ShieldCheck, 
  Printer, 
  ExternalLink,
  Award,
  Scroll,
  FileCheck,
  Building2,
  Check,
  QrCode,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ApplyLandPapers({ parcel, lang = 'en' }) {
  const isHi = lang === 'hi';

  const PAPER_CATEGORIES = [
    {
      id: "RoR_JAMABANDI",
      title: "Certified Copy of Jamabandi / RoR",
      titleHi: "जमाबंदी / खतौनी प्रमाणित नकल",
      desc: "Official Record of Rights (RoR) verified by Revenue Tehsildar with digital signature.",
      descHi: "राजस्व तहसीलदार द्वारा डिजिटल रूप से हस्ताक्षरित अधिकार अभिलेख (जमाबंदी नकल)।",
      authority: "Tehsildar Office, Sohna",
      sla: "24-48 Hours",
      slaHi: "24-48 घंटे",
      icon: Scroll,
      badge: "REVENUE RECORD"
    },
    {
      id: "BHU_AADHAAR_CERT",
      title: "Bhu-Aadhaar (ULPIN) Demarcation Certificate",
      titleHi: "भू-आधार (ULPIN) सीमांकन प्रमाण पत्र",
      desc: "14-digit ULPIN geo-referenced boundary map certified by Survey of India drone survey.",
      descHi: "सर्वे ऑफ इंडिया ड्रोन सर्वेक्षण द्वारा प्रमाणित 14-अंकीय भू-आधार सीमांकन नक्शा।",
      authority: "Survey of India & District GIS Nodal",
      sla: "48 Hours",
      slaHi: "48 घंटे",
      icon: Award,
      badge: "GIS CERTIFIED"
    },
    {
      id: "NON_ENCUMBRANCE",
      title: "Non-Encumbrance Certificate (NEC)",
      titleHi: "भारमुक्ति प्रमाण पत्र (NEC)",
      desc: "Legal certification confirming parcel has zero mortgage, bank liens, or revenue court stays.",
      descHi: "भूमि पर किसी भी बैंक बंधक, वित्तीय भार अथवा न्यायालयी स्थगन न होने का प्रमाण पत्र।",
      authority: "Sub-Registrar Office, Gurugram",
      sla: "48 Hours",
      slaHi: "48 घंटे",
      icon: ShieldCheck,
      badge: "LEGAL CLEARANCE"
    },
    {
      id: "SEC3G_AWARD_COPY",
      title: "Section 3G Solatium Award Determination Order",
      titleHi: "धारा 3G तोषणा मुआवजा निर्णय आदेश प्रति",
      desc: "Certified gazette order of the 100% statutory solatium compensation award signed by CALA.",
      descHi: "सक्षम प्राधिकारी द्वारा हस्ताक्षरित 100% वैधानिक तोषणा मुआवजा निर्णय की प्रमाणित प्रति।",
      authority: "Office of District Collector / CALA",
      sla: "24 Hours",
      slaHi: "24 घंटे",
      icon: FileCheck,
      badge: "STATUTORY AWARD"
    },
    {
      id: "POSSESSION_CLEARANCE",
      title: "Section 3E Land Possession & Handover Certificate",
      titleHi: "धारा 3E कब्जा हस्तांतरण प्रमाण पत्र",
      desc: "Formal handover memorandum evidencing 100% compensation payment and land vesting.",
      descHi: "100% मुआवजा भुगतान उपरांत भूमि केंद्र सरकार को विधिवत सौंपने का कब्जा प्रमाण पत्र।",
      authority: "NHAI Project Implementation Unit",
      sla: "3 Working Days",
      slaHi: "3 कार्य दिवस",
      icon: Building2,
      badge: "HANDOVER MEMO"
    },
    {
      id: "MUTATION_PARTITION",
      title: "Land Title Mutation & Khata Partition Order",
      titleHi: "नामांतरण (दाखिल-खारिज) एवं खाता विभाजन आदेश",
      desc: "Certified mutation entry in government revenue register following acquisition demarcation.",
      descHi: "अधिग्रहण पश्चात सरकारी राजस्व अभिलेख में दर्ज नामान्तरण (म्यूटेशन) की प्रति।",
      authority: "Revenue Department & Patwari Cell",
      sla: "5-7 Working Days",
      slaHi: "5-7 कार्य दिवस",
      icon: FileText,
      badge: "MUTATION ENTRY"
    }
  ];

  // Past Applications History
  const [applications, setApplications] = useState([
    {
      appId: "APP-LP-2026-88412",
      paperType: "Certified Copy of Jamabandi / RoR",
      paperTypeHi: "जमाबंदी / खतौनी प्रमाणित नकल",
      dateApplied: "2026-09-02",
      status: "READY_FOR_DOWNLOAD",
      slaDate: "Delivered within 24 hours",
      slaDateHi: "24 घंटे में निर्गत",
      authority: "Tehsildar Office, Sohna",
      dscSignedBy: "Shri S.K. Verma, Sub-Divisional Magistrate",
      downloadUrl: "#"
    },
    {
      appId: "APP-LP-2026-79104",
      paperType: "Section 3G Solatium Award Determination Order",
      paperTypeHi: "धारा 3G तोषणा मुआवजा निर्णय आदेश प्रति",
      dateApplied: "2026-08-26",
      status: "READY_FOR_DOWNLOAD",
      slaDate: "Delivered within 24 hours",
      slaDateHi: "24 घंटे में निर्गत",
      authority: "Office of District Collector, Gurugram",
      dscSignedBy: "Shri Vikramaditya Singh, IAS (CALA)",
      downloadUrl: "#"
    }
  ]);

  // Form State
  const [selectedPaperId, setSelectedPaperId] = useState('RoR_JAMABANDI');
  const [purpose, setPurpose] = useState('Compensation Claim & Bank DBT Verification');
  const [deliveryMode, setDeliveryMode] = useState('DIGITAL_PDF');
  const [mobileNumber, setMobileNumber] = useState('98112-XXXXX');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAppId, setSuccessAppId] = useState(null);

  const selectedCategoryObj = PAPER_CATEGORIES.find(c => c.id === selectedPaperId) || PAPER_CATEGORIES[0];

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `APP-LP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newApp = {
        appId: generatedId,
        paperType: selectedCategoryObj.title,
        paperTypeHi: selectedCategoryObj.titleHi,
        dateApplied: new Date().toISOString().split('T')[0],
        status: "READY_FOR_DOWNLOAD",
        slaDate: isHi ? "तत्काल डिजिटल हस्ताक्षर सहित तैयार" : "Instant e-Signed via DSC",
        authority: selectedCategoryObj.authority,
        dscSignedBy: "Competent Authority Digital Signature (e-Sign)",
        downloadUrl: "#"
      };

      setApplications([newApp, ...applications]);
      setIsSubmitting(false);
      setSuccessAppId(generatedId);

      setTimeout(() => setSuccessAppId(null), 6000);
    }, 1200);
  };

  // Instant Certificate PDF Download via jsPDF
  const downloadCertificatePDF = (paperTitle, appId) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Top Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text("BHUSETU - GOVERNMENT OF INDIA REVENUE LEDGER", 105, 12, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(245, 158, 11);
      doc.text("DIGITAL CERTIFIED LAND PAPER / STATUTORY REVENUE RECORD", 105, 18, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text("ISSUED UNDER INFORMATION TECHNOLOGY ACT & DIGITAL INDIA LAND MODERNIZATION", 105, 24, { align: 'center' });

      // Title Box
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 38, 182, 14, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(paperTitle.toUpperCase(), 105, 47, { align: 'center' });

      // Application Details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);

      doc.text("Application Reference:", 16, 60);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(appId, 65, 60);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Issue Date & Time:", 120, 60);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(new Date().toLocaleString('en-IN'), 155, 60);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 66, 196, 66);

      // Land & Landowner Profile
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("CERTIFIED PARTICULARS OF LANDOWNER & PARCEL", 14, 75);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);

      doc.text("Landowner Name:", 16, 84);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(parcel.ownerName, 65, 84);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Aadhaar Identifier:", 120, 84);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(parcel.aadhaarMasked || "XXXX-XXXX-8921", 155, 84);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Bhu-Aadhaar (ULPIN):", 16, 92);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(217, 119, 6);
      doc.text(parcel.ulpin, 65, 92);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Survey Plot / Khata:", 120, 92);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Plot ${parcel.surveyNo} (${parcel.khataNo})`, 155, 92);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Acquired Area:", 16, 100);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${parcel.areaHectares} Hectares (${(parcel.areaHectares * 2.471).toFixed(2)} Acres)`, 65, 100);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Village & Tehsil:", 120, 100);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${parcel.village}, Tehsil Sohna`, 155, 100);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("District & State:", 16, 108);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${parcel.district}, ${parcel.state}`, 65, 108);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Encumbrance Status:", 120, 108);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text("CLEARED / ZERO LIEN", 155, 108);

      doc.line(14, 116, 196, 116);

      // Certificate Body Text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("OFFICIAL REVENUE STATEMENT & STATUTORY ATTESTATION", 14, 126);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const textBlock = 
        `This is to certify that upon verification of the digitally preserved revenue ledger and GIS cadastral layers on the BhuSetu National Platform, the land parcel bearing ULPIN ${parcel.ulpin}, situated at Village ${parcel.village}, District ${parcel.district}, registered under the ownership of ${parcel.ownerName}, stands duly authenticated under the provisions of the Land Revenue Code and the RFCTLARR Act 2013.\n\n` +
        `This electronic record is generated pursuant to Section 65B of the Indian Evidence Act 1872 and is valid for all official, judicial, banking, and statutory compensation purposes without requiring physical ink signature.`;

      doc.text(textBlock, 14, 134, { maxWidth: 182, lineHeightFactor: 1.4 });

      // Digital DSC Stamp Box
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 175, 182, 38, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 175, 182, 38, 'S');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text("DIGITALLY SIGNED ELECTRONIC CERTIFICATE (DSC)", 20, 183);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text("Signer ID: GOV-HR-DSC-CALA-2026-9901", 20, 189);
      doc.text("Certification Authority: National Informatics Centre (NIC-CA)", 20, 194);
      doc.text("Signature Validity: Cryptographically Verified & Unaltered", 20, 199);
      doc.text("QR Verification URL: https://bhusetu.gov.in/verify/" + appId, 20, 204);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("Competent Authority (CALA)", 140, 204);

      // Footer
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Official Certified Copy • BhuSetu Land Acquisition Management System • Citizen Service Guarantee Act", 105, 290, { align: 'center' });

      doc.save(`BhuSetu_Certified_${parcel.ulpin}_${appId}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating certified land paper PDF.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
            <Scroll className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "प्रमाणित राजस्व एवं भूमि दस्तावेज़ हेतु आवेदन" : "APPLY FOR CERTIFIED LAND PAPERS & REVENUE RECORDS"}</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                {isHi ? "डिजिटल सेवा गारंटी" : "e-District SLA Guarantee"}
              </span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "जमाबंदी नकल, भू-आधार नक्शा, भारमुक्ति प्रमाण पत्र (NEC) अथवा धारा 3G मुआवजा आदेश की प्रमाणित डिजिटल प्रति प्राप्त करें।"
                : "Apply for certified Jamabandi copies, ULPIN cadastral maps, Non-Encumbrance certificates, or statutory Section 3G orders."}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>SLA: 24 to 48 Hours Delivery</span>
        </div>
      </div>

      {/* Main Grid: Left Application Form (7 cols), Right Available Catalog & History (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Application Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Online Revenue Desk
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1">
              {isHi ? "दस्तावेज़ हेतु नया आवेदन पत्र भरें" : "Application Form for Certified Land Papers"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi 
                ? "आपके भू-आधार एवं खाता संख्या का विवरण स्वतः भर दिया गया है।"
                : "Your verified Bhu-Aadhaar and survey plot particulars have been pre-filled."}
            </p>
          </div>

          <form onSubmit={handleApplicationSubmit} className="space-y-4 text-xs">
            {/* Step 1: Select Paper Category */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">
                {isHi ? "1. वांछित प्रमाणित दस्तावेज़ चुनें" : "1. Select Certified Land Document"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAPER_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedPaperId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedPaperId(cat.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected 
                          ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-500'}`} />
                        <span className="text-[9px] font-mono font-bold text-slate-400">{cat.sla}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {isHi ? cat.titleHi : cat.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {isHi ? cat.descHi : cat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pre-filled Land Particulars Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 block">
                {isHi ? "भू-अभिलेख विवरण (स्वतः सत्यापित)" : "PRE-FILLED CERTIFICATE CREDENTIALS"}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">{isHi ? "भू-स्वामी:" : "Landowner:"}</span>
                  <strong className="text-slate-900 font-mono">{parcel.ownerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">ULPIN:</span>
                  <strong className="text-amber-800 font-mono">{parcel.ulpin}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{isHi ? "सर्वे / खसरा प्लॉट:" : "Survey Plot:"}</span>
                  <strong className="text-slate-900 font-mono">Plot {parcel.surveyNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{isHi ? "ग्राम एवं तहसील:" : "Village & Tehsil:"}</span>
                  <span className="text-slate-800 font-semibold">{parcel.village}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isHi ? "जिला एवं राज्य:" : "District & State:"}</span>
                  <span className="text-slate-800 font-semibold">{parcel.district}, {parcel.state}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isHi ? "अधिग्रहित क्षेत्रफल:" : "Acquired Area:"}</span>
                  <span className="text-slate-800 font-semibold">{parcel.areaHectares} Ha</span>
                </div>
              </div>
            </div>

            {/* Step 2: Purpose of Certificate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  {isHi ? "आवेदन का प्रयोजन / कारण" : "Purpose of Application"}
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:border-teal-500 focus:outline-none"
                >
                  <option>Compensation Claim & Bank DBT Verification</option>
                  <option>Court Evidence & Section 3C Objection Filing</option>
                  <option>Bank Loan / Agricultural Credit Application</option>
                  <option>Succession Mutation & Co-Sharer Partition</option>
                  <option>Personal Legal Record & Vault Preservation</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  {isHi ? "वितरण प्रारूप (Delivery Format)" : "Delivery Format"}
                </label>
                <select
                  value={deliveryMode}
                  onChange={(e) => setDeliveryMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:border-teal-500 focus:outline-none"
                >
                  <option value="DIGITAL_PDF">Instant Digitally Signed PDF (e-Sign with QR)</option>
                  <option value="SPEED_POST">Speed Post Certified Hardcopy + Digital Copy</option>
                </select>
              </div>
            </div>

            {/* Mobile Number for SMS Tracking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  {isHi ? "एसएमएस ट्रैकिंग हेतु मोबाइल नंबर" : "Mobile Number for SMS Tracking"}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 98112-XXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  {isHi ? "सरकारी शुल्क (Fee)" : "Official Processing Fee"}
                </label>
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-900 flex items-center justify-between">
                  <span>₹0.00 (Exempt under Digital India)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-black">FREE</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-teal-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (isHi ? "आवेदन प्रेषित किया जा रहा है..." : "Submitting Application to Tehsildar / CALA...") : (isHi ? "प्रमाणित दस्तावेज़ हेतु आवेदन जमा करें" : "Submit Application for Certified Land Paper")}</span>
            </button>
          </form>

          {/* Success Banner */}
          {successAppId && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{isHi ? "आवेदन सफलतापूर्वक दर्ज हुआ एवं तत्काल निर्गत किया गया!" : "Application Submitted & Certified Copy Issued!"}</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Application Token: <strong>{successAppId}</strong>. Digital signature applied under IT Act 2000.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => downloadCertificatePDF(selectedCategoryObj.title, successAppId)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHi ? "प्रमाणित प्रति अभी डाउनलोड करें (PDF)" : "Download Certified PDF Copy Now"}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Applications History & SLA Guarantee */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Applications History Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                  {isHi ? "आपके पूर्व आवेदन" : "CITIZEN APPLICATION LEDGER"}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {isHi ? "निर्गत प्रमाणित दस्तावेज़ इतिहास" : "Issued Papers & Status"}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-lg">
                {applications.length} {isHi ? "प्रमाण पत्र" : "Certificates"}
              </span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div 
                  key={app.appId}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-slate-900">{app.appId}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {isHi ? "✓ निर्गत / तैयार" : "✓ CERTIFIED & READY"}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900">{isHi ? app.paperTypeHi : app.paperType}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Issuing Authority: <strong className="text-slate-700">{app.authority}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="font-mono text-slate-500">{app.dateApplied}</span>
                    <button
                      onClick={() => downloadCertificatePDF(app.paperType, app.appId)}
                      className="text-teal-700 hover:text-teal-800 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isHi ? "डाउनलोड करें" : "Download PDF"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* SLA Service Guarantee Notice */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-black text-teal-950">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>{isHi ? "नागरिक सेवा गारंटी अधिनियम" : "Public Service Guarantee Commitment"}</span>
            </div>
            <p className="text-[11px] text-teal-900 leading-relaxed">
              {isHi 
                ? "सभी राजस्व एवं भू-अधिग्रहण दस्तावेज़ों का डिजिटल प्रमाणीकरण सेवा गारंटी अधिनियम के तहत निर्धारित 48 घंटे की समय-सीमा के भीतर किया जाता है। विलंब होने पर स्वतः नोडल अधिकारी को सूचना प्रेषित होती है।"
                : "All certified revenue and acquisition records are digitally processed under the Public Services Guarantee Act within guaranteed SLA timelines. Any delay automatically triggers an administrative escalation."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
