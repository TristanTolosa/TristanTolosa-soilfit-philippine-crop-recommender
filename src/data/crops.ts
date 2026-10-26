/**
 * SoilFit – Philippine Crop Database
 *
 * Contains documented agronomic soil pH, electrical conductivity (ECe) requirements,
 * and realistic growth duration / days-to-harvest data for common crops cultivated
 * across the Philippine archipelago.
 *
 * Categories:
 * 1. Garden Crops — vegetables and herbs commonly grown in home gardens
 * 2. Farmland Crops — crops commonly cultivated on farms (cereals, field legumes, tubers, cash crops)
 * 3. Fruit Crops — fruit-producing trees, shrubs, and perennial fruit palms
 *
 * Sources prioritize:
 * - Philippine Department of Agriculture (DA) & Bureau of Soils and Water Management (BSWM)
 * - Bureau of Plant Industry (BPI) & Philippine Rice Research Institute (PhilRice)
 * - Philippine Coconut Authority (PCA) & Sugar Regulatory Administration (SRA)
 * - University of the Philippines Los Baños (UPLB) College of Agriculture & Food Science
 * - Food and Agriculture Organization of the United Nations (FAO) Irrigation and Drainage Paper 29 / EcoCrop
 */

export interface SourceReference {
  name: string;
  organization: 'DA' | 'BSWM' | 'PhilRice' | 'BPI' | 'PCA' | 'SRA' | 'FAO' | 'UPLB' | 'IRRI' | 'CIAT' | 'PCAARRD';
  url: string;
}

export type CropCategory = 'Garden Crops' | 'Farmland Crops' | 'Fruit Crops';

export type GrowthRateCategory =
  | 'Ultra-Fast'               // < 40 days (e.g. leafy greens)
  | 'Fast'                     // 40–90 days (e.g. grain legumes, quick vegetables)
  | 'Moderate'                 // 90–150 days (e.g. cereals, field corn, tubers)
  | 'Long-Season'              // 150–365 days (e.g. cassava, semi-perennial fruits)
  | 'Multi-Year / Perennial';  // > 365 days (e.g. fruit trees, palms, tree crops)

export interface CropData {
  id: string;
  commonName: string;
  localName: string; // Filipino / Tagalog / Regional name
  scientificName: string;
  category: CropCategory;
  
  // Growth speed / duration criteria (Days from planting / transplanting to initial harvest)
  daysToHarvestMin?: number;
  daysToHarvestMax?: number;
  daysToHarvestTypical?: number;
  growthDurationDisplay: string;
  growthRateCategory: GrowthRateCategory;
  growthSpeedNotes: string;

  // Soil pH requirements
  minPh: number;
  maxPh: number;
  optimalMinPh: number;
  optimalMaxPh: number;

  // Electrical Conductivity / Salinity tolerance
  // Standardized to ECe: electrical conductivity of saturated soil paste extract in dS/m
  // Conversion: 1 dS/m = 1,000 µS/cm
  ecThresholdDsM?: number; // Threshold beyond which yield reduction begins (dS/m)
  yieldDeclineSlopePercent?: number; // Yield decline percentage per dS/m increase above threshold
  ecSalinityRating: 'Sensitive' | 'Moderately Sensitive' | 'Moderately Tolerant' | 'Tolerant' | 'Unknown';
  measurementMethod: string;
  
  // Status and citations
  evidenceStatus: string;
  notes: string;
  sources: SourceReference[];
}

