// Citizen Portal Mock Data and Helper Functions

export const CITIZEN_NOTIFICATIONS = [
  {
    id: "NOTIF-01",
    type: "COMPENSATION",
    priority: "URGENT",
    title: "Direct Benefit Transfer Credited",
    titleHi: "प्रत्यक्ष लाभ अंतरण (DBT) बैंक में जमा",
    message: "₹2,62,23,750 has been successfully credited to your SBI Account (IFSC: SBIN0001245). Ref: DBT2026091299841.",
    messageHi: "₹2,62,23,750 आपके एसबीआई खाते में सफलतापूर्वक जमा कर दिए गए हैं। संदर्भ: DBT2026091299841.",
    timestamp: "2 hours ago",
    read: false
  },
  {
    id: "NOTIF-02",
    type: "LEGAL",
    priority: "LEGAL",
    title: "Section 3G Award Passed",
    titleHi: "धारा 3G निर्णय पारित",
    message: "Competent Authority has finalized the statutory solatium award with 100% solatium under RFCTLARR Act 2013.",
    messageHi: "सक्षम प्राधिकारी ने RFCTLARR अधिनियम 2013 के तहत 100% तोषणा सहित निर्णय को अंतिम रूप दिया है।",
    timestamp: "2 days ago",
    read: false
  },
  {
    id: "NOTIF-03",
    type: "DOCUMENTS",
    priority: "DOCUMENTS",
    title: "New Document: Section 3E Possession Notice",
    titleHi: "नया दस्तावेज़: धारा 3E कब्जा नोटिस",
    message: "Gazette Notification and Formal Handover certificate uploaded to your Document Vault.",
    messageHi: "राजपत्र अधिसूचना और कब्जा प्रमाण पत्र आपकी दस्तावेज़ तिजोरी में जोड़ दिया गया है।",
    timestamp: "4 days ago",
    read: true
  },
  {
    id: "NOTIF-04",
    type: "GENERAL",
    priority: "GENERAL",
    title: "Bhu-Aadhaar (ULPIN) Verified",
    titleHi: "भू-आधार (ULPIN) सत्यापित",
    message: "Survey plot 45/2A boundary verified by Survey of India drone orthomosaic.",
    messageHi: "सर्वेक्षण प्लॉट 45/2A की सीमा सर्वे ऑफ इंडिया ड्रोन द्वारा सत्यापित कर ली गई है।",
    timestamp: "1 week ago",
    read: true
  }
];

export const CITIZEN_DEADLINES = [
  {
    id: "DL-01",
    title: "Section 3C Objection Window",
    titleHi: "धारा 3C आपत्ति दर्ज करने की खिड़की",
    stage: "LEGAL_OBJECTIONS",
    deadlineDate: "2026-09-28",
    daysRemaining: 13,
    status: "ACTIVE",
    priority: "URGENT",
    actionRequired: "Submit Objection Statement",
    actionRequiredHi: "आपत्ति विवरण जमा करें",
    authority: "Office of District Collector, Gurugram"
  },
  {
    id: "DL-02",
    title: "Statutory Hearing Session",
    titleHi: "वैधानिक सुनवाई सत्र",
    stage: "LEGAL_OBJECTIONS",
    deadlineDate: "2026-10-04",
    daysRemaining: 19,
    status: "SCHEDULED",
    priority: "MEDIUM",
    actionRequired: "Attend Hearing / Upload Documents",
    actionRequiredHi: "सुनवाई में उपस्थित हों / साक्ष्य प्रस्तुत करें",
    authority: "Court of Additional District Magistrate (LAO)"
  },
  {
    id: "DL-03",
    title: "PFMS Bank KYC Verification",
    titleHi: "पीएफएमएस बैंक केवाईसी सत्यापन",
    stage: "COMPENSATION_PROCESS",
    deadlineDate: "2026-09-20",
    daysRemaining: 5,
    status: "COMPLETED",
    priority: "LOW",
    actionRequired: "Verified by State Bank of India",
    actionRequiredHi: "एसबीआई द्वारा सत्यापित",
    authority: "District Treasury & PFMS Cell"
  },
  {
    id: "DL-04",
    title: "Physical Land Handover & Vesting",
    titleHi: "भौतिक भूमि हस्तांतरण एवं निहितिकरण",
    stage: "LAND_HANDOVER",
    deadlineDate: "2026-10-15",
    daysRemaining: 30,
    status: "UPCOMING",
    priority: "MEDIUM",
    actionRequired: "Sign Possession Certificate",
    actionRequiredHi: "कब्जा प्रमाण पत्र पर हस्ताक्षर करें",
    authority: "NHAI Project Implementation Unit (PIU)"
  }
];

