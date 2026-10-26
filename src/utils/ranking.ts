/**
 * SoilFit – Transparent Agronomic Ranking Algorithm
 *
 * Evaluates Philippine crops strictly according to Soil Suitability (Soil pH and Soil Electrical Conductivity EC).
 *
 * Sorting Rules (Strict Agronomic Hierarchy):
 * 1. Primary criterion: Higher soil suitability percentage ranks first.
 * 2. Secondary criterion (Tie-breaker only): If suitability percentages are exactly equal,
 *    the crop with the shorter documented time to harvest/maturity ranks first.
 * 3. Final tie-breaker: If both suitability and maturity duration are equal, sort alphabetically by crop name.
 *
 * Growth speed NEVER alters or influences the soil suitability percentage.
 */

import { CropCategory, CropData, PHILIPPINE_CROPS } from '../data/crops';

export interface ComparisonDetail {
  userValue: number;
  userFormatted: string;
  cropRange: string;
  status: 'optimal' | 'acceptable' | 'stress' | 'critical';
  statusLabel: string;
  comment: string;
}

export interface RankedCropResult {
  rank: number;
  overallRank: number; // Rank across all crops
  crop: CropData;
  overallScore: number; // 0 – 100 (%) Soil Suitability
  phScore: number;      // 0 – 100 (%)
  ecScore: number;      // 0 – 100 (%)
  suitabilityGrade: 'Highly Suitable' | 'Suitable' | 'Marginal' | 'Unsuitable';
  rankExplanation: string;
  phComparison: ComparisonDetail;
  ecComparison: ComparisonDetail;
  isEligible: boolean;
}

export interface AnalysisSummary {
  inputPh: number;
  inputEcMicroS: number;
  convertedEcDsM: number;
  totalCropsEvaluated: number;
  qualifyingCount: number;
  results: RankedCropResult[];
  categoryCounts: {
    'All Crops': number;
    'Garden Crops': number;
    'Farmland Crops': number;
    'Fruit Crops': number;
  };
  soilClassification: {
    phCategory: string;
    ecCategory: string;
  };
}

/**
 * Calculates pH Suitability Score (0 to 100)
 */
export function calculatePhScore(userPh: number, crop: CropData): { score: number; detail: ComparisonDetail } {
  const { minPh, maxPh, optimalMinPh, optimalMaxPh } = crop;
  let score = 0;
  let status: ComparisonDetail['status'] = 'critical';
  let statusLabel = '';
  let comment = '';

  if (userPh >= optimalMinPh && userPh <= optimalMaxPh) {
    score = 100;
    status = 'optimal';
    statusLabel = 'Optimal pH';
    comment = `Measured soil pH ${userPh.toFixed(1)} falls squarely within the preferred range (${optimalMinPh.toFixed(1)}–${optimalMaxPh.toFixed(1)}), maximizing nutrient availability without root stress.`;
  } else if (userPh >= minPh && userPh < optimalMinPh) {
    // Tolerable acidic side: linearly interpolate from 50 (at minPh) to 99 (near optimalMinPh)
    const factor = (userPh - minPh) / (optimalMinPh - minPh);
    score = Math.round(50 + 49 * factor);
    status = 'acceptable';
    statusLabel = 'Slightly Acidic for Crop';
    comment = `Measured soil pH ${userPh.toFixed(1)} is within the tolerable range (${minPh.toFixed(1)}–${maxPh.toFixed(1)}) but below optimal (${optimalMinPh.toFixed(1)}–${optimalMaxPh.toFixed(1)}). May benefit from mild liming or organic compost.`;
  } else if (userPh > optimalMaxPh && userPh <= maxPh) {
    // Tolerable alkaline side: linearly interpolate from 99 (near optimalMaxPh) down to 50 (at maxPh)
    const factor = (maxPh - userPh) / (maxPh - optimalMaxPh);
    score = Math.round(50 + 49 * factor);
    status = 'acceptable';
    statusLabel = 'Slightly Alkaline for Crop';
    comment = `Measured soil pH ${userPh.toFixed(1)} is tolerated (${minPh.toFixed(1)}–${maxPh.toFixed(1)}) but above optimal (${optimalMinPh.toFixed(1)}–${optimalMaxPh.toFixed(1)}). Micronutrient uptake (iron, zinc) may be slightly reduced.`;
  } else if (userPh < minPh) {
    // Acidic deficit
    const deficit = minPh - userPh;
    if (deficit <= 1.0) {
      score = Math.max(0, Math.round(50 - 50 * (deficit / 1.0)));
      status = 'stress';
      statusLabel = 'Acid Stress';
      comment = `Measured soil pH ${userPh.toFixed(1)} is below the minimum threshold of ${minPh.toFixed(1)}. Risk of aluminum/manganese toxicity and phosphorus fixation.`;
    } else {
      score = 0;
      status = 'critical';
      statusLabel = 'Severe Acid Toxicity';
      comment = `Measured soil pH ${userPh.toFixed(1)} is critically acidic for ${crop.commonName} (minimum required is ${minPh.toFixed(1)}). Survival is severely impaired without agricultural lime.`;
    }
  } else {
    // Alkaline excess
    const excess = userPh - maxPh;
    if (excess <= 1.0) {
      score = Math.max(0, Math.round(50 - 50 * (excess / 1.0)));
      status = 'stress';
      statusLabel = 'Alkaline Stress';
      comment = `Measured soil pH ${userPh.toFixed(1)} exceeds maximum tolerated pH of ${maxPh.toFixed(1)}. Risk of nutrient lockup and chlorosis.`;
    } else {
      score = 0;
      status = 'critical';
      statusLabel = 'Severe Alkalinity';
      comment = `Measured soil pH ${userPh.toFixed(1)} is excessively alkaline for ${crop.commonName} (maximum tolerated is ${maxPh.toFixed(1)}).`;
    }
  }

  return {
    score,
    detail: {
      userValue: userPh,
      userFormatted: `pH ${userPh.toFixed(1)}`,
      cropRange: `Optimal: ${optimalMinPh.toFixed(1)}–${optimalMaxPh.toFixed(1)} (Tolerable: ${minPh.toFixed(1)}–${maxPh.toFixed(1)})`,
      status,
      statusLabel,
      comment
    }
  };
}

