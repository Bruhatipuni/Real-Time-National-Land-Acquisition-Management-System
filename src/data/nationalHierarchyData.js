// ============================================================================
// BHUSETU NATIONAL SPATIAL HIERARCHY & LAND ACQUISITION DATA ENGINE
// Prototype Demonstration Dataset - Ministry of Rural Development & MoRTH
// ============================================================================

// 1. ALL 36 STATES AND UNION TERRITORIES OF INDIA
export const ALL_36_STATES_AND_UTS = [
  // 28 STATES
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // 8 UNION TERRITORIES
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

// 2. STRUCTURED DISTRICT REGISTRY BY STATE/UT
export const DISTRICTS_BY_STATE = {
  "Maharashtra": [
    "Thane", "Palghar", "Mumbai Suburban", "Mumbai City", "Pune", "Nagpur",
    "Nashik", "Aurangabad (Chhatrapati Sambhajinagar)", "Solapur", "Kolhapur",
    "Ahmednagar", "Raigad", "Satara", "Jalgaon", "Amravati", "Nanded"
  ],
  "Andhra Pradesh": [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya",
    "Bapatla", "Chittoor", "East Godavari", "Eluru", "Guntur", "Kakinada",
    "Konaseema", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu",
    "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR"
  ],
  "Telangana": [
    "Hyderabad", "Rangareddy", "Medchal-Malkajgiri", "Sangareddy", "Nalgonda",
    "Warangal", "Hanamkonda", "Khammam", "Karimnagar", "Nizamabad", "Mahabubnagar",
    "Siddipet", "Bhadradri Kothagudem", "Jagtial", "Mancherial"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Navsari", "Valsad", "Bharuch",
    "Kheda", "Anand", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Kutch", "Panchmahal"
  ],
  "Haryana": [
    "Gurugram", "Nuh", "Faridabad", "Palwal", "Rewari", "Sonipat", "Jhajjar",
    "Rohtak", "Panipat", "Karnal", "Ambala", "Panchkula", "Hisar"
  ],
  "Uttar Pradesh": [
    "Gautam Buddha Nagar", "Ghaziabad", "Lucknow", "Varanasi", "Ghazipur",
    "Azamgarh", "Prayagraj", "Kanpur Nagar", "Agra", "Meerut", "Mathura",
    "Bulandshahr", "Aligarh", "Ayodhya", "Gorakhpur", "Chandauli"
  ],
  "Karnataka": [
    "Bengaluru Urban", "Bengaluru Rural", "Ramanagara", "Mandya", "Mysuru",
    "Tumakuru", "Kolar", "Chikkaballapura", "Belagavi", "Dharwad", "Dakshina Kannada", "Udupi"
  ],
  "Tamil Nadu": [
    "Chennai", "Kanchipuram", "Chengalpattu", "Tiruvallur", "Coimbatore",
    "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"
  ],
  "Delhi": [
    "New Delhi", "South Delhi", "South West Delhi", "North Delhi", "North West Delhi",
    "West Delhi", "East Delhi", "North East Delhi", "Central Delhi", "Shahdara"
  ],
  "Rajasthan": [
    "Jaipur", "Alwar", "Dausa", "Sawai Madhopur", "Kota", "Jodhpur", "Udaipur",
    "Bikaner", "Ajmer", "Bhilwara", "Sikar", "Chittorgarh"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Rewa", "Jabalpur", "Gwalior", "Ujjain", "Ratlam",
    "Sagar", "Satna", "Dewas", "Sehore", "Vidisha"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kollam", "Alappuzha", "Pathanamthitta", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
  ],
  "Punjab": [
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali (SAS Nagar)",
    "Hoshiarpur", "Gurdaspur", "Pathankot", "Firozpur"
  ],
  "Bihar": [
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia",
    "Rohtas", "Vaishali", "Nalanda", "Saran", "Begusarai"
  ],
  "Odisha": [
    "Khordha (Bhubaneswar)", "Cuttack", "Jagatsinghpur (Paradip)", "Keonjhar",
    "Ganjam", "Sundargarh", "Angul", "Sambalpur", "Balasore", "Puri"
  ],
  "West Bengal": [
    "Kolkata", "North 24 Parganas", "South 24 Parganas", "Howrah", "Hooghly",
    "Purba Medinipur", "Paschim Bardhaman", "Darjeeling", "Jalpaiguri", "Nadia"
  ],
  "Assam": [
    "Kamrup Metropolitan (Guwahati)", "Dibrugarh", "Silchar (Cachar)", "Jorhat", "Nagaon", "Sonitpur"
  ],
  "Himachal Pradesh": [
    "Shimla", "Kangra", "Mandi", "Solan", "Kullu", "Sirmaur", "Bilaspur", "Una"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Nainital", "Udham Singh Nagar", "Pauri Garhwal", "Tehri Garhwal"
  ],
  "Chhattisgarh": [
    "Raipur", "Durg", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Bastar"
  ],
  "Jharkhand": [
    "Ranchi", "East Singhbhum (Jamshedpur)", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"
  ],
  "Goa": [
    "North Goa", "South Goa"
  ],
  "Tripura": [
    "West Tripura (Agartala)", "South Tripura", "Gomati", "Dhalai", "North Tripura"
  ],
  "Meghalaya": [
    "East Khasi Hills (Shillong)", "West Garo Hills", "Ri-Bhoi", "West Jaintia Hills"
  ],
  "Manipur": [
    "Imphal West", "Imphal East", "Thoubal", "Bishnupur", "Churachandpur"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Wokha", "Mon"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Champhai", "Kolasib", "Serchhip"
  ],
  "Arunachal Pradesh": [
    "Papum Pare (Itanagar)", "Changlang", "West Kameng", "Tawang", "East Siang"
  ],
  "Sikkim": [
    "East Sikkim (Gangtok)", "West Sikkim", "South Sikkim", "North Sikkim"
  ],
  "Jammu and Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Pulwama", "Samba"
  ],
  "Ladakh": [
    "Leh", "Kargil"
  ],
  "Chandigarh": [
    "Chandigarh City"
  ],
  "Puducherry": [
    "Puducherry", "Karaikal", "Mahe", "Yanam"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman", "Diu", "Dadra and Nagar Haveli"
  ],
  "Andaman and Nicobar Islands": [
    "South Andaman (Port Blair)", "North and Middle Andaman", "Nicobar"
  ],
  "Lakshadweep": [
    "Kavaratti", "Agatti", "Andrott", "Minicoy"
  ]
};

