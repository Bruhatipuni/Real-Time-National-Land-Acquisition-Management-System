// Explainable Acquisition Risk Intelligence Engine
// Rule-based decision support system designed for seamless future ML integration

export const RISK_THRESHOLDS = {
  LOW_MAX: 35,
  MEDIUM_MAX: 70,
  HIGH_MAX: 85,
  CRITICAL_MIN: 86
};

export const SLA_BENCHMARKS_DAYS = {
  IDENTIFIED: 30,
  VERIFICATION: 45,
  SURVEY: 30,
  PROPOSAL: 20,
  APPROVAL: 30,
  NOTIFICATION: 30,
  OBJECTION: 45,
  COMPENSATION: 60,
  POSSESSION: 30,
  TRANSFER: 15,
  UTILIZATION: 90
};

/**
 * Calculates a 0-100 explainable risk score for a project or land parcel
 * @param {Object} item - Project or Parcel object
 * @returns {Object} { score, tier, factors, recommendations, slaStatus }
 */
export function calculateAcquisitionRisk(item) {
  let score = 10; // Baseline operational friction
  const factors = [];
  const recommendations = [];

  // 1. Stage Duration & SLA Delays
  const currentStage = item.currentStage || item.status || 'VERIFICATION';
  const stageDelayDays = item.delayDays || item.daysInCurrentStage || 0;
  const benchmarkSLA = SLA_BENCHMARKS_DAYS[currentStage] || 30;

  if (stageDelayDays > benchmarkSLA * 2) {
    score += 35;
    factors.push({
      factor: 'Severe SLA Breach',
      weight: '+35',
      detail: `${currentStage} delayed by ${stageDelayDays} days (SLA Benchmark: ${benchmarkSLA} days)`
    });
    recommendations.push(`Issue statutory escalation notice to District Collector to expedite ${currentStage}`);
  } else if (stageDelayDays > benchmarkSLA) {
    score += 20;
    factors.push({
      factor: 'Moderate SLA Breach',
      weight: '+20',
      detail: `${currentStage} pending for ${stageDelayDays} days (exceeds ${benchmarkSLA} days)`
    });
    recommendations.push(`Convene inter-departmental nodal review to clear ${currentStage} backlog`);
  }

  // 2. Active Legal Disputes & Court Stays
  const activeDisputes = item.activeDisputes || (item.legalIssues && item.legalIssues.length) || 0;
  const hasCourtStay = item.hasCourtStay || (item.status === 'LEGAL') || (item.legalIssues && item.legalIssues.some(l => l.status === 'Under Review'));

  if (hasCourtStay || activeDisputes >= 15) {
    score += 30;
    factors.push({
      factor: 'High Court / Tribunal Stay',
      weight: '+30',
      detail: `${activeDisputes} active dispute(s) registered under Section 3C / High Court writ`
    });
    recommendations.push('Deposit disputed compensation into Court Escrow Account to lift project stay');
  } else if (activeDisputes > 0) {
    score += 15;
    factors.push({
      factor: 'Active Objections Registered',
      weight: '+15',
      detail: `${activeDisputes} active objection(s) awaiting Land Acquisition Tribunal hearing`
    });
    recommendations.push('Expedite Competent Authority (CALA) Section 3C objection disposal hearing');
  }

  // 3. Compensation & DBT Disbursal Delays
  const dbtStatus = item.dbtStatus || '';
  const compensationPending = (item.budgetAllocatedCrores && item.budgetDisbursedCrores)
    ? (item.budgetAllocatedCrores - item.budgetDisbursedCrores)
    : 0;

  if (dbtStatus === 'IN_ESCROW' || dbtStatus === 'DELAYED') {
    score += 20;
    factors.push({
      factor: 'Compensation Disbursal Halted',
      weight: '+20',
      detail: 'PFMS DBT payment blocked or in escrow awaiting beneficiary KYC / verification'
    });
    recommendations.push('Deploy Mobile Aadhaar KYC verification camps for displaced beneficiaries');
  } else if (compensationPending > 150) {
    score += 15;
    factors.push({
      factor: 'Substantial Compensation Backlog',
      weight: '+15',
      detail: `₹${compensationPending.toFixed(1)} Cr pending disbursal across corridor landowners`
    });
    recommendations.push('Release next tranche of RFCTLARR 2013 solatium through Central Ministry portal');
  }

  // 4. Missing Statutory Documentation
  if (item.missingDocuments && item.missingDocuments.length > 0) {
    score += 15;
    factors.push({
      factor: 'Missing Statutory Documents',
      weight: '+15',
      detail: `Missing: ${item.missingDocuments.join(', ')}`
    });
    recommendations.push('Instruct Tehsildar to verify and upload 14-digit ULPIN Cadastral Record');
  }

  // Cap score between 0 and 100
  score = Math.min(100, Math.max(0, score));

  // Determine Tier
  let tier = 'LOW';
  let tierColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  if (score >= RISK_THRESHOLDS.CRITICAL_MIN) {
    tier = 'CRITICAL';
    tierColor = 'text-red-700 bg-red-50 border-red-300';
  } else if (score >= RISK_THRESHOLDS.MEDIUM_MAX) {
    tier = 'HIGH';
    tierColor = 'text-rose-700 bg-rose-50 border-rose-300';
  } else if (score >= RISK_THRESHOLDS.LOW_MAX) {
    tier = 'MEDIUM';
    tierColor = 'text-amber-800 bg-amber-50 border-amber-300';
  }

  return {
    score,
    tier,
    tierColor,
    factors,
    recommendations: recommendations.length > 0 ? recommendations : ['Normal statutory progression. Continue standard quarterly drone monitoring.']
  };
}
