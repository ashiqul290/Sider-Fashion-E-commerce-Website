import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  Factory, 
  Layers, 
  ChevronRight,
  SlidersHorizontal,
  Ruler,
  HelpCircle,
  Facebook,
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';
import { NavigationView } from '../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsSearchOpen, 
    currentView, 
    setCurrentView, 
    setActiveCategoryFilter,
    setIsTrackingOpen,
    setIsAdminManagerOpen,
    setIsReturnPolicyModalOpen,
    openWhatsAppChat,
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    setIsAdminAuthModalOpen,
    currentAdminUser
  } = useCart();

  const handleNavClick = (view: NavigationView, categoryFilter: any = null) => {
    setCurrentView(view);
    if (categoryFilter !== undefined) {
      setActiveCategoryFilter(categoryFilter);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-md text-zinc-100">
      {/* Top Banner Ticker with Trust message */}
      <div id="top-announcement-bar" className="bg-black text-zinc-300 text-xs py-2 px-4 border-b border-zinc-850">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-flex items-center gap-1.5 bg-amber-500 text-black text-[11px] font-bold px-2 py-0.5 rounded-sm">
              <Factory className="w-3 h-3" />
              কারখানা সরাসরি
            </span>
            <span className="font-bangla text-zinc-300 text-xs">
              নিজস্ব কারখানায় তৈরি — পাইকারি ও খুচরা বিক্রি | আশুলিয়া, সাভার, ঢাকা
            </span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-[12px] text-zinc-400">
            <a
              id="top-bar-facebook-link"
              href={BRAND_CONTACTS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Official Sider Fashion Facebook Page"
            >
              <Facebook className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Facebook</span>
            </a>

            <button
              id="top-bar-whatsapp-btn"
              onClick={() => openWhatsAppChat()}
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              id="top-bar-tracking-btn"
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Order</span>
            </button>

            <button
              id="top-bar-policy-btn"
              onClick={() => setIsReturnPolicyModalOpen(true)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer hidden md:flex"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Return &amp; Exchange Policy</span>
            </button>

            <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
              <a 
                id="top-bar-phone-link"
                href={`tel:${BRAND_CONTACTS.primaryPhone}`}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Phone className="w-3 h-3" />
                <span>{BRAND_CONTACTS.primaryPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="text-left group flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
                  Sider<span className="text-amber-400 font-bold ml-1">Fashion</span>
                </span>
                <span className="hidden sm:inline-block bg-zinc-800 text-zinc-300 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border border-zinc-700">
                  Dhaka, BD
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] font-medium text-zinc-400 font-bangla group-hover:text-amber-400 transition-colors">
                নিজস্ব কারখানায় তৈরি পোশাক • পাইকারি ও খুচরা
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            <button
              id="nav-home-btn"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'home' 
                  ? 'text-amber-400 bg-zinc-900 border border-zinc-700/80 font-bold' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              HOME
            </button>

            <button
              id="nav-retail-btn"
              onClick={() => handleNavClick('retail', 'all')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'retail' || currentView === 'shop'
                  ? 'text-amber-400 bg-zinc-900 border border-zinc-700/80 font-bold' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              RETAIL
            </button>

            <button
              id="nav-wholesale-btn"
              onClick={() => handleNavClick('wholesale')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'wholesale'
                  ? 'text-amber-400 bg-zinc-900 border border-zinc-700/80 font-bold' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              WHOLESALE
            </button>

            <button
              id="nav-categories-btn"
              onClick={() => handleNavClick('categories')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'categories' 
                  ? 'text-amber-400 bg-zinc-900 border border-zinc-700/80 font-bold' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>CATEGORIES</span>
            </button>

            <button
              id="nav-size-guide-btn"
              onClick={() => handleNavClick('size-guide')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'size-guide' 
                  ? 'text-amber-400 bg-zinc-900 border border-zinc-700/80 font-bold' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>SIZE GUIDE</span>
            </button>

            <button
              id="nav-faq-btn"
              onClick={() => handleNavClick('faq')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'faq' 
                  ? 'text-amber-400 bg-zinc-900 border border-zinc-700/80 font-bold' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>FAQ</span>
            </button>

            <button
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'contact' 
                  ? 'text-amber-400 bg-zinc-900 border border-zinc-700/80 font-bold' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              CONTACT
            </button>

            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>CART</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header CTAs & Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Authenticated Admin Indicator */}
            {currentAdminUser && (
              <button
                id="header-admin-panel-badge-btn"
                onClick={() => handleNavClick('admin')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all cursor-pointer"
                title="Return to Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </button>
            )}

            {/* Direct Dual CTAs: SHOP RETAIL & WHOLESALE */}
            <div className="hidden xl:flex items-center gap-1.5">
              <button
                id="header-cta-shop-retail"
                onClick={() => handleNavClick('retail', 'all')}
                className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
              >
                SHOP RETAIL
              </button>
              <button
                id="header-cta-wholesale"
                onClick={() => handleNavClick('wholesale')}
                className="bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98 flex items-center gap-1"
              >
                <Factory className="w-3.5 h-3.5 text-amber-400" />
                <span>WHOLESALE</span>
              </button>
            </div>

            {/* Search Trigger */}
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors relative cursor-pointer"
              aria-label="Search products"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Direct WhatsApp Callout */}
            <button
              id="header-whatsapp-btn"
              onClick={() => openWhatsAppChat()}
              className="hidden sm:flex items-center gap-1 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60 px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Official Facebook Page Header Icon */}
            <a
              id="header-facebook-btn"
              href={BRAND_CONTACTS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow Sider Fashion on Facebook"
              aria-label="Official Sider Fashion Facebook Page"
              className="p-2 rounded-full text-zinc-400 hover:text-blue-400 hover:bg-zinc-900 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Facebook className="w-4 h-4 text-blue-400" />
            </a>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span id="cart-item-count-badge" className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 shadow-xs animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200 text-zinc-200">
          
          {/* Quick Dual Action Selector for Mobile */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-zinc-800">
            <button
              id="mobile-quick-retail-btn"
              onClick={() => handleNavClick('retail', 'all')}
              className="py-2.5 px-3 rounded-xl text-center text-xs font-bold bg-amber-500 text-black shadow-xs"
            >
              SHOP RETAIL
            </button>
            <button
              id="mobile-quick-wholesale-btn"
              onClick={() => handleNavClick('wholesale')}
              className="py-2.5 px-3 rounded-xl text-center text-xs font-bold bg-zinc-900 border border-amber-500/40 text-amber-400 shadow-xs"
            >
              WHOLESALE B2B
            </button>
          </div>

          <button
            id="mobile-nav-home"
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentView === 'home' ? 'bg-zinc-900 text-amber-400 font-bold border border-zinc-800' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            id="mobile-nav-retail"
            onClick={() => handleNavClick('retail', 'all')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentView === 'retail' || currentView === 'shop' ? 'bg-zinc-900 text-amber-400 font-bold border border-zinc-800' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
              <span>Retail (খুচরা কেনাকাটা)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            id="mobile-nav-wholesale"
            onClick={() => handleNavClick('wholesale')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentView === 'wholesale' ? 'bg-zinc-900 text-amber-400 font-bold border border-zinc-800' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-amber-400" />
              <span>Wholesale (পাইকারি অর্ডার)</span>
            </div>
            <span className="text-[10px] bg-amber-500 text-black font-mono font-bold px-2 py-0.5 rounded">
              MOQ 12+
            </span>
          </button>

          <button
            id="mobile-nav-categories"
            onClick={() => handleNavClick('categories')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentView === 'categories' ? 'bg-zinc-900 text-amber-400 font-bold border border-zinc-800' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Categories (ক্যাটাগরি সমূহ)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            id="mobile-nav-size-guide"
            onClick={() => handleNavClick('size-guide')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentView === 'size-guide' ? 'bg-zinc-900 text-amber-400 font-bold border border-zinc-800' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-400" />
              <span>Size Guide (সাইজ গাইড)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            id="mobile-nav-faq"
            onClick={() => handleNavClick('faq')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentView === 'faq' ? 'bg-zinc-900 text-amber-400 font-bold border border-zinc-800' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>FAQ (প্রশ্নোত্তর)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            id="mobile-nav-contact"
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentView === 'contact' ? 'bg-zinc-900 text-amber-400 font-bold border border-zinc-800' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <span>Contact (যোগাযোগ)</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            id="mobile-nav-cart"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsCartOpen(true);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between bg-zinc-900 text-white border border-zinc-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Cart (শপিং ব্যাগ)</span>
            </div>
            <span className="text-xs bg-amber-500 text-black font-bold px-2 py-0.5 rounded font-mono">
              {cartCount} Items
            </span>
          </button>

          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <a
              id="mobile-nav-facebook"
              href={BRAND_CONTACTS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between text-blue-400 bg-blue-950/40 border border-blue-800/50 hover:bg-blue-900/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Facebook Page</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </a>

            <button
              id="mobile-nav-whatsapp"
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsAppChat();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Chat on WhatsApp ({BRAND_CONTACTS.primaryPhone})</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                Live
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