// 3. PROJECT TYPES / SECTORS (30+ comprehensive sectors)
export const PROJECT_SECTORS = [
  "High-Speed Rail",
  "Railway",
  "Metro Rail",
  "Expressway",
  "Highway",
  "Ring Road",
  "Bypass",
  "Airport",
  "Port",
  "Irrigation",
  "Dam",
  "Water Resources",
  "Canal",
  "Industrial Corridor",
  "Industrial Park",
  "Manufacturing",
  "Logistics Park",
  "Urban Development",
  "Smart City",
  "Housing / Township",
  "Solar",
  "Wind Energy",
  "Renewable Energy",
  "Power",
  "Transmission",
  "Defence Infrastructure",
  "Mining",
  "Pipeline",
  "Telecommunications Infrastructure",
  "Other Infrastructure"
];

// 4. NATIONAL DEMO PROJECTS REGISTRY
export const NATIONAL_PROJECTS = [
  {
    id: "PROJ-MAH-HSR",
    code: "PROJ-MAH-HSR",
    name: "Mumbai-Ahmedabad High-Speed Rail Corridor (Bullet Train)",
    state: "Maharashtra",
    district: "Thane",
    districts: ["Thane", "Palghar", "Mumbai Suburban", "Ahmedabad", "Surat", "Vadodara", "Navsari"],
    agency: "National High Speed Rail Corporation Limited (NHSRCL)",
    sector: "Railway",
    projectType: "High-Speed Rail",
    status: "IN_PROGRESS",
    currentStage: "VERIFICATION",
    acquisitionRiskScore: 78,
    acquisitionRiskLevel: "HIGH",
    delayProbability: "78%",
    environmentalRisk: "MEDIUM",
    environmentalRiskTag: "ESG",
    environmentalDetails: "2.1 km Forest • 1 River",
    socialImpact: "HIGH",
    socialImpactTag: "R&R",
    familiesAffected: 620,
    legalDisputesCount: 48,
    highRiskParcelsCount: 31,
    estimatedCompensationCr: 2200,
    estimatedDurationMonths: 14,
    centerLat: 19.2183,
    centerLng: 72.9781,
    zoom: 13,
    totalParcels: 63,
    acquiredParcels: 42,
    villages: ["Kalyan East", "Shahapur", "Datiwali", "Kopar", "Bhilad", "Diva Rural"],
    actions: [
      "Prioritize dispute resolution and compensation verification before proceeding to Section 19 notification.",
      "Implement Schedule II Rehabilitation & Resettlement consultation for 142 affected claims.",
      "Accelerate Joint Measurement Surveys (JMS) for 18 parcels with area mismatches using offline field mode.",
      "Deposit disputed compensation in court escrow to proceed with undisputed chainages.",
      "Select Route C alignment to bypass eco-sensitive forest zone and reduce rehabilitation burden by 60%."
    ]
  },
  {
    id: "PROJ-AP-POLA",
    code: "PROJ-AP-POLA",
    name: "Polavaram Multi-Purpose Irrigation Project",
    state: "Andhra Pradesh",
    district: "Eluru",
    districts: ["Eluru", "Alluri Sitharama Raju", "East Godavari", "West Godavari"],
    agency: "Polavaram Project Authority (PPA) / Water Resources Dept",
    sector: "Irrigation",
    projectType: "Irrigation",
    status: "IN_PROGRESS",
    currentStage: "COMPENSATION",
    acquisitionRiskScore: 72,
    acquisitionRiskLevel: "HIGH",
    delayProbability: "68%",
    environmentalRisk: "HIGH",
    environmentalRiskTag: "ESG",
    environmentalDetails: "Submergence Zone • Eco-sensitive Tribal Belt",
    socialImpact: "CRITICAL",
    socialImpactTag: "R&R",
    familiesAffected: 1450,
    legalDisputesCount: 64,
    highRiskParcelsCount: 42,
    estimatedCompensationCr: 4800,
    estimatedDurationMonths: 24,
    centerLat: 17.2514,
    centerLng: 81.6578,
    zoom: 12,
    totalParcels: 84,
    acquiredParcels: 56,
    villages: ["Polavaram Rural", "Pattiseema", "Kukunoor", "Velairpadu", "Chinturu"],
    actions: [
      "Complete pending Tribal Land Alienation verification under LARR Schedule II.",
      "Expedite DBT direct bank payouts for 380 displaced families in Phase 2 resettlement colonies.",
      "Execute DGPS ground re-survey for boundary elevation contour 45.72m contour."
    ]
  },
  {
    id: "PROJ-TG-RRR",
    code: "PROJ-TG-RRR",
    name: "Hyderabad Regional Ring Road (RRR - Northern Arc)",
    state: "Telangana",
    district: "Rangareddy",
    districts: ["Rangareddy", "Medchal-Malkajgiri", "Sangareddy", "Siddipet", "Yadadri Bhuvanagiri"],
    agency: "National Highways Authority of India (NHAI) & R&B Dept",
    sector: "Ring Road",
    projectType: "Ring Road",
    status: "IN_PROGRESS",
    currentStage: "PROPOSAL",
    acquisitionRiskScore: 64,
    acquisitionRiskLevel: "MEDIUM",
    delayProbability: "55%",
    environmentalRisk: "LOW",
    environmentalRiskTag: "ESG",
    environmentalDetails: "Dry agricultural land • 0.4 km scrub reserve",
    socialImpact: "MEDIUM",
    socialImpactTag: "R&R",
    familiesAffected: 340,
    legalDisputesCount: 22,
    highRiskParcelsCount: 16,
    estimatedCompensationCr: 3100,
    estimatedDurationMonths: 18,
    centerLat: 17.5810,
    centerLng: 78.4320,
    zoom: 11,
    totalParcels: 52,
    acquiredParcels: 28,
    villages: ["Shamshabad Rural", "Kondapur", "Gundlapochampally", "Toopran", "Choutuppal"],
    actions: [
      "Publish Section 3A gazette notification for Northern Section chainage 42km-88km.",
      "Resolve coparcener inheritance claims on 14 ancestral agricultural land plots."
    ]
  },
  {
    id: "PROJ-UP-PURV",
    code: "PROJ-UP-PURV",
    name: "Purvanchal Expressway Corridor Expansion",
    state: "Uttar Pradesh",
    district: "Varanasi",
    districts: ["Varanasi", "Ghazipur", "Azamgarh", "Lucknow", "Chandauli"],
    agency: "Uttar Pradesh Expressways Industrial Development Authority (UPEIDA)",
    sector: "Expressway",
    projectType: "Expressway",
    status: "IN_PROGRESS",
    currentStage: "HANDOVER",
    acquisitionRiskScore: 42,
    acquisitionRiskLevel: "LOW",
    delayProbability: "30%",
    environmentalRisk: "LOW",
    environmentalRiskTag: "ESG",
    environmentalDetails: "Non-forest agricultural plains",
    socialImpact: "LOW",
    socialImpactTag: "R&R",
    familiesAffected: 180,
    legalDisputesCount: 14,
    highRiskParcelsCount: 8,
    estimatedCompensationCr: 1450,
    estimatedDurationMonths: 10,
    centerLat: 25.3176,
    centerLng: 82.9739,
    zoom: 12,
    totalParcels: 48,
    acquiredParcels: 40,
    villages: ["Pindra", "Baragaon", "Saidpur", "Zamania", "Mohammadabad"],
    actions: [
      "Issue final vesting possession certificates for chainage 310-340km.",
      "Clear 6 pending Section 3C court petitions in Ghazipur civil court."
    ]
  },
  {
    id: "PROJ-KA-BMEX",
    code: "PROJ-KA-BMEX",
    name: "Bengaluru-Mysuru Access-Controlled Expressway Service Corridor",
    state: "Karnataka",
    district: "Bengaluru Rural",
    districts: ["Bengaluru Rural", "Ramanagara", "Mandya", "Mysuru"],
    agency: "National Highways Authority of India (NHAI)",
    sector: "Highway",
    projectType: "Highway",
    status: "IN_PROGRESS",
    currentStage: "VERIFICATION",
    acquisitionRiskScore: 58,
    acquisitionRiskLevel: "MEDIUM",
    delayProbability: "48%",
    environmentalRisk: "MEDIUM",
    environmentalRiskTag: "ESG",
    environmentalDetails: "Lake buffer zone • Coconut groves",
    socialImpact: "MEDIUM",
    socialImpactTag: "R&R",
    familiesAffected: 210,
    legalDisputesCount: 19,
    highRiskParcelsCount: 12,
    estimatedCompensationCr: 1750,
    estimatedDurationMonths: 11,
    centerLat: 12.8342,
    centerLng: 77.4110,
    zoom: 12,
    totalParcels: 44,
    acquiredParcels: 31,
    villages: ["Bidadi", "Channapatna Rural", "Maddur", "Srirangapatna"],
    actions: [
      "Re-demarcate boundary wall encroachment near Ramanagara toll intersection.",
      "Validate compensation solatium calculations for commercial roadside parcels."
    ]
  },
  {
    id: "PROJ-DL-MTR4",
    code: "PROJ-DL-MTR4",
    name: "Delhi Metro Phase IV Golden Line Corridor",
    state: "Delhi",
    district: "South Delhi",
    districts: ["South Delhi", "New Delhi", "South West Delhi"],
    agency: "Delhi Metro Rail Corporation (DMRC)",
    sector: "Metro Rail",
    projectType: "Metro Rail",
    status: "IN_PROGRESS",
    currentStage: "OBJECTION",
    acquisitionRiskScore: 82,
    acquisitionRiskLevel: "HIGH",
    delayProbability: "84%",
    environmentalRisk: "HIGH",
    environmentalRiskTag: "ESG",
    environmentalDetails: "Ridge reserve forest clearance required",
    socialImpact: "CRITICAL",
    socialImpactTag: "R&R",
    familiesAffected: 450,
    legalDisputesCount: 38,
    highRiskParcelsCount: 26,
    estimatedCompensationCr: 2900,
    estimatedDurationMonths: 16,
    centerLat: 28.5244,
    centerLng: 77.1855,
    zoom: 13,
    totalParcels: 36,
    acquiredParcels: 18,
    villages: ["Mehrauli", "Tigri", "Aerocity North", "Khanpur"],
    actions: [
      "Conduct Joint Tree Census under Delhi Preservation of Trees Act.",
      "Expedite alternate depot land parcel allotment in Chhatarpur."
    ]
  },
  {
    id: "PROJ-GJ-DMIC",
    code: "PROJ-GJ-DMIC",
    name: "Western Dedicated Freight Corridor (Gujarat DFC Section)",
    state: "Gujarat",
    district: "Ahmedabad",
    districts: ["Ahmedabad", "Surat", "Vadodara", "Bharuch", "Navsari"],
    agency: "Dedicated Freight Corridor Corporation of India (DFCCIL)",
    sector: "Railway",
    projectType: "Railway",
    status: "IN_PROGRESS",
    currentStage: "VERIFICATION",
    acquisitionRiskScore: 66,
    acquisitionRiskLevel: "MEDIUM",
    delayProbability: "58%",
    environmentalRisk: "LOW",
    environmentalRiskTag: "ESG",
    environmentalDetails: "Coastal saline scrub • Railway RoW expansion",
    socialImpact: "MEDIUM",
    socialImpactTag: "R&R",
    familiesAffected: 310,
    legalDisputesCount: 24,
    highRiskParcelsCount: 14,
    estimatedCompensationCr: 2100,
    estimatedDurationMonths: 12,
    centerLat: 22.9980,
    centerLng: 72.6120,
    zoom: 12,
    totalParcels: 55,
    acquiredParcels: 38,
    villages: ["Sanand GIDC", "Viramgam", "Dholka", "Makarba"],
    actions: [
      "Review compensation uplift claims in Sanand industrial corridor periphery.",
      "Conduct drone survey for level-crossing replacement flyovers."
    ]
  },
  {
    id: "PROJ-HR-DME",
    code: "PROJ-HR-DME",
    name: "Delhi-Mumbai Industrial Expressway (Haryana Section IV)",
    state: "Haryana",
    district: "Gurugram",
    districts: ["Gurugram", "Nuh", "Palwal"],
    agency: "National Highways Authority of India (NHAI)",
    sector: "Expressway",
    projectType: "Expressway",
    status: "IN_PROGRESS",
    currentStage: "COMPENSATION",
    acquisitionRiskScore: 68,
    acquisitionRiskLevel: "MEDIUM",
    delayProbability: "62%",
    environmentalRisk: "LOW",
    environmentalRiskTag: "ESG",
    environmentalDetails: "Aravalli foothills buffer • Non-forest",
    socialImpact: "MEDIUM",
    socialImpactTag: "R&R",
    familiesAffected: 184,
    legalDisputesCount: 12,
    highRiskParcelsCount: 9,
    estimatedCompensationCr: 1250,
    estimatedDurationMonths: 10,
    centerLat: 28.1487,
    centerLng: 76.9312,
    zoom: 12,
    totalParcels: 42,
    acquiredParcels: 35,
    villages: ["Sohna Rural", "Taoru", "Nuh City Outskirts", "Ferozepur Jhirka"],
    actions: [
      "Accelerate solatium disbursement for 28 verified Khata owners.",
      "Resolve Section 3C dispute on Plot 45/2A regarding fencing mismatch."
    ]
  }
];

