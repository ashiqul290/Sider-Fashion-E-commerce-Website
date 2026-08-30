import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingBag, ArrowRight, Tag, Factory } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    setActiveProductDetail, 
    setQuickViewProduct 
  } = useCart();

  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.nameBn.includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.categoryNameBn.includes(q) ||
      p.fabric.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [products, query]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: any) => {
    setIsSearchOpen(false);
    setActiveProductDetail(product);
  };

  const handleQuickTag = (tag: string) => {
    setQuery(tag);
  };

  return (
    <div id="search-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div 
        id="search-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-zinc-800 pb-4">
          <Search className="w-5 h-5 text-amber-400 absolute left-2" />
          <input
            id="search-input-field"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Shirt name, Katua, SKU (e.g. SF-SH-101), Cotton..."
            className="w-full pl-10 pr-10 py-2.5 text-base text-white placeholder:text-zinc-500 bg-transparent focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="close-search-modal-btn"
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Search Suggestions */}
        <div className="pt-3 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Popular:</span>
          {['Oxford Shirt', 'Katua', 'Jacquard', 'SF-SH-101', 'Linen', 'Denim', 'Eid Special'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTag(tag)}
              className="px-2 py-0.5 rounded-full bg-zinc-900 hover:bg-amber-500 text-zinc-300 hover:text-black transition-colors cursor-pointer border border-zinc-800"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-bangla">
              প্রোডাক্টের নাম, কোড বা ক্যাটাগরি লিখে খুঁজুন (যেমন: শার্ট, কতুয়া, SF-SH-101)
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="text-zinc-300 text-sm font-bold">No matching garments found</div>
              <p className="text-xs text-zinc-500 font-bangla">
                "{query}" এর সাথে মিল রেখে কোনো পোশাক পাওয়া যায়নি। অনুগ্রহ করে বানান চেক করুন অথবা আমাদের হোয়াটসঅ্যাপে জানান।
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
                Found {filteredProducts.length} Products
              </div>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 hover:border-amber-500 hover:bg-zinc-900 transition-all cursor-pointer group bg-zinc-950"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-14 object-cover rounded-lg border border-zinc-700 bg-zinc-900"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-900/60 px-1.5 py-0.2 rounded">
                          {p.code}
                        </span>
                        <span className="text-[11px] text-zinc-400">{p.categoryName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-xs text-zinc-400 font-bangla">{p.nameBn}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm font-bold text-amber-400 font-sans">
                      ৳{p.retailPrice}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">
                      Wholesale: ৳{p.wholesalePrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