/**
 * Calculates Electrical Conductivity / Salinity Score (0 to 100)
 * Uses the Maas-Hoffman empirical yield reduction model (FAO Irrigation Paper 29).
 */
export function calculateEcScore(userEcDsM: number, crop: CropData): { score: number; detail: ComparisonDetail } {
  const threshold = crop.ecThresholdDsM;
  const slope = crop.yieldDeclineSlopePercent ?? 10.0;
  let score = 100;
  let status: ComparisonDetail['status'] = 'optimal';
  let statusLabel = 'Safe / Non-Saline';
  let comment = '';

  const userEcMicroS = Math.round(userEcDsM * 1000);

  // If EC data is unverified or unavailable, do not penalize
  if (threshold === undefined) {
    return {
      score: 100,
      detail: {
        userValue: userEcDsM,
        userFormatted: `${userEcMicroS.toLocaleString()} µS/cm (${userEcDsM.toFixed(2)} dS/m)`,
        cropRange: 'Specific EC threshold unavailable in literature',
        status: 'optimal',
        statusLabel: 'Data Unavailable (Unpenalized)',
        comment: `Documented salinity threshold is unavailable for ${crop.commonName}. Suitability is assessed primarily by soil reaction (pH).`
      }
    };
  }

  const thresholdMicroS = Math.round(threshold * 1000);

  if (userEcDsM <= threshold) {
    score = 100;
    status = 'optimal';
    statusLabel = 'No Salinity Stress';
    comment = `Measured soil EC (${userEcMicroS.toLocaleString()} µS/cm = ${userEcDsM.toFixed(2)} dS/m) is below the threshold of ${threshold.toFixed(1)} dS/m (${thresholdMicroS.toLocaleString()} µS/cm). 100% potential yield expected regarding salinity.`;
  } else {
    const excess = userEcDsM - threshold;
    const estimatedLoss = excess * slope;
    score = Math.max(0, Math.round(100 - estimatedLoss));

    if (score >= 75) {
      status = 'acceptable';
      statusLabel = 'Mild Salinity Exposure';
      comment = `Measured soil EC (${userEcDsM.toFixed(2)} dS/m) exceeds threshold (${threshold.toFixed(1)} dS/m). Maas-Hoffman equation projects ~${Math.round(estimatedLoss)}% yield depression at ${slope}% per dS/m.`;
    } else if (score >= 40) {
      status = 'stress';
      statusLabel = 'Moderate Salinity Stress';
      comment = `Measured soil EC (${userEcDsM.toFixed(2)} dS/m) significantly exceeds threshold (${threshold.toFixed(1)} dS/m). Estimated ~${Math.round(estimatedLoss)}% yield depression. Leaching with fresh irrigation water advised.`;
    } else {
      status = 'critical';
      statusLabel = 'Severe Salinity Hazard';
      comment = `Measured soil EC (${userEcDsM.toFixed(2)} dS/m) is critically high for ${crop.commonName}. Projected yield loss exceeds ${Math.min(100, Math.round(estimatedLoss))}%. Severe root osmoshock and leaf necrosis likely.`;
    }
  }

  return {
    score,
    detail: {
      userValue: userEcDsM,
      userFormatted: `${userEcMicroS.toLocaleString()} µS/cm (${userEcDsM.toFixed(2)} dS/m)`,
      cropRange: `Threshold: ${threshold.toFixed(1)} dS/m (${thresholdMicroS.toLocaleString()} µS/cm) [${crop.ecSalinityRating}]`,
      status,
      statusLabel,
      comment
    }
  };
}

