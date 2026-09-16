// Comprehensive Building Sanction & Approval Dataset for Municipal Officer Module
// Compliant with National Building Code (NBC 2016), State Municipal Building Bylaws & DILRMP 3.0

export const BUILDING_APPLICATIONS_DATA = [
  {
    applicationId: "BP-MCG-2026-041",
    propertyId: "PROP-MCG-2026-081",
    ulpin: "06-12-8891-K9X2A4",
    ownerName: "Rameshwar Singh Yadav",
    ownerPhone: "+91 98120 44102",
    architectName: "Ar. Rohit Singhal (CoA #CA/2012/58190)",
    municipality: "Municipal Corporation of Gurugram (MCG)",
    wardNo: "Ward 14 - Sohna Road Corridor",
    zone: "Zone-1 Commercial & Transit Corridor",
    buildingCategory: "Commercial Complex (G+3 Floors)",
    proposalType: "New Construction & Expansion",
    filingDate: "2026-09-02",
    slaDeadlineDate: "2026-10-02",
    slaDaysRemaining: 17,
    status: "PENDING", // 'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTIONS_REQUESTED'
    scrutinyFeeStatus: "Paid (₹84,500 via BharatKosh)",
    
    // Technical Building Parameters
    plotAreaSqYd: 2450,
    plotAreaSqM: 2048.5,
    permissibleFar: 2.25,
    proposedFar: 2.18,
    permissibleCoveragePct: 60.0,
    proposedCoveragePct: 54.5,
    maxPermissibleHeightM: 15.0,
    proposedHeightM: 14.2,
    proposedFloors: "Basement + Stilt + G+3 Floors",
    parkingRequiredEcs: 28,
    parkingProvidedEcs: 32,
    
    // Setback Requirements & Proposed
    setbacks: {
      front: { required: 4.5, proposed: 4.6, compliant: true },
      rear: { required: 3.0, proposed: 3.2, compliant: true },
      sideLeft: { required: 3.0, proposed: 3.0, compliant: true },
      sideRight: { required: 3.0, proposed: 3.1, compliant: true }
    },

    // Statutory Clearances & NOCs
    clearances: [
      { name: "Fire & Rescue Safety NOC", authority: "Haryana Fire Services", status: "APPROVED", certNo: "FIRE/MCG/2026/891", date: "2026-09-06" },
      { name: "Environmental & Pollution Board", authority: "HSPCB Nodal", status: "APPROVED", certNo: "PCB/ENV/2026/410", date: "2026-09-08" },
      { name: "Airport Authority Height Clearance", authority: "AAI Funnel Cell", status: "APPROVED", certNo: "AAI/DEL/NOC/2026/194", date: "2026-09-04" },
      { name: "Municipal Stormwater & Sewerage", authority: "MCG Engineering Cell", status: "PENDING", certNo: "IN_SCRUTINY", date: null },
      { name: "Structural Stability Certificate", authority: "IIT Delhi Empanelled Engineer", status: "APPROVED", certNo: "IITD/STR/2026/088", date: "2026-09-05" }
    ],

    // Uploaded Architectural Drawings & Blueprints
    drawings: [
      {
        id: "DWG-01",
        title: "Master Site Plan & Setback RoW Layout",
        category: "Site Plan",
        scale: "1:200",
        fileType: "PDF / CAD Blueprint",
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        notes: "4.6m front setback clearing corridor widening line."
      },
      {
        id: "DWG-02",
        title: "Ground Floor Commercial Retail Layout",
        category: "Floor Plan",
        scale: "1:100",
        fileType: "Architectural Drawing",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        notes: "Stilt parking entrance with 6.0m two-way ramp."
      },
      {
        id: "DWG-03",
        title: "Typical 1st-3rd Floor Office Plan",
        category: "Floor Plan",
        scale: "1:100",
        fileType: "Architectural Drawing",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        notes: "Emergency fire staircases located at opposite ends."
      },
      {
        id: "DWG-04",
        title: "Front Elevation & Cross-Section View",
        category: "Elevation",
        scale: "1:100",
        fileType: "Section Drawing",
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80",
        notes: "Total height 14.2m compliant with zonal restriction."
      }
    ],

    // Statutory Milestone Timeline
    timeline: [
      { step: 1, title: "Application & Scrutiny Fee", date: "02 Sep 2026", status: "COMPLETED", officer: "Automated Gateway", remark: "All statutory scrutiny fees & cess paid." },
      { step: 2, title: "Architectural Plan Scrutiny", date: "08 Sep 2026", status: "COMPLETED", officer: "Ar. V. K. Malhotra (Town Planner)", remark: "FAR and ground coverage within permissible NBC limits." },
      { step: 3, title: "Inter-Dept NOC Clearances", date: "11 Sep 2026", status: "COMPLETED", officer: "MCG Single Window Cell", remark: "Fire, AAI, and environmental NOCs approved." },
      { step: 4, title: "On-Site Physical Inspection", date: "14 Sep 2026", status: "IN_PROGRESS", officer: "Sanjay Deshmukh (Municipal Officer)", remark: "Physical verification of RoW setback and pegging underway." },
      { step: 5, title: "Final Sanction Order / Permit", date: "Pending", status: "PENDING", officer: "Municipal Commissioner / ULB Nodal", remark: "Awaiting final municipal officer approval sign-off." }
    ],

    // Approval History Audit Log
    history: [
      {
        date: "2026-09-14 11:30",
        officer: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
        action: "SITE_INSPECTED",
        note: "Site pegging inspection conducted. Setback aligns with master plan corridor buffer. Verification favorable."
      },
      {
        date: "2026-09-11 15:45",
        officer: "Chief Fire Officer (Gurugram)",
        action: "FIRE_NOC_ISSUED",
        note: "Fire hydrant layout and 6m wide peripheral driveway approved."
      },
      {
        date: "2026-09-08 10:20",
        officer: "Ar. V. K. Malhotra (Assistant Town Planner)",
        action: "FAR_SCRUTINY_PASSED",
        note: "Proposed FAR of 2.18 complies with master plan maximum of 2.25."
      },
      {
        date: "2026-09-02 09:15",
        officer: "Citizen / Architect Portal",
        action: "APPLICATION_SUBMITTED",
        note: "Building sanction application filed with complete architectural set."
      }
    ],

    // Deficiency / Corrections Notes
    correctionsRequested: null
  },
  {
    applicationId: "BP-MCG-2026-058",
    propertyId: "PROP-MCG-2026-094",
    ulpin: "06-12-8892-M3P9B1",
    ownerName: "Sunita Devi & Harish Yadav",
    ownerPhone: "+91 98451 90112",
    architectName: "Ar. Deepika Rao (CoA #CA/2018/74112)",
    municipality: "Municipal Corporation of Gurugram (MCG)",
    wardNo: "Ward 15 - Badshahpur Extension",
    zone: "Zone-2 Mixed Urban Residential",
    buildingCategory: "Residential Villa (G+2 Floors)",
    proposalType: "Fresh Building Sanction",
    filingDate: "2026-09-05",
    slaDeadlineDate: "2026-10-05",
    slaDaysRemaining: 20,
    status: "CORRECTIONS_REQUESTED",
    scrutinyFeeStatus: "Paid (₹38,200 via BharatKosh)",

    plotAreaSqYd: 1650,
    plotAreaSqM: 1379.6,
    permissibleFar: 1.80,
    proposedFar: 1.94, // Excess FAR
    permissibleCoveragePct: 65.0,
    proposedCoveragePct: 68.2, // Excess coverage
    maxPermissibleHeightM: 12.0,
    proposedHeightM: 11.5,
    proposedFloors: "Ground + 2 Floors",
    parkingRequiredEcs: 4,
    parkingProvidedEcs: 4,

    setbacks: {
      front: { required: 3.5, proposed: 3.5, compliant: true },
      rear: { required: 3.0, proposed: 2.35, compliant: false }, // Violation
      sideLeft: { required: 2.0, proposed: 2.0, compliant: true },
      sideRight: { required: 2.0, proposed: 1.8, compliant: false } // Violation
    },

    clearances: [
      { name: "Fire Safety Clearance", authority: "Haryana Fire Services", status: "NOT_APPLICABLE", certNo: "N/A (<15m Height)", date: "2026-09-06" },
      { name: "Structural Stability Certificate", authority: "Chartered Structural Engineer", status: "APPROVED", certNo: "STR/HR/2026/994", date: "2026-09-07" },
      { name: "Municipal Water Harvesting Plan", authority: "Ground Water Authority", status: "PENDING_CORRECTION", certNo: "REJECTED_DESIGN", date: null }
    ],

    drawings: [
      {
        id: "DWG-05",
        title: "Architectural Site Plan & Rear Setback Cut",
        category: "Site Plan",
        scale: "1:200",
        fileType: "Blueprint PDF",
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        notes: "Rear setback shows 2.35m instead of statutory 3.0m."
      },
      {
        id: "DWG-06",
        title: "Ground Floor & Rear Balcony Layout",
        category: "Floor Plan",
        scale: "1:100",
        fileType: "Architectural CAD",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        notes: "Cantilever balcony projects 0.65m into corridor utility buffer."
      }
    ],

    timeline: [
      { step: 1, title: "Application & Scrutiny Fee", date: "05 Sep 2026", status: "COMPLETED", officer: "Automated Gateway", remark: "Fee verified." },
      { step: 2, title: "Architectural Plan Scrutiny", date: "10 Sep 2026", status: "DEFICIENT", officer: "Town Planning Cell", remark: "Proposed FAR (1.94) exceeds 1.80 limit. Rear setback deficient." },
      { step: 3, title: "Deficiency Memo Issued", date: "12 Sep 2026", status: "ACTION_REQUIRED", officer: "Sanjay Deshmukh (Municipal Officer)", remark: "Formal corrections requested. 15-day rectification window active." },
      { step: 4, title: "Resubmission Scrutiny", date: "Pending", status: "PENDING", officer: "Town Planning Officer", remark: "Awaiting revised drawings from applicant." },
      { step: 5, title: "Final Sanction Order", date: "Pending", status: "PENDING", officer: "Municipal Officer", remark: "Conditional on bylaw compliance." }
    ],

    history: [
      {
        date: "2026-09-12 14:10",
        officer: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
        action: "CORRECTIONS_REQUESTED",
        note: "Deficiency memo dispatched: 1. Reduce proposed FAR from 1.94 to <= 1.80. 2. Regularize rear cantilever balcony to maintain 3.0m setback from corridor boundary."
      },
      {
        date: "2026-09-10 11:25",
        officer: "Assistant Town Planner MCG",
        action: "PLAN_SCRUTINY_FLAGGED",
        note: "Ground coverage of 68.2% violates 65% zonal ceiling."
      }
    ],

    correctionsRequested: {
      memoNo: "MCG/BP/DEF/2026/094",
      date: "2026-09-12",
      deadline: "2026-09-27",
      items: [
        "Revise rear setback from 2.35m to minimum 3.0m clear buffer.",
        "Reduce proposed FAR from 1.94 to statutory ceiling of 1.80.",
        "Submit revised rainwater harvesting percolation pit cross-section.",
        "Clear pending municipal property tax dues of ₹18,400."
      ]
    }
  },
  {
    applicationId: "BP-NDMC-2026-072",
    propertyId: "PROP-NDMC-2026-102",
    ulpin: "06-12-8893-X7L1C9",
    ownerName: "Gurdeep Singh Sandhu",
    ownerPhone: "+91 97201 88310",
    architectName: "Ar. Manpreet Kohli (CoA #CA/2009/44120)",
    municipality: "New Delhi Municipal Council (NDMC / DDA Area)",
    wardNo: "Ward 07 - Tughlakabad Aerocity Spur",
    zone: "Zone-4 Special Commercial Corridor",
    buildingCategory: "Heavy Logistics Container Terminal",
    proposalType: "Industrial Shed & Office Expansion",
    filingDate: "2026-08-25",
    slaDeadlineDate: "2026-09-25",
    slaDaysRemaining: 10,
    status: "REJECTED",
    scrutinyFeeStatus: "Paid (₹1,12,000 via BharatKosh)",

    plotAreaSqYd: 3800,
    plotAreaSqM: 3177.3,
    permissibleFar: 1.50,
    proposedFar: 2.10, // Massive excess
    permissibleCoveragePct: 50.0,
    proposedCoveragePct: 72.0, // Major encroachment
    maxPermissibleHeightM: 18.0,
    proposedHeightM: 19.5,
    proposedFloors: "Steel Shed + G+2 Office",
    parkingRequiredEcs: 45,
    parkingProvidedEcs: 14, // Gross deficit

    setbacks: {
      front: { required: 9.0, proposed: 0.6, compliant: false }, // Severe encroachment
      rear: { required: 6.0, proposed: 2.1, compliant: false },
      sideLeft: { required: 6.0, proposed: 3.2, compliant: false },
      sideRight: { required: 6.0, proposed: 1.5, compliant: false }
    },

    clearances: [
      { name: "Fire Tender Access NOC", authority: "Delhi Fire Service", status: "REJECTED", certNo: "DFS/REJ/2026/102", date: "2026-09-02" },
      { name: "DDA Masterplan Alignment", authority: "Delhi Development Authority", status: "REJECTED", certNo: "DDA/MP/2026/REJ-44", date: "2026-09-05" }
    ],

    drawings: [
      {
        id: "DWG-07",
        title: "Proposed Container Terminal Site Layout",
        category: "Site Plan",
        scale: "1:500",
        fileType: "CAD Blueprint",
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        notes: "Heavy container loading dock directly encroaches 8.4m onto planned road widening."
      }
    ],

    timeline: [
      { step: 1, title: "Application & Scrutiny Fee", date: "25 Aug 2026", status: "COMPLETED", officer: "Portal", remark: "Scrutiny fee received." },
      { step: 2, title: "Architectural Scrutiny", date: "30 Aug 2026", status: "REJECTED", officer: "Chief Town Planner NDMC", remark: "Massive FAR & coverage violation." },
      { step: 3, title: "Fire Safety Inspection", date: "02 Sep 2026", status: "REJECTED", officer: "Delhi Fire Service", remark: "Inadequate 2m access; requires minimum 9m fire tender driveway." },
      { step: 4, title: "On-Site Physical Inspection", date: "06 Sep 2026", status: "REJECTED", officer: "Sanjay Deshmukh (Municipal Officer)", remark: "Confirmed severe Right-of-Way encroachment and active court litigation #CASE-102." },
      { step: 5, title: "Final Rejection Order Issued", date: "10 Sep 2026", status: "COMPLETED", officer: "Municipal Officer & District Collector", remark: "Formal rejection order executed under Sec 247." }
    ],

    history: [
      {
        date: "2026-09-10 12:40",
        officer: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
        action: "SANCTION_REJECTED",
        note: "Building sanction formally REJECTED. Site blocks statutory highway widening buffer and lacks mandatory fire tender turning radius. Eviction recommendation passed."
      },
      {
        date: "2026-09-02 16:30",
        officer: "Delhi Fire Service",
        action: "FIRE_NOC_DENIED",
        note: "Container storage violates setback. Hazardous egress hazard."
      }
    ],

    rejectionReason: "Severe Right-of-Way encroachment (8.4m into master plan corridor), 40% excess FAR, and fire tender turning radius denied by Delhi Fire Service. Active High Court Stay Case #CASE-102."
  },
  {
    applicationId: "BP-SMC-2026-089",
    propertyId: "PROP-SMC-2026-118",
    ulpin: "24-08-3319-P5W2K7",
    ownerName: "Vikramaditya Infrastructure & Logistics Ltd",
    ownerPhone: "+91 94280 11982",
    architectName: "Ar. Shweta Desai (CoA #CA/2010/61029)",
    municipality: "Surat Municipal Corporation (SMC)",
    wardNo: "Ward 09 - Surat East Industrial Hub",
    zone: "Zone-3 Heavy Logistics & Industrial",
    buildingCategory: "Industrial Gantry Warehouse (G+1)",
    proposalType: "Factory Building Sanction",
    filingDate: "2026-08-20",
    slaDeadlineDate: "2026-09-20",
    slaDaysRemaining: 5,
    status: "APPROVED",
    scrutinyFeeStatus: "Paid (₹1,45,000 via BharatKosh)",

    plotAreaSqYd: 5600,
    plotAreaSqM: 4682.3,
    permissibleFar: 1.50,
    proposedFar: 1.25,
    permissibleCoveragePct: 55.0,
    proposedCoveragePct: 48.0,
    maxPermissibleHeightM: 16.0,
    proposedHeightM: 12.8,
    proposedFloors: "Industrial Shed G+1 Mezzanine",
    parkingRequiredEcs: 50,
    parkingProvidedEcs: 56,

    setbacks: {
      front: { required: 9.0, proposed: 9.5, compliant: true },
      rear: { required: 6.0, proposed: 6.2, compliant: true },
      sideLeft: { required: 6.0, proposed: 6.0, compliant: true },
      sideRight: { required: 6.0, proposed: 6.5, compliant: true }
    },

    clearances: [
      { name: "Fire & Hazmat Clearance", authority: "Surat Fire Brigade", status: "APPROVED", certNo: "SFB/IND/2026/881", date: "2026-08-28" },
      { name: "Pollution Control Board Consent", authority: "GPCB Surat", status: "APPROVED", certNo: "GPCB/CTE/2026/1944", date: "2026-08-30" },
      { name: "Structural Integrity Stamp", authority: "SVNIT Surat Structural Cell", status: "APPROVED", certNo: "SVNIT/STR/2026/301", date: "2026-08-27" }
    ],

    drawings: [
      {
        id: "DWG-08",
        title: "Industrial Complex Master Site & Fire Egress Plan",
        category: "Site Plan",
        scale: "1:500",
        fileType: "Full Architectural Drawing",
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
        notes: "Full 9.5m front setback; dedicated 6m heavy vehicle fire loop."
      },
      {
        id: "DWG-09",
        title: "Warehouse Floor Plan & Loading Dock Detail",
        category: "Floor Plan",
        scale: "1:200",
        fileType: "Structural Layout",
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
        notes: "Gantry crane rail foundations and heavy concrete slab details."
      }
    ],

    timeline: [
      { step: 1, title: "Application & Scrutiny Fee", date: "20 Aug 2026", status: "COMPLETED", officer: "SMC E-Governance", remark: "Scrutiny fee paid." },
      { step: 2, title: "Town Planning Scrutiny", date: "26 Aug 2026", status: "COMPLETED", officer: "Senior Town Planner SMC", remark: "FAR (1.25) within limits. Parking bays compliant." },
      { step: 3, title: "Line Agency Clearances", date: "01 Sep 2026", status: "COMPLETED", officer: "SMC Single Window Cell", remark: "Fire, pollution, and structural approvals granted." },
      { step: 4, title: "Field Setback Inspection", date: "07 Sep 2026", status: "COMPLETED", officer: "Sanjay Deshmukh (Municipal Officer)", remark: "Boundary pegs verified on ground; matches cadastral grid." },
      { step: 5, title: "Sanction Permit Issued", date: "11 Sep 2026", status: "COMPLETED", officer: "Municipal Commissioner SMC", remark: "Building Sanction Permit #SMC/BS/2026/089 signed & released." }
    ],

    history: [
      {
        date: "2026-09-11 11:30",
        officer: "Sanjay Deshmukh (Municipal Officer, ULB Nodal)",
        action: "PERMIT_SANCTIONED",
        note: "Building Sanction Permit signed. All statutory bylaws, parking, and fire safety provisions verified fully compliant."
      },
      {
        date: "2026-09-07 14:00",
        officer: "Sanjay Deshmukh (Municipal Officer)",
        action: "SITE_SURVEY_COMPLETED",
        note: "Laser distance measurement of front setback confirmed at 9.5 meters."
      }
    ],

    sanctionPermit: {
      permitNo: "SMC/BP-SANCTION/2026/089",
      sanctionDate: "2026-09-11",
      validityYears: 3,
      expiryDate: "2029-09-10",
      permittedFar: 1.25,
      permittedFloors: "G+1 Mezzanine Industrial",
      conditions: "1. Rainwater harvesting mandatory. 2. Construction debris must not spill onto municipal road. 3. Commencement notice must be filed within 1 year."
    }
  }
];

