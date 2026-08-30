import React, { useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AnalyticsTrackingService } from './services/analyticsTrackingService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { WhyChooseUs } from './components/WhyChooseUs';
import { WholesaleSection } from './components/WholesaleSection';
import { PaymentMethodsSection } from './components/PaymentMethodsSection';
import { ReturnPolicySection } from './components/ReturnPolicySection';
import { ContactSection } from './components/ContactSection';
import { SocialCTA } from './components/SocialCTA';
import { ShopPage } from './components/ShopPage';
import { DualPortalChoiceBanner } from './components/DualPortalChoiceBanner';
import { Footer } from './components/Footer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { SearchModal } from './components/SearchModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminProductManagerModal } from './components/AdminProductManagerModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { LegalInfoModal } from './components/LegalInfoModal';
import { FAQSection } from './components/FAQSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { Sparkles, ArrowRight, Factory, Award, Ruler } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    navigateToCategory,
    products, 
    isReturnPolicyModalOpen, 
    setIsReturnPolicyModalOpen,
    isSizeGuideOpen,
    closeSizeGuide,
    sizeGuideActiveProduct,
    isFAQModalOpen,
    setIsFAQModalOpen,
    openSizeGuide,
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    currentAdminUser,
    loginAdmin,
    logoutAdmin
  } = useCart();

  useEffect(() => {
    AnalyticsTrackingService.init();
  }, []);

  // When /admin route or Admin Panel is accessed:
  // If authenticated -> Render existing Admin Dashboard
  // If not authenticated -> ALWAYS show secure full-page Admin Login
  if (currentView === 'admin' || isAdminPanelOpen) {
    if (currentAdminUser) {
      return (
        <AdminDashboard
          currentUser={currentAdminUser}
          onLogout={() => {
            logoutAdmin();
          }}
          onViewStorefront={() => {
            logoutAdmin();
            setCurrentView('home');
            setIsAdminPanelOpen(false);
          }}
        />
      );
    } else {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            loginAdmin(user);
          }}
          onBackToStore={() => {
            logoutAdmin();
            setCurrentView('home');
            setIsAdminPanelOpen(false);
          }}
        />
      );
    }
  }

  // Featured retail products for home
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const featuredShirts = products.filter(p => p.category === 'mens-shirts').slice(0, 3);
  const featuredKatua = products.filter(p => p.category === 'mens-katua').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-100 antialiased selection:bg-amber-500 selection:text-black">
      {/* 1. Header / Navigation */}
      <Navbar />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'home' && (
          <main>
            {/* 2. Premium Auto-Rotating Hero Carousel */}
            <Hero />

            {/* 2.5 Dual Portal Choice Banner: Retail vs Wholesale */}
            <DualPortalChoiceBanner />

            {/* 3. Featured Categories Showcase */}
            <CategorySection />

            {/* 4. New Arrivals Section */}
            <section id="new-arrivals-section" className="py-14 sm:py-16 bg-zinc-950 border-b border-zinc-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-zinc-800/80 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-sm border border-amber-800/50 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fresh Seasonal Drops</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      New Arrivals &amp; Latest Trends
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-bangla mt-1">
                      আমাদের সাভার কারখানা থেকে সদ্য উৎপাদিত নতুন ডিজাইনের শার্ট ও কতুয়া
                    </p>
                  </div>

                  <button
                    id="view-all-new-arrivals-btn"
                    onClick={() => navigateToCategory('new-arrival')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-zinc-200 hover:text-amber-400 group cursor-pointer"
                  >
                    <span>View All New Drops ({products.filter(p => p.isNewArrival).length})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Featured Products: Men's Shirts Collection */}
            <section id="featured-shirts-section" className="py-14 sm:py-16 bg-black border-b border-zinc-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-zinc-800/80 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-sm border border-amber-800/50 mb-2">
                      <Factory className="w-3.5 h-3.5" />
                      <span>Savar Factory Signature</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      Men's Shirts Collection
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-bangla mt-1">
                      অক্সফোর্ড কটন, প্রিন্টেড এবং ডেনিম শার্ট — খুচরা ও পাইকারি মূল্যে
                    </p>
                  </div>

                  <button
                    id="view-all-shirts-home-btn"
                    onClick={() => navigateToCategory('shirt')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-zinc-200 hover:text-amber-400 group cursor-pointer"
                  >
                    <span>View All Shirts ({products.filter(p => p.category === 'mens-shirts').length})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {featuredShirts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>

            {/* Interactive Size Guide Banner Card */}
            <section className="py-10 bg-zinc-950 border-b border-zinc-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-zinc-800 relative overflow-hidden">
                  <div className="space-y-3 max-w-xl z-10">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Sider Savar Factory Smart Sizing</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black font-sans leading-tight">
                      Confused About Your Fit? Try Our Smart Size Finder.
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-bangla leading-relaxed">
                      আপনার উচ্চতা (উদাঃ ৫ ফুট ৮ ইঞ্চি), ওজন এবং পছন্দের ফিটিং দিলে কয়েক সেকেন্ডেই আমাদের অটোমেটেড সাইজ ফাইন্ডার আপনাকে সবচেয়ে সঠিক সাইজ নির্বাচন করে দেবে।
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full sm:w-auto shrink-0">
                    <button
                      id="home-open-size-finder-btn"
                      onClick={() => openSizeGuide(null)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-4 h-4 fill-zinc-950" />
                      <span>Launch Size Finder (সাইজ ফাইন্ডার)</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Products: Men's Katua Section */}
            <section id="featured-katua-section" className="py-14 sm:py-16 bg-zinc-950 border-b border-zinc-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-zinc-800/80 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-sm border border-amber-800/50 mb-2">
                      <Award className="w-3.5 h-3.5" />
                      <span>Comfort &amp; Cultural Elegance</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      Men's Katua Collection
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-bangla mt-1">
                      জ্যাকার্ড ও সুতি কতুয়া — আরামদায়ক কাটিং ও নিজস্ব সুইং ফিনিশিং
                    </p>
                  </div>

                  <button
                    id="view-all-katua-home-btn"
                    onClick={() => navigateToCategory('katua')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-zinc-200 hover:text-amber-400 group cursor-pointer"
                  >
                    <span>View All Katua ({products.filter(p => p.category === 'mens-katua').length})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {featuredKatua.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>

            {/* 6. Why Choose Sider Fashion */}
            <WhyChooseUs />

            {/* 7. Wholesale Preview Banner for B2B Buyers */}
            <section className="py-12 bg-zinc-950 text-white border-y border-zinc-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-md border border-amber-800/40">
                    <Factory className="w-3.5 h-3.5" />
                    <span>Wholesale &amp; Garment Manufacturing</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Need Bulk Stock for Your Showroom or Online Shop?
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-bangla">
                    সাভার কারখানার সর্বনিম্ন পাইকারি রেট, ফ্লেক্সিবল সাইজ রেশিও এবং সারা দেশে পার্সেল ডেলিভারি। MOQ ১২ পিস।
                  </p>
                </div>

                <button
                  id="home-wholesale-cta-btn"
                  onClick={() => {
                    setCurrentView('wholesale');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-6 py-3 rounded-xl text-sm transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Visit Wholesale Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* 8. FAQs Section on Home */}
            <FAQSection />

            {/* Return Policy Overview Section */}
            <ReturnPolicySection />

            {/* Payment Methods */}
            <PaymentMethodsSection />

            {/* Contact & Savar Factory Location */}
            <ContactSection />

            {/* Social Media CTA */}
            <SocialCTA />
          </main>
        )}

        {/* Dedicated Views */}
        {(currentView === 'retail' || currentView === 'shop') && <ShopPage />}
        
        {currentView === 'categories' && <CategorySection isStandaloneView={true} />}

        {currentView === 'size-guide' && (
          <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SizeGuideModal asSection={true} />
          </div>
        )}

        {currentView === 'faq' && (
          <div>
            <FAQSection />
          </div>
        )}

        {currentView === 'wholesale' && (
          <div>
            <WholesaleSection />
            <ReturnPolicySection />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="py-4 bg-black">
            <ContactSection />
            <PaymentMethodsSection />
            <SocialCTA />
          </div>
        )}
      </div>

      {/* Main Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Dynamic Popups & Modals */}
      <ProductQuickViewModal />
      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <SearchModal />
      <OrderTrackingModal />
      <AdminProductManagerModal />
      <LegalInfoModal />

      {/* Interactive Size Guide Modal */}
      {isSizeGuideOpen && (
        <SizeGuideModal 
          isOpen={isSizeGuideOpen} 
          product={sizeGuideActiveProduct}
          onClose={closeSizeGuide}
        />
      )}

      {/* FAQ Modal popup */}
      {isFAQModalOpen && (
        <FAQSection 
          asModal={true}
          onClose={() => setIsFAQModalOpen(false)}
        />
      )}

      {/* Admin Auth Modal */}
      <AdminAuthModal 
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onLoginSuccess={loginAdmin}
      />

      {/* Return policy modal popup if triggered from buttons */}
      {isReturnPolicyModalOpen && (
        <ReturnPolicySection 
          asModal={true} 
          onClose={() => setIsReturnPolicyModalOpen(false)} 
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}

export default App;