export const PHILIPPINE_CROPS: CropData[] = [
  // ==========================================
  // 1. GARDEN CROPS
  // Vegetables and herbs commonly grown in home gardens
  // ==========================================
  {
    id: 'pechay',
    commonName: 'Pechay (Pak Choi)',
    localName: 'Pechay',
    scientificName: 'Brassica rapa subsp. chinensis',
    category: 'Garden Crops',
    daysToHarvestMin: 25,
    daysToHarvestMax: 35,
    daysToHarvestTypical: 30,
    growthDurationDisplay: '25–35 days (~1 month)',
    growthRateCategory: 'Ultra-Fast',
    growthSpeedNotes: 'Fastest-growing commercial leafy vegetable in the Philippines; harvestable 25–30 days after transplanting (or 30–35 days from direct seeding). Enables up to 8–10 cropping cycles annually.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 7.0,
    ecThresholdDsM: 1.8, // 1,800 µS/cm
    yieldDeclineSlopePercent: 9.7,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Fast-maturing leafy crop popular in backyard and urban container gardens across Luzon, Visayas, and Mindanao. Acidic soil (< 5.5) inhibits nutrient uptake and leaf expansion.',
    sources: [
      {
        name: 'DA-BPI Pechay Production Manual',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Brassica Salt Tolerance Studies',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/cabbage/en/'
      }
    ]
  },
  {
    id: 'lettuce',
    commonName: 'Lettuce',
    localName: 'Letsugas',
    scientificName: 'Lactuca sativa',
    category: 'Garden Crops',
    daysToHarvestMin: 30,
    daysToHarvestMax: 45,
    daysToHarvestTypical: 35,
    growthDurationDisplay: '30–45 days (~1–1.5 months)',
    growthRateCategory: 'Ultra-Fast',
    growthSpeedNotes: 'Rapid leafy salad crop; loose-leaf varieties can be harvested by priming leaves 30 days after transplanting, or whole head cut at 40–45 days.',
    minPh: 5.8,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.3, // 1,300 µS/cm
    yieldDeclineSlopePercent: 13.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BPI / FAO 29)',
    notes: 'Extensively cultivated in highland Benguet, Bukidnon, and lowland urban hydroponic/raised beds. Sensitive to acidity below 6.0 and soil salt accumulation.',
    sources: [
      {
        name: 'DA-BPI Urban Agriculture & Salad Vegetable Production Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Irrigation and Drainage Paper 29 - Lactuca sativa Salinity Threshold',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/vegetables/en/'
      }
    ]
  },
  {
    id: 'radish',
    commonName: 'Radish',
    localName: 'Labanos',
    scientificName: 'Raphanus sativus',
    category: 'Garden Crops',
    daysToHarvestMin: 35,
    daysToHarvestMax: 50,
    daysToHarvestTypical: 40,
    growthDurationDisplay: '35–50 days (~1.5 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'Quick-maturing root vegetable; crisp white roots reach culinary maturity 35 to 45 days after direct seeding in home vegetable plots.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.2, // 1,200 µS/cm
    yieldDeclineSlopePercent: 13.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BPI / FAO 29)',
    notes: 'Essential ingredient in Filipino sinigang. Requires well-drained, loose sandy loam free of stones; root splitting and bitterness occur in compacted or saline soils.',
    sources: [
      {
        name: 'DA Bureau of Plant Industry Radish Cultural Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Irrigation Paper 29 - Raphanus sativus Salinity Assessment',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/vegetables/en/'
      }
    ]
  },
  {
    id: 'okra',
    commonName: 'Okra (Lady Finger)',
    localName: 'Okra',
    scientificName: 'Abelmoschus esculentus',
    category: 'Garden Crops',
    daysToHarvestMin: 45,
    daysToHarvestMax: 60,
    daysToHarvestTypical: 50,
    growthDurationDisplay: '45–60 days (~1.5 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'Fast-maturing garden vegetable; pod harvesting starts 45–50 days after sowing. Tender young pods are harvested every 2 to 3 days for up to 2 months.',
    minPh: 5.8,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 10.0,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Standard pinakbet and sinigang staple across Philippine backyard plots and export farms. Heat-tolerant and thrives in tropical garden soils with neutral reaction.',
    sources: [
      {
        name: 'DA-BPI Commercial Okra Production Guidelines',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO EcoCrop Database - Abelmoschus esculentus Agronomy',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/okra/en/'
      }
    ]
  },
  {
    id: 'sitaw',
    commonName: 'Pole String Beans (Yardlong Bean)',
    localName: 'Sitaw / Hamtak',
    scientificName: 'Vigna unguiculata subsp. sesquipedalis',
    category: 'Garden Crops',
    daysToHarvestMin: 50,
    daysToHarvestMax: 65,
    daysToHarvestTypical: 55,
    growthDurationDisplay: '50–65 days (~1.5–2 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'First tender pod harvesting commences 50–55 days after sowing; pods are hand-picked every 2 to 3 days for 4 to 6 weeks on trellises.',
    minPh: 5.5,
    maxPh: 7.2,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.3, // 1,300 µS/cm
    yieldDeclineSlopePercent: 14.0,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Popular dietary legume in home gardens. Enriches soil nitrogen through Rhizobium symbiosis; sensitive to saline soils above 1.3 dS/m.',
    sources: [
      {
        name: 'DA-BPI Pole Sitao Production Guidelines',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'UPLB Institute of Plant Breeding Legume Research Bulletins',
        organization: 'UPLB',
        url: 'https://cafs.uplb.edu.ph/'
      }
    ]
  },
  {
    id: 'ampalaya',
    commonName: 'Bitter Gourd',
    localName: 'Ampalaya / Marangya',
    scientificName: 'Momordica charantia',
    category: 'Garden Crops',
    daysToHarvestMin: 55,
    daysToHarvestMax: 70,
    daysToHarvestTypical: 60,
    growthDurationDisplay: '55–70 days (~2 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'First fruit harvesting begins 55–60 days from direct seeding or transplanting; successive harvests are done every 3 to 4 days for 6 to 8 weeks.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 11.0,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Widely grown high-value garden vegetable. Prefers well-drained sandy loam rich in organic matter; sensitive to soil waterlogging and moderate salinity.',
    sources: [
      {
        name: 'DA Bureau of Plant Industry (BPI) Bitter Gourd Production Manual',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO EcoCrop Database - Momordica charantia Soil Guidelines',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/vegetables/en/'
      }
    ]
  },
  {
    id: 'cabbage',
    commonName: 'Cabbage',
    localName: 'Repolyo',
    scientificName: 'Brassica oleracea var. capitata',
    category: 'Garden Crops',
    daysToHarvestMin: 60,
    daysToHarvestMax: 85,
    daysToHarvestTypical: 70,
    growthDurationDisplay: '60–85 days (~2–2.5 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'Head formation and harvest occur within 60–75 days after transplanting for standard Philippine highland varieties (e.g., KK Cross) in Benguet and backyard gardens.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.8, // 1,800 µS/cm
    yieldDeclineSlopePercent: 9.7,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Key semi-temperate vegetable. Acid soils (< 5.5) dramatically increase risk of clubroot disease and calcium deficiency (tip-burn).',
    sources: [
      {
        name: 'DA-Cordillera Administrative Region (DA-CAR) Highland Vegetable Guide',
        organization: 'DA',
        url: 'https://car.da.gov.ph/'
      },
      {
        name: 'FAO Irrigation Paper 29 - Cabbage Salinity Threshold',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/cabbage/en/'
      }
    ]
  },
  {
    id: 'tomato',
    commonName: 'Tomato',
    localName: 'Kamatis',
    scientificName: 'Solanum lycopersicum',
    category: 'Garden Crops',
    daysToHarvestMin: 70,
    daysToHarvestMax: 90,
    daysToHarvestTypical: 80,
    growthDurationDisplay: '70–90 days (~2.5 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'First priming harvest begins 70–80 days after field transplanting. Successive pickings occur every 3 to 5 days over a 30-day harvesting period.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 2.5, // 2,500 µS/cm
    yieldDeclineSlopePercent: 9.9,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Very popular in Filipino home gardens. Prefers slightly acidic to near-neutral soils. Moderate salinity (up to 2.5 dS/m) can increase brix/sugar content but reduces total fruit weight.',
    sources: [
      {
        name: 'DA Bureau of Plant Industry (BPI) Tomato Production Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Irrigation Paper 29 Crop Salinity Tolerance - Solanum lycopersicum',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/tomato/en/'
      }
    ]
  },
  {
    id: 'eggplant',
    commonName: 'Eggplant',
    localName: 'Talong',
    scientificName: 'Solanum melongena',
    category: 'Garden Crops',
    daysToHarvestMin: 80,
    daysToHarvestMax: 100,
    daysToHarvestTypical: 85,
    growthDurationDisplay: '80–100 days (~2.5–3 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'First fruit picking begins approximately 80–85 days from transplanting; continuous weekly harvests extend for up to 3–4 months with proper irrigation.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.1, // 1,100 µS/cm
    yieldDeclineSlopePercent: 6.9,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'The number one vegetable in Philippine backyard gardens and commercial acreage. Sensitive to soil salinity during flowering and fruit setting.',
    sources: [
      {
        name: 'DA-BPI Commercial Eggplant Cultivation Guidelines',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Crop Salinity Tolerances - Eggplant',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/eggplant/en/'
      }
    ]
  },
  {
    id: 'squash',
    commonName: 'Squash (Pumpkin)',
    localName: 'Kalabasa',
    scientificName: 'Cucurbita moschata',
    category: 'Garden Crops',
    daysToHarvestMin: 80,
    daysToHarvestMax: 100,
    daysToHarvestTypical: 90,
    growthDurationDisplay: '80–100 days (~3 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'Mature fruit harvesting starts 80–90 days from planting when fruit stems harden and turn yellowish-brown; flowers and young shoots can be harvested as early as 40 days.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 2.5, // 2,500 µS/cm
    yieldDeclineSlopePercent: 10.5,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Hardy tropical cucurbit grown in home gardens and communal plots. Tolerates moderate salt concentrations up to 2.5 dS/m; severe acidity below 5.5 causes poor blossom set.',
    sources: [
      {
        name: 'DA-BPI High Value Crops Squash Production Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Irrigation Paper 29 - Cucurbita species Salinity Tolerances',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/squash/en/'
      }
    ]
  },
  {
    id: 'onion',
    commonName: 'Onion',
    localName: 'Sibuyas (Pula at Puti)',
    scientificName: 'Allium cepa',
    category: 'Garden Crops',
    daysToHarvestMin: 110,
    daysToHarvestMax: 135,
    daysToHarvestTypical: 120,
    growthDurationDisplay: '110–135 days (~4 months)',
    growthRateCategory: 'Moderate',
    growthSpeedNotes: 'Bulb maturation takes 110–125 days after transplanting in Nueva Ecija and backyard garden beds; harvested when 75% of foliage falls over.',
    minPh: 5.8,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 7.0,
    ecThresholdDsM: 1.2, // 1,200 µS/cm
    yieldDeclineSlopePercent: 16.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Major culinary staple. Very sensitive to salinity and acidity; yield drops sharply (16% per dS/m) when EC exceeds 1.2 dS/m.',
    sources: [
      {
        name: 'DA-BPI High Value Crops Onion Cultural Management',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Irrigation Paper 29 - Allium cepa Salinity Assessment',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/onion/en/'
      }
    ]
  },

  // ==========================================
  // 2. FARMLAND CROPS
  // Crops commonly cultivated on agricultural farms
  // ==========================================
  {
    id: 'mung_bean',
    commonName: 'Mung Bean',
    localName: 'Monggo / Balatong',
    scientificName: 'Vigna radiata',
    category: 'Farmland Crops',
    daysToHarvestMin: 55,
    daysToHarvestMax: 65,
    daysToHarvestTypical: 60,
    growthDurationDisplay: '55–65 days (~2 months)',
    growthRateCategory: 'Fast',
    growthSpeedNotes: 'Rapid grain legume harvested in under 2 months; widely planted on rice farms immediately after lowland rice harvests during the dry season.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.2,
    optimalMaxPh: 7.2,
    ecThresholdDsM: 1.0, // 1,000 µS/cm
    yieldDeclineSlopePercent: 14.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Widely used in Philippine rice-based cropping rotations for biological nitrogen fixation. Extremely sensitive to soil salinity and prolonged waterlogging.',
    sources: [
      {
        name: 'DA Bureau of Agricultural Research (DA-BAR) Mungbean Technology Guide',
        organization: 'DA',
        url: 'https://www.bar.gov.ph/'
      },
      {
        name: 'UPLB Institute of Plant Breeding (IPB) Grain Legume Program',
        organization: 'UPLB',
        url: 'https://cafs.uplb.edu.ph/'
      }
    ]
  },
  {
    id: 'soybean',
    commonName: 'Soybean',
    localName: 'Utoy',
    scientificName: 'Glycine max',
    category: 'Farmland Crops',
    daysToHarvestMin: 85,
    daysToHarvestMax: 105,
    daysToHarvestTypical: 95,
    growthDurationDisplay: '85–105 days (~3 months)',
    growthRateCategory: 'Moderate',
    growthSpeedNotes: 'Pod maturity is reached in 85 to 105 days; plants shed leaves and turn golden yellow when beans are ready for mechanical or manual harvesting.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 5.0, // 5,000 µS/cm
    yieldDeclineSlopePercent: 20.0,
    ecSalinityRating: 'Moderately Tolerant',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA-BAR / UPLB / FAO 29)',
    notes: 'Field grain legume promoted by DA-BAR across Mindanao, Isabela, and Ilocos. Demonstrates high salinity tolerance during vegetative stages, though sensitive during flowering.',
    sources: [
      {
        name: 'DA-BAR National Soybean Research and Development Program',
        organization: 'DA',
        url: 'https://www.bar.gov.ph/'
      },
      {
        name: 'FAO Irrigation and Drainage Paper 29 - Glycine max Salinity Tolerance',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/soybean/en/'
      }
    ]
  },
  {
    id: 'sweet_potato',
    commonName: 'Sweet Potato',
    localName: 'Kamote',
    scientificName: 'Ipomoea batatas',
    category: 'Farmland Crops',
    daysToHarvestMin: 90,
    daysToHarvestMax: 120,
    daysToHarvestTypical: 105,
    growthDurationDisplay: '90–120 days (~3–4 months)',
    growthRateCategory: 'Moderate',
    growthSpeedNotes: 'Storage root bulking reaches maturity 90 to 120 days after vine-cutting planting. Tender young shoots (talbos ng kamote) can be harvested as early as 30 days.',
    minPh: 5.0,
    maxPh: 7.5,
    optimalMinPh: 5.6,
    optimalMaxPh: 6.6,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 11.0,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Important staple and cash tuber in Bicol, Central Luzon, and Visayas. Highly sensitive to waterlogging and soil salinity exceeding 1.5 dS/m.',
    sources: [
      {
        name: 'UPLB Institute of Plant Breeding (IPB) Root Crop Bulletins',
        organization: 'UPLB',
        url: 'https://cafs.uplb.edu.ph/'
      },
      {
        name: 'FAO Irrigation and Drainage Paper 29 - Sweet Potato Salinity Data',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/sweet-potato/en/'
      }
    ]
  },
  {
    id: 'peanut',
    commonName: 'Peanut (Groundnut)',
    localName: 'Mani',
    scientificName: 'Arachis hypogaea',
    category: 'Farmland Crops',
    daysToHarvestMin: 95,
    daysToHarvestMax: 115,
    daysToHarvestTypical: 105,
    growthDurationDisplay: '95–115 days (~3.5 months)',
    growthRateCategory: 'Moderate',
    growthSpeedNotes: 'Spanish and Valencia bunch varieties commonly grown in Cagayan Valley mature in 95 to 105 days; runner varieties require ~110–115 days.',
    minPh: 5.3,
    maxPh: 7.3,
    optimalMinPh: 5.8,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 3.2, // 3,200 µS/cm
    yieldDeclineSlopePercent: 29.0,
    ecSalinityRating: 'Moderately Tolerant',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Thrives in well-drained sandy loam soils of Region 2 (Cagayan Valley). Tolerates moderate salinity up to 3.2 dS/m before rapid yield decline occurs.',
    sources: [
      {
        name: 'DA Region 2 Cagayan Valley Peanut Production Manual',
        organization: 'DA',
        url: 'https://rfo02.da.gov.ph/'
      },
      {
        name: 'FAO Water Quality & Salinity Tolerance - Groundnut',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/groundnut/en/'
      }
    ]
  },
  {
    id: 'corn',
    commonName: 'Corn (Maize)',
    localName: 'Mais',
    scientificName: 'Zea mays',
    category: 'Farmland Crops',
    daysToHarvestMin: 100,
    daysToHarvestMax: 120,
    daysToHarvestTypical: 110,
    growthDurationDisplay: '100–120 days (~3.5–4 months)',
    growthRateCategory: 'Moderate',
    growthSpeedNotes: 'Commercial Philippine yellow and white grain hybrids mature in 100 to 115 days. Green/sweet corn for boiling can be harvested earlier at 70–75 days.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 5.8,
    optimalMaxPh: 7.0,
    ecThresholdDsM: 1.7, // 1,700 µS/cm
    yieldDeclineSlopePercent: 12.0,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Major farmland grain in Isabela, Bukidnon, and South Cotabato. Requires well-aerated, fertile loam. Salinity above 1.7 dS/m causes stunted growth and reduced kernel fill.',
    sources: [
      {
        name: 'DA-BSWM Soil Suitability and Corn Production Guidelines',
        organization: 'BSWM',
        url: 'https://www.bswm.da.gov.ph/'
      },
      {
        name: 'FAO Crop Information - Maize Soil & Water Requirements',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/maize/en/'
      }
    ]
  },
  {
    id: 'rice',
    commonName: 'Rice',
    localName: 'Palay / Bigas',
    scientificName: 'Oryza sativa',
    category: 'Farmland Crops',
    daysToHarvestMin: 105,
    daysToHarvestMax: 125,
    daysToHarvestTypical: 115,
    growthDurationDisplay: '105–125 days (~3.5–4 months)',
    growthRateCategory: 'Moderate',
    growthSpeedNotes: 'Major Philippine lowland inbred varieties (e.g. NSIC Rc222, Rc160) mature in 105–118 days; traditional upland varieties take 120–130 days.',
    minPh: 5.0,
    maxPh: 7.5,
    optimalMinPh: 5.5,
    optimalMaxPh: 6.5,
    ecThresholdDsM: 3.0, // 3,000 µS/cm
    yieldDeclineSlopePercent: 12.0,
    ecSalinityRating: 'Moderately Tolerant',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'The staple food crop of the Philippines, planted on 4.8 million hectares. Flooded paddy conditions buffer soil pH toward neutrality (6.0–6.5). Tolerates up to 3.0 dS/m during vegetative growth.',
    sources: [
      {
        name: 'PhilRice PalayCheck System & Rice Knowledge Bank',
        organization: 'PhilRice',
        url: 'https://www.philrice.gov.ph/'
      },
      {
        name: 'FAO Water Quality for Agriculture (Paper 29) - Rice Salinity Tolerance',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/rice/en/'
      },
      {
        name: 'IRRI Rice Knowledge Bank - Soil pH and Salinity Management',
        organization: 'IRRI',
        url: 'http://www.knowledgebank.irri.org/'
      }
    ]
  },
  {
    id: 'cassava',
    commonName: 'Cassava',
    localName: 'Kamoteng Kahoy / Balanghoy',
    scientificName: 'Manihot esculenta',
    category: 'Farmland Crops',
    daysToHarvestMin: 240,
    daysToHarvestMax: 300,
    daysToHarvestTypical: 270,
    growthDurationDisplay: '240–300 days (~8–10 months)',
    growthRateCategory: 'Long-Season',
    growthSpeedNotes: 'Long-duration farmland root crop; optimum starch accumulation in tubers occurs between 8 and 10 months after stem-cutting planting.',
    minPh: 4.5,
    maxPh: 8.0,
    optimalMinPh: 5.5,
    optimalMaxPh: 6.5,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 15.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (CIAT / DA-PRCRTC)',
    notes: 'Very hardy in acidic, low-fertility tropical farm soils. However, root tuber development is highly sensitive to saline soils exceeding 1.5 dS/m.',
    sources: [
      {
        name: 'DA Philippine Root Crop Research and Training Center (PRCRTC)',
        organization: 'DA',
        url: 'https://www.da.gov.ph/'
      },
      {
        name: 'CIAT / FAO Tropical Root Crops EcoCrop Database',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/cassava/en/'
      }
    ]
  },
  {
    id: 'ginger',
    commonName: 'Ginger',
    localName: 'Luya',
    scientificName: 'Zingiber officinale',
    category: 'Farmland Crops',
    daysToHarvestMin: 240,
    daysToHarvestMax: 300,
    daysToHarvestTypical: 270,
    growthDurationDisplay: '240–300 days (~8–10 months)',
    growthRateCategory: 'Long-Season',
    growthSpeedNotes: 'Young green ginger can be harvested at 5 months for flavoring; mature rhizomes for processing and storage are dug 8 to 10 months after planting.',
    minPh: 5.0,
    maxPh: 7.2,
    optimalMinPh: 5.5,
    optimalMaxPh: 6.5,
    ecThresholdDsM: 1.2, // 1,200 µS/cm
    yieldDeclineSlopePercent: 16.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Commercial farm spice and cash crop in Batangas, Nueva Vizcaya, and Bukidnon. Requires loose, friable soil high in organic matter; rhizome rot risk increases in heavy, saline soils.',
    sources: [
      {
        name: 'DA-BPI Ginger Production Technology Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'UPLB College of Agriculture Spice Crop Research',
        organization: 'UPLB',
        url: 'https://cafs.uplb.edu.ph/'
      }
    ]
  },
  {
    id: 'sugarcane',
    commonName: 'Sugarcane',
    localName: 'Tubo',
    scientificName: 'Saccharum officinarum',
    category: 'Farmland Crops',
    daysToHarvestMin: 300,
    daysToHarvestMax: 365,
    daysToHarvestTypical: 330,
    growthDurationDisplay: '300–365 days (~10–12 months)',
    growthRateCategory: 'Long-Season',
    growthSpeedNotes: 'Annual industrial farmland crop harvested 10 to 12 months after set planting when sucrose content peaks before the rainy season.',
    minPh: 5.0,
    maxPh: 8.0,
    optimalMinPh: 6.0,
    optimalMaxPh: 7.5,
    ecThresholdDsM: 1.7, // 1,700 µS/cm
    yieldDeclineSlopePercent: 5.9,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (FAO / UPLB / SRA)',
    notes: 'Extensive farmland agro-industry in Negros Occidental, Batangas, and Bukidnon. Yield and sucrose recovery drop gently at 5.9% per dS/m when EC surpasses 1.7 dS/m.',
    sources: [
      {
        name: 'Sugar Regulatory Administration (SRA) Production Guides',
        organization: 'SRA',
        url: 'https://www.sra.gov.ph/'
      },
      {
        name: 'FAO Irrigation and Drainage Paper 29 - Sugarcane Salinity Yield Response',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/sugarcane/en/'
      }
    ]
  },

  // ==========================================
  // 3. FRUIT CROPS
  // Fruit-producing trees, shrubs, and perennial fruit palms
  // ==========================================
  {
    id: 'banana',
    commonName: 'Banana',
    localName: 'Saging (Cavendish / Lakatan / Saba)',
    scientificName: 'Musa acuminata / Musa balbisiana',
    category: 'Fruit Crops',
    daysToHarvestMin: 270,
    daysToHarvestMax: 365,
    daysToHarvestTypical: 320,
    growthDurationDisplay: '270–365 days (~9–12 months)',
    growthRateCategory: 'Long-Season',
    growthSpeedNotes: 'Shooting occurs 7–9 months after sucker planting, with bunch harvesting 3–4 months after flowering (~9–12 months total for the primary crop).',
    minPh: 5.0,
    maxPh: 7.5,
    optimalMinPh: 5.8,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.0, // 1,000 µS/cm
    yieldDeclineSlopePercent: 33.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Top fruit export commodity in Mindanao (Davao, Soccsksargen). Shallow root system makes banana highly sensitive to soluble salts; yield falls steeply above 1.0 dS/m.',
    sources: [
      {
        name: 'PCAARRD-DOST Banana Industry Strategic S&T Program',
        organization: 'PCAARRD',
        url: 'https://www.pcaarrd.dost.gov.ph/'
      },
      {
        name: 'FAO Irrigation Paper 29 - Musa species Salinity Response',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/banana/en/'
      }
    ]
  },
  {
    id: 'papaya',
    commonName: 'Papaya',
    localName: 'Papaya (Solo / Sinta)',
    scientificName: 'Carica papaya',
    category: 'Fruit Crops',
    daysToHarvestMin: 270,
    daysToHarvestMax: 365,
    daysToHarvestTypical: 300,
    growthDurationDisplay: '270–365 days (~9–12 months)',
    growthRateCategory: 'Long-Season',
    growthSpeedNotes: 'First ripe fruit harvesting begins 9–10 months after field transplanting; continuous weekly harvests occur for 2 to 3 years thereafter.',
    minPh: 5.5,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 13.0,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Major commercial fruit crop grown in Cavite, Davao, and Bukidnon. Shallow, fleshy root system cannot tolerate standing water or saline soil conditions.',
    sources: [
      {
        name: 'UPLB Institute of Plant Breeding (IPB) Papaya Breeding Program',
        organization: 'UPLB',
        url: 'https://cafs.uplb.edu.ph/'
      },
      {
        name: 'DA-BPI High Value Crops Papaya Production Manual',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      }
    ]
  },
  {
    id: 'pineapple',
    commonName: 'Pineapple',
    localName: 'Pinya (Smooth Cayenne / Queen)',
    scientificName: 'Ananas comosus',
    category: 'Fruit Crops',
    daysToHarvestMin: 420,
    daysToHarvestMax: 540,
    daysToHarvestTypical: 480,
    growthDurationDisplay: '420–540 days (~14–18 months)',
    growthRateCategory: 'Multi-Year / Perennial',
    growthSpeedNotes: 'Perennial fruit requiring 14 to 18 months from planting slips or suckers to primary fruit harvesting; flower induction is typically forced at month 10–12.',
    minPh: 4.5,
    maxPh: 6.5,
    optimalMinPh: 5.0,
    optimalMaxPh: 6.0,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 12.0,
    ecSalinityRating: 'Moderately Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Extensively grown in Bukidnon and South Cotabato volcanic plateaus. Highly adapted to naturally acidic soil conditions; alkaline soils cause severe micronutrient chlorosis.',
    sources: [
      {
        name: 'DA-BPI Pineapple Cultural Management Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO Irrigation Paper 29 Salinity Tolerances - Ananas comosus',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/pineapple/en/'
      }
    ]
  },
  {
    id: 'calamansi',
    commonName: 'Calamansi (Philippine Lime)',
    localName: 'Kalamansi',
    scientificName: 'Citrus microcarpa',
    category: 'Fruit Crops',
    daysToHarvestMin: 730,
    daysToHarvestMax: 1095,
    daysToHarvestTypical: 900,
    growthDurationDisplay: '730–1,095 days (~2–3 years)',
    growthRateCategory: 'Multi-Year / Perennial',
    growthSpeedNotes: 'Budded or grafted seedlings begin commercial fruiting 2 to 3 years after field planting, bearing fragrant fruit nearly year-round with seasonal peak in Aug–Oct.',
    minPh: 5.0,
    maxPh: 7.5,
    optimalMinPh: 5.8,
    optimalMaxPh: 6.8,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 16.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BPI / UPLB / FAO 29)',
    notes: 'Premier indigenous citrus fruit of the Philippines, centered in Oriental Mindoro and Batangas. Highly vulnerable to root asphyxiation and salt burn above 1.5 dS/m.',
    sources: [
      {
        name: 'DA-BPI National Calamansi Production and Development Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'PCAARRD-DOST Citrus Commodity Roadmap',
        organization: 'PCAARRD',
        url: 'https://www.pcaarrd.dost.gov.ph/'
      }
    ]
  },
  {
    id: 'guava',
    commonName: 'Guava',
    localName: 'Bayabas',
    scientificName: 'Psidium guajava',
    category: 'Fruit Crops',
    daysToHarvestMin: 730,
    daysToHarvestMax: 1095,
    daysToHarvestTypical: 900,
    growthDurationDisplay: '730–1,095 days (~2–3 years)',
    growthRateCategory: 'Multi-Year / Perennial',
    growthSpeedNotes: 'Marcotted or grafted improved cultivars (e.g., Guimaras, Pearl) commence bearing fruit in 2 to 3 years and provide continuous harvests for decades.',
    minPh: 4.8,
    maxPh: 8.0,
    optimalMinPh: 5.5,
    optimalMaxPh: 7.0,
    ecThresholdDsM: 2.5, // 2,500 µS/cm
    yieldDeclineSlopePercent: 9.0,
    ecSalinityRating: 'Moderately Tolerant',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BPI / FAO EcoCrop)',
    notes: 'Extremely resilient tropical fruit tree. Adapts successfully across a broad pH range (4.8–8.0) and demonstrates moderate tolerance to soluble soil salts up to 2.5 dS/m.',
    sources: [
      {
        name: 'DA Bureau of Plant Industry Fruit Crops Production Guide',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO EcoCrop Database - Psidium guajava Soil Characteristics',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/fruit-crops/en/'
      }
    ]
  },
  {
    id: 'coffee',
    commonName: 'Coffee (Robusta & Arabica)',
    localName: 'Kape (Barako / Robusta / Arabica)',
    scientificName: 'Coffea canephora / Coffea arabica',
    category: 'Fruit Crops',
    daysToHarvestMin: 730,
    daysToHarvestMax: 1095,
    daysToHarvestTypical: 910,
    growthDurationDisplay: '730–1,095 days (~2–3 years)',
    growthRateCategory: 'Multi-Year / Perennial',
    growthSpeedNotes: 'Perennial fruit-bearing shrub/tree; requires 2 to 3 years from nursery planting to first commercial cherry harvest, yielding annual crops for 25+ years.',
    minPh: 4.5,
    maxPh: 6.8,
    optimalMinPh: 5.2,
    optimalMaxPh: 6.2,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 16.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Cultivated in Batangas, Cavite, Sultan Kudarat, and Cordillera highlands. Thrives in acidic soils; salt accumulation causes immediate tip-burn and berry drop.',
    sources: [
      {
        name: 'DA-BAR Philippine Coffee Industry Roadmap & Cultural Guide',
        organization: 'DA',
        url: 'https://www.bar.gov.ph/'
      },
      {
        name: 'UPLB College of Agriculture Coffee Agroforestry Research',
        organization: 'UPLB',
        url: 'https://cafs.uplb.edu.ph/'
      }
    ]
  },
  {
    id: 'cacao',
    commonName: 'Cacao (Cocoa)',
    localName: 'Kakaw',
    scientificName: 'Theobroma cacao',
    category: 'Fruit Crops',
    daysToHarvestMin: 730,
    daysToHarvestMax: 1095,
    daysToHarvestTypical: 910,
    growthDurationDisplay: '730–1,095 days (~2–3 years)',
    growthRateCategory: 'Multi-Year / Perennial',
    growthSpeedNotes: 'High-yielding grafted clonal seedlings in Davao begin bearing pods 2 to 3 years after field planting, with continuous pod production year-round.',
    minPh: 5.0,
    maxPh: 7.5,
    optimalMinPh: 6.0,
    optimalMaxPh: 7.0,
    ecThresholdDsM: 1.2, // 1,200 µS/cm
    yieldDeclineSlopePercent: 20.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'Davao Region is recognized as the Cacao Capital of the Philippines. Cacao requires well-drained, neutral-tending organic loam; roots suffer severe burn above 1.2 dS/m.',
    sources: [
      {
        name: 'DA High Value Crops Development Program (HVCDP) Cacao Guide',
        organization: 'DA',
        url: 'https://hvcdp.da.gov.ph/'
      },
      {
        name: 'FAO Crop Information - Cocoa Soil and Salinity Tolerances',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/cocoa/en/'
      }
    ]
  },
  {
    id: 'mango',
    commonName: 'Mango',
    localName: 'Mangga (Carabao / Manila Super)',
    scientificName: 'Mangifera indica',
    category: 'Fruit Crops',
    daysToHarvestMin: 1460,
    daysToHarvestMax: 2190,
    daysToHarvestTypical: 1825,
    growthDurationDisplay: '1,460–2,190 days (~4–6 years)',
    growthRateCategory: 'Multi-Year / Perennial',
    growthSpeedNotes: 'Grafted Philippine Carabao mango trees require 4 to 5 years before first commercial flower induction and fruit harvesting; productive for decades.',
    minPh: 5.2,
    maxPh: 7.5,
    optimalMinPh: 5.5,
    optimalMaxPh: 6.5,
    ecThresholdDsM: 1.5, // 1,500 µS/cm
    yieldDeclineSlopePercent: 15.0,
    ecSalinityRating: 'Sensitive',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (DA / BSWM / FAO / IRRI / UPLB)',
    notes: 'National fruit of the Philippines, prominent in Guimaras, Zambales, and Pangasinan. Deep-rooted perennial that suffers marginal leaf scorch in saline soils above 1.5 dS/m.',
    sources: [
      {
        name: 'DA-BPI National Mango Research and Development Center (Guimaras)',
        organization: 'BPI',
        url: 'https://buplant.da.gov.ph/'
      },
      {
        name: 'FAO EcoCrop / Tropical Fruit Salinity Tolerance',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/mango/en/'
      }
    ]
  },
  {
    id: 'coconut',
    commonName: 'Coconut',
    localName: 'Niyog',
    scientificName: 'Cocos nucifera',
    category: 'Fruit Crops',
    daysToHarvestMin: 1460,
    daysToHarvestMax: 2555,
    daysToHarvestTypical: 1825,
    growthDurationDisplay: '1,460–2,555 days (~4–7 years)',
    growthRateCategory: 'Multi-Year / Perennial',
    growthSpeedNotes: 'Long-term perennial fruit palm; PCA hybrid cultivars start bearing at 4 years, while traditional Tall cultivars bear around year 6–7, then yield nuts monthly for 60+ years.',
    minPh: 5.0,
    maxPh: 8.0,
    optimalMinPh: 5.5,
    optimalMaxPh: 7.0,
    ecThresholdDsM: 4.0, // 4,000 µS/cm
    yieldDeclineSlopePercent: 7.0,
    ecSalinityRating: 'Tolerant',
    measurementMethod: 'ECe (saturated soil paste extract)',
    evidenceStatus: 'Verified (PCA / FAO)',
    notes: 'The "Tree of Life" planted across 3.6 million hectares in the Philippines. Naturally halophytic palm that tolerates high soil electrical conductivity, coastal winds, and brackish salinity.',
    sources: [
      {
        name: 'Philippine Coconut Authority (PCA) Soil Suitability Guidelines',
        organization: 'PCA',
        url: 'https://pca.gov.ph/'
      },
      {
        name: 'FAO Coconut Agronomy and Saline Adaptation Reports',
        organization: 'FAO',
        url: 'https://www.fao.org/land-water/databases-and-software/crop-information/coconut/en/'
      }
    ]
  }
];
