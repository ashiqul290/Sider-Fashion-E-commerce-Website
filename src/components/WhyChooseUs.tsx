import React from 'react';
import { 
  Factory, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  PackageCheck, 
  Headphones, 
  Banknote, 
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';

export const WhyChooseUs: React.FC = () => {
  const { setIsReturnPolicyModalOpen, openWhatsAppChat } = useCart();

  const features = [
    {
      id: 'factory',
      icon: Factory,
      title: 'Own Manufacturing Unit',
      titleBn: 'সাভার ও আশুলিয়ায় নিজস্ব কারখানা',
      description: 'We cut, sew and finish all garments in our own manufacturing facility in Savar & Ashulia. No third-party middlemen.',
      badge: 'Direct Manufacturer'
    },
    {
      id: 'retail-wholesale',
      icon: PackageCheck,
      title: 'Retail & Wholesale Sales',
      titleBn: 'খুচরা ও পাইকারি সরাসরি বিক্রি',
      description: 'Buy a single piece for personal style or order bulk quantities (MOQ 12 pcs) for your clothing showroom or online shop.',
      badge: 'B2C + B2B Ready'
    },
    {
      id: 'quality-check',
      icon: ShieldCheck,
      title: 'Check In Front of Courier',
      titleBn: 'ডেলিভারিম্যানের সামনে চেক করার সুবিধা',
      description: 'Check fabric, stitching, and fitting with the delivery rider. Easy return or size exchange if not completely satisfied.',
      badge: 'Zero Risk Shopping'
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Affordable Nationwide Delivery',
      titleBn: 'সারা দেশে দ্রুত হোম ডেলিভারি',
      description: 'Inside Dhaka City for only ৳70 (24-48 hours) and all 64 districts outside Dhaka for ৳120 (48-72 hours) with Cash on Delivery.',
      badge: '৳70 / ৳120 Rates'
    }
  ];

  const trustPillars = [
    { label: 'Own Factory', labelBn: 'নিজস্ব কারখানা', icon: Factory },
    { label: '100% Quality Checked', labelBn: 'মান যাচাইকৃত', icon: CheckCircle2 },
    { label: 'Cash on Delivery', labelBn: 'ক্যাশ অন ডেলিভারি', icon: Banknote },
    { label: 'Nationwide Delivery', labelBn: 'সারা দেশে ডেলিভারি', icon: Truck },
    { label: 'WhatsApp Live Support', labelBn: '২৪/৭ সাপোর্ট', icon: Headphones }
  ];

  return (
    <section id="why-choose-us-section" className="py-16 sm:py-20 bg-black text-white relative overflow-hidden border-b border-zinc-800">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Sider Fashion Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Why Choose Sider Fashion?
          </h2>
          <p className="text-base text-zinc-400 font-bangla">
            "নিজস্ব কারখানায় তৈরি — পাইকারি ও খুচরা বিক্রি" — সরাসরি প্রস্তুতকারকের কাছ থেকে সেরা মানের পোশাক।
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                id={`feature-card-${f.id}`}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/60 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-black px-2 py-0.5 rounded-sm border border-zinc-800">
                      {f.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">
                      {f.title}
                    </h3>
                    <p className="text-xs font-semibold text-amber-400 font-bangla mt-0.5">
                      {f.titleBn}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {f.description}
                  </p>
                </div>

                {f.id === 'quality-check' && (
                  <button
                    onClick={() => setIsReturnPolicyModalOpen(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold underline text-left pt-2 cursor-pointer"
                  >
                    View Return Policy &rarr;
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-14 pt-10 border-t border-zinc-800">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
            Trusted By Thousands of Retail Customers &amp; Clothing Shop Owners
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {trustPillars.map((p, idx) => {
              const PillarIcon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 shrink-0">
                    <PillarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{p.label}</div>
                    <div className="text-[11px] text-zinc-400 font-bangla">{p.labelBn}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
