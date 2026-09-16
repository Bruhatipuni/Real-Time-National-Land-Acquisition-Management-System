import React, { useState, useMemo } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  History,
  FileCheck,
  Shield,
  ShieldCheck,
  Award,
  Layers,
  Building,
  MapPin,
  User,
  Plus,
  Trash2,
  Calendar,
  ChevronRight,
  ExternalLink,
  Printer,
  Check,
  X,
  Lock,
  FileCode,
  CheckSquare,
  ArrowUpRight,
  FileSignature
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { INITIAL_LAO_DOCUMENTS, LAO_DOCUMENT_CATEGORIES } from '../data/laoDocumentsData';

export default function LAODocumentManagement({ currentUser, properties = [] }) {
  // Master state for LAO documents
  const [documents, setDocuments] = useState(INITIAL_LAO_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState(INITIAL_LAO_DOCUMENTS[0]?.id);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING_SCRUTINY' | 'REJECTED'

  // Modals & Panels state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Upload New Document form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    docNumber: '',
    category: 'GAZETTE_NOTIFICATION',
    project: 'Delhi-Mumbai Industrial Corridor (DMIC Expressway Spur)',
    parcelId: properties[0]?.propertyId || 'PROP-MCG-2026-081',
    ulpin: properties[0]?.ulpin || '06-12-8891-K2M9A4',
    surveyNo: properties[0]?.surveyNo || '128/2',
    khataNo: properties[0]?.khataNo || 'K-0842',
    ownerName: properties[0]?.ownerName || 'Rajesh Kumar Sharma & Brothers',
    municipality: properties[0]?.municipality || 'Municipal Corporation of Gurugram (MCG)',
    issuedBy: 'Ministry of Road Transport & Highways (MoRTH) / CALA',
    statutoryAct: 'Section 3A of National Highways Act, 1956 & RFCTLARR Act 2013',
    summary: '',
    fileName: '',
    fileSize: '2.5 MB'
  });

  // Upload New Version form state
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [newVersionFile, setNewVersionFile] = useState(null);

  // Approval / Rejection form state
  const [approvalNote, setApprovalNote] = useState('');
  const [autoSignOnApprove, setAutoSignOnApprove] = useState(true);
  const [rejectionGround, setRejectionGround] = useState('Right-of-Way Buffer Encroachment');
  const [rejectionRemarks, setRejectionRemarks] = useState('');

  // Digital Signature PIN state
  const [officerPin, setOfficerPin] = useState('8842');
  const [isSigning, setIsSigning] = useState(false);

  // Feedback toast state
  const [toastMessage, setToastMessage] = useState(null);

  // Officer info
  const officerName = currentUser?.name || "Sanjay Deshmukh";
  const officerRole = currentUser?.roleObj?.name || "Municipal Officer & LAO Nodal";
  const officerDept = currentUser?.roleObj?.department || "Urban Local Body / Land Acquisition Cell";

  // Selected Document object
  const selectedDoc = useMemo(() => {
    return documents.find(d => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  // Dynamic KPI Stats
  const stats = useMemo(() => {
    const total = documents.length;
    const approved = documents.filter(d => d.status === 'APPROVED').length;
    const pending = documents.filter(d => d.status === 'PENDING_SCRUTINY' || d.status === 'UNDER_REVIEW').length;
    const rejected = documents.filter(d => d.status === 'REJECTED').length;
    const signedCount = documents.filter(d => d.digitalSignature?.isSigned).length;
    return { total, approved, pending, rejected, signedCount };
  }, [documents]);

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        doc.id.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.docNumber.toLowerCase().includes(q) ||
        doc.ulpin.toLowerCase().includes(q) ||
        doc.ownerName.toLowerCase().includes(q) ||
        doc.surveyNo.toLowerCase().includes(q) ||
        doc.khataNo.toLowerCase().includes(q) ||
        doc.municipality.toLowerCase().includes(q)
      );

      const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || (
        selectedStatus === 'PENDING_SCRUTINY' 
          ? (doc.status === 'PENDING_SCRUTINY' || doc.status === 'UNDER_REVIEW')
          : doc.status === selectedStatus
      );

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [documents, searchQuery, selectedCategory, selectedStatus]);

  // Toast feedback helper
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Helper to format category badge
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'GAZETTE_NOTIFICATION':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'Sec 3A/3D Gazette' };
      case 'REVENUE_RECORD':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'Khatauni / Revenue' };
      case 'AWARD_DETERMINATION':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Sec 3G Award' };
      case 'SURVEY_MAP':
        return { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', text: 'Cadastral Survey' };
      case 'STATUTORY_NOC':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Town Planning NOC' };
      case 'LEGAL_DOCUMENT':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Legal / Court Stay' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', text: cat };
    }
  };

  // Helper to format status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
          label: 'APPROVED & VALID'
        };
      case 'PENDING_SCRUTINY':
      case 'UNDER_REVIEW':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          bg: 'bg-amber-500/10 text-amber-700 border-amber-300',
          label: 'PENDING SCRUTINY'
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          bg: 'bg-rose-500/10 text-rose-700 border-rose-300',
          label: 'REJECTED / DEFECT'
        };
      default:
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />,
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          label: status
        };
    }
  };

  // Handler: Upload New Document
  const handleUploadDocument = (e) => {
    e?.preventDefault?.();
    if (!uploadForm.title.trim() || !uploadForm.docNumber.trim()) {
      showToast('Please provide Document Title and Document Reference Number', 'error');
      return;
    }

    const docId = `LAO-DOC-2026-${String(documents.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const catObj = LAO_DOCUMENT_CATEGORIES.find(c => c.id === uploadForm.category);

    const newDoc = {
      id: docId,
      title: uploadForm.title.trim(),
      docNumber: uploadForm.docNumber.trim(),
      category: uploadForm.category,
      categoryLabel: catObj ? catObj.label : uploadForm.category,
      project: uploadForm.project,
      projectId: "PROJ-01",
      parcelId: uploadForm.parcelId,
      ulpin: uploadForm.ulpin,
      surveyNo: uploadForm.surveyNo,
      khataNo: uploadForm.khataNo,
      ownerName: uploadForm.ownerName,
      municipality: uploadForm.municipality,
      village: uploadForm.municipality,
      issuedBy: uploadForm.issuedBy,
      officer: `${officerName} (${officerRole})`,
      status: 'PENDING_SCRUTINY',
      currentVersion: 'v1.0',
      uploadDate: now,
      lastUpdated: now,
      fileType: 'PDF',
      fileSize: uploadForm.fileSize || '2.4 MB',
      digitalSignature: {
        isSigned: false,
        signedBy: null,
        designation: null,
        timestamp: null,
        certSerial: null,
        algorithm: null,
        validTill: null
      },
      versions: [
        {
          version: 'v1.0',
          date: now,
          uploadedBy: `${officerName} (${officerRole})`,
          fileSize: uploadForm.fileSize || '2.4 MB',
          checksum: `SHA256-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 8)}`,
          changeNotes: uploadForm.summary || 'Initial document uploaded for statutory land acquisition scrutiny.',
          status: 'PENDING_SCRUTINY'
        }
      ],
      activityHistory: [
        {
          id: `ACT-${Date.now()}-1`,
          action: 'Document Registered & Ingested',
          by: `${officerName} (${officerRole})`,
          timestamp: now,
          notes: `Registered under DILRMP 3.0 repository. Associated with ULPIN ${uploadForm.ulpin}.`
        }
      ],
      content: {
        statutoryAct: uploadForm.statutoryAct || 'RFCTLARR Act 2013',
        notificationNo: uploadForm.docNumber,
        gazetteDate: now.substring(0, 10),
        summary: uploadForm.summary || 'Statutory submission for municipal right-of-way corridor demarcation.',
        landSchedule: [
          { plot: uploadForm.surveyNo, khata: uploadForm.khataNo, type: 'Urban Corridor', areaHa: 0.50, owner: uploadForm.ownerName, share: '100%' }
        ],
        objectionPeriodDays: 21,
        competentAuthorityOffice: `Office of the Competent Authority Land Acquisition (CALA), ${uploadForm.municipality}`
      }
    };

    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDocId(docId);
    setIsUploadModalOpen(false);
    showToast(`Document ${docId} uploaded successfully into LAO Repository.`, 'success');

    // Reset upload form
    setUploadForm({
      title: '',
      docNumber: '',
      category: 'GAZETTE_NOTIFICATION',
      project: 'Delhi-Mumbai Industrial Corridor (DMIC Expressway Spur)',
      parcelId: properties[0]?.propertyId || 'PROP-MCG-2026-081',
      ulpin: properties[0]?.ulpin || '06-12-8891-K2M9A4',
      surveyNo: properties[0]?.surveyNo || '128/2',
      khataNo: properties[0]?.khataNo || 'K-0842',
      ownerName: properties[0]?.ownerName || 'Rajesh Kumar Sharma & Brothers',
      municipality: properties[0]?.municipality || 'Municipal Corporation of Gurugram (MCG)',
      issuedBy: 'Ministry of Road Transport & Highways (MoRTH) / CALA',
      statutoryAct: 'Section 3A of National Highways Act, 1956 & RFCTLARR Act 2013',
      summary: '',
      fileName: '',
      fileSize: '2.5 MB'
    });
  };

  // Handler: Upload New Version of Selected Document
  const handleUploadNewVersion = (e) => {
    e?.preventDefault?.();
    if (!selectedDoc) return;
    if (!newVersionNotes.trim()) {
      showToast('Please provide a revision note / change summary for this version.', 'error');
      return;
    }

    const currentVerNumber = parseFloat(selectedDoc.currentVersion.replace('v', '')) || 1.0;
    const nextVerNumber = (currentVerNumber + 0.1).toFixed(1);
    const nextVerString = `v${nextVerNumber}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newVersionItem = {
      version: nextVerString,
      date: now,
      uploadedBy: `${officerName} (${officerRole})`,
      fileSize: '3.6 MB',
      checksum: `SHA256-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 8)}`,
      changeNotes: newVersionNotes.trim(),
      status: selectedDoc.status === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW'
    };

    const newActivityItem = {
      id: `ACT-${Date.now()}-VER`,
      action: `Version ${nextVerString} Uploaded`,
      by: `${officerName} (${officerRole})`,
      timestamp: now,
      notes: `Revisions registered: ${newVersionNotes.trim()}`
    };

    setDocuments(prev => prev.map(d => {
      if (d.id === selectedDoc.id) {
        return {
          ...d,
          currentVersion: nextVerString,
          lastUpdated: now,
          versions: [newVersionItem, ...d.versions],
          activityHistory: [newActivityItem, ...d.activityHistory]
        };
      }
      return d;
    }));

    setNewVersionNotes('');
    setNewVersionFile(null);
    setIsVersionModalOpen(false);
    showToast(`Version ${nextVerString} registered for document ${selectedDoc.id}.`, 'success');
  };

  // Handler: Approve Document
  const handleApproveDocument = () => {
    if (!selectedDoc) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const nowIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    const approvalActivity = {
      id: `ACT-${Date.now()}-APP`,
      action: 'Statutory Approval Endorsed',
      by: `${officerName} (${officerRole})`,
      timestamp: now,
      notes: approvalNote.trim() || 'Scrutinized and verified compliant with statutory land acquisition guidelines.'
    };

    let updatedSig = selectedDoc.digitalSignature;
    let signActivity = null;

    if (autoSignOnApprove && !selectedDoc.digitalSignature?.isSigned) {
      updatedSig = {
        isSigned: true,
        signedBy: officerName,
        designation: `${officerRole}, ${officerDept}`,
        timestamp: nowIST,
        certSerial: `NIC-CA-2026-SHA256-${Math.floor(100000 + Math.random() * 900000)}`,
        algorithm: 'SHA-256 with RSA 2048-bit',
        validTill: '31 Dec 2028'
      };

      signActivity = {
        id: `ACT-${Date.now()}-SIG`,
        action: 'Digitally Signed with DSC (Class-3 NIC-CA)',
        by: `${officerName} (${officerRole})`,
        timestamp: now,
        notes: `Electronic seal applied with cryptographic certificate ${updatedSig.certSerial}.`
      };
    }

    setDocuments(prev => prev.map(d => {
      if (d.id === selectedDoc.id) {
        const history = signActivity 
          ? [signActivity, approvalActivity, ...d.activityHistory]
          : [approvalActivity, ...d.activityHistory];
        return {
          ...d,
          status: 'APPROVED',
          lastUpdated: now,
          digitalSignature: updatedSig,
          activityHistory: history
        };
      }
      return d;
    }));

    setIsApproveModalOpen(false);
    setApprovalNote('');
    showToast(`Document ${selectedDoc.id} APPROVED and official record updated.`, 'success');
  };

  // Handler: Reject Document
  const handleRejectDocument = () => {
    if (!selectedDoc) return;
    if (!rejectionRemarks.trim()) {
      showToast('Please enter statutory grounds / defect remarks for rejection.', 'error');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const rejectActivity = {
      id: `ACT-${Date.now()}-REJ`,
      action: 'Statutory Defect Memorandum / Rejection Issued',
      by: `${officerName} (${officerRole})`,
      timestamp: now,
      notes: `Defect Reason: [${rejectionGround}] - ${rejectionRemarks.trim()}`
    };

    setDocuments(prev => prev.map(d => {
      if (d.id === selectedDoc.id) {
        return {
          ...d,
          status: 'REJECTED',
          lastUpdated: now,
          digitalSignature: {
            ...d.digitalSignature,
            isSigned: false
          },
          activityHistory: [rejectActivity, ...d.activityHistory]
        };
      }
      return d;
    }));

    setIsRejectModalOpen(false);
    setRejectionRemarks('');
    showToast(`Document ${selectedDoc.id} REJECTED. Defect notice registered.`, 'info');
  };

  // Handler: Apply Digital Signature (Class-3 DSC / Aadhaar eSign)
  const handleApplyDigitalSignature = () => {
    if (!selectedDoc) return;
    if (!officerPin || officerPin.length < 4) {
      showToast('Please enter your 4-digit DSC Token Security PIN.', 'error');
      return;
    }

    setIsSigning(true);

    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const nowIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
      const certSerial = `NIC-CA-2026-SHA256-${Math.floor(100000 + Math.random() * 900000)}`;

      const newSig = {
        isSigned: true,
        signedBy: officerName,
        designation: `${officerRole}, ${officerDept}`,
        timestamp: nowIST,
        certSerial: certSerial,
        algorithm: 'SHA-256 with RSA 2048-bit',
        validTill: '31 Dec 2028'
      };

      const signActivity = {
        id: `ACT-${Date.now()}-SIG`,
        action: 'Digitally Signed with DSC (Class-3 NIC-CA)',
        by: `${officerName} (${officerRole})`,
        timestamp: now,
        notes: `Class-3 Digital Signature Certificate applied. Token Serial: ${certSerial}. Verified by Controller of Certifying Authorities (CCA).`
      };

      setDocuments(prev => prev.map(d => {
        if (d.id === selectedDoc.id) {
          return {
            ...d,
            status: d.status === 'REJECTED' ? d.status : 'APPROVED',
            lastUpdated: now,
            digitalSignature: newSig,
            activityHistory: [signActivity, ...d.activityHistory]
          };
        }
        return d;
      }));

      setIsSigning(false);
      setIsSignModalOpen(false);
      showToast(`Digital Signature securely stamped on ${selectedDoc.id}.`, 'success');
    }, 1200);
  };

  // Handler: Generate Certified PDF using jsPDF
  const handleDownloadPDF = (docToDownload = selectedDoc) => {
    if (!docToDownload) return;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryColor = [15, 23, 42]; // Slate-900
      const accentColor = [16, 185, 129]; // Emerald-500
      const goldColor = [217, 119, 6]; // Amber-600

      // Outer Decorative Border
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.8);
      pdf.rect(10, 10, 190, 277);

      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.rect(12, 12, 186, 273);

      // Sovereign Header Box
      pdf.setFillColor(15, 23, 42);
      pdf.rect(14, 14, 182, 28, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('GOVERNMENT OF INDIA • STATUTORY LAND ACQUISITION REPOSITORY', 105, 22, { align: 'center' });

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(203, 213, 225);
      pdf.text('National Land Record Modernization Programme (DILRMP 3.0) & CALA Urban Local Body Portal', 105, 27, { align: 'center' });
      pdf.text(`Competent Authority Office: ${docToDownload.municipality}`, 105, 32, { align: 'center' });

      // Document Category & Reference
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text(docToDownload.title.toUpperCase(), 105, 50, { align: 'center' });

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Document Reference Number: ${docToDownload.docNumber} • Version: ${docToDownload.currentVersion}`, 105, 56, { align: 'center' });

      // Status Bar
      const isApproved = docToDownload.status === 'APPROVED';
      pdf.setFillColor(isApproved ? 236 : 254, isApproved ? 253 : 242, isApproved ? 245 : 242);
      pdf.setDrawColor(isApproved ? 16 : 239, isApproved ? 185 : 68, isApproved ? 129 : 68);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(15, 62, 180, 10, 2, 2, 'FD');

      pdf.setTextColor(isApproved ? 5 : 159, isApproved ? 150 : 18, isApproved ? 105 : 57);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(`STATUS: ${docToDownload.status} • ISSUED UNDER: ${docToDownload.content?.statutoryAct || 'RFCTLARR Act 2013'}`, 105, 68.5, { align: 'center' });

      // Section 1: Property & Owner Details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('1. PARCEL DEMARCATION & TITLE IDENTIFIERS', 16, 81);

      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.2);
      pdf.line(16, 83, 194, 83);

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(51, 65, 85);

      const col1X = 18;
      const col2X = 108;
      let yPos = 89;

      pdf.text(`ULPIN ID: ${docToDownload.ulpin}`, col1X, yPos);
      pdf.text(`Project Corridor: ${docToDownload.project}`, col2X, yPos);
      yPos += 6;

      pdf.text(`Survey / Khasra No: ${docToDownload.surveyNo}`, col1X, yPos);
      pdf.text(`Khata / Record No: ${docToDownload.khataNo}`, col2X, yPos);
      yPos += 6;

      pdf.text(`Recorded Owner(s): ${docToDownload.ownerName}`, col1X, yPos);
      pdf.text(`Urban Local Body: ${docToDownload.municipality}`, col2X, yPos);
      yPos += 6;

      pdf.text(`Issuing Authority: ${docToDownload.issuedBy}`, col1X, yPos);
      pdf.text(`Nodal Verification Officer: ${docToDownload.officer}`, col2X, yPos);
      yPos += 11;

      // Section 2: Statutory Summary & Land Schedule
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('2. STATUTORY NOTIFICATION & SCHEDULE OF LAND', 16, yPos);

      pdf.line(16, yPos + 2, 194, yPos + 2);
      yPos += 8;

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);

      const splitSummary = pdf.splitTextToSize(`Statutory Abstract: ${docToDownload.content?.summary || 'Standard gazette land acquisition schedule verified.'}`, 176);
      pdf.text(splitSummary, 18, yPos);
      yPos += (splitSummary.length * 5) + 4;

      // Land Schedule Table Headers
      pdf.setFillColor(241, 245, 249);
      pdf.rect(16, yPos, 178, 7, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(30, 41, 59);

      pdf.text('Plot / Survey No.', 19, yPos + 4.8);
      pdf.text('Khata No.', 58, yPos + 4.8);
      pdf.text('Classification', 90, yPos + 4.8);
      pdf.text('Area (Hectares)', 128, yPos + 4.8);
      pdf.text('Share / Ownership', 160, yPos + 4.8);
      yPos += 7;

      // Table Row
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(51, 65, 85);
      pdf.rect(16, yPos, 178, 7);

      pdf.text(docToDownload.surveyNo, 19, yPos + 4.8);
      pdf.text(docToDownload.khataNo, 58, yPos + 4.8);
      pdf.text('Commercial / Urban RoW', 90, yPos + 4.8);
      pdf.text('0.48 Ha (1.18 Acres)', 128, yPos + 4.8);
      pdf.text('100% Freehold', 160, yPos + 4.8);
      yPos += 14;

      // Section 3: Digital Signature & Cryptographic Endorsement
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('3. DIGITAL SIGNATURE CERTIFICATE (DSC) & CRYPTOGRAPHIC VERIFICATION', 16, yPos);
      pdf.line(16, yPos + 2, 194, yPos + 2);
      yPos += 8;

      const sig = docToDownload.digitalSignature;
      if (sig?.isSigned) {
        // Green Verified Stamp Box
        pdf.setFillColor(240, 253, 244);
        pdf.setDrawColor(34, 197, 94);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(16, yPos, 178, 38, 2, 2, 'FD');

        pdf.setTextColor(22, 101, 52);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.5);
        pdf.text('[VERIFIED] OFFICIALLY SIGNED USING CLASS-3 DIGITAL SIGNATURE CERTIFICATE', 22, yPos + 7);

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(21, 128, 61);

        pdf.text(`Certified Signatory: ${sig.signedBy} (${sig.designation})`, 22, yPos + 14);
        pdf.text(`Certifying Authority: National Informatics Centre CA (NIC-CA) / CCA India`, 22, yPos + 19);
        pdf.text(`Certificate Serial No: ${sig.certSerial}`, 22, yPos + 24);
        pdf.text(`Signing Timestamp: ${sig.timestamp}`, 22, yPos + 29);
        pdf.text(`Integrity Status: SHA-256 Hash Verified • Immutable e-Governance Record`, 22, yPos + 34);

        yPos += 46;
      } else {
        // Pending Sign Box
        pdf.setFillColor(254, 242, 242);
        pdf.setDrawColor(248, 113, 113);
        pdf.setLineWidth(0.4);
        pdf.roundedRect(16, yPos, 178, 25, 2, 2, 'FD');

        pdf.setTextColor(185, 28, 28);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('DSC NOT APPLIED • DOCUMENT PENDING OFFICIAL DIGITAL ATTESTATION', 22, yPos + 8);

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text('This copy is for administrative scrutiny only and does not carry final legal gazette force.', 22, yPos + 16);

        yPos += 33;
      }

      // Section 4: Audit Trail Snippet
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('4. RECENT AUDIT TRAIL LOG', 16, yPos);
      pdf.line(16, yPos + 1.5, 194, yPos + 1.5);
      yPos += 6;

      const recentActs = (docToDownload.activityHistory || []).slice(0, 3);
      recentActs.forEach((act) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(51, 65, 85);
        pdf.text(`• ${act.timestamp} IST - ${act.action} by ${act.by}`, 18, yPos);
        yPos += 4;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text(`   ${act.notes}`, 18, yPos);
        yPos += 5;
      });

      // Footer
      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`Generated securely from Bhoomi Setu LAO Cloud Portal • Reference ID: ${docToDownload.id} • Page 1 of 1`, 105, 282, { align: 'center' });

      // Save PDF
      pdf.save(`${docToDownload.id}_${docToDownload.docNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Certified.pdf`);
      showToast(`Certified PDF for ${docToDownload.id} downloaded.`, 'success');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      showToast('Downloaded fallback certified document.', 'info');
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 transition-all transform animate-in slide-in-from-top-3 ${
          toastMessage.type === 'error'
            ? 'bg-rose-900/95 text-white border-rose-700'
            : toastMessage.type === 'info'
            ? 'bg-sky-900/95 text-white border-sky-700'
            : 'bg-emerald-900/95 text-white border-emerald-700'
        }`}>
          {toastMessage.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : toastMessage.type === 'info' ? (
            <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Sub-Module Header & Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-black tracking-tight text-slate-900">
                    LAO STATUTORY DOCUMENT MANAGEMENT
                  </h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    RFCTLARR 2013 & DILRMP 3.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Upload, inspect, approve, version-control and digitally sign statutory land acquisition documents
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Land Document</span>
            </button>

            {selectedDoc && (
              <button
                onClick={() => handleDownloadPDF(selectedDoc)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Download Certified PDF Copy"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Total Documents
              </span>
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              {stats.total}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Statutory filings</span>
          </div>

          <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Approved & Valid
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">
              {stats.approved}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Clear title records</span>
          </div>

          <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Pending Scrutiny
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-700 font-mono mt-0.5">
              {stats.pending}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">Awaiting endorsement</span>
          </div>

          <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                Digitally Signed (DSC)
              </span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-black text-indigo-700 font-mono mt-0.5">
              {stats.signedCount}
            </div>
            <span className="text-[10px] text-indigo-700 font-medium">Class-3 eSign stamped</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Document List (Left 4 cols) + Document Detail Workspace (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Filter & Document Repository Table */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Search bar & Category filter */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Title, Doc#, ULPIN, Owner..."
                className="w-full pl-9 pr-8 py-2 bg-white text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white text-[11px] font-semibold text-slate-700 py-1.5 px-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories</option>
                <option value="GAZETTE_NOTIFICATION">Gazette (Sec 3A/3D)</option>
                <option value="REVENUE_RECORD">Revenue / Khatauni</option>
                <option value="AWARD_DETERMINATION">Awards (Sec 3G)</option>
                <option value="SURVEY_MAP">Cadastral Survey Map</option>
                <option value="STATUTORY_NOC">Town Planning NOC</option>
                <option value="LEGAL_DOCUMENT">Court / Legal Stay</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white text-[11px] font-semibold text-slate-700 py-1.5 px-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved Only</option>
                <option value="PENDING_SCRUTINY">Pending Scrutiny</option>
                <option value="REJECTED">Rejected Only</option>
              </select>
            </div>
          </div>

          {/* List of Documents */}
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredDocuments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-xs font-semibold">No documents match the filter</p>
                <p className="text-[11px] text-slate-400 mt-1">Try resetting search or category parameters</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                const statusBadge = getStatusBadge(doc.status);
                const catBadge = getCategoryBadge(doc.category);

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600'
                        : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[11px] font-black font-mono text-slate-900">
                            {doc.id}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                            {doc.currentVersion}
                          </span>
                          {doc.digitalSignature?.isSigned && (
                            <span title="Digitally Signed" className="text-emerald-600">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                          {doc.title}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center space-x-1 shrink-0 ${statusBadge.bg}`}>
                        {statusBadge.icon}
                        <span>{doc.status === 'PENDING_SCRUTINY' ? 'PENDING' : doc.status}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="truncate max-w-[170px] text-slate-600">
                        {doc.docNumber}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {doc.lastUpdated.substring(0, 10)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${catBadge.bg}`}>
                        {catBadge.text}
                      </span>
                      <span className="text-slate-400 font-mono">
                        ULPIN: {doc.ulpin.substring(0, 11)}...
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Document Detail, Preview, Actions & Digital Signature */}
        <div className="lg:col-span-8 space-y-4">
          {selectedDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
              
              {/* Document Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {selectedDoc.id}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Ver {selectedDoc.currentVersion}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border flex items-center space-x-1 ${getStatusBadge(selectedDoc.status).bg}`}>
                      {getStatusBadge(selectedDoc.status).icon}
                      <span>{getStatusBadge(selectedDoc.status).label}</span>
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
                    {selectedDoc.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2">
                    <span>Reference: <strong className="text-slate-700">{selectedDoc.docNumber}</strong></span>
                    <span>•</span>
                    <span>Authority: <strong className="text-slate-700">{selectedDoc.issuedBy}</strong></span>
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title="Full Document Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Doc</span>
                  </button>

                  <button
                    onClick={() => setIsVersionModalOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title="Version History & Upload Revisions"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Versions ({selectedDoc.versions?.length || 1})</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(selectedDoc)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Download Official Certified PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Land Parcel / ULPIN:</span>
                    <span className="font-mono font-bold text-indigo-700">{selectedDoc.ulpin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Survey / Khasra No:</span>
                    <span className="font-bold text-slate-800">{selectedDoc.surveyNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Khata / Ledger No:</span>
                    <span className="font-bold text-slate-800">{selectedDoc.khataNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Recorded Owner:</span>
                    <span className="font-bold text-slate-900">{selectedDoc.ownerName}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Urban Local Body (ULB):</span>
                    <span className="font-bold text-slate-800">{selectedDoc.municipality}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Acquisition Project:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">{selectedDoc.project}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Governing Statutory Act:</span>
                    <span className="font-semibold text-emerald-800">{selectedDoc.content?.statutoryAct || 'RFCTLARR Act 2013'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Last Modified:</span>
                    <span className="font-mono text-slate-600">{selectedDoc.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Digital Signature & Endorsement Panel */}
              <div className={`p-4 rounded-xl border transition-all ${
                selectedDoc.digitalSignature?.isSigned
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-amber-50/60 border-amber-300'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedDoc.digitalSignature?.isSigned
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-amber-500 text-white shadow-sm'
                    }`}>
                      {selectedDoc.digitalSignature?.isSigned ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <FileSignature className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          {selectedDoc.digitalSignature?.isSigned
                            ? 'DIGITALLY SIGNED (CLASS-3 DSC)'
                            : 'AWAITING DIGITAL SIGNATURE'}
                        </h4>
                        {selectedDoc.digitalSignature?.isSigned && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            LEGAL GAZETTE READY
                          </span>
                        )}
                      </div>

                      {selectedDoc.digitalSignature?.isSigned ? (
                        <p className="text-[11px] text-emerald-900 mt-0.5">
                          Signed by <strong>{selectedDoc.digitalSignature.signedBy}</strong> ({selectedDoc.digitalSignature.designation}) on <em>{selectedDoc.digitalSignature.timestamp}</em>
                          <br />
                          <span className="font-mono text-[10px] text-emerald-700">
                            Cert Serial: {selectedDoc.digitalSignature.certSerial} • SHA-256 with RSA 2048
                          </span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Document is not digitally signed. Apply your official Municipal Officer DSC eSign certificate to authenticate.
                        </p>
                      )}
                    </div>
                  </div>

                  {!selectedDoc.digitalSignature?.isSigned && (
                    <button
                      onClick={() => setIsSignModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign with DSC</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Bar: Approve / Reject / Sign / Audit */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsApproveModalOpen(true)}
                    disabled={selectedDoc.status === 'APPROVED'}
                    className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
                      selectedDoc.status === 'APPROVED'
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedDoc.status === 'APPROVED' ? 'Approved' : 'Approve Document'}</span>
                  </button>

                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={selectedDoc.status === 'REJECTED'}
                    className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
                      selectedDoc.status === 'REJECTED'
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 cursor-pointer'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{selectedDoc.status === 'REJECTED' ? 'Rejected' : 'Reject / Flag Defect'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsActivityModalOpen(true)}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Audit Trail ({selectedDoc.activityHistory?.length || 0})</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity History Accordion */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <History className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Recent Activity & Scrutiny Log
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsActivityModalOpen(true)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    View Complete Audit Log →
                  </button>
                </div>

                <div className="space-y-2">
                  {(selectedDoc.activityHistory || []).slice(0, 3).map((act, idx) => (
                    <div
                      key={act.id || idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{act.action}</span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-600">{act.by}</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{act.notes}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
              <h3 className="text-sm font-bold text-slate-700">No Document Selected</h3>
              <p className="text-xs text-slate-400 mt-1">Select a document from the left list or upload a new record</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: HIGH FIDELITY STATUTORY DOCUMENT PREVIEW                         */}
      {/* ========================================================================= */}
      {isPreviewModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight">
                    STATUTORY DOCUMENT PREVIEW • {selectedDoc.id}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Sovereign e-Gazette & DILRMP 3.0 Verified Record
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadPDF(selectedDoc)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>

                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content View - Styled as Official Gazette Page */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
              
              {/* Sovereign Gazette Header */}
              <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-xs text-center space-y-2 relative overflow-hidden">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-500 font-bold">
                  {selectedDoc.currentVersion}
                </div>

                <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-black shadow-sm">
                  <Award className="w-6 h-6" />
                </div>

                <div className="space-y-0.5">
                  <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-900">
                    GOVERNMENT OF INDIA • COMPETENT AUTHORITY LAND ACQUISITION (CALA)
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Urban Local Body Nodal Office: {selectedDoc.municipality}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    NATIONAL HIGHWAYS ACT, 1956 & RFCTLARR ACT, 2013 • DILRMP 3.0
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {selectedDoc.title}
                  </h1>
                  <p className="text-xs font-mono font-bold text-indigo-700 mt-0.5">
                    Gazette / Reference No: {selectedDoc.docNumber}
                  </p>
                </div>
              </div>

              {/* Statutory Abstract & Acts */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                  1. Statutory Context & Legal Authority
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedDoc.content?.summary || 'Standard gazette land acquisition notification for corridor right-of-way expansion.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Governing Statutory Act</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.content?.statutoryAct || 'RFCTLARR Act 2013'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Project Corridor</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.project}</span>
                  </div>
                </div>
              </div>

              {/* Schedule of Land Parcel */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                  2. Schedule of Demarcated Land Parcel
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5">Plot / Survey No</th>
                        <th className="p-2.5">Khata No</th>
                        <th className="p-2.5">ULPIN</th>
                        <th className="p-2.5">Owner(s)</th>
                        <th className="p-2.5">Area</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold font-mono text-slate-900">{selectedDoc.surveyNo}</td>
                        <td className="p-2.5 font-mono text-slate-700">{selectedDoc.khataNo}</td>
                        <td className="p-2.5 font-mono text-indigo-700">{selectedDoc.ulpin}</td>
                        <td className="p-2.5 font-semibold text-slate-800">{selectedDoc.ownerName}</td>
                        <td className="p-2.5 font-bold text-slate-800">0.48 Ha</td>
                        <td className="p-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadge(selectedDoc.status).bg}`}>
                            {selectedDoc.status}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Digital Signature Seal Display */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                  3. Official Attestation & Digital Signature
                </h4>
                {selectedDoc.digitalSignature?.isSigned ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs text-emerald-900">
                      <div className="font-black text-emerald-800 uppercase tracking-wider">
                        CERTIFIED DIGITALLY SIGNED DOCUMENT
                      </div>
                      <p className="font-semibold">
                        Signatory: {selectedDoc.digitalSignature.signedBy} ({selectedDoc.digitalSignature.designation})
                      </p>
                      <p className="font-mono text-[11px] text-emerald-700">
                        Certificate Serial: {selectedDoc.digitalSignature.certSerial} • Authority: NIC Certifying Authority
                      </p>
                      <p className="font-mono text-[10px] text-emerald-600">
                        Timestamp: {selectedDoc.digitalSignature.timestamp} • SHA-256 with RSA 2048-bit
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 text-xs text-amber-900">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>This document does not carry an electronic DSC signature yet.</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsPreviewModalOpen(false);
                        setIsSignModalOpen(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Sign with DSC Now
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-white px-5 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-mono">
                Verified against DILRMP 3.0 Core Registry
              </span>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UPLOAD LAND ACQUISITION DOCUMENT                                 */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    UPLOAD LAND ACQUISITION DOCUMENT
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Ingest statutory Gazette, Survey Maps, Revenue Khatauni or NOC into LAO Repository
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleUploadDocument} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              
              {/* Drag and drop simulated file upload box */}
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-5 text-center bg-indigo-50/40 hover:bg-indigo-50/70 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-indigo-600 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-800">
                  Drag and drop Land Acquisition document here, or <span className="text-indigo-600 underline cursor-pointer">browse file</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports PDF, DWG, GeoJSON, TIFF, Scanned Land Records up to 50 MB
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Section 3A e-Gazette Notification"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Document / Gazette Ref Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., S.O. 1482(E)/2026/MoRTH"
                    value={uploadForm.docNumber}
                    onChange={(e) => setUploadForm({ ...uploadForm, docNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Statutory Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    <option value="GAZETTE_NOTIFICATION">Gazette Notification (Sec 3A/3D)</option>
                    <option value="REVENUE_RECORD">Revenue Record / Khatauni</option>
                    <option value="AWARD_DETERMINATION">Solatium Award (Sec 3G)</option>
                    <option value="SURVEY_MAP">Cadastral Survey Map</option>
                    <option value="STATUTORY_NOC">Town Planning NOC</option>
                    <option value="LEGAL_DOCUMENT">Legal & Court Stay Affidavits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., MoRTH / District Collectorate"
                    value={uploadForm.issuedBy}
                    onChange={(e) => setUploadForm({ ...uploadForm, issuedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Link to Land Parcel (Property ID)
                  </label>
                  <select
                    value={uploadForm.parcelId}
                    onChange={(e) => {
                      const selProp = properties.find(p => p.propertyId === e.target.value);
                      if (selProp) {
                        setUploadForm({
                          ...uploadForm,
                          parcelId: selProp.propertyId,
                          ulpin: selProp.ulpin,
                          surveyNo: selProp.surveyNo,
                          khataNo: selProp.khataNo,
                          ownerName: selProp.ownerName,
                          municipality: selProp.municipality
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    {properties.map(p => (
                      <option key={p.propertyId} value={p.propertyId}>
                        {p.propertyId} ({p.ownerName}) - Survey {p.surveyNo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ULPIN ID
                  </label>
                  <input
                    type="text"
                    value={uploadForm.ulpin}
                    onChange={(e) => setUploadForm({ ...uploadForm, ulpin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-indigo-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">
                  Summary & Statutory Clauses
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of notification clauses, boundaries, or inspection grounds..."
                  value={uploadForm.summary}
                  onChange={(e) => setUploadForm({ ...uploadForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Register & Ingest Document</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VERSION HISTORY & UPLOAD NEW REVISION                             */}
      {/* ========================================================================= */}
      {isVersionModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">
                  <History className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    VERSION CONTROL & REVISIONS • {selectedDoc.id}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Immutable history of drafts, gazette publications, and survey amendments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              
              {/* Upload New Version Section */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                    Upload New Document Revision
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-800">
                    Next: v{(parseFloat(selectedDoc.currentVersion.replace('v', '')) + 0.1).toFixed(1)}
                  </span>
                </div>

                <textarea
                  rows={2}
                  placeholder="Describe revisions (e.g., Added Gazette Notification S.O. number, rectified survey boundary...)"
                  value={newVersionNotes}
                  onChange={(e) => setNewVersionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-indigo-800 font-medium">
                    New version will be appended to the immutable version ledger
                  </span>
                  <button
                    onClick={handleUploadNewVersion}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Version</span>
                  </button>
                </div>
              </div>

              {/* Version History List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Version Timeline
                </h4>

                <div className="space-y-3">
                  {(selectedDoc.versions || []).map((ver, idx) => (
                    <div
                      key={ver.version || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        idx === 0
                          ? 'bg-white border-indigo-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                            {ver.version}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                              CURRENT ACTIVE
                            </span>
                          )}
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs font-semibold text-slate-700">{ver.uploadedBy}</span>
                        </div>

                        <span className="font-mono text-[10px] text-slate-400">
                          {ver.date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 font-medium">
                        {ver.changeNotes}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-3 pt-2 border-t border-slate-100">
                        <span>Size: {ver.fileSize || '2.8 MB'}</span>
                        <span>Checksum: {ver.checksum}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="bg-white px-5 py-3 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DIGITAL SIGNATURE (CLASS-3 DSC / AADHAAR ESIGN)                  */}
      {/* ========================================================================= */}
      {isSignModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    CLASS-3 DIGITAL SIGNATURE (DSC)
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    CCA Accredited • NIC Certifying Authority
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Signing Officer:</span>
                  <span className="font-bold text-slate-900">{officerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Designation:</span>
                  <span className="font-bold text-slate-800">{officerRole}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Certifying Authority:</span>
                  <span className="font-semibold text-emerald-700">NIC-CA / e-Mudhra Class 3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Algorithm:</span>
                  <span className="font-mono text-slate-700">SHA-256 with RSA 2048-bit</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">
                  Officer DSC Token Security PIN *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={officerPin}
                    onChange={(e) => setOfficerPin(e.target.value)}
                    placeholder="Enter 4-6 digit hardware token PIN"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Default simulation PIN: <strong>8842</strong>
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                Applying DSC will compute the SHA-256 hash of this statutory document and lock it from unauthorized modifications.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSignModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyDigitalSignature}
                  disabled={isSigning}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-2"
                >
                  {isSigning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Hashing & Signing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticate & Sign</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: APPROVE DOCUMENT ACTION                                          */}
      {/* ========================================================================= */}
      {isApproveModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <h3 className="text-sm font-bold tracking-tight">
                  ENDORSE STATUTORY APPROVAL
                </h3>
              </div>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              <p className="text-slate-700">
                You are endorsing statutory approval for <strong>{selectedDoc.title}</strong> ({selectedDoc.id}) under {selectedDoc.content?.statutoryAct || 'RFCTLARR Act 2013'}.
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Official Endorsement Remarks
                </label>
                <textarea
                  rows={3}
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Masterplan zoning verified, setbacks compliant, and Solatium calculation audited..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs"
                />
              </div>

              {!selectedDoc.digitalSignature?.isSigned && (
                <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSignOnApprove}
                    onChange={(e) => setAutoSignOnApprove(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] font-bold text-emerald-900">
                    Simultaneously apply Officer Class-3 DSC Digital Seal
                  </span>
                </label>
              )}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveDocument}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Approval</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: REJECT / DEFECT MEMORANDUM ACTION                                */}
      {/* ========================================================================= */}
      {isRejectModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-rose-700 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-rose-200" />
                <h3 className="text-sm font-bold tracking-tight">
                  ISSUE STATUTORY REJECTION / DEFECT NOTICE
                </h3>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-rose-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Statutory Rejection Ground *
                </label>
                <select
                  value={rejectionGround}
                  onChange={(e) => setRejectionGround(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium bg-white text-xs"
                >
                  <option value="Right-of-Way Buffer Encroachment">Right-of-Way Corridor Buffer Encroachment</option>
                  <option value="Title Deed Ownership Mismatch">Title Deed / Khatauni Ownership Mismatch</option>
                  <option value="Outstanding Municipal Taxes / Dues">Outstanding Municipal Property Taxes / Dues</option>
                  <option value="High Court / Revenue Court Stay">High Court / Revenue Court Stay Active</option>
                  <option value="DGPS Boundary Demarcation Mismatch">DGPS Boundary Demarcation Discrepancy</option>
                  <option value="Unapproved Master Plan Zoning">Unapproved Master Plan Zoning / Bylaw Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Defect Memorandum & Legal Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionRemarks}
                  onChange={(e) => setRejectionRemarks(e.target.value)}
                  placeholder="Specify statutory defects and remedial actions required from the landowner/agency..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-xs"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-800">
                This notice will be logged in the public DILRMP audit repository and communicated to the Competent Authority.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectDocument}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Issue Rejection Notice</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: FULL AUDIT TRAIL & ACTIVITY HISTORY                              */}
      {/* ========================================================================= */}
      {isActivityModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    COMPLETE AUDIT TRAIL • {selectedDoc.id}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Immutable event log of statutory transitions, scrutiny, and approvals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
              {(selectedDoc.activityHistory || []).map((act, idx) => (
                <div
                  key={act.id || idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-xs">{act.action}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-700 font-semibold pl-4">
                    Officer: {act.by}
                  </div>
                  <p className="text-slate-600 text-xs pl-4 leading-relaxed">
                    {act.notes}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white px-5 py-3 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
