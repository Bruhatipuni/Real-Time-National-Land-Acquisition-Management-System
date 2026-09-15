// LARR 2013 & National Highways Act Sec 3G Compensation Calculation Engine

export function calculateLARRCompensation({
  areaHectares,
  baseRatePerHectare,
  isRural = true,
  distanceFromUrbanKm = 15,
  structureAssetsValue = 0,
  treeCropAssetsValue = 0,
  monthsSinceNotification = 6
}) {
  // 1. Base Market Value
  const baseLandValue = areaHectares * baseRatePerHectare;

  // 2. Rural Multiplier Factor (RFCTLARR Act 2013: 1.0 for urban up to 2.0 for rural > 30km)
  let multiplier = 1.0;
  if (isRural) {
    if (distanceFromUrbanKm > 30) multiplier = 2.0;
    else if (distanceFromUrbanKm > 10) multiplier = 1.5;
    else multiplier = 1.25;
  }

  // 3. Multiplied Land Value
  const multipliedLandValue = baseLandValue * multiplier;

  // 4. Total Basic Land + Assets
  const basicCompensation = multipliedLandValue + structureAssetsValue + treeCropAssetsValue;

  // 5. Solatium (100% compulsory statutory allowance under LARR 2013)
  const solatium = basicCompensation * 1.0;

  // 6. Additional Interest / Additional Amount (12% per annum under Sec 30(2))
  const interestRatePerAnnum = 0.12;
  const interestAmount = baseLandValue * (interestRatePerAnnum * (monthsSinceNotification / 12));

  // 7. Grand Total Award
  const totalAwardAmount = basicCompensation + solatium + interestAmount;

  return {
    areaHectares,
    baseLandValue: Math.round(baseLandValue),
    multiplier,
    multipliedLandValue: Math.round(multipliedLandValue),
    structureAssetsValue: Math.round(structureAssetsValue),
    treeCropAssetsValue: Math.round(treeCropAssetsValue),
    basicCompensation: Math.round(basicCompensation),
    solatium: Math.round(solatium),
    interestAmount: Math.round(interestAmount),
    totalAwardAmount: Math.round(totalAwardAmount),
    formattedAwardLakhs: (totalAwardAmount / 100000).toFixed(2) + " Lakhs",
    formattedAwardCrores: (totalAwardAmount / 10000000).toFixed(2) + " Crores"
  };
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
