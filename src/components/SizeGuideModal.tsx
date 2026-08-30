import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  Table, 
  BookOpen, 
  Info, 
  ArrowRight, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Maximize2, 
  MoveHorizontal, 
  Scissors, 
  Shirt,
  MessageSquare
} from 'lucide-react';
import { Product, FitPreference } from '../types';
import { 
  CATEGORY_SIZE_CHARTS, 
  calculateRecommendedSize, 
  HOW_TO_MEASURE_STEPS 
} from '../data/sizeGuideData';
import { useCart } from '../context/CartContext';

interface SizeGuideModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  product?: Product | null;
  initialTab?: 'finder' | 'chart' | 'measure';
  onSelectSize?: (size: string) => void;
  asSection?: boolean;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen = true,
  onClose,
  product,
  initialTab = 'finder',
  onSelectSize,
  asSection = false
}) => {
  const { openWhatsAppChat } = useCart();
  const [activeTab, setActiveTab] = useState<'finder' | 'chart' | 'measure'>(initialTab);

  // Form Inputs for Size Finder
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(8);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [fitPreference, setFitPreference] = useState<FitPreference>('regular');
  
  // Category selector for Size Finder / Chart
  const defaultCategory = product?.category === 'mens-katua' ? 'mens-katua' : 'mens-shirts';
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);

  // Unit toggle for size chart: 'inches' vs 'cm'
  const [measurementUnit, setMeasurementUnit] = useState<'inches' | 'cm'>('inches');

  // Applied size confirmation alert
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);

  // Update selected category if product changes
  useEffect(() => {
    if (product) {
      setSelectedCategory(product.category === 'mens-katua' ? 'mens-katua' : 'mens-shirts');
    }
  }, [product]);

  // Compute recommendation
  const recommendation = useMemo(() => {
    return calculateRecommendedSize(
      {
        heightFeet,
        heightInches,
        weightKg,
        fitPreference,
        categoryId: selectedCategory
      },
      selectedCategory
    );
  }, [heightFeet, heightInches, weightKg, fitPreference, selectedCategory]);

  const activeChart = CATEGORY_SIZE_CHARTS[selectedCategory] || CATEGORY_SIZE_CHARTS['mens-shirts'];

  const handleApplySize = (size: string) => {
    if (onSelectSize) {
      onSelectSize(size);
      setAppliedFeedback(`Size "${size}" has been applied to your selection!`);
      setTimeout(() => {
        setAppliedFeedback(null);
        if (onClose) onClose();
      }, 700);
    }
  };

  const content = (
    <div className={`bg-zinc-950 rounded-2xl ${asSection ? 'border border-zinc-800 shadow-xs' : 'shadow-2xl border border-zinc-800 max-w-4xl w-full max-h-[92vh] flex flex-col'} overflow-hidden relative text-zinc-100`}>
      {/* Modal Header */}
      <div className="bg-black text-white px-5 sm:px-8 py-5 flex items-center justify-between shrink-0 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-black text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
              Smart Sizing
            </span>
            <span className="text-zinc-400 text-xs hidden sm:inline">
              Sider Savar Factory Standard
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>SIZE GUIDE</span>
            <span className="text-amber-400 text-sm font-bangla font-medium">/ সাইজ গাইড</span>
          </h2>
          {product && (
            <p className="text-xs text-zinc-300 mt-0.5 truncate max-w-md">
              Product: <strong className="text-amber-300">{product.name}</strong> ({product.code})
            </p>
          )}
        </div>

        {!asSection && onClose && (
          <button
            id="close-size-guide-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Tabs (3 requested tabs) */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0 py-2">
        <button
          id="size-tab-finder-btn"
          onClick={() => setActiveTab('finder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'finder'
              ? 'bg-zinc-950 text-white shadow-xs border border-zinc-700'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === 'finder' ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span>SIZE FINDER</span>
          <span className="text-[11px] font-bangla text-zinc-400 font-normal">(সাইজ ফাইন্ডার)</span>
        </button>

        <button
          id="size-tab-chart-btn"
          onClick={() => setActiveTab('chart')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'chart'
              ? 'bg-zinc-950 text-white shadow-xs border border-zinc-700'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Table className={`w-4 h-4 ${activeTab === 'chart' ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span>SIZE CHART</span>
          <span className="text-[11px] font-bangla text-zinc-400 font-normal">(সাইজ চার্ট)</span>
        </button>

        <button
          id="size-tab-measure-btn"
          onClick={() => setActiveTab('measure')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'measure'
              ? 'bg-zinc-950 text-white shadow-xs border border-zinc-700'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'measure' ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span>HOW TO MEASURE</span>
          <span className="text-[11px] font-bangla text-zinc-400 font-normal">(মাপ নেওয়ার নিয়ম)</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: SIZE FINDER                                                        */}
        {/* ========================================================================= */}
        {activeTab === 'finder' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Category Selector Pill Row */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-zinc-200">Garment Category / পোশাকের ধরণ:</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('mens-shirts')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'mens-shirts'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Men's Shirts (শার্ট)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('mens-katua')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'mens-katua'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Men's Katua (কতুয়া)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Left Column: Biometric Inputs */}
              <div className="lg:col-span-6 space-y-5 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Enter Your Measurements</span>
                </h3>

                {/* Height Input (Feet & Inches Dropdown) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span>Height (উচ্চতা):</span>
                    <span className="text-amber-400 font-mono text-xs font-bold">
                      {heightFeet} Feet {heightInches} Inches (~{Math.round(((heightFeet * 12) + heightInches) * 2.54)} cm)
                    </span>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Feet (ফুট)</span>
                      <select
                        id="size-finder-feet-select"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                      >
                        {[4, 5, 6].map((ft) => (
                          <option key={ft} value={ft} className="bg-zinc-950 text-white">
                            {ft} Feet ({ft} ফুট)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Inches (ইঞ্চি)</span>
                      <select
                        id="size-finder-inches-select"
                        value={heightInches}
                        onChange={(e) => setHeightInches(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i} className="bg-zinc-950 text-white">
                            {i} Inch{i !== 1 ? 'es' : ''} ({i} ইঞ্চি)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Weight Input (KG slider + input) */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-zinc-300">
                      Weight in KG (ওজন):
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id="size-finder-weight-number-input"
                        type="number"
                        min="40"
                        max="130"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-16 text-center bg-zinc-950 border border-zinc-700 rounded-md py-1 text-sm font-bold font-mono text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="font-bold text-zinc-400">KG</span>
                    </div>
                  </div>

                  <input
                    id="size-finder-weight-slider"
                    type="range"
                    min="45"
                    max="115"
                    step="1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    {[50, 60, 70, 80, 90, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setWeightKg(preset)}
                        className={`text-[11px] px-2 py-1 rounded-md border font-semibold transition-colors cursor-pointer ${
                          weightKg === preset
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                        }`}
                      >
                        {preset}kg
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit Preference Selection */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Fit Preference (ফিটিং পছন্দ):
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFitPreference('slim')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fitPreference === 'slim'
                          ? 'border-amber-500 bg-amber-950/40 text-white shadow-xs'
                          : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-850'
                      }`}
                    >
                      <div className="text-xs font-extrabold">Slim Fit</div>
                      <div className={`text-[10px] mt-0.5 ${fitPreference === 'slim' ? 'text-amber-400' : 'text-zinc-400'}`}>
                        স্লিম / ফিটিং
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFitPreference('regular')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fitPreference === 'regular'
                          ? 'border-amber-500 bg-amber-950/40 text-white shadow-xs'
                          : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-850'
                      }`}
                    >
                      <div className="text-xs font-extrabold">Regular Fit</div>
                      <div className={`text-[10px] mt-0.5 ${fitPreference === 'regular' ? 'text-amber-400' : 'text-zinc-400'}`}>
                        রেগুলার / স্ট্যান্ডার্ড
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFitPreference('relaxed')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fitPreference === 'relaxed'
                          ? 'border-amber-500 bg-amber-950/40 text-white shadow-xs'
                          : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-850'
                      }`}
                    >
                      <div className="text-xs font-extrabold">Relaxed Fit</div>
                      <div className={`text-[10px] mt-0.5 ${fitPreference === 'relaxed' ? 'text-amber-400' : 'text-zinc-400'}`}>
                        লুজ / ঢিলেঢালা
                      </div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Calculated Recommendation Display */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Result Card */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-amber-500/80 space-y-4 shadow-sm text-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                      YOUR RECOMMENDED SIZE
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Fit Confirmed
                    </span>
                  </div>

                  {/* Primary Size Result Badge */}
                  <div className="flex items-baseline gap-4 py-2 border-y border-zinc-800">
                    <div className="text-6xl sm:text-7xl font-black text-amber-400 font-sans tracking-tight">
                      {recommendation.recommendedSize}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {recommendation.recommendedSize === 'S' && 'Small (৩৮" চেস্ট)'}
                        {recommendation.recommendedSize === 'M' && 'Medium (৪০" চেস্ট)'}
                        {recommendation.recommendedSize === 'L' && 'Large (৪২" চেস্ট)'}
                        {recommendation.recommendedSize === 'XL' && 'Extra Large (৪৪" চেস্ট)'}
                        {recommendation.recommendedSize === 'XXL' && 'Double Extra Large (৪৬" চেস্ট)'}
                      </div>
                      <div className="text-xs text-zinc-400 font-bangla mt-0.5">
                        আনুমানিক গার্মেন্টস চেস্ট: ~{recommendation.chestEstimateInches} ইঞ্চি
                      </div>
                    </div>
                  </div>

                  {/* Bilingual Result Description */}
                  <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
                    <p className="font-bangla font-semibold text-white">
                      {recommendation.explanationBn}
                    </p>
                    <p className="text-zinc-400 font-sans text-[11px]">
                      {recommendation.explanation}
                    </p>
                  </div>

                  {/* Apply size button if invoked from a product modal */}
                  {onSelectSize && (
                    <div className="pt-2">
                      <button
                        id="apply-recommended-size-btn"
                        onClick={() => handleApplySize(recommendation.recommendedSize)}
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                      >
                        <Check className="w-4 h-4 text-black" />
                        <span>Apply Size "{recommendation.recommendedSize}" to Product</span>
                      </button>
                    </div>
                  )}

                  {appliedFeedback && (
                    <div className="p-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold text-center animate-in fade-in">
                      {appliedFeedback}
                    </div>
                  )}
                </div>

                {/* Size Finder Disclaimer & Assurance */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2 text-zinc-400">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>Configurable Recommendation Disclaimer</span>
                  </div>
                  <p className="leading-relaxed font-bangla">
                    এই সাইজ ফাইন্ডারটি সাভার ফ্যাক্টরি স্ট্যান্ডার্ড ও সাধারণ শারীরিক গঠনের উপর ভিত্তি করে একটি নির্ভুল অনুমান (estimate) প্রদর্শন করে। এটি কোনো চিকিৎসা বা বৈজ্ঞানিক নির্দেশিকা নয়। আপনার পোশাক ট্রায়ালের পর সাইজ না মিললে আমরা ৭ দিনের মধ্যে ফ্রেন্ডলি এক্সচেঞ্জ করে দেব।
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800">
                    <span>Questions regarding custom fit?</span>
                    <button
                      type="button"
                      onClick={() => openWhatsAppChat("Hello Sider Fashion! I need help choosing my size.")}
                      className="text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask via WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SIZE CHART                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'chart' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header controls: Category selector & Unit Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('mens-shirts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'mens-shirts'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  Men's Shirts (পুরুষদের শার্ট)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('mens-katua')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'mens-katua'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  Men's Katua (কতুয়া)
                </button>
              </div>

              {/* Inches vs CM Toggle */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 font-medium">Measurement Unit:</span>
                <div className="inline-flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setMeasurementUnit('inches')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      measurementUnit === 'inches'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Inches (ইঞ্চি)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeasurementUnit('cm')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      measurementUnit === 'cm'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    CM (সেমি)
                  </button>
                </div>
              </div>
            </div>

            {/* Description Banner */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-amber-400" />
                <span>{activeChart.categoryName}</span>
              </h4>
              <p className="text-zinc-400 font-bangla">
                {activeChart.descriptionBn}
              </p>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800 shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-zinc-900 text-zinc-300 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4">Size (সাইজ)</th>
                    <th className="py-3.5 px-3">Chest (বুকের মাপ)</th>
                    <th className="py-3.5 px-3">Length (লম্বা)</th>
                    <th className="py-3.5 px-3">Shoulder (কাঁধ)</th>
                    <th className="py-3.5 px-3">Sleeve (হাতা)</th>
                    <th className="py-3.5 px-3">Height Guide</th>
                    <th className="py-3.5 px-3">Weight Guide</th>
                    {onSelectSize && <th className="py-3.5 px-3 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-medium">
                  {activeChart.chartRows.map((row) => {
                    const isRecommended = recommendation.recommendedSize === row.size;
                    return (
                      <tr 
                        key={row.size}
                        className={`transition-colors ${
                          isRecommended ? 'bg-amber-950/40 text-white font-bold' : 'hover:bg-zinc-900/80 bg-zinc-950 text-zinc-300'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white font-mono">{row.size}</span>
                            {isRecommended && (
                              <span className="text-[10px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded uppercase">
                                Recommended
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-zinc-200">
                          {measurementUnit === 'inches' ? `${row.chestInches}"` : `${row.chestCm} cm`}
                        </td>
                        <td className="py-3.5 px-3 text-zinc-200">
                          {measurementUnit === 'inches' ? `${row.lengthInches}"` : `${row.lengthCm} cm`}
                        </td>
                        <td className="py-3.5 px-3 text-zinc-200">
                          {measurementUnit === 'inches' ? `${row.shoulderInches}"` : `${row.shoulderCm} cm`}
                        </td>
                        <td className="py-3.5 px-3 text-zinc-200">
                          {measurementUnit === 'inches' ? `${row.sleeveInches}"` : `${row.sleeveCm} cm`}
                        </td>
                        <td className="py-3.5 px-3 text-zinc-400">
                          {row.recommendedHeightFt}
                        </td>
                        <td className="py-3.5 px-3 text-zinc-400 font-semibold">
                          {row.recommendedWeightKg}
                        </td>
                        {onSelectSize && (
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleApplySize(row.size)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Select {row.size}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Fit Tips Box */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ফ্যাক্টরি ফিটিং টিপস ও পরামর্শ:</span>
              </div>
              <ul className="space-y-1 text-zinc-300 list-disc list-inside font-bangla">
                {activeChart.fitTipsBn.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HOW TO MEASURE                                                     */}
        {/* ========================================================================= */}
        {activeTab === 'measure' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header intro */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1.5">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>সঠিক মাপ নেওয়ার সহজ নিয়মাবলী (How to Measure Accurately)</span>
              </h3>
              <p className="text-zinc-400 font-bangla leading-relaxed">
                অনলাইনে পোশাক কেনার সময় আপনার পছন্দের কোনো আরামদায়ক শার্ট টেবিলে বিছিয়ে ফিতা দিয়ে মেপে নিন অথবা নিজের শরীরের মাপ নিন। নিচে ৪টি মূল পরিমাপের নিয়ম তুলে ধরা হলো:
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HOW_TO_MEASURE_STEPS.map((item) => (
                <div 
                  key={item.step}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500 transition-all shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black text-amber-400 font-black text-sm flex items-center justify-center shrink-0 border border-zinc-700">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                      <p className="text-[11px] font-bangla text-amber-400 font-bold">{item.titleBn}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 font-bangla leading-relaxed">
                    {item.instructionBn}
                  </p>

                  <div className="p-2 rounded-lg bg-zinc-950 text-[11px] text-zinc-400 space-y-0.5 border border-zinc-800">
                    <strong className="text-zinc-200 block font-sans">💡 Flat Shirt Tip (শার্ট মেপে দেখার নিয়ম):</strong>
                    <span className="font-bangla">{item.flatGarmentTipBn}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* General Advice Banner */}
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>১০০% ফিটিং নিশ্চয়তা ও নো-রিস্ক এক্সচেঞ্জ</span>
              </div>
              <p className="font-bangla leading-relaxed text-emerald-300">
                সাইজ নিয়ে কোনো দ্বিধা থাকলে ডেলিভারি পাওয়ার পর ট্রায়াল দিন। যদি সামান্য ঢিলে বা টাইট হয়, আমাদের কল বা হোয়াটসঅ্যাপ করলেই দ্রুত সাইজ পরিবর্তন করে দেব।
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Modal Footer */}
      <div className="bg-black px-5 sm:px-8 py-3.5 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="font-bangla">সাভার কারখানায় নিজস্ব সেলাই ও কোয়ালিটি কন্ট্রোল</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openWhatsAppChat("Hello! I need assistance with Sider Fashion sizing.")}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Sizing Help (WhatsApp)</span>
          </button>

          {!asSection && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-lg transition-colors cursor-pointer border border-zinc-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (asSection) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div id="size-guide-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="size-guide-modal-content"
        className="w-full max-w-4xl max-h-[92vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
