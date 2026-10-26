import React, { useState, useId } from 'react';
import {
  Sprout,
  FlaskConical,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Info,
  Layers,
  Search,
  Clock,
  CheckCircle2,
  Leaf,
  Tractor,
  Apple,
  X
} from 'lucide-react';
import { rankCrops, AnalysisSummary, RankedCropResult } from './utils/ranking';
import { CropCategory, GrowthRateCategory } from './data/crops';

// Common Philippine benchmark soil presets for instant user evaluation
const PRESET_SOILS = [
  {
    name: 'Central Luzon Lowland Rice Paddy',
    location: 'Nueva Ecija / Pampanga',
    ph: 6.2,
    ec: 450,
    desc: 'Slightly acidic, non-saline alluvial clay loam'
  },
  {
    name: 'Benguet Highland Vegetable Soil',
    location: 'La Trinidad, Benguet',
    ph: 5.8,
    ec: 320,
    desc: 'Moderately acidic volcanic loam, cool plateau'
  },
  {
    name: 'Bukidnon Pineapple / Upland Soil',
    location: 'Northern Mindanao',
    ph: 5.2,
    ec: 260,
    desc: 'Naturally acidic volcanic latosol'
  },
  {
    name: 'Coastal / Brackish Plain Soil',
    location: 'Pangasinan / Iloilo Coastal',
    ph: 7.6,
    ec: 2200,
    desc: 'Slightly alkaline, saline-affected coastal soil'
  }
];

// Category metadata definitions
interface CategoryMeta {
  id: CropCategory | 'All Crops';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: 'All Crops',
    title: 'All Crops',
    subtitle: 'Every verified Philippine crop',
    icon: Layers,
    accentColor: 'border-slate-300 text-slate-800 bg-slate-50'
  },
  {
    id: 'Garden Crops',
    title: 'Garden Crops',
    subtitle: 'Home garden vegetables & herbs (pechay, lettuce, tomato, eggplant, radish, okra)',
    icon: Leaf,
    accentColor: 'border-emerald-300 text-emerald-800 bg-emerald-50'
  },
  {
    id: 'Farmland Crops',
    title: 'Farmland Crops',
    subtitle: 'Field staples & agro-farms (rice, corn, sugarcane, cassava, mung bean, soybean, peanut)',
    icon: Tractor,
    accentColor: 'border-amber-300 text-amber-800 bg-amber-50'
  },
  {
    id: 'Fruit Crops',
    title: 'Fruit Crops',
    subtitle: 'Fruit trees & perennials (banana, papaya, mango, calamansi, guava, pineapple, coconut)',
    icon: Apple,
    accentColor: 'border-purple-300 text-purple-800 bg-purple-50'
  }
];

// Helper for Category Pill Styling
function getCategoryPillBadge(category: CropCategory) {
  switch (category) {
    case 'Garden Crops':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        label: 'Garden Crop'
      };
    case 'Farmland Crops':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        label: 'Farmland Crop'
      };
    case 'Fruit Crops':
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        label: 'Fruit Crop'
      };
  }
}

// Helper for Growth Rate Category Styling
function getGrowthCategoryBadge(category: GrowthRateCategory) {
  switch (category) {
    case 'Ultra-Fast':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        label: 'Ultra-Fast (<40 days)'
      };
    case 'Fast':
      return {
        bg: 'bg-teal-50 text-teal-800 border-teal-300',
        dot: 'bg-teal-500',
        label: 'Fast (40–90 days)'
      };
    case 'Moderate':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300',
        dot: 'bg-blue-500',
        label: 'Moderate (90–150 days)'
      };
    case 'Long-Season':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        label: 'Long-Season (5–12 mos)'
      };
    case 'Multi-Year / Perennial':
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-300',
        dot: 'bg-purple-500',
        label: 'Multi-Year (>1 year)'
      };
  }
}

