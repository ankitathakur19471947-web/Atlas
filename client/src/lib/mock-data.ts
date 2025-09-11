// Mock data for demonstration purposes - this would normally come from the backend
export const mockVillageData = [
  {
    name: "Gondia",
    coordinates: [21.1558, 79.0882],
    population: 15420,
    tribalPopulation: 12000,
    fraClaimsGranted: 85,
    fraClaimsPending: 23,
    assets: {
      ponds: 3,
      farms: 12,
      forestPatches: 2
    }
  },
  {
    name: "Arjuni", 
    coordinates: [21.1458, 79.1082],
    population: 12340,
    tribalPopulation: 9800,
    fraClaimsGranted: 67,
    fraClaimsPending: 15,
    assets: {
      ponds: 2,
      farms: 8,
      forestPatches: 3
    }
  }
];

export const mockSchemeRecommendations = [
  {
    scheme: "Jal Jeevan Mission",
    villages: ["Gondia", "Arjuni", "Tirora"],
    priority: "High",
    description: "Low water index detected in 15 villages. Immediate water infrastructure development recommended.",
    beneficiaries: 856
  },
  {
    scheme: "PM-Kisan Scheme", 
    villages: ["Arjuni", "Deori"],
    priority: "Medium",
    description: "Agricultural land identified without active scheme enrollment. Direct benefit transfer opportunity.",
    beneficiaries: 234
  },
  {
    scheme: "MGNREGA Plantation",
    villages: ["Tirora", "Sadak-Arjuni"],
    priority: "Medium", 
    description: "Degraded forest areas detected. Tree plantation and soil conservation work recommended.",
    beneficiaries: 445
  }
];

export const mockDashboardStats = {
  totalFraClaims: 1247,
  grantedClaims: 847,
  pendingClaims: 245,
  rejectedClaims: 89,
  underReviewClaims: 66,
  totalAssets: 342,
  totalRecommendations: 89,
  activeVillages: 67,
  claimsByStatus: {
    granted: 847,
    pending: 245, 
    underReview: 66,
    rejected: 89
  },
  assetsByType: {
    ponds: 156,
    farms: 98,
    forestPatches: 67,
    settlements: 21
  }
};