export const BUILDING_STATS = {
  totalApplications: 148,
  pendingReview: 18,
  approvedThisMonth: 112,
  rejectedCount: 12,
  correctionsPending: 6,
  averageSanctionDays: 14.2,
  slaCompliancePct: 96.5
};

export const STATUTORY_CORRECTION_CHECKLIST = [
  { id: "FAR_VIOLATION", label: "Proposed FAR Exceeds Master Plan / Zonal Limits", severity: "HIGH", code: "Sec 18.2" },
  { id: "SETBACK_INFRINGE", label: "Front / Rear Setback Infringes Statutory RoW Widening Line", severity: "HIGH", code: "Sec 14.1" },
  { id: "PARKING_DEFICIT", label: "Equivalent Car Spaces (ECS) Less Than Required Quota", severity: "MEDIUM", code: "Sec 22.4" },
  { id: "FIRE_SAFETY_DEFECT", label: "Fire Tender Turning Radius or Emergency Staircase Inadequate", severity: "CRITICAL", code: "NBC Part 4" },
  { id: "STRUCTURAL_STABILITY", label: "Structural Design Vetting / Seismic Zone IV Certificate Incomplete", severity: "CRITICAL", code: "IS 1893" },
  { id: "RAINWATER_HARVESTING", label: "Mandatory Rainwater Harvesting & Dual Plumbing System Missing", severity: "MEDIUM", code: "Sec 31.0" },
  { id: "HEIGHT_SHADOW_FUNNEL", label: "Building Height Exceeds 1:1.5 Road Width Ratio / AAI Funnel", severity: "HIGH", code: "Sec 19.3" },
  { id: "BOUNDARY_WALL_EXCESS", label: "Compound Wall Height Exceeds Permissible 1.80m Limit", severity: "LOW", code: "Sec 12.8" }
];

export const BUILDING_STATUS_TIMELINE_STEPS = [
  { step: 1, title: "Application & Fee", description: "Submission, digital signature & scrutiny fee verification" },
  { step: 2, title: "By-Law Scrutiny", description: "Town planning check for FAR, ground coverage & setbacks" },
  { step: 3, title: "Agency NOCs", description: "Clearances from Fire, AAI, Pollution & Forest departments" },
  { step: 4, title: "Site Inspection", description: "Physical on-ground setback & boundary peg verification" },
  { step: 5, title: "Sanction Permit", description: "Formal Municipal Building Sanction Order permit released" }
];

