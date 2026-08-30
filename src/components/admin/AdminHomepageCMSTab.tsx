import React, { useState } from 'react';
import { 
  Sliders, 
  HelpCircle, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Save, 
  Image as ImageIcon, 
  Layers, 
  X,
  ExternalLink,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';
import { HeroSlide, FAQItem } from '../../types';
import { PolicyContent, HomepageSectionConfig } from '../../types/adminTypes';
import { AdminStoreService, DEFAULT_HOMEPAGE_SECTIONS } from '../../services/adminStoreService';

interface AdminHomepageCMSTabProps {
  onRefresh: () => void;
  adminName: string;
}

export const AdminHomepageCMSTab: React.FC<AdminHomepageCMSTabProps> = ({
  onRefresh,
  adminName
}) => {
  const [subTab, setSubTab] = useState<'sections' | 'hero' | 'faqs' | 'policies'>('sections');
  const [sections, setSections] = useState<HomepageSectionConfig[]>(AdminStoreService.getHomepageSections());
  const [slides, setSlides] = useState<HeroSlide[]>(AdminStoreService.getHeroSlides());
  const [faqs, setFaqs] = useState<FAQItem[]>(AdminStoreService.getFAQs());
  const [policies, setPolicies] = useState<PolicyContent>(AdminStoreService.getPolicies());

  // Section Modal
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSectionConfig | null>(null);
  const [sectionKey, setSectionKey] = useState('custom-promo');
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionTitleBn, setSectionTitleBn] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');
  const [sectionSubtitleBn, setSectionSubtitleBn] = useState('');
  const [sectionEnabled, setSectionEnabled] = useState(true);

  // Slide Modal
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideTitleBn, setSlideTitleBn] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideSubtitleBn, setSlideSubtitleBn] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideBadge, setSlideBadge] = useState('');
  const [slideBadgeBn, setSlideBadgeBn] = useState('');
  const [slideCtaText, setSlideCtaText] = useState('Order Now (অর্ডার করুন)');
  const [slideCtaLink, setSlideCtaLink] = useState('#shop');
  const [slideSecondaryCtaText, setSlideSecondaryCtaText] = useState('Wholesale Rates (পাইকারি রেট)');
  const [slideSecondaryCtaLink, setSlideSecondaryCtaLink] = useState('#wholesale');

  // FAQ Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqQ, setFaqQ] = useState('');
  const [faqQBn, setFaqQBn] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqABn, setFaqABn] = useState('');
  const [faqCat, setFaqCat] = useState<'size' | 'delivery' | 'return' | 'wholesale' | 'payment'>('delivery');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- Homepage Sections Handlers (Item 4) ---
  const handleOpenSectionCreate = () => {
    setEditingSection(null);
    setSectionKey(`section-${Date.now()}`);
    setSectionTitle('');
    setSectionTitleBn('');
    setSectionSubtitle('');
    setSectionSubtitleBn('');
    setSectionEnabled(true);
    setIsSectionModalOpen(true);
  };

  const handleOpenSectionEdit = (sec: HomepageSectionConfig) => {
    setEditingSection(sec);
    setSectionKey(sec.key);
    setSectionTitle(sec.title);
    setSectionTitleBn(sec.titleBn || '');
    setSectionSubtitle(sec.subtitle || '');
    setSectionSubtitleBn(sec.subtitleBn || '');
    setSectionEnabled(sec.isVisible);
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;

    const toSave: HomepageSectionConfig = {
      id: editingSection ? editingSection.id : `sec-${Date.now()}`,
      key: sectionKey.trim().toLowerCase().replace(/\s+/g, '-'),
      title: sectionTitle.trim(),
      titleBn: sectionTitleBn.trim() || sectionTitle.trim(),
      subtitle: sectionSubtitle.trim(),
      subtitleBn: sectionSubtitleBn.trim(),
      isVisible: sectionEnabled,
      displayOrder: editingSection ? editingSection.displayOrder : sections.length + 1
    };

    let updated: HomepageSectionConfig[];
    if (editingSection) {
      updated = sections.map(s => s.id === toSave.id ? toSave : s);
      showToast(`Section "${toSave.title}" updated.`);
    } else {
      updated = [...sections, toSave];
      showToast(`Section "${toSave.title}" added to homepage.`);
    }

    setSections(updated);
    AdminStoreService.saveHomepageSections(updated, adminName);
    setIsSectionModalOpen(false);
    onRefresh();
  };

  const handleDeleteSection = (id: string) => {
    const updated = sections.filter(s => s.id !== id);
    setSections(updated);
    AdminStoreService.saveHomepageSections(updated, adminName);
    showToast('Homepage section removed.');
    onRefresh();
  };

  const handleToggleSectionEnabled = (id: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s);
    setSections(updated);
    AdminStoreService.saveHomepageSections(updated, adminName);
    showToast('Section visibility updated.');
    onRefresh();
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((s, idx) => s.displayOrder = idx + 1);
    setSections(updated);
    AdminStoreService.saveHomepageSections(updated, adminName);
    onRefresh();
  };

  // --- Hero Slides Handlers (Item 6) ---
  const handleOpenSlideCreate = () => {
    setEditingSlide(null);
    setSlideTitle('PREMIUM EXPORT QUALITY COTTON SHIRTS');
    setSlideTitleBn('১০০% খাঁটি সুতি কটন শার্ট — নিজস্ব কারখানায় তৈরি');
    setSlideSubtitle('Crafted at our Savar manufacturing plant. Check fabric before payment.');
    setSlideSubtitleBn('ডেলিভারিম্যানের সামনে চেক করে নেওয়ার সুযোগ।');
    setSlideImage('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=2000&q=85');
    setSlideBadge('Direct Factory Sale');
    setSlideBadgeBn('কারখানা সরাসরি বিক্রি');
    setSlideCtaText('Shop Collection');
    setSlideCtaLink('#shop');
    setSlideSecondaryCtaText('Wholesale Inquiry');
    setSlideSecondaryCtaLink('#wholesale');
    setIsSlideModalOpen(true);
  };

  const handleOpenSlideEdit = (sl: HeroSlide) => {
    setEditingSlide(sl);
    setSlideTitle(sl.title);
    setSlideTitleBn(sl.titleBn);
    setSlideSubtitle(sl.subtitle);
    setSlideSubtitleBn(sl.subtitleBn);
    setSlideImage(sl.image);
    setSlideBadge(sl.badge || '');
    setSlideBadgeBn(sl.badgeBn || '');
    setSlideCtaText(sl.ctaText);
    setSlideCtaLink(sl.ctaLink);
    setSlideSecondaryCtaText(sl.secondaryCtaText || '');
    setSlideSecondaryCtaLink(sl.secondaryCtaLink || '');
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    const toSave: HeroSlide = {
      slideId: editingSlide ? editingSlide.slideId : `slide-${Date.now()}`,
      title: slideTitle,
      titleBn: slideTitleBn,
      subtitle: slideSubtitle,
      subtitleBn: slideSubtitleBn,
      image: slideImage,
      imageAlt: slideTitle,
      badge: slideBadge,
      badgeBn: slideBadgeBn,
      ctaText: slideCtaText,
      ctaLink: slideCtaLink,
      secondaryCtaText: slideSecondaryCtaText,
      secondaryCtaLink: slideSecondaryCtaLink,
      buttons: editingSlide?.buttons || [
        {
          text: slideCtaText || 'Shop Now',
          action: 'shop',
          variant: 'primary'
        }
      ],
      active: editingSlide ? editingSlide.active : true,
      alignment: editingSlide?.alignment || 'left'
    };

    if (editingSlide) {
      AdminStoreService.updateHeroSlide(toSave, adminName);
      showToast('Hero Carousel Slide updated!');
    } else {
      AdminStoreService.addHeroSlide(toSave, adminName);
      showToast('Hero Carousel Slide created!');
    }

    setSlides(AdminStoreService.getHeroSlides());
    setIsSlideModalOpen(false);
    onRefresh();
  };

  const handleDeleteSlide = (id: string) => {
    AdminStoreService.deleteHeroSlide(id, adminName);
    setSlides(AdminStoreService.getHeroSlides());
    showToast('Hero Slide removed.');
    onRefresh();
  };

  const handleToggleSlideActive = (id: string) => {
    const sl = slides.find(s => s.slideId === id);
    if (!sl) return;
    AdminStoreService.updateHeroSlide({ ...sl, active: !sl.active }, adminName);
    setSlides(AdminStoreService.getHeroSlides());
    showToast('Slide visibility updated.');
    onRefresh();
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSlides(updated);
    AdminStoreService.saveHeroSlides(updated);
    onRefresh();
  };

  // --- FAQs Handlers (Item 5) ---
  const handleOpenFaqCreate = () => {
    setEditingFaq(null);
    setFaqQ('');
    setFaqQBn('');
    setFaqA('');
    setFaqABn('');
    setFaqCat('delivery');
    setIsFaqModalOpen(true);
  };

  const handleOpenFaqEdit = (f: FAQItem) => {
    setEditingFaq(f);
    setFaqQ(f.question);
    setFaqQBn(f.questionBn);
    setFaqA(f.answer);
    setFaqABn(f.answerBn);
    setFaqCat(f.category);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    const toSave: FAQItem = {
      id: editingFaq ? editingFaq.id : `faq-${Date.now()}`,
      category: faqCat,
      question: faqQ.trim(),
      questionBn: faqQBn.trim() || faqQ.trim(),
      answer: faqA.trim(),
      answerBn: faqABn.trim() || faqA.trim()
    };

    if (editingFaq) {
      AdminStoreService.updateFaq(toSave, adminName);
      showToast('FAQ updated successfully!');
    } else {
      AdminStoreService.addFaq(toSave, adminName);
      showToast('FAQ created and published!');
    }

    setFaqs(AdminStoreService.getFAQs());
    setIsFaqModalOpen(false);
    onRefresh();
  };

  const handleDeleteFaq = (id: string) => {
    AdminStoreService.deleteFaq(id, adminName);
    setFaqs(AdminStoreService.getFAQs());
    showToast('FAQ removed.');
    onRefresh();
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqs.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...faqs];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFaqs(updated);
    AdminStoreService.saveFAQs(updated);
    onRefresh();
  };

  // --- Policies Handlers ---
  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    AdminStoreService.savePolicies(policies, adminName);
    showToast('Legal & return policies updated on live website.');
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Homepage CMS &amp; Content Management</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time homepage section builder, hero slides, FAQ items, and customer policy management.
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSubTab('sections')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subTab === 'sections' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Sections ({sections.length})
          </button>
          <button
            onClick={() => setSubTab('hero')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subTab === 'hero' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Hero Slides ({slides.length})
          </button>
          <button
            onClick={() => setSubTab('faqs')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subTab === 'faqs' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setSubTab('policies')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subTab === 'policies' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Policies
          </button>
        </div>
      </div>

      {/* SUBTAB 1: HOMEPAGE SECTIONS BUILDER (Item 4) */}
      {subTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-black text-stone-900 text-sm">Homepage Section Layout &amp; Visibility</h3>
              <p className="text-xs text-stone-500">Reorder sections up/down or toggle visibility to customize storefront layout.</p>
            </div>

            <button
              onClick={handleOpenSectionCreate}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div 
                key={sec.id} 
                className={`bg-white p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  sec.isVisible ? 'border-stone-200 shadow-xs' : 'border-stone-200 bg-stone-50/70 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-stone-100 text-stone-500 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1 rounded hover:bg-stone-100 text-stone-500 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <h4 className="font-black text-stone-900 text-sm">{sec.title}</h4>
                      <span className="font-mono text-[10px] text-stone-400">({sec.key})</span>
                    </div>
                    {sec.titleBn && (
                      <div className="text-xs text-stone-500 font-bangla mt-0.5">{sec.titleBn}</div>
                    )}
                    {sec.subtitle && (
                      <div className="text-[11px] text-stone-400 mt-0.5">{sec.subtitle}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleSectionEnabled(sec.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                      sec.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{sec.isVisible ? 'Enabled' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenSectionEdit(sec)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                    title="Edit Section Content"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteSection(sec.id)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: HERO SLIDES (Item 6) */}
      {subTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-black text-stone-900 text-sm">Hero Carousel Banners</h3>
              <p className="text-xs text-stone-500">Add, edit, or reorder top promotional sliders with custom call-to-actions.</p>
            </div>

            <button
              onClick={handleOpenSlideCreate}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {slides.map((sl, idx) => (
              <div key={sl.slideId} className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-stone-900">
                    <img src={sl.image} alt={sl.title} className="w-full h-full object-cover opacity-75" />
                    <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/40 to-transparent"></div>
                    
                    {sl.badge && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                        {sl.badge}
                      </span>
                    )}

                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-stone-900/80 p-1 rounded-lg">
                      <button
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-stone-300 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up/Left"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1 text-stone-300 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down/Right"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-black text-base line-clamp-1">{sl.title}</h4>
                      <p className="text-xs text-stone-300 font-bangla line-clamp-1 mt-0.5">{sl.titleBn}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <p className="text-stone-600 line-clamp-2">{sl.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-bold">
                        CTA: {sl.ctaText} ({sl.ctaLink})
                      </span>
                      {sl.secondaryCtaText && (
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                          2nd: {sl.secondaryCtaText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleSlideActive(sl.slideId)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                      sl.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {sl.active !== false ? 'Active (Live)' : 'Hidden'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenSlideEdit(sl)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(sl.slideId)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: FAQS (Item 5) */}
      {subTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-black text-stone-900 text-sm">Frequently Asked Questions (FAQ)</h3>
              <p className="text-xs text-stone-500">Provide clear delivery, size, and factory direct return answers to customers.</p>
            </div>

            <button
              onClick={handleOpenFaqCreate}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div key={f.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold uppercase font-mono">
                        {f.category}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm">{f.question}</h4>
                    </div>
                    <div className="text-xs text-stone-500 font-bangla">{f.questionBn}</div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveFaq(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-stone-100 text-stone-500 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveFaq(idx, 'down')}
                      disabled={idx === faqs.length - 1}
                      className="p-1 rounded hover:bg-stone-100 text-stone-500 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenFaqEdit(f)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(f.id)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 text-stone-700">
                  <div>{f.answer}</div>
                  <div className="text-stone-500 font-bangla">{f.answerBn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: POLICIES */}
      {subTab === 'policies' && (
        <form onSubmit={handleSavePolicies} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-black text-stone-900 text-sm border-b border-stone-100 pb-3">
              Customer Guarantee &amp; Return Policy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Return Policy (English)</label>
                <textarea
                  rows={4}
                  value={policies.returnPolicy}
                  onChange={(e) => setPolicies({ ...policies, returnPolicy: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Return Policy (Bangla)</label>
                <textarea
                  rows={4}
                  value={policies.returnPolicyBn}
                  onChange={(e) => setPolicies({ ...policies, returnPolicyBn: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-black text-stone-900 text-sm border-b border-stone-100 pb-3">
              Shipping &amp; Delivery Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Shipping Terms (English)</label>
                <textarea
                  rows={4}
                  value={policies.shippingTerms}
                  onChange={(e) => setPolicies({ ...policies, shippingTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Shipping Terms (Bangla)</label>
                <textarea
                  rows={4}
                  value={policies.shippingTermsBn}
                  onChange={(e) => setPolicies({ ...policies, shippingTermsBn: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Policy Terms</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION MODAL */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">
                {editingSection ? 'Edit Homepage Section' : 'Add Custom Section'}
              </h3>
              <button onClick={() => setIsSectionModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Identifier / Key *</label>
                <input
                  type="text"
                  required
                  value={sectionKey}
                  onChange={(e) => setSectionKey(e.target.value)}
                  placeholder="e.g. promo-banner"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Title (English) *</label>
                <input
                  type="text"
                  required
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="e.g. Factory Direct Specials"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Title (Bangla)</label>
                <input
                  type="text"
                  value={sectionTitleBn}
                  onChange={(e) => setSectionTitleBn(e.target.value)}
                  placeholder="e.g. কারখানা সরাসরি স্পেশাল কালেকশন"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={sectionSubtitle}
                  onChange={(e) => setSectionSubtitle(e.target.value)}
                  placeholder="Optional section subtitle"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sectionEnabled}
                    onChange={(e) => setSectionEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span className="text-xs font-bold text-stone-800">Enabled on Storefront</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIDE MODAL */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">
                {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
              </h3>
              <button onClick={() => setIsSlideModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Headline (English) *</label>
                <input
                  type="text"
                  required
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="Headline in English"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Headline (Bangla) *</label>
                <input
                  type="text"
                  required
                  value={slideTitleBn}
                  onChange={(e) => setSlideTitleBn(e.target.value)}
                  placeholder="Headline in Bangla"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Background Image URL / Asset Path *</label>
                <input
                  type="text"
                  required
                  value={slideImage}
                  onChange={(e) => setSlideImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /src/assets/images/..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={slideBadge}
                    onChange={(e) => setSlideBadge(e.target.value)}
                    placeholder="e.g. Factory Direct"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Badge Tag (BN)</label>
                  <input
                    type="text"
                    value={slideBadgeBn}
                    onChange={(e) => setSlideBadgeBn(e.target.value)}
                    placeholder="e.g. সরাসরি কারখানা"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle (English)</label>
                <input
                  type="text"
                  value={slideSubtitle}
                  onChange={(e) => setSlideSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle (Bangla)</label>
                <input
                  type="text"
                  value={slideSubtitleBn}
                  onChange={(e) => setSlideSubtitleBn(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={slideCtaText}
                    onChange={(e) => setSlideCtaText(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={slideCtaLink}
                    onChange={(e) => setSlideCtaLink(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">
                {editingFaq ? 'Edit FAQ Item' : 'Add FAQ Item'}
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                <select
                  value={faqCat}
                  onChange={(e) => setFaqCat(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs cursor-pointer"
                >
                  <option value="delivery">Delivery &amp; Shipping</option>
                  <option value="size">Size &amp; Measurements</option>
                  <option value="return">Exchange &amp; Returns</option>
                  <option value="wholesale">Wholesale &amp; MOQ</option>
                  <option value="payment">Payment &amp; bKash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Question (English) *</label>
                <input
                  type="text"
                  required
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  placeholder="e.g. Can I check the fabric on delivery?"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Question (Bangla)</label>
                <input
                  type="text"
                  value={faqQBn}
                  onChange={(e) => setFaqQBn(e.target.value)}
                  placeholder="e.g. ডেলিভারির সময় চেক করে নেয়া যাবে কি?"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Answer (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Answer (Bangla)</label>
                <textarea
                  rows={3}
                  value={faqABn}
                  onChange={(e) => setFaqABn(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
