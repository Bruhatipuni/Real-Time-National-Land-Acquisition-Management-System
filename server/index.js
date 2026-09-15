import express from 'express';
import cors from 'cors';
import { 
  PROJECTS_DATA, 
  PARCELS_DATA, 
  ROUTE_ALIGNMENT_OPTIONS, 
  LEGAL_CASES_DATA, 
  NOTIFICATIONS_DATA, 
  RECENT_AUDIT_LOGS,
  ROLES_LIST
} from '../src/data/mockData.js';
import { calculateLARRCompensation } from '../src/utils/compensationEngine.js';
import { getULPINDetails, validateULPINFormat } from '../src/utils/ulpinGenerator.js';

import { connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Attempt DB connection on server launch
connectDB().catch(err => console.error('[MongoDB Startup] Connection error:', err));

// In-memory data store for API mutations & offline fallback
let landsStore = [...PARCELS_DATA];
let legalCasesStore = [...LEGAL_CASES_DATA];
let auditLogsStore = [...RECENT_AUDIT_LOGS];

// -------------------------------------------------------------
// 1. AUTHENTICATION & RBAC APIs
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, roleId } = req.body;
  const roleObj = ROLES_LIST.find(r => r.id === roleId) || ROLES_LIST[0];
  res.json({
    success: true,
    token: `jwt_token_${Date.now()}`,
    user: {
      id: "USR-101",
      name: roleObj.name.split('(')[0].trim(),
      email: email || `${roleId.toLowerCase()}@bhusetu.gov.in`,
      role: roleId,
      roleObj
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, roleId, department } = req.body;
  res.json({
    success: true,
    message: "User registered successfully",
    user: { id: `USR-${Date.now()}`, name, email, role: roleId || 'LAND_OFFICER', department }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

app.get('/api/users/me', (req, res) => {
  res.json({ success: true, user: { id: "USR-101", name: "Super Admin", role: "SUPER_ADMIN" } });
});

app.get('/api/users', (req, res) => {
  res.json({ success: true, count: ROLES_LIST.length, users: ROLES_LIST });
});

// -------------------------------------------------------------
// 2. LANDS & GIS MODULE APIs
// -------------------------------------------------------------
app.get('/api/lands', (req, res) => {
  const { state, district, village, status } = req.query;
  let result = [...landsStore];
  if (state) result = result.filter(l => l.state.toLowerCase() === state.toLowerCase());
  if (district) result = result.filter(l => l.district.toLowerCase() === district.toLowerCase());
  if (status) result = result.filter(l => l.status === status);
  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/lands/map', (req, res) => {
  res.json({
    type: "FeatureCollection",
    features: landsStore.map(p => ({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [p.coordinates.map(coord => [coord[1], coord[0]])]
      },
      properties: p
    }))
  });
});

app.get('/api/lands/:id', (req, res) => {
  const land = landsStore.find(l => l.id === req.params.id || l.landId === req.params.id);
  if (!land) return res.status(404).json({ success: false, message: "Land parcel not found" });
  res.json({ success: true, land });
});

app.post('/api/lands', (req, res) => {
  const newLand = { id: `LND-${Date.now()}`, ...req.body };
  landsStore.push(newLand);
  res.json({ success: true, land: newLand });
});

app.patch('/api/lands/:id', (req, res) => {
  const index = landsStore.findIndex(l => l.id === req.params.id || l.landId === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Land not found" });
  landsStore[index] = { ...landsStore[index], ...req.body };
  res.json({ success: true, land: landsStore[index] });
});

// -------------------------------------------------------------
// 3. LAND ACQUISITION WORKFLOW & APPROVAL APIs
// -------------------------------------------------------------
app.get('/api/acquisitions', (req, res) => {
  res.json({ success: true, count: landsStore.length, acquisitions: landsStore });
});

app.get('/api/acquisitions/:id', (req, res) => {
  const acq = landsStore.find(l => l.id === req.params.id || l.landId === req.params.id);
  if (!acq) return res.status(404).json({ success: false, message: "Acquisition record not found" });
  res.json({ success: true, acquisition: acq });
});

app.patch('/api/acquisitions/:id/status', (req, res) => {
  const { status, remarks, officer } = req.body;
  const parcel = landsStore.find(l => l.id === req.params.id || l.landId === req.params.id);
  if (!parcel) return res.status(404).json({ success: false, message: "Land not found" });

  const oldStatus = parcel.status;
  parcel.status = status;
  if (parcel.acquisitionStatus) parcel.acquisitionStatus = status;

  // Record audit log
  const newLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: officer || "Government Officer",
    role: "OFFICER",
    action: `STATUS_CHANGED_TO_${status}`,
    entity: "Land Parcel",
    entityId: parcel.landId || parcel.id,
    oldStatus,
    newStatus: status,
    details: remarks || `Advanced acquisition stage to ${status}`
  };
  auditLogsStore.unshift(newLog);

  res.json({ success: true, parcel, auditLog: newLog });
});

app.get('/api/approvals', (req, res) => {
  const approvals = landsStore.map(l => ({
    landId: l.landId || l.id,
    ulpin: l.ulpin,
    surveyNumber: l.surveyNumber || l.surveyNo,
    approvals: l.approvals || []
  }));
  res.json({ success: true, approvals });
});

// -------------------------------------------------------------
// 4. COMPENSATION & DBT APIs
// -------------------------------------------------------------
app.get('/api/compensations', (req, res) => {
  const compData = landsStore.map(l => ({
    landId: l.landId || l.id,
    owner: l.currentOwner || l.ownerName,
    areaHectares: l.areaHectares || l.area,
    solatiumAmount: l.solatiumAmount,
    totalAwardAmount: l.totalAwardAmount,
    dbtStatus: l.dbtStatus,
    dbtTransactionId: l.dbtTransactionId
  }));
  res.json({ success: true, compensations: compData });
});

app.post('/api/compensation/calculate', (req, res) => {
  const comp = calculateLARRCompensation(req.body);
  res.json({ success: true, result: comp });
});

// -------------------------------------------------------------
// 5. LEGAL & OBJECTIONS MODULE APIs
// -------------------------------------------------------------
app.get('/api/legal-cases', (req, res) => {
  res.json({ success: true, count: legalCasesStore.length, cases: legalCasesStore });
});

app.post('/api/legal-cases', (req, res) => {
  const newCase = { id: `CASE-${Date.now()}`, ...req.body };
  legalCasesStore.push(newCase);
  res.json({ success: true, case: newCase });
});

app.patch('/api/legal-cases/:id', (req, res) => {
  const index = legalCasesStore.findIndex(c => c.id === req.params.id || c.caseId === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Legal case not found" });
  legalCasesStore[index] = { ...legalCasesStore[index], ...req.body };
  res.json({ success: true, case: legalCasesStore[index] });
});

// -------------------------------------------------------------
// 6. DASHBOARD, ANALYTICS & RISK SCORING APIs
// -------------------------------------------------------------
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalLands: 12450,
      underAcquisition: 2310,
      completedAcquisition: 6720,
      pendingApproval: 412,
      legalDisputes: 183,
      delayedProjects: 47
    }
  });
});

app.get('/api/dashboard/risk', (req, res) => {
  const highRisk = landsStore.map(l => ({
    landId: l.landId || l.id,
    ulpin: l.ulpin,
    surveyNumber: l.surveyNumber || l.surveyNo,
    owner: l.currentOwner || l.ownerName,
    riskScore: l.riskScore || 25,
    riskTier: l.riskTier || "LOW",
    recommendedAction: l.recommendedAction
  }));
  res.json({ success: true, count: highRisk.length, riskRadar: highRisk });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, count: PROJECTS_DATA.length, data: PROJECTS_DATA });
});

app.get('/api/ulpin/verify/:ulpin', (req, res) => {
  const { ulpin } = req.params;
  const isValid = validateULPINFormat(ulpin);
  const foundParcel = landsStore.find(p => p.ulpin.toLowerCase() === ulpin.toLowerCase());
  const details = getULPINDetails(ulpin);
  res.json({ success: true, parcel: foundParcel || null, verification: details });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets from dist folder if available
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback route for SPA index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`BHUSETU Full-Stack REST Server running on http://localhost:${PORT}`);
  });
}

export default app;
