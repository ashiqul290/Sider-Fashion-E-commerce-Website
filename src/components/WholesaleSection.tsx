import React, { useState, useMemo } from 'react';
import { 
  Factory, 
  Building2, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  Percent, 
  Package, 
  TrendingUp,
  Boxes,
  Truck,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Info,
  Phone,
  Search,
  Layers,
  Check,
  ChevronDown,
  X,
  Ruler,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshDistricts';
import { BRAND_CONTACTS, getWholesaleTierPrice } from '../data/products';
import { Product, RetailCategoryKey } from '../types';

const WHOLESALE_CATEGORY_TABS: { key: RetailCategoryKey; label: string; labelBn: string; badge?: string }[] = [
  { key: 'all', label: 'ALL', labelBn: 'সকল পাইকারি পোশাক' },
  { key: 'shirt', label: 'SHIRT', labelBn: 'শার্ট' },
  { key: 'katua', label: 'KATUA', labelBn: 'কতুয়া' },
  { key: 'mens', label: "MEN'S", labelBn: 'মেনস কালেকশন' },
  { key: 'new-arrival', label: 'NEW ARRIVAL', labelBn: 'নতুন কালেকশন', badge: 'Hot' },
];

export const WholesaleSection: React.FC = () => {
  const { products, submitWholesaleInquiry, openWhatsAppChat, openSizeGuide } = useCart();

  // Independent Wholesale category and search filter state
  const [wholesaleCategory, setWholesaleCategory] = useState<RetailCategoryKey>('all');
  const [wholesaleSearch, setWholesaleSearch] = useState<string>('');
  const [wholesaleSort, setWholesaleSort] = useState<'moq' | 'price-low' | 'price-high' | 'newest'>('moq');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [district, setDistrict] = useState('Dhaka City (North / South)');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedColor, setSelectedColor] = useState(products[0]?.colors[0]?.name || 'Standard');
  
  // Size-wise breakdown quantities
  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>({
    S: 0,
    M: 6,
    L: 12,
    XL: 6,
    XXL: 0
  });

  const [additionalNote, setAdditionalNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState('');

  // Filtered wholesale products based on independent wholesale category & search
  const filteredWholesaleProducts = useMemo(() => {
    let list = products.filter(p => {
      // 1. Category Filter
      if (wholesaleCategory === 'shirt') {
        if (p.category !== 'mens-shirts') return false;
      } else if (wholesaleCategory === 'katua') {
        if (p.category !== 'mens-katua') return false;
      } else if (wholesaleCategory === 'mens') {
        if (p.category !== 'mens-shirts' && p.category !== 'mens-katua' && p.category !== 'mens-fashion') {
          return false;
        }
      } else if (wholesaleCategory === 'new-arrival') {
        if (!p.isNewArrival) return false;
      }

      // 2. Search query
      if (wholesaleSearch.trim()) {
        const q = wholesaleSearch.toLowerCase().trim();
        const mName = p.name.toLowerCase().includes(q);
        const mNameBn = p.nameBn.includes(q);
        const mCode = p.code.toLowerCase().includes(q);
        const mFabric = p.fabric.toLowerCase().includes(q);
        if (!mName && !mNameBn && !mCode && !mFabric) return false;
      }

      return true;
    });

    // Sorting
    if (wholesaleSort === 'price-low') {
      list.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    } else if (wholesaleSort === 'price-high') {
      list.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    } else if (wholesaleSort === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return list;
  }, [products, wholesaleCategory, wholesaleSearch, wholesaleSort]);

  // Selected product object
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Update selected color when product changes
  React.useEffect(() => {
    if (selectedProduct && selectedProduct.colors.length > 0) {
      setSelectedColor(selectedProduct.colors[0].name);
    }
  }, [selectedProductId, selectedProduct]);

  // Calculate total ordered quantity from breakdown
  const totalQuantity = useMemo(() => {
    return Object.values(sizeBreakdown).reduce((acc: number, qty: number) => acc + (Number(qty) || 0), 0);
  }, [sizeBreakdown]);

  // Calculate dynamic tier price per piece
  const { pricePerPiece, tierLabel } = useMemo(() => {
    if (!selectedProduct) return { pricePerPiece: 450, tierLabel: 'Standard' };
    return getWholesaleTierPrice(selectedProduct, Math.max(totalQuantity, selectedProduct.wholesaleMOQ || 12));
  }, [selectedProduct, totalQuantity]);

  // Calculate total estimated wholesale bill
  const totalWholesaleAmount = totalQuantity * pricePerPiece;

  const handleSizeChange = (sizeKey: string, val: string) => {
    const parsed = Math.max(0, parseInt(val, 10) || 0);
    setSizeBreakdown(prev => ({ ...prev, [sizeKey]: parsed }));
  };

  const handleSelectProductForWholesale = (product: Product) => {
    setSelectedProductId(product.id);
    const element = document.getElementById('wholesale-order-form-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Preset size ratio helpers
  const applyPresetRatio = (pack: '12-starter' | '24-balanced' | '50-bulk') => {
    if (pack === '12-starter') {
      setSizeBreakdown({ S: 0, M: 4, L: 5, XL: 3, XXL: 0 });
    } else if (pack === '24-balanced') {
      setSizeBreakdown({ S: 2, M: 8, L: 10, XL: 4, XXL: 0 });
    } else if (pack === '50-bulk') {
      setSizeBreakdown({ S: 5, M: 15, L: 20, XL: 8, XXL: 2 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;
    if (totalQuantity < (selectedProduct?.wholesaleMOQ || 12)) {
      alert(`Minimum wholesale order is ${selectedProduct?.wholesaleMOQ || 12} pieces per design lot.`);
      return;
    }

    const breakdownString = Object.entries(sizeBreakdown)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([sz, qty]) => `${sz}: ${qty}`)
      .join(', ');

    const result = submitWholesaleInquiry({
      customerName,
      businessName: businessName || 'Clothing Retailer / Reseller',
      phone,
      whatsappNumber: whatsappNumber || phone,
      productCode: selectedProduct?.code || 'SF-BULK',
      productName: selectedProduct?.name || 'Sider Fashion Collection',
      targetQuantity: totalQuantity,
      sizeBreakdown,
      targetColor: selectedColor,
      district,
      area: '',
      fullAddress: deliveryAddress,
      appliedTierPrice: pricePerPiece,
      totalEstimatedAmount: totalWholesaleAmount,
      additionalMessage: additionalNote
    });

    if (result.success && result.inquiry) {
      setSubmittedInquiryId(result.inquiry.id);
      setIsSubmitted(true);
    } else {
      alert(result.error || 'Failed to submit wholesale order.');
    }
  };

  const handleSendToWhatsApp = () => {
    const breakdownString = Object.entries(sizeBreakdown)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([sz, qty]) => `${sz}: ${qty} pcs`)
      .join(' | ');

    const formattedMsg = `*SIDER FASHION WHOLESALE B2B ORDER [${submittedInquiryId || 'NEW'}]*\n\n` +
      `🏢 *Shop / Business:* ${businessName || 'Clothing Store'}\n` +
      `👤 *Proprietor / Buyer:* ${customerName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📍 *District & Address:* ${district} — ${deliveryAddress || 'Address on request'}\n\n` +
      `📦 *Product Ordered:* ${selectedProduct?.name} (${selectedProduct?.code})\n` +
      `🎨 *Color Choice:* ${selectedColor}\n` +
      `📏 *Size Breakdown:* ${breakdownString || 'As per standard pack'}\n` +
      `🔢 *Total Quantity:* ${totalQuantity} pcs\n` +
      `🏷️ *Wholesale Rate:* ৳${pricePerPiece}/pc (${tierLabel})\n` +
      `💰 *Estimated Total:* ৳${totalWholesaleAmount.toLocaleString()}\n\n` +
      `📝 *Special Request:* ${additionalNote || 'Please share formal invoice & delivery timeline.'}`;

    openWhatsAppChat(formattedMsg);
  };

  return (
    <div id="wholesale-page-container" className="bg-black min-h-screen py-10 sm:py-16 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. B2B HERO BANNER: FACTORY & WHOLESALE HUB                              */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl bg-zinc-950 text-white overflow-hidden p-8 sm:p-12 border border-zinc-800 shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-black px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Factory className="w-4 h-4" />
              <span>Direct Factory Manufacturing &amp; Wholesale Partner</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-sans text-white leading-tight">
                Sider Fashion Wholesale
              </h1>
              <p className="text-lg sm:text-xl font-bold text-amber-400 font-sans mt-2">
                Buy Directly From Our Own Factory
              </p>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-bangla">
              সাভার আশুলিয়ায় আমাদের নিজস্ব কারখানায় উৎপাদিত প্রিমিয়াম শার্ট ও কতুয়া। দোকানদার, শোরুম মালিক ও অনলাইন সেলারদের জন্য পাইকারি রেটে সুলভ মূল্যে প্রস্তুত স্টক। সর্বনিম্ন অর্ডার ১২ পিস।
            </p>

            <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-wrap items-center gap-6 text-xs text-zinc-300 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span><strong>MOQ:</strong> 12 pcs / design</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span><strong>Factory:</strong> Ashulia, Savar, Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span><strong>Nationwide Courier:</strong> 64 Districts</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('wholesale-order-form-container');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Configure Bulk Order (অর্ডার তৈরি করুন)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openWhatsAppChat("Hello Sider Fashion! I want to discuss wholesale prices and request your current B2B catalog.", 'wholesale')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Wholesale WhatsApp ({BRAND_CONTACTS.wholesalePhone})</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TRUST & ADVANTAGE TILES                                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Factory Price</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-bangla">
              কোনো দালাল বা মিডলম্যান ছাড়া সরাসরি সাভার ফ্যাক্টরি থেকে পোশাক কিনুন সর্বোচ্চ প্রফিট মার্জিনে।
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Flexible Size Ratio</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-bangla">
              আপনার এলাকার চাহিদা অনুযায়ী S, M, L, XL, XXL সাইজের যেকোনো রেশিওতে অর্ডার সাজাতে পারবেন।
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Tiered Bulk Discounts</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-bangla">
              ১২ পিস থেকে শুরু করে ৫০+ ও ১০০+ পিসে ধাপে ধাপে স্পেশাল ভলিউম ডিসকাউন্ট রেট প্রযোজ্য।
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Nationwide Transport</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-bangla">
              সুন্দরবন, এসএ পরিবহন, করতোয়া কিংবা স্টেডফাস্ট কুরিয়ারে ৬৪ জেলার যেকোনো বাজারে পার্সেল সুবিধা।
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. INDEPENDENT WHOLESALE CATEGORIES, SEARCH & CATALOG                    */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                B2B Factory Catalog &amp; MOQ Rates
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Wholesale Product Catalog
              </h2>
              <p className="text-xs text-zinc-400 font-bangla mt-1">
                সকল প্রডাক্টে ফ্যাক্টরি রেট ও ১২ পিস MOQ প্রযোজ্য। আপনার পছন্দের ডিজাইন সিলেক্ট করে নিচে অর্ডার ফর্ম পূরণ করুন।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-200 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 shadow-2xs">
                {filteredWholesaleProducts.length} Wholesale Styles
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800/60">
                MOQ: 12 Pcs
              </span>
            </div>
          </div>

          {/* Wholesale Category Tabs Pill Bar */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {WHOLESALE_CATEGORY_TABS.map((tab) => {
              const isActive = wholesaleCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`wholesale-category-tab-${tab.key}`}
                  type="button"
                  onClick={() => setWholesaleCategory(tab.key)}
                  className={`group relative shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md font-black'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800 shadow-2xs'
                  }`}
                >
                  <span className="tracking-wider">{tab.label}</span>
                  <span className={`text-[11px] font-bangla hidden sm:inline ${isActive ? 'text-zinc-900 font-bold' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                    ({tab.labelBn})
                  </span>
                  {tab.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${isActive ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Wholesale Search and Sort Bar */}
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="wholesale-search-input"
                type="text"
                value={wholesaleSearch}
                onChange={(e) => setWholesaleSearch(e.target.value)}
                placeholder="Search wholesale designs by name, product code or fabric (e.g. Oxford, Katua)..."
                className="w-full pl-10 pr-10 py-2 bg-zinc-950 hover:bg-black focus:bg-black text-white placeholder-zinc-500 text-xs sm:text-sm rounded-xl border border-zinc-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
              {wholesaleSearch && (
                <button
                  type="button"
                  onClick={() => setWholesaleSearch('')}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                id="wholesale-sort-select"
                value={wholesaleSort}
                onChange={(e) => setWholesaleSort(e.target.value as any)}
                className="pl-3.5 pr-8 py-2 text-xs font-bold bg-zinc-950 hover:bg-black rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
              >
                <option value="moq">Default MOQ &amp; Popularity</option>
                <option value="price-low">Wholesale Rate: Low to High</option>
                <option value="price-high">Wholesale Rate: High to Low</option>
                <option value="newest">New Factory Drops First</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Wholesale Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWholesaleProducts.map((product) => {
              const isSelectedForForm = selectedProductId === product.id;
              return (
                <div
                  key={product.id}
                  id={`wholesale-product-card-${product.id}`}
                  className={`bg-zinc-900 rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all duration-200 ${
                    isSelectedForForm 
                      ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-xl' 
                      : 'border-zinc-800 hover:border-zinc-700 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-zinc-950">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute top-2 left-2 bg-black/90 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800">
                        {product.code}
                      </span>
                      <span className="absolute top-2 right-2 bg-amber-500 text-black font-sans text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                        MOQ: {product.wholesaleMOQ || 12} pcs
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase">
                        {product.categoryName}
                      </span>
                      <h3 className="font-bold text-white text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-400 font-bangla line-clamp-1">
                        {product.nameBn}
                      </p>
                    </div>

                    {/* Tiered Price Grid for Wholesale Buyers */}
                    <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 space-y-2">
                      <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                        <span>Wholesale Rate Tiers</span>
                        <span className="text-amber-400 font-mono font-bold">Factory Direct</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-center">
                        {product.wholesaleTiers?.map((tier, idx) => (
                          <div key={idx} className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                            <span className="text-[9px] text-zinc-400 block font-medium">
                              {tier.label}
                            </span>
                            <span className="text-xs font-black text-amber-400 block font-sans">
                              ৳{tier.pricePerPiece}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 space-y-1">
                      <div><strong className="text-zinc-300">Fabric:</strong> {product.fabric}</div>
                      <div><strong className="text-zinc-300">Colors:</strong> {product.colors.map(c => c.name).join(', ')}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleSelectProductForWholesale(product)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelectedForForm
                          ? 'bg-amber-500 text-black shadow-xs font-black'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                    >
                      <span>{isSelectedForForm ? 'Selected for Order Builder ✓' : 'Configure Bulk Order'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWholesaleProducts.length === 0 && (
            <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 p-8 space-y-3">
              <p className="text-sm font-bold text-zinc-300">No wholesale items match your search.</p>
              <button
                onClick={() => {
                  setWholesaleCategory('all');
                  setWholesaleSearch('');
                }}
                className="text-xs bg-amber-500 text-black font-bold px-4 py-2 rounded-xl"
              >
                Reset Wholesale Filters
              </button>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 4. WHOLESALE BULK ORDER FORM & INQUIRY MODAL                             */}
        {/* ========================================================================= */}
        <div id="wholesale-order-form-container" className="bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-800 shadow-2xl">
          
          {!isSubmitted ? (
            <form id="wholesale-bulk-order-form" onSubmit={handleSubmit} className="space-y-8">
              
              <div className="border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-amber-400" />
                    <span>Wholesale Bulk Order &amp; Quotation Form</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-bangla mt-1">
                    আপনার দোকানের তথ্য ও সাইজ রেশিও সিলেক্ট করুন। ক্যালকুলেটরে সরাসরি পাইকারি বিল দেখুন।
                  </p>
                </div>

                <div className="text-xs bg-amber-950/60 border border-amber-800/60 text-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Factory Hotline: {BRAND_CONTACTS.primaryPhone}</span>
                </div>
              </div>

              {/* 1. Buyer Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-black tracking-wider uppercase text-zinc-500">
                  Step 1: Business &amp; Buyer Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Shop / Business Name (দোকানের নাম) *
                    </label>
                    <input
                      id="wholesale-form-business-name"
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Classic Menswear / Online Boutique"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white placeholder-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Proprietor / Contact Name *
                    </label>
                    <input
                      id="wholesale-form-customer-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tariqul Islam"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white placeholder-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Phone Number (মোবাইল নম্বর) *
                    </label>
                    <input
                      id="wholesale-form-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white placeholder-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      id="wholesale-form-whatsapp"
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Destination District (জেলা) *
                    </label>
                    <select
                      id="wholesale-form-district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white"
                    >
                      {BANGLADESH_DISTRICTS.map((d, i) => (
                        <option key={i} value={d.name}>
                          {d.name} ({d.nameBn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Shop Address / Preferred Courier Branch
                    </label>
                    <input
                      id="wholesale-form-address"
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Shop #12, New Market, Chittagong (SA Paribahan Branch)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white placeholder-zinc-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Product & Size Breakdown */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-black tracking-wider uppercase text-zinc-500">
                  Step 2: Lot Selection &amp; Size Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Selected Product Design *
                    </label>
                    <select
                      id="wholesale-form-product-picker"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white font-semibold"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} [{p.code}] — Starting ৳{p.wholesalePrice}/pc
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Color Variant
                    </label>
                    <select
                      id="wholesale-form-color-picker"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white"
                    >
                      {selectedProduct?.colors.map(c => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.nameBn})
                        </option>
                      ))}
                      <option value="Mixed Assorted Colors">Mixed Assorted Colors (মিশ্র সব রং)</option>
                    </select>
                  </div>
                </div>

                {/* Size breakdown input table */}
                <div className="bg-zinc-950 p-4 sm:p-6 rounded-2xl border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Size Quantity Breakdown (পিস সংখ্যা দিন)
                      </span>
                      <span className="text-[11px] text-zinc-400 font-bangla">
                        প্রতিটি সাইজের কত পিস চান তা নির্ধারণ করুন (সর্বমোট নূন্যতম ১২ পিস)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block">Total Quantity</span>
                      <span className={`text-base font-mono font-black ${totalQuantity >= 12 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {totalQuantity} Pcs {totalQuantity < 12 && '(MOQ 12 required)'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 sm:gap-4">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <div key={sz} className="text-center space-y-1">
                        <label className="text-xs font-black text-zinc-300 block">
                          Size {sz}
                        </label>
                        <input
                          id={`wholesale-size-input-${sz}`}
                          type="number"
                          min="0"
                          value={sizeBreakdown[sz] || 0}
                          onChange={(e) => handleSizeChange(sz, e.target.value)}
                          className="w-full text-center py-2 px-1 text-sm font-bold rounded-lg border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-900 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Live Price Calculation Summary */}
              <div className="bg-black text-white p-5 sm:p-6 rounded-2xl space-y-4 border border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold tracking-wider uppercase text-amber-400">
                      Wholesale Price Calculation
                    </span>
                  </div>

                  <span className="text-xs text-zinc-400">
                    Tier Applied: <strong className="text-white">{tierLabel}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
                  <div>
                    <span className="block text-zinc-400">Product Code:</span>
                    <strong className="text-white text-sm">{selectedProduct?.code}</strong>
                  </div>
                  <div>
                    <span className="block text-zinc-400">Wholesale Price / Piece:</span>
                    <strong className="text-amber-400 text-sm">৳{pricePerPiece}</strong>
                  </div>
                  <div>
                    <span className="block text-zinc-400">Total Lot Bill:</span>
                    <strong className="text-xl font-black text-white font-sans">
                      ৳{totalWholesaleAmount.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Special Notes & Submit */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Special Note / Custom Label Requirements
                  </label>
                  <textarea
                    id="wholesale-form-note"
                    rows={2}
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Provide any specific instructions regarding delivery date, packaging, or recurring stock requirements..."
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-950 text-white placeholder-zinc-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    id="submit-wholesale-order-btn"
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Wholesale Order Slip</span>
                  </button>

                  <button
                    id="wholesale-direct-whatsapp-chat-btn"
                    type="button"
                    onClick={handleSendToWhatsApp}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>

            </form>
          ) : (
            /* Success State */
            <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Wholesale Order Slip Submitted!
                </h3>
                <span className="inline-block text-xs font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-md">
                  Inquiry ID: {submittedInquiryId}
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto font-bangla pt-2">
                  ধন্যবাদ <strong>{customerName}</strong>! আপনার দোকানের <strong>({businessName})</strong> জন্য পাইকারি অর্ডার রিকোয়েস্ট গ্রহণ করা হয়েছে। আমাদের ফ্যাক্টরি সেলস ম্যানেজার শীঘ্রই কল করবেন।
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 max-w-md mx-auto text-xs text-left space-y-1.5">
                <div><strong>Product:</strong> {selectedProduct?.name} ({selectedProduct?.code})</div>
                <div><strong>Total Quantity:</strong> {totalQuantity} pcs</div>
                <div><strong>Estimated Bill:</strong> ৳{totalWholesaleAmount.toLocaleString()}</div>
                <div><strong>Destination:</strong> {district}</div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="forward-wholesale-whatsapp-btn"
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Forward Slip to WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-zinc-400 hover:text-white underline font-semibold py-2 cursor-pointer"
                >
                  Create Another Wholesale Order
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
