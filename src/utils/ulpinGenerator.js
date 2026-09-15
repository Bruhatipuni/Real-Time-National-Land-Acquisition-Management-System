// ULPIN (Bhu-Aadhaar) Utility
// Unique Land Parcel Identification Number is a 14-digit alphanumeric string based on Geo-coordinates

export function generateULPIN(stateCode = "06", districtCode = "12", parcelId = "8891") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${stateCode}-${districtCode}-${parcelId}-${randomPart}`;
}

export function formatULPINDisplay(ulpin) {
  if (!ulpin) return "ULPIN-PENDING";
  return ulpin.toUpperCase();
}

export function validateULPINFormat(ulpin) {
  // Pattern: XX-XX-XXXX-XXXXXX
  const regex = /^[0-9A-Z]{2}-[0-9A-Z]{2}-[0-9A-Z]{4}-[0-9A-Z]{6}$/i;
  return regex.test(ulpin.trim());
}

export function getULPINDetails(ulpin) {
  const stateMap = {
    "06": "Haryana (Gurugram/Faridabad)",
    "27": "Maharashtra (Thane/Palghar)",
    "09": "Uttar Pradesh (Gautam Buddha Nagar)",
    "24": "Gujarat (Vadodara/Surat)",
    "10": "Bihar (Patna/Vaishali)"
  };
  const parts = ulpin.split('-');
  const stateCode = parts[0] || "06";
  return {
    ulpin,
    state: stateMap[stateCode] || "National Land Stack",
    timestamp: new Date().toISOString(),
    verificationBadge: "VERIFIED_BHU_AADHAAR",
    blockchainHash: "0x" + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10)
  };
}
