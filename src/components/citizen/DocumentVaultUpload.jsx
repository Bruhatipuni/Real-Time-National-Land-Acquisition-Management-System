import React, { useState } from 'react';
import { 
  FolderArchive, 
  UploadCloud, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  FileCheck2,
  File,
  ChevronRight,
  Eye
} from 'lucide-react';
import { CITIZEN_DOCUMENTS } from './citizenData';

export default function DocumentVaultUpload({ parcel, lang = 'en' }) {
  const isHi = lang === 'hi';

  // Initial citizen uploaded documents list
  const [uploadedDocs, setUploadedDocs] = useState([
    {
      id: "DOC-SUB-901",
      name: "Bank Passbook & Cancelled Cheque",
      nameHi: "बैंक पासबुक एवं रद्द चेक",
      category: "Bank Verification Proof",
      uploadDate: "2026-08-20",
      fileSize: "1.2 MB",
      status: "APPROVED", // UPLOADED | RECEIVED | UNDER_VERIFICATION | APPROVED
      authority: "District Treasury & PFMS Cell",
      refCode: "PFMS-KYC-00812"
    },
    {
      id: "DOC-SUB-902",
      name: "Registered Sale Deed & Co-Sharer Agreement",
      nameHi: "पंजीकृत बैनामा एवं सह-खातेदार अनुबंध",
      category: "Ownership Proof",
      uploadDate: "2026-08-22",
      fileSize: "3.4 MB",
      status: "UNDER_VERIFICATION",
      authority: "Tehsildar Office, Sohna",
      refCode: "REV-ENC-4401"
    }
  ]);

  // Form states
  const [docType, setDocType] = useState('Ownership Proof');
  const [fileDescription, setFileDescription] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFileName) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: `DOC-SUB-${Math.floor(1000 + Math.random() * 9000)}`,
        name: selectedFileName,
        nameHi: selectedFileName,
        category: docType,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: "1.8 MB",
        status: "RECEIVED",
        authority: "Office of District Collector / LAO",
        refCode: `ACK-${Math.floor(100000 + Math.random() * 900000)}`
      };

      setUploadedDocs([newDoc, ...uploadedDocs]);
      setIsUploading(false);
      setUploadSuccess(true);
      setSelectedFileName('');
      setFileDescription('');

      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1000);
  };

  // Mock download trigger
  const handleDownload = (docName) => {
    alert(`Downloading official certified document: ${docName}\nDigital Seal & Stamp verified.`);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "दस्तावेज़ तिजोरी एवं नागरिक अपलोड केंद्र" : "DOCUMENT VAULT & CITIZEN UPLOAD CENTER"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "डिजिटल रूप से हस्ताक्षरित सरकारी अधिसूचनाएं डाउनलोड करें तथा आवश्यक साक्ष्य एवं सत्यापन पत्र सीधे अपलोड करें।"
                : "Access digitally signed government acquisition orders and securely upload supporting documents to the Competent Authority."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Vault (7 cols) and Upload (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Official Government Documents Vault */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                {isHi ? "प्रामाणिक सरकारी अभिलेख" : "OFFICIAL REPOSITORY"}
              </span>
              <h3 className="text-base font-black text-slate-900">
                {isHi ? "निर्गत सरकारी आदेश एवं राजपत्र" : "Issued Orders & Gazette Notifications"}
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {CITIZEN_DOCUMENTS.length} {isHi ? "प्रमाणित दस्तावेज़" : "Certified Files"}
            </span>
          </div>

          <div className="space-y-2.5">
            {CITIZEN_DOCUMENTS.map((doc) => (
              <div 
                key={doc.id}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3 flex items-center justify-between transition-colors text-xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold font-mono text-[10px] border border-red-200">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">
                      {isHi ? doc.nameHi : doc.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono">{doc.issueDate}</span>
                      <span>•</span>
                      <span className="text-slate-600 truncate">{doc.authority}</span>
                      <span>•</span>
                      <span className="font-mono">{doc.fileSize}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(isHi ? doc.nameHi : doc.name)}
                  className="bg-white hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs p-2 rounded-lg flex items-center space-x-1 cursor-pointer shrink-0 ml-2"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isHi ? "डाउनलोड" : "Download"}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Verification Lifecycle Status of Citizen Uploads */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? "आपके द्वारा अपलोड किए गए दस्तावेज़ों की स्थिति" : "YOUR SUBMITTED DOCUMENTS & VERIFICATION STATUS"}</span>
            </h4>

            <div className="space-y-2">
              {uploadedDocs.map((up) => {
                const getBadge = (st) => {
                  switch (st) {
                    case 'APPROVED':
                      return { text: isHi ? 'सत्यापित एवं स्वीकृत' : '✓ Verified & Approved', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
                    case 'UNDER_VERIFICATION':
                      return { text: isHi ? 'सत्यापन प्रक्रियाधीन' : '⏳ Under Verification', class: 'bg-amber-100 text-amber-900 border-amber-300' };
                    case 'RECEIVED':
                      return { text: isHi ? 'प्राधिकारी द्वारा प्राप्त' : '✓ Received by Authority', class: 'bg-blue-100 text-blue-800 border-blue-300' };
                    default:
                      return { text: isHi ? 'अपलोड हुआ' : '✓ Uploaded', class: 'bg-slate-100 text-slate-800 border-slate-300' };
                  }
                };
                const badge = getBadge(up.status);

                return (
                  <div key={up.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900">{isHi ? up.nameHi : up.name}</h5>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.class}`}>
                        {badge.text}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Category: <strong>{up.category}</strong></span>
                      <span>Ref Ack: <strong className="font-mono text-slate-800">{up.refCode}</strong></span>
                      <span className="font-mono">{up.uploadDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Upload Supporting Document Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Two-Way Interaction
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1 flex items-center space-x-1.5">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              <span>{isHi ? "सहायक दस्तावेज़ अपलोड करें" : "Upload Supporting Document"}</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              {isHi 
                ? "मालिकी साक्ष्य, बैंक पासबुक या आपत्ति प्रमाण पत्र सीधे सक्षम प्राधिकारी को प्रेषित करें।"
                : "Submit ownership deeds, banking proofs, or dispute evidence directly to CALA."}
            </p>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
            {/* Document Type Dropdown */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "दस्तावेज़ का प्रकार चुनें" : "Document Category"}
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="Ownership Proof">Ownership Proof (Registered Sale Deed / Patta)</option>
                <option value="Aadhaar Verification">Aadhaar Card / Identity Proof</option>
                <option value="Bank Proof">Bank Passbook / Cancelled Cheque (For DBT)</option>
                <option value="Objection Document">Section 3C Objection Supporting Evidence</option>
                <option value="Court Order">Revenue / Civil Court Interim Order</option>
                <option value="Succession Certificate">Succession / Legal Heir Certificate</option>
                <option value="Other">Other Ancillary Document</option>
              </select>
            </div>

            {/* File Picker */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "फ़ाइल का चयन करें (PDF, PNG, JPG - अधिकतम 15 MB)" : "Select File (PDF, PNG, JPG - Max 15 MB)"}
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/50 cursor-pointer transition-colors relative">
                <input 
                  type="file"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-800">
                  {selectedFileName ? selectedFileName : (isHi ? "कंप्यूटर / मोबाइल से फ़ाइल चुनें" : "Click or drag file here")}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isHi ? "डिजिटल हस्ताक्षर एवं एन्क्रिप्शन समर्थित" : "Encrypted transfer to Government Repository"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                {isHi ? "दस्तावेज़ का संक्षिप्त विवरण / टिप्पणी" : "Description / Remarks"}
              </label>
              <textarea
                rows={3}
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder={isHi ? "दस्तावेज़ के संदर्भ में कोई अतिरिक्त जानकारी दर्ज करें..." : "Explain relevance or context of this document..."}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? (isHi ? "अपलोड हो रहा है..." : "Encrypting & Uploading...") : (isHi ? "दस्तावेज़ सबमिट करें" : "Upload Document to CALA")}</span>
            </button>
          </form>

          {/* Success Banner */}
          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">{isHi ? "दस्तावेज़ सफलतापूर्वक प्राप्त हुआ!" : "Document Uploaded Successfully!"}</p>
                <p className="text-[11px] text-emerald-800">
                  {isHi ? "पावती संख्या उत्पन्न कर दी गई है। सक्षम प्राधिकारी को जांच हेतु भेजा गया।" : "Digital acknowledgement generated and forwarded to Land Acquisition Officer."}
                </p>
              </div>
            </div>
          )}

          {/* Notice Box */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">{isHi ? "सुरक्षा एवं विधिक सूचना:" : "Legal & Security Notice:"}</p>
            <p>
              {isHi 
                ? "अपलोड किए गए सभी दस्तावेज़ भारतीय साक्ष्य अधिनियम एवं सूचना प्रौद्योगिकी अधिनियम के तहत सुरक्षित रूप से संग्रहीत किए जाते हैं।"
                : "All documents uploaded are timestamped and cryptographically hashed for legal audit trails under the IT Act."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