export const CITIZEN_DOCUMENTS = [
  {
    id: "DOC-001",
    name: "Section 3A Gazette Intention Notification",
    nameHi: "धारा 3A राजपत्र अधिग्रहण आशय अधिसूचना",
    category: "Gazette Notification",
    issueDate: "2026-04-12",
    authority: "Ministry of Road Transport and Highways",
    fileSize: "1.4 MB",
    verified: true,
    fileType: "PDF"
  },
  {
    id: "DOC-002",
    name: "Section 3D Declaration of Acquisition",
    nameHi: "धारा 3D अधिग्रहण अंतिम घोषणा",
    category: "Declaration",
    issueDate: "2026-06-18",
    authority: "Competent Authority for Land Acquisition (CALA)",
    fileSize: "2.1 MB",
    verified: true,
    fileType: "PDF"
  },
  {
    id: "DOC-003",
    name: "Section 3G Statutory Solatium Award Certificate",
    nameHi: "धारा 3G वैधानिक तोषणा निर्णय प्रमाण पत्र",
    category: "Award Order",
    issueDate: "2026-08-25",
    authority: "Office of District Collector, Gurugram",
    fileSize: "890 KB",
    verified: true,
    fileType: "PDF"
  },
  {
    id: "DOC-004",
    name: "Revenue Record (Jamabandi / ROR - Khata K-1082)",
    nameHi: "जमाबंदी / खतौनी राजस्व रिकॉर्ड (खाता K-1082)",
    category: "Revenue Record",
    issueDate: "2026-03-01",
    authority: "Tehsildar / Revenue Department, Haryana",
    fileSize: "640 KB",
    verified: true,
    fileType: "PDF"
  },
  {
    id: "DOC-005",
    name: "PFMS Direct Benefit Transfer Credit Receipt",
    nameHi: "पीएफएमएस प्रत्यक्ष लाभ अंतरण जमा रसीद",
    category: "Financial Receipt",
    issueDate: "2026-09-08",
    authority: "Public Financial Management System (PFMS)",
    fileSize: "320 KB",
    verified: true,
    fileType: "PDF"
  }
];

export const CITIZEN_LEGAL_CASE = {
  caseId: "CASE-2026-GGM-102",
  status: "UNDER_REVIEW",
  statusLabel: "Under Review / Active Hearing Scheduled",
  statusLabelHi: "समीक्षाधीन / सक्रिय सुनवाई निर्धारित",
  filingDate: "2026-08-14",
  hearingDate: "2026-09-28",
  section: "Section 3C (The National Highways Act 1956 / RFCTLARR 2013)",
  issue: "Title & Co-Sharer Partition Dispute (Khata K-1082)",
  issueHi: "स्वामित्व एवं सह-खातेदार विभाजन विवाद (खाता K-1082)",
  description: "Objection submitted regarding tree asset valuation of 14 mature Sheesham trees and demarcation of common passage adjoining Plot 45/2A.",
  descriptionHi: "प्लॉट 45/2A से सटे 14 शीशम के वृक्षों के मूल्यांकन और साझे रास्ते के सीमांकन के संबंध में आपत्ति दर्ज की गई।",
  assignedAuthority: "Shri S.K. Verma (Legal Nodal Officer, LAO Gurugram)",
  lastUpdate: "10 September 2026",
  timeline: [
    { step: 1, title: "Objection Filed", titleHi: "आपत्ति दर्ज की गई", date: "14 Aug 2026", done: true },
    { step: 2, title: "Field Surveyor Review", titleHi: "क्षेत्रीय सर्वेक्षक समीक्षा", date: "24 Aug 2026", done: true },
    { step: 3, title: "Hearing Scheduled", titleHi: "सुनवाई निर्धारित", date: "28 Sep 2026", done: false, active: true },
    { step: 4, title: "Final Order Determination", titleHi: "अंतिम आदेश निर्धारण", date: "Expected Oct 2026", done: false },
    { step: 5, title: "Case Settlement & Award Release", titleHi: "मामला निस्तारण एवं राशि विमुक्ति", date: "Pending", done: false }
  ]
};

