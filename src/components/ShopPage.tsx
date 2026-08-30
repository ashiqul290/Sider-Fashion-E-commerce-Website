import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Sparkles, 
  Grid, 
  ArrowUpDown, 
  Check, 
  RotateCcw,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  X,
  Tag,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';
import { RetailCategoryKey, Product } from '../types';
import { RETAIL_CATEGORY_TABS } from '../data/products';

export const ShopPage: React.FC = () => {
  const { products, activeCategoryFilter, setActiveCategoryFilter } = useCart();

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<RetailCategoryKey>(activeCategoryFilter || 'all');
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Secondary filters
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Sync with global category filter if triggered from navbar
  React.useEffect(() => {
    if (activeCategoryFilter) {
      setSelectedCategory(activeCategoryFilter);
    }
  }, [activeCategoryFilter]);

  const handleCategorySelect = (key: RetailCategoryKey) => {
    setSelectedCategory(key);
    setActiveCategoryFilter(key);
  };

  // Distinct colors extracted from current products
  const allColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    products.forEach(p => {
      p.colors.forEach(c => {
        if (!map.has(c.name)) {
          map.set(c.name, { name: c.name, hex: c.hex });
        }
      });
    });
    return Array.from(map.values());
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = products.filter(product => {
      // 1. Category Filtering
      if (selectedCategory === 'shirt') {
        if (product.category !== 'mens-shirts') return false;
      } else if (selectedCategory === 'katua') {
        if (product.category !== 'mens-katua') return false;
      } else if (selectedCategory === 'mens') {
        // Includes both shirts and katua
        if (product.category !== 'mens-shirts' && product.category !== 'mens-katua' && product.category !== 'mens-fashion') {
          return false;
        }
      } else if (selectedCategory === 'new-arrival') {
        if (!product.isNewArrival) return false;
      }

      // 2. Search Query (Name, Bangla Name, Product Code, Tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesNameBn = product.nameBn.includes(q);
        const matchesCode = product.code.toLowerCase().includes(q);
        const matchesTag = product.tags.some(t => t.toLowerCase().includes(q));
        const matchesFabric = product.fabric.toLowerCase().includes(q);
        if (!matchesName && !matchesNameBn && !matchesCode && !matchesTag && !matchesFabric) {
          return false;
        }
      }

      // 3. Price Filter
      if (product.retailPrice > maxPrice) return false;

      // 4. Size Filter
      if (selectedSize !== 'all') {
        if (!product.sizes.some(s => s.size === selectedSize)) return false;
      }

      // 5. Color Filter
      if (selectedColor !== 'all') {
        if (!product.colors.some(c => c.name === selectedColor)) return false;
      }

      // 6. In Stock Filter
      if (inStockOnly) {
        if (product.stock <= 0) return false;
      }

      return true;
    });

    // Sort order
    if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => a.retailPrice - b.retailPrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.retailPrice - a.retailPrice);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchQuery, maxPrice, selectedSize, selectedColor, inStockOnly, sortBy]);

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (selectedColor !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (maxPrice < 1500 ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setActiveCategoryFilter(null);
    setSearchQuery('');
    setSelectedSize('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setMaxPrice(1500);
    setSortBy('popular');
  };

  return (
    <div id="shop-page-container" className="py-8 sm:py-12 bg-black min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="space-y-2 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
            <span className="hover:text-white cursor-pointer" onClick={() => handleCategorySelect('all')}>Sider Fashion</span>
            <span>/</span>
            <span className="text-white font-bold">Retail</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-amber-400 font-bold uppercase">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/60 mb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Single & Small Quantity Orders (খুচরা বিক্রয়)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-sans tracking-tight">
                Sider Fashion Retail
              </h1>
              <p className="text-sm sm:text-base font-semibold text-zinc-300 font-sans mt-1">
                Shop Our Latest Fashion Collection
              </p>
              <p className="text-xs text-zinc-400 font-bangla mt-0.5">
                ১ পিস থেকে শুরু করে আপনার পছন্দের শার্ট ও কতুয়া কিনুন সহজে — সারা দেশে ক্যাশ অন ডেলিভারি (COD), বিকাশ ও নগদ পেমেন্টে।
              </p>
            </div>

            {/* Results Count & Retail Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-200 bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800 shadow-2xs">
                {filteredProducts.length} Items Available
              </span>
            </div>
          </div>

          {/* Delivery & Assurance Strip for Retail Buyers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="flex items-center gap-2.5 bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-zinc-300"><strong>Inside Dhaka:</strong> ৳70 (24–48h)</span>
            </div>
            <div className="flex items-center gap-2.5 bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-zinc-300"><strong>Outside Dhaka:</strong> ৳120 (48–72h)</span>
            </div>
            <div className="flex items-center gap-2.5 bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <span className="text-zinc-300"><strong>Payment:</strong> COD / bKash / Nagad</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PART 2 & PART 3: PREMIUM CATEGORY NAVIGATION SECTION                      */}
        {/* ========================================================================= */}
        <div id="retail-category-navigation" className="space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Filter by Category (ক্যাটাগরি)</span>
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleCategorySelect('all')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                Reset to All
              </button>
            )}
          </div>

          {/* Category Tabs Pill Bar */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {RETAIL_CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`category-tab-${tab.key}`}
                  type="button"
                  onClick={() => handleCategorySelect(tab.key)}
                  className={`group relative shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md font-extrabold'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800 shadow-2xs'
                  }`}
                >
                  <span className="tracking-wider">{tab.label}</span>
                  
                  {/* Bangla Subtext */}
                  <span className={`text-[11px] font-bangla hidden sm:inline ${isActive ? 'text-zinc-900 font-bold' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                    ({tab.labelBn})
                  </span>

                  {/* Hot/New Badge */}
                  {tab.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${isActive ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PART 4: SEARCH, FILTER BAR & SORTING CONTROLS                             */}
        {/* ========================================================================= */}
        <div className="bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="shop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, color, or product code (e.g. SF-SH-101)..."
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 hover:bg-black focus:bg-black text-white placeholder-zinc-500 text-xs sm:text-sm rounded-xl border border-zinc-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Controls: Filter Drawer Toggle & Sort Dropdown */}
            <div className="flex items-center gap-3">
              
              {/* Filter Button */}
              <button
                id="toggle-filter-drawer-btn"
                type="button"
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  showFilterDrawer || activeFiltersCount > 0
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-black text-amber-400 text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  id="shop-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pl-3.5 pr-8 py-2.5 text-xs font-bold bg-zinc-950 hover:bg-black rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                >
                  <option value="popular">Popularity (জনপ্রিয়)</option>
                  <option value="newest">Newest Arrivals (নতুন)</option>
                  <option value="price-low">Price: Low to High (দাম: কম থেকে বেশি)</option>
                  <option value="price-high">Price: High to Low (দাম: বেশি থেকে কম)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Expandable Advanced Filters Accordion */}
          {showFilterDrawer && (
            <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in duration-200">
              
              {/* 1. Size Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Size (সাইজ)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-500'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                        }`}
                      >
                        {sz === 'all' ? 'All' : sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Color Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Color (রং)
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedColor('all')}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      selectedColor === 'all'
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    All
                  </button>
                  {allColors.slice(0, 6).map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        title={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-6 h-6 rounded-full border transition-transform flex items-center justify-center cursor-pointer ${
                          isSelected ? 'ring-2 ring-amber-400 scale-110' : 'border-zinc-700 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3 h-3 ${c.hex === '#f8fafc' || c.hex === '#fffff0' ? 'text-zinc-950' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Filter Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span className="uppercase tracking-wider">Max Price</span>
                  <span className="text-amber-400 font-sans">৳{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="700"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>৳700</span>
                  <span>৳1,500</span>
                </div>
              </div>

              {/* 4. Availability & Clear */}
              <div className="space-y-2 flex flex-col justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Availability
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>In Stock Only (রেডি স্টক)</span>
                </label>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer pt-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All Filters</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* Active Filter Badges */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-400 text-[11px]">Active Filters:</span>
              
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
                  Category: {selectedCategory.toUpperCase()}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => handleCategorySelect('all')} />
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-amber-950/60 text-amber-300 px-2.5 py-1 rounded-md font-medium border border-amber-800/60">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
                </span>
              )}

              {selectedSize !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
                  Size: {selectedSize}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedSize('all')} />
                </span>
              )}

              {selectedColor !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
                  Color: {selectedColor}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedColor('all')} />
                </span>
              )}

              {maxPrice < 1500 && (
                <span className="inline-flex items-center gap-1 bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
                  Under ৳{maxPrice}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setMaxPrice(1500)} />
                </span>
              )}
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* PART 5: RETAIL PRODUCT GRID                                              */}
        {/* ========================================================================= */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No matching products found</h3>
              <p className="text-xs text-zinc-400 font-bangla">
                আপনার খোঁজা ক্যাটাগরি বা ফিল্টারে কোনো পণ্য পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-amber-500 text-black text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Show All Products</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
