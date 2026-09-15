import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema({
  stage: { type: String },
  title: { type: String },
  authority: { type: String },
  status: { type: String, default: 'NOT_STARTED' },
  signedBy: { type: String, default: null },
  signedAt: { type: String, default: null }
}, { _id: false });

const parcelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  ulpin: { type: String, required: true }, // 14-digit Indian Bhu-Aadhaar
  landId: { type: String },
  projectId: { type: String },
  projectName: { type: String },
  ownerName: { type: String },
  currentOwner: { type: String },
  aadhaarHash: { type: String },
  state: { type: String },
  district: { type: String },
  tehsil: { type: String },
  village: { type: String },
  khataNumber: { type: String },
  khataNo: { type: String },
  khasraPlot: { type: String },
  surveyNumber: { type: String },
  areaHa: { type: Number, default: 1.0 },
  landCategory: { type: String, default: 'Agricultural (Multi-crop)' },
  marketValuePerHaINR: { type: Number, default: 2500000 },
  multiplierFactor: { type: Number, default: 1.25 },
  baseMarketValueINR: { type: Number, default: 3125000 },
  solatiumPercentage: { type: Number, default: 100 },
  interestSolatiumINR: { type: Number, default: 0 },
  totalCompensationAwardINR: { type: Number, default: 6250000 },
  status: { type: String, default: 'NOTICE' },
  acquisitionStatus: { type: String, default: 'In Progress' },
  expectedNextAction: { type: String, default: 'Proceed to next milestone' },
  pfmsBankStatus: { type: String, default: 'VERIFIED' },
  pfmsAccountNo: { type: String, default: 'PFMS-99887766' },
  dbtDisbursed: { type: Boolean, default: false },
  dbtDisbursedAmountINR: { type: Number, default: 0 },
  dbtTxnRef: { type: String, default: null },
  disputeCount: { type: Number, default: 0 },
  lat: { type: Number },
  lng: { type: Number },
  coordinates: [[{ type: Number }]],
  polygonCoordinates: [[{ type: Number }]],
  approvals: [approvalSchema]
}, { timestamps: true, strict: false });

export default mongoose.models.Parcel || mongoose.model('Parcel', parcelSchema);
