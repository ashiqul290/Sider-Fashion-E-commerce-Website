import React from 'react';
import { ShoppingBag, Building2, ArrowRight, Sparkles, Factory, CheckCircle2, Truck, ShieldCheck, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';

export const DualPortalChoiceBanner: React.FC = () => {
  const { setCurrentView } = useCart();

  const handleGoToRetail = () => {
    setCurrentView('retail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToWholesale = () => {
    setCurrentView('wholesale');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="dual-portal-choice-section" className="py-8 sm:py-12 bg-zinc-950 border-b border-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Choose Your Shopping Mode</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            How Would You Like To Shop Today?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-bangla">
            কয়েক পিস খুচরা কিনতে চান নাকি দোকানের জন্য পাইকারি লট? আপনার পছন্দমতো সেকশন সিলেক্ট করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* 1. RETAIL PORTAL CARD */}
          <div 
            id="portal-card-retail"
            onClick={handleGoToRetail}
            className="group relative bg-black hover:bg-zinc-900 border-2 border-zinc-800 hover:border-amber-500 rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-zinc-800 text-amber-300 px-3 py-1 rounded-full border border-zinc-700">
                  Individual &amp; Small Orders
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-1">
                  Want to buy a few pieces?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                  SHOP RETAIL (খুচরা শপ)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-bangla mt-2 leading-relaxed">
                  ১ পিস থেকে শুরু করে আপনার নিজস্ব ব্যবহারের জন্য যেকোনো শার্ট ও কতুয়া কিনুন। রেডি সাইজ ও দ্রুত হোম ডেলিভারি।
                </p>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No minimum order — buy 1 piece or more</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cash on Delivery (COD), bKash, Nagad</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Easy 7-day return &amp; size exchange policy</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 px-5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Explore Retail Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 2. WHOLESALE PORTAL CARD */}
          <div 
            id="portal-card-wholesale"
            onClick={handleGoToWholesale}
            className="group relative bg-black hover:bg-zinc-900 border-2 border-zinc-800 hover:border-amber-500 rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Factory className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-amber-500 text-black px-3 py-1 rounded-full font-sans">
                  Savar Factory Direct
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-1">
                  Want to buy in bulk?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                  WHOLESALE (পাইকারি হাব)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-bangla mt-2 leading-relaxed">
                  দোকান, শোরুম ও অনলাইন বিক্রেতাদের জন্য সাভার ফ্যাক্টরি রেটে পাইকারি লট। ফ্লেক্সিবল সাইজ রেশিও ও সারা দেশে পার্সেল।
                </p>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>MOQ:</strong> 12 pieces per design style</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Volume discounts at 12+, 50+, 100+ pcs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Direct WhatsApp B2B support: {BRAND_CONTACTS.wholesalePhone}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-zinc-800 hover:bg-amber-500 text-white hover:text-black font-black py-3.5 px-5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Visit Wholesale Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