// Helper to get fallback project for any State / District
export function getDemoProjectForSelection(state, district, projectType) {
  let matched = NATIONAL_PROJECTS.find(p => p.state === state && (district ? (p.district === district || (p.districts && p.districts.includes(district))) : true));
  if (matched) return matched;

  matched = NATIONAL_PROJECTS.find(p => p.state === state);
  if (matched) return matched;

  // Generate a clean demonstration project record
  return {
    id: `PROJ-${(state || "IND").substring(0, 3).toUpperCase()}-INFRA`,
    code: `PROJ-${(state || "IND").substring(0, 3).toUpperCase()}-INFRA`,
    name: `${state || "National"} Regional Infrastructure Development Corridor`,
    state: state || "Maharashtra",
    district: district || (DISTRICTS_BY_STATE[state] ? DISTRICTS_BY_STATE[state][0] : "Central"),
    districts: DISTRICTS_BY_STATE[state] || ["District North", "District South"],
    agency: "National Infrastructure Development Authority",
    sector: projectType || "Highway",
    projectType: projectType || "Highway",
    status: "IN_PROGRESS",
    currentStage: "VERIFICATION",
    acquisitionRiskScore: 65,
    acquisitionRiskLevel: "MEDIUM",
    delayProbability: "55%",
    environmentalRisk: "MEDIUM",
    environmentalRiskTag: "ESG",
    environmentalDetails: "1.8 km Agricultural Plains • 0.5 km Canal Crossings",
    socialImpact: "MEDIUM",
    socialImpactTag: "R&R",
    familiesAffected: 280,
    legalDisputesCount: 18,
    highRiskParcelsCount: 12,
    estimatedCompensationCr: 1650,
    estimatedDurationMonths: 12,
    centerLat: 19.0760,
    centerLng: 72.8777,
    zoom: 12,
    totalParcels: 35,
    acquiredParcels: 22,
    villages: ["Revenue Village 1", "Revenue Village 2", "Revenue Village 3"],
    actions: [
      "Conduct Joint Measurement Survey (JMS) with Land Revenue authorities.",
      "Verify Khatauni encumbrance status and bank PFMS linkage.",
      "Issue Section 3A gazette notification for pending chainages."
    ]
  };
}