/**
 * Classifies soil chemistry context according to Philippine BSWM and FAO classification benchmarks
 */
export function classifySoil(ph: number, ecMicroS: number): { phCategory: string; ecCategory: string } {
  let phCategory = '';
  if (ph < 4.5) phCategory = 'Extremely Acidic';
  else if (ph < 5.2) phCategory = 'Very Strongly Acidic';
  else if (ph < 6.0) phCategory = 'Moderately Acidic';
  else if (ph <= 6.8) phCategory = 'Slightly Acidic (Favorable)';
  else if (ph <= 7.2) phCategory = 'Neutral (Optimal for most crops)';
  else if (ph <= 7.8) phCategory = 'Slightly Alkaline';
  else if (ph <= 8.5) phCategory = 'Moderately Alkaline';
  else phCategory = 'Strongly Alkaline / Calcareous';

  let ecCategory = '';
  const ecDsM = ecMicroS / 1000;
  if (ecDsM < 0.75) ecCategory = 'Non-Saline (Normal agricultural soil, suitable for all crops)';
  else if (ecDsM <= 1.5) ecCategory = 'Very Low Salinity (Safe for most crops; sensitive species may notice mild effects)';
  else if (ecDsM <= 3.0) ecCategory = 'Slightly Saline (Yields of sensitive crops restricted)';
  else if (ecDsM <= 6.0) ecCategory = 'Moderately Saline (Only salt-tolerant crops yield well)';
  else ecCategory = 'Strongly Saline (Unsuitable for most agricultural crops; requires reclamation)';

  return { phCategory, ecCategory };
}

/**
 * Evaluates and ranks crops.
 *
 * STRICT AGRI-RANKING ORDER:
 * 1. Primary: Higher soil suitability score ranks first.
 * 2. Secondary (Tie-breaker ONLY): Shorter time to harvest ranks first among equal suitability.
 * 3. Final tie-breaker: Alphabetical by common name.
 */