export const AUTHORITY_OFFICE_DETAILS = {
  officeName: "Office of District Collector & Competent Authority (CALA)",
  officeNameHi: "कार्यालय जिला उपायुक्त एवं सक्षम प्राधिकारी (CALA)",
  district: "Gurugram, Haryana",
  officerName: "Shri Vikramaditya Singh, IAS",
  designation: "District Collector / Competent Authority for Land Acquisition",
  phone: "+91 (0124) 232-5501 / +91 (0124) 232-1142",
  email: "dc-gurugram@hry.gov.in / cala-nh48@nhai.org",
  officeAddress: "Mini Secretariat, 2nd Floor, Civil Lines, Gurugram, Haryana - 122001",
  workingHours: "Monday to Friday: 10:00 AM – 5:00 PM (Public Hearings: 11:00 AM – 1:00 PM)",
  nodalOfficer: {
    name: "Er. Anish Kumar",
    designation: "District GIS & Land Nodal Coordinator",
    phone: "+91 98112-44590",
    email: "nodal.gurugram@soi.gov.in"
  },
  helpline: "1800-180-2026 (Toll Free National Land Helpline)"
};

export const DATA_PRIVACY_MATRIX = [
  {
    recordType: "Land Ownership & Jamabandi Khata",
    recordTypeHi: "भूमि स्वामित्व एवं जमाबंदी खाता",
    districtOfficer: true,
    financeOfficer: true,
    legalOfficer: true,
    publicAccess: false,
    statutoryBasis: "Digital India Land Records Modernization Programme (DILRMP)"
  },
  {
    recordType: "Aadhaar & Personal Bank Account Details",
    recordTypeHi: "आधार एवं व्यक्तिगत बैंक खाता विवरण",
    districtOfficer: false,
    financeOfficer: true,
    legalOfficer: false,
    publicAccess: false,
    statutoryBasis: "Aadhaar Act 2016 & PFMS Direct Benefit Transfer Guidelines"
  },
  {
    recordType: "Compensation Calculation & Solatium Award",
    recordTypeHi: "मुआवजा गणना एवं तोषणा निर्णय",
    districtOfficer: true,
    financeOfficer: true,
    legalOfficer: true,
    publicAccess: false,
    statutoryBasis: "RFCTLARR Act 2013 Section 30 & 3G Orders"
  },
  {
    recordType: "Objection Statements & Legal Dispute Notes",
    recordTypeHi: "आपत्ति विवरण एवं कानूनी विवाद नोट्स",
    districtOfficer: true,
    financeOfficer: false,
    legalOfficer: true,
    publicAccess: false,
    statutoryBasis: "Section 3C Judicial Hearing Rules"
  },
  {
    recordType: "Gazette Public Acquisition Notification (Sec 3A)",
    recordTypeHi: "राजपत्र सार्वजनिक अधिग्रहण अधिसूचना (धारा 3A)",
    districtOfficer: true,
    financeOfficer: true,
    legalOfficer: true,
    publicAccess: true,
    statutoryBasis: "The Gazette of India Public Record"
  }
];

