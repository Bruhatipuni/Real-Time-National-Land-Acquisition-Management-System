// Comprehensive BHOOMISETU National Land Acquisition & Management Mock Dataset

export const STAGES_LIST = [
  { id: 'IDENTIFIED', step: '01', title: 'Land Identification', desc: 'Survey plot boundary mapping, ULPIN Bhu-Aadhaar assignment & GIS tagging', slaDays: 30 },
  { id: 'VERIFICATION', step: '02', title: 'Land Verification', desc: 'Encumbrance check, Khata record verification, ownership proof validation', slaDays: 45 },
  { id: 'SURVEY', step: '03', title: 'Cadastral & Drone Survey', desc: 'High-precision DGPS/drone survey, tree & structural asset enumeration', slaDays: 30 },
  { id: 'PROPOSAL', step: '04', title: 'Acquisition Proposal', desc: 'Implementing agency corridor alignment submission & nodal scrutiny', slaDays: 20 },
  { id: 'APPROVAL', step: '05', title: 'Administrative Approval', desc: 'Competent Authority & Central Ministry corridor in-principle sanction', slaDays: 30 },
  { id: 'NOTIFICATION', step: '06', title: 'Gazette Notifications', desc: 'Section 3A / 3D statutory e-Gazette publication & public stakeholder notice', slaDays: 30 },
  { id: 'OBJECTION', step: '07', title: 'Objections & Hearings', desc: 'Section 3C public objection hearings, High Court stay tracking & dispute radar', slaDays: 45 },
  { id: 'COMPENSATION', step: '08', title: 'Compensation & Solatium', desc: 'RFCTLARR 2013 100% solatium award calculation & PFMS DBT bank disbursal', slaDays: 60 },
  { id: 'POSSESSION', step: '09', title: 'Possession & Vesting', desc: 'Physical possession certificate handover & statutory land vesting order', slaDays: 30 },
  { id: 'TRANSFER', step: '10', title: 'Inter-Dept Transfer', desc: 'Revenue record mutation & handover to executing project agency', slaDays: 15 },
  { id: 'UTILIZATION', step: '11', title: 'Project Utilization', desc: 'Corridor highway / rail construction & asset development monitoring', slaDays: 90 },
  { id: 'COMPLETED', step: '12', title: 'Completed Project', desc: 'Full corridor commissioned, R&R completed & statutory certificate archived', slaDays: 0 }
];

export const ROLES_LIST = [
  { id: 'SUPER_ADMIN', name: 'Super Admin / Ministry Joint Secretary', level: 'National', scope: 'Full Access across all 11 stages & settings' },
  { id: 'LAND_OFFICER', name: 'Land Nodal Officer', level: 'District/Tehsil', scope: 'Land identification, verification & proposal submission' },
  { id: 'CITIZEN', name: 'Citizen / Landowner Portal', level: 'Public', scope: 'ULPIN lookup, DBT payment status & Section 3C objection filing' }
];

