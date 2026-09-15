// Comprehensive Municipal Properties Dataset for ULB Property Verification Module
// Aligned with DILRMP 3.0, PM Gati Shakti, and Urban Local Body bylaws

export const MUNICIPAL_PROPERTIES_DATA = [
  {
    propertyId: "PROP-MCG-2026-081",
    ownerId: "OWN-HAR-8921",
    ownerName: "Rameshwar Singh Yadav",
    ownerPhone: "+91 98120 44102",
    aadhaarMasked: "XXXX-XXXX-8921",
    ulpin: "06-12-8891-K9X2A4",
    surveyNo: "142/3",
    khataNo: "K-1082",
    municipality: "Municipal Corporation of Gurugram (MCG)",
    wardNo: "Ward 14 - Sohna Road Corridor",
    zone: "Zone-1 Commercial & Transit Corridor",
    masterPlanZoning: "Commercial Transit-Oriented Development (TOD)",
    landType: "Commercial",
    totalAreaSqYards: 2450,
    areaHectares: 0.51,
    builtUpAreaSqFt: 12800,
    constructionType: "RCC Framed Structure (G+3 Floors)",
    setbackStatus: "Compliant (Front: 4.5m, Side: 3.2m, Rear: 3.0m)",
    propertyTaxStatus: "Cleared (FY 2025-26 Receipt #MCG-PT-99120)",
    encumbranceCertificate: "Nil Encumbrance (EC #2026/GUR/04192)",
    townPlanningNoc: "Sanctioned (BHOOMI/STP/2026/812)",
    marketValuationCr: 11.2,
    compensationAssessedCr: 14.8,
    verificationStatus: "VERIFIED",
    inspectionDate: "2026-09-12",
    inspectedBy: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
    rejectionReason: null,
    officerRemarks: "Field survey and municipal cadastral alignment completed. All setbacks, fire egress, and master plan height restrictions compliant with Gurugram Master Plan 2031. Digital NOC granted.",
    remarksHistory: [
      {
        date: "2026-09-12 14:35",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "VERIFIED",
        note: "Physical inspection conducted with DGPS peg verification. Boundary aligns with corridor RoW alignment. Verification approved."
      },
      {
        date: "2026-09-08 10:15",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "PENDING",
        note: "Municipal tax receipts uploaded by owner. Scheduled on-site physical inspection."
      }
    ],
    checklist: {
      boundaryMatch: true,
      zoningCompliance: true,
      setbackApproved: true,
      noIllegalEncroachment: true,
      taxNocCleared: true
    },
    photos: [
      {
        id: "PHT-81-1",
        title: "Front Elevation & RoW Setback Buffer",
        tag: "Setback Compliance",
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80",
        timestamp: "12 Sep 2026, 11:30 AM",
        geotag: "28.4595° N, 77.0266° E",
        notes: "4.5m front setback verified with laser tape."
      },
      {
        id: "PHT-81-2",
        title: "Municipal Boundary Pillar Peg #03",
        tag: "Cadastral Boundary",
        url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
        timestamp: "12 Sep 2026, 11:45 AM",
        geotag: "28.4598° N, 77.0270° E",
        notes: "ULPIN benchmark monument firmly intact."
      },
      {
        id: "PHT-81-3",
        title: "Structure Side Access Lane Inspection",
        tag: "Structural Integrity",
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
        timestamp: "12 Sep 2026, 12:05 PM",
        geotag: "28.4594° N, 77.0264° E",
        notes: "Clear 3.2m side passage without unauthorized temporary shed."
      }
    ]
  },
  {
    propertyId: "PROP-MCG-2026-094",
    ownerId: "OWN-HAR-4412",
    ownerName: "Sunita Devi & Harish Yadav",
    ownerPhone: "+91 98451 90112",
    aadhaarMasked: "XXXX-XXXX-4412",
    ulpin: "06-12-8892-M3P9B1",
    surveyNo: "142/4",
    khataNo: "K-1083",
    municipality: "Municipal Corporation of Gurugram (MCG)",
    wardNo: "Ward 15 - Badshahpur Extension",
    zone: "Zone-2 Mixed Urban Residential",
    masterPlanZoning: "Residential High Density (R-2)",
    landType: "Residential",
    totalAreaSqYards: 1650,
    areaHectares: 0.34,
    builtUpAreaSqFt: 6200,
    constructionType: "Brick Masonry & RCC Slab (G+2 Floors)",
    setbackStatus: "Under Scrutiny (Rear Balcony cantilever extension observed)",
    propertyTaxStatus: "Assessment Due (Pending ₹18,400 dues for FY 2024-25)",
    encumbranceCertificate: "Clear (EC #2026/GUR/08819)",
    townPlanningNoc: "Pending Municipal Officer Signature",
    marketValuationCr: 6.8,
    compensationAssessedCr: 8.9,
    verificationStatus: "PENDING",
    inspectionDate: "2026-09-14",
    inspectedBy: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
    rejectionReason: null,
    officerRemarks: "Field inspection highlighted cantilever balcony projection exceeding permissible setback by 0.65m towards the proposed utility corridor. Notice issued for architectural regularization.",
    remarksHistory: [
      {
        date: "2026-09-14 16:10",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "PENDING",
        note: "Site measurements recorded. Awaiting revised compliance drawing and clearance of pending municipal dues."
      }
    ],
    checklist: {
      boundaryMatch: true,
      zoningCompliance: true,
      setbackApproved: false,
      noIllegalEncroachment: false,
      taxNocCleared: false
    },
    photos: [
      {
        id: "PHT-94-1",
        title: "Rear Balcony Cantilever Overhang",
        tag: "Setback Inspection",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        timestamp: "14 Sep 2026, 03:20 PM",
        geotag: "28.4612° N, 77.0310° E",
        notes: "Projection over municipal utility corridor setback."
      },
      {
        id: "PHT-94-2",
        title: "Front Gate & Boundary Wall Peg",
        tag: "Boundary Check",
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        timestamp: "14 Sep 2026, 03:35 PM",
        geotag: "28.4610° N, 77.0308° E",
        notes: "Front boundary matches approved village killa line."
      }
    ]
  },
  {
    propertyId: "PROP-NDMC-2026-102",
    ownerId: "OWN-DL-9011",
    ownerName: "Gurdeep Singh Sandhu",
    ownerPhone: "+91 97201 88310",
    aadhaarMasked: "XXXX-XXXX-9011",
    ulpin: "06-12-8893-X7L1C9",
    surveyNo: "112/1",
    khataNo: "K-4401",
    municipality: "New Delhi Municipal Council (NDMC / DDA Area)",
    wardNo: "Ward 07 - Tughlakabad Aerocity Spur",
    zone: "Zone-4 Special Commercial Corridor",
    masterPlanZoning: "Commercial Logistics & Warehousing",
    landType: "Commercial",
    totalAreaSqYards: 3800,
    areaHectares: 0.79,
    builtUpAreaSqFt: 22000,
    constructionType: "Pre-Engineered Steel Shed & Warehouse",
    setbackStatus: "VIOLATION (Unauthorized container yard on 10m road widening buffer)",
    propertyTaxStatus: "Defaulted (Pending litigation dispute #CASE-102)",
    encumbranceCertificate: "Mortgage Registered with Private NBFC",
    townPlanningNoc: "Rejected by Chief Town Planner",
    marketValuationCr: 24.5,
    compensationAssessedCr: 29.8,
    verificationStatus: "REJECTED",
    inspectionDate: "2026-09-10",
    inspectedBy: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
    rejectionReason: "Severe municipal road buffer encroachment (18.5m x 4.2m) with illegal heavy vehicle container loading dock encroaching on right-of-way. High Court Case #CASE-102 stay active.",
    officerRemarks: "Verification REJECTED under Section 247 of Municipal Act. Owner has constructed unapproved heavy structural sheds blocking the masterplan corridor alignment. Eviction and demolition order initiated.",
    remarksHistory: [
      {
        date: "2026-09-10 12:20",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "REJECTED",
        note: "Inspection concluded that building violates setback by 8.4 meters. Rejection memo dispatched to District Collector."
      },
      {
        date: "2026-09-02 09:30",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "PENDING",
        note: "Preliminary scrutiny flagged court caveat. Ordered spot inspection."
      }
    ],
    checklist: {
      boundaryMatch: false,
      zoningCompliance: false,
      setbackApproved: false,
      noIllegalEncroachment: false,
      taxNocCleared: false
    },
    photos: [
      {
        id: "PHT-102-1",
        title: "Unauthorized Container Dock Encroachment",
        tag: "Encroachment Violation",
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
        timestamp: "10 Sep 2026, 10:45 AM",
        geotag: "28.5120° N, 77.3000° E",
        notes: "Heavy container loading dock blocking corridor RoW."
      },
      {
        id: "PHT-102-2",
        title: "Road Buffer Obstruction Peg Measurement",
        tag: "Setback Violation",
        url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
        timestamp: "10 Sep 2026, 11:15 AM",
        geotag: "28.5124° N, 77.3004° E",
        notes: "Encroachment exceeds 8.4m into masterplan boundary."
      }
    ]
  },
  {
    propertyId: "PROP-SMC-2026-118",
    ownerId: "OWN-GJ-7718",
    ownerName: "Vikramaditya Infrastructure & Logistics Ltd",
    ownerPhone: "+91 94280 11982",
    aadhaarMasked: "XXXX-XXXX-7718",
    ulpin: "24-08-3319-P5W2K7",
    surveyNo: "88/2",
    khataNo: "K-2290",
    municipality: "Surat Municipal Corporation (SMC)",
    wardNo: "Ward 09 - Surat East Industrial Hub",
    zone: "Zone-3 Heavy Logistics & Industrial",
    masterPlanZoning: "Industrial Processing & Storage",
    landType: "Industrial",
    totalAreaSqYards: 5600,
    areaHectares: 1.16,
    builtUpAreaSqFt: 34000,
    constructionType: "Industrial Grade Concrete & Steel Gantry",
    setbackStatus: "Compliant (Front: 9.0m, Side: 6.0m, Rear: 6.0m)",
    propertyTaxStatus: "Cleared (Advance Paid through March 2027)",
    encumbranceCertificate: "Clear (EC #2026/SRT/00381)",
    townPlanningNoc: "Approved (SMC/TP/2026/IND-442)",
    marketValuationCr: 38.0,
    compensationAssessedCr: 45.6,
    verificationStatus: "VERIFIED",
    inspectionDate: "2026-09-11",
    inspectedBy: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
    rejectionReason: null,
    officerRemarks: "Large industrial warehousing plot. Masterplan setback criteria fully respected. Fire clearance and environmental buffer certified by Gujarat Pollution Control Board. Acquisition compensation verification completed.",
    remarksHistory: [
      {
        date: "2026-09-11 11:00",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "VERIFIED",
        note: "Full verification signed. Structural assessment verified with certified civil engineer report."
      }
    ],
    checklist: {
      boundaryMatch: true,
      zoningCompliance: true,
      setbackApproved: true,
      noIllegalEncroachment: true,
      taxNocCleared: true
    },
    photos: [
      {
        id: "PHT-118-1",
        title: "Industrial Facility Perimeter & Setback",
        tag: "Setback Compliance",
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        timestamp: "11 Sep 2026, 09:40 AM",
        geotag: "21.1702° N, 72.8311° E",
        notes: "9.0m statutory industrial front setback verified."
      },
      {
        id: "PHT-118-2",
        title: "Cadastral Geo-Corner Marker Pillar",
        tag: "Cadastral Boundary",
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        timestamp: "11 Sep 2026, 10:15 AM",
        geotag: "21.1708° N, 72.8315° E",
        notes: "GPS benchmark monument coordinates verified."
      }
    ]
  },
  {
    propertyId: "PROP-VUDA-2026-145",
    ownerId: "OWN-GJ-5531",
    ownerName: "Rajeshwari Patel & Brothers",
    ownerPhone: "+91 98250 66321",
    aadhaarMasked: "XXXX-XXXX-5531",
    ulpin: "24-08-3320-Q8L4M9",
    surveyNo: "91/1A",
    khataNo: "K-3104",
    municipality: "Vadodara Urban Development Authority (VUDA)",
    wardNo: "Ward 04 - Ring Expressway Sector",
    zone: "Zone-2 Commercial Peripheral",
    masterPlanZoning: "Commercial Mixed Retail",
    landType: "Mixed Use",
    totalAreaSqYards: 1980,
    areaHectares: 0.41,
    builtUpAreaSqFt: 8400,
    constructionType: "Commercial Shopping Complex (G+2 Floors)",
    setbackStatus: "Under Verification (Drainage easement alignment check)",
    propertyTaxStatus: "Cleared (FY 2025-26 Receipt #VUDA-TX-1092)",
    encumbranceCertificate: "Clear (EC #2026/VAD/0912)",
    townPlanningNoc: "Under Scrutiny",
    marketValuationCr: 9.4,
    compensationAssessedCr: 12.1,
    verificationStatus: "PENDING",
    inspectionDate: "2026-09-15",
    inspectedBy: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
    rejectionReason: null,
    officerRemarks: "Inspection currently underway. Verifying underground municipal stormwater drainage easement along the northern boundary of the parcel.",
    remarksHistory: [
      {
        date: "2026-09-15 10:30",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "PENDING",
        note: "Drone survey overlay uploaded. Engineering team verifying utility easement cross-section."
      }
    ],
    checklist: {
      boundaryMatch: true,
      zoningCompliance: true,
      setbackApproved: true,
      noIllegalEncroachment: true,
      taxNocCleared: true
    },
    photos: [
      {
        id: "PHT-145-1",
        title: "Commercial Complex Northern Facade",
        tag: "Drainage Easement",
        url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
        timestamp: "15 Sep 2026, 09:15 AM",
        geotag: "22.3072° N, 73.1812° E",
        notes: "Stormwater drain line running parallel to boundary."
      }
    ]
  },
  {
    propertyId: "PROP-BMC-2026-172",
    ownerId: "OWN-RJ-6629",
    ownerName: "Mehmood Khan & Farooq Khan",
    ownerPhone: "+91 97840 22091",
    aadhaarMasked: "XXXX-XXXX-6629",
    ulpin: "08-03-7721-T2N8R4",
    surveyNo: "204/5",
    khataNo: "K-1845",
    municipality: "Bikaner Municipal Council (BMC)",
    wardNo: "Ward 12 - Highway Bypass Extension",
    zone: "Zone-1 Commercial Transport Hub",
    masterPlanZoning: "Transport & Commercial Auto Ancillary",
    landType: "Commercial",
    totalAreaSqYards: 3100,
    areaHectares: 0.64,
    builtUpAreaSqFt: 9800,
    constructionType: "Automobile Service Facility & G+1 Office",
    setbackStatus: "Compliant (Front: 6.0m, Side: 3.5m)",
    propertyTaxStatus: "Cleared (FY 2025-26 Receipt #BMC-PT-44109)",
    encumbranceCertificate: "Clear (EC #2026/BIK/1129)",
    townPlanningNoc: "Sanctioned (BMC/TP/2026/899)",
    marketValuationCr: 7.8,
    compensationAssessedCr: 9.9,
    verificationStatus: "VERIFIED",
    inspectionDate: "2026-09-13",
    inspectedBy: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
    rejectionReason: null,
    officerRemarks: "Automobile service depot verified for corridor acquisition. Underground fuel storage tank shifted. Boundary verified and municipal sign-off executed.",
    remarksHistory: [
      {
        date: "2026-09-13 15:40",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        status: "VERIFIED",
        note: "All municipal verification requirements fulfilled. Award clearance endorsed."
      }
    ],
    checklist: {
      boundaryMatch: true,
      zoningCompliance: true,
      setbackApproved: true,
      noIllegalEncroachment: true,
      taxNocCleared: true
    },
    photos: [
      {
        id: "PHT-172-1",
        title: "Service Depot Frontage & Egress",
        tag: "Setback Compliance",
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        timestamp: "13 Sep 2026, 02:20 PM",
        geotag: "28.0229° N, 73.3119° E",
        notes: "Front setback clears 60m highway right-of-way."
      }
    ]
  }
];

export const MUNICIPAL_STATS = {
  totalUnderJurisdiction: 184,
  verifiedCount: 142,
  pendingCount: 28,
  rejectedCount: 14,
  inspectionsThisMonth: 36,
  averageTurnaroundDays: 4.8,
  slaComplianceRate: 94.2
};