// 5. PARCEL / ULPIN SYSTEM (Rich National Parcel Dataset)
export const NATIONAL_PARCELS = [
  {
    id: "27-14-9021-M8H2B1",
    ulpin: "27-14-9021-M8H2B1",
    landId: "27-14-9021-M8H2B1",
    plotNumber: "112/3B",
    surveyNumber: "112/3B",
    surveyNo: "112/3B",
    khataNo: "K-4402",
    khataNumber: "K-4402",
    projectId: "PROJ-MAH-HSR",
    projectName: "Mumbai-Ahmedabad High-Speed Rail Corridor (Bullet Train)",
    state: "Maharashtra",
    district: "Thane",
    tehsil: "Kalyan",
    revenueVillage: "Kalyan East",
    village: "Kalyan East",
    landowner: "Dattatray Pandurang Patil",
    ownerName: "Dattatray Pandurang Patil",
    ownerPhone: "+91 98201 44102",
    aadhaarMasked: "XXXX-XXXX-4412",
    officialArea: 1.45,
    surveyedArea: 1.45,
    areaHectares: 1.45,
    area: 1.45,
    landClassification: "Agricultural Rural",
    landType: "Agricultural Rural",
    landUse: "Multi-crop Paddy & Fodder",
    verificationScore: 100,
    surveyStatus: "Survey Done → Handed to LAO",
    status: "VERIFICATION",
    acquisitionStatus: "Handed to LAO (Verified)",
    expectedNextAction: "LAO Section 3G Solatium Award determination & PFMS bank validation",
    alert: "Land Classification Mismatch",
    alertType: "warning",
    gisDemarcation: "Demarcated (4 Coordinates)",
    encroachmentRisk: "LOW",
    riskScore: 78,
    riskLevel: "HIGH",
    riskTier: "HIGH",
    delayProbability: "78%",
    activeDispute: false,
    disputeStatus: "Clear (No Court Stay)",
    marketRatePerHa: 5200000,
    solatiumAmount: 15080000,
    totalAwardAmount: 30160000,
    groundAssets: {
      buildings: 0,
      houses: 0,
      trees: 14,
      wells: 1,
      borewells: 1,
      waterBodies: 0,
      roads: 0,
      utilityStructures: 1,
      agriculturalAssets: 2
    },
    // Leaflet Polygon Coordinates around Kalyan East / Thane (lat, lng)
    coordinates: [
      [19.2185, 72.9780],
      [19.2230, 72.9840],
      [19.2170, 72.9890],
      [19.2130, 72.9815]
    ],
    documents: [
      { id: "DOC-01", title: "Khatauni Revenue Extract 7/12", type: "REVENUE_RECORD", date: "12 Jan 2026", status: "VERIFIED", officer: "Talathi Officer Kalyan" },
      { id: "DOC-02", title: "Joint Measurement Survey (JMS) Field Sheet", type: "SURVEY_SHEET", date: "18 Feb 2026", status: "VERIFIED", officer: "Anish Kumar (Senior Surveyor)" },
      { id: "DOC-03", title: "DGPS 4-Node Boundary Orthomosaic", type: "GIS_MAP", date: "24 Feb 2026", status: "VERIFIED", officer: "Field Surveyor & GIS Nodal" }
    ],
    timeline: [
      { stage: "Identification", date: "15 Oct 2025", status: "On Time", details: "ULPIN generated via Bhu-Aadhaar engine" },
      { stage: "Field Survey", date: "18 Feb 2026", status: "On Time", details: "DGPS field boundary pegged with 4 ground markers" },
      { stage: "Record Verification", date: "26 Feb 2026", status: "On Time", details: "100% score; zero area variance detected" },
      { stage: "Solatium Award", date: "Pending", status: "At Risk", details: "Awaiting LAO Section 3G approval" }
    ]
  },
  {
    id: "27-14-9022-P9K1A3",
    ulpin: "27-14-9022-P9K1A3",
    landId: "27-14-9022-P9K1A3",
    plotNumber: "88/1A",
    surveyNumber: "88/1A",
    surveyNo: "88/1A",
    khataNo: "K-4408",
    khataNumber: "K-4408",
    projectId: "PROJ-MAH-HSR",
    projectName: "Mumbai-Ahmedabad High-Speed Rail Corridor (Bullet Train)",
    state: "Maharashtra",
    district: "Palghar",
    tehsil: "Shahapur",
    revenueVillage: "Shahapur",
    village: "Shahapur",
    landowner: "Sunita Manohar Deshmukh & Co-owners",
    ownerName: "Sunita Manohar Deshmukh & Co-owners",
    ownerPhone: "+91 98202 88123",
    aadhaarMasked: "XXXX-XXXX-9901",
    officialArea: 2.1,
    surveyedArea: 2.38,
    areaHectares: 2.1,
    area: 2.1,
    landClassification: "Agricultural Non-Irrigated",
    landType: "Agricultural Non-Irrigated",
    landUse: "Fallow & Orchards",
    verificationScore: 70,
    surveyStatus: "Under Active Survey",
    status: "LEGAL",
    acquisitionStatus: "Active Survey & Coparcener Dispute",
    expectedNextAction: "Reconcile cadastral 0.28 Ha area mismatch & resolve co-sharer partition claim",
    alert: "Cadastral vs Survey Area Mismatch",
    alertType: "danger",
    gisDemarcation: "Demarcated (4 Coordinates)",
    encroachmentRisk: "HIGH",
    riskScore: 85,
    riskLevel: "CRITICAL",
    riskTier: "HIGH",
    delayProbability: "85%",
    activeDispute: true,
    disputeStatus: "Active (LD-1043 Coparcener Share Exclusion)",
    marketRatePerHa: 4800000,
    solatiumAmount: 20160000,
    totalAwardAmount: 40320000,
    groundAssets: {
      buildings: 1,
      houses: 1,
      trees: 28,
      wells: 2,
      borewells: 1,
      waterBodies: 1,
      roads: 0,
      utilityStructures: 0,
      agriculturalAssets: 3
    },
    coordinates: [
      [19.2310, 72.9900],
      [19.2360, 72.9980],
      [19.2300, 73.0040],
      [19.2250, 72.9960]
    ],
    documents: [
      { id: "DOC-04", title: "Khatauni 7/12 Extract Shahapur", type: "REVENUE_RECORD", date: "05 Nov 2025", status: "VERIFIED", officer: "Talathi Shahapur" },
      { id: "DOC-05", title: "Heirship Claim Application (Coparcener)", type: "LEGAL_CLAIM", date: "14 Jan 2026", status: "PENDING", officer: "Legal Officer Palghar" }
    ],
    timeline: [
      { stage: "Identification", date: "10 Nov 2025", status: "On Time", details: "Assigned ULPIN 27-14-9022-P9K1A3" },
      { stage: "Field Survey", date: "15 Jan 2026", status: "Delayed", details: "Area mismatch flagged during physical boundary pinning" },
      { stage: "Record Verification", date: "28 Jan 2026", status: "At Risk", details: "0.28 Ha discrepancy between RoR and ground survey" }
    ]
  },
  {
    id: "06-12-8891-K9X2A4",
    ulpin: "06-12-8891-K9X2A4",
    landId: "06-12-8891-K9X2A4",
    plotNumber: "45/2A",
    surveyNumber: "45/2A",
    surveyNo: "45/2A",
    khataNo: "K-1082",
    khataNumber: "K-1082",
    projectId: "PROJ-HR-DME",
    projectName: "Delhi-Mumbai Industrial Expressway (Haryana Section IV)",
    state: "Haryana",
    district: "Gurugram",
    tehsil: "Sohna",
    revenueVillage: "Sohna Rural",
    village: "Sohna Rural",
    landowner: "Rameshwar Singh Yadav",
    ownerName: "Rameshwar Singh Yadav",
    ownerPhone: "+91 98120 44102",
    aadhaarMasked: "XXXX-XXXX-8921",
    officialArea: 1.82,
    surveyedArea: 1.66,
    areaHectares: 1.82,
    area: 1.82,
    landClassification: "Agricultural Irrigated",
    landType: "Agricultural Irrigated",
    landUse: "Wheat & Mustard",
    verificationScore: 65,
    surveyStatus: "Under Active Survey",
    status: "LEGAL",
    acquisitionStatus: "Boundary Dispute (LD-1042)",
    expectedNextAction: "Joint spot inspection of contested 0.4 acre fencing with Horticulture Nodal",
    alert: "Alleged Boundary Encroachment",
    alertType: "danger",
    gisDemarcation: "Demarcated (4 Coordinates)",
    encroachmentRisk: "HIGH",
    riskScore: 76,
    riskLevel: "HIGH",
    riskTier: "HIGH",
    delayProbability: "76%",
    activeDispute: true,
    disputeStatus: "Active (LD-1042 Fencing Encroachment)",
    marketRatePerHa: 6500000,
    solatiumAmount: 23660000,
    totalAwardAmount: 47320000,
    groundAssets: {
      buildings: 0,
      houses: 0,
      trees: 18,
      wells: 1,
      borewells: 2,
      waterBodies: 0,
      roads: 1,
      utilityStructures: 1,
      agriculturalAssets: 4
    },
    coordinates: [
      [28.2520, 77.0650],
      [28.2560, 77.0700],
      [28.2510, 77.0760],
      [28.2470, 77.0690]
    ],
    documents: [
      { id: "DOC-06", title: "Jamabandi Nakal 2024-25", type: "REVENUE_RECORD", date: "10 Dec 2025", status: "VERIFIED", officer: "Patwari Sohna" },
      { id: "DOC-07", title: "Encroachment Notice Form-IV", type: "LEGAL_NOTICE", date: "22 Jan 2026", status: "PENDING", officer: "SDM Sohna" }
    ],
    timeline: [
      { stage: "Identification", date: "05 Dec 2025", status: "On Time", details: "ULPIN assigned" },
      { stage: "Field Survey", date: "20 Jan 2026", status: "Delayed", details: "Respondent fence detected across official RoW" }
    ]
  },
  {
    id: "28-09-7712-A1B2C3",
    ulpin: "28-09-7712-A1B2C3",
    landId: "28-09-7712-A1B2C3",
    plotNumber: "56/2",
    surveyNumber: "56/2",
    surveyNo: "56/2",
    khataNo: "K-309",
    khataNumber: "K-309",
    projectId: "PROJ-AP-POLA",
    projectName: "Polavaram Multi-Purpose Irrigation Project",
    state: "Andhra Pradesh",
    district: "Eluru",
    tehsil: "Polavaram",
    revenueVillage: "Polavaram Rural",
    village: "Polavaram Rural",
    landowner: "K. Satyanarayana Murthy & Clan",
    ownerName: "K. Satyanarayana Murthy & Clan",
    ownerPhone: "+91 94401 55219",
    aadhaarMasked: "XXXX-XXXX-7721",
    officialArea: 3.2,
    surveyedArea: 3.2,
    areaHectares: 3.2,
    area: 3.2,
    landClassification: "Riverine Alluvial Agricultural",
    landType: "Riverine Agricultural",
    landUse: "Banana Plantation & Pulses",
    verificationScore: 95,
    surveyStatus: "Survey Complete",
    status: "COMPENSATION",
    acquisitionStatus: "Solatium Calculation in Progress",
    expectedNextAction: "Deposit RFCTLARR 2013 solatium payout directly to PFMS bank account",
    alert: "Schedule II R&R Colony Allotment Pending",
    alertType: "info",
    gisDemarcation: "Demarcated (4 Coordinates)",
    encroachmentRisk: "LOW",
    riskScore: 52,
    riskLevel: "MEDIUM",
    riskTier: "MEDIUM",
    delayProbability: "52%",
    activeDispute: false,
    disputeStatus: "No Dispute",
    marketRatePerHa: 3800000,
    solatiumAmount: 24320000,
    totalAwardAmount: 48640000,
    groundAssets: {
      buildings: 1,
      houses: 2,
      trees: 85,
      wells: 1,
      borewells: 2,
      waterBodies: 1,
      roads: 0,
      utilityStructures: 0,
      agriculturalAssets: 5
    },
    coordinates: [
      [17.2514, 81.6578],
      [17.2560, 81.6630],
      [17.2500, 81.6690],
      [17.2460, 81.6620]
    ],
    documents: [
      { id: "DOC-08", title: "1B Namuna Record Extract", type: "REVENUE_RECORD", date: "19 Nov 2025", status: "VERIFIED", officer: "Tahsildar Polavaram" },
      { id: "DOC-09", title: "R&R Entitlement Passbook", type: "R&R_RECORD", date: "15 Jan 2026", status: "VERIFIED", officer: "Joint Collector Eluru" }
    ],
    timeline: [
      { stage: "Identification", date: "01 Nov 2025", status: "On Time", details: "Identified in 45.72m contour" },
      { stage: "Survey", date: "15 Dec 2025", status: "On Time", details: "DGPS boundary pinned" }
    ]
  },
  {
    id: "29-02-6631-B8M9N1",
    ulpin: "29-02-6631-B8M9N1",
    landId: "29-02-6631-B8M9N1",
    plotNumber: "92/4",
    surveyNumber: "92/4",
    surveyNo: "92/4",
    khataNo: "K-722",
    khataNumber: "K-722",
    projectId: "PROJ-KA-BMEX",
    projectName: "Bengaluru-Mysuru Access-Controlled Expressway Service Corridor",
    state: "Karnataka",
    district: "Bengaluru Rural",
    tehsil: "Hosakote",
    revenueVillage: "Hosakote Rural",
    village: "Hosakote Rural",
    landowner: "Narayana Swamy",
    ownerName: "Narayana Swamy",
    ownerPhone: "+91 94480 33112",
    aadhaarMasked: "XXXX-XXXX-6612",
    officialArea: 0.95,
    surveyedArea: 0.95,
    areaHectares: 0.95,
    area: 0.95,
    landClassification: "Dry Agricultural (Commercial Periphery)",
    landType: "Dry Agricultural",
    landUse: "Eucalyptus Plantation",
    verificationScore: 55,
    surveyStatus: "Requires Reverification",
    status: "LEGAL",
    acquisitionStatus: "Overlapping Deed Dispute (LD-1044)",
    expectedNextAction: "Sub-registrar deed registration reconciliation hearing at SDM Bengaluru Rural",
    alert: "Overlapping Deed Registrations",
    alertType: "danger",
    gisDemarcation: "Demarcated (4 Coordinates)",
    encroachmentRisk: "HIGH",
    riskScore: 82,
    riskLevel: "CRITICAL",
    riskTier: "HIGH",
    delayProbability: "82%",
    activeDispute: true,
    disputeStatus: "Active (LD-1044 Overlapping Deed Registrations)",
    marketRatePerHa: 9500000,
    solatiumAmount: 18050000,
    totalAwardAmount: 36100000,
    groundAssets: {
      buildings: 0,
      houses: 0,
      trees: 42,
      wells: 0,
      borewells: 1,
      waterBodies: 0,
      roads: 1,
      utilityStructures: 0,
      agriculturalAssets: 1
    },
    coordinates: [
      [12.8342, 77.4110],
      [12.8390, 77.4160],
      [12.8330, 77.4210],
      [12.8290, 77.4140]
    ],
    documents: [
      { id: "DOC-10", title: "RTC Bhoomi Mutation Register", type: "REVENUE_RECORD", date: "02 Dec 2025", status: "VERIFIED", officer: "Revenue Inspector Hosakote" },
      { id: "DOC-11", title: "Sub-Registrar Encumbrance Certificate (EC)", type: "TITLE_DEED", date: "18 Jan 2026", status: "PENDING", officer: "Senior Sub-Registrar" }
    ],
    timeline: [
      { stage: "Identification", date: "15 Oct 2025", status: "On Time", details: "RoW buffer flagged" },
      { stage: "Survey", date: "10 Jan 2026", status: "Delayed", details: "Overlapping claim by Munivenkatappa" }
    ]
  }
];