export const PROJECTS_DATA = [
  {
    id: "PROJ-NH48-EXPR",
    name: "Delhi-Mumbai Industrial Expressway (Section IV)",
    corridorName: "Delhi–Mumbai 8-Lane Access-Controlled Greenfield Expressway",
    agency: "National Highways Authority of India (NHAI)",
    ministry: "Ministry of Road Transport and Highways",
    state: "Haryana",
    states: ["Delhi", "Haryana", "Rajasthan", "Madhya Pradesh", "Gujarat", "Maharashtra"],
    districts: ["Gurugram", "Nuh", "Alwar", "Dausa", "Ratlam", "Vadodara"],
    startLocation: "Sohna / DND Flyway (Delhi-NCR)",
    endLocation: "JNPT Port (Mumbai)",
    totalLengthKm: 1386,
    totalParcels: 342,
    acquiredParcels: 284,
    totalAreaHa: 485.5,
    acquiredAreaHa: 398.2,
    totalLandRequired: 485.5,
    landAcquired: 398.2,
    landPending: 87.3,
    acquisitionProgress: 82.0,
    beneficiaries: 1284,
    beneficiariesPaid: 1052,
    compensationTotalCr: 1250.0,
    compensationPaidCr: 940.5,
    compensationPendingCr: 309.5,
    budgetAllocatedCrores: 1250.0,
    budgetDisbursedCrores: 940.5,
    status: "IN_PROGRESS",
    currentStage: "COMPENSATION",
    displacedFamilies: 184,
    rehabilitatedFamilies: 156,
    activeDisputes: 12,
    riskScore: 68,
    riskTier: "MEDIUM",
    delayDays: 38,
    lastUpdated: "2026-09-14",
    centerLat: 28.1487,
    centerLng: 76.9312,
    zoom: 11,
    stageDays: {
      IDENTIFIED: 28,
      VERIFICATION: 40,
      SURVEY: 29,
      PROPOSAL: 18,
      APPROVAL: 25,
      NOTIFICATION: 32,
      OBJECTION: 44,
      COMPENSATION: 72,
      POSSESSION: 0,
      HANDOVER: 0,
      UTILIZATION: 0,
      COMPLETED: 0
    },
    routeCoordinates: [
      [28.5355, 77.2410], // Delhi DND
      [28.4595, 77.0266], // Gurugram
      [28.2520, 77.0650], // Sohna
      [28.1487, 76.9312], // Nuh
      [27.8920, 76.7820], // Ferozepur Jhirka
      [27.5530, 76.6346], // Alwar
      [26.8924, 76.3375], // Dausa
      [25.8010, 75.8200], // Sawai Madhopur
      [25.1800, 75.8300], // Kota
      [24.1200, 75.4000], // Garoth
      [23.3315, 75.0367], // Ratlam
      [22.8000, 74.2500], // Dahod
      [22.3072, 73.1812], // Vadodara
      [21.6500, 73.0100], // Bharuch
      [21.1702, 72.8311], // Surat
      [20.3800, 72.9000], // Vapi
      [19.6967, 72.7699], // Palghar
      [19.2183, 72.9781], // Thane
      [18.9499, 72.9515]  // Mumbai JNPT
    ],
    routeWaypoints: [
      { name: "Delhi (DND Hub)", state: "Delhi", district: "South Delhi", lat: 28.5355, lng: 77.2410, type: "START", chainage: "0.0 km" },
      { name: "Gurugram Interchange", state: "Haryana", district: "Gurugram", lat: 28.4595, lng: 77.0266, type: "WAYPOINT", chainage: "38.2 km" },
      { name: "Nuh Rural Bypass", state: "Haryana", district: "Nuh", lat: 28.1487, lng: 76.9312, type: "WAYPOINT", chainage: "74.6 km" },
      { name: "Alwar Junction", state: "Rajasthan", district: "Alwar", lat: 27.5530, lng: 76.6346, type: "WAYPOINT", chainage: "162.0 km" },
      { name: "Dausa East Spur", state: "Rajasthan", district: "Dausa", lat: 26.8924, lng: 76.3375, type: "WAYPOINT", chainage: "248.5 km" },
      { name: "Ratlam Multi-Modal Node", state: "Madhya Pradesh", district: "Ratlam", lat: 23.3315, lng: 75.0367, type: "WAYPOINT", chainage: "624.0 km" },
      { name: "Vadodara Ring Expressway", state: "Gujarat", district: "Vadodara", lat: 22.3072, lng: 73.1812, type: "WAYPOINT", chainage: "982.0 km" },
      { name: "Mumbai JNPT Port Gate", state: "Maharashtra", district: "Mumbai", lat: 18.9499, lng: 72.9515, type: "END", chainage: "1,386.0 km" }
    ],
    delayBreakdown: [
      { cause: "Compensation processing & PFMS bank validation", percentage: 42, impact: "High", overdueDays: 24 },
      { cause: "Landowner verification & inheritance mutations", percentage: 28, impact: "Medium", overdueDays: 16 },
      { cause: "Section 3C legal review & High Court appeal", percentage: 20, impact: "Medium", overdueDays: 12 },
      { cause: "Forest clearance & utility shifting documentation", percentage: 10, impact: "Low", overdueDays: 6 }
    ],
    timeline: [
      { date: "15 Jan 2026", event: "Land plot identification & DGPS ULPIN boundary mapping completed", authority: "State Land Authority (Haryana)", status: "COMPLETED", docRef: "ULPIN-HAR-8891" },
      { date: "28 Jan 2026", event: "Cadastral drone survey & structural asset valuation finalized", authority: "Surveyor General of India & Tehsildar Sohna", status: "COMPLETED", docRef: "SURVEY-SOH-2026" },
      { date: "14 Feb 2026", event: "Section 3A alignment proposal submitted to Competent Authority", authority: "NHAI Nodal Officer", status: "COMPLETED", docRef: "NHAI-DEL-MUM-P4" },
      { date: "02 Mar 2026", event: "Administrative & environmental in-principle sanction approved", authority: "Ministry of Road Transport and Highways", status: "COMPLETED", docRef: "MORTH-ADM-994" },
      { date: "20 Mar 2026", event: "Section 3A statutory e-Gazette Notification published", authority: "Central Ministry & Gazette of India", status: "COMPLETED", docRef: "GAZETTE-SO-1082" },
      { date: "15 Apr 2026", event: "Section 3C public objections & stakeholder hearings conducted", authority: "Competent Authority for Land Acquisition (CALA)", status: "COMPLETED", docRef: "CALA-NUH-3C-09" },
      { date: "Current", event: "Section 3G Solatium award calculation & PFMS DBT bank disbursal active", authority: "District Collector Gurugram & PFMS Cell", status: "IN_PROGRESS", docRef: "SOLATIUM-AWD-2026" },
      { date: "Pending", event: "Section 3E Physical land possession certificate & vesting handover", authority: "District Collector & NHAI Regional Officer", status: "PENDING", docRef: null }
    ],
    statusHistory: [
      { date: "14 Sep 2026", changedBy: "District Collector Gurugram (CALA)", fromStatus: "NOTICE", toStatus: "COMPENSATION", remarks: "100% Solatium computation finalized under RFCTLARR 2013; DBT bank verification initiated." },
      { date: "20 Aug 2026", changedBy: "Legal Nodal Officer (State Cell)", fromStatus: "OBJECTION", toStatus: "NOTICE", remarks: "Disposed 18 frivolous objections; 2 co-sharer partition cases referred to court escrow." },
      { date: "12 Jul 2026", changedBy: "NHAI Project Director", fromStatus: "APPROVAL", toStatus: "NOTIFICATION", remarks: "Gazette publication under Section 3A e-Gazette repository completed." }
    ],
    disputes: [
      { caseId: "CASE-102", title: "Section 3C Co-Sharer Partition & Title Dispute", court: "High Court of Punjab & Haryana", district: "Nuh", status: "ACTIVE", nextHearing: "28 Sep 2026", affectedHa: 3.1 },
      { caseId: "CASE-108", title: "Commercial Rate Multiplier Re-assessment Appeal", court: "District Sessions Court Gurugram", district: "Gurugram", status: "HEARING_PENDING", nextHearing: "05 Oct 2026", affectedHa: 2.4 },
      { caseId: "CASE-114", title: "Religious Structure Relocation & Resettlement Writ", court: "High Court of Rajasthan", district: "Alwar", status: "RESOLVED", nextHearing: null, affectedHa: 1.2 }
    ],
    documents: [
      { id: "DOC-NH-01", name: "Section 3A Statutory Gazette Notification", type: "GAZETTE_NOTICE", uploadedBy: "MoRTH Central Cell", uploadDate: "2026-03-20", status: "VERIFIED", size: "2.8 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-NH-02", name: "Comprehensive Drone & Cadastral Survey Report", type: "SURVEY_REPORT", uploadedBy: "Surveyor General Agency", uploadDate: "2026-02-05", status: "VERIFIED", size: "14.2 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-NH-03", name: "RFCTLARR 2013 Land Valuation & 100% Solatium Matrix", type: "VALUATION_AWARD", uploadedBy: "CALA Nuh & Gurugram", uploadDate: "2026-08-30", status: "SIGNED", size: "4.6 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-NH-04", name: "High Court Interim Escrow Deposit Order (SO-18)", type: "LEGAL_DOCUMENT", uploadedBy: "State Legal Nodal Cell", uploadDate: "2026-09-02", status: "PENDING_HEARING", size: "1.9 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-NH-05", name: "Corridor Construction Feasibility & Utilization Schedule", type: "PROJECT_REPORT", uploadedBy: "NHAI Project Director", uploadDate: "2026-09-12", status: "APPROVED", size: "8.5 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "PROJ-DFCC-WEST",
    name: "Western Dedicated Freight Corridor (Thane-Palghar Segment)",
    corridorName: "Western Dedicated Freight Rail Corridor (Dadri to JNPT Port)",
    agency: "Dedicated Freight Corridor Corporation of India (DFCCIL)",
    ministry: "Ministry of Railways",
    state: "Maharashtra",
    states: ["Uttar Pradesh", "Haryana", "Rajasthan", "Gujarat", "Maharashtra"],
    districts: ["Palghar", "Thane", "Surat", "Vadodara", "Rewari", "Gautam Buddha Nagar"],
    startLocation: "Dadri Interchange (Uttar Pradesh)",
    endLocation: "JNPT Terminal (Maharashtra)",
    totalLengthKm: 1504,
    totalParcels: 210,
    acquiredParcels: 145,
    totalAreaHa: 310.0,
    acquiredAreaHa: 215.0,
    totalLandRequired: 310.0,
    landAcquired: 215.0,
    landPending: 95.0,
    acquisitionProgress: 69.4,
    beneficiaries: 980,
    beneficiariesPaid: 610,
    compensationTotalCr: 890.0,
    compensationPaidCr: 580.2,
    compensationPendingCr: 309.8,
    budgetAllocatedCrores: 890.0,
    budgetDisbursedCrores: 580.2,
    status: "CRITICAL_BOTTLENECK",
    currentStage: "NOTICE",
    displacedFamilies: 240,
    rehabilitatedFamilies: 120,
    activeDisputes: 28,
    riskScore: 85,
    riskTier: "HIGH",
    delayDays: 84,
    lastUpdated: "2026-09-15",
    centerLat: 19.6967,
    centerLng: 72.7699,
    zoom: 11,
    stageDays: {
      IDENTIFIED: 35,
      VERIFICATION: 55,
      SURVEY: 45,
      PROPOSAL: 25,
      APPROVAL: 40,
      NOTIFICATION: 84,
      OBJECTION: 20,
      COMPENSATION: 0,
      POSSESSION: 0,
      HANDOVER: 0,
      UTILIZATION: 0,
      COMPLETED: 0
    },
    routeCoordinates: [
      [28.5500, 77.5500], // Dadri
      [28.1900, 76.6100], // Rewari
      [27.8000, 75.9000], // Neem Ka Thana
      [26.9124, 75.7873], // Phulera / Jaipur
      [26.1500, 74.3000], // Marwar
      [24.5800, 73.6800], // Abu Road
      [23.0225, 72.5714], // Ahmedabad
      [22.3072, 73.1812], // Vadodara
      [21.1702, 72.8311], // Surat
      [20.3800, 72.9000], // Vapi
      [19.8200, 72.8500], // Dahanu
      [19.6967, 72.7699], // Palghar
      [19.3800, 72.8300], // Vasai
      [19.2183, 72.9781], // Thane
      [18.9499, 72.9515]  // JNPT
    ],
    routeWaypoints: [
      { name: "Dadri Multi-Modal Logistic Hub", state: "Uttar Pradesh", district: "Gautam Buddha Nagar", lat: 28.5500, lng: 77.5500, type: "START", chainage: "0.0 km" },
      { name: "Rewari Freight Yard", state: "Haryana", district: "Rewari", lat: 28.1900, lng: 76.6100, type: "WAYPOINT", chainage: "128.0 km" },
      { name: "Phulera Junction", state: "Rajasthan", district: "Jaipur", lat: 26.9124, lng: 75.7873, type: "WAYPOINT", chainage: "360.0 km" },
      { name: "Ahmedabad Gati Shakti Siding", state: "Gujarat", district: "Ahmedabad", lat: 23.0225, lng: 72.5714, type: "WAYPOINT", chainage: "840.0 km" },
      { name: "Surat Port Feeder", state: "Gujarat", district: "Surat", lat: 21.1702, lng: 72.8311, type: "WAYPOINT", chainage: "1,120.0 km" },
      { name: "Palghar Tribal Corridor", state: "Maharashtra", district: "Palghar", lat: 19.6967, lng: 72.7699, type: "WAYPOINT", chainage: "1,410.0 km" },
      { name: "Thane Urban Rail Bottleneck", state: "Maharashtra", district: "Thane", lat: 19.2183, lng: 72.9781, type: "WAYPOINT", chainage: "1,465.0 km" },
      { name: "JNPT Container Terminal", state: "Maharashtra", district: "Navi Mumbai", lat: 18.9499, lng: 72.9515, type: "END", chainage: "1,504.0 km" }
    ],
    delayBreakdown: [
      { cause: "Gram Sabha & PESA Act Tribal Consent Documentation", percentage: 48, impact: "Critical", overdueDays: 52 },
      { cause: "Bombay High Court CRZ / Mangrove Environmental Clearance", percentage: 32, impact: "High", overdueDays: 34 },
      { cause: "Disputed tree valuation & horticultural enumeration", percentage: 12, impact: "Medium", overdueDays: 14 },
      { cause: "Title verification of joint agricultural holdings", percentage: 8, impact: "Low", overdueDays: 8 }
    ],
    timeline: [
      { date: "10 Nov 2025", event: "Land acquisition proposal notified under Railways Act Section 20A", authority: "Ministry of Railways", status: "COMPLETED", docRef: "RLY-SEC20A-WDFC" },
      { date: "15 Jan 2026", event: "Cadastral field survey in Palghar & Dahanu tehsils completed", authority: "DFCCIL & District Land Cell", status: "COMPLETED", docRef: "SURV-PALGHAR-04" },
      { date: "02 Mar 2026", event: "Section 20E statutory declaration published in e-Gazette", authority: "Central Gazette Authority", status: "COMPLETED", docRef: "GAZETTE-SEC20E-91" },
      { date: "Current", event: "Section 20F solatium award hearings held up due to Gram Sabha PESA objections", authority: "Competent Authority Palghar & DFCCIL", status: "DELAYED", docRef: "PESA-OBJECTION-2026" },
      { date: "Pending", event: "Direct Benefit Transfer disbursal for 370 tribal families", authority: "District Collector Palghar", status: "PENDING", docRef: null }
    ],
    statusHistory: [
      { date: "15 Sep 2026", changedBy: "Principal Secretary (Revenue, Maharashtra)", fromStatus: "APPROVAL", toStatus: "CRITICAL_BOTTLENECK", remarks: "PESA Gram Sabha consent pending in 14 villages; inter-departmental task force constituted." },
      { date: "10 Aug 2026", changedBy: "DFCCIL Managing Director", fromStatus: "NOTICE", toStatus: "DELAYED", remarks: "SLA exceeded by 60 days; requested Chief Secretary emergency escalation." }
    ],
    disputes: [
      { caseId: "CASE-201", title: "PESA Act Tribal Land Acquisition Writ Petition", court: "High Court of Judicature at Bombay", district: "Palghar", status: "ACTIVE", nextHearing: "22 Sep 2026", affectedHa: 42.5 },
      { caseId: "CASE-205", title: "CRZ Mangrove Buffer Zone Alignment Challenge", court: "National Green Tribunal (Western Zone)", district: "Thane", status: "STAY_GRANTED", nextHearing: "01 Oct 2026", affectedHa: 18.2 }
    ],
    documents: [
      { id: "DOC-DF-01", name: "Railways Act Section 20A Gazette Declaration", type: "GAZETTE_NOTICE", uploadedBy: "Railway Board", uploadDate: "2025-11-10", status: "VERIFIED", size: "3.1 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-DF-02", name: "PESA Compliance & Tribal Welfare Report", type: "R_AND_R_PLAN", uploadedBy: "District Collector Palghar", uploadDate: "2026-04-18", status: "UNDER_REVIEW", size: "6.8 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-DF-03", name: "High Court Mangrove Committee Site Inspection Dossier", type: "LEGAL_DOCUMENT", uploadedBy: "State Advocate General", uploadDate: "2026-08-25", status: "PENDING_HEARING", size: "9.4 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "PROJ-REWA-SOLAR",
    name: "Rewa Ultra Mega Solar Park Corridor Expansion",
    corridorName: "Rewa 750 MW Ultra Mega Solar Power Evacuation Corridor",
    agency: "MP Urja Vikas Nigam & SECI",
    ministry: "Ministry of New and Renewable Energy",
    state: "Madhya Pradesh",
    states: ["Madhya Pradesh"],
    districts: ["Rewa", "Satna"],
    startLocation: "Gurh Tehsil Solar Array (Rewa)",
    endLocation: "Satna PGCIL 400kV Substation",
    totalLengthKm: 75,
    totalParcels: 180,
    acquiredParcels: 172,
    totalAreaHa: 620.0,
    acquiredAreaHa: 595.0,
    totalLandRequired: 620.0,
    landAcquired: 595.0,
    landPending: 25.0,
    acquisitionProgress: 96.0,
    beneficiaries: 520,
    beneficiariesPaid: 508,
    compensationTotalCr: 450.0,
    compensationPaidCr: 432.0,
    compensationPendingCr: 18.0,
    budgetAllocatedCrores: 450.0,
    budgetDisbursedCrores: 432.0,
    status: "NEAR_COMPLETION",
    currentStage: "UTILIZATION",
    displacedFamilies: 42,
    rehabilitatedFamilies: 42,
    activeDisputes: 3,
    riskScore: 18,
    riskTier: "LOW",
    delayDays: 0,
    lastUpdated: "2026-09-12",
    centerLat: 24.5362,
    centerLng: 81.3000,
    zoom: 11,
    stageDays: {
      IDENTIFIED: 20,
      VERIFICATION: 25,
      SURVEY: 22,
      PROPOSAL: 15,
      APPROVAL: 18,
      NOTIFICATION: 25,
      OBJECTION: 20,
      COMPENSATION: 30,
      POSSESSION: 22,
      HANDOVER: 15,
      UTILIZATION: 60,
      COMPLETED: 0
    },
    routeCoordinates: [
      [24.4500, 81.4200], // Gurh Tehsil Array
      [24.4800, 81.3800], // Barseta
      [24.5362, 81.3000], // Rewa Central Substation
      [24.5700, 81.1800], // Rampur Baghelan
      [24.5800, 80.8300]  // Satna PGCIL Grid
    ],
    routeWaypoints: [
      { name: "Rewa Solar Park Unit 1 (Gurh)", state: "Madhya Pradesh", district: "Rewa", lat: 24.4500, lng: 81.4200, type: "START", chainage: "0.0 km" },
      { name: "Barseta Power Evacuation Substation", state: "Madhya Pradesh", district: "Rewa", lat: 24.4800, lng: 81.3800, type: "WAYPOINT", chainage: "18.5 km" },
      { name: "Rampur Baghelan Transmission Tower", state: "Madhya Pradesh", district: "Satna", lat: 24.5700, lng: 81.1800, type: "WAYPOINT", chainage: "42.0 km" },
      { name: "Satna PGCIL 400kV Grid Terminal", state: "Madhya Pradesh", district: "Satna", lat: 24.5800, lng: 80.8300, type: "END", chainage: "75.0 km" }
    ],
    delayBreakdown: [
      { cause: "Routine boundary reconciliation for peripheral rocky terrain", percentage: 70, impact: "Low", overdueDays: 0 },
      { cause: "Final bank IFSC code verification for 12 remaining landowners", percentage: 30, impact: "Low", overdueDays: 0 }
    ],
    timeline: [
      { date: "10 Oct 2025", event: "Land acquisition notification for expansion corridor issued", authority: "MP Urja Vikas Nigam", status: "COMPLETED", docRef: "REWA-EXP-01" },
      { date: "28 Nov 2025", event: "Drone survey and private barren land purchase agreements completed", authority: "District Collector Rewa", status: "COMPLETED", docRef: "AGREE-DIR-REWA" },
      { date: "15 Jan 2026", event: "100% Solatium disbursed via direct PFMS treasury transfer", authority: "Finance Department MP", status: "COMPLETED", docRef: "PFMS-MP-7781" },
      { date: "10 Jun 2026", event: "Physical possession certificate handed over to SECI developers", authority: "CALA Rewa & Satna", status: "COMPLETED", docRef: "POSS-CERT-SECI" },
      { date: "Current", event: "Solar panel mounting and transmission line stringing underway (96% completed)", authority: "SECI & Project Engineers", status: "COMPLETED", docRef: "UTIL-LOG-2026" }
    ],
    statusHistory: [
      { date: "12 Sep 2026", changedBy: "State Land Secretary (MP)", fromStatus: "HANDOVER", toStatus: "NEAR_COMPLETION", remarks: "595 Ha energized; remaining 25 Ha in testing & commissioning." }
    ],
    disputes: [
      { caseId: "CASE-301", title: "Boundary Fencing Encroachment Clarification", court: "Tehsildar Court Gurh", district: "Rewa", status: "RESOLVED", nextHearing: null, affectedHa: 0.8 }
    ],
    documents: [
      { id: "DOC-RW-01", name: "State Cabinet Land Transfer Sanction Order", type: "APPROVAL_ORDER", uploadedBy: "MP Energy Department", uploadDate: "2025-09-15", status: "APPROVED", size: "1.8 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-RW-02", name: "Solar Grid Interconnection & Handover Clearance", type: "UTILIZATION_REPORT", uploadedBy: "PGCIL Grid Cell", uploadDate: "2026-06-20", status: "VERIFIED", size: "4.2 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "PROJ-KASHI-KOL",
    name: "Varanasi-Ranchi-Kolkata Economic Corridor",
    corridorName: "Varanasi–Kolkata 6-Lane Expressway (Package II & III)",
    agency: "National Highways Authority of India (NHAI)",
    ministry: "Ministry of Road Transport and Highways",
    state: "Uttar Pradesh",
    states: ["Uttar Pradesh", "Bihar", "Jharkhand", "West Bengal"],
    districts: ["Varanasi", "Chandauli", "Kaimur", "Ranchi", "Purulia", "Howrah"],
    startLocation: "Varanasi Ring Road (Uttar Pradesh)",
    endLocation: "Kolkata Port Interchange (West Bengal)",
    totalLengthKm: 610,
    totalParcels: 480,
    acquiredParcels: 320,
    totalAreaHa: 710.0,
    acquiredAreaHa: 495.0,
    totalLandRequired: 710.0,
    landAcquired: 495.0,
    landPending: 215.0,
    acquisitionProgress: 69.7,
    beneficiaries: 1840,
    beneficiariesPaid: 1120,
    compensationTotalCr: 2150.0,
    compensationPaidCr: 1480.0,
    compensationPendingCr: 670.0,
    budgetAllocatedCrores: 2150.0,
    budgetDisbursedCrores: 1480.0,
    status: "DELAYED",
    currentStage: "APPROVAL",
    displacedFamilies: 380,
    rehabilitatedFamilies: 240,
    activeDisputes: 21,
    riskScore: 78,
    riskTier: "HIGH",
    delayDays: 62,
    lastUpdated: "2026-09-14",
    centerLat: 25.3176,
    centerLng: 82.9739,
    zoom: 10,
    stageDays: {
      IDENTIFIED: 30,
      VERIFICATION: 45,
      SURVEY: 35,
      PROPOSAL: 28,
      APPROVAL: 62,
      NOTIFICATION: 0,
      OBJECTION: 0,
      COMPENSATION: 0,
      POSSESSION: 0,
      HANDOVER: 0,
      UTILIZATION: 0,
      COMPLETED: 0
    },
    routeCoordinates: [
      [25.3176, 82.9739], // Varanasi
      [25.2600, 83.2700], // Chandauli
      [25.0300, 83.6200], // Kaimur
      [24.7900, 84.4000], // Aurangabad (Bihar)
      [24.1200, 85.3500], // Hazaribagh
      [23.3441, 85.3096], // Ranchi
      [23.3300, 86.3600], // Purulia
      [22.9800, 87.8500], // Medinipur
      [22.5726, 88.3639]  // Kolkata
    ],
    routeWaypoints: [
      { name: "Varanasi Ring Road Junction", state: "Uttar Pradesh", district: "Varanasi", lat: 25.3176, lng: 82.9739, type: "START", chainage: "0.0 km" },
      { name: "Chandauli Agricultural Bypass", state: "Uttar Pradesh", district: "Chandauli", lat: 25.2600, lng: 83.2700, type: "WAYPOINT", chainage: "42.0 km" },
      { name: "Kaimur Forest Border Spur", state: "Bihar", district: "Kaimur", lat: 25.0300, lng: 83.6200, type: "WAYPOINT", chainage: "98.0 km" },
      { name: "Ranchi Industrial Feeder", state: "Jharkhand", district: "Ranchi", lat: 23.3441, lng: 85.3096, type: "WAYPOINT", chainage: "320.0 km" },
      { name: "Purulia Coalfields Corridor", state: "West Bengal", district: "Purulia", lat: 23.3300, lng: 86.3600, type: "WAYPOINT", chainage: "440.0 km" },
      { name: "Kolkata Port Terminal Link", state: "West Bengal", district: "Kolkata", lat: 22.5726, lng: 88.3639, type: "END", chainage: "610.0 km" }
    ],
    delayBreakdown: [
      { cause: "Inter-state border alignment approval between UP & Bihar", percentage: 44, impact: "High", overdueDays: 38 },
      { cause: "Chandauli multi-crop agricultural land compensation valuation", percentage: 31, impact: "High", overdueDays: 28 },
      { cause: "Tribal Santhal Pargana tenancy tenancy clearance in Jharkhand", percentage: 15, impact: "Medium", overdueDays: 14 },
      { cause: "NHAI Competent Authority staffing vacancy", percentage: 10, impact: "Low", overdueDays: 8 }
    ],
    timeline: [
      { date: "05 Dec 2025", event: "Alignment feasibility report and DPR approved by MoRTH", authority: "NHAI & MoRTH", status: "COMPLETED", docRef: "DPR-VKK-2025" },
      { date: "18 Jan 2026", event: "Drone survey completed across UP-Bihar border sections", authority: "Field Surveyor Cell Chandauli", status: "COMPLETED", docRef: "SURV-CHAN-11" },
      { date: "10 Mar 2026", event: "Section 3A notification drafted and submitted to State Secretaries", authority: "NHAI Regional Officer", status: "COMPLETED", docRef: "SEC3A-DRAFT-UP" },
      { date: "Current", event: "Inter-state ministerial clearance and land valuation approval pending", authority: "UP Revenue Board & Bihar Land Reforms", status: "DELAYED", docRef: "MIN-CLEAR-882" },
      { date: "Pending", event: "e-Gazette notification and Section 3C objections commencement", authority: "Gazette of India", status: "PENDING", docRef: null }
    ],
    statusHistory: [
      { date: "14 Sep 2026", changedBy: "Joint Secretary MoRTH", fromStatus: "IN_PROGRESS", toStatus: "DELAYED", remarks: "Delayed 62 days due to inter-state boundary dispute in Chandauli-Kaimur section." }
    ],
    disputes: [
      { caseId: "CASE-401", title: "Inter-State Border Jurisdiction & Compensation Multiplier Dispute", court: "High Court of Judicature at Allahabad", district: "Chandauli", status: "ACTIVE", nextHearing: "29 Sep 2026", affectedHa: 34.0 }
    ],
    documents: [
      { id: "DOC-VK-01", name: "Detailed Project Feasibility Report (DPR)", type: "FEASIBILITY_REPORT", uploadedBy: "NHAI Planning Cell", uploadDate: "2025-12-05", status: "APPROVED", size: "18.5 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-VK-02", name: "Agricultural Multi-Crop Valuation Assessment", type: "VALUATION_AWARD", uploadedBy: "Chandauli Revenue Collector", uploadDate: "2026-06-12", status: "UNDER_REVIEW", size: "5.1 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "PROJ-BLR-CHE",
    name: "Bengaluru-Chennai Expressway (Phase II)",
    corridorName: "Bengaluru–Chennai 4-Lane Access Controlled Expressway",
    agency: "National Highways Authority of India (NHAI)",
    ministry: "Ministry of Road Transport and Highways",
    state: "Karnataka",
    states: ["Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    districts: ["Bangalore Rural", "Kolar", "Chittoor", "Vellore", "Kanchipuram"],
    startLocation: "Hosakote (Bengaluru Rural)",
    endLocation: "Sriperumbudur (Chennai)",
    totalLengthKm: 262,
    totalParcels: 290,
    acquiredParcels: 255,
    totalAreaHa: 380.0,
    acquiredAreaHa: 342.0,
    totalLandRequired: 380.0,
    landAcquired: 342.0,
    landPending: 38.0,
    acquisitionProgress: 90.0,
    beneficiaries: 1140,
    beneficiariesPaid: 1060,
    compensationTotalCr: 1120.0,
    compensationPaidCr: 995.0,
    compensationPendingCr: 125.0,
    budgetAllocatedCrores: 1120.0,
    budgetDisbursedCrores: 995.0,
    status: "IN_PROGRESS",
    currentStage: "HANDOVER",
    displacedFamilies: 165,
    rehabilitatedFamilies: 158,
    activeDisputes: 8,
    riskScore: 32,
    riskTier: "LOW",
    delayDays: 14,
    lastUpdated: "2026-09-13",
    centerLat: 13.1367,
    centerLng: 78.1291,
    zoom: 11,
    stageDays: {
      IDENTIFIED: 22,
      VERIFICATION: 30,
      SURVEY: 25,
      PROPOSAL: 18,
      APPROVAL: 24,
      NOTIFICATION: 28,
      OBJECTION: 30,
      COMPENSATION: 45,
      POSSESSION: 35,
      HANDOVER: 14,
      UTILIZATION: 0,
      COMPLETED: 0
    },
    routeCoordinates: [
      [13.0700, 77.7900], // Hosakote
      [13.1367, 78.1291], // Kolar
      [13.2000, 78.5000], // Mulbagal
      [13.2172, 79.1003], // Chittoor
      [12.9165, 79.1325], // Vellore
      [12.8342, 79.7036], // Kanchipuram
      [12.9700, 79.9400]  // Sriperumbudur / Chennai
    ],
    routeWaypoints: [
      { name: "Hosakote Toll Plaza (Bengaluru)", state: "Karnataka", district: "Bangalore Rural", lat: 13.0700, lng: 77.7900, type: "START", chainage: "0.0 km" },
      { name: "Kolar Gold Fields Spur", state: "Karnataka", district: "Kolar", lat: 13.1367, lng: 78.1291, type: "WAYPOINT", chainage: "62.0 km" },
      { name: "Chittoor Andhra Logistics Node", state: "Andhra Pradesh", district: "Chittoor", lat: 13.2172, lng: 79.1003, type: "WAYPOINT", chainage: "148.0 km" },
      { name: "Sriperumbudur Auto Corridor (Chennai)", state: "Tamil Nadu", district: "Kanchipuram", lat: 12.9700, lng: 79.9400, type: "END", chainage: "262.0 km" }
    ],
    delayBreakdown: [
      { cause: "Kolar silk farmers compensation re-alignment appeal", percentage: 55, impact: "Medium", overdueDays: 10 },
      { cause: "Tamil Nadu revenue border record reconciliation", percentage: 45, impact: "Low", overdueDays: 4 }
    ],
    timeline: [
      { date: "12 Oct 2025", event: "Section 3D statutory acquisition declaration issued", authority: "Central Ministry", status: "COMPLETED", docRef: "SEC3D-BLR-CHE" },
      { date: "15 Jan 2026", event: "Solatium payment of ₹995 Cr credited via PFMS to 1,060 farmers", authority: "CALA Kolar & Chittoor", status: "COMPLETED", docRef: "PFMS-SO-2026" },
      { date: "Current", event: "Final 38 Ha physical possession & tree clearance in Chittoor border", authority: "Forest Dept & District Collector", status: "IN_PROGRESS", docRef: "HANDOVER-NOTE-12" },
      { date: "Pending", event: "Full corridor commissioning and commercial toll launch", authority: "NHAI & MoRTH", status: "PENDING", docRef: null }
    ],
    statusHistory: [
      { date: "13 Sep 2026", changedBy: "Regional Officer NHAI Bengaluru", fromStatus: "POSSESSION", toStatus: "HANDOVER", remarks: "342 Ha successfully handed over to concessionaire; civil construction 72% complete." }
    ],
    disputes: [
      { caseId: "CASE-501", title: "Silkworm Mulberry Orchard Rehabilitation Compensation", court: "Senior Civil Judge Court Kolar", district: "Kolar", status: "ACTIVE", nextHearing: "08 Oct 2026", affectedHa: 2.5 }
    ],
    documents: [
      { id: "DOC-BC-01", name: "Section 3D Land Acquisition Declaration", type: "GAZETTE_NOTICE", uploadedBy: "NHAI RO Bengaluru", uploadDate: "2025-10-12", status: "VERIFIED", size: "3.4 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-BC-02", name: "PFMS Disbursal Certificate & Bank Reconciled Register", type: "FINANCIAL_AUDIT", uploadedBy: "Finance Officer Kolar", uploadDate: "2026-02-14", status: "VERIFIED", size: "7.8 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "PROJ-DMRC-PH4",
    name: "Delhi Metro Phase IV (Aerocity-Tughlakabad Corridor)",
    corridorName: "Golden Line Silver Aerocity–Tughlakabad Underground/Elevated Metro",
    agency: "Delhi Metro Rail Corporation (DMRC)",
    ministry: "Ministry of Housing and Urban Affairs",
    state: "Delhi",
    states: ["Delhi"],
    districts: ["South West Delhi", "South Delhi"],
    startLocation: "Delhi Aerocity Terminal 3",
    endLocation: "Tughlakabad Interchange",
    totalLengthKm: 23.6,
    totalParcels: 145,
    acquiredParcels: 118,
    totalAreaHa: 98.5,
    acquiredAreaHa: 82.0,
    totalLandRequired: 98.5,
    landAcquired: 82.0,
    landPending: 16.5,
    acquisitionProgress: 83.2,
    beneficiaries: 340,
    beneficiariesPaid: 295,
    compensationTotalCr: 950.0,
    compensationPaidCr: 810.5,
    compensationPendingCr: 139.5,
    budgetAllocatedCrores: 950.0,
    budgetDisbursedCrores: 810.5,
    status: "IN_PROGRESS",
    currentStage: "ACQUIRED",
    displacedFamilies: 95,
    rehabilitatedFamilies: 89,
    activeDisputes: 6,
    riskScore: 42,
    riskTier: "MEDIUM",
    delayDays: 22,
    lastUpdated: "2026-09-15",
    centerLat: 28.5562,
    centerLng: 77.1000,
    zoom: 12,
    stageDays: {
      IDENTIFIED: 15,
      VERIFICATION: 25,
      SURVEY: 20,
      PROPOSAL: 14,
      APPROVAL: 30,
      NOTIFICATION: 25,
      OBJECTION: 28,
      COMPENSATION: 40,
      POSSESSION: 22,
      HANDOVER: 0,
      UTILIZATION: 0,
      COMPLETED: 0
    },
    routeCoordinates: [
      [28.5562, 77.1000], // Aerocity
      [28.5400, 77.1400], // Mahipalpur
      [28.5200, 77.1700], // Vasant Kunj
      [28.5000, 77.2000], // Chhatarpur
      [28.4950, 77.2400], // Saket G-Block
      [28.5050, 77.2700], // Khanpur
      [28.5120, 77.3000]  // Tughlakabad
    ],
    routeWaypoints: [
      { name: "Aerocity Metro Station", state: "Delhi", district: "South West Delhi", lat: 28.5562, lng: 77.1000, type: "START", chainage: "0.0 km" },
      { name: "Chhatarpur Multimodal Interchange", state: "Delhi", district: "South Delhi", lat: 28.5000, lng: 77.2000, type: "WAYPOINT", chainage: "11.2 km" },
      { name: "Khanpur Elevated Station", state: "Delhi", district: "South Delhi", lat: 28.5050, lng: 77.2700, type: "WAYPOINT", chainage: "18.4 km" },
      { name: "Tughlakabad Violet Line Interchange", state: "Delhi", district: "South Delhi", lat: 28.5120, lng: 77.3000, type: "END", chainage: "23.6 km" }
    ],
    delayBreakdown: [
      { cause: "Delhi Ridge Forest clearance tree felling permission", percentage: 65, impact: "High", overdueDays: 18 },
      { cause: "DDA commercial plot title settlement in Khanpur", percentage: 35, impact: "Medium", overdueDays: 4 }
    ],
    timeline: [
      { date: "08 Dec 2025", event: "Cabinet approval for Phase IV Aerocity-Tughlakabad stretch", authority: "Union Cabinet & MoHUA", status: "COMPLETED", docRef: "CAB-DMRC-PH4" },
      { date: "14 Feb 2026", event: "Direct negotiation acquisition from DDA and private owners", authority: "DMRC Land Cell", status: "COMPLETED", docRef: "DMRC-ACQ-2026" },
      { date: "Current", event: "Tunnel Boring Machine (TBM) shaft land handover under progress", authority: "DMRC Chief Engineer", status: "IN_PROGRESS", docRef: "SHAFT-SITE-04" }
    ],
    statusHistory: [
      { date: "15 Sep 2026", changedBy: "Director (Works) DMRC", fromStatus: "COMPENSATION", toStatus: "ACQUIRED", remarks: "82 Ha acquired and handed over for underground tunneling works." }
    ],
    disputes: [
      { caseId: "CASE-601", title: "Delhi Ridge Management Board Tree Felling Compensatory Afforestation", court: "Supreme Court Central Empowered Committee (CEC)", district: "South Delhi", status: "ACTIVE", nextHearing: "25 Sep 2026", affectedHa: 4.2 }
    ],
    documents: [
      { id: "DOC-DM-01", name: "Supreme Court Tree Clearance Afforestation Sanction", type: "ENVIRONMENTAL_CLEARANCE", uploadedBy: "DMRC Environment Cell", uploadDate: "2026-04-10", status: "APPROVED", size: "5.4 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "PROJ-AMR-JAM",
    name: "Amritsar-Jamnagar Economic Corridor (Bikaner Stretch)",
    corridorName: "Amritsar–Jamnagar 4/6-Lane Economic Corridor (NH-754A)",
    agency: "National Highways Authority of India (NHAI)",
    ministry: "Ministry of Road Transport and Highways",
    state: "Rajasthan",
    states: ["Punjab", "Haryana", "Rajasthan", "Gujarat"],
    districts: ["Amritsar", "Bhatinda", "Bikaner", "Jodhpur", "Barmer", "Jamnagar"],
    startLocation: "Amritsar (Punjab)",
    endLocation: "Jamnagar Oil Refinery (Gujarat)",
    totalLengthKm: 1224,
    totalParcels: 390,
    acquiredParcels: 362,
    totalAreaHa: 540.0,
    acquiredAreaHa: 508.0,
    totalLandRequired: 540.0,
    landAcquired: 508.0,
    landPending: 32.0,
    acquisitionProgress: 94.1,
    beneficiaries: 1420,
    beneficiariesPaid: 1380,
    compensationTotalCr: 1420.0,
    compensationPaidCr: 1340.0,
    compensationPendingCr: 80.0,
    budgetAllocatedCrores: 1420.0,
    budgetDisbursedCrores: 1340.0,
    status: "NEAR_COMPLETION",
    currentStage: "HANDOVER",
    displacedFamilies: 110,
    rehabilitatedFamilies: 108,
    activeDisputes: 4,
    riskScore: 24,
    riskTier: "LOW",
    delayDays: 5,
    lastUpdated: "2026-09-11",
    centerLat: 28.0229,
    centerLng: 73.3119,
    zoom: 10,
    stageDays: {
      IDENTIFIED: 20,
      VERIFICATION: 28,
      SURVEY: 24,
      PROPOSAL: 16,
      APPROVAL: 22,
      NOTIFICATION: 26,
      OBJECTION: 25,
      COMPENSATION: 40,
      POSSESSION: 30,
      HANDOVER: 5,
      UTILIZATION: 0,
      COMPLETED: 0
    },
    routeCoordinates: [
      [31.6340, 74.8723], // Amritsar
      [30.2110, 74.9455], // Bhatinda
      [28.0229, 73.3119], // Bikaner
      [26.2389, 73.0243], // Jodhpur
      [25.7521, 71.3967], // Barmer
      [24.1700, 70.8500], // Sanchore
      [22.4707, 70.0577]  // Jamnagar
    ],
    routeWaypoints: [
      { name: "Amritsar Golden Gate", state: "Punjab", district: "Amritsar", lat: 31.6340, lng: 74.8723, type: "START", chainage: "0.0 km" },
      { name: "Bikaner Thar Desert Bypass", state: "Rajasthan", district: "Bikaner", lat: 28.0229, lng: 73.3119, type: "WAYPOINT", chainage: "460.0 km" },
      { name: "Barmer Energy Hub", state: "Rajasthan", district: "Barmer", lat: 25.7521, lng: 71.3967, type: "WAYPOINT", chainage: "780.0 km" },
      { name: "Jamnagar Reliance Refinery Terminal", state: "Gujarat", district: "Jamnagar", lat: 22.4707, lng: 70.0577, type: "END", chainage: "1,224.0 km" }
    ],
    delayBreakdown: [
      { cause: "Defense corridor clearances near Rajasthan border", percentage: 80, impact: "Low", overdueDays: 5 },
      { cause: "Canal siphon crossing utility approvals", percentage: 20, impact: "Low", overdueDays: 0 }
    ],
    timeline: [
      { date: "15 Jan 2026", event: "94% corridor land mutated in revenue records and vested in NHAI", authority: "CALA Bikaner & Barmer", status: "COMPLETED", docRef: "VEST-AJ-90" },
      { date: "Current", event: "Final 32 Ha canal crossing handover under irrigation sign-off", authority: "Indira Gandhi Nahar Project (IGNP)", status: "IN_PROGRESS", docRef: "IGNP-CROSS-01" }
    ],
    statusHistory: [
      { date: "11 Sep 2026", changedBy: "NHAI Project Director (Bikaner)", fromStatus: "POSSESSION", toStatus: "HANDOVER", remarks: "Corridor construction ready for final safety commissioning." }
    ],
    disputes: [],
    documents: [
      { id: "DOC-AJ-01", name: "Ministry of Defence Border Area NOC", type: "DEFENSE_NOC", uploadedBy: "MoRTH Security Cell", uploadDate: "2026-03-12", status: "APPROVED", size: "2.1 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "PROJ-GATI-SEZ",
    name: "PM MITRA Mega Integrated Textile Region & Logistics Park",
    corridorName: "PM MITRA 1,000-Acre Mega Textile Region & Port Connector",
    agency: "Gujarat Industrial Development Corporation (GIDC)",
    ministry: "Ministry of Textiles & DILRMP",
    state: "Gujarat",
    states: ["Gujarat"],
    districts: ["Navsari", "Surat"],
    startLocation: "Navsari Industrial Zone",
    endLocation: "Hazira Port Logistics Hub (Surat)",
    totalLengthKm: 48,
    totalParcels: 260,
    acquiredParcels: 185,
    totalAreaHa: 462.0,
    acquiredAreaHa: 320.5,
    totalLandRequired: 462.0,
    landAcquired: 320.5,
    landPending: 141.5,
    acquisitionProgress: 69.4,
    beneficiaries: 760,
    beneficiariesPaid: 512,
    compensationTotalCr: 880.0,
    compensationPaidCr: 615.0,
    compensationPendingCr: 265.0,
    budgetAllocatedCrores: 880.0,
    budgetDisbursedCrores: 615.0,
    status: "IN_PROGRESS",
    currentStage: "PROPOSAL",
    displacedFamilies: 145,
    rehabilitatedFamilies: 112,
    activeDisputes: 14,
    riskScore: 58,
    riskTier: "MEDIUM",
    delayDays: 31,
    lastUpdated: "2026-09-14",
    centerLat: 20.9500,
    centerLng: 72.9300,
    zoom: 11,
    stageDays: {
      IDENTIFIED: 28,
      VERIFICATION: 35,
      SURVEY: 30,
      PROPOSAL: 31,
      APPROVAL: 0,
      NOTIFICATION: 0,
      OBJECTION: 0,
      COMPENSATION: 0,
      POSSESSION: 0,
      HANDOVER: 0,
      UTILIZATION: 0,
      COMPLETED: 0
    },
    routeCoordinates: [
      [20.9500, 72.9300], // Navsari Central
      [21.0500, 72.8800], // Maroli Port Link
      [21.1200, 72.8200], // Sachin GIDC
      [21.1702, 72.8311], // Surat City Bypass
      [21.1100, 72.6500]  // Hazira Port Terminal
    ],
    routeWaypoints: [
      { name: "PM MITRA Core Textile Park (Navsari)", state: "Gujarat", district: "Navsari", lat: 20.9500, lng: 72.9300, type: "START", chainage: "0.0 km" },
      { name: "Maroli Industrial Freight Connector", state: "Gujarat", district: "Navsari", lat: 21.0500, lng: 72.8800, type: "WAYPOINT", chainage: "18.0 km" },
      { name: "Sachin GIDC Logistics Exchange", state: "Gujarat", district: "Surat", lat: 21.1200, lng: 72.8200, type: "WAYPOINT", chainage: "32.0 km" },
      { name: "Hazira Deepwater Container Port", state: "Gujarat", district: "Surat", lat: 21.1100, lng: 72.6500, type: "END", chainage: "48.0 km" }
    ],
    delayBreakdown: [
      { cause: "Coastal Saline Soil Reclamation & GIDC Masterplan Approval", percentage: 50, impact: "Medium", overdueDays: 20 },
      { cause: "Private salt pan leasehold vs freehold conversion valuation", percentage: 35, impact: "Medium", overdueDays: 8 },
      { cause: "Environmental impact assessment public hearing scheduling", percentage: 15, impact: "Low", overdueDays: 3 }
    ],
    timeline: [
      { date: "15 Nov 2025", event: "MoT PM MITRA scheme site selection notification in Navsari", authority: "Ministry of Textiles", status: "COMPLETED", docRef: "MITRA-GUJ-01" },
      { date: "10 Feb 2026", event: "Topographical and soil salinity drone mapping completed", authority: "GIDC Engineering Team", status: "COMPLETED", docRef: "SOIL-SURV-NAV" },
      { date: "Current", event: "Master alignment proposal under evaluation by State High Power Committee", authority: "Gujarat State Cabinet & GIDC", status: "IN_PROGRESS", docRef: "GIDC-PROP-88" }
    ],
    statusHistory: [
      { date: "14 Sep 2026", changedBy: "Managing Director GIDC", fromStatus: "SURVEY", toStatus: "PROPOSAL", remarks: "Site master plan finalized and submitted for cabinet sanction." }
    ],
    disputes: [
      { caseId: "CASE-701", title: "Salt Pan Land Lease Cancellation Compensation Appeal", court: "High Court of Gujarat", district: "Surat", status: "ACTIVE", nextHearing: "06 Oct 2026", affectedHa: 28.0 }
    ],
    documents: [
      { id: "DOC-MT-01", name: "PM MITRA National Scheme Sanction Letter", type: "SCHEME_SANCTION", uploadedBy: "Ministry of Textiles", uploadDate: "2025-11-15", status: "APPROVED", size: "2.7 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  }
];

export const PARCELS_DATA = [
  {
    id: "LND-00125",
    landId: "LND-00125",
    ulpin: "06-12-8891-K9X2A4",
    surveyNumber: "142/3",
    surveyNo: "142/3",
    khataNo: "K-1082",
    projectId: "PROJ-NH48-EXPR",
    projectName: "Delhi-Mumbai Industrial Expressway",
    currentOwner: "Rameshwar Singh Yadav",
    ownerName: "Rameshwar Singh Yadav",
    ownerPhone: "+91 98120 44102",
    aadhaarMasked: "XXXX-XXXX-8921",
    bankAccountVerified: true,
    bankName: "State Bank of India (Gurugram Branch)",
    ifsc: "SBIN0001245",
    areaHectares: 4.5,
    area: 4.5,
    landType: "Agricultural",
    tehsil: "Sohna",
    village: "Sohna Rural",
    district: "Gurugram",
    state: "Haryana",
    status: "HANDOVER",
    acquisitionStatus: "Handover in Progress",
    expectedNextAction: "Issue Land Possession Certificate & execute R&R housing allotment",
    riskScore: 25,
    riskTier: "LOW",
    riskBreakdown: {
      approvalDelay: 0,
      legalDispute: 0,
      compensationDelay: 10,
      documentMissing: 0,
      deadline: 15
    },
    recommendedAction: "Proceed with final possession sign-off by District Collector",
    marketRatePerHa: 4500000,
    multiplier: 1.5,
    solatiumAmount: 12487500,
    totalAwardAmount: 26223750,
    dbtStatus: "DISBURSED_100",
    dbtTransactionId: "DBT2026091299841",
    dbtDate: "2026-09-08",
    coordinates: [
      [28.1520, 76.9250],
      [28.1540, 76.9280],
      [28.1510, 76.9310],
      [28.1490, 76.9270]
    ],
    center: [28.1515, 76.9277],
    documents: [
      { id: "DOC-101", title: "Khatauni Land Ownership Proof", type: "OWNERSHIP_PROOF", date: "2026-07-12", status: "VERIFIED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-102", title: "ULPIN Geo-Tagging Survey Map", type: "SURVEY_MAP", date: "2026-08-01", status: "VERIFIED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-103", title: "Section 3A Gazette Notification", type: "NOTICE", date: "2026-08-15", status: "VERIFIED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-104", title: "Section 3G Solatium Award Certificate", type: "AWARD_CERT", date: "2026-09-01", status: "SIGNED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Sohna", date: "2026-07-10" },
      { step: "Verification Completed", status: "COMPLETED", officer: "Tehsildar Sohna", date: "2026-07-25" },
      { step: "Proposal Submitted", status: "COMPLETED", officer: "NHAI Nodal Officer", date: "2026-08-05" },
      { step: "District Approval", status: "COMPLETED", officer: "District Collector Gurugram", date: "2026-08-20" },
      { step: "State Approval", status: "COMPLETED", officer: "State Land Secretary", date: "2026-09-02" }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-08-28"
  },
  {
    id: "LND-00126",
    landId: "LND-00126",
    ulpin: "06-12-8892-M3P9B1",
    surveyNumber: "142/4",
    surveyNo: "142/4",
    khataNo: "K-1083",
    projectId: "PROJ-NH48-EXPR",
    projectName: "Delhi-Mumbai Industrial Expressway",
    currentOwner: "Sunita Devi & Harish Yadav",
    ownerName: "Sunita Devi & Harish Yadav",
    ownerPhone: "+91 98451 90112",
    aadhaarMasked: "XXXX-XXXX-4412",
    bankAccountVerified: true,
    bankName: "Punjab National Bank (Nuh)",
    ifsc: "PUNB0109200",
    areaHectares: 3.2,
    area: 3.2,
    landType: "Agricultural",
    tehsil: "Sohna",
    village: "Sohna Rural",
    district: "Gurugram",
    state: "Haryana",
    status: "COMPENSATION",
    acquisitionStatus: "Compensation Assessment",
    expectedNextAction: "Verify PFMS bank account details and trigger Direct Benefit Transfer (DBT)",
    riskScore: 55,
    riskTier: "MEDIUM",
    riskBreakdown: {
      approvalDelay: 20,
      legalDispute: 0,
      compensationDelay: 20,
      documentMissing: 0,
      deadline: 15
    },
    recommendedAction: "Expedite PFMS bank verification to avoid compensation delay penalty",
    marketRatePerHa: 4500000,
    multiplier: 1.5,
    solatiumAmount: 16200000,
    totalAwardAmount: 34020000,
    dbtStatus: "PENDING_BANK_VERIFICATION",
    dbtTransactionId: null,
    dbtDate: null,
    coordinates: [
      [28.1540, 76.9280],
      [28.1565, 76.9320],
      [28.1530, 76.9350],
      [28.1510, 76.9310]
    ],
    center: [28.1536, 76.9315],
    documents: [
      { id: "DOC-201", title: "Khatauni Land Ownership Proof", type: "OWNERSHIP_PROOF", date: "2026-07-14", status: "VERIFIED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-202", title: "Section 3A Gazette Notification", type: "NOTICE", date: "2026-08-18", status: "VERIFIED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Sohna", date: "2026-07-12" },
      { step: "Verification Completed", status: "COMPLETED", officer: "Tehsildar Sohna", date: "2026-07-28" },
      { step: "Proposal Submitted", status: "COMPLETED", officer: "NHAI Nodal Officer", date: "2026-08-08" },
      { step: "District Approval", status: "PENDING", officer: "District Collector Gurugram", date: null },
      { step: "State Approval", status: "NOT_STARTED", officer: "State Land Secretary", date: null }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-08-30"
  },
  {
    id: "LND-00127",
    landId: "LND-00127",
    ulpin: "06-12-8893-X7L1C9",
    surveyNumber: "112/1",
    surveyNo: "112/1",
    khataNo: "K-4401",
    projectId: "PROJ-NH48-EXPR",
    projectName: "Delhi-Mumbai Industrial Expressway",
    currentOwner: "Gurdeep Singh Sandhu",
    ownerName: "Gurdeep Singh Sandhu",
    ownerPhone: "+91 97201 88310",
    aadhaarMasked: "XXXX-XXXX-9011",
    bankAccountVerified: false,
    bankName: "HDFC Bank (Badshahpur)",
    ifsc: "HDFC0000192",
    areaHectares: 3.1,
    area: 3.1,
    landType: "Commercial",
    tehsil: "Tauru",
    village: "Taurupath",
    district: "Nuh",
    state: "Haryana",
    status: "LEGAL",
    acquisitionStatus: "Legal Objection Under Review",
    expectedNextAction: "Legal Officer review of Section 3C ownership dispute appeal under High Court Case CASE-102",
    riskScore: 85,
    riskTier: "HIGH",
    riskBreakdown: {
      approvalDelay: 20,
      legalDispute: 30,
      compensationDelay: 20,
      documentMissing: 15,
      deadline: 0
    },
    recommendedAction: "Prioritize legal review and execute court escrow deposit for compensation",
    marketRatePerHa: 6800000,
    multiplier: 1.25,
    solatiumAmount: 26350000,
    totalAwardAmount: 55335000,
    dbtStatus: "IN_ESCROW",
    dbtTransactionId: "ESCROW-COURT-STAY-901",
    dbtDate: null,
    coordinates: [
      [28.1470, 76.9320],
      [28.1495, 76.9360],
      [28.1460, 76.9390],
      [28.1440, 76.9340]
    ],
    center: [28.1466, 76.9352],
    documents: [
      { id: "DOC-301", title: "High Court Interim Stay Order", type: "LEGAL_DOCUMENT", date: "2026-09-01", status: "PENDING_HEARING", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-302", title: "Section 3C Objection Filing Copy", type: "OBJECTION_NOTICE", date: "2026-08-22", status: "UNDER_REVIEW", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Tauru", date: "2026-07-15" },
      { step: "Verification Completed", status: "COMPLETED", officer: "Tehsildar Tauru", date: "2026-08-01" },
      { step: "Proposal Submitted", status: "COMPLETED", officer: "NHAI Nodal Officer", date: "2026-08-10" },
      { step: "District Approval", status: "REJECTED_LEGAL_STAY", officer: "District Collector Nuh", date: "2026-08-25" },
      { step: "State Approval", status: "NOT_STARTED", officer: "State Land Secretary", date: null }
    ],
    legalIssues: [
      { caseId: "CASE-102", issue: "Ownership & Partition dispute between co-sharers under SO-18 High Court Appeal", status: "Under Review", assignedOfficer: "Legal Nodal Officer Nuh" }
    ],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-09-02"
  },
  {
    id: "LND-00128",
    landId: "LND-00128",
    ulpin: "06-12-8894-R4K8D2",
    surveyNumber: "88/C",
    surveyNo: "88/C",
    khataNo: "K-302",
    projectId: "PROJ-NH48-EXPR",
    projectName: "Delhi-Mumbai Industrial Expressway",
    currentOwner: "Devendra Prakash Sharma",
    ownerName: "Devendra Prakash Sharma",
    ownerPhone: "+91 99881 22340",
    aadhaarMasked: "XXXX-XXXX-1123",
    bankAccountVerified: true,
    bankName: "Canara Bank",
    ifsc: "CNRB0002102",
    areaHectares: 1.2,
    area: 1.2,
    landType: "Agricultural",
    tehsil: "Tauru",
    village: "Taurupath",
    district: "Nuh",
    state: "Haryana",
    status: "NOTICE",
    acquisitionStatus: "Gazette Notice Published",
    expectedNextAction: "Complete 21-day Section 3C public objection window and hold stakeholder meeting",
    riskScore: 35,
    riskTier: "MEDIUM",
    riskBreakdown: {
      approvalDelay: 0,
      legalDispute: 0,
      compensationDelay: 20,
      documentMissing: 15,
      deadline: 0
    },
    recommendedAction: "Publish Gazette notice in regional newspapers & collect land valuation records",
    marketRatePerHa: 4200000,
    multiplier: 1.5,
    solatiumAmount: 7560000,
    totalAwardAmount: 15876000,
    dbtStatus: "PENDING_BANK_VERIFICATION",
    dbtTransactionId: null,
    dbtDate: null,
    coordinates: [
      [28.1440, 76.9340],
      [28.1460, 76.9390],
      [28.1420, 76.9420],
      [28.1400, 76.9370]
    ],
    center: [28.1430, 76.9380],
    documents: [
      { id: "DOC-401", title: "Section 3A Gazette Notification", type: "GAZETTE_NOTICE", date: "2026-09-04", status: "PUBLISHED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Tauru", date: "2026-08-01" },
      { step: "Verification Completed", status: "COMPLETED", officer: "Tehsildar Tauru", date: "2026-08-15" },
      { step: "Proposal Submitted", status: "COMPLETED", officer: "NHAI Nodal Officer", date: "2026-08-28" },
      { step: "District Approval", status: "NOT_STARTED", officer: "District Collector Nuh", date: null },
      { step: "State Approval", status: "NOT_STARTED", officer: "State Land Secretary", date: null }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-09-04"
  },
  {
    id: "LND-00129",
    landId: "LND-00129",
    ulpin: "06-12-8895-Z1N3E8",
    surveyNumber: "90/A",
    surveyNo: "90/A",
    khataNo: "K-305",
    projectId: "PROJ-NH48-EXPR",
    projectName: "Delhi-Mumbai Industrial Expressway",
    currentOwner: "Mahesh Kumar Saini",
    ownerName: "Mahesh Kumar Saini",
    ownerPhone: "+91 94112 00192",
    aadhaarMasked: "XXXX-XXXX-7781",
    bankAccountVerified: true,
    bankName: "State Bank of India",
    ifsc: "SBIN0004921",
    areaHectares: 2.1,
    area: 2.1,
    landType: "Agricultural",
    tehsil: "Tauru",
    village: "Taurupath",
    district: "Nuh",
    state: "Haryana",
    status: "UTILIZATION",
    acquisitionStatus: "Corridor Infrastructure Construction Active",
    expectedNextAction: "Monitor post-acquisition asset construction & quarterly drone inspection",
    riskScore: 10,
    riskTier: "LOW",
    riskBreakdown: {
      approvalDelay: 0,
      legalDispute: 0,
      compensationDelay: 0,
      documentMissing: 0,
      deadline: 10
    },
    recommendedAction: "Corridor asset fully acquired & utilized. Maintain quarterly drone log.",
    marketRatePerHa: 4200000,
    multiplier: 1.5,
    solatiumAmount: 13230000,
    totalAwardAmount: 27783000,
    dbtStatus: "DISBURSED_100",
    dbtTransactionId: "DBT2026091044192",
    dbtDate: "2026-09-10",
    coordinates: [
      [28.1400, 76.9370],
      [28.1420, 76.9420],
      [28.1380, 76.9450],
      [28.1360, 76.9400]
    ],
    center: [28.1390, 76.9410],
    documents: [
      { id: "DOC-501", title: "Final Possession Handover Certificate", type: "HANDOVER_CERT", date: "2026-09-08", status: "SIGNED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "DOC-502", title: "Project Utilization Completion Report", type: "UTILIZATION_REPORT", date: "2026-09-10", status: "APPROVED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Tauru", date: "2026-06-10" },
      { step: "Verification Completed", status: "COMPLETED", officer: "Tehsildar Tauru", date: "2026-06-25" },
      { step: "Proposal Submitted", status: "COMPLETED", officer: "NHAI Nodal Officer", date: "2026-07-05" },
      { step: "District Approval", status: "COMPLETED", officer: "District Collector Nuh", date: "2026-07-20" },
      { step: "State Approval", status: "COMPLETED", officer: "State Land Secretary", date: "2026-08-02" }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-09-05"
  },
  {
    id: "LND-00130",
    landId: "LND-00130",
    ulpin: "06-12-8896-Y2K9F1",
    surveyNumber: "12/4",
    surveyNo: "12/4",
    khataNo: "K-881",
    projectId: "PROJ-NH48-EXPR",
    projectName: "Delhi-Mumbai Industrial Expressway",
    currentOwner: "Rakesh Kumar Bishnoi",
    ownerName: "Rakesh Kumar Bishnoi",
    ownerPhone: "+91 91200 44810",
    aadhaarMasked: "XXXX-XXXX-5521",
    bankAccountVerified: true,
    bankName: "State Bank of India",
    ifsc: "SBIN0001122",
    areaHectares: 1.5,
    area: 1.5,
    landType: "Agricultural",
    tehsil: "Sohna",
    village: "Sohna Rural",
    district: "Gurugram",
    state: "Haryana",
    status: "IDENTIFIED",
    acquisitionStatus: "Land Plot Identified & Tagged",
    expectedNextAction: "Initiate Khata revenue record encumbrance verification & Aadhaar authentication",
    riskScore: 20,
    riskTier: "LOW",
    riskBreakdown: {
      approvalDelay: 0,
      legalDispute: 0,
      compensationDelay: 0,
      documentMissing: 15,
      deadline: 5
    },
    recommendedAction: "Upload land revenue record (Khatauni) and initiate Field Surveyor inspection",
    marketRatePerHa: 4500000,
    multiplier: 1.5,
    solatiumAmount: 10125000,
    totalAwardAmount: 21262500,
    dbtStatus: "PENDING_BANK_VERIFICATION",
    dbtTransactionId: null,
    dbtDate: null,
    coordinates: [
      [28.1565, 76.9320],
      [28.1585, 76.9360],
      [28.1550, 76.9390],
      [28.1530, 76.9350]
    ],
    center: [28.1557, 76.9355],
    documents: [],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Sohna", date: "2026-09-11" },
      { step: "Verification Completed", status: "NOT_STARTED", officer: "Tehsildar Sohna", date: null },
      { step: "Proposal Submitted", status: "NOT_STARTED", officer: "NHAI Nodal Officer", date: null },
      { step: "District Approval", status: "NOT_STARTED", officer: "District Collector Gurugram", date: null },
      { step: "State Approval", status: "NOT_STARTED", officer: "State Land Secretary", date: null }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-09-11"
  },
  {
    id: "LND-00201",
    landId: "LND-00201",
    ulpin: "27-14-3321-P9T1A1",
    surveyNumber: "44/1A",
    surveyNo: "44/1A",
    khataNo: "K-501",
    projectId: "PROJ-DFCC-WEST",
    projectName: "Western Dedicated Freight Corridor",
    currentOwner: "Kalu Mangal Warli & Gram Sabha",
    ownerName: "Kalu Mangal Warli & Gram Sabha",
    ownerPhone: "+91 97654 22019",
    aadhaarMasked: "XXXX-XXXX-9912",
    bankAccountVerified: false,
    bankName: "Bank of Maharashtra (Dahanu)",
    ifsc: "MAHB0000412",
    areaHectares: 2.8,
    area: 2.8,
    landType: "Tribal Agricultural",
    tehsil: "Dahanu",
    village: "Kasa Khurd",
    district: "Palghar",
    state: "Maharashtra",
    status: "NOTICE",
    acquisitionStatus: "Section 20A Notice - Gram Sabha Review",
    expectedNextAction: "Conduct PESA Gram Sabha hearing and resolve community forest rights claim",
    riskScore: 88,
    riskTier: "HIGH",
    riskBreakdown: { approvalDelay: 25, legalDispute: 35, compensationDelay: 15, documentMissing: 13, deadline: 0 },
    recommendedAction: "Convene special sub-divisional PESA consensus session with tribal elders",
    marketRatePerHa: 3800000,
    multiplier: 2.0,
    solatiumAmount: 21280000,
    totalAwardAmount: 42560000,
    dbtStatus: "PENDING_CONSENT",
    dbtTransactionId: null,
    dbtDate: null,
    coordinates: [
      [19.6960, 72.7690],
      [19.6980, 72.7710],
      [19.6950, 72.7730],
      [19.6930, 72.7700]
    ],
    center: [19.6955, 72.7708],
    documents: [
      { id: "DOC-DF-P1", title: "Railways Act Section 20A Notice", type: "GAZETTE_NOTICE", date: "2026-03-01", status: "PUBLISHED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Palghar", date: "2026-01-15" },
      { step: "Verification Completed", status: "COMPLETED", officer: "Tehsildar Dahanu", date: "2026-02-10" },
      { step: "Proposal Submitted", status: "COMPLETED", officer: "DFCCIL Nodal Officer", date: "2026-02-28" },
      { step: "District Approval", status: "PENDING_GRAM_SABHA", officer: "District Collector Palghar", date: null }
    ],
    legalIssues: [
      { caseId: "CASE-201", issue: "PESA Act Tribal Land Acquisition Challenge", status: "Active", assignedOfficer: "District Legal Officer Palghar" }
    ],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-07-20"
  },
  {
    id: "LND-00202",
    landId: "LND-00202",
    ulpin: "27-14-3322-P9T1B2",
    surveyNumber: "44/2B",
    surveyNo: "44/2B",
    khataNo: "K-502",
    projectId: "PROJ-DFCC-WEST",
    projectName: "Western Dedicated Freight Corridor",
    currentOwner: "Ashok Vithoba Patil",
    ownerName: "Ashok Vithoba Patil",
    ownerPhone: "+91 98221 44091",
    aadhaarMasked: "XXXX-XXXX-3341",
    bankAccountVerified: true,
    bankName: "State Bank of India (Palghar)",
    ifsc: "SBIN0000445",
    areaHectares: 3.4,
    area: 3.4,
    landType: "Agricultural",
    tehsil: "Palghar",
    village: "Manor Rural",
    district: "Palghar",
    state: "Maharashtra",
    status: "ACQUIRED",
    acquisitionStatus: "Land Acquired - Solatium Credited",
    expectedNextAction: "Physical track laying ballast handover",
    riskScore: 20,
    riskTier: "LOW",
    riskBreakdown: { approvalDelay: 0, legalDispute: 0, compensationDelay: 0, documentMissing: 10, deadline: 10 },
    recommendedAction: "Execute track formation handover certificate",
    marketRatePerHa: 4200000,
    multiplier: 1.5,
    solatiumAmount: 21420000,
    totalAwardAmount: 42840000,
    dbtStatus: "DISBURSED_100",
    dbtTransactionId: "DBT202608149910",
    dbtDate: "2026-08-14",
    coordinates: [
      [19.6980, 72.7710],
      [19.7010, 72.7740],
      [19.6975, 72.7760],
      [19.6950, 72.7730]
    ],
    center: [19.6979, 72.7735],
    documents: [
      { id: "DOC-DF-P2", title: "Section 20F Solatium Award Certificate", type: "AWARD_CERT", date: "2026-08-10", status: "SIGNED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Palghar", date: "2026-01-10" },
      { step: "Verification Completed", status: "COMPLETED", officer: "Tehsildar Manor", date: "2026-02-05" },
      { step: "District Approval", status: "COMPLETED", officer: "District Collector Palghar", date: "2026-07-15" }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-08-01"
  },
  {
    id: "LND-00301",
    landId: "LND-00301",
    ulpin: "23-08-5541-R1S9A1",
    surveyNumber: "204/1",
    surveyNo: "204/1",
    khataNo: "K-880",
    projectId: "PROJ-REWA-SOLAR",
    projectName: "Rewa Ultra Mega Solar Park Corridor Expansion",
    currentOwner: "Badri Prasad Tiwari",
    ownerName: "Badri Prasad Tiwari",
    ownerPhone: "+91 94251 88120",
    aadhaarMasked: "XXXX-XXXX-6612",
    bankAccountVerified: true,
    bankName: "Madhya Pradesh Gramin Bank",
    ifsc: "MPGB0001092",
    areaHectares: 8.5,
    area: 8.5,
    landType: "Barren / Non-Agricultural",
    tehsil: "Gurh",
    village: "Barseta",
    district: "Rewa",
    state: "Madhya Pradesh",
    status: "UTILIZATION",
    acquisitionStatus: "Solar PV Mounting Array Operational",
    expectedNextAction: "Semi-annual solar generation transmission audit",
    riskScore: 12,
    riskTier: "LOW",
    riskBreakdown: { approvalDelay: 0, legalDispute: 0, compensationDelay: 0, documentMissing: 0, deadline: 12 },
    recommendedAction: "Corridor fully utilized. Maintain quarterly drone log.",
    marketRatePerHa: 1800000,
    multiplier: 1.5,
    solatiumAmount: 22950000,
    totalAwardAmount: 45900000,
    dbtStatus: "DISBURSED_100",
    dbtTransactionId: "DBT202601150091",
    dbtDate: "2026-01-15",
    coordinates: [
      [24.4500, 81.4200],
      [24.4540, 81.4250],
      [24.4510, 81.4290],
      [24.4470, 81.4230]
    ],
    center: [24.4505, 81.4242],
    documents: [
      { id: "DOC-RW-P1", title: "Possession & Utilization Clearance Certificate", type: "UTILIZATION_REPORT", date: "2026-06-15", status: "APPROVED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Tehsildar Gurh", date: "2025-10-15" },
      { step: "District Approval", status: "COMPLETED", officer: "District Collector Rewa", date: "2025-12-01" }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-06-25"
  },
  {
    id: "LND-00401",
    landId: "LND-00401",
    ulpin: "09-18-9901-V7K2A9",
    surveyNumber: "312/A",
    surveyNo: "312/A",
    khataNo: "K-1402",
    projectId: "PROJ-KASHI-KOL",
    projectName: "Varanasi-Ranchi-Kolkata Economic Corridor",
    currentOwner: "Tribhuwan Nath Upadhyay",
    ownerName: "Tribhuwan Nath Upadhyay",
    ownerPhone: "+91 94152 77014",
    aadhaarMasked: "XXXX-XXXX-8821",
    bankAccountVerified: true,
    bankName: "Union Bank of India (Chandauli)",
    ifsc: "UBIN0541200",
    areaHectares: 4.1,
    area: 4.1,
    landType: "Multi-Crop Agricultural",
    tehsil: "Chandauli",
    village: "Kanta",
    district: "Chandauli",
    state: "Uttar Pradesh",
    status: "APPROVAL",
    acquisitionStatus: "Inter-State Border Approval Under Scrutiny",
    expectedNextAction: "Resolve UP-Bihar boundary survey dispute and approve Section 3A award rate",
    riskScore: 78,
    riskTier: "HIGH",
    riskBreakdown: { approvalDelay: 35, legalDispute: 20, compensationDelay: 10, documentMissing: 13, deadline: 0 },
    recommendedAction: "Convene inter-state boundary demarcation session with Bihar Land Revenue cell",
    marketRatePerHa: 5200000,
    multiplier: 1.5,
    solatiumAmount: 31980000,
    totalAwardAmount: 63960000,
    dbtStatus: "PENDING_SANCTION",
    dbtTransactionId: null,
    dbtDate: null,
    coordinates: [
      [25.2600, 83.2700],
      [25.2635, 83.2740],
      [25.2605, 83.2780],
      [25.2570, 83.2730]
    ],
    center: [25.2602, 83.2738],
    documents: [
      { id: "DOC-VK-P1", title: "Chandauli Multi-Crop Land Valuation Dossier", type: "VALUATION_AWARD", date: "2026-06-12", status: "UNDER_REVIEW", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Chandauli", date: "2026-01-18" },
      { step: "Proposal Submitted", status: "COMPLETED", officer: "NHAI Nodal Officer", date: "2026-03-10" },
      { step: "District Approval", status: "PENDING", officer: "District Magistrate Chandauli", date: null }
    ],
    legalIssues: [
      { caseId: "CASE-401", issue: "Border Jurisdiction & Multiplier Dispute", status: "Active", assignedOfficer: "UP Revenue Board" }
    ],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-08-15"
  },
  {
    id: "LND-00501",
    landId: "LND-00501",
    ulpin: "29-12-7711-K4B2C8",
    surveyNumber: "77/1",
    surveyNo: "77/1",
    khataNo: "K-912",
    projectId: "PROJ-BLR-CHE",
    projectName: "Bengaluru-Chennai Expressway",
    currentOwner: "Manjunath Gowda & Sons",
    ownerName: "Manjunath Gowda & Sons",
    ownerPhone: "+91 98450 11982",
    aadhaarMasked: "XXXX-XXXX-4491",
    bankAccountVerified: true,
    bankName: "Canara Bank (Kolar)",
    ifsc: "CNRB0001420",
    areaHectares: 3.2,
    area: 3.2,
    landType: "Sericulture / Mulberry Agricultural",
    tehsil: "Kolar",
    village: "Vemagal",
    district: "Kolar",
    state: "Karnataka",
    status: "HANDOVER",
    acquisitionStatus: "Handover in Progress - Concessionaire Takeover",
    expectedNextAction: "Complete final tree felling certification and issue possession order",
    riskScore: 32,
    riskTier: "LOW",
    riskBreakdown: { approvalDelay: 0, legalDispute: 15, compensationDelay: 0, documentMissing: 0, deadline: 17 },
    recommendedAction: "Issue final possession handover certificate to NHAI concessionaire",
    marketRatePerHa: 4800000,
    multiplier: 1.5,
    solatiumAmount: 23040000,
    totalAwardAmount: 46080000,
    dbtStatus: "DISBURSED_100",
    dbtTransactionId: "DBT202607188941",
    dbtDate: "2026-07-18",
    coordinates: [
      [13.1360, 78.1280],
      [13.1390, 78.1310],
      [13.1365, 78.1340],
      [13.1340, 78.1300]
    ],
    center: [13.1364, 78.1308],
    documents: [
      { id: "DOC-BC-P1", title: "PFMS Disbursal Reconciliation Certificate", type: "FINANCIAL_AUDIT", date: "2026-07-20", status: "VERIFIED", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    approvals: [
      { step: "Land Identified", status: "COMPLETED", officer: "Land Officer Kolar", date: "2025-11-20" },
      { step: "District Approval", status: "COMPLETED", officer: "Deputy Commissioner Kolar", date: "2026-02-15" },
      { step: "Compensation Disbursed", status: "COMPLETED", officer: "CALA Kolar", date: "2026-07-18" }
    ],
    legalIssues: [],
    droneSurveyUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-fields-and-roads-41584-large.mp4",
    droneSurveyDate: "2026-08-10"
  }
];

export const LEGAL_CASES_DATA = [
  {
    id: "CASE-102",
    caseId: "CASE-102",
    landId: "LND-00127",
    ulpin: "06-12-8893-X7L1C9",
    surveyNumber: "112/1",
    issue: "Section 3C Title & Co-Sharer Partition Dispute under High Court Appeal SO-18",
    status: "Under Review",
    assignedOfficer: "Legal Nodal Officer Nuh",
    courtName: "High Court of Punjab & Haryana",
    petitioner: "Gurdeep Singh Sandhu & Co-sharers",
    nextHearingDate: "2026-09-28",
    priority: "HIGH"
  },
  {
    id: "CASE-108",
    caseId: "CASE-108",
    landId: "LND-00126",
    ulpin: "06-12-8892-M3P9B1",
    surveyNumber: "142/4",
    issue: "Tree & Structural Valuation Solatium Enhancement Claim",
    status: "Pending Hearing",
    assignedOfficer: "Land Nodal Officer Sohna",
    courtName: "District Collectorate Tribunal",
    petitioner: "Harish Yadav",
    nextHearingDate: "2026-10-05",
    priority: "MEDIUM"
  }
];

export const NOTIFICATIONS_DATA = [
  { id: "NOTIF-01", title: "New District Approval Request", message: "Land parcel LND-00126 requires District Collector approval for Section 3G Award.", type: "APPROVAL", read: false, date: "10 mins ago" },
  { id: "NOTIF-02", title: "High Risk Score Alert (Score 85)", message: "Land parcel LND-00127 flagged as HIGH RISK due to active legal stay & document delay.", type: "ALERT", read: false, date: "1 hour ago" },
  { id: "NOTIF-03", title: "PFMS DBT Compensation Pending", message: "2 parcels in Sohna Tehsil pending PFMS bank account verification.", type: "FINANCE", read: true, date: "3 hours ago" },
  { id: "NOTIF-04", title: "Section 3A Gazette Published", message: "e-Gazette Notification published for Taurupath corridor (Parcel LND-00128).", type: "NOTICE", read: true, date: "1 day ago" }
];

export const STATE_PERFORMANCE_STATS = [
  { state: "Haryana", totalLands: 4200, activeAcquisition: 850, pendingApprovals: 120, disputes: 42, dbtPercentage: 94 },
  { state: "Maharashtra", totalLands: 3100, activeAcquisition: 680, pendingApprovals: 145, disputes: 68, dbtPercentage: 68 },
  { state: "Uttar Pradesh", totalLands: 2800, activeAcquisition: 450, pendingApprovals: 82, disputes: 39, dbtPercentage: 88 },
  { state: "Gujarat", totalLands: 1450, activeAcquisition: 210, pendingApprovals: 40, disputes: 18, dbtPercentage: 92 },
  { state: "Madhya Pradesh", totalLands: 900, activeAcquisition: 120, pendingApprovals: 25, disputes: 16, dbtPercentage: 96 }
];

export const RECENT_AUDIT_LOGS = [
  {
    id: "LOG-901",
    timestamp: "2026-09-15 10:15:20",
    user: "District Collector Gurugram",
    role: "DISTRICT_OFFICER",
    action: "SECTION_3G_AWARD_APPROVED",
    entity: "Land Parcel",
    entityId: "LND-00125",
    oldStatus: "APPROVAL",
    newStatus: "HANDOVER",
    details: "Approved ₹2.62 Cr solatium award certificate under RFCTLARR 2013."
  },
  {
    id: "LOG-902",
    timestamp: "2026-09-15 09:40:11",
    user: "PFMS DBT System",
    role: "FINANCE_OFFICER",
    action: "DBT_BANK_DISBURSED",
    entity: "Compensation",
    entityId: "LND-00125",
    oldStatus: "PENDING",
    newStatus: "DISBURSED_100",
    details: "Direct Benefit Transfer of ₹2.62 Cr credited to SBI Account ending 8921."
  },
  {
    id: "LOG-903",
    timestamp: "2026-09-14 18:05:44",
    user: "Legal Nodal Officer Nuh",
    role: "LEGAL_OFFICER",
    action: "LEGAL_CASE_REGISTERED",
    entity: "Legal Case",
    entityId: "CASE-102",
    oldStatus: "NONE",
    newStatus: "Under Review",
    details: "Section 3C objection appeal registered under High Court stay CASE-102."
  }
];

export const ROUTE_ALIGNMENT_OPTIONS = [
  {
    alignmentId: "ALIGNMENT-ALPHA",
    name: "Proposed Route Alpha (Standard Forest Bypass)",
    lengthKm: 42.5,
    totalLandHa: 380,
    privateLandHa: 290,
    forestLandHa: 90,
    displacedFamilies: 140,
    estimatedCostCrores: 840,
    forestClearanceMonths: 8,
    litigationRiskIndex: "MEDIUM (22%)",
    recommendationBadge: "RECOMMENDED BY DSS (LOWEST COST)",
    score: 91
  },
  {
    alignmentId: "ALIGNMENT-BETA",
    name: "Alternative Route Beta (Direct Alignment)",
    lengthKm: 38.0,
    totalLandHa: 410,
    privateLandHa: 370,
    forestLandHa: 40,
    displacedFamilies: 310,
    estimatedCostCrores: 1120,
    forestClearanceMonths: 3,
    litigationRiskIndex: "HIGH (68% Displaced Family Disputes)",
    recommendationBadge: "HIGH DISPLACEMENT RISK",
    score: 68
  }
];

// 1. National Command Center Baseline KPIs with Realistic Trends
export const NATIONAL_COMMAND_KPIS = [
  {
    id: "kpi-projects",
    title: "Total Projects",
    value: "8",
    unit: "Active Corridors",
    trend: "+12.4%",
    trendPositive: true,
    trendLabel: "vs Last Quarter",
    subtext: "NHAI, DFCCIL, SECI, DMRC",
    color: "amber",
    targetSection: "projects"
  },
  {
    id: "kpi-parcels",
    title: "Total Land Parcels",
    value: "12,450",
    unit: "Cadastral Plots",
    trend: "+18.5%",
    trendPositive: true,
    trendLabel: "ULPIN Mapped",
    subtext: "100% Bhu-Aadhaar Seeded",
    color: "blue",
    targetSection: "map"
  },
  {
    id: "kpi-area",
    title: "Total Area Acquired",
    value: "2,895.7",
    unit: "Hectares",
    trend: "+5.6%",
    trendPositive: true,
    trendLabel: "corridor cleared",
    subtext: "Target: 3,420.0 Ha",
    color: "emerald",
    targetSection: "map"
  },
  {
    id: "kpi-states",
    title: "States Covered",
    value: "8",
    unit: "States & UTs",
    trend: "Pan-India",
    trendPositive: true,
    trendLabel: "Nodal Portals",
    subtext: "Haryana, MH, UP, GJ, MP...",
    color: "purple",
    targetSection: "states"
  },
  {
    id: "kpi-pending",
    title: "Pending Acquisitions",
    value: "1,240",
    unit: "Parcels in Process",
    trend: "-8.2%",
    trendPositive: true,
    trendLabel: "backlog reduced",
    subtext: "Avg turnaround: 52 days",
    color: "orange",
    targetSection: "lifecycle"
  },
  {
    id: "kpi-completed",
    title: "Completed Acquisitions",
    value: "11,210",
    unit: "Vested Parcels",
    trend: "+14.8%",
    trendPositive: true,
    trendLabel: "vested in authority",
    subtext: "Handover certs signed",
    color: "emerald",
    targetSection: "projects"
  },
  {
    id: "kpi-compensation",
    title: "Compensation Pending",
    value: "₹842.5",
    unit: "Crore INR",
    trend: "-6.4%",
    trendPositive: true,
    trendLabel: "disbursed this month",
    subtext: "1,418 Beneficiaries queued",
    color: "amber",
    targetSection: "compensation"
  },
  {
    id: "kpi-disputes",
    title: "Legal Disputes",
    value: "64",
    unit: "Active Cases",
    trend: "-3.1%",
    trendPositive: true,
    trendLabel: "disposed in Lok Adalat",
    subtext: "Sec 3C & High Court stays",
    color: "rose",
    targetSection: "legal"
  },
  {
    id: "kpi-delayed",
    title: "Delayed Projects",
    value: "2",
    unit: "Corridors > 60 Days",
    trend: "Critical Alert",
    trendPositive: false,
    trendLabel: "DFCCIL & Kashi-Kolkata",
    subtext: "Intervention required",
    color: "rose",
    targetSection: "critical"
  },
  {
    id: "kpi-risk",
    title: "High-Risk Projects",
    value: "3",
    unit: "Risk Score > 70",
    trend: "DSS Flagged",
    trendPositive: false,
    trendLabel: "Escrow & Stay alerts",
    subtext: "Explainable Risk Engine",
    color: "red",
    targetSection: "risk"
  }
];

// 2. Critical Cases Requiring Ministry Attention
export const CRITICAL_CASES_DATA = [
  {
    id: "CASE-CRIT-01",
    caseId: "CASE-CRIT-01",
    title: "Palghar Forest Corridor High Court Stay",
    project: "Western Dedicated Freight Corridor",
    projectId: "PROJ-DFCC-WEST",
    state: "Maharashtra",
    district: "Palghar",
    stage: "OBJECTION",
    severity: "Critical",
    delayDays: 84,
    reason: "Section 3C joint title dispute and environmental stay on 42 hectares of mangrove fringe.",
    recommendedAction: "Execute Court Escrow deposit of ₹140 Cr & request State Advocate General for expedited hearing.",
    officer: "Smt. Anita Deshmukh (State Secretary)",
    affectedParcels: 38,
    financialImpactCr: 140.0,
    status: "OPEN_CASE",
    deadline: "2026-09-28"
  },
  {
    id: "CASE-CRIT-02",
    caseId: "CASE-CRIT-02",
    title: "Sonbhadra Mining Belt Compensation Backlog",
    project: "Varanasi-Ranchi-Kolkata Economic Corridor",
    projectId: "PROJ-KASHI-KOL",
    state: "Uttar Pradesh",
    district: "Sonbhadra",
    stage: "COMPENSATION",
    severity: "Critical",
    delayDays: 62,
    reason: "PFMS bank account IFSC mismatch for 420 tribal families; compensation award held in abeyance.",
    recommendedAction: "Direct District Magistrate Sonbhadra to conduct mobile Aadhaar-PFMS camps within 7 days.",
    officer: "District Collector Sonbhadra",
    affectedParcels: 142,
    financialImpactCr: 88.5,
    status: "OPEN_CASE",
    deadline: "2026-10-02"
  },
  {
    id: "CASE-CRIT-03",
    caseId: "CASE-CRIT-03",
    title: "Nuh Section 3G Solatium Dispute Appeal",
    project: "Delhi-Mumbai Industrial Expressway",
    projectId: "PROJ-NH48-EXPR",
    state: "Haryana",
    district: "Nuh",
    stage: "LEGAL",
    severity: "High",
    delayDays: 38,
    reason: "Landowner consortium filed Section 3G arbitration claiming commercial valuation for agricultural stretch.",
    recommendedAction: "Convene Arbitration Tribunal under retired District Judge to settle multiplier factor.",
    officer: "Shri Vikramaditya Singh (LAO)",
    affectedParcels: 18,
    financialImpactCr: 32.4,
    status: "IN_REVIEW",
    deadline: "2026-10-10"
  },
  {
    id: "CASE-CRIT-04",
    caseId: "CASE-CRIT-04",
    title: "Navsari Industrial Plot Cadastral Overlap",
    project: "PM MITRA Mega Integrated Textile Region",
    projectId: "PROJ-GATI-SEZ",
    state: "Gujarat",
    district: "Navsari",
    stage: "VERIFICATION",
    severity: "Medium",
    delayDays: 31,
    reason: "Discrepancy between satellite GIS boundary and State revenue village map of 1972.",
    recommendedAction: "Deploy DGPS drone re-survey using Bhu-Aadhaar 14-digit geo-coordinates to freeze polygon.",
    officer: "Superintendent of Land Records Surat",
    affectedParcels: 24,
    financialImpactCr: 19.2,
    status: "IN_REVIEW",
    deadline: "2026-10-15"
  },
  {
    id: "CASE-CRIT-05",
    caseId: "CASE-CRIT-05",
    title: "Kolar Interchange Possession Certificate Delay",
    project: "Bengaluru-Chennai Expressway",
    projectId: "PROJ-BLR-CHE",
    state: "Karnataka",
    district: "Kolar",
    stage: "POSSESSION",
    severity: "Low",
    delayDays: 14,
    reason: "Pending physical removal of electric utility poles by State Electricity Board.",
    recommendedAction: "Issue inter-departmental notice to KPTCL to clear utility right-of-way within 14 days.",
    officer: "NHAI Project Director Kolar",
    affectedParcels: 9,
    financialImpactCr: 6.8,
    status: "RESOLVING",
    deadline: "2026-09-30"
  },
  {
    id: "CASE-CRIT-06",
    caseId: "CASE-CRIT-06",
    title: "Aerocity Defense Land No-Objection Certificate",
    project: "Delhi Metro Phase IV",
    projectId: "PROJ-DMRC-PH4",
    state: "Delhi",
    district: "South West Delhi",
    stage: "APPROVAL",
    severity: "High",
    delayDays: 22,
    reason: "Security clearance pending from Ministry of Defense for underground tunnel vent shaft.",
    recommendedAction: "Convene Central Ministry Joint Nodal Committee between MoHUA & MoD.",
    officer: "Chief Project Manager DMRC",
    affectedParcels: 4,
    financialImpactCr: 45.0,
    status: "OPEN_CASE",
    deadline: "2026-10-05"
  }
];

// 3. Bottleneck Analytics Across 6 Statutory Funnels
export const BOTTLENECK_ANALYTICS_DATA = [
  {
    stage: "Verification",
    key: "VERIFICATION",
    casesCount: 284,
    avgDelayDays: 38,
    pctTotalCases: 19,
    avgProcessingDays: 58,
    slaTargetDays: 45,
    rootCause: "Manual encumbrance checks & physical revenue record reconciliations in older taluks"
  },
  {
    stage: "Administrative Approval",
    key: "APPROVAL",
    casesCount: 195,
    avgDelayDays: 32,
    pctTotalCases: 13,
    avgProcessingDays: 48,
    slaTargetDays: 30,
    rootCause: "Multi-tier state-to-district collectorate circular routing without digital e-Sign"
  },
  {
    stage: "Gazette Notification",
    key: "NOTIFICATION",
    casesCount: 160,
    avgDelayDays: 24,
    pctTotalCases: 11,
    avgProcessingDays: 40,
    slaTargetDays: 30,
    rootCause: "Central Gazette publication turnaround and regional vernacular newspaper print delays"
  },
  {
    stage: "Objections & Hearings",
    key: "OBJECTION",
    casesCount: 310,
    avgDelayDays: 49,
    pctTotalCases: 21,
    avgProcessingDays: 74,
    slaTargetDays: 45,
    rootCause: "Section 3C partition disputes, co-sharer claims, and tribunal court stay appeals"
  },
  {
    stage: "Compensation Disbursal",
    key: "COMPENSATION",
    casesCount: 465,
    avgDelayDays: 74,
    pctTotalCases: 31,
    avgProcessingDays: 92,
    slaTargetDays: 60,
    rootCause: "PFMS bank account verification errors, rural KYC gaps, and title inheritance claims"
  },
  {
    stage: "Physical Possession",
    key: "POSSESSION",
    casesCount: 75,
    avgDelayDays: 18,
    pctTotalCases: 5,
    avgProcessingDays: 36,
    slaTargetDays: 30,
    rootCause: "Utility shifting delays (overhead electrical cables, water mains) & R&R plot handovers"
  }
];

// 4. Detailed State Performance & Benchmarking
export const DETAILED_STATE_STATS = [
  {
    state: "Haryana",
    code: "HR",
    totalProjects: 14,
    completed: 10,
    inProgress: 3,
    delayed: 1,
    highRisk: 1,
    totalAreaHa: 1420.0,
    acquiredAreaHa: 1280.5,
    avgAcquisitionMonths: 11.2,
    compensationAllocatedCr: 3850.0,
    compensationDisbursedCr: 3620.0,
    compensationPendingCr: 230.0,
    legalDisputes: 42,
    completionRate: 90.1,
    performanceTier: "Excellent",
    color: "#059669"
  },
  {
    state: "Maharashtra",
    code: "MH",
    totalProjects: 18,
    completed: 9,
    inProgress: 6,
    delayed: 3,
    highRisk: 3,
    totalAreaHa: 2150.0,
    acquiredAreaHa: 1460.0,
    avgAcquisitionMonths: 16.8,
    compensationAllocatedCr: 5400.0,
    compensationDisbursedCr: 3672.0,
    compensationPendingCr: 1728.0,
    legalDisputes: 68,
    completionRate: 67.9,
    performanceTier: "Needs Attention",
    color: "#dc2626"
  },
  {
    state: "Uttar Pradesh",
    code: "UP",
    totalProjects: 22,
    completed: 15,
    inProgress: 5,
    delayed: 2,
    highRisk: 2,
    totalAreaHa: 3400.0,
    acquiredAreaHa: 2980.0,
    avgAcquisitionMonths: 12.5,
    compensationAllocatedCr: 6800.0,
    compensationDisbursedCr: 5984.0,
    compensationPendingCr: 816.0,
    legalDisputes: 39,
    completionRate: 87.6,
    performanceTier: "Good",
    color: "#d97706"
  },
  {
    state: "Gujarat",
    code: "GJ",
    totalProjects: 16,
    completed: 13,
    inProgress: 2,
    delayed: 1,
    highRisk: 1,
    totalAreaHa: 1890.0,
    acquiredAreaHa: 1740.0,
    avgAcquisitionMonths: 10.4,
    compensationAllocatedCr: 4100.0,
    compensationDisbursedCr: 3772.0,
    compensationPendingCr: 328.0,
    legalDisputes: 18,
    completionRate: 92.0,
    performanceTier: "Leader",
    color: "#059669"
  },
  {
    state: "Madhya Pradesh",
    code: "MP",
    totalProjects: 11,
    completed: 10,
    inProgress: 1,
    delayed: 0,
    highRisk: 0,
    totalAreaHa: 1650.0,
    acquiredAreaHa: 1585.0,
    avgAcquisitionMonths: 9.8,
    compensationAllocatedCr: 2900.0,
    compensationDisbursedCr: 2784.0,
    compensationPendingCr: 116.0,
    legalDisputes: 16,
    completionRate: 96.0,
    performanceTier: "Leader",
    color: "#059669"
  },
  {
    state: "Karnataka",
    code: "KA",
    totalProjects: 12,
    completed: 9,
    inProgress: 2,
    delayed: 1,
    highRisk: 0,
    totalAreaHa: 1240.0,
    acquiredAreaHa: 1080.0,
    avgAcquisitionMonths: 11.8,
    compensationAllocatedCr: 3100.0,
    compensationDisbursedCr: 2790.0,
    compensationPendingCr: 310.0,
    legalDisputes: 24,
    completionRate: 87.1,
    performanceTier: "Good",
    color: "#059669"
  },
  {
    state: "Rajasthan",
    code: "RJ",
    totalProjects: 15,
    completed: 13,
    inProgress: 2,
    delayed: 0,
    highRisk: 0,
    totalAreaHa: 2200.0,
    acquiredAreaHa: 2068.0,
    avgAcquisitionMonths: 10.1,
    compensationAllocatedCr: 3600.0,
    compensationDisbursedCr: 3384.0,
    compensationPendingCr: 216.0,
    legalDisputes: 19,
    completionRate: 94.0,
    performanceTier: "Leader",
    color: "#059669"
  },
  {
    state: "Tamil Nadu",
    code: "TN",
    totalProjects: 10,
    completed: 7,
    inProgress: 2,
    delayed: 1,
    highRisk: 1,
    totalAreaHa: 1120.0,
    acquiredAreaHa: 950.0,
    avgAcquisitionMonths: 13.6,
    compensationAllocatedCr: 2750.0,
    compensationDisbursedCr: 2310.0,
    compensationPendingCr: 440.0,
    legalDisputes: 29,
    completionRate: 84.8,
    performanceTier: "Moderate",
    color: "#d97706"
  }
];

// 5. Compensation & DBT Monitoring Dataset
export const COMPENSATION_ANALYTICS_DATA = {
  totalAllocatedCr: 34100.0,
  totalDisbursedCr: 29516.0,
  totalPendingCr: 4584.0,
  beneficiariesPaid: 184500,
  beneficiariesPending: 22400,
  avgDisbursalDays: 16.4,
  pfmsSuccessRate: 98.6,
  severelyDelayedCases: [
    { id: "DBT-DEL-01", project: "Western DFC", state: "Maharashtra", district: "Palghar", beneficiaries: 380, pendingCr: 140.0, delayDays: 84, reason: "Tribal Land alienation verification pending under Section 3G" },
    { id: "DBT-DEL-02", project: "Kashi-Kolkata Corridor", state: "Uttar Pradesh", district: "Sonbhadra", beneficiaries: 420, pendingCr: 88.5, delayDays: 62, reason: "Joint bank account KYC discrepancy in rural branch" },
    { id: "DBT-DEL-03", project: "Delhi-Mumbai Expressway", state: "Haryana", district: "Nuh", beneficiaries: 145, pendingCr: 42.0, delayDays: 48, reason: "Inheritance mutation pending after death of primary khatedar" }
  ]
};

// 6. Ministry Automated Decision Support Insights
export const MINISTRY_DECISION_INSIGHTS = [
  {
    question: "Which states have the highest acquisition delays?",
    summary: "Maharashtra and Uttar Pradesh report the longest average acquisition turnarounds (16.8 and 12.5 months), primarily driven by Section 3C public objections and court stay appeals.",
    recommendation: "Establish Special Land Acquisition Tribunals (SLAT) in Mumbai and Lucknow to fast-track Section 3C dispute disposal within 30-day statutory windows.",
    metric: "16.8 mos",
    severity: "HIGH"
  },
  {
    question: "Which projects are at highest risk?",
    summary: "Western DFC (Palghar stretch, Risk Score 85) and Varanasi-Ranchi-Kolkata Corridor (Risk Score 78) exceed statutory timelines by over 60 days.",
    recommendation: "Execute ₹140 Cr Court Escrow deposit for Western DFC to lift High Court stay and deploy mobile Aadhaar-PFMS teams to Sonbhadra.",
    metric: "3 Corridors",
    severity: "CRITICAL"
  },
  {
    question: "Where is compensation getting delayed?",
    summary: "Compensation disbursal constitutes the largest national funnel bottleneck, accounting for 31% of all delayed acquisition cases (₹4,584 Cr currently in process).",
    recommendation: "Adopt automated Bhu-Aadhaar PFMS direct API integration to eliminate manual branch verification for awards under ₹1 Crore.",
    metric: "31% Bottleneck",
    severity: "HIGH"
  },
  {
    question: "Which districts require immediate ministry intervention?",
    summary: "Palghar (Maharashtra), Sonbhadra (Uttar Pradesh), and Nuh (Haryana) require immediate Collectorate review due to overlapping stays and high compensation backlog.",
    recommendation: "Schedule Joint Secretary video conference with District Collectors of Palghar, Sonbhadra, and Nuh within 48 hours.",
    metric: "3 Districts",
    severity: "CRITICAL"
  },
  {
    question: "Which acquisition stages create the largest bottleneck?",
    summary: "Compensation (avg 74 days delay) and Section 3C Objections (avg 49 days delay) constitute 52% of total national project delays.",
    recommendation: "Enforce statutory SLA tracking on DILRMP 3.0 with automatic escalation to State Chief Secretaries at Day 45.",
    metric: "52% Cumulative",
    severity: "HIGH"
  },
  {
    question: "Which projects may miss their target completion date?",
    summary: "Western DFC (Target: March 2027) and Kashi-Kolkata Corridor (Target: December 2027) are currently trending 4 to 6 months behind scheduled critical path milestones.",
    recommendation: "Apply parallel processing of Sec 3D declaration along with pre-possession utility survey to recover 45 lost calendar days.",
    metric: "2 Projects",
    severity: "MEDIUM"
  }
];
