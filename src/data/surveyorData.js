// Comprehensive Field Surveyor & DGPS Survey Dataset for BHOOMISETU
// Harmonized 100% with Master National Mock Dataset (mockData.js) and Central Ministry Command Center

import { PARCELS_DATA, PROJECTS_DATA } from './mockData';

// Dynamic Surveyor KPIs matching the active national and corridor parcel registry
export const SURVEYOR_KPIS = {
  assignedToday: 11,
  completedToday: 5,
  pendingSurveys: 3,
  resurveyRequired: 1,
  boundaryDisputes: 2,
  offlineSyncPending: 3,
  targetCompletionDays: 3,
  todayProgressPercent: 72
};

export const SURVEYOR_NOTIFICATIONS = [
  { 
    id: 'NOTIF-01', 
    title: 'New Corridor Parcel Assigned', 
    message: 'Plot 12/4 (ULPIN: 06-12-8896-Y2K9F1) in Sohna Rural assigned for DGPS boundary walk.', 
    type: 'ASSIGNMENT', 
    time: '15 mins ago', 
    unread: true 
  },
  { 
    id: 'NOTIF-02', 
    title: 'High Priority Survey Deadline', 
    message: 'Survey for LND-00125 (Rameshwar Singh Yadav) interchange corridor deadline is Today 17:00 IST.', 
    type: 'DEADLINE', 
    time: '45 mins ago', 
    unread: true 
  },
  { 
    id: 'NOTIF-03', 
    title: 'Encroachment / Boundary Dispute Flagged', 
    message: 'Western canal boundary encroachment (-3.12% variance) identified on Plot 142/4 (Sunita Devi & Harish Yadav).', 
    type: 'DISPUTE', 
    time: '1 hour ago', 
    unread: true 
  },
  { 
    id: 'NOTIF-04', 
    title: 'Re-survey Scheduled', 
    message: 'Plot 88/C (Devendra Prakash Sharma) in Taurupath scheduled for total station re-survey due to dense tree cover.', 
    type: 'RETURNED', 
    time: '2 hours ago', 
    unread: false 
  },
  { 
    id: 'NOTIF-05', 
    title: 'CORS RTK Station Synced', 
    message: 'Haryana DILRMP CORS Station Sohna connected with 19 satellites (±1.8m accuracy).', 
    type: 'GNSS', 
    time: '3 hours ago', 
    unread: false 
  }
];

// Optimized field survey route along the Delhi-Mumbai Expressway corridor (Sohna & Tauru section)
export const SURVEYOR_ROUTE_PLAN = {
  routeId: 'ROUTE-SOHNA-04',
  routeName: 'Delhi-Mumbai Expressway (Gurugram / Sohna-Tauru Section)',
  totalDistanceKm: 28.6,
  estimatedTime: '4h 45m',
  corridor: 'Delhi-Mumbai Industrial Expressway (PROJ-NH48-EXPR)',
  baseOffice: 'Tehsildar & Survey Field Office, Sohna',
  waypoints: [
    { order: 1, type: 'BASE', name: 'Sohna Survey Base Office', lat: 28.1500, lng: 76.9200, stopDuration: 'Departs 09:00 AM' },
    { order: 2, type: 'PARCEL', parcelId: 'LND-00125', name: 'Plot 142/3 (Rameshwar Singh Yadav)', village: 'Sohna Rural', lat: 28.1515, lng: 76.9277, stopDuration: '45 mins', priority: 'HIGH' },
    { order: 3, type: 'PARCEL', parcelId: 'LND-00126', name: 'Plot 142/4 (Sunita Devi & Harish Yadav)', village: 'Sohna Rural', lat: 28.1536, lng: 76.9315, stopDuration: '40 mins', priority: 'HIGH' },
    { order: 4, type: 'PARCEL', parcelId: 'LND-00130', name: 'Plot 12/4 (Rakesh Kumar Bishnoi)', village: 'Sohna Rural', lat: 28.1498, lng: 76.9230, stopDuration: '30 mins', priority: 'MEDIUM' },
    { order: 5, type: 'PARCEL', parcelId: 'LND-00127', name: 'Plot 112/1 (Gurdeep Singh Sandhu)', village: 'Taurupath', lat: 28.1466, lng: 76.9352, stopDuration: '50 mins', priority: 'CRITICAL' },
    { order: 6, type: 'PARCEL', parcelId: 'LND-00128', name: 'Plot 88/C (Devendra Prakash Sharma)', village: 'Taurupath', lat: 28.1430, lng: 76.9380, stopDuration: '35 mins', priority: 'HIGH' },
    { order: 7, type: 'PARCEL', parcelId: 'LND-00129', name: 'Plot 90/A (Mahesh Kumar Saini)', village: 'Taurupath', lat: 28.1390, lng: 76.9410, stopDuration: '30 mins', priority: 'LOW' },
    { order: 8, type: 'BASE', name: 'Return to Sohna Base & Sync', lat: 28.1500, lng: 76.9200, stopDuration: 'Arrives 02:45 PM' }
  ]
};