// 6. PERSON-TO-PERSON PRIVATE LAND DISPUTE RADAR DATA
export const PRIVATE_LAND_DISPUTES = [
  {
    id: "LD-1042",
    caseNumber: "LD-1042",
    contestedArea: "0.4 Acres (0.16 Ha)",
    disputeType: "Alleged Boundary Encroachment",
    plotNumber: "45/2A",
    khataNumber: "K-1082",
    location: "Sohna Rural, Gurugram, Haryana",
    state: "Haryana",
    district: "Gurugram",
    status: "Under Active Survey",
    statusStep: 2,
    hearingDate: "28 Sep 2026",
    competentAuthority: "SDM & Land Revenue Tribunal, Gurugram",
    partyA: {
      name: "Rameshwar Singh Yadav",
      relation: "Claimant / Landowner",
      claimedArea: "1.82 Ha",
      evidence: "1982 Cadastral survey map with permanent stone boundary markers."
    },
    partyB: {
      name: "Harpal Singh Yadav",
      relation: "Respondent / Adjacent Plot 45/2B Owner",
      claimedArea: "1.20 Ha",
      evidence: "Constructed barbed fence line installed during 2017 partition."
    },
    inconsistencySummary: "Discrepancy identified between respondent fencing and official cadastral boundary.",
    aiInconsistencyDetails: "AI Inconsistency Radar compares digitized 1982 cadastral boundary with DGPS RTK fence coordinates. The physical fence extends 4.2 meters (0.16 Ha) beyond the legally registered khata boundary into claimant's parcel. AI provides evidentiary spatial discrepancy mapping for official verification; final legal ownership determination remains solely with the Sub-Divisional Magistrate (SDM).",
    discrepancyHa: 0.16,
    overlapPercentage: "8.8%",
    recommendedAction: "Direct joint spot inspection by Field Surveyor & Revenue Inspector to re-peg cadastral stones.",
    assignedSurveyor: "Anish Kumar (Senior Surveyor)"
  },
  {
    id: "LD-1043",
    caseNumber: "LD-1043",
    contestedArea: "2.6 Acres (1.05 Ha)",
    disputeType: "Coparcener Share Exclusion",
    plotNumber: "88/1A",
    khataNumber: "K-4408",
    location: "Shahapur, Palghar, Maharashtra",
    state: "Maharashtra",
    district: "Palghar",
    status: "Pending Ground Survey",
    statusStep: 1,
    hearingDate: "05 Oct 2026",
    competentAuthority: "Court of Deputy Collector (Land Acquisition), Palghar",
    partyA: {
      name: "Sunita Manohar Deshmukh",
      relation: "Daughter / Statutory Coparcener",
      claimedArea: "0.70 Ha (One-third ancestral share)",
      evidence: "Hindu Succession (Amendment) Act 2005 parity certificate & family pedigree."
    },
    partyB: {
      name: "Ashok Deshmukh & Brothers",
      relation: "Sons / Existing 7/12 Registered Titleholders",
      claimedArea: "2.10 Ha undivided",
      evidence: "2003 Registered family release deed (Virasatnama)."
    },
    inconsistencySummary: "Heirship certificate mismatch with 7/12 land revenue extract.",
    aiInconsistencyDetails: "Cross-referencing revenue record mutation entries with family pedigree reveals omitted female heirs post-2005 statutory amendment. Contested solatium compensation must be quarantined in court escrow pending partition settlement.",
    discrepancyHa: 0.70,
    overlapPercentage: "33.3%",
    recommendedAction: "Quarantine Section 3G solatium award in escrow account and schedule Revenue Court hearing.",
    assignedSurveyor: "Anish Kumar (Senior Surveyor)"
  },
  {
    id: "LD-1044",
    caseNumber: "LD-1044",
    contestedArea: "0.69 Acres (0.28 Ha)",
    disputeType: "Overlapping Deed Registrations",
    plotNumber: "92/4",
    khataNumber: "K-722",
    location: "Hosakote Rural, Bengaluru Rural, Karnataka",
    state: "Karnataka",
    district: "Bengaluru Rural",
    status: "Court Hearing Scheduled",
    statusStep: 3,
    hearingDate: "22 Sep 2026",
    competentAuthority: "Civil Judge Senior Division, Hosakote",
    partyA: {
      name: "Narayana Swamy",
      relation: "Primary Deed Holder (Vol 42, 2018)",
      claimedArea: "0.95 Ha",
      evidence: "Registered Sale Deed No. 4112/2018 with registered survey sketch."
    },
    partyB: {
      name: "Munivenkatappa",
      relation: "Secondary Deed Holder (Vol 78, 2021)",
      claimedArea: "0.69 Ha",
      evidence: "Registered Gift Deed No. 1892/2021 citing old survey boundary."
    },
    inconsistencySummary: "Dual registration deed numbers registered under different sub-registrar volumes.",
    aiInconsistencyDetails: "Spatial analysis confirms 0.28 Ha of duplicate polygon overlap between deed boundary sketches. Sub-Registrar index II books indicate non-mutation of parent survey partition.",
    discrepancyHa: 0.28,
    overlapPercentage: "29.5%",
    recommendedAction: "Transmit spatial overlap overlay to Sub-Registrar and stay commercial conversion NOC.",
    assignedSurveyor: "Field Surveyor & GIS Nodal"
  }
];

