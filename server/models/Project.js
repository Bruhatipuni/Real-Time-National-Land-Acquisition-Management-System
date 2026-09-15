import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  agency: { type: String, required: true },
  ministry: { type: String, required: true },
  state: { type: String, required: true },
  districts: [{ type: String }],
  totalParcels: { type: Number, default: 0 },
  acquiredParcels: { type: Number, default: 0 },
  totalAreaHa: { type: Number, default: 0 },
  acquiredAreaHa: { type: Number, default: 0 },
  budgetAllocatedCrores: { type: Number, default: 0 },
  budgetDisbursedCrores: { type: Number, default: 0 },
  status: { type: String, default: 'IN_PROGRESS' },
  currentStage: { type: String, default: 'IDENTIFIED' },
  displacedFamilies: { type: Number, default: 0 },
  rehabilitatedFamilies: { type: Number, default: 0 },
  activeDisputes: { type: Number, default: 0 },
  riskScore: { type: Number, default: 50 },
  riskTier: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  centerLat: { type: Number, required: true },
  centerLng: { type: Number, required: true },
  zoom: { type: Number, default: 11 }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