export default function App() {
  const phInputId = useId();
  const ecInputId = useId();

  // User input states
  const [phInput, setPhInput] = useState<string>('6.2');
  const [ecInput, setEcInput] = useState<string>('450');

  // Active Category Selection
  const [activeCategory, setActiveCategory] = useState<CropCategory | 'All Crops'>('All Crops');

  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active analysis results: ranked strictly by soil suitability
  const [analysis, setAnalysis] = useState<AnalysisSummary | null>(() => {
    return rankCrops(6.2, 450, 'All Crops');
  });

  // Validation error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = (phVal?: number, ecVal?: number, catVal?: CropCategory | 'All Crops') => {
    const ph = phVal !== undefined ? phVal : parseFloat(phInput);
    const ec = ecVal !== undefined ? ecVal : parseFloat(ecInput);
    const targetCategory = catVal !== undefined ? catVal : activeCategory;

    if (isNaN(ph) || ph < 0 || ph > 14) {
      setErrorMessage('Please enter a valid Soil pH between 0.0 and 14.0.');
      return;
    }

    if (isNaN(ec) || ec < 0) {
      setErrorMessage('Please enter a valid Electrical Conductivity (EC) value (0 or greater in µS/cm).');
      return;
    }

    if (ec > 30000) {
      setErrorMessage('EC value exceeds 30,000 µS/cm. In agricultural terms, this indicates hyper-saline ground where crop growth is impossible.');
      return;
    }

    setErrorMessage(null);
    const summary = rankCrops(ph, ec, targetCategory);
    setAnalysis(summary);
  };

  const handleCategoryChange = (category: CropCategory | 'All Crops') => {
    setActiveCategory(category);
    const ph = parseFloat(phInput);
    const ec = parseFloat(ecInput);
    if (!isNaN(ph) && !isNaN(ec) && ph >= 0 && ph <= 14 && ec >= 0) {
      const summary = rankCrops(ph, ec, category);
      setAnalysis(summary);
    }
  };

  const applyPreset = (preset: (typeof PRESET_SOILS)[0]) => {
    setPhInput(preset.ph.toString());
    setEcInput(preset.ec.toString());
    setErrorMessage(null);
    handleAnalyze(preset.ph, preset.ec, activeCategory);
  };

  // Convert current input EC to dS/m for live display
  const currentEcNum = parseFloat(ecInput);
  const liveConvertedDsM = !isNaN(currentEcNum) ? (currentEcNum / 1000).toFixed(2) : '--';
  const currentPhNum = parseFloat(phInput);

  // Search filter across results
  const displayedResults = analysis?.results.filter((res) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      res.crop.commonName.toLowerCase().includes(q) ||
      res.crop.localName.toLowerCase().includes(q) ||
      res.crop.scientificName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Accent Ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 w-full" />

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            SoilFit &bull; Philippine Crop Recommender
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            SoilFit
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-600 max-w-2xl mx-auto">
            Discover the best crops for your soil.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            Ranked primarily by soil suitability percentage (pH &amp; EC). Faster growth speed is used solely as a tie-breaker when suitability scores are equal.
          </p>
        </header>

        {/* Input Panel Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Enter Your Soil Test Values</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              1 dS/m = 1,000 µS/cm
            </span>
          </div>

          {/* Preset Buttons for Quick Testing */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Quick Soil Presets (Philippines)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_SOILS.map((preset) => {
                const isActive = phInput === preset.ph.toString() && ecInput === preset.ec.toString();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 truncate">{preset.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{preset.location}</div>
                    <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-emerald-700">
                      <span>pH {preset.ph}</span>
                      <span>{preset.ec} µS/cm</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Input 1: Soil pH */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor={phInputId} className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  Soil pH
                  <span className="text-xs font-normal text-slate-500">(0.0 – 14.0)</span>
                </label>
                {!isNaN(currentPhNum) && currentPhNum >= 0 && currentPhNum <= 14 && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      currentPhNum < 5.5
                        ? 'bg-amber-100 text-amber-800'
                        : currentPhNum <= 7.0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {currentPhNum < 5.0
                      ? 'Strongly Acidic'
                      : currentPhNum < 6.0
                      ? 'Moderately Acidic'
                      : currentPhNum <= 7.0
                      ? 'Neutral / Optimal'
                      : currentPhNum <= 8.0
                      ? 'Slightly Alkaline'
                      : 'Strongly Alkaline'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id={phInputId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={phInput}
                  onChange={(e) => setPhInput(e.target.value)}
                  placeholder="e.g. 6.2"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <span className="absolute right-4 top-3 text-slate-400 font-mono text-sm pointer-events-none">
                  pH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Typical Philippine arable soils range from 5.0 (upland acid soils) to 7.5 (calcareous coastal soils).
              </p>
            </div>

            {/* Input 2: Soil EC */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor={ecInputId} className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  Soil Electrical Conductivity (EC)
                  <span className="text-xs font-normal text-slate-500">(µS/cm)</span>
                </label>
                <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  = {liveConvertedDsM} dS/m
                </span>
              </div>
              <div className="relative">
                <input
                  id={ecInputId}
                  type="number"
                  step="10"
                  min="0"
                  max="30000"
                  value={ecInput}
                  onChange={(e) => setEcInput(e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <span className="absolute right-4 top-3 text-slate-400 font-mono text-sm pointer-events-none">
                  µS/cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Standard saturated soil paste extract (<span className="font-semibold">ECe</span>). 1 dS/m = 1,000 µS/cm. Non-saline agricultural soils are below 750 µS/cm.
              </p>
            </div>
          </div>

          {/* Validation Error Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">Input Error: </span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleAnalyze()}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sprout className="w-5 h-5" />
              Analyze My Soil
            </button>
          </div>
        </section>

        {/* Results Section */}
        {analysis && (
          <section className="space-y-6">
            {/* 1. Category Selection Cards */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Select Crop Category:
                </label>
                <span className="text-xs text-slate-400">
                  Switching categories filters crops without changing their suitability scores
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  const Icon = cat.icon;
                  const count = analysis.categoryCounts[cat.id];

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 shadow-sm ring-2 ring-emerald-500/80'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-extrabold text-sm text-slate-900">
                            {cat.title}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        {cat.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Analysis Header with Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Recommended {activeCategory === 'All Crops' ? 'Crops' : activeCategory}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Ranked primarily by soil suitability &bull; Tested for pH {analysis.inputPh.toFixed(1)} &amp; EC {analysis.inputEcMicroS.toLocaleString()} µS/cm ({analysis.convertedEcDsM.toFixed(2)} dS/m)
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search crop or scientific name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Ranking Hierarchy & Tie-Breaker Disclosure Banner */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                  Primary Ranking by Soil Suitability &bull; Growth Speed as Tie-Breaker Only
                </div>
                <p className="leading-relaxed text-slate-700 pl-6">
                  Crops are ranked <strong>strictly by their Soil Suitability Score (%)</strong> (55% pH + 45% EC). If two or more crops have the exact same suitability score, the faster-growing crop with fewer days to harvest ranks first. Growth speed never allows a less suitable crop to outrank a more suitable crop.
                </p>
              </div>

              {/* Soil Diagnosis Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Soil Reaction (pH) Status
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    {analysis.soilClassification.phCategory}
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Evaluates nutrient solubility, phosphorus availability, and aluminum/micronutrient toxicity thresholds.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Salinity (ECe) Status
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    {analysis.soilClassification.ecCategory}
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Based on standard FAO 29 Maas-Hoffman thresholds for soluble salt osmotic stress.
                  </p>
                </div>
              </div>

              {/* Qualification Count Note */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Showing <strong className="text-slate-900">{displayedResults?.length}</strong> viable crops in <strong className="text-emerald-800">{activeCategory}</strong>.
                  </span>
                </div>
                {analysis.qualifyingCount < 20 && activeCategory === 'All Crops' && (
                  <span className="text-amber-700 font-medium">
                    Fewer than 20 qualified due to severe soil stress.
                  </span>
                )}
              </div>
            </div>

            {/* Explanation if fewer than 20 qualify in All Crops */}
            {analysis.qualifyingCount < 20 && activeCategory === 'All Crops' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs sm:text-sm space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Agronomic Constraint Notice: Severe Soil Stress Excludes Crops
                </div>
                <p>
                  Only {analysis.qualifyingCount} verified crops met the minimum agronomic threshold for viability under your current soil conditions (pH {analysis.inputPh.toFixed(1)}, EC {analysis.convertedEcDsM.toFixed(2)} dS/m). We do not invent fictional scores for crops that would suffer crop failure or root damage under this chemistry.
                </p>
              </div>
            )}

            {/* Ranked List of Crops */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Recommended Crops</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Rank #1 to #{displayedResults?.length || 0}
                  </span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Order: Suitability % &rarr; Maturity Tie-Breaker
                </span>
              </div>

              {displayedResults && displayedResults.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200 space-y-2">
                  <p className="font-semibold text-slate-700">No crops matched your search keyword.</p>
                  <p className="text-xs text-slate-500">
                    Try searching for common names (e.g. &ldquo;Tomato&rdquo;, &ldquo;Pechay&rdquo;, &ldquo;Rice&rdquo;) or scientific names (e.g. &ldquo;Solanum&rdquo;, &ldquo;Oryza&rdquo;).
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedResults?.map((item: RankedCropResult) => {
                    const isTopThree = item.rank <= 3;
                    const growthBadge = getGrowthCategoryBadge(item.crop.growthRateCategory);
                    const categoryPill = getCategoryPillBadge(item.crop.category);

                    return (
                      <article
                        key={item.crop.id}
                        className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs space-y-4 ${
                          isTopThree
                            ? 'border-emerald-200 ring-1 ring-emerald-100'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* 1. Rank, Crop Name, Category, and Soil Suitability Score (%) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          <div className="flex items-start gap-3.5">
                            {/* Rank Badge */}
                            <div
                              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-black shadow-xs ${
                                item.rank === 1
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                                  : item.rank === 2
                                  ? 'bg-emerald-500 text-white'
                                  : item.rank === 3
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span className="text-[10px] uppercase font-bold tracking-tighter opacity-80 leading-none">
                                Rank
                              </span>
                              <span className="text-lg leading-none mt-0.5">#{item.rank}</span>
                            </div>

                            {/* Crop Name & Category Badge */}
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                                  {item.crop.commonName}
                                </h4>
                                <span className="text-xs text-slate-500 font-medium">
                                  ({item.crop.localName})
                                </span>
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${categoryPill.bg}`}>
                                  {categoryPill.label}
                                </span>
                              </div>
                              <p className="text-xs text-emerald-800 italic font-serif mt-0.5">
                                {item.crop.scientificName}
                              </p>
                            </div>
                          </div>

                          {/* Soil Suitability Score (%) */}
                          <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                Soil Suitability:
                              </span>
                              <span className="text-2xl font-black text-slate-900 font-mono">
                                {item.overallScore.toFixed(1)}%
                              </span>
                            </div>
                            <span
                              className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-0.5 ${
                                item.overallScore >= 85
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : item.overallScore >= 70
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : item.overallScore >= 50
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {item.suitabilityGrade}
                            </span>
                          </div>
                        </div>

                        {/* 2 & 3. pH Compatibility and EC/Salinity Compatibility */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {/* pH Compatibility Card */}
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                                Soil pH Compatibility
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  item.phComparison.status === 'optimal'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : item.phComparison.status === 'acceptable'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {item.phComparison.statusLabel} ({item.phScore}%)
                              </span>
                            </div>
                            <div className="space-y-1 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Measured Soil pH:</span>
                                <span className="font-mono font-bold text-slate-900">
                                  {item.phComparison.userFormatted}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Crop pH Requirement:</span>
                                <span className="font-mono font-medium text-slate-800">
                                  {item.phComparison.cropRange}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/70 leading-snug">
                                {item.phComparison.comment}
                              </p>
                            </div>
                          </div>

                          {/* EC/Salinity Compatibility Card */}
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-teal-600" />
                                EC / Salinity Compatibility
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  item.ecComparison.status === 'optimal'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : item.ecComparison.status === 'acceptable'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {item.ecComparison.statusLabel} ({item.ecScore}%)
                              </span>
                            </div>
                            <div className="space-y-1 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Measured Soil EC:</span>
                                <span className="font-mono font-bold text-slate-900">
                                  {item.ecComparison.userFormatted}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Salinity Threshold:</span>
                                <span className="font-mono font-medium text-slate-800">
                                  {item.ecComparison.cropRange}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/70 leading-snug">
                                {item.ecComparison.comment}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 4. Short Explanation & Brief Crop Description */}
                        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs space-y-1">
                          <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider">
                            Soil Suitability Explanation &bull; Rank #{item.rank}:
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {item.rankExplanation}
                          </p>
                          <p className="text-slate-500 text-[11px] pt-1 border-t border-emerald-100/80">
                            <strong className="text-slate-700">Crop Description &amp; Philippine Cultivation Context: </strong>
                            {item.crop.notes}
                          </p>
                        </div>

                        {/* 5. Scientific Source Links */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-semibold uppercase tracking-wider text-slate-600">
                              Scientific Source References:
                            </span>
                            <span className="text-emerald-700 font-medium text-[10px]">
                              {item.crop.evidenceStatus}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.crop.sources.map((src, idx) => (
                              <a
                                key={idx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 hover:text-emerald-700 transition"
                              >
                                <span className="font-bold text-emerald-700">[{src.organization}]</span>
                                <span className="truncate max-w-[220px]">{src.name}</span>
                                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* 6. Growth Duration / Maturity (Tie-Breaker Property) */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-800">Typical Days to Harvest: </span>
                              <span className="font-mono text-slate-900 font-bold">{item.crop.growthDurationDisplay}</span>
                              {item.crop.daysToHarvestTypical && (
                                <span className="text-slate-500 text-[11px] ml-1.5">
                                  (~{item.crop.daysToHarvestTypical} days)
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${growthBadge.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${growthBadge.dot}`} />
                              <span>{growthBadge.label}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 italic hidden md:inline">
                              *Used as tie-breaker only when suitability is tied
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Incompatible Method & Conversion Disclosure Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <Info className="w-4 h-4 text-emerald-600" />
                Technical Standards, Scoring Method &amp; Tie-Breaker Rule
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
                <li>
                  <strong className="text-slate-800">Primary Ranking by Soil Suitability:</strong> Suitability percentage is calculated mathematically as <span className="font-semibold text-slate-800">55% Soil pH Match + 45% EC Salinity Tolerance</span>. Scores strictly reflect documented physiological thresholds and are never randomly generated.
                </li>
                <li>
                  <strong className="text-slate-800">Tie-Breaker Rule:</strong> If two crops receive the exact same suitability score (e.g. 100%), the faster-growing crop with fewer days to harvest is ranked higher. Growth speed never inflates the suitability percentage or allows an inferior soil match to rank higher.
                </li>
                <li>
                  <strong className="text-slate-800">Unit Conversion:</strong> 1 dS/m (decisiemens per meter) = 1,000 µS/cm (microsiemens per centimeter) = 1 mS/cm.
                </li>
                <li>
                  <strong className="text-slate-800">Standardized Method:</strong> All threshold tolerances in this database are calibrated to <span className="font-semibold text-slate-800">ECe (electrical conductivity of a saturated soil paste extract)</span> using the Maas-Hoffman empirical yield reduction model (FAO Irrigation &amp; Drainage Paper 29).
                </li>
                <li>
                  <strong className="text-slate-800">Incompatible Lab Tests:</strong> If your soil test was conducted using a 1:5 soil-to-water suspension (EC 1:5), do not compare the raw values directly. Depending on soil texture (sand vs. clay), an EC 1:5 value is typically 4 to 8 times lower than ECe. Convert laboratory readings to equivalent ECe before entering.
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* Disclaimer Card */}
        <footer className="bg-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            Agronomic Disclaimer
          </div>
          <p className="leading-relaxed">
            Soil suitability scores are calculated mathematically based on documented soil pH and electrical conductivity (ECe) tolerance curves. Growth durations are documented averages for standard Philippine commercial cultivars. Soil suitability does not guarantee final harvest yield, which also depends on climate, seasonal rainfall, irrigation infrastructure, soil texture, organic matter content, balanced N-P-K nutrient levels, pest and disease management, and standard Philippine agricultural practices. Always consult your municipal agricultural officer (MAO) or local DA-BSWM soil testing laboratory before investing in large-scale planting.
          </p>
          <div className="pt-1 text-[11px] text-slate-400">
            SoilFit – Built for Philippine Agriculture &bull; Reference Standards: DA-BSWM, PhilRice, UPLB, FAO-29.
          </div>
        </footer>
      </main>
    </div>
  );
}
