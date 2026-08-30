import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Factory, 
  Truck, 
  ShieldCheck, 
  ShoppingBag,
  Layers,
  Pause,
  Play
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { HERO_SLIDES } from '../data/heroSlides';
import { HeroSlide, HeroSlideButton } from '../types';

interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoplayInterval?: number; // in milliseconds, default 4500 (4.5s)
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ 
  slides = HERO_SLIDES,
  autoplayInterval = 4500 
}) => {
  const { setCurrentView, navigateToCategory, setActiveCategoryFilter } = useCart();
  
  // Filter only active slides
  const activeSlides = React.useMemo(() => {
    const list = slides.filter(s => s.active !== false);
    return list.length > 0 ? list : HERO_SLIDES;
  }, [slides]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = activeSlides.length;

  // Next Slide
  const handleNext = useCallback(() => {
    setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Previous Slide
  const handlePrev = useCallback(() => {
    setCurrentSlideIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Go to specific slide
  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  // Reset autoplay timer whenever currentSlideIndex changes or user interacts
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSlideIndex, isPaused, autoplayInterval, handleNext, totalSlides]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Slide
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Slide
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Button Action Handler
  const handleButtonClick = (btn: HeroSlideButton) => {
    if (btn.action === 'shop') {
      setActiveCategoryFilter(btn.categoryKey || 'all');
      setCurrentView('shop');
    } else if (btn.action === 'category') {
      navigateToCategory(btn.categoryKey || 'all');
    } else if (btn.action === 'wholesale') {
      setCurrentView('wholesale');
    } else {
      setCurrentView('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      id="hero-carousel-section"
      aria-label="Sider Fashion Featured Collections Banner"
      className="relative w-full overflow-hidden bg-stone-950 text-white select-none border-b border-stone-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full h-[520px] sm:h-[580px] md:h-[620px] lg:h-[660px] xl:h-[700px]">
        {activeSlides.map((slide, index) => {
          const isCurrent = index === currentSlideIndex;

          return (
            <div
              key={slide.slideId || `hero-slide-${index}`}
              id={`hero-slide-${index}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isCurrent}
            >
              {/* Background Image Layer with Zoom & Overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <picture>
                  {slide.mobileImage && (
                    <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                  )}
                  <img
                    src={slide.image}
                    alt={slide.imageAlt || slide.title}
                    referrerPolicy="no-referrer"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    // @ts-ignore fetchPriority for high priority first slide
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    className={`w-full h-full object-cover object-center transform transition-transform duration-10000 ease-out ${
                      isCurrent ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </picture>

                {/* Dark Contrast Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-stone-950/95 via-stone-950/80 sm:via-stone-950/65 to-stone-950/40" />
                <div className="absolute inset-0 bg-radial-at-c from-transparent via-stone-950/30 to-stone-950/80" />
              </div>

              {/* Slide Content Layer */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12 sm:py-16 lg:py-20">
                
                {/* Top Slogan / Factory Badge */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                    <Factory className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{slide.badge || 'Savar & Ashulia Factory • 100% In-House Production'}</span>
                  </div>
                </div>

                {/* Main Headline & Supporting Content */}
                <div className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-6 my-auto">
                  {slide.badgeBn && (
                    <p className="text-xs sm:text-sm font-semibold text-amber-400 font-bangla tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{slide.badgeBn}</span>
                    </p>
                  )}

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-sans tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-lg md:text-xl text-stone-200 font-light leading-relaxed font-sans drop-shadow-sm max-w-xl">
                    {slide.subtitle}
                  </p>

                  {slide.subtitleBn && slide.subtitleBn !== slide.subtitle && (
                    <p className="text-xs sm:text-sm text-stone-300 font-bangla leading-relaxed max-w-xl border-l-2 border-amber-500 pl-3">
                      {slide.subtitleBn}
                    </p>
                  )}

                  {/* Slide Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:pt-4">
                    {slide.buttons.map((btn, bIdx) => {
                      const isPrimary = btn.variant === 'primary' || bIdx === 0;

                      return (
                        <button
                          key={btn.id || `slide-btn-${bIdx}`}
                          id={btn.id || `slide-${index}-btn-${bIdx}`}
                          onClick={() => handleButtonClick(btn)}
                          className={`inline-flex items-center justify-center gap-2 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 active:scale-98 shadow-md cursor-pointer ${
                            isPrimary
                              ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 hover:shadow-amber-600/30'
                              : 'bg-stone-900/90 hover:bg-stone-800 text-white border border-stone-600 hover:border-amber-400 backdrop-blur-sm'
                          }`}
                        >
                          {isPrimary ? (
                            <ShoppingBag className="w-4 h-4 text-stone-950" />
                          ) : (
                            <Layers className="w-4 h-4 text-amber-400" />
                          )}
                          <span>{btn.text}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Trust Indicators on Desktop */}
                <div className="hidden sm:grid grid-cols-3 gap-4 pt-4 border-t border-stone-800/80 text-xs text-stone-300 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Direct Factory Price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Quality Checked Sizing</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Desktop Prominent / Mobile Clean) */}
      <button
        id="hero-carousel-prev-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-stone-900/60 hover:bg-amber-600 text-white hover:text-stone-950 border border-stone-700/80 hover:border-amber-500 backdrop-blur-md transition-all duration-200 shadow-lg cursor-pointer hover:scale-105 active:scale-95 group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        id="hero-carousel-next-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-stone-900/60 hover:bg-amber-600 text-white hover:text-stone-950 border border-stone-700/80 hover:border-amber-500 backdrop-blur-md transition-all duration-200 shadow-lg cursor-pointer hover:scale-105 active:scale-95 group"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Carousel Controls & Pagination Dots Bar (Bottom Centered) */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2 sm:gap-3 px-4">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={`dot-${slide.slideId || idx}`}
              id={`hero-carousel-dot-${idx}`}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              className={`group relative h-2.5 transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isActive 
                  ? 'w-8 sm:w-10 bg-amber-500' 
                  : 'w-2.5 bg-stone-500/60 hover:bg-stone-300'
              }`}
            >
              {/* Tooltip on hover on desktop */}
              <span className="sr-only">Slide {idx + 1}</span>
            </button>
          );
        })}

        {/* Small Pause / Play indicator */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          className="ml-2 p-1.5 rounded-full bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white text-[10px] transition-colors border border-stone-700/50 backdrop-blur-xs cursor-pointer"
        >
          {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
        </button>
      </div>

    </section>
  );
};

export default HeroCarousel;
