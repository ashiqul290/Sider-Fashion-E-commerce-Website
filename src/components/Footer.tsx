import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  RotateCcw, 
  Truck, 
  Factory, 
  Facebook, 
  ExternalLink, 
  Lock 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';

export const Footer: React.FC = () => {
  const { 
    setCurrentView, 
    setIsTrackingOpen, 
    setIsAdminAuthModalOpen,
    setIsAdminPanelOpen,
    currentAdminUser,
    setActiveCategoryFilter,
    openWhatsAppChat,
    openLegalModal,
    settings,
    contacts,
    socialLinks,
    categories
  } = useCart();

  const handleCategoryNav = (cat: string) => {
    setActiveCategoryFilter(cat);
    setCurrentView('retail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewNav = (view: 'home' | 'retail' | 'wholesale' | 'contact' | 'size-guide' | 'faq' | 'categories') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const primaryPhone = contacts.find(c => c.type === 'hotline')?.value || settings.primaryPhone || BRAND_CONTACTS.primaryPhone;
  const secondaryPhone = contacts.find(c => c.type === 'wholesale')?.value || settings.secondaryPhone || BRAND_CONTACTS.secondaryPhone;
  const factoryAddr = contacts.find(c => c.type === 'factory')?.value || settings.factoryAddress || 'Ashulia Industrial Zone, Savar, Dhaka, Bangladesh';
  const fbLink = socialLinks.find(s => s.platform === 'facebook')?.url || settings.facebookUrl || BRAND_CONTACTS.facebookUrl;

  return (
    <footer id="main-footer" className="bg-black text-zinc-300 py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800/80">
          
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Own Manufacturing</h4>
              <p className="text-xs text-zinc-400 font-bangla mt-0.5">আশুলিয়া, সাভার নিজস্ব কারখানায় তৈরি</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Check on Delivery</h4>
              <p className="text-xs text-zinc-400 font-bangla mt-0.5">ডেলিভারিম্যানের সামনে দেখে নেওয়ার সুযোগ</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nationwide Delivery</h4>
              <p className="text-xs text-zinc-400 font-bangla mt-0.5">ঢাকা ৳{settings.deliveryFeeInsideDhaka} / সারা বাংলাদেশ ৳{settings.deliveryFeeOutsideDhaka}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant WhatsApp Care</h4>
              <p className="text-xs text-zinc-400 font-bangla mt-0.5">হটলাইন: {primaryPhone}</p>
            </div>
          </div>

        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 py-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-xl shadow-md">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-white uppercase font-sans">
                {settings.brandName || 'SIDER FASHION'}
              </span>
            </div>

            <p className="text-xs text-amber-400 font-bold font-bangla tracking-wide">
              {settings.taglineBn || 'নিজস্ব কারখানায় তৈরি — পাইকারি ও খুচরা বিক্রি'}
            </p>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {settings.tagline || "Sider Fashion is a premier Bangladeshi apparel brand producing high-quality men's shirts and katua directly from our Savar factory."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white px-2.5 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                title="Call hotline"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{primaryPhone}</span>
              </a>

              <button
                onClick={() => openWhatsAppChat()}
                className="inline-flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 transition-colors cursor-pointer"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Clothing Portals &amp; Hubs
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => handleViewNav('retail')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left text-amber-400 font-bold"
                >
                  Sider Retail Shop (খুচরা শপ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleViewNav('wholesale')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left text-amber-400 font-bold"
                >
                  Wholesale Factory Hub (পাইকারি)
                </button>
              </li>
              {categories.slice(0, 4).map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => handleCategoryNav(c.key || c.id)}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    {c.name} ({c.nameBn})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Services &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => { setCurrentView('size-guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left text-amber-300 font-semibold"
                >
                  Size Guide &amp; Smart Finder (সাইজ গাইড)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  FAQs (সাধারণ জিজ্ঞাসা)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('returns')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Return &amp; Exchange Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('shipping')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Shipping &amp; Delivery Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Privacy &amp; Data Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left text-amber-400 font-semibold"
                >
                  Track Order Status
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Factory & Location Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Factory Location
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{settings.locationDisplay || 'Ashulia, Savar, Dhaka'}</strong><br />
                  <span className="text-zinc-500 font-bangla">{factoryAddr}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.workingHours || '9:00 AM - 10:00 PM (Everyday)'}</span>
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-1">
                <div className="text-[11px] text-zinc-500">Hotlines (Call / WhatsApp):</div>
                <div className="font-mono text-white font-bold text-xs">{primaryPhone}</div>
                {secondaryPhone && <div className="font-mono text-white font-bold text-xs">{secondaryPhone}</div>}
              </div>
            </div>
          </div>

          {/* Col 5: Dedicated Follow Us Section */}
          <div className="space-y-3" id="footer-follow-us-section">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>Follow Us &amp; Chat</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Stay connected with Sider Fashion for new collections, wholesale updates, and live support.
            </p>

            <div className="space-y-2 pt-1">
              {/* Facebook Link */}
              <a
                id="footer-facebook-link"
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-950/30 transition-all cursor-pointer"
                title="Official Sider Fashion Facebook Page"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Facebook className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                    <span>Facebook</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Official Page
                  </div>
                </div>
              </a>

              {/* WhatsApp Link */}
              <button
                id="footer-whatsapp-link"
                onClick={() => openWhatsAppChat()}
                className="w-full group flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-950/30 transition-all cursor-pointer text-left"
                title="Chat with Sider Fashion on WhatsApp"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <span>WhatsApp</span>
                    <span className="text-[10px] bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-1 rounded">24/7</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {primaryPhone}
                  </div>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <a
                  id="footer-facebook-btn"
                  href={fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[11px] py-2 px-2 rounded-lg transition-colors shadow-xs cursor-pointer text-center"
                >
                  <Facebook className="w-3 h-3 fill-white" />
                  <span>Facebook</span>
                </a>

                <button
                  id="footer-whatsapp-btn"
                  onClick={() => openWhatsAppChat()}
                  className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] py-2 px-2 rounded-lg transition-colors shadow-xs cursor-pointer text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & payment icons */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {settings.brandName || 'Sider Fashion'}. All rights reserved. Made in Ashulia, Savar, Dhaka.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-400 hidden sm:inline">Payment Methods: Cash on Delivery • bKash • Nagad</span>
            <a
              id="footer-staff-access-link"
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('admin');
              }}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-amber-400 transition-colors py-0.5 px-1.5 rounded hover:bg-zinc-900 cursor-pointer"
              title="Staff & Admin Access Portal"
            >
              <Lock className="w-2.5 h-2.5 text-zinc-500" />
              <span>Staff Access</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
