import React from 'react';
import { Facebook, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { BRAND_CONTACTS } from '../data/products';
import { useCart } from '../context/CartContext';

export const SocialCTA: React.FC = () => {
  const { openWhatsAppChat } = useCart();

  return (
    <section id="social-cta-section" className="py-12 sm:py-16 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl p-6 sm:p-10 md:p-12">
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
            
            {/* Left Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 max-w-2xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-md">
                <Facebook className="w-8 h-8 fill-white" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-800/60">
                  <Sparkles className="w-3 h-3" />
                  <span>Connect With Sider Fashion</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                  Follow Sider Fashion
                </h3>
                
                <p className="text-sm sm:text-base text-zinc-300 font-normal">
                  Discover our latest products, new arrivals and updates on Facebook.
                </p>

                <p className="text-xs text-zinc-400 font-bangla">
                  ফেসবুক পেজে আমাদের নতুন পোশাক ও অফার দেখুন, অথবা সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন।
                </p>
              </div>
            </div>

            {/* Right Action Buttons: Facebook & WhatsApp side by side */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <a
                id="social-cta-facebook-btn"
                href={BRAND_CONTACTS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] active:scale-[0.98] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                <span>Visit Facebook Page</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              <button
                id="social-cta-whatsapp-btn"
                onClick={() => openWhatsAppChat()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
