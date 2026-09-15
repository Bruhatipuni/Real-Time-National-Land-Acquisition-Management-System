// Comprehensive Field Surveyor & DGPS Survey Dataset for BHOOMISETU

export const SURVEYOR_KPIS = {
  assignedToday: 32,
  completedToday: 24,
  pendingSurveys: 8,
  resurveyRequired: 3,
  boundaryDisputes: 3,
  offlineSyncPending: 5,
  targetCompletionDays: 3,
  todayProgressPercent: 75 // 24 / 32
};

export const SURVEYOR_NOTIFICATIONS = [
  { id: 'NOTIF-01', title: 'New Parcel Assigned', message: 'Plot 143/1 (ULPIN: 06-12-8891-K9X2C6) in Tauru assigned for urgent DGPS survey.', type: 'ASSIGNMENT', time: '10 mins ago', unread: true },
  { id: 'NOTIF-02', title: 'Survey Deadline Approaching', message: 'Survey for LND-00127 deadline is in 2 days (17 Sep 2026).', type: 'DEADLINE', time: '35 mins ago', unread: true },
  { id: 'NOTIF-03', title: 'Boundary Objection Raised', message: 'Owner Rameshwar Singh disputed North-East chainage on Survey #142/3.', type: 'DISPUTE', time: '1 hour ago', unread: true },
  { id: 'NOTIF-04', title: 'Supervisor Returned Survey', message: 'Survey #142/5 returned for re-verification of irrigation borewell coordinates.', type: 'RETURNED', time: '3 hours ago', unread: false },
  { id: 'NOTIF-05', title: 'CORS RTK Station Synced', message: 'Haryana DILRMP CORS Station Sohna connected with 18 satellites (±2.1m accuracy).', type: 'GNSS', time: '4 hours ago', unread: false }
];

export const SURVEYOR_ROUTE_PLAN = {
  routeId: 'ROUTE-SOHNA-04',
  routeName: 'Sohna Rural & Tauru Corridor Field Circuit',
  totalDistanceKm: 38.4,
  estimatedTime: '5h 20m',
  corridor: 'Delhi-Mumbai Expressway Spur (KM 38.2 to 44.8)',
  baseOffice: 'Tehsildar & Survey Office, Sohna',
  waypoints: [
    { order: 1, type: 'BASE', name: 'Sohna Survey Base Office', lat: 28.2490, lng: 77.0620, stopDuration: 'Departs 09:00 AM' },
    { order: 2, type: 'PARCEL', parcelId: 'LND-00125', name: 'Plot 142/3 (Rameshwar Singh)', lat: 28.2475, lng: 77.0655, stopDuration: '45 mins', priority: 'HIGH' },
    { order: 3, type: 'PARCEL', parcelId: 'LND-00126', name: 'Plot 142/4 (Raj Kumar)', lat: 28.2498, lng: 77.0682, stopDuration: '30 mins', priority: 'MEDIUM' },
    { order: 4, type: 'PARCEL', parcelId: 'LND-00127', name: 'Plot 143/1 (Suresh Kumar)', lat: 28.2525, lng: 77.0715, stopDuration: '50 mins', priority: 'HIGH' },
    { order: 5, type: 'PARCEL', parcelId: 'LND-00128', name: 'Plot 143/2 (Kanta Devi)', lat: 28.2550, lng: 77.0740, stopDuration: '35 mins', priority: 'CRITICAL' },
    { order: 6, type: 'PARCEL', parcelId: 'LND-00129', name: 'Plot 144/1 (Balram Sharma)', lat: 28.2580, lng: 77.0770, stopDuration: '40 mins', priority: 'LOW' },
    { order: 7, type: 'BASE', name: 'Return to Base & Sync', lat: 28.2490, lng: 77.0620, stopDuration: 'Arrives 03:20 PM' }
  ]
};

