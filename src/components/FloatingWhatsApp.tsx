import React, { useState } from 'react';
import { MessageSquare, X, Phone, CheckCircle2, ChevronUp } from 'lucide-react';
import { BRAND_CONTACTS } from '../data/products';
import { useCart } from '../context/CartContext';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsAppChat } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDirect = (phoneNumber?: string) => {
    openWhatsAppChat(
      "Hello Sider Fashion! I am browsing your website and would like to inquire about products/orders.",
      phoneNumber
    );
  };

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Expanded Quick Contact Popover */}
      {isOpen && (
        <div 
          id="floating-whatsapp-popup"
          className="mb-3 w-80 max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200 text-stone-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <MessageSquare className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 leading-tight">Sider Fashion WhatsApp</h4>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online • Typically replies instantly
                </span>
              </div>
            </div>
            <button
              id="close-floating-whatsapp-popup-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close WhatsApp options"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice */}
          <div className="py-2.5 text-xs text-stone-600 leading-relaxed font-bangla">
            সরাসরি অর্ডার, সাইজ পরামর্শ বা পাইকারি তথ্যের জন্য আমাদের যেকোনো নম্বরে হোয়াটসঅ্যাপে মেসেজ দিন:
          </div>

          {/* WhatsApp Action Buttons */}
          <div className="space-y-2">
            {/* Number 1 */}
            <button
              id="floating-whatsapp-num1-btn"
              onClick={() => {
                handleOpenDirect(BRAND_CONTACTS.primaryPhone);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                    Primary Desk: {BRAND_CONTACTS.primaryPhone}
                  </div>
                  <div className="text-[10px] text-stone-500">Retail Orders &amp; Inquiries</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Chat</span>
            </button>

            {/* Number 2 */}
            <button
              id="floating-whatsapp-num2-btn"
              onClick={() => {
                handleOpenDirect(BRAND_CONTACTS.secondaryPhone);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                    Secondary: {BRAND_CONTACTS.secondaryPhone}
                  </div>
                  <div className="text-[10px] text-stone-500">Wholesale &amp; Customer Care</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Chat</span>
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-stone-100 text-[10px] text-center text-stone-400">
            Ashulia, Savar Manufacturing Hub • 9:00 AM – 10:00 PM
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center bg-stone-950/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-stone-800 backdrop-blur-xs pointer-events-none">
            <span>Chat on WhatsApp</span>
          </div>
        )}
        <button
          id="floating-whatsapp-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-2xl transition-transform cursor-pointer group"
          aria-label="Open WhatsApp Chat Support"
          title="WhatsApp Support (01712773063 / 01612241112)"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
              </span>
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