export function rankCrops(
  userPh: number,
  userEcMicroS: number,
  categoryFilter: CropCategory | 'All Crops' = 'All Crops'
): AnalysisSummary {
  const convertedEcDsM = Number((userEcMicroS / 1000).toFixed(3));
  const soilClassification = classifySoil(userPh, userEcMicroS);

  const evaluated: RankedCropResult[] = PHILIPPINE_CROPS.map((crop) => {
    const phResult = calculatePhScore(userPh, crop);
    const ecResult = calculateEcScore(convertedEcDsM, crop);

    // Weighted composite score: 55% pH suitability + 45% EC salinity tolerance
    const rawScore = 0.55 * phResult.score + 0.45 * ecResult.score;
    const overallScore = Number(rawScore.toFixed(1));

    // Determine suitability grade
    let suitabilityGrade: RankedCropResult['suitabilityGrade'] = 'Unsuitable';
    if (overallScore >= 85) suitabilityGrade = 'Highly Suitable';
    else if (overallScore >= 70) suitabilityGrade = 'Suitable';
    else if (overallScore >= 45) suitabilityGrade = 'Marginal';
    else suitabilityGrade = 'Unsuitable';

    // A crop is considered viable/eligible if overall score >= 20 and neither pH nor EC is total zero failure
    const isEligible = overallScore >= 20 && phResult.score > 0 && ecResult.score > 0;

    // Generate concise explanation strictly focused on soil chemistry suitability
    let rankExplanation = '';
    const thresholdDesc = crop.ecThresholdDsM !== undefined ? `${crop.ecThresholdDsM.toFixed(1)} dS/m` : 'safe';

    if (phResult.detail.status === 'optimal' && ecResult.detail.status === 'optimal') {
      rankExplanation = `Soil match is optimal (${overallScore}%): measured pH ${userPh.toFixed(1)} fits ideal crop range (${crop.optimalMinPh.toFixed(1)}–${crop.optimalMaxPh.toFixed(1)}), and EC (${convertedEcDsM.toFixed(2)} dS/m) is safely below the ${thresholdDesc} threshold with 0% salt stress.`;
    } else if (phResult.detail.status === 'optimal' && ecResult.detail.status !== 'optimal') {
      rankExplanation = `Soil pH ${userPh.toFixed(1)} is ideal, but elevated EC (${convertedEcDsM.toFixed(2)} dS/m vs ${thresholdDesc} threshold) applies an estimated ${Math.round(100 - ecResult.score)}% salinity stress penalty, yielding ${overallScore}% suitability.`;
    } else if (phResult.detail.status !== 'optimal' && ecResult.detail.status === 'optimal') {
      rankExplanation = `EC is fully safe (0% salinity penalty), but soil pH ${userPh.toFixed(1)} deviates slightly from optimum (${crop.optimalMinPh.toFixed(1)}–${crop.optimalMaxPh.toFixed(1)}), scoring ${phResult.score}% on soil reaction for a ${overallScore}% suitability score.`;
    } else {
      rankExplanation = `Both soil pH (${phResult.score}% match) and salinity (${ecResult.score}% match) impose agronomic constraints, resulting in a ${overallScore}% soil suitability score.`;
    }

    return {
      rank: 0,
      overallRank: 0,
      crop,
      overallScore,
      phScore: phResult.score,
      ecScore: ecResult.score,
      suitabilityGrade,
      rankExplanation,
      phComparison: phResult.detail,
      ecComparison: ecResult.detail,
      isEligible
    };
  });

  // Filter only viable/eligible crops
  const qualifying = evaluated.filter((item) => item.isEligible);

  // Count viable crops per category
  const categoryCounts = {
    'All Crops': qualifying.length,
    'Garden Crops': qualifying.filter((item) => item.crop.category === 'Garden Crops').length,
    'Farmland Crops': qualifying.filter((item) => item.crop.category === 'Farmland Crops').length,
    'Fruit Crops': qualifying.filter((item) => item.crop.category === 'Fruit Crops').length
  };

  // STRICT SORTING ALGORITHM:
  // 1. Primary: Higher soil suitability percentage ranks first.
  // 2. Secondary: If suitability percentages are equal, faster-growing crop (shorter time to harvest) ranks first.
  // 3. Final tie-breaker: Alphabetical by common name.
  qualifying.sort((a, b) => {
    // Primary criterion: Soil suitability score descending
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }

    // Secondary criterion (TIE-BREAKER ONLY): Shorter time to harvest ranks first
    const aDays = a.crop.daysToHarvestTypical ?? 999999;
    const bDays = b.crop.daysToHarvestTypical ?? 999999;
    if (aDays !== bDays) {
      return aDays - bDays;
    }

    // Final tie-breaker: Alphabetical by common name
    return a.crop.commonName.localeCompare(b.crop.commonName);
  });

  // Assign overall ranks across all qualifying crops
  qualifying.forEach((item, index) => {
    item.overallRank = index + 1;
    item.rank = index + 1;
  });

  // Apply Category Filter if specified
  let filteredResults = qualifying;
  if (categoryFilter !== 'All Crops') {
    filteredResults = qualifying.filter((item) => item.crop.category === categoryFilter);
    // Re-index ranks 1..N within the filtered category while preserving exact suitability order
    filteredResults = filteredResults.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }

  return {
    inputPh: userPh,
    inputEcMicroS: userEcMicroS,
    convertedEcDsM,
    totalCropsEvaluated: PHILIPPINE_CROPS.length,
    qualifyingCount: filteredResults.length,
    results: filteredResults,
    categoryCounts,
    soilClassification
  };
}
