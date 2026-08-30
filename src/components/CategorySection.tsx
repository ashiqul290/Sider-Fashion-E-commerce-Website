import React from 'react';
import { ArrowRight, Clock, Layers, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RetailCategoryKey } from '../types';

interface CategorySectionProps {
  isStandaloneView?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ isStandaloneView = false }) => {
  const { navigateToCategory, setCurrentView, categories, products } = useCart();

  const handleCategorySelect = (key?: string, isUpcoming?: boolean) => {
    if (isUpcoming) {
      return;
    }
    if (key) {
      navigateToCategory(key as RetailCategoryKey);
    } else {
      setCurrentView('shop');
    }
  };

  return (
    <section id="categories-section" className={`py-12 sm:py-16 ${isStandaloneView ? 'bg-black min-h-screen text-zinc-100' : 'bg-black border-b border-zinc-800/80 text-zinc-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-md border border-amber-800/50">
              <Layers className="w-3.5 h-3.5" />
              <span>Sider Fashion Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Clothing Categories &amp; Future Lines
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-bangla">
              আমাদের বর্তমান সচল ক্যাটাগরি এবং ভবিষ্যৎ উৎপাদন পরিকল্পনা — প্রতিটি পোশাক ১০০% নিজস্ব কারখানায় তৈরি।
            </p>
          </div>

          {!isStandaloneView && (
            <button
              id="view-all-categories-btn"
              onClick={() => {
                navigateToCategory('all');
              }}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300 cursor-pointer group shrink-0"
            >
              <span>View All In Shop</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const isLive = cat.isActive && !cat.isUpcoming;
            const actualCount = products.filter(p => p.category === cat.id || p.category === cat.key).length;
            const displayCount = actualCount > 0 ? actualCount : cat.itemCount;

            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                onClick={() => handleCategorySelect(cat.key || cat.id, cat.isUpcoming)}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isLive 
                    ? 'border-zinc-800 hover:border-amber-500 hover:shadow-2xl bg-zinc-900 cursor-pointer' 
                    : 'border-dashed border-zinc-800 bg-zinc-950/70 cursor-default opacity-75'
                }`}
              >
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`w-full h-full object-cover object-center transition-transform duration-500 ${
                      isLive ? 'group-hover:scale-105' : 'grayscale-30'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {cat.isUpcoming ? (
                      <span className="inline-flex items-center gap-1 bg-black/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700">
                        <Clock className="w-3 h-3" />
                        Coming Soon (আসন্ন)
                      </span>
                    ) : (
                      <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready Stock
                      </span>
                    )}
                  </div>

                  {/* Category Title on image overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs text-zinc-300 font-bangla block">
                      {cat.nameBn}
                    </span>
                    <h3 className="text-lg font-extrabold tracking-tight text-white leading-snug">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Action Button */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300">
                      {cat.isUpcoming ? 'Expansion Line' : `${displayCount} Designs`}
                    </span>
                    {isLive ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-400 group-hover:text-amber-300">
                        <span>Shop Now</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-medium">In Pipeline</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
