// Comprehensive Dataset for Land Acquisition Officer (LAO) Document Management Module
// Compliant with RFCTLARR Act 2013, National Highways Act 1956, and DILRMP 3.0

export const INITIAL_LAO_DOCUMENTS = [
  {
    id: "LAO-DOC-2026-001",
    title: "Section 3A Statutory e-Gazette Notification",
    docNumber: "S.O. 1482(E)/2026/MoRTH",
    category: "GAZETTE_NOTIFICATION",
    categoryLabel: "Gazette Notification (Sec 3A)",
    project: "Delhi-Mumbai Industrial Corridor (DMIC Expressway Spur)",
    projectId: "PROJ-01",
    parcelId: "PROP-MCG-2026-081",
    ulpin: "06-12-8891-K2M9A4",
    surveyNo: "128/2",
    khataNo: "K-0842",
    ownerName: "Rajesh Kumar Sharma & Brothers",
    municipality: "Municipal Corporation of Gurugram (MCG)",
    village: "Badshahpur, Gurugram",
    issuedBy: "Ministry of Road Transport & Highways (MoRTH) / CALA Gurugram",
    officer: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
    status: "APPROVED",
    currentVersion: "v2.0",
    uploadDate: "2026-09-08 11:30",
    lastUpdated: "2026-09-14 15:20",
    fileType: "PDF",
    fileSize: "3.4 MB",
    digitalSignature: {
      isSigned: true,
      signedBy: "Sanjay Deshmukh",
      designation: "Municipal Officer & LAO Nodal, ULB Gurugram",
      timestamp: "2026-09-14 15:20:44 IST",
      certSerial: "NIC-CA-2026-SHA256-88F104",
      algorithm: "SHA-256 with RSA 2048-bit",
      validTill: "31 Dec 2028"
    },
    versions: [
      {
        version: "v2.0",
        date: "2026-09-14 15:20",
        uploadedBy: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        fileSize: "3.4 MB",
        checksum: "SHA256-e78f99b1a03c442e912d",
        changeNotes: "Final Gazette publication copy with official gazette seal and gazette notification number S.O. 1482(E). Approved by District Collector.",
        status: "APPROVED"
      },
      {
        version: "v1.1",
        date: "2026-09-11 10:45",
        uploadedBy: "Anish Kumar (Senior Surveyor)",
        fileSize: "3.1 MB",
        checksum: "SHA256-44c102a9bb8921df0981",
        changeNotes: "Adjusted corridor right-of-way width from 45m to 60m to include utility duct setbacks following municipal inspection.",
        status: "REVISED"
      },
      {
        version: "v1.0",
        date: "2026-09-08 11:30",
        uploadedBy: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        fileSize: "2.8 MB",
        checksum: "SHA256-11b098f45a1c67890123",
        changeNotes: "Initial draft submitted for Section 3A gazette notification review.",
        status: "SUPERSEDED"
      }
    ],
    activityHistory: [
      {
        id: "ACT-001-4",
        action: "Digitally Signed with DSC",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-14 15:20",
        notes: "Class-3 e-Mudhra NIC DSC applied. Document locked for legal gazette circulation."
      },
      {
        id: "ACT-001-3",
        action: "Statutory Approval Endorsed",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-14 15:15",
        notes: "All municipal setbacks, fire corridor egress, and alignment verified compliant."
      },
      {
        id: "ACT-001-2",
        action: "Version v2.0 Uploaded",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-14 15:00",
        notes: "Updated with Section 3A Gazette number and bilingual notification text."
      },
      {
        id: "ACT-001-1",
        action: "Initial Document Ingestion",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-08 11:30",
        notes: "Document registered in National Land Acquisition Repository under DILRMP 3.0."
      }
    ],
    content: {
      statutoryAct: "Section 3A of National Highways Act, 1956 & RFCTLARR Act 2013",
      notificationNo: "S.O. 1482(E)",
      gazetteDate: "08 September 2026",
      summary: "Notification of intention to acquire urban commercial land parcel for construction of 6-lane elevated DMIC Expressway corridor spur in Gurugram.",
      landSchedule: [
        { plot: "128/2", khata: "K-0842", type: "Commercial", areaHa: 0.48, owner: "Rajesh Kumar Sharma", share: "50%" },
        { plot: "128/2", khata: "K-0842", type: "Commercial", areaHa: 0.48, owner: "Dinesh Kumar Sharma", share: "50%" }
      ],
      objectionPeriodDays: 21,
      competentAuthorityOffice: "Office of the District Revenue Officer & Competent Authority (CALA), Mini Secretariat, Gurugram"
    }
  },
  {
    id: "LAO-DOC-2026-002",
    title: "Khatauni & Land Revenue Title Deeds (Form 7/12)",
    docNumber: "HR-REV-GUR-2026-K1083",
    category: "REVENUE_RECORD",
    categoryLabel: "Revenue Title / Khatauni",
    project: "Delhi-Mumbai Industrial Corridor (DMIC Expressway Spur)",
    projectId: "PROJ-01",
    parcelId: "PROP-MCG-2026-094",
    ulpin: "06-12-8892-M3P9B1",
    surveyNo: "142/4",
    khataNo: "K-1083",
    ownerName: "Sunita Devi & Harish Yadav",
    municipality: "Municipal Corporation of Gurugram (MCG)",
    village: "Badshahpur Extension, Gurugram",
    issuedBy: "Tehsildar & Sub-Divisional Magistrate (Revenue Cell), Gurugram",
    officer: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
    status: "PENDING_SCRUTINY",
    currentVersion: "v1.1",
    uploadDate: "2026-09-12 14:10",
    lastUpdated: "2026-09-15 09:30",
    fileType: "PDF",
    fileSize: "2.1 MB",
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
        version: "v1.1",
        date: "2026-09-15 09:30",
        uploadedBy: "Sunita Devi (Landowner Representative)",
        fileSize: "2.1 MB",
        checksum: "SHA256-789a44b1c20e1189ac34",
        changeNotes: "Uploaded certified Jamabandi copy with updated mutation record #MUT-2024-918.",
        status: "UNDER_REVIEW"
      },
      {
        version: "v1.0",
        date: "2026-09-12 14:10",
        uploadedBy: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        fileSize: "1.9 MB",
        checksum: "SHA256-33d901a88b44c211f012",
        changeNotes: "Initial Khatauni record fetched from Haryana Jamabandi web portal.",
        status: "REVISED"
      }
    ],
    activityHistory: [
      {
        id: "ACT-002-2",
        action: "Defect Scrutiny Raised",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-15 10:15",
        notes: "Pending municipal tax clearance receipt of ₹18,400 required before final statutory endorsement."
      },
      {
        id: "ACT-002-1",
        action: "Document Uploaded",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-12 14:10",
        notes: "Ingested for Khata title verification and legal owner authentication."
      }
    ],
    content: {
      statutoryAct: "Haryana Land Revenue Act, 1887 & DILRMP 3.0",
      notificationNo: "JAMABANDI-2024-25-VOL-14",
      gazetteDate: "12 September 2026",
      summary: "Certified record of rights establishing clear agricultural-residential converted freehold tenure for parcel 142/4.",
      landSchedule: [
        { plot: "142/4", khata: "K-1083", type: "Residential", areaHa: 0.34, owner: "Sunita Devi", share: "50%" },
        { plot: "142/4", khata: "K-1083", type: "Residential", areaHa: 0.34, owner: "Harish Yadav", share: "50%" }
      ],
      objectionPeriodDays: 15,
      competentAuthorityOffice: "Tehsil Office Wazirabad, District Gurugram, Haryana"
    }
  },
  {
    id: "LAO-DOC-2026-003",
    title: "Section 3G RFCTLARR Solatium Award Assessment Statement",
    docNumber: "LAO/AWD/2026/GUR-081",
    category: "AWARD_DETERMINATION",
    categoryLabel: "Solatium Award (Sec 3G)",
    project: "Delhi-Mumbai Industrial Corridor (DMIC Expressway Spur)",
    projectId: "PROJ-01",
    parcelId: "PROP-MCG-2026-081",
    ulpin: "06-12-8891-K2M9A4",
    surveyNo: "128/2",
    khataNo: "K-0842",
    ownerName: "Rajesh Kumar Sharma & Brothers",
    municipality: "Municipal Corporation of Gurugram (MCG)",
    village: "Badshahpur, Gurugram",
    issuedBy: "Land Acquisition Collector & LAO Nodal Committee",
    officer: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
    status: "APPROVED",
    currentVersion: "v1.0",
    uploadDate: "2026-09-13 16:45",
    lastUpdated: "2026-09-14 11:20",
    fileType: "PDF",
    fileSize: "4.2 MB",
    digitalSignature: {
      isSigned: true,
      signedBy: "Sanjay Deshmukh",
      designation: "Municipal Officer & LAO Nodal, ULB Gurugram",
      timestamp: "2026-09-14 11:20:10 IST",
      certSerial: "NIC-CA-2026-SHA256-88F104",
      algorithm: "SHA-256 with RSA 2048-bit",
      validTill: "31 Dec 2028"
    },
    versions: [
      {
        version: "v1.0",
        date: "2026-09-13 16:45",
        uploadedBy: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        fileSize: "4.2 MB",
        checksum: "SHA256-990a11c87e22df091244",
        changeNotes: "Complete statutory award calculation including 100% Solatium, 12% additional interest component, and asset valuation.",
        status: "APPROVED"
      }
    ],
    activityHistory: [
      {
        id: "ACT-003-2",
        action: "Digitally Signed & Endorsed for DBT",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-14 11:20",
        notes: "Total award ₹14.80 Cr endorsed. Dispatched to PFMS portal for direct treasury transfer."
      },
      {
        id: "ACT-003-1",
        action: "Award Statement Generated",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-13 16:45",
        notes: "Computed in compliance with RFCTLARR First Schedule."
      }
    ],
    content: {
      statutoryAct: "Section 3G National Highways Act 1956 read with RFCTLARR First Schedule 2013",
      notificationNo: "AWARD-2026/09/DMIC-081",
      gazetteDate: "13 September 2026",
      summary: "Determination of market value ₹12.5 Cr + 100% Solatium + 12% statutory interest amounting to final approved award of ₹14.80 Crores.",
      landSchedule: [
        { plot: "128/2", baseValueCr: 6.25, solatiumCr: 6.25, interestCr: 2.30, totalCr: 14.80 }
      ],
      objectionPeriodDays: 30,
      competentAuthorityOffice: "Office of the Land Acquisition Collector, Mini Secretariat, Gurugram"
    }
  },
  {
    id: "LAO-DOC-2026-004",
    title: "High Court Section 3C Interim Stay & Objection Affidavit",
    docNumber: "WP(C)-9011/2026-DHC",
    category: "LEGAL_DOCUMENT",
    categoryLabel: "Legal & Dispute Record",
    project: "Delhi-Mumbai Industrial Corridor (DMIC Expressway Spur)",
    projectId: "PROJ-01",
    parcelId: "PROP-NDMC-2026-102",
    ulpin: "06-12-8893-X7L1C9",
    surveyNo: "112/1",
    khataNo: "K-4401",
    ownerName: "Gurdeep Singh Sandhu",
    municipality: "New Delhi Municipal Council (NDMC / DDA Area)",
    village: "Tughlakabad Aerocity Spur",
    issuedBy: "High Court of Delhi (Writ Petition Civil Cell)",
    officer: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
    status: "REJECTED",
    currentVersion: "v1.0",
    uploadDate: "2026-09-10 12:40",
    lastUpdated: "2026-09-10 13:05",
    fileType: "PDF",
    fileSize: "1.8 MB",
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
        version: "v1.0",
        date: "2026-09-10 12:40",
        uploadedBy: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        fileSize: "1.8 MB",
        checksum: "SHA256-55a0198e33f218765412",
        changeNotes: "High Court interim stay order petition copy uploaded by legal counsel.",
        status: "REJECTED"
      }
    ],
    activityHistory: [
      {
        id: "ACT-004-2",
        action: "Verification Disapproval Notice Issued",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-10 13:05",
        notes: "Clearance rejected under Section 247 of Municipal Act due to severe 8.4m road buffer encroachment and ongoing court stay."
      },
      {
        id: "ACT-004-1",
        action: "Legal Petition Ingestion",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-10 12:40",
        notes: "Uploaded to legal disputes ledger for CALA objection hearing."
      }
    ],
    content: {
      statutoryAct: "Section 3C Objections & High Court Article 226 Stay",
      notificationNo: "CASE-102-DHC",
      gazetteDate: "10 September 2026",
      summary: "Petitioner claims warehouse container shed falls outside expressway buffer; on-site field survey confirms 8.4m unauthorized encroachment on road widening strip.",
      landSchedule: [
        { plot: "112/1", status: "STAY_ACTIVE", areaHa: 0.79, contestedAreaHa: 0.28 }
      ],
      objectionPeriodDays: 0,
      competentAuthorityOffice: "Delhi High Court & CALA South Delhi"
    }
  },
  {
    id: "LAO-DOC-2026-005",
    title: "Cadastral Geo-Demarcation Survey & Benchmark Map",
    docNumber: "DILRMP-CAD-2026-SMC-118",
    category: "SURVEY_MAP",
    categoryLabel: "Cadastral Survey Map",
    project: "Western Dedicated Freight Corridor (WDFC Hub)",
    projectId: "PROJ-02",
    parcelId: "PROP-SMC-2026-118",
    ulpin: "24-08-3319-P5W2K7",
    surveyNo: "88/2",
    khataNo: "K-2290",
    ownerName: "Vikramaditya Infrastructure & Logistics Ltd",
    municipality: "Surat Municipal Corporation (SMC)",
    village: "Surat East Industrial Hub",
    issuedBy: "Survey of India & Directorate of Land Records, Gujarat",
    officer: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
    status: "APPROVED",
    currentVersion: "v1.2",
    uploadDate: "2026-09-09 10:15",
    lastUpdated: "2026-09-11 11:30",
    fileType: "PDF",
    fileSize: "6.8 MB",
    digitalSignature: {
      isSigned: true,
      signedBy: "Sanjay Deshmukh",
      designation: "Municipal Officer & LAO Nodal, ULB Surat",
      timestamp: "2026-09-11 11:30:15 IST",
      certSerial: "NIC-CA-2026-SHA256-99A401",
      algorithm: "SHA-256 with RSA 2048-bit",
      validTill: "31 Dec 2028"
    },
    versions: [
      {
        version: "v1.2",
        date: "2026-09-11 11:30",
        uploadedBy: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        fileSize: "6.8 MB",
        checksum: "SHA256-aabbcc11223344556677",
        changeNotes: "DGPS differential GPS coordinates reconciled with Gujarat GIS portal. Peg monuments 1 through 8 certified.",
        status: "APPROVED"
      },
      {
        version: "v1.0",
        date: "2026-09-09 10:15",
        uploadedBy: "Anish Kumar (Senior Surveyor)",
        fileSize: "5.5 MB",
        checksum: "SHA256-00112233445566778899",
        changeNotes: "Preliminary drone survey orthomosaic plot.",
        status: "SUPERSEDED"
      }
    ],
    activityHistory: [
      {
        id: "ACT-005-2",
        action: "Cadastral Alignment Digitally Endorsed",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-11 11:30",
        notes: "Boundary markers verified intact on-site. Award disbursement cleared."
      },
      {
        id: "ACT-005-1",
        action: "Survey Map Ingested",
        by: "Anish Kumar (Senior Surveyor)",
        timestamp: "2026-09-09 10:15",
        notes: "Integrated with ULPIN database."
      }
    ],
    content: {
      statutoryAct: "DILRMP 3.0 & Survey Act of India",
      notificationNo: "SMC-SURVEY-2026-09",
      gazetteDate: "11 September 2026",
      summary: "Cadastral demarcation map validating 1.16 Ha industrial parcel with 9.0m front industrial setback compliant with Surat masterplan.",
      landSchedule: [
        { plot: "88/2", areaHa: 1.16, surveyStatus: "SURVEY_COMPLETED", dgpsVerified: true }
      ],
      objectionPeriodDays: 30,
      competentAuthorityOffice: "Office of the CALA, Surat District Collectorate"
    }
  },
  {
    id: "LAO-DOC-2026-006",
    title: "Town Planning No-Objection Certificate (NOC)",
    docNumber: "SMC/TP/2026/IND-442",
    category: "STATUTORY_NOC",
    categoryLabel: "Town Planning NOC",
    project: "Western Dedicated Freight Corridor (WDFC Hub)",
    projectId: "PROJ-02",
    parcelId: "PROP-SMC-2026-118",
    ulpin: "24-08-3319-P5W2K7",
    surveyNo: "88/2",
    khataNo: "K-2290",
    ownerName: "Vikramaditya Infrastructure & Logistics Ltd",
    municipality: "Surat Municipal Corporation (SMC)",
    village: "Surat East Industrial Hub",
    issuedBy: "Chief Town Planner, Surat Municipal Corporation",
    officer: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
    status: "APPROVED",
    currentVersion: "v1.0",
    uploadDate: "2026-09-11 12:00",
    lastUpdated: "2026-09-11 12:30",
    fileType: "PDF",
    fileSize: "1.5 MB",
    digitalSignature: {
      isSigned: true,
      signedBy: "Sanjay Deshmukh",
      designation: "Municipal Officer & LAO Nodal, ULB Surat",
      timestamp: "2026-09-11 12:30:00 IST",
      certSerial: "NIC-CA-2026-SHA256-99A401",
      algorithm: "SHA-256 with RSA 2048-bit",
      validTill: "31 Dec 2028"
    },
    versions: [
      {
        version: "v1.0",
        date: "2026-09-11 12:00",
        uploadedBy: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        fileSize: "1.5 MB",
        checksum: "SHA256-ccddeeff112233445566",
        changeNotes: "Town planning NOC signed after verifying master plan land use compatibility.",
        status: "APPROVED"
      }
    ],
    activityHistory: [
      {
        id: "ACT-006-1",
        action: "Digital NOC Issued",
        by: "Sanjay Deshmukh (Municipal Officer / LAO Nodal)",
        timestamp: "2026-09-11 12:30",
        notes: "Town planning statutory clearance granted for railway corridor handover."
      }
    ],
    content: {
      statutoryAct: "Gujarat Town Planning and Urban Development Act 1976",
      notificationNo: "SMC-NOC-442-2026",
      gazetteDate: "11 September 2026",
      summary: "Unconditional clearance certificate confirming that acquisition parcel adheres to industrial zoning norms.",
      landSchedule: [
        { plot: "88/2", zoning: "Industrial", clearance: "FULL_NOC_GRANTED" }
      ],
      objectionPeriodDays: 0,
      competentAuthorityOffice: "Town Planning Cell, Surat Municipal Corporation"
    }
  }
];

export const LAO_DOCUMENT_CATEGORIES = [
  { id: "ALL", label: "All Document Types" },
  { id: "GAZETTE_NOTIFICATION", label: "Gazette Notifications (Sec 3A/3D)" },
  { id: "REVENUE_RECORD", label: "Revenue Titles & Khatauni" },
  { id: "AWARD_DETERMINATION", label: "Solatium Awards (Sec 3G)" },
  { id: "SURVEY_MAP", label: "Cadastral Survey & Geo-Maps" },
  { id: "STATUTORY_NOC", label: "Town Planning & Environmental NOCs" },
  { id: "LEGAL_DOCUMENT", label: "Legal & Court Stay Affidavits" }
];