// 7. PRE-ACQUISITION ALTERNATIVE ROUTE SIMULATOR DATA (MCDA Engine)
export const DEFAULT_ALTERNATIVE_ROUTES = [
  {
    id: "ROUTE_A",
    name: "Route A (Original DPR Alignment)",
    code: "ROUTE A",
    color: "#ef4444", // Red
    landRequiredAcres: 2400,
    affectedFamilies: 620,
    disputedParcels: 48,
    highRiskParcels: 31,
    estimatedDurationMonths: 14,
    estimatedCompensationCr: 2200,
    forestLandKm: 4.8,
    riverCrossings: 3,
    affectedParcelsList: [
      { id: "27-14-9021-M8H2B1", plot: "112/3B", owner: "Dattatray Pandurang Patil", area: "1.45 Ha", status: "Disputed", risk: "HIGH" },
      { id: "27-14-9022-P9K1A3", plot: "88/1A", owner: "Sunita Manohar Deshmukh", area: "2.1 Ha", status: "Disputed", risk: "CRITICAL" },
      { id: "27-14-9023-R4T8Y2", plot: "104/1", owner: "Kishore M. Thakre", area: "3.2 Ha", status: "High-Risk", risk: "HIGH" },
      { id: "27-14-9024-X2W9Q1", plot: "99/2C", owner: "Baburao S. Shinde", area: "1.8 Ha", status: "Disputed", risk: "HIGH" }
    ],
    // Geographic alignment points along corridor
    coordinates: [
      [19.2150, 72.9720],
      [19.2220, 72.9810],
      [19.2310, 72.9900],
      [19.2420, 73.0050],
      [19.2550, 73.0210]
    ]
  },
  {
    id: "ROUTE_B",
    name: "Route B (Northern Periphery Bypass)",
    code: "ROUTE B",
    color: "#f97316", // Orange
    landRequiredAcres: 2100,
    affectedFamilies: 380,
    disputedParcels: 27,
    highRiskParcels: 18,
    estimatedDurationMonths: 9,
    estimatedCompensationCr: 1950,
    forestLandKm: 3.2,
    riverCrossings: 2,
    affectedParcelsList: [
      { id: "27-14-9025-M1N2O3", plot: "42/1", owner: "Ganesh K. Varma", area: "1.1 Ha", status: "Clear", risk: "LOW" },
      { id: "27-14-9026-P4Q5R6", plot: "44/3", owner: "Sanjay R. Gaikwad", area: "2.4 Ha", status: "Disputed", risk: "MEDIUM" },
      { id: "27-14-9027-S7T8U9", plot: "49/2", owner: "Nilesh V. Jadhav", area: "1.6 Ha", status: "High-Risk", risk: "MEDIUM" }
    ],
    coordinates: [
      [19.2150, 72.9720],
      [19.2260, 72.9780],
      [19.2390, 72.9940],
      [19.2490, 73.0120],
      [19.2550, 73.0210]
    ]
  },
  {
    id: "ROUTE_C",
    name: "Route C (Eco & Habitation Optimized Alignment)",
    code: "ROUTE C",
    color: "#10b981", // Green
    landRequiredAcres: 2300,
    affectedFamilies: 250,
    disputedParcels: 12,
    highRiskParcels: 9,
    estimatedDurationMonths: 8,
    estimatedCompensationCr: 1850,
    forestLandKm: 0.8,
    riverCrossings: 1,
    affectedParcelsList: [
      { id: "27-14-9021-M8H2B1", plot: "112/3B", owner: "Dattatray Pandurang Patil", area: "1.45 Ha", status: "Verified", risk: "LOW" },
      { id: "27-14-9028-V1W2X3", plot: "71/4A", owner: "Santosh B. Kadam", area: "1.3 Ha", status: "Clear", risk: "LOW" },
      { id: "27-14-9029-Y4Z5A6", plot: "75/1", owner: "Vithal R. Ghode", area: "2.0 Ha", status: "Clear", risk: "LOW" }
    ],
    coordinates: [
      [19.2150, 72.9720],
      [19.2190, 72.9860],
      [19.2280, 73.0010],
      [19.2410, 73.0150],
      [19.2550, 73.0210]
    ]
  }
];