// Helper: Determine next action dynamically based on parcel status
export function getNextActionDetails(status, parcel) {
  switch (status) {
    case 'LAND_IDENTIFICATION':
      return {
        stageTitle: "Stage 01: Land Identification & ULPIN Mapping",
        stageTitleHi: "चरण 01: भूमि पहचान एवं भू-आधार (ULPIN) मैपिंग",
        currentStatus: "Plot identified for infrastructure corridor.",
        currentStatusHi: "बुनियादी ढांचा गलियारे के लिए प्लॉट चिह्नित किया गया है।",
        nextAction: "Field Surveyor boundary verification & GIS drone mapping.",
        nextActionHi: "क्षेत्रीय सर्वेक्षक द्वारा सीमा सत्यापन एवं जीआईएस ड्रोन मैपिंग।",
        responsibleAuthority: "Survey of India & Revenue Tehsildar",
        responsibleAuthorityHi: "सर्वे ऑफ इंडिया एवं राजस्व तहसीलदार",
        timeline: "7–10 Working Days",
        timelineHi: "7–10 कार्य दिवस",
        actionBtnText: "View Parcel on Map",
        actionBtnTextHi: "मानचित्र पर प्लॉट देखें",
        targetTab: "gis"
      };
    case 'LAND_VERIFICATION':
      return {
        stageTitle: "Stage 02: Revenue Record & Encumbrance Verification",
        stageTitleHi: "चरण 02: राजस्व रिकॉर्ड एवं भारमुक्ति सत्यापन",
        currentStatus: "Khata records and title deed under verification.",
        currentStatusHi: "खाता रिकॉर्ड और मालिकाना हक की जांच चल रही है।",
        nextAction: "Submission of bank details & Aadhaar authentication.",
        nextActionHi: "बैंक विवरण एवं आधार प्रमाणीकरण जमा करना।",
        responsibleAuthority: "Office of District Land Acquisition Officer",
        responsibleAuthorityHi: "कार्यालय जिला भू-अधिग्रहण अधिकारी",
        timeline: "5–7 Working Days",
        timelineHi: "5–7 कार्य दिवस",
        actionBtnText: "Upload Bank Verification",
        actionBtnTextHi: "बैंक विवरण अपलोड करें",
        targetTab: "documents"
      };
    case 'NOTIFICATIONS_NOTICE':
      return {
        stageTitle: "Stage 04: Section 3A Gazette Notification",
        stageTitleHi: "चरण 04: धारा 3A राजपत्र अधिसूचना",
        currentStatus: "Section 3A Gazette Notification published. 21-day objection period active.",
        currentStatusHi: "धारा 3A अधिसूचना प्रकाशित। 21 दिन की आपत्ति अवधि सक्रिय है।",
        nextAction: "Review boundary and submit Section 3C objections if any.",
        nextActionHi: "सीमा की जांच करें और यदि कोई हो तो धारा 3C आपत्ति दर्ज करें।",
        responsibleAuthority: "Competent Authority for Land Acquisition (CALA)",
        responsibleAuthorityHi: "सक्षम प्राधिकारी भू-अधिग्रहण (CALA)",
        timeline: "Objection window closes in 13 days",
        timelineHi: "आपत्ति अवधि 13 दिनों में समाप्त होगी",
        actionBtnText: "Submit Section 3C Objection",
        actionBtnTextHi: "धारा 3C आपत्ति दर्ज करें",
        targetTab: "legal"
      };
    case 'COMPENSATION_PROCESS':
      return {
        stageTitle: "Stage 05: Compensation Calculation & PFMS Verification",
        stageTitleHi: "चरण 05: मुआवजा निर्धारण एवं पीएफएमएस सत्यापन",
        currentStatus: "Compensation award calculated under RFCTLARR Act 2013.",
        currentStatusHi: "RFCTLARR 2013 के अंतर्गत मुआवजे की गणना पूरी हो चुकी है।",
        nextAction: "Direct Benefit Transfer (DBT) bank dispatch approval.",
        nextActionHi: "डीबीटी बैंक प्रेषण अनुमोदन प्रक्रियाधीन है।",
        responsibleAuthority: "District Treasury & PFMS Cell",
        responsibleAuthorityHi: "जिला कोषागार एवं पीएफएमएस शाखा",
        timeline: "3–5 Working Days",
        timelineHi: "3–5 कार्य दिवस",
        actionBtnText: "Track Compensation & DBT",
        actionBtnTextHi: "मुआवजा एवं डीबीटी ट्रैक करें",
        targetTab: "compensation"
      };
    case 'LEGAL_OBJECTIONS':
      return {
        stageTitle: "Stage 06: Legal & Public Objection Resolution",
        stageTitleHi: "चरण 06: कानूनी एवं जन आपत्ति निवारण",
        currentStatus: "Hearing scheduled before the Competent Authority.",
        currentStatusHi: "सक्षम प्राधिकारी के समक्ष सुनवाई निर्धारित है।",
        nextAction: "Attend hearing on 28 September 2026 or upload supporting evidence.",
        nextActionHi: "28 सितंबर 2026 को सुनवाई में उपस्थित हों या साक्ष्य अपलोड करें।",
        responsibleAuthority: "Legal Nodal Officer / District Collector",
        responsibleAuthorityHi: "कानूनी नोडल अधिकारी / जिला कलेक्टर",
        timeline: "Hearing in 13 Days (28 Sep 2026)",
        timelineHi: "सुनवाई 13 दिन में (28 सितंबर 2026)",
        actionBtnText: "View Legal Case Details",
        actionBtnTextHi: "कानूनी मामले का विवरण देखें",
        targetTab: "legal"
      };
    case 'LAND_HANDOVER':
      return {
        stageTitle: "Stage 08: Physical Land Handover & Vesting",
        stageTitleHi: "चरण 08: भौतिक भूमि हस्तांतरण एवं निहितिकरण",
        currentStatus: "100% Compensation disbursed. Possession notice issued.",
        currentStatusHi: "100% मुआवजा जमा हो चुका है। कब्जा सूचना जारी की गई है।",
        nextAction: "Execution of formal Handover Certificate and R&R support clearance.",
        nextActionHi: "औपचारिक कब्जा प्रमाण पत्र पर हस्ताक्षर एवं पुनर्वास सहायता सत्यापन।",
        responsibleAuthority: "NHAI / Project Implementation Unit (PIU)",
        responsibleAuthorityHi: "एनएचएआई / परियोजना क्रियान्वयन इकाई",
        timeline: "Within 14 Calendar Days",
        timelineHi: "14 कैलेंडर दिनों के भीतर",
        actionBtnText: "Download Landowner Report",
        actionBtnTextHi: "भू-स्वामी रिपोर्ट डाउनलोड करें",
        targetTab: "report"
      };
    case 'PROJECT_UTILIZATION':
    default:
      return {
        stageTitle: "Stage 09: Project Corridor Utilization",
        stageTitleHi: "चरण 09: परियोजना गलियारा निर्माण एवं उपयोग",
        currentStatus: "Land successfully vested in the Central Government for expressway construction.",
        currentStatusHi: "एक्सप्रेसवे निर्माण हेतु भूमि केंद्र सरकार में पूर्णतः निहित हो चुकी है।",
        nextAction: "Corridor asset monitoring and ongoing maintenance tracking.",
        nextActionHi: "गलियारा निर्माण निगरानी एवं निरंतर रखरखाव ट्रैकिंग।",
        responsibleAuthority: "Implementing Agency & MoRTH",
        responsibleAuthorityHi: "क्रियान्वयन एजेंसी एवं सड़क परिवहन मंत्रालय",
        timeline: "Completed Lifecycle",
        timelineHi: "पूर्ण जीवनचक्र",
        actionBtnText: "Download Official Certificate",
        actionBtnTextHi: "आधिकारिक प्रमाण पत्र डाउनलोड करें",
        targetTab: "report"
      };
  }
}