export const ASSIGNED_PARCELS_DATA = [
  {
    id: 'LND-00125',
    ulpin: '06-12-8891-K9X2A4',
    surveyNumber: '142/3',
    village: 'Sohna Rural',
    district: 'Gurugram',
    state: 'Haryana',
    tehsil: 'Sohna',
    project: 'Delhi-Mumbai Industrial Expressway',
    projectId: 'PROJ-NH48-EXPR',
    recordedAreaHa: 4.50,
    surveyedAreaHa: 4.47,
    areaDifferenceHa: -0.03,
    deviationPercent: -0.67,
    mismatchStatus: 'TOLERANCE_OK', // 'TOLERANCE_OK', 'REVIEW_REQUIRED', 'SIGNIFICANT_MISMATCH'
    ownerName: 'Rameshwar Singh Yadav',
    fatherHusbandName: 'Mahendra Singh Yadav',
    ownerPhone: '+91 98120 44102',
    coOwners: 'None (Sole Khatedar)',
    landType: 'Agricultural (Irrigated Chahi)',
    surveyStatus: 'IN_PROGRESS', // 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'RE_SURVEY', 'DISPUTED'
    workflowStage: 'FIELD_SURVEY', // 'DRAFT', 'FIELD_SURVEY', 'VALIDATION', 'SUBMITTED', 'SUPERVISOR_REVIEW', 'APPROVED', 'RETURNED'
    priority: 'HIGH', // 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    deadline: '18 Sep 2026',
    daysRemaining: 3,
    assignedToday: true,
    offlineAvailable: true,
    syncStatus: 'SYNCED',
    surveyorAssigned: 'Anish Kumar (Surveyor)',
    surveyorId: 'SURV-HR-048',
    lastSurveyDate: '15 Sep 2026',
    gnssQuality: 'RTK_FIX',
    gpsAccuracy: '±1.8 m',
    satellitesTracked: 19,
    currentLatitude: 28.247852,
    currentLongitude: 77.065418,
    altitudeMeters: 215.4,
    corsStation: 'HR-SOHNA-CORS-01 (CONNECTED)',
    // Official cadastral polygon (recorded in revenue map)
    cadastralPolygon: [
      [28.2470, 77.0645],
      [28.2492, 77.0648],
      [28.2490, 77.0675],
      [28.2468, 77.0670]
    ],
    // Measured field survey polygon (from live DGPS boundary walk)
    surveyPolygon: [
      [28.2471, 77.0646],
      [28.2491, 77.0649],
      [28.2489, 77.0674],
      [28.2469, 77.0669]
    ],
    mapCenter: [28.2480, 77.0660],
    capturedPoints: [
      { id: 'P1', name: 'P1 - NW Boundary Stone', lat: 28.2471, lng: 77.0646, elevation: 215.2, time: '10:14 AM', accuracy: '±1.4m', type: 'CORNER_STONE' },
      { id: 'P2', name: 'P2 - NE Ridge Point', lat: 28.2491, lng: 77.0649, elevation: 215.6, time: '10:22 AM', accuracy: '±1.6m', type: 'RIDGE_POINT' },
      { id: 'P3', name: 'P3 - SE Tubewell Junction', lat: 28.2489, lng: 77.0674, elevation: 215.1, time: '10:31 AM', accuracy: '±1.8m', type: 'STRUCTURE' },
      { id: 'P4', name: 'P4 - SW Village Path Corner', lat: 28.2469, lng: 77.0669, elevation: 215.5, time: '10:40 AM', accuracy: '±1.5m', type: 'CORNER_STONE' }
    ],
    ownerVerification: {
      ownerPresent: true,
      identityVerified: true,
      idType: 'Aadhaar Card (UIDAI Verified)',
      aadhaarMasked: 'XXXX-XXXX-8921',
      agreesWithBoundary: true,
      hasSignature: true,
      signatureDate: '15 Sep 2026 10:45 AM',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 50 10 90 35 T 180 30" stroke="%230f172a" stroke-width="2" fill="none"/></svg>',
      objectionNotes: ''
    },
    evidencePhotos: [
      { id: 'IMG-01', category: 'Boundary Marker', title: 'North-West Cadastral Boundary Stone', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60', timestamp: '15 Sep 2026 10:15 AM', lat: 28.2471, lng: 77.0646, surveyorId: 'SURV-HR-048' },
      { id: 'IMG-02', category: 'Existing Structure', title: 'Electric Pump & Concrete Borewell', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=60', timestamp: '15 Sep 2026 10:28 AM', lat: 28.2489, lng: 77.0674, surveyorId: 'SURV-HR-048' },
      { id: 'IMG-03', category: 'Land Photo', title: 'Standing Mustard & Wheat Cultivation', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=60', timestamp: '15 Sep 2026 10:35 AM', lat: 28.2480, lng: 77.0660, surveyorId: 'SURV-HR-048' },
      { id: 'IMG-04', category: 'Road Access', title: 'Paved Village PWD Approach Road', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60', timestamp: '15 Sep 2026 10:42 AM', lat: 28.2469, lng: 77.0669, surveyorId: 'SURV-HR-048' }
    ],
    voiceNotes: [
      { id: 'VN-01', timestamp: '15 Sep 2026 10:25 AM', duration: '0:34', transcript: 'North boundary is approximately 45 metres and an existing irrigation channel is present along the east ridge. Boundary stone intact.', surveyor: 'Anish Kumar' }
    ],
    documents: [
      { id: 'DOC-101', title: 'Record of Rights (Jamabandi / RoR)', type: 'REVENUE_RECORD', issuedDate: '12 Jul 2026', authority: 'Tehsildar Sohna', verified: true, size: '2.4 MB' },
      { id: 'DOC-102', title: 'Registered Sale Deed #4892/2018', type: 'TITLE_DEED', issuedDate: '18 Nov 2018', authority: 'Sub-Registrar Gurugram', verified: true, size: '4.8 MB' },
      { id: 'DOC-103', title: 'Mutation Certificate (Intiqal #1082)', type: 'MUTATION', issuedDate: '04 Jan 2019', authority: 'Patwari Halqa Sohna', verified: true, size: '1.8 MB' },
      { id: 'DOC-104', title: 'Section 3A Gazette Notification (MoRTH)', type: 'GAZETTE', issuedDate: '15 Aug 2026', authority: 'Ministry of Road Transport', verified: true, size: '3.1 MB' },
      { id: 'DOC-105', title: 'Section 3G Land Award Determination', type: 'AWARD', issuedDate: '01 Sep 2026', authority: 'CALA / District Collector', verified: true, size: '5.2 MB' },
      { id: 'DOC-106', title: 'Preliminary DGPS Cadastral Survey Report', type: 'PREV_SURVEY', issuedDate: '10 Sep 2026', authority: 'Survey of India PIU', verified: false, size: '6.7 MB' }
    ],
    timeline: [
      { date: '15 Sep 2026 10:10 AM', title: 'Field DGPS Survey Commenced', officer: 'Anish Kumar (Surveyor)', status: 'COMPLETED', note: 'Base GNSS RTK lock obtained with ±1.8m accuracy.' },
      { date: '14 Sep 2026 04:00 PM', title: 'Owner Survey Notice Served', officer: 'Patwari Halqa Sohna', status: 'COMPLETED', note: 'Notice acknowledged by Rameshwar Singh Yadav.' },
      { date: '10 Sep 2026 11:30 AM', title: 'Compensation Award Finalized', officer: 'Competent Authority (CALA)', status: 'COMPLETED', note: 'Section 3G award determined under RFCTLARR 2013.' },
      { date: '15 Aug 2026 09:00 AM', title: 'Section 3A Gazette Notification', officer: 'MoRTH Union Registry', status: 'COMPLETED', note: 'Published in Gazette of India Extraordinary.' },
      { date: '10 Jul 2026 02:15 PM', title: 'Corridor Alignment Land Identified', officer: 'NHAI PIU Gurugram', status: 'COMPLETED', note: 'Project expressway ROW intersects Survey #142/3.' }
    ],
    auditTrail: [
      { timestamp: '15 Sep 2026 10:45 AM', surveyor: 'Anish Kumar', action: 'Captured Owner Signature', field: 'ownerVerification.hasSignature', oldValue: 'false', newValue: 'true', reason: 'Owner Rameshwar Singh verified boundary on-site' },
      { timestamp: '15 Sep 2026 10:40 AM', surveyor: 'Anish Kumar', action: 'DGPS Boundary Walk Completed', field: 'surveyedAreaHa', oldValue: '4.50 Ha', newValue: '4.47 Ha', reason: 'Real-time DGPS 4-corner coordinate walk' },
      { timestamp: '15 Sep 2026 10:14 AM', surveyor: 'Anish Kumar', action: 'Plotted Corner Stone P1', field: 'capturedPoints', oldValue: '0 points', newValue: '4 points', reason: 'High precision RTK fix corner verification' },
      { timestamp: '14 Sep 2026 09:30 AM', surveyor: 'System Nodal', action: 'Survey Assigned', field: 'surveyStatus', oldValue: 'UNASSIGNED', newValue: 'IN_PROGRESS', reason: 'Expressway corridor acquisition fast-track' }
    ]
  },
  {
    id: 'LND-00126',
    ulpin: '06-12-8891-K9X2B5',
    surveyNumber: '142/4',
    village: 'Sohna Rural',
    district: 'Gurugram',
    state: 'Haryana',
    tehsil: 'Sohna',
    project: 'Delhi-Mumbai Industrial Expressway',
    projectId: 'PROJ-NH48-EXPR',
    recordedAreaHa: 2.80,
    surveyedAreaHa: 2.78,
    areaDifferenceHa: -0.02,
    deviationPercent: -0.71,
    mismatchStatus: 'TOLERANCE_OK',
    ownerName: 'Raj Kumar',
    fatherHusbandName: 'Dharampal Singh',
    ownerPhone: '+91 98451 90112',
    coOwners: 'Sunita Devi (Wife, 50% Share)',
    landType: 'Agricultural',
    surveyStatus: 'PENDING',
    workflowStage: 'DRAFT',
    priority: 'MEDIUM',
    deadline: '20 Sep 2026',
    daysRemaining: 5,
    assignedToday: true,
    offlineAvailable: true,
    syncStatus: 'SYNCED',
    surveyorAssigned: 'Anish Kumar (Surveyor)',
    surveyorId: 'SURV-HR-048',
    lastSurveyDate: 'Pending Field Visit',
    gnssQuality: 'AWAITING_FIX',
    gpsAccuracy: '±2.4 m',
    satellitesTracked: 16,
    currentLatitude: 28.2498,
    currentLongitude: 77.0682,
    altitudeMeters: 216.0,
    corsStation: 'HR-SOHNA-CORS-01 (STANDBY)',
    cadastralPolygon: [
      [28.2490, 77.0675],
      [28.2515, 77.0678],
      [28.2512, 77.0705],
      [28.2488, 77.0700]
    ],
    surveyPolygon: [
      [28.2490, 77.0675],
      [28.2514, 77.0678],
      [28.2511, 77.0704],
      [28.2488, 77.0700]
    ],
    mapCenter: [28.2502, 77.0688],
    capturedPoints: [],
    ownerVerification: {
      ownerPresent: false,
      identityVerified: false,
      idType: '',
      aadhaarMasked: 'XXXX-XXXX-4412',
      agreesWithBoundary: true,
      hasSignature: false,
      signatureDate: '',
      signatureDataUrl: '',
      objectionNotes: ''
    },
    evidencePhotos: [],
    voiceNotes: [],
    documents: [
      { id: 'DOC-201', title: 'Record of Rights (Jamabandi)', type: 'REVENUE_RECORD', issuedDate: '10 Jun 2026', authority: 'Tehsildar Sohna', verified: true, size: '2.1 MB' },
      { id: 'DOC-202', title: 'Title Deed #1104/2015', type: 'TITLE_DEED', issuedDate: '12 May 2015', authority: 'Sub-Registrar Gurugram', verified: true, size: '3.9 MB' }
    ],
    timeline: [
      { date: '14 Sep 2026', title: 'Assigned to Surveyor Anish Kumar', officer: 'Tehsildar Sohna', status: 'COMPLETED', note: 'Scheduled for 16 Sep field inspection.' },
      { date: '15 Aug 2026', title: 'Section 3A Gazette Notification', officer: 'MoRTH', status: 'COMPLETED', note: 'Included in Expressway expansion corridor.' }
    ],
    auditTrail: [
      { timestamp: '14 Sep 2026 02:00 PM', surveyor: 'Tehsildar Sohna', action: 'Survey Assignment', field: 'surveyorAssigned', oldValue: 'None', newValue: 'Anish Kumar', reason: 'Field roster distribution' }
    ]
  },
  {
    id: 'LND-00127',
    ulpin: '06-12-8891-K9X2C6',
    surveyNumber: '143/1',
    village: 'Tauru Rural',
    district: 'Nuh',
    state: 'Haryana',
    tehsil: 'Tauru',
    project: 'Delhi-Mumbai Industrial Expressway',
    projectId: 'PROJ-NH48-EXPR',
    recordedAreaHa: 6.20,
    surveyedAreaHa: 6.72,
    areaDifferenceHa: +0.52,
    deviationPercent: +8.39,
    mismatchStatus: 'SIGNIFICANT_MISMATCH',
    ownerName: 'Suresh Kumar & Brothers',
    fatherHusbandName: 'Late Chhaju Ram',
    ownerPhone: '+91 94160 88219',
    coOwners: 'Mahesh Kumar (Brother), Vijay Kumar (Brother)',
    landType: 'Agricultural (Partial Commercial Gair Mumkin)',
    surveyStatus: 'DISPUTED',
    workflowStage: 'VALIDATION',
    priority: 'HIGH',
    deadline: '17 Sep 2026',
    daysRemaining: 2,
    assignedToday: true,
    offlineAvailable: true,
    syncStatus: 'SYNC_PENDING',
    surveyorAssigned: 'Anish Kumar (Surveyor)',
    surveyorId: 'SURV-HR-048',
    lastSurveyDate: '15 Sep 2026',
    gnssQuality: 'RTK_FIX',
    gpsAccuracy: '±2.1 m',
    satellitesTracked: 18,
    currentLatitude: 28.2525,
    currentLongitude: 77.0715,
    altitudeMeters: 217.5,
    corsStation: 'HR-NUH-CORS-02 (CONNECTED)',
    cadastralPolygon: [
      [28.2515, 77.0705],
      [28.2545, 77.0710],
      [28.2540, 77.0745],
      [28.2510, 77.0740]
    ],
    surveyPolygon: [
      [28.2515, 77.0705],
      [28.2552, 77.0712], // Extended North boundary
      [28.2546, 77.0752], // Extended East boundary
      [28.2508, 77.0742]
    ],
    mapCenter: [28.2530, 77.0725],
    capturedPoints: [
      { id: 'P1', name: 'P1 - Boundary Pillar South', lat: 28.2515, lng: 77.0705, elevation: 217.2, time: '11:15 AM', accuracy: '±1.8m', type: 'CORNER_STONE' },
      { id: 'P2', name: 'P2 - Disputed North Fence', lat: 28.2552, lng: 77.0712, elevation: 217.8, time: '11:28 AM', accuracy: '±2.0m', type: 'DISPUTED_LINE' },
      { id: 'P3', name: 'P3 - Canal Bundh East', lat: 28.2546, lng: 77.0752, elevation: 217.5, time: '11:39 AM', accuracy: '±1.9m', type: 'STRUCTURE' },
      { id: 'P4', name: 'P4 - Village Common Edge', lat: 28.2508, lng: 77.0742, elevation: 217.1, time: '11:48 AM', accuracy: '±1.8m', type: 'CORNER_STONE' }
    ],
    ownerVerification: {
      ownerPresent: true,
      identityVerified: true,
      idType: 'Voter ID & Aadhaar',
      aadhaarMasked: 'XXXX-XXXX-3391',
      agreesWithBoundary: false,
      hasSignature: false,
      signatureDate: '',
      signatureDataUrl: '',
      objectionNotes: 'Owner claims an extra 0.52 Ha of ancestral canal bandh was cultivated since 1978 and must be acquired with full compensation.'
    },
    evidencePhotos: [
      { id: 'IMG-11', category: 'Boundary Marker', title: 'Old Brick Pillar at Southern Edge', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60', timestamp: '15 Sep 2026 11:20 AM', lat: 28.2515, lng: 77.0705, surveyorId: 'SURV-HR-048' },
      { id: 'IMG-12', category: 'Encroachment', title: 'Extended North Iron Fence over PWD Strip', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=60', timestamp: '15 Sep 2026 11:32 AM', lat: 28.2552, lng: 77.0712, surveyorId: 'SURV-HR-048' }
    ],
    voiceNotes: [
      { id: 'VN-02', timestamp: '15 Sep 2026 11:45 AM', duration: '0:48', transcript: 'Owner refuses to sign boundary agreement. States that north fence represents their actual possession line for over 45 years. Marked for Collectorate Legal Dispute review.', surveyor: 'Anish Kumar' }
    ],
    documents: [
      { id: 'DOC-301', title: 'Jamabandi RoR 2021-22', type: 'REVENUE_RECORD', issuedDate: '15 Jun 2026', authority: 'Tehsildar Tauru', verified: true, size: '3.0 MB' },
      { id: 'DOC-302', title: 'Section 3C Landowner Objection Filing', type: 'OBJECTION_COPY', issuedDate: '12 Sep 2026', authority: 'CALA Nuh', verified: true, size: '1.5 MB' }
    ],
    timeline: [
      { date: '15 Sep 2026 11:55 AM', title: 'Boundary Mismatch +8.39% Detected', officer: 'Anish Kumar (Surveyor)', status: 'IN_PROGRESS', note: 'Surveyed area 6.72 Ha exceeds recorded 6.20 Ha by 0.52 Ha.' },
      { date: '15 Sep 2026 11:10 AM', title: 'DGPS Survey Started On-Site', officer: 'Anish Kumar (Surveyor)', status: 'COMPLETED', note: 'Surveyor and owners present on field.' },
      { date: '01 Sep 2026 10:00 AM', title: 'Section 3A Gazette Notification', officer: 'MoRTH', status: 'COMPLETED', note: 'Expressway bypass realignment notification.' }
    ],
    auditTrail: [
      { timestamp: '15 Sep 2026 11:55 AM', surveyor: 'Anish Kumar', action: 'Flagged Significant Mismatch', field: 'mismatchStatus', oldValue: 'TOLERANCE_OK', newValue: 'SIGNIFICANT_MISMATCH', reason: 'Field boundary +0.52 Ha exceeds 5% statutory threshold' },
      { timestamp: '15 Sep 2026 11:45 AM', surveyor: 'Anish Kumar', action: 'Logged Objection', field: 'ownerVerification.agreesWithBoundary', oldValue: 'true', newValue: 'false', reason: 'Owner raised ancestral canal possession dispute' }
    ]
  },
  {
    id: 'LND-00128',
    ulpin: '06-12-8891-K9X2D7',
    surveyNumber: '143/2',
    village: 'Tauru Rural',
    district: 'Nuh',
    state: 'Haryana',
    tehsil: 'Tauru',
    project: 'Delhi-Mumbai Industrial Expressway',
    projectId: 'PROJ-NH48-EXPR',
    recordedAreaHa: 3.40,
    surveyedAreaHa: 3.42,
    areaDifferenceHa: +0.02,
    deviationPercent: +0.59,
    mismatchStatus: 'TOLERANCE_OK',
    ownerName: 'Kanta Devi',
    fatherHusbandName: 'Late Subhash Chand',
    ownerPhone: '+91 97290 11983',
    coOwners: 'Deepak Kumar (Son)',
    landType: 'Agricultural',
    surveyStatus: 'RE_SURVEY',
    workflowStage: 'RETURNED',
    priority: 'CRITICAL',
    deadline: '16 Sep 2026',
    daysRemaining: 1,
    assignedToday: true,
    offlineAvailable: true,
    syncStatus: 'SYNC_PENDING',
    surveyorAssigned: 'Anish Kumar (Surveyor)',
    surveyorId: 'SURV-HR-048',
    lastSurveyDate: '12 Sep 2026',
    gnssQuality: 'RTK_FIX',
    gpsAccuracy: '±1.9 m',
    satellitesTracked: 17,
    currentLatitude: 28.2550,
    currentLongitude: 77.0740,
    altitudeMeters: 216.8,
    corsStation: 'HR-NUH-CORS-02 (CONNECTED)',
    cadastralPolygon: [
      [28.2545, 77.0710],
      [28.2575, 77.0715],
      [28.2570, 77.0750],
      [28.2540, 77.0745]
    ],
    surveyPolygon: [
      [28.2546, 77.0711],
      [28.2574, 77.0716],
      [28.2571, 77.0749],
      [28.2541, 77.0744]
    ],
    mapCenter: [28.2557, 77.0730],
    capturedPoints: [
      { id: 'P1', name: 'P1 - West Farm Road Stone', lat: 28.2546, lng: 77.0711, elevation: 216.5, time: '12 Sep 02:10 PM', accuracy: '±1.7m', type: 'CORNER_STONE' },
      { id: 'P2', name: 'P2 - North Pipeline Boundary', lat: 28.2574, lng: 77.0716, elevation: 216.9, time: '12 Sep 02:22 PM', accuracy: '±1.9m', type: 'CORNER_STONE' }
    ],
    ownerVerification: {
      ownerPresent: true,
      identityVerified: true,
      idType: 'Aadhaar Card',
      aadhaarMasked: 'XXXX-XXXX-9901',
      agreesWithBoundary: true,
      hasSignature: true,
      signatureDate: '12 Sep 2026',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 30 Q 70 50 120 20 T 190 35" stroke="%230f172a" stroke-width="2" fill="none"/></svg>',
      objectionNotes: ''
    },
    evidencePhotos: [],
    voiceNotes: [],
    documents: [
      { id: 'DOC-401', title: 'RoR Jamabandi Tauru 2022', type: 'REVENUE_RECORD', issuedDate: '14 Jun 2026', authority: 'Tehsildar Tauru', verified: true, size: '2.8 MB' }
    ],
    timeline: [
      { date: '14 Sep 2026 05:00 PM', title: 'Supervisor Returned for Re-survey', officer: 'Supervisor R.K. Varma', status: 'IN_PROGRESS', note: 'Missing high-voltage transmission line tower coordinate clearance.' },
      { date: '12 Sep 2026 03:00 PM', title: 'Initial Field Survey Submitted', officer: 'Anish Kumar (Surveyor)', status: 'COMPLETED', note: 'Survey boundary submitted for scrutiny.' }
    ],
    auditTrail: [
      { timestamp: '14 Sep 2026 05:00 PM', surveyor: 'Supervisor R.K. Varma', action: 'Returned for Re-survey', field: 'surveyStatus', oldValue: 'SUBMITTED', newValue: 'RE_SURVEY', reason: 'High voltage utility corridor clearance coordinates missing' }
    ]
  },
  {
    id: 'LND-00129',
    ulpin: '06-12-8891-K9X2E8',
    surveyNumber: '144/1',
    village: 'Tauru Rural',
    district: 'Nuh',
    state: 'Haryana',
    tehsil: 'Tauru',
    project: 'Delhi-Mumbai Industrial Expressway',
    projectId: 'PROJ-NH48-EXPR',
    recordedAreaHa: 5.10,
    surveyedAreaHa: 5.10,
    areaDifferenceHa: 0.00,
    deviationPercent: 0.00,
    mismatchStatus: 'TOLERANCE_OK',
    ownerName: 'Balram Sharma',
    fatherHusbandName: 'Pt. Shiv Dayal Sharma',
    ownerPhone: '+91 98112 33451',
    coOwners: 'None',
    landType: 'Agricultural',
    surveyStatus: 'COMPLETED',
    workflowStage: 'APPROVED',
    priority: 'LOW',
    deadline: '24 Sep 2026',
    daysRemaining: 9,
    assignedToday: false,
    offlineAvailable: true,
    syncStatus: 'SYNCED',
    surveyorAssigned: 'Anish Kumar (Surveyor)',
    surveyorId: 'SURV-HR-048',
    lastSurveyDate: '14 Sep 2026',
    gnssQuality: 'RTK_FIX',
    gpsAccuracy: '±1.5 m',
    satellitesTracked: 21,
    currentLatitude: 28.2580,
    currentLongitude: 77.0770,
    altitudeMeters: 218.0,
    corsStation: 'HR-NUH-CORS-02 (CONNECTED)',
    cadastralPolygon: [
      [28.2575, 77.0715],
      [28.2605, 77.0720],
      [28.2600, 77.0760],
      [28.2570, 77.0750]
    ],
    surveyPolygon: [
      [28.2575, 77.0715],
      [28.2605, 77.0720],
      [28.2600, 77.0760],
      [28.2570, 77.0750]
    ],
    mapCenter: [28.2587, 77.0735],
    capturedPoints: [
      { id: 'P1', name: 'P1 - Northern Boundary Stone', lat: 28.2575, lng: 77.0715, elevation: 218.0, time: '14 Sep 11:00 AM', accuracy: '±1.3m', type: 'CORNER_STONE' },
      { id: 'P2', name: 'P2 - Eastern Boundary Stone', lat: 28.2605, lng: 77.0720, elevation: 218.2, time: '14 Sep 11:15 AM', accuracy: '±1.4m', type: 'CORNER_STONE' }
    ],
    ownerVerification: {
      ownerPresent: true,
      identityVerified: true,
      idType: 'Aadhaar & PAN Card',
      aadhaarMasked: 'XXXX-XXXX-1123',
      agreesWithBoundary: true,
      hasSignature: true,
      signatureDate: '14 Sep 2026',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 25 Q 60 10 110 40 T 190 20" stroke="%230f172a" stroke-width="2" fill="none"/></svg>',
      objectionNotes: ''
    },
    evidencePhotos: [],
    voiceNotes: [],
    documents: [],
    timeline: [
      { date: '15 Sep 2026', title: 'Survey Approved by Supervisor', officer: 'R.K. Varma (Survey Supervisor)', status: 'COMPLETED', note: 'Certified for Section 3G Solatium Award calculation.' }
    ],
    auditTrail: [
      { timestamp: '15 Sep 2026 09:15 AM', surveyor: 'R.K. Varma', action: 'Approved Survey', field: 'workflowStage', oldValue: 'SUBMITTED', newValue: 'APPROVED', reason: 'Zero boundary deviation and verified owner signature' }
    ]
  },
  {
    id: 'LND-00130',
    ulpin: '06-12-8891-K9X2F9',
    surveyNumber: '144/2',
    village: 'Tauru Rural',
    district: 'Nuh',
    state: 'Haryana',
    tehsil: 'Tauru',
    project: 'Delhi-Mumbai Industrial Expressway',
    projectId: 'PROJ-NH48-EXPR',
    recordedAreaHa: 4.10,
    surveyedAreaHa: 4.28,
    areaDifferenceHa: +0.18,
    deviationPercent: +4.39,
    mismatchStatus: 'REVIEW_REQUIRED',
    ownerName: 'Maniram & Jagdish',
    fatherHusbandName: 'Late Hira Lal',
    ownerPhone: '+91 94165 77109',
    coOwners: 'Equal 50-50 share among 2 brothers',
    landType: 'Agricultural',
    surveyStatus: 'IN_PROGRESS',
    workflowStage: 'FIELD_SURVEY',
    priority: 'HIGH',
    deadline: '19 Sep 2026',
    daysRemaining: 4,
    assignedToday: true,
    offlineAvailable: true,
    syncStatus: 'SYNC_PENDING',
    surveyorAssigned: 'Anish Kumar (Surveyor)',
    surveyorId: 'SURV-HR-048',
    lastSurveyDate: '15 Sep 2026',
    gnssQuality: 'RTK_FIX',
    gpsAccuracy: '±2.0 m',
    satellitesTracked: 18,
    currentLatitude: 28.2610,
    currentLongitude: 77.0800,
    altitudeMeters: 219.2,
    corsStation: 'HR-NUH-CORS-02 (CONNECTED)',
    cadastralPolygon: [
      [28.2600, 77.0760],
      [28.2630, 77.0765],
      [28.2625, 77.0800],
      [28.2595, 77.0795]
    ],
    surveyPolygon: [
      [28.2600, 77.0760],
      [28.2634, 77.0767],
      [28.2629, 77.0804],
      [28.2595, 77.0795]
    ],
    mapCenter: [28.2612, 77.0780],
    capturedPoints: [],
    ownerVerification: {
      ownerPresent: true,
      identityVerified: false,
      idType: '',
      aadhaarMasked: 'XXXX-XXXX-7702',
      agreesWithBoundary: true,
      hasSignature: false,
      signatureDate: '',
      signatureDataUrl: '',
      objectionNotes: ''
    },
    evidencePhotos: [],
    voiceNotes: [],
    documents: [],
    timeline: [],
    auditTrail: []
  }
];

export const NEARBY_GIS_FEATURES = {
  roads: [
    { id: 'RD-01', name: 'NH-48 Service Expressway Corridor (Proposed)', coordinates: [[28.2450, 77.0600], [28.2520, 77.0700], [28.2650, 77.0850]], widthMeters: 60 },
    { id: 'RD-02', name: 'Sohna-Tauru District PWD Road', coordinates: [[28.2460, 77.0620], [28.2475, 77.0680], [28.2500, 77.0750]], widthMeters: 12 }
  ],
  waterBodies: [
    { id: 'WB-01', name: 'Sohna Rural Irrigation Canal', coordinates: [[28.2485, 77.0630], [28.2510, 77.0690], [28.2560, 77.0780]], type: 'CANAL' }
  ],
  structures: [
    { id: 'STR-01', name: 'Electric Sub-Station 33KV', lat: 28.2535, lng: 77.0690, type: 'UTILITY' },
    { id: 'STR-02', name: 'Govt Tubewell #4', lat: 28.2489, lng: 77.0674, type: 'IRRIGATION' }
  ],
  villageBoundaries: [
    { id: 'VB-01', name: 'Sohna Rural Village Boundary', coordinates: [[28.2430, 77.0580], [28.2520, 77.0600], [28.2550, 77.0730], [28.2440, 77.0720]] }
  ]
};
