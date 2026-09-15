import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: String },
  action: { type: String },
  actor: { type: String },
  user: { type: String },
  role: { type: String },
  parcelId: { type: String, default: 'N/A' },
  details: { type: String },
  ipHash: { type: String, default: 'HASH-10293' }
}, { timestamps: true, strict: false });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
