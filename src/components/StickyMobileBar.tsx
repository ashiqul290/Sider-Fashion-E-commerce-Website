import React from 'react';
import { Phone, MessageSquare, ShoppingBag, Factory, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';

export const StickyMobileBar: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsSearchOpen, 
    setCurrentView,
    openWhatsAppChat 
  } = useCart();

  return (
    <div 
      id="sticky-mobile-action-bar" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 shadow-2xl py-2 px-3 safe-area-bottom"
    >
      <div className="grid grid-cols-4 gap-2 items-center text-center">
        {/* Direct Call Button */}
        <a
          id="mobile-sticky-call-btn"
          href={`tel:${BRAND_CONTACTS.primaryPhone}`}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors border border-zinc-800"
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold mt-0.5">Call Hotline</span>
        </a>

        {/* WhatsApp Chat Button */}
        <button
          id="mobile-sticky-whatsapp-btn"
          onClick={() => openWhatsAppChat()}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 transition-colors cursor-pointer border border-emerald-800/80"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
        </button>

        {/* Search Modal Trigger */}
        <button
          id="mobile-sticky-search-btn"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer border border-zinc-800"
        >
          <Search className="w-4 h-4 text-zinc-400" />
          <span className="text-[10px] font-bold mt-0.5">Search</span>
        </button>

        {/* Shopping Cart Button */}
        <button
          id="mobile-sticky-cart-btn"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors cursor-pointer shadow-xs font-bold"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] font-black mt-0.5">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-amber-400 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-amber-500">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
