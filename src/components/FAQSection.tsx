import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Phone, 
  MessageSquare, 
  Ruler, 
  Truck, 
  RotateCcw, 
  Factory, 
  CreditCard, 
  ShieldCheck,
  X
} from 'lucide-react';
import { SIDER_FAQS } from '../data/sizeGuideData';
import { FAQItem } from '../types';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';

interface FAQSectionProps {
  asModal?: boolean;
  onClose?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ asModal = false, onClose }) => {
  const { openWhatsAppChat, setIsSizeGuideOpen, faqs, settings, contacts } = useCart();
  const [openIds, setOpenIds] = useState<string[]>(['faq-size-finder', 'faq-delivery-check']);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentFaqs = faqs && faqs.length > 0 ? faqs : SIDER_FAQS;
  const primaryPhone = contacts.find(c => c.type === 'hotline')?.value || settings.primaryPhone || BRAND_CONTACTS.primaryPhone;

  const toggleFAQ = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'all', label: 'All Questions', labelBn: 'সকল প্রশ্ন', icon: HelpCircle },
    { id: 'size', label: 'Size & Fit', labelBn: 'সাইজ ও ফিটিং', icon: Ruler },
    { id: 'delivery', label: 'Delivery & Inspection', labelBn: 'ডেলিভারি ও চেক', icon: Truck },
    { id: 'return', label: 'Return & Exchange', labelBn: 'রিটার্ন ও এক্সচেঞ্জ', icon: RotateCcw },
    { id: 'wholesale', label: 'Wholesale & MOQ', labelBn: 'পাইকারি সাপ্লাই', icon: Factory },
    { id: 'payment', label: 'Payment Methods', labelBn: 'পেমেন্ট পদ্ধতি', icon: CreditCard }
  ];

  const filteredFAQs = currentFaqs.filter(faq => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      faq.question.toLowerCase().includes(q) || 
      faq.questionBn.includes(q) || 
      faq.answer.toLowerCase().includes(q) || 
      faq.answerBn.includes(q);
    return matchesCat && matchesSearch;
  });

  const content = (
    <div className={`bg-zinc-950 ${asModal ? 'rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800 p-6' : 'py-16 border-b border-zinc-800'}`}>
      <div className={`${asModal ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-sm border border-amber-800/80 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Customer Help &amp; FAQs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-bangla mt-1">
              সাধারণ জিজ্ঞাসা — সাইজ নির্বাচন, ডেলিভারি চেক, রিটার্ন ও পাইকারি সম্পর্কিত বিস্তারিত
            </p>
          </div>

          {asModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer border border-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-8">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. size, delivery, wholesale, exchange, bKash)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-zinc-900 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-400 text-xs space-y-2">
              <p>No questions matched your search query "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-amber-400 font-bold hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-amber-500/80 bg-zinc-900 shadow-xs' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                  >
                    <div className="space-y-0.5">
                      <h3 className="text-sm sm:text-base font-extrabold text-white font-sans leading-snug">
                        {faq.question}
                      </h3>
                      <p className="text-xs font-bold text-amber-400 font-bangla">
                        {faq.questionBn}
                      </p>
                    </div>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 space-y-3 text-xs sm:text-sm text-zinc-300 border-t border-zinc-800 animate-in fade-in duration-150">
                      <p className="font-bangla leading-relaxed text-zinc-200 font-medium bg-zinc-900/90 p-3 rounded-lg border border-zinc-800">
                        {faq.answerBn}
                      </p>
                      <p className="leading-relaxed text-zinc-400 font-sans text-xs">
                        {faq.answer}
                      </p>
                      {faq.category === 'size' && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setIsSizeGuideOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-950/50 px-3 py-1.5 rounded-lg border border-amber-800/60 cursor-pointer"
                          >
                            <Ruler className="w-3.5 h-3.5 text-amber-400" />
                            <span>Open Interactive Size Finder &amp; Chart &rarr;</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-black text-white">
              Still have questions about our clothing or wholesale?
            </h3>
            <p className="text-xs text-zinc-400 font-bangla">
              আমাদের সাভার ফ্যাক্টরি হেল্পলাইন ও হোয়াটসঅ্যাপ প্রতিনিধি আপনার সহায়তায় প্রস্তুত।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`tel:${BRAND_CONTACTS.primaryPhone}`}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors border border-zinc-700"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{BRAND_CONTACTS.primaryPhone}</span>
            </a>

            <button
              onClick={() => openWhatsAppChat("Hello Sider Fashion! I have a question regarding an order/products.")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  if (asModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
          {content}
        </div>
      </div>
    );
  }

  return <section id="faq-section">{content}</section>;
};