// Nearby GIS contextual layer features around the Sohna-Tauru corridor
export const NEARBY_GIS_FEATURES = {
  monuments: [
    { id: 'MON-01', name: 'Survey of India GTS Bench Mark #HR-89', lat: 28.1510, lng: 76.9240, elevation: '215.8 m' },
    { id: 'MON-02', name: 'Revenue Boundary Tri-Junction Pillar (Burj)', lat: 28.1480, lng: 76.9330, elevation: '214.2 m' }
  ],
  infrastructure: [
    { id: 'INF-01', type: 'HT_LINE', name: '400 kV PowerGrid Double Circuit Line', points: [[28.1550, 76.9220], [28.1510, 76.9290], [28.1450, 76.9380]] },
    { id: 'INF-02', type: 'GAS_PIPE', name: 'GAIL 24" Natural Gas Pipeline Corridor', points: [[28.1490, 76.9220], [28.1470, 76.9280], [28.1420, 76.9360]] },
    { id: 'INF-03', type: 'CANAL', name: 'Western Jamuna Feeder Canal Branch', points: [[28.1560, 76.9310], [28.1530, 76.9340], [28.1480, 76.9380]] }
  ]
};

// Helper to create high-precision RTK field survey parameters matched to PARCELS_DATA
const createSurveyParams = (p) => {
  const coords = p.coordinates || [];
  const pId = p.id;
  
  // Specific surveyed variances per parcel
  let surveyedArea = p.areaHectares || p.area || 2.5;
  let diff = 0.0;
  let devPercent = 0.0;
  let mismatchStatus = 'TOLERANCE_OK';
  let surveyStatus = 'COMPLETED';
  let workflowStage = 'APPROVED';
  let priority = 'MEDIUM';
  let deadline = '22 Sep 2026';
  let daysRemaining = 7;
  let hasSig = true;
  let ownerAgrees = true;
  let objNotes = '';

  if (pId === 'LND-00125') {
    surveyedArea = 4.47;
    diff = -0.03;
    devPercent = -0.67;
    mismatchStatus = 'TOLERANCE_OK';
    surveyStatus = 'IN_PROGRESS';
    workflowStage = 'FIELD_SURVEY';
    priority = 'HIGH';
    deadline = 'Today 17:00 IST';
    daysRemaining = 0;
    hasSig = true;
  } else if (pId === 'LND-00126') {
    surveyedArea = 3.10;
    diff = -0.10;
    devPercent = -3.12;
    mismatchStatus = 'SIGNIFICANT_MISMATCH';
    surveyStatus = 'DISPUTED';
    workflowStage = 'VALIDATION';
    priority = 'HIGH';
    deadline = '16 Sep 2026';
    daysRemaining = 1;
    hasSig = false;
    ownerAgrees = false;
    objNotes = 'Western Canal boundary encroachment observed. Canal bundh overlaps points P3-P4 by 1000 sq m.';
  } else if (pId === 'LND-00127') {
    surveyedArea = 3.10;
    diff = 0.00;
    devPercent = 0.00;
    mismatchStatus = 'TOLERANCE_OK';
    surveyStatus = 'DISPUTED';
    workflowStage = 'VALIDATION';
    priority = 'CRITICAL';
    deadline = '17 Sep 2026';
    daysRemaining = 2;
    hasSig = false;
    ownerAgrees = false;
    objNotes = 'Co-sharers partition dispute in High Court under Case CASE-102. Physical boundary intact but title under stay.';
  } else if (pId === 'LND-00128') {
    surveyedArea = 1.23;
    diff = 0.03;
    devPercent = 2.50;
    mismatchStatus = 'REVIEW_REQUIRED';
    surveyStatus = 'RE_SURVEY';
    workflowStage = 'FIELD_SURVEY';
    priority = 'HIGH';
    deadline = '18 Sep 2026';
    daysRemaining = 3;
    hasSig = false;
    objNotes = 'Multipath GNSS interference from dense eucalyptus orchard along northern ridge. Re-survey ordered with Total Station.';
  } else if (pId === 'LND-00129') {
    surveyedArea = 2.09;
    diff = -0.01;
    devPercent = -0.48;
    mismatchStatus = 'TOLERANCE_OK';
    surveyStatus = 'COMPLETED';
    workflowStage = 'APPROVED';
    priority = 'LOW';
    deadline = '25 Sep 2026';
    daysRemaining = 10;
    hasSig = true;
  } else if (pId === 'LND-00130') {
    surveyedArea = 1.50;
    diff = 0.00;
    devPercent = 0.00;
    mismatchStatus = 'TOLERANCE_OK';
    surveyStatus = 'PENDING';
    workflowStage = 'DRAFT';
    priority = 'MEDIUM';
    deadline = '19 Sep 2026';
    daysRemaining = 4;
    hasSig = false;
  }

  // Slightly offset vertices for surveyed polygon
  const surveyPoly = coords.map((pt, idx) => {
    if (diff === 0.0) return [pt[0], pt[1]];
    const latOffset = idx === 1 ? (diff > 0 ? 0.00015 : -0.00015) : 0;
    const lngOffset = idx === 2 ? (diff > 0 ? 0.00015 : -0.00015) : 0;
    return [+(pt[0] + latOffset).toFixed(6), +(pt[1] + lngOffset).toFixed(6)];
  });

  // Corner stone point markers
  const capturedPts = coords.map((pt, idx) => ({
    id: `P${idx + 1}`,
    name: `P${idx + 1} - ${idx === 0 ? 'NW Corner Stone' : idx === 1 ? 'NE Ridge Point' : idx === 2 ? 'SE Boundary Post' : 'SW Field Junction'}`,
    lat: pt[0],
    lng: pt[1],
    elevation: (215.2 + idx * 0.3).toFixed(1),
    time: `10:${14 + idx * 8} AM`,
    accuracy: '±1.8m',
    type: idx === 0 || idx === 3 ? 'CORNER_STONE' : 'RIDGE_POINT'
  }));

  return {
    recordedAreaHa: p.areaHectares || p.area,
    surveyedAreaHa: surveyedArea,
    areaDifferenceHa: diff,
    deviationPercent: devPercent,
    mismatchStatus: mismatchStatus,
    surveyStatus: surveyStatus,
    workflowStage: workflowStage,
    priority: priority,
    deadline: deadline,
    daysRemaining: daysRemaining,
    assignedToday: ['LND-00125', 'LND-00126', 'LND-00127', 'LND-00128', 'LND-00130'].includes(pId),
    offlineAvailable: true,
    syncStatus: surveyStatus === 'COMPLETED' ? 'SYNCED' : 'SYNC_PENDING',
    surveyorAssigned: 'Anish Kumar (Surveyor)',
    surveyorId: 'SURV-HR-048',
    lastSurveyDate: '15 Sep 2026',
    gnssQuality: 'RTK_FIX',
    gpsAccuracy: '±1.8 m',
    satellitesTracked: 19,
    currentLatitude: p.center ? p.center[0] : (coords[0] ? coords[0][0] : 28.1515),
    currentLongitude: p.center ? p.center[1] : (coords[0] ? coords[0][1] : 76.9277),
    altitudeMeters: 215.4,
    corsStation: 'HR-SOHNA-CORS-01 (RTK FIXED)',
    cadastralPolygon: coords,
    surveyPolygon: surveyPoly.length > 0 ? surveyPoly : coords,
    mapCenter: p.center || (coords[0] ? coords[0] : [28.1515, 76.9277]),
    capturedPoints: capturedPts,
    ownerVerification: {
      ownerPresent: true,
      identityVerified: true,
      idType: 'Aadhaar Card (UIDAI Biometric Verified)',
      aadhaarMasked: p.aadhaarMasked || 'XXXX-XXXX-8921',
      agreesWithBoundary: ownerAgrees,
      hasSignature: hasSig,
      signatureDate: hasSig ? '15 Sep 2026 10:45 AM' : '',
      signatureDataUrl: hasSig ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 50 10 90 35 T 180 30" stroke="%230f172a" stroke-width="2" fill="none"/></svg>' : '',
      objectionNotes: objNotes
    },
    evidencePhotos: [
      { 
        id: `IMG-${pId}-01`, 
        category: 'Boundary Marker', 
        title: `NW Boundary Stone Demarcation - ${p.village || 'Corridor'}`, 
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60', 
        timestamp: '15 Sep 2026 10:15 AM', 
        lat: coords[0] ? coords[0][0] : 28.1515, 
        lng: coords[0] ? coords[0][1] : 76.9277, 
        surveyorId: 'SURV-HR-048' 
      },
      { 
        id: `IMG-${pId}-02`, 
        category: 'Existing Structure', 
        title: 'Borewell & Boundary Ridge Assessment', 
        url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=60', 
        timestamp: '15 Sep 2026 10:28 AM', 
        lat: coords[1] ? coords[1][0] : 28.1536, 
        lng: coords[1] ? coords[1][1] : 76.9315, 
        surveyorId: 'SURV-HR-048' 
      },
      { 
        id: `IMG-${pId}-03`, 
        category: 'Cultivation', 
        title: 'Agricultural Land Usage & Standing Crops', 
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=60', 
        timestamp: '15 Sep 2026 10:35 AM', 
        lat: p.center ? p.center[0] : 28.1515, 
        lng: p.center ? p.center[1] : 76.9277, 
        surveyorId: 'SURV-HR-048' 
      }
    ],
    voiceNotes: [
      { 
        id: `VN-${pId}`, 
        timestamp: '15 Sep 2026 10:25 AM', 
        duration: '0:34', 
        transcript: `Field verification conducted for Plot ${p.surveyNumber || p.surveyNo} in ${p.village || 'Revenue Village'}. Four corners demarcated with DGPS RTK fix. Boundary coordinates verified against cadastral Khatauni.`, 
        surveyor: 'Anish Kumar' 
      }
    ],
    auditTrail: [
      { 
        timestamp: '15 Sep 2026 10:45 AM', 
        surveyor: 'Anish Kumar', 
        action: hasSig ? 'Captured Owner Signature' : 'Recorded Owner Objection', 
        field: 'ownerVerification.hasSignature', 
        oldValue: 'false', 
        newValue: `${hasSig}`, 
        reason: `On-site inspection with registered owner ${p.ownerName || p.currentOwner}` 
      },
      { 
        timestamp: '15 Sep 2026 10:40 AM', 
        surveyor: 'Anish Kumar', 
        action: 'DGPS Boundary Walk Completed', 
        field: 'surveyedAreaHa', 
        oldValue: `${p.areaHectares || p.area} Ha`, 
        newValue: `${surveyedArea} Ha`, 
        reason: 'Real-time DGPS boundary perimeter coordinate stream' 
      },
      { 
        timestamp: '15 Sep 2026 10:14 AM', 
        surveyor: 'Anish Kumar', 
        action: 'Plotted Corner Stone P1', 
        field: 'capturedPoints', 
        oldValue: '0 points', 
        newValue: `${capturedPts.length} points`, 
        reason: 'RTK Fix corner verification' 
      }
    ]
  };
};

// Master Assigned Parcels Data built 100% directly from PARCELS_DATA
export const ASSIGNED_PARCELS_DATA = PARCELS_DATA.map((p) => {
  const surveyFields = createSurveyParams(p);
  return {
    ...p,
    ...surveyFields,
    // Ensure both naming conventions are satisfied
    id: p.id,
    landId: p.id,
    ulpin: p.ulpin,
    surveyNumber: p.surveyNumber || p.surveyNo,
    surveyNo: p.surveyNo || p.surveyNumber,
    khataNo: p.khataNo,
    ownerName: p.ownerName || p.currentOwner,
    currentOwner: p.currentOwner || p.ownerName,
    project: p.projectName,
    projectId: p.projectId,
    projectName: p.projectName,
    village: p.village,
    tehsil: p.tehsil,
    district: p.district,
    state: p.state,
    areaHectares: p.areaHectares || p.area,
    status: p.status,
    totalAwardAmount: p.totalAwardAmount
  };
});
