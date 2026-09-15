import mongoose from 'mongoose';

const legalCaseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  caseNo: { type: String },
  caseNumber: { type: String },
  court: { type: String },
  parcelId: { type: String },
  ulpin: { type: String },
  petitioner: { type: String },
  respondent: { type: String },
  disputeType: { type: String },
  stayOrderActive: { type: Boolean, default: false },
  status: { type: String, default: 'HEARING_SCHEDULED' },
  nextHearingDate: { type: String },
  briefSummary: { type: String }
}, { timestamps: true, strict: false });

export default mongoose.models.LegalCase || mongoose.model('LegalCase', legalCaseSchema);
