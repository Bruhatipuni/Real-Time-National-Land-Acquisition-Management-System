import express from 'express';
import cors from 'cors';
import { PROJECTS_DATA, PARCELS_DATA, ROUTE_ALIGNMENT_OPTIONS } from '../src/data/mockData.js';
import { calculateLARRCompensation } from '../src/utils/compensationEngine.js';
import { getULPINDetails, validateULPINFormat } from '../src/utils/ulpinGenerator.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Projects API
app.get('/api/projects', (req, res) => {
  res.json({ success: true, count: PROJECTS_DATA.length, data: PROJECTS_DATA });
});

// 2. Land Parcels GeoJSON & ULPIN API
app.get('/api/parcels', (req, res) => {
  const { projectId, status } = req.query;
  let result = [...PARCELS_DATA];

  if (projectId) {
    result = result.filter(p => p.projectId === projectId);
  }
  if (status && status !== 'ALL') {
    result = result.filter(p => p.status === status);
  }

  res.json({
    type: "FeatureCollection",
    success: true,
    totalParcels: result.length,
    features: result.map(p => ({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [p.coordinates.map(coord => [coord[1], coord[0]])] // [lng, lat]
      },
      properties: p
    }))
  });
});

// 3. ULPIN Verification Endpoint
app.get('/api/ulpin/verify/:ulpin', (req, res) => {
  const { ulpin } = req.params;
  const isValid = validateULPINFormat(ulpin);
  const foundParcel = PARCELS_DATA.find(p => p.ulpin.toLowerCase() === ulpin.toLowerCase());

  if (!isValid && !foundParcel) {
    return res.status(400).json({ success: false, message: "Invalid ULPIN format" });
  }

  const details = getULPINDetails(ulpin);
  res.json({
    success: true,
    parcel: foundParcel || null,
    verification: details
  });
});

// 4. Decision Support System (DSS) Corridor Optimization Endpoint
app.post('/api/dss/optimize-corridor', (req, res) => {
  const { alignmentId } = req.body;
  const alignment = ROUTE_ALIGNMENT_OPTIONS.find(a => a.alignmentId === alignmentId) || ROUTE_ALIGNMENT_OPTIONS[0];

  res.json({
    success: true,
    alignment,
    aiRecommendation: "Route Alpha minimizes displaced families by 55% and saves ₹280 Cr in solatium costs."
  });
});

// 5. RFCTLARR Compensation Calculation API
app.post('/api/compensation/calculate', (req, res) => {
  const comp = calculateLARRCompensation(req.body);
  res.json({ success: true, result: comp });
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
    console.log(`BhuSetu Backend REST API running on http://localhost:${PORT}`);
  });
}

export default app;