// 8. DYNAMIC WEIGHTED SCORING ENGINE (0-100, LOWER IS BETTER)
// Weights:
// - Land Impact = 30%
// - Social Impact = 25%
// - Legal / Dispute Impact = 20%
// - Compensation Impact = 15%
// - Delay / Time Impact = 10%
export function calculateRouteMCDAScore(route) {
  // Baseline normalization maximums for the corridor
  const MAX_LAND = 3000;          // Acres
  const MAX_FAMILIES = 800;       // Affected Families
  const MAX_DISPUTES = 60;        // Disputed & High-Risk Parcels combined
  const MAX_COMPENSATION = 2500;  // Cr INR
  const MAX_DURATION = 18;        // Months

  const landNorm = Math.min(100, (route.landRequiredAcres / MAX_LAND) * 100);
  const socialNorm = Math.min(100, (route.affectedFamilies / MAX_FAMILIES) * 100);
  const legalNorm = Math.min(100, (((route.disputedParcels * 1.0) + (route.highRiskParcels * 0.7)) / MAX_DISPUTES) * 100);
  const compNorm = Math.min(100, (route.estimatedCompensationCr / MAX_COMPENSATION) * 100);
  const timeNorm = Math.min(100, (route.estimatedDurationMonths / MAX_DURATION) * 100);

  const weightedScore = (
    landNorm * 0.30 +
    socialNorm * 0.25 +
    legalNorm * 0.20 +
    compNorm * 0.15 +
    timeNorm * 0.10
  );

  return Math.round(weightedScore);
}

// 9. NATIONAL DASHBOARD KPI METRICS
export const NATIONAL_DASHBOARD_METRICS = {
  parcelsTracked: 41876,
  parcelsAcquired: 36403,
  parcelsAcquiredPct: 87,
  landAcquiredHa: 150043.4,
  landTargetHa: 178615.0,
  dbtDisbursedCr: 682680.9,
  dbtVerifiedPct: 100,
  activeObjectionsCount: 793,
  projectsMonitored: 58,
  totalStatesCovered: 36,
  isDemoSynthetic: true
};
