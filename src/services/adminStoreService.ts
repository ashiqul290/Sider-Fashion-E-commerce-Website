import { 
  Product, 
  ProductCategory,
  RetailCategoryKey, 
  CategoryInfo, 
  HeroSlide, 
  FAQItem, 
  PaymentAccountConfig, 
  OrderDetails, 
  WholesaleInquiry,
  OrderStatus,
  PaymentStatus,
  ProductColor,
  ProductSize,
  CategorySizeChart
} from '../types';
import { 
  AdminUser, 
  AdminRole, 
  AdminActivityLog, 
  Coupon, 
  BusinessSettings, 
  MarketingCampaign, 
  MediaAsset, 
  CustomerProfile, 
  PolicyContent, 
  SuspiciousOrderFlag,
  ContactItem,
  SocialLinkItem,
  HomepageSectionConfig,
  AdminLanguage
} from '../types/adminTypes';
import { INITIAL_PRODUCTS, CATEGORIES, BRAND_CONTACTS } from '../data/products';
import { HERO_SLIDES } from '../data/heroSlides';
import { PAYMENT_ACCOUNTS_CONFIG } from '../data/paymentAccounts';
import { SIDER_FAQS, DEFAULT_SIZE_CHARTS } from '../data/sizeGuideData';
import { normalizeBdPhone, isValidBdPhone, generateUniqueOrderId, OrderService } from './orderService';

// Storage Keys
const STORAGE_PREFIX = 'sider_admin_v3_';
const KEYS = {
  PRODUCTS: `${STORAGE_PREFIX}products`,
  CATEGORIES: `${STORAGE_PREFIX}categories`,
  HERO_SLIDES: `${STORAGE_PREFIX}hero_slides`,
  FAQS: `${STORAGE_PREFIX}faqs`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  PAYMENT_CONFIG: `${STORAGE_PREFIX}payment_config`,
  COUPONS: `${STORAGE_PREFIX}coupons`,
  CAMPAIGNS: `${STORAGE_PREFIX}campaigns`,
  MEDIA: `${STORAGE_PREFIX}media`,
  LOGS: `${STORAGE_PREFIX}audit_logs`,
  POLICIES: `${STORAGE_PREFIX}policies`,
  COLORS: `${STORAGE_PREFIX}colors`,
  SIZES: `${STORAGE_PREFIX}sizes`,
  SIZE_CHARTS: `${STORAGE_PREFIX}size_charts`,
  CONTACTS: `${STORAGE_PREFIX}contacts`,
  SOCIAL_LINKS: `${STORAGE_PREFIX}social_links`,
  HOMEPAGE_SECTIONS: `${STORAGE_PREFIX}homepage_sections`,
  CURRENT_ADMIN: `${STORAGE_PREFIX}current_session`,
  AUTH_TOKEN: `${STORAGE_PREFIX}auth_token`,
  ADMIN_LANG: `${STORAGE_PREFIX}admin_lang`,
  SUSPICIOUS_FLAGS: `${STORAGE_PREFIX}suspicious_flags`
};

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  brandName: 'Sider Fashion',
  tagline: 'Quality Fashion, Directly from Our Own Manufacturing',
  taglineBn: 'নিজস্ব কারখানায় তৈরি — পাইকারি ও খুচরা বিক্রি',
  primaryPhone: '01712773063',
  secondaryPhone: '01612241112',
  wholesalePhone: '01612241112',
  email: 'siderfashion.bd@gmail.com',
  facebookUrl: 'https://www.facebook.com/share/1G2hyYvWFR/',
  locationDisplay: 'Ashulia, Savar, Dhaka, Bangladesh',
  factoryAddress: 'Ashulia Industrial Zone, Savar, Dhaka, Bangladesh',
  workingHours: '9:00 AM – 10:00 PM (Everyday)',
  deliveryFeeInsideDhaka: 70,
  deliveryFeeOutsideDhaka: 120,
  freeDeliveryThreshold: 0,
  globalWholesaleMOQ: 12,
  defaultWholesaleDiscountPercent: 40,
  lowStockThreshold: 10,
  enableDuplicateTrxBlock: true,
  enableAutoSuspiciousFlag: true
};

export const DEFAULT_CONTACTS: ContactItem[] = [
  {
    id: 'contact-hotline',
    type: 'hotline',
    label: 'Customer Care Hotline',
    labelBn: 'কাস্টমার কেয়ার হটলাইন',
    value: '01712773063',
    isPrimary: true,
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'contact-whatsapp',
    type: 'whatsapp',
    label: 'WhatsApp Live Chat',
    labelBn: 'হোয়াটসঅ্যাপ লাইভ চ্যাট',
    value: '01712773063',
    isPrimary: true,
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'contact-wholesale',
    type: 'wholesale',
    label: 'Wholesale & B2B Inquiries',
    labelBn: 'পাইকারি ও কর্পোরেট ডিল',
    value: '01612241112',
    isPrimary: false,
    isActive: true,
    displayOrder: 3
  },
  {
    id: 'contact-email',
    type: 'email',
    label: 'Official Email',
    labelBn: 'অফিসিয়াল ইমেইল',
    value: 'siderfashion.bd@gmail.com',
    isPrimary: true,
    isActive: true,
    displayOrder: 4
  },
  {
    id: 'contact-factory',
    type: 'factory',
    label: 'Ashulia Factory Unit',
    labelBn: 'আশুলিয়া কারখানা ইউনিট',
    value: 'Ashulia Industrial Zone, Savar, Dhaka, Bangladesh',
    isPrimary: true,
    isActive: true,
    displayOrder: 5
  }
];

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'social-fb',
    platform: 'facebook',
    displayName: 'Facebook Page',
    url: 'https://www.facebook.com/share/1G2hyYvWFR/',
    icon: 'facebook',
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'social-wa',
    platform: 'whatsapp',
    displayName: 'WhatsApp Official',
    url: 'https://wa.me/8801712773063',
    icon: 'whatsapp',
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'social-ig',
    platform: 'instagram',
    displayName: 'Instagram',
    url: 'https://instagram.com/siderfashion.bd',
    icon: 'instagram',
    isActive: true,
    displayOrder: 3
  },
  {
    id: 'social-tt',
    platform: 'tiktok',
    displayName: 'TikTok',
    url: 'https://tiktok.com/@siderfashion',
    icon: 'tiktok',
    isActive: true,
    displayOrder: 4
  },
  {
    id: 'social-yt',
    platform: 'youtube',
    displayName: 'YouTube Channel',
    url: 'https://youtube.com/@siderfashion',
    icon: 'youtube',
    isActive: true,
    displayOrder: 5
  }
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  { id: 'sec-hero', key: 'hero', title: 'Hero Carousel', titleBn: 'হিরো ক্যারোজেল', subtitle: 'Main visual banner slider', isVisible: true, displayOrder: 1 },
  { id: 'sec-portals', key: 'portals', title: 'Dual Shopping Choice (Retail vs Wholesale)', titleBn: 'খুচরা ও পাইকারি শপিং পোর্টাল', subtitle: 'Instant portal switcher', isVisible: true, displayOrder: 2 },
  { id: 'sec-categories', key: 'categories', title: 'Featured Categories', titleBn: 'জনপ্রিয় ক্যাটাগরি সমূহ', subtitle: 'Category navigation cards', isVisible: true, displayOrder: 3 },
  { id: 'sec-products', key: 'featured-products', title: 'Featured & Catalog Products', titleBn: 'সেরা নির্বাচিত কালেকশন', subtitle: 'Curated retail products grid', isVisible: true, displayOrder: 4 },
  { id: 'sec-why-us', key: 'why-choose-us', title: 'Why Choose Sider Fashion', titleBn: 'কেন সাইডার ফ্যাশন সেরা', subtitle: 'Factory-direct value propositions', isVisible: true, displayOrder: 5 },
  { id: 'sec-wholesale', key: 'wholesale-highlight', title: 'Wholesale & B2B Portal Section', titleBn: 'পাইকারি ও কর্পোরেট সুযোগ', subtitle: 'Factory MOQ & bulk manufacturing', isVisible: true, displayOrder: 6 },
  { id: 'sec-social', key: 'social-community', title: 'Social Community & Live Reviews', titleBn: 'সোশ্যাল মিডিয়া ও রিভিউ', subtitle: 'Facebook group & customer community', isVisible: true, displayOrder: 7 },
  { id: 'sec-faqs', key: 'faqs', title: 'Frequently Asked Questions', titleBn: 'সাধারণ প্রশ্নোত্তর (FAQ)', subtitle: 'Customer service queries', isVisible: true, displayOrder: 8 },
  { id: 'sec-payments', key: 'payment-methods', title: 'Payment Gateways & Delivery Info', titleBn: 'পেমেন্ট ও ডেলিভারি তথ্য', subtitle: 'Cash on delivery & mobile banking trust badges', isVisible: true, displayOrder: 9 }
];

export const DEFAULT_COLORS: ProductColor[] = [
  { id: 'col-navy', name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1e293b', isActive: true, displayOrder: 1 },
  { id: 'col-white', name: 'Pure White', nameBn: 'সাদা', hex: '#ffffff', isActive: true, displayOrder: 2 },
  { id: 'col-black', name: 'Jet Black', nameBn: 'কালো', hex: '#0a0a0a', isActive: true, displayOrder: 3 },
  { id: 'col-olive', name: 'Olive Green', nameBn: 'অলিভ গ্রিন', hex: '#4d5d43', isActive: true, displayOrder: 4 },
  { id: 'col-maroon', name: 'Maroon', nameBn: 'মেরুন', hex: '#6b1d2f', isActive: true, displayOrder: 5 },
  { id: 'col-sky', name: 'Sky Blue', nameBn: 'আকাশি নীল', hex: '#38bdf8', isActive: true, displayOrder: 6 },
  { id: 'col-gray', name: 'Steel Gray', nameBn: 'স্টিল গ্রে', hex: '#64748b', isActive: true, displayOrder: 7 },
  { id: 'col-beige', name: 'Cream / Beige', nameBn: 'ক্রিম / বেইজ', hex: '#f5f5dc', isActive: true, displayOrder: 8 },
  { id: 'col-mustard', name: 'Mustard Yellow', nameBn: 'সরিষা হলুদ', hex: '#ca8a04', isActive: true, displayOrder: 9 },
  { id: 'col-royal', name: 'Royal Blue', nameBn: 'রয়্যাল ব্লু', hex: '#1d4ed8', isActive: true, displayOrder: 10 }
];

export const DEFAULT_MASTER_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'cpn-welcome',
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 800,
    isActive: true,
    timesUsed: 14,
    applicableScope: 'retail',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cpn-eid2026',
    code: 'EID2026',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1500,
    maxDiscount: 300,
    isActive: true,
    timesUsed: 42,
    applicableScope: 'all',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cpn-wholesale-save',
    code: 'BULK500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 5000,
    isActive: true,
    timesUsed: 6,
    applicableScope: 'wholesale',
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_POLICIES: PolicyContent = {
  returnPolicy: 'At Sider Fashion, we manufacture in our own Savar factory with rigorous 3-step quality checks. You have the full right to check your package in front of the delivery person before payment. If there is any defect or mismatch, you can immediately return it without penalty.',
  returnPolicyBn: 'সাইডার ফ্যাশন নিজস্ব কারখানায় মান নিয়ন্ত্রণ করে পোশাক তৈরি করে। ডেলিভারিম্যানের সামনে পার্সেল খুলে ফেব্রিক ও কোয়ালিটি দেখে নেওয়ার সুযোগ রয়েছে। কোনো সমস্যা থাকলে তাৎক্ষণিক ডেলিভারিম্যানকে রিটার্ন দিতে পারেন।',
  exchangePolicy: 'Wrong size or color? We offer a hassle-free 7-day exchange warranty. Keep the original tags intact and contact our hotline or WhatsApp at 01712773063.',
  exchangePolicyBn: 'সাইজ অথবা রঙের পরিবর্তনে আমরা ৭ দিনের সহজ এক্সচেঞ্জ সুবিধা প্রদান করি। হটলাইন 01712773063 এ মেসেজ দিন।',
  deliveryPolicy: 'Inside Dhaka: Delivery fee ৳70 within 24 to 48 hours. Outside Dhaka: Delivery fee ৳120 within 48 to 72 hours via leading courier services (Steadfast, Pathao).',
  deliveryPolicyBn: 'ঢাকার ভেতরে ডেলিভারি চার্জ মাত্র ৭০ টাকা (২৪-৪৮ ঘণ্টায়)। ঢাকার বাইরে সারা দেশে ডেলিভারি চার্জ ১২০ টাকা (৪৮-৭২ ঘণ্টায়)।',
  shippingInfo: 'All orders are dispatched directly from our Savar & Ashulia manufacturing and fulfillment hub in secure weather-resistant packaging.',
  shippingInfoBn: 'সাভার ও আশুলিয়া কারখানা হাব থেকে সরাসরি সিকিউর প্যাকেজিংয়ে পার্সেল পাঠানো হয়।',
  privacyPolicy: 'We respect your privacy. Sider Fashion only collects your name, phone number, and delivery address to fulfill and dispatch your orders. We never sell or share your information with third parties.',
  privacyPolicyBn: 'আমরা আপনার তথ্যের গোপনীয়তা রক্ষা করি। আপনার নাম, মোবাইল নম্বর ও ঠিকানা শুধুমাত্র পার্সেল প্রেরণের কাজে ব্যবহার করা হয়।',
  termsConditions: 'By placing an order on Sider Fashion, you agree to our fair usage and cash on delivery terms. For wholesale orders, minimum order quantity rules apply.',
  termsConditionsBn: 'সাইডার ফ্যাশনে অর্ডার করার মাধ্যমে আপনি আমাদের সাধারণ নিয়মাবলি মেনে নিচ্ছেন। ক্যাশ অন ডেলিভারি পার্সেল সঠিক ঠিকানায় রিসিভ করার অনুরোধ করা হচ্ছে।',
  aboutUs: 'Sider Fashion is a premier ready-made garments manufacturer based in Ashulia & Savar, Dhaka. We specialize in premium cotton shirts, katua, and contemporary menswear crafted directly at our own factory.',
  aboutUsBn: 'সাইডার ফ্যাশন আশুলিয়া, সাভার ভিত্তিক নিজস্ব পোশাক প্রস্তুতকারক ও সরবরাহকারী ব্র্যান্ড। আমরা প্রিমিয়াম শার্ট ও কতুয়া সরাসরি কারখানায় তৈরি করে গ্রাহক ও পাইকারি ব্যবসায়ীদের কাছে পৌঁছে দিই।'
};

export const PRESET_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-owner-saon',
    username: 'saon',
    name: 'Abir Hosen Saon',
    role: 'owner',
    roleTitle: 'Store Owner & Founder',
    email: 'abirhosensaon@gmail.com',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-admin-dispatch',
    username: 'dispatch',
    name: 'Showroom Manager',
    role: 'admin',
    roleTitle: 'Orders & Inventory Admin',
    email: 'dispatch@siderfashion.com',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const PRESET_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cmp-fb-summer',
    source: 'Facebook Ads',
    medium: 'cpc',
    campaignName: 'Summer Shirt Drop Savar Unit',
    adSpend: 3500,
    visitorsCount: 1420,
    ordersCount: 28,
    revenueGenerated: 24500,
    notes: 'Video ad showing factory production & fabric check on delivery',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'cmp-fb-katua',
    source: 'Facebook Ads',
    medium: 'cpc',
    campaignName: 'Men Jacquard Katua Collection',
    adSpend: 2200,
    visitorsCount: 890,
    ordersCount: 19,
    revenueGenerated: 18600,
    notes: 'Targeting Dhaka, Chittagong, Sylhet',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

// In-Memory Global Store Cache for Instant Response
let storeCache = {
  version: Date.now(),
  products: INITIAL_PRODUCTS,
  categories: CATEGORIES,
  heroSlides: HERO_SLIDES,
  faqs: SIDER_FAQS,
  settings: DEFAULT_BUSINESS_SETTINGS,
  paymentConfig: PAYMENT_ACCOUNTS_CONFIG,
  coupons: DEFAULT_COUPONS,
  campaigns: PRESET_CAMPAIGNS,
  media: [] as MediaAsset[],
  policies: DEFAULT_POLICIES,
  colors: DEFAULT_COLORS,
  sizes: DEFAULT_MASTER_SIZES,
  sizeCharts: DEFAULT_SIZE_CHARTS,
  contacts: DEFAULT_CONTACTS,
  socialLinks: DEFAULT_SOCIAL_LINKS,
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
  auditLogs: [] as AdminActivityLog[]
};

// Listeners for real-time reactivity
type Listener = () => void;
const listeners: Set<Listener> = new Set();

/**
 * Real Master Admin Store Service Layer
 * Interfaces directly with Backend Database REST API & Real-time Synchronization
 */
export class AdminStoreService {
  private static isInitialized = false;

  private static cleanupStaleStorage(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('sider_admin_v1_') || k.startsWith('sider_admin_v2_') || k.includes('backup_temp'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => {
        try { localStorage.removeItem(k); } catch { /* ignore */ }
      });
    } catch {
      // ignore
    }
  }

  private static sanitizeForStorage<T>(key: string, value: T): any {
    if (key === KEYS.PRODUCTS && Array.isArray(value)) {
      // Strip oversized raw base64 data URIs from localStorage copy only (in-memory storeCache retains full objects)
      return (value as Product[]).map(p => {
        if (!p.images || p.images.length === 0) return p;
        const cleanImages = p.images.map(img => {
          if (typeof img === 'string' && img.startsWith('data:') && img.length > 50000) {
            return 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80';
          }
          return img;
        });
        return { ...p, images: cleanImages };
      });
    }
    if (key === KEYS.LOGS && Array.isArray(value) && value.length > 40) {
      return value.slice(0, 40);
    }
    return value;
  }

  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn(`Could not read key "${key}" from localStorage`, e);
    }
    return defaultValue;
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const sanitized = this.sanitizeForStorage(key, value);
      localStorage.setItem(key, JSON.stringify(sanitized));
    } catch {
      // Handle QuotaExceededError smoothly without crashing
      try {
        this.cleanupStaleStorage();
        if (key === KEYS.PRODUCTS && Array.isArray(value)) {
          const minimal = (value as Product[]).map(p => ({
            ...p,
            images: (p.images || []).map(img => 
              (typeof img === 'string' && img.startsWith('data:') && img.length > 15000) 
                ? 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' 
                : img
            )
          }));
          localStorage.setItem(key, JSON.stringify(minimal));
        }
      } catch {
        // Safe fallback: in-memory storeCache retains full active data
      }
    }
  }

  // Subscribe to changes (used by CartContext & Admin panels)
  static subscribe(listener: Listener): () => void {
    listeners.add(listener);
    if (!this.isInitialized) {
      this.init().catch(() => {});
    }
    return () => {
      listeners.delete(listener);
    };
  }

  static notifyListeners(): void {
    listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in store listener:', e);
      }
    });
  }

  // Initialize and sync with server
  static async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // First load from localStorage to be instantaneous
    storeCache.products = this.getItem<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    storeCache.categories = this.getItem<CategoryInfo[]>(KEYS.CATEGORIES, CATEGORIES);
    storeCache.heroSlides = this.getItem<HeroSlide[]>(KEYS.HERO_SLIDES, HERO_SLIDES);
    storeCache.faqs = this.getItem<FAQItem[]>(KEYS.FAQS, SIDER_FAQS);
    storeCache.settings = this.getItem<BusinessSettings>(KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
    storeCache.paymentConfig = this.getItem<PaymentAccountConfig>(KEYS.PAYMENT_CONFIG, PAYMENT_ACCOUNTS_CONFIG);
    storeCache.coupons = this.getItem<Coupon[]>(KEYS.COUPONS, DEFAULT_COUPONS);
    storeCache.campaigns = this.getItem<MarketingCampaign[]>(KEYS.CAMPAIGNS, PRESET_CAMPAIGNS);
    storeCache.policies = this.getItem<PolicyContent>(KEYS.POLICIES, DEFAULT_POLICIES);
    storeCache.colors = this.getItem<ProductColor[]>(KEYS.COLORS, DEFAULT_COLORS);
    storeCache.sizes = this.getItem<string[]>(KEYS.SIZES, DEFAULT_MASTER_SIZES);
    storeCache.sizeCharts = this.getItem<CategorySizeChart[]>(KEYS.SIZE_CHARTS, DEFAULT_SIZE_CHARTS);
    storeCache.contacts = this.getItem<ContactItem[]>(KEYS.CONTACTS, DEFAULT_CONTACTS);
    storeCache.socialLinks = this.getItem<SocialLinkItem[]>(KEYS.SOCIAL_LINKS, DEFAULT_SOCIAL_LINKS);
    storeCache.homepageSections = this.getItem<HomepageSectionConfig[]>(KEYS.HOMEPAGE_SECTIONS, DEFAULT_HOMEPAGE_SECTIONS);
    storeCache.auditLogs = this.getItem<AdminActivityLog[]>(KEYS.LOGS, []);

    // Sync with backend database immediately
    try {
      await this.syncWithServer();
    } catch {
      // Continue with cached state
    }

    // Connect to Server-Sent Events (SSE) for Real-Time synchronization
    this.setupServerSync();
  }

  static async syncWithServer(): Promise<boolean> {
    try {
      const res = await fetch('/api/sync');
      if (!res.ok) return false;
      const json = await res.json();
      if (json && json.data) {
        const d = json.data;
        if (Array.isArray(d.products)) {
          storeCache.products = d.products;
          this.setItem(KEYS.PRODUCTS, d.products);
        }
        if (Array.isArray(d.categories)) {
          storeCache.categories = d.categories;
          this.setItem(KEYS.CATEGORIES, d.categories);
        }
        if (Array.isArray(d.heroSlides)) {
          storeCache.heroSlides = d.heroSlides;
          this.setItem(KEYS.HERO_SLIDES, d.heroSlides);
        }
        if (Array.isArray(d.faqs)) {
          storeCache.faqs = d.faqs;
          this.setItem(KEYS.FAQS, d.faqs);
        }
        if (d.settings) {
          storeCache.settings = d.settings;
          this.setItem(KEYS.SETTINGS, d.settings);
        }
        if (d.paymentAccounts || d.paymentConfig) {
          storeCache.paymentConfig = d.paymentAccounts || d.paymentConfig;
          this.setItem(KEYS.PAYMENT_CONFIG, storeCache.paymentConfig);
        }
        if (Array.isArray(d.coupons)) {
          storeCache.coupons = d.coupons;
          this.setItem(KEYS.COUPONS, d.coupons);
        }
        if (Array.isArray(d.campaigns)) {
          storeCache.campaigns = d.campaigns;
          this.setItem(KEYS.CAMPAIGNS, d.campaigns);
        }
        if (d.policies) {
          storeCache.policies = d.policies;
          this.setItem(KEYS.POLICIES, d.policies);
        }
        if (Array.isArray(d.colors)) {
          storeCache.colors = d.colors;
          this.setItem(KEYS.COLORS, d.colors);
        }
        if (Array.isArray(d.sizes)) {
          storeCache.sizes = d.sizes;
          this.setItem(KEYS.SIZES, d.sizes);
        }
        if (Array.isArray(d.sizeCharts)) {
          storeCache.sizeCharts = d.sizeCharts;
          this.setItem(KEYS.SIZE_CHARTS, d.sizeCharts);
        }
        if (Array.isArray(d.contacts)) {
          storeCache.contacts = d.contacts;
          this.setItem(KEYS.CONTACTS, d.contacts);
        }
        if (Array.isArray(d.socialLinks)) {
          storeCache.socialLinks = d.socialLinks;
          this.setItem(KEYS.SOCIAL_LINKS, d.socialLinks);
        }
        if (Array.isArray(d.homepageSections)) {
          storeCache.homepageSections = d.homepageSections;
          this.setItem(KEYS.HOMEPAGE_SECTIONS, d.homepageSections);
        }
        if (Array.isArray(d.auditLogs)) {
          storeCache.auditLogs = d.auditLogs;
          this.setItem(KEYS.LOGS, d.auditLogs);
        }
        if (Array.isArray(d.orders)) {
          OrderService.saveOrdersToStorage(d.orders);
        }
        if (Array.isArray(d.wholesaleInquiries)) {
          OrderService.saveWholesaleOrdersToStorage(d.wholesaleInquiries);
        }

        storeCache.version = json.version || Date.now();
        this.notifyListeners();
        return true;
      }
    } catch (e) {
      console.warn('[AdminStoreService] Sync request failed, running in local fallback mode', e);
    }
    return false;
  }

  private static setupServerSync(): void {
    try {
      if (typeof window === 'undefined' || !window.EventSource) return;
      const es = new EventSource('/api/sync/events');
      es.onmessage = () => {
        this.syncWithServer().catch(() => {});
      };
      es.onerror = () => {
        // close and retry silently
        try { es.close(); } catch { /* ignore */ }
        setTimeout(() => this.setupServerSync(), 15000);
      };
    } catch {
      // ignore
    }
  }

  // --- Admin Language Preference (Bangla ↔ English) ---
  // Strictly isolated to Admin Panel only; does NOT affect customer website
  static getAdminLanguage(): AdminLanguage {
    return this.getItem<AdminLanguage>(KEYS.ADMIN_LANG, 'bn');
  }

  static setAdminLanguage(lang: AdminLanguage): void {
    this.setItem(KEYS.ADMIN_LANG, lang);
    this.notifyListeners();
  }

  // --- Auth & Session Management ---

  static getAuthToken(): string | null {
    return this.getItem<string | null>(KEYS.AUTH_TOKEN, null);
  }

  static getActiveAdmin(): AdminUser | null {
    return this.getItem<AdminUser | null>(KEYS.CURRENT_ADMIN, null);
  }

  static getCurrentUser(): AdminUser | null {
    const token = this.getAuthToken();
    const user = this.getActiveAdmin();
    if (!token || !user) return null;
    return user;
  }

  static async verifySession(): Promise<boolean> {
    try {
      const token = this.getAuthToken();
      const current = this.getActiveAdmin();
      if (!token && !current) return false;

      const res = await fetch('/api/admin/session/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId: current?.id })
      });
      const data = await res.json();
      if (!data.valid) {
        try {
          localStorage.removeItem(KEYS.CURRENT_ADMIN);
          localStorage.removeItem(KEYS.AUTH_TOKEN);
        } catch {
          // ignore
        }
        this.notifyListeners();
        return false;
      }
      if (data.user) {
        this.setItem(KEYS.CURRENT_ADMIN, data.user);
      }
      return true;
    } catch {
      return false;
    }
  }

  static async loginAdminAsync(
    emailOrUser: string, 
    password: string, 
    expectedRole?: 'owner' | 'staff'
  ): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUser, password, expectedRole })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) {
          this.setItem(KEYS.AUTH_TOKEN, data.token);
        }
        this.setItem(KEYS.CURRENT_ADMIN, data.user);
        this.notifyListeners();
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection error during login.' };
    }
  }

  static async logoutAdminAsync(): Promise<void> {
    const current = this.getActiveAdmin();
    const token = this.getAuthToken();
    if (current || token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: current?.id, email: current?.email, token })
        });
      } catch {
        // ignore
      }
      if (current) {
        this.logActivity({
          adminName: current.name,
          adminRole: current.role,
          action: 'Admin Logged Out',
          category: 'auth'
        });
      }
    }
    try {
      localStorage.removeItem(KEYS.CURRENT_ADMIN);
      localStorage.removeItem(KEYS.AUTH_TOKEN);
    } catch {
      // ignore
    }
    this.notifyListeners();
  }

  static logoutAdmin(): void {
    this.logoutAdminAsync().catch(() => {});
  }

  static logout(): void {
    this.logoutAdmin();
  }

  // --- Admin Accounts Management (Owner Only, Max 4 Accounts, 1 Owner + 3 Admins) ---

  static async fetchAdminUsers(requesterId?: string): Promise<{ success: boolean; users: AdminUser[]; meta?: any; error?: string }> {
    try {
      const url = requesterId ? `/api/admin/users?requesterId=${encodeURIComponent(requesterId)}` : '/api/admin/users';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        return { success: true, users: data.users, meta: data.meta };
      }
      return { success: false, users: PRESET_ADMIN_USERS, error: data.error };
    } catch (e: any) {
      return { success: true, users: PRESET_ADMIN_USERS };
    }
  }

  static async createAdminUser(
    name: string, 
    email: string, 
    password: string, 
    roleTitle: string, 
    currentAdminId: string
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, roleTitle, currentAdminId })
      });
      const data = await res.json();
      if (data.success) {
        this.notifyListeners();
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Failed to create admin user' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection error' };
    }
  }

  static async updateAdminUser(
    id: string, 
    updates: { name?: string; roleTitle?: string; status?: 'active' | 'disabled'; newPassword?: string },
    currentAdminId: string
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, currentAdminId })
      });
      const data = await res.json();
      if (data.success) {
        this.notifyListeners();
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Failed to update admin user' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection error' };
    }
  }

  static async deleteAdminUser(id: string, currentAdminId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/users/${id}?currentAdminId=${encodeURIComponent(currentAdminId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        this.notifyListeners();
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete admin user' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection error' };
    }
  }

  static async changePassword(
    userId: string, 
    email: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to change password' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection error' };
    }
  }

  static async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        return { 
          success: true, 
          message: data.message
        };
      }
      return { success: false, error: data.error || 'ভেরিফিকেশন কোড পাঠানো সম্ভব হয়নি' };
    } catch (e: any) {
      return { success: false, error: e.message || 'কানেকশন ত্রুটি' };
    }
  }

  static async verifyAndResetPassword(
    email: string, 
    code: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/forgot-password/verify-and-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে' };
    } catch (e: any) {
      return { success: false, error: e.message || 'কানেকশন ত্রুটি' };
    }
  }

  // --- Audit Logging ---

  static getAuditLogs(): AdminActivityLog[] {
    return storeCache.auditLogs.length > 0 ? storeCache.auditLogs : this.getItem<AdminActivityLog[]>(KEYS.LOGS, []);
  }

  static logActivity(entry: Omit<AdminActivityLog, 'id' | 'timestamp'>): void {
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    const logs = this.getAuditLogs();
    const updated = [newLog, ...logs.slice(0, 499)];
    storeCache.auditLogs = updated;
    this.setItem(KEYS.LOGS, updated);

    // Sync to backend
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: newLog })
    }).catch(() => {});
  }

  static clearAuditLogs(adminName = 'Super Admin'): void {
    storeCache.auditLogs = [];
    this.setItem(KEYS.LOGS, []);
    this.logActivity({
      adminName,
      adminRole: 'super_admin',
      action: 'Audit Logs Cleared',
      category: 'setting',
      details: 'Admin audit logs history reset'
    });
    this.notifyListeners();
  }

  // --- Products Management ---

  static getProducts(): Product[] {
    return storeCache.products.length > 0 ? storeCache.products : this.getItem<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static saveProducts(products: Product[]): void {
    storeCache.products = products;
    this.setItem(KEYS.PRODUCTS, products);
    this.notifyListeners();
  }

  static addProduct(product: Product, adminName = 'Admin'): void {
    const products = this.getProducts();
    const updated = [product, ...products.filter(p => p.id !== product.id && p.code !== product.code)];
    this.saveProducts(updated);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Product Created',
      category: 'product',
      targetId: product.id,
      targetName: product.name,
      details: `Added SKU: ${product.code}, Retail: ৳${product.retailPrice}, Wholesale: ৳${product.wholesalePrice}`
    });

    // Send to backend API
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, adminName })
    }).catch(e => console.error('Failed to post product to backend', e));
  }

  static updateProduct(updatedProd: Product, adminName = 'Admin'): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProd.id || p.code === updatedProd.code);
    if (index === -1) {
      this.addProduct(updatedProd, adminName);
      return;
    }
    products[index] = updatedProd;
    this.saveProducts([...products]);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Product Updated',
      category: 'product',
      targetId: updatedProd.id,
      targetName: updatedProd.name,
      newValue: `Retail ৳${updatedProd.retailPrice}, WS ৳${updatedProd.wholesalePrice}, Stock ${updatedProd.stock}`
    });

    // Send to backend API
    fetch(`/api/products/${encodeURIComponent(updatedProd.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: updatedProd, adminName })
    }).catch(e => console.error('Failed to put product to backend', e));
  }

  static deleteProduct(productId: string, adminName = 'Admin'): { success: boolean; message: string } {
    const products = this.getProducts();
    const prod = products.find(p => p.id === productId || p.code === productId);
    if (!prod) return { success: false, message: 'Product not found.' };

    const updated = products.filter(p => p.id !== productId && p.code !== productId);
    this.saveProducts(updated);
    this.logActivity({
      adminName,
      adminRole: 'super_admin',
      action: 'Product Deleted',
      category: 'product',
      targetId: productId,
      targetName: prod.name,
      details: `Permanently removed SKU: ${prod.code}`
    });

    // Send to backend API
    fetch(`/api/products/${encodeURIComponent(productId)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(e => console.error('Failed to delete product from backend', e));

    return { success: true, message: `Product "${prod.name}" successfully deleted.` };
  }

  static duplicateProduct(productId: string, adminName = 'Admin'): Product | null {
    const products = this.getProducts();
    const prod = products.find(p => p.id === productId);
    if (!prod) return null;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newCode = `${prod.code}-COPY-${randomSuffix}`;
    const duplicated: Product = {
      ...prod,
      id: `prod-${Date.now()}-${randomSuffix}`,
      code: newCode,
      name: `${prod.name} (Copy)`,
      nameBn: `${prod.nameBn} (কপি)`,
      stock: prod.stock || 50,
      isFeatured: false,
      isNewArrival: true,
      reviewsCount: 0
    };

    this.addProduct(duplicated, adminName);
    return duplicated;
  }

  // --- Categories Management ---

  static getCategories(): CategoryInfo[] {
    return storeCache.categories.length > 0 ? storeCache.categories : this.getItem<CategoryInfo[]>(KEYS.CATEGORIES, CATEGORIES);
  }

  static saveCategories(categories: CategoryInfo[]): void {
    storeCache.categories = categories;
    this.setItem(KEYS.CATEGORIES, categories);
    this.notifyListeners();
  }

  static addCategory(category: CategoryInfo, adminName = 'Admin'): void {
    const cats = this.getCategories();
    const updated = [...cats, category];
    this.saveCategories(updated);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Category Added',
      category: 'cms',
      targetId: category.id,
      targetName: category.name,
      details: `Added new category with key: ${category.key}`
    });

    // Post to backend
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, adminName })
    }).catch(() => {});
  }

  static updateCategory(updatedCat: CategoryInfo, adminName = 'Admin'): void {
    const cats = this.getCategories();
    const index = cats.findIndex(c => c.id === updatedCat.id || c.key === updatedCat.key);
    if (index === -1) {
      this.addCategory(updatedCat, adminName);
      return;
    }
    cats[index] = updatedCat;
    this.saveCategories([...cats]);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Category Updated',
      category: 'cms',
      targetId: updatedCat.id,
      targetName: updatedCat.name
    });

    // Put to backend
    fetch(`/api/categories/${encodeURIComponent(updatedCat.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: updatedCat, adminName })
    }).catch(() => {});
  }

  static deleteCategory(categoryId: string, adminName = 'Admin', moveTo = 'all'): { success: boolean; message: string } {
    const cats = this.getCategories();
    const cat = cats.find(c => c.id === categoryId || c.key === categoryId);
    if (!cat) return { success: false, message: 'Category not found.' };

    const updated = cats.filter(c => c.id !== categoryId && c.key !== categoryId);
    this.saveCategories(updated);

    // Reassign products
    const prods = this.getProducts();
    let moved = 0;
    prods.forEach(p => {
      if (p.category === cat.id || p.category === cat.key) {
        p.category = moveTo as ProductCategory;
        moved++;
      }
    });
    if (moved > 0) {
      this.saveProducts(prods);
    }

    this.logActivity({
      adminName,
      adminRole: 'super_admin',
      action: 'Category Deleted',
      category: 'cms',
      targetId: categoryId,
      targetName: cat.name,
      details: `Deleted category. Reassigned ${moved} products.`
    });

    // Delete on backend
    fetch(`/api/categories/${encodeURIComponent(categoryId)}?adminName=${encodeURIComponent(adminName)}&moveTo=${encodeURIComponent(moveTo)}`, {
      method: 'DELETE'
    }).catch(() => {});

    return { success: true, message: `Category "${cat.name}" deleted. (${moved} products reassigned)` };
  }

  // --- Contacts CMS ---

  static getContacts(): ContactItem[] {
    return storeCache.contacts.length > 0 ? storeCache.contacts : this.getItem<ContactItem[]>(KEYS.CONTACTS, DEFAULT_CONTACTS);
  }

  static saveContacts(contacts: ContactItem[], adminName = 'Admin'): void {
    storeCache.contacts = contacts;
    this.setItem(KEYS.CONTACTS, contacts);
    this.notifyListeners();
  }

  static addContact(contact: ContactItem, adminName = 'Admin'): void {
    const list = this.getContacts();
    const updated = [...list, contact];
    this.saveContacts(updated, adminName);
    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, adminName })
    }).catch(() => {});
  }

  static updateContact(contact: ContactItem, adminName = 'Admin'): void {
    const list = this.getContacts();
    const idx = list.findIndex(c => c.id === contact.id);
    if (idx !== -1) {
      list[idx] = contact;
    } else {
      list.push(contact);
    }
    this.saveContacts([...list], adminName);
    fetch(`/api/contacts/${encodeURIComponent(contact.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, adminName })
    }).catch(() => {});
  }

  static deleteContact(contactId: string, adminName = 'Admin'): void {
    const list = this.getContacts();
    const updated = list.filter(c => c.id !== contactId);
    this.saveContacts(updated, adminName);
    fetch(`/api/contacts/${encodeURIComponent(contactId)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  // --- Social Links CMS ---

  static getSocialLinks(): SocialLinkItem[] {
    return storeCache.socialLinks.length > 0 ? storeCache.socialLinks : this.getItem<SocialLinkItem[]>(KEYS.SOCIAL_LINKS, DEFAULT_SOCIAL_LINKS);
  }

  static saveSocialLinks(links: SocialLinkItem[], adminName = 'Admin'): void {
    storeCache.socialLinks = links;
    this.setItem(KEYS.SOCIAL_LINKS, links);
    this.notifyListeners();
  }

  static addSocialLink(socialLink: SocialLinkItem, adminName = 'Admin'): void {
    const list = this.getSocialLinks();
    const updated = [...list, socialLink];
    this.saveSocialLinks(updated, adminName);
    fetch('/api/social-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ socialLink, adminName })
    }).catch(() => {});
  }

  static deleteSocialLink(id: string, adminName = 'Admin'): void {
    const list = this.getSocialLinks();
    const updated = list.filter(s => s.id !== id);
    this.saveSocialLinks(updated, adminName);
    fetch(`/api/social-links/${encodeURIComponent(id)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  // --- Hero Carousel Slides ---

  static getHeroSlides(): HeroSlide[] {
    const list = storeCache.heroSlides.length > 0 ? storeCache.heroSlides : this.getItem<HeroSlide[]>(KEYS.HERO_SLIDES, HERO_SLIDES);
    if (!list || list.length < 5) {
      return HERO_SLIDES;
    }
    return list;
  }

  static saveHeroSlides(slides: HeroSlide[]): void {
    storeCache.heroSlides = slides;
    this.setItem(KEYS.HERO_SLIDES, slides);
    this.notifyListeners();
  }

  static addHeroSlide(slide: HeroSlide, adminName = 'Admin'): void {
    const slides = this.getHeroSlides();
    const updated = [...slides, slide];
    this.saveHeroSlides(updated);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Hero Slide Added',
      category: 'cms',
      targetId: slide.slideId,
      targetName: slide.title
    });
    fetch('/api/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slide, adminName })
    }).catch(() => {});
  }

  static updateHeroSlide(slide: HeroSlide, adminName = 'Admin'): void {
    const slides = this.getHeroSlides();
    const idx = slides.findIndex(s => s.slideId === slide.slideId);
    if (idx !== -1) {
      slides[idx] = slide;
    } else {
      slides.push(slide);
    }
    this.saveHeroSlides([...slides]);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Hero Slide Updated',
      category: 'cms',
      targetId: slide.slideId,
      targetName: slide.title
    });
    fetch('/api/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slide, adminName })
    }).catch(() => {});
  }

  static deleteHeroSlide(slideId: string, adminName = 'Admin'): void {
    const slides = this.getHeroSlides();
    const updated = slides.filter(s => s.slideId !== slideId);
    this.saveHeroSlides(updated);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Hero Slide Deleted',
      category: 'cms',
      targetId: slideId
    });
    fetch(`/api/hero-slides/${encodeURIComponent(slideId)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  // --- FAQs Management ---

  static getFAQs(): FAQItem[] {
    return storeCache.faqs.length > 0 ? storeCache.faqs : this.getItem<FAQItem[]>(KEYS.FAQS, SIDER_FAQS);
  }

  static saveFAQs(faqs: FAQItem[]): void {
    storeCache.faqs = faqs;
    this.setItem(KEYS.FAQS, faqs);
    this.notifyListeners();
  }

  static addFaq(faq: FAQItem, adminName = 'Admin'): void {
    const list = this.getFAQs();
    const updated = [...list, faq];
    this.saveFAQs(updated);
    fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faq, adminName })
    }).catch(() => {});
  }

  static updateFaq(faq: FAQItem, adminName = 'Admin'): void {
    const list = this.getFAQs();
    const idx = list.findIndex(f => f.id === faq.id);
    if (idx !== -1) {
      list[idx] = faq;
    } else {
      list.push(faq);
    }
    this.saveFAQs([...list]);
    fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faq, adminName })
    }).catch(() => {});
  }

  static deleteFaq(id: string, adminName = 'Admin'): void {
    const list = this.getFAQs();
    const updated = list.filter(f => f.id !== id);
    this.saveFAQs(updated);
    fetch(`/api/faqs/${encodeURIComponent(id)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  // --- Homepage Sections ---

  static getHomepageSections(): HomepageSectionConfig[] {
    return storeCache.homepageSections.length > 0 ? storeCache.homepageSections : this.getItem<HomepageSectionConfig[]>(KEYS.HOMEPAGE_SECTIONS, DEFAULT_HOMEPAGE_SECTIONS);
  }

  static saveHomepageSections(sections: HomepageSectionConfig[], adminName = 'Admin'): void {
    storeCache.homepageSections = sections;
    this.setItem(KEYS.HOMEPAGE_SECTIONS, sections);
    this.notifyListeners();
    fetch('/api/homepage-sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections, adminName })
    }).catch(() => {});
  }

  // --- Business Settings & Delivery Charges ---

  static getSettings(): BusinessSettings {
    return storeCache.settings || this.getItem<BusinessSettings>(KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
  }

  static saveSettings(settings: BusinessSettings, adminName = 'Admin'): void {
    storeCache.settings = settings;
    this.setItem(KEYS.SETTINGS, settings);
    this.notifyListeners();
    this.logActivity({
      adminName,
      adminRole: 'super_admin',
      action: 'Business Settings Updated',
      category: 'setting',
      details: `Delivery: Dhaka ৳${settings.deliveryFeeInsideDhaka}, Outside ৳${settings.deliveryFeeOutsideDhaka}, Global MOQ: ${settings.globalWholesaleMOQ}`
    });
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings, adminName })
    }).catch(() => {});
  }

  // --- Payment Account Configurations ---

  static getPaymentConfig(): PaymentAccountConfig {
    return storeCache.paymentConfig || this.getItem<PaymentAccountConfig>(KEYS.PAYMENT_CONFIG, PAYMENT_ACCOUNTS_CONFIG);
  }

  static savePaymentConfig(config: PaymentAccountConfig, adminName = 'Admin'): void {
    storeCache.paymentConfig = config;
    this.setItem(KEYS.PAYMENT_CONFIG, config);
    this.notifyListeners();
    this.logActivity({
      adminName,
      adminRole: 'super_admin',
      action: 'Payment Accounts Updated',
      category: 'payment',
      details: `bKash: ${config.bkash.accountNumber} (${config.bkash.accountType}), Nagad: ${config.nagad.accountNumber}`
    });
    fetch('/api/payment-accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentAccounts: config, adminName })
    }).catch(() => {});
  }

  // --- Sizes, Colors & Size Charts ---

  static getColors(): ProductColor[] {
    return storeCache.colors.length > 0 ? storeCache.colors : this.getItem<ProductColor[]>(KEYS.COLORS, DEFAULT_COLORS);
  }

  static saveColors(colors: ProductColor[]): void {
    storeCache.colors = colors;
    this.setItem(KEYS.COLORS, colors);
    this.notifyListeners();
  }

  static addColor(color: ProductColor, adminName = 'Admin'): void {
    const list = this.getColors();
    const updated = [...list, color];
    this.saveColors(updated);
    fetch('/api/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color, adminName })
    }).catch(() => {});
  }

  static deleteColor(idOrName: string, adminName = 'Admin'): void {
    const list = this.getColors();
    const updated = list.filter(c => c.name !== idOrName && (c as any).id !== idOrName);
    this.saveColors(updated);
    fetch(`/api/colors/${encodeURIComponent(idOrName)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  static getSizes(): string[] {
    return storeCache.sizes.length > 0 ? storeCache.sizes : this.getItem<string[]>(KEYS.SIZES, DEFAULT_MASTER_SIZES);
  }

  static saveSizes(sizes: string[]): void {
    storeCache.sizes = sizes;
    this.setItem(KEYS.SIZES, sizes);
    this.notifyListeners();
  }

  static addSize(size: string, adminName = 'Admin'): void {
    const cleanSize = size.trim().toUpperCase();
    const list = this.getSizes();
    if (!list.includes(cleanSize)) {
      const updated = [...list, cleanSize];
      this.saveSizes(updated);
      fetch('/api/sizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: cleanSize, adminName })
      }).catch(() => {});
    }
  }

  static deleteSize(size: string, adminName = 'Admin'): void {
    const list = this.getSizes();
    const updated = list.filter(s => s.toUpperCase() !== size.toUpperCase());
    this.saveSizes(updated);
    fetch(`/api/sizes/${encodeURIComponent(size)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  static getSizeCharts(): CategorySizeChart[] {
    return storeCache.sizeCharts.length > 0 ? storeCache.sizeCharts : this.getItem<CategorySizeChart[]>(KEYS.SIZE_CHARTS, DEFAULT_SIZE_CHARTS);
  }

  static saveSizeCharts(charts: CategorySizeChart[]): void {
    storeCache.sizeCharts = charts;
    this.setItem(KEYS.SIZE_CHARTS, charts);
    this.notifyListeners();
  }

  // --- Policies & CMS Texts ---

  static getPolicies(): PolicyContent {
    return storeCache.policies || this.getItem<PolicyContent>(KEYS.POLICIES, DEFAULT_POLICIES);
  }

  static savePolicies(policies: PolicyContent, adminName = 'Admin'): void {
    storeCache.policies = policies;
    this.setItem(KEYS.POLICIES, policies);
    this.notifyListeners();
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Policies & Legal Content Updated',
      category: 'cms'
    });
    fetch('/api/policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policies, adminName })
    }).catch(() => {});
  }

  // --- Coupons & Discounts ---

  static getCoupons(): Coupon[] {
    return storeCache.coupons.length > 0 ? storeCache.coupons : this.getItem<Coupon[]>(KEYS.COUPONS, DEFAULT_COUPONS);
  }

  static saveCoupons(coupons: Coupon[]): void {
    storeCache.coupons = coupons;
    this.setItem(KEYS.COUPONS, coupons);
    this.notifyListeners();
  }

  static addCoupon(coupon: Coupon, adminName = 'Admin'): void {
    const list = this.getCoupons();
    const updated = [coupon, ...list];
    this.saveCoupons(updated);
    this.logActivity({
      adminName,
      adminRole: 'marketing_manager',
      action: 'Coupon Created',
      category: 'coupon',
      targetName: coupon.code,
      details: `Discount: ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '৳' + coupon.discountValue}, Min: ৳${coupon.minOrderAmount}`
    });
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupon, adminName })
    }).catch(() => {});
  }

  static updateCoupon(coupon: Coupon, adminName = 'Admin'): void {
    const list = this.getCoupons();
    const idx = list.findIndex(c => c.id === coupon.id);
    if (idx !== -1) {
      list[idx] = coupon;
    } else {
      list.push(coupon);
    }
    this.saveCoupons([...list]);
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupon, adminName })
    }).catch(() => {});
  }

  static deleteCoupon(couponId: string, adminName = 'Admin'): void {
    const list = this.getCoupons();
    const cpn = list.find(c => c.id === couponId);
    const updated = list.filter(c => c.id !== couponId);
    this.saveCoupons(updated);
    this.logActivity({
      adminName,
      adminRole: 'marketing_manager',
      action: 'Coupon Deleted',
      category: 'coupon',
      targetName: cpn?.code || couponId
    });
    fetch(`/api/coupons/${encodeURIComponent(couponId)}?adminName=${encodeURIComponent(adminName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  static validateCoupon(code: string, subtotal: number): {
    valid: boolean;
    coupon?: Coupon;
    discountAmount: number;
    message?: string;
  } {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
    }

    const coupons = this.getCoupons();
    const match = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!match) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (match.minOrderAmount && subtotal < match.minOrderAmount) {
      return { 
        valid: false, 
        discountAmount: 0, 
        message: `Minimum order amount of ৳${match.minOrderAmount} required for coupon ${match.code}.` 
      };
    }

    let discount = 0;
    if (match.discountType === 'percentage') {
      discount = Math.round((subtotal * match.discountValue) / 100);
      if (match.maxDiscount && discount > match.maxDiscount) {
        discount = match.maxDiscount;
      }
    } else {
      discount = match.discountValue;
    }

    discount = Math.min(discount, subtotal);

    return {
      valid: true,
      coupon: match,
      discountAmount: discount,
      message: `Coupon ${match.code} applied successfully!`
    };
  }

  // --- Marketing Campaigns & Attribution ---

  static getCampaigns(): MarketingCampaign[] {
    return storeCache.campaigns.length > 0 ? storeCache.campaigns : this.getItem<MarketingCampaign[]>(KEYS.CAMPAIGNS, PRESET_CAMPAIGNS);
  }

  static saveCampaigns(campaigns: MarketingCampaign[]): void {
    storeCache.campaigns = campaigns;
    this.setItem(KEYS.CAMPAIGNS, campaigns);
    this.notifyListeners();
  }

  static addCampaign(camp: MarketingCampaign, adminName = 'Admin'): void {
    const list = this.getCampaigns();
    const updated = [camp, ...list];
    this.saveCampaigns(updated);
    this.logActivity({
      adminName,
      adminRole: 'marketing_manager',
      action: 'Marketing Campaign Logged',
      category: 'cms',
      targetName: camp.campaignName,
      details: `Source: ${camp.source}, Ad Spend: ৳${camp.adSpend}`
    });
    fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign: camp, adminName })
    }).catch(() => {});
  }

  // --- Media Assets Library ---

  static getMedia(): MediaAsset[] {
    const defaultMedia: MediaAsset[] = [
      {
        id: 'med-1',
        name: 'Oxford Cotton Shirt Navy Hero',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
        category: 'product',
        uploadedAt: new Date().toISOString(),
        usedInCount: 3
      },
      {
        id: 'med-2',
        name: 'Men Katua Traditional Jacquard',
        url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80',
        category: 'product',
        uploadedAt: new Date().toISOString(),
        usedInCount: 2
      },
      {
        id: 'med-3',
        name: 'Savar Factory Production Banner',
        url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=2000&q=85',
        category: 'banner',
        uploadedAt: new Date().toISOString(),
        usedInCount: 1
      }
    ];
    return storeCache.media.length > 0 ? storeCache.media : this.getItem<MediaAsset[]>(KEYS.MEDIA, defaultMedia);
  }

  static saveMedia(media: MediaAsset[]): void {
    storeCache.media = media;
    this.setItem(KEYS.MEDIA, media);
    this.notifyListeners();
  }

  static addMedia(asset: MediaAsset, adminName = 'Admin'): void {
    const list = this.getMedia();
    const updated = [asset, ...list];
    this.saveMedia(updated);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Media Asset Uploaded',
      category: 'cms',
      targetName: asset.name
    });
  }

  static deleteMedia(mediaId: string, adminName = 'Admin'): { success: boolean; message: string; isUsed?: boolean } {
    const list = this.getMedia();
    const asset = list.find(m => m.id === mediaId);
    if (!asset) return { success: false, message: 'Media not found.' };

    const products = this.getProducts();
    const isUsedInProducts = products.some(p => (p.images || []).includes(asset.url));
    const slides = this.getHeroSlides();
    const isUsedInSlides = slides.some(s => s.image === asset.url || s.mobileImage === asset.url);

    if (isUsedInProducts || isUsedInSlides) {
      return {
        success: false,
        message: `Image "${asset.name}" is currently in active use across products or hero banners. Please replace it before deleting.`,
        isUsed: true
      };
    }

    const updated = list.filter(m => m.id !== mediaId);
    this.saveMedia(updated);
    this.logActivity({
      adminName,
      adminRole: 'content_manager',
      action: 'Media Deleted',
      category: 'cms',
      targetName: asset.name
    });
    return { success: true, message: `Media "${asset.name}" successfully removed.` };
  }

  // --- Customer Directory Auto-Computation ---

  static buildCustomerDirectory(retailOrders: OrderDetails[], wholesaleInquiries: WholesaleInquiry[]): CustomerProfile[] {
    const customerMap = new Map<string, CustomerProfile>();

    retailOrders.forEach(ord => {
      const normPhone = normalizeBdPhone(ord.phone);
      if (!normPhone) return;

      const existing = customerMap.get(normPhone);
      const isDelivered = ord.orderStatus === 'Delivered';
      const isCancelled = ord.orderStatus === 'Cancelled';
      const isReturned = ord.orderStatus === 'Returned';

      if (existing) {
        existing.totalOrders += 1;
        if (isDelivered) existing.deliveredOrders += 1;
        if (isCancelled) existing.cancelledOrders += 1;
        if (isReturned) existing.returnedOrders += 1;
        existing.totalSpent += ord.total;
        existing.orderIds.push(ord.orderId);
        if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = ord.createdAt;
          existing.fullAddress = ord.fullAddress;
          existing.area = ord.area;
          existing.district = ord.district;
        }
      } else {
        customerMap.set(normPhone, {
          phone: ord.phone,
          normalizedPhone: normPhone,
          name: ord.customerName,
          whatsappNumber: ord.whatsappNumber || ord.phone,
          district: ord.district,
          area: ord.area,
          fullAddress: ord.fullAddress,
          totalOrders: 1,
          deliveredOrders: isDelivered ? 1 : 0,
          cancelledOrders: isCancelled ? 1 : 0,
          returnedOrders: isReturned ? 1 : 0,
          totalSpent: ord.total,
          lastOrderDate: ord.createdAt,
          isWholesaleCustomer: false,
          orderIds: [ord.orderId]
        });
      }
    });

    wholesaleInquiries.forEach(ws => {
      const normPhone = normalizeBdPhone(ws.phone);
      if (!normPhone) return;

      const existing = customerMap.get(normPhone);
      const totalAmount = ws.totalEstimatedAmount || 0;

      if (existing) {
        existing.totalOrders += 1;
        existing.isWholesaleCustomer = true;
        existing.businessName = ws.businessName || existing.businessName;
        existing.totalSpent += totalAmount;
        existing.orderIds.push(ws.id);
      } else {
        customerMap.set(normPhone, {
          phone: ws.phone,
          normalizedPhone: normPhone,
          name: ws.customerName,
          whatsappNumber: ws.whatsappNumber || ws.phone,
          district: ws.district,
          area: ws.area || '',
          fullAddress: ws.fullAddress || '',
          totalOrders: 1,
          deliveredOrders: ws.orderStatus === 'Delivered' ? 1 : 0,
          cancelledOrders: ws.orderStatus === 'Cancelled' ? 1 : 0,
          returnedOrders: ws.orderStatus === 'Returned' ? 1 : 0,
          totalSpent: totalAmount,
          lastOrderDate: ws.createdAt,
          isWholesaleCustomer: true,
          businessName: ws.businessName,
          orderIds: [ws.id]
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }

  // --- Suspicious Orders Analysis ---

  static analyzeSuspiciousOrders(retailOrders: OrderDetails[], wholesaleInquiries: WholesaleInquiry[]): SuspiciousOrderFlag[] {
    const flags: SuspiciousOrderFlag[] = [];
    const phoneOrderTimes = new Map<string, number[]>();
    const seenTrxIds = new Map<string, string[]>();

    [...retailOrders, ...wholesaleInquiries].forEach(o => {
      if (o.transactionId && o.transactionId.trim()) {
        const trx = o.transactionId.trim().toUpperCase();
        const existing = seenTrxIds.get(trx) || [];
        existing.push('orderId' in o ? (o as OrderDetails).orderId : (o as WholesaleInquiry).id);
        seenTrxIds.set(trx, existing);
      }
    });

    seenTrxIds.forEach((orderIds, trx) => {
      if (orderIds.length > 1) {
        orderIds.forEach(id => {
          const ord = retailOrders.find(r => r.orderId === id);
          if (ord) {
            flags.push({
              orderId: ord.orderId,
              phone: ord.phone,
              customerName: ord.customerName,
              reasons: [`Duplicate Transaction ID (${trx}) used in ${orderIds.length} orders: ${orderIds.join(', ')}`],
              severity: 'high',
              createdAt: ord.createdAt,
              isReviewed: false
            });
          }
        });
      }
    });

    retailOrders.forEach(ord => {
      const normPhone = normalizeBdPhone(ord.phone);
      const times = phoneOrderTimes.get(normPhone) || [];
      const ordTime = new Date(ord.createdAt).getTime();
      times.push(ordTime);
      phoneOrderTimes.set(normPhone, times);

      const recentIn5Min = times.filter(t => Math.abs(t - ordTime) < 5 * 60 * 1000);
      const reasons: string[] = [];
      let severity: 'low' | 'medium' | 'high' = 'low';

      if (recentIn5Min.length >= 4) {
        reasons.push(`Rapid order velocity (${recentIn5Min.length} orders placed within 5 minutes)`);
        severity = 'medium';
      }

      const totalItemsQty = (ord.items || []).reduce((s, it) => s + (it.quantity || 1), 0);
      if (totalItemsQty >= 25 && ord.orderType !== 'wholesale') {
        reasons.push(`Abnormally high retail order quantity (${totalItemsQty} units) - Possible bulk inquiry`);
        severity = 'medium';
      }

      if (ord.isVerificationRequired) {
        reasons.push('Automated security rule flagged manual factory verification required');
        severity = 'high';
      }

      if (reasons.length > 0 && !flags.some(f => f.orderId === ord.orderId)) {
        flags.push({
          orderId: ord.orderId,
          phone: ord.phone,
          customerName: ord.customerName,
          reasons,
          severity,
          createdAt: ord.createdAt,
          isReviewed: false
        });
      }
    });

    return flags;
  }

  // --- Real Analytics Calculation ---

  static calculateAnalytics(orders: OrderDetails[], wholesale: WholesaleInquiry[], products: Product[]) {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonthStr = now.toISOString().slice(0, 7);

    let totalSales = 0;
    let todaySales = 0;
    let monthlySales = 0;
    let retailSales = 0;
    let wholesaleSales = 0;
    let estimatedCost = 0;

    let pendingCount = 0;
    let processingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let returnedCount = 0;
    let exchangedCount = 0;
    let verificationPendingCount = 0;
    let todayOrdersCount = 0;

    // Delivery zone breakdown
    let insideDhakaCount = 0;
    let insideDhakaRevenue = 0;
    let outsideDhakaCount = 0;
    let outsideDhakaRevenue = 0;

    // Payment breakdown
    let codCount = 0;
    let codRevenue = 0;
    let bkashCount = 0;
    let bkashRevenue = 0;
    let nagadCount = 0;
    let nagadRevenue = 0;

    let totalUnitsSold = 0;

    const productSalesMap = new Map<string, { name: string; code: string; units: number; revenue: number; image?: string }>();
    const categorySalesMap = new Map<string, { name: string; units: number; revenue: number }>();
    const dailyMap = new Map<string, { date: string; label: string; retail: number; wholesale: number; total: number; count: number }>();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap.set(key, { date: key, label, retail: 0, wholesale: 0, total: 0, count: 0 });
    }

    orders.forEach(ord => {
      const ordDateStr = (ord.createdAt || '').slice(0, 10);
      const isToday = ordDateStr === todayStr;
      const isThisMonth = (ord.createdAt || '').slice(0, 7) === thisMonthStr;

      if (isToday) todayOrdersCount += 1;

      if (ord.orderStatus === 'Pending') pendingCount++;
      else if (ord.orderStatus === 'Processing') processingCount++;
      else if (ord.orderStatus === 'Shipped') shippedCount++;
      else if (ord.orderStatus === 'Delivered') deliveredCount++;
      else if (ord.orderStatus === 'Cancelled') cancelledCount++;
      else if (ord.orderStatus === 'Returned') returnedCount++;
      else if (ord.orderStatus === 'Exchanged') exchangedCount++;

      if (ord.paymentStatus === 'Verification Pending') {
        verificationPendingCount++;
      }

      if (ord.orderStatus !== 'Cancelled') {
        totalSales += ord.total;
        retailSales += ord.total;

        if (isToday) todaySales += ord.total;
        if (isThisMonth) monthlySales += ord.total;

        // Delivery breakdown
        if (ord.deliveryZone === 'inside_dhaka' || (ord.district && ord.district.toLowerCase() === 'dhaka')) {
          insideDhakaCount++;
          insideDhakaRevenue += ord.total;
        } else {
          outsideDhakaCount++;
          outsideDhakaRevenue += ord.total;
        }

        // Payment breakdown
        const method = (ord.paymentMethod || 'cod').toLowerCase();
        if (method.includes('bkash')) {
          bkashCount++;
          bkashRevenue += ord.total;
        } else if (method.includes('nagad')) {
          nagadCount++;
          nagadRevenue += ord.total;
        } else {
          codCount++;
          codRevenue += ord.total;
        }

        const dayEntry = dailyMap.get(ordDateStr);
        if (dayEntry) {
          dayEntry.retail += ord.total;
          dayEntry.total += ord.total;
          dayEntry.count += 1;
        }

        (ord.items || []).forEach(it => {
          const qty = it.quantity || 1;
          totalUnitsSold += qty;
          const costPrice = 380;
          estimatedCost += costPrice * qty;

          const prodId = it.product?.id || (it as any).productId || 'unknown';
          const existing = productSalesMap.get(prodId) || {
            name: it.product?.name || 'Product',
            code: it.product?.code || 'SKU',
            units: 0,
            revenue: 0,
            image: it.product?.images?.[0]
          };
          existing.units += qty;
          existing.revenue += (it.product?.retailPrice || 0) * qty;
          productSalesMap.set(prodId, existing);

          const catKey = it.product?.category || 'mens-shirts';
          const catExist = categorySalesMap.get(catKey) || {
            name: it.product?.categoryName || catKey,
            units: 0,
            revenue: 0
          };
          catExist.units += qty;
          catExist.revenue += (it.product?.retailPrice || 0) * qty;
          categorySalesMap.set(catKey, catExist);
        });
      }
    });

    wholesale.forEach(ws => {
      const wsDateStr = (ws.createdAt || '').slice(0, 10);
      const isToday = wsDateStr === todayStr;
      const isThisMonth = (ws.createdAt || '').slice(0, 7) === thisMonthStr;
      const amount = ws.totalEstimatedAmount || (ws.appliedTierPrice ? ws.appliedTierPrice * ws.targetQuantity : 0);

      if (isToday) todayOrdersCount += 1;

      if (ws.orderStatus === 'Pending') pendingCount++;
      else if (ws.orderStatus === 'Processing') processingCount++;
      else if (ws.orderStatus === 'Shipped') shippedCount++;
      else if (ws.orderStatus === 'Delivered') deliveredCount++;
      else if (ws.orderStatus === 'Cancelled') cancelledCount++;

      if (ws.paymentStatus === 'Verification Pending') {
        verificationPendingCount++;
      }

      if (ws.orderStatus !== 'Cancelled' && amount > 0) {
        totalSales += amount;
        wholesaleSales += amount;
        totalUnitsSold += (ws.targetQuantity || 0);

        if (isToday) todaySales += amount;
        if (isThisMonth) monthlySales += amount;

        const dayEntry = dailyMap.get(wsDateStr);
        if (dayEntry) {
          dayEntry.wholesale += amount;
          dayEntry.total += amount;
          dayEntry.count += 1;
        }

        estimatedCost += (ws.targetQuantity * 340);
      }
    });

    // Real Inventory calculations
    let totalStockPieces = 0;
    let totalStockCostValue = 0;
    let totalPotentialRetailValue = 0;
    let totalPotentialWholesaleValue = 0;

    products.forEach(p => {
      const stk = Number(p.stock) || 0;
      totalStockPieces += stk;
      totalStockCostValue += stk * 380;
      totalPotentialRetailValue += stk * (Number(p.retailPrice) || 0);
      totalPotentialWholesaleValue += stk * (Number(p.wholesalePrice) || 0);
    });

    const lowStockThreshold = storeCache.settings?.lowStockThreshold || 10;
    const lowStockProducts = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= lowStockThreshold);
    const outOfStockProducts = products.filter(p => (Number(p.stock) || 0) <= 0);

    const estimatedProfit = Math.max(0, totalSales - estimatedCost);
    const bestSellers = Array.from(productSalesMap.values()).sort((a, b) => b.units - a.units).slice(0, 6);
    const categoryBreakdown = Array.from(categorySalesMap.values()).sort((a, b) => b.revenue - a.revenue);
    const dailyChart = Array.from(dailyMap.values());

    const completedOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    const averageOrderValue = completedOrders.length > 0 ? Math.round(totalSales / (completedOrders.length + wholesale.length)) : 0;

    return {
      totalOrders: orders.length + wholesale.length,
      todayOrders: todayOrdersCount,
      pendingOrders: pendingCount,
      processingOrders: processingCount,
      shippedOrders: shippedCount,
      deliveredOrders: deliveredCount,
      cancelledOrders: cancelledCount,
      returnedOrders: returnedCount,
      exchangedOrders: exchangedCount,
      totalSales,
      todaySales,
      monthlySales,
      retailSales,
      wholesaleSales,
      totalUnitsSold,
      averageOrderValue,
      totalStockPieces,
      totalStockCostValue,
      totalPotentialRetailValue,
      totalPotentialWholesaleValue,
      estimatedRevenue: totalSales,
      estimatedProfit,
      pendingPaymentVerification: verificationPendingCount,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
      bestSellers,
      categoryBreakdown,
      dailyChart,
      insideDhakaCount,
      insideDhakaRevenue,
      outsideDhakaCount,
      outsideDhakaRevenue,
      codCount,
      codRevenue,
      bkashCount,
      bkashRevenue,
      nagadCount,
      nagadRevenue
    };
  }

  // --- Full Database Backup & Recovery ---

  static generateFullBackupJson(): string {
    const backup = {
      backupTimestamp: new Date().toISOString(),
      app: 'Sider Fashion Master Store',
      version: '3.0',
      data: {
        products: this.getProducts(),
        categories: this.getCategories(),
        heroSlides: this.getHeroSlides(),
        faqs: this.getFAQs(),
        settings: this.getSettings(),
        paymentConfig: this.getPaymentConfig(),
        coupons: this.getCoupons(),
        campaigns: this.getCampaigns(),
        media: this.getMedia(),
        policies: this.getPolicies(),
        colors: this.getColors(),
        sizes: this.getSizes(),
        sizeCharts: this.getSizeCharts(),
        contacts: this.getContacts(),
        socialLinks: this.getSocialLinks(),
        homepageSections: this.getHomepageSections(),
        auditLogs: this.getAuditLogs()
      }
    };
    return JSON.stringify(backup, null, 2);
  }

  static restoreFromBackupJson(jsonString: string, adminName = 'Super Admin'): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) {
        return { success: false, message: 'Invalid backup file format.' };
      }
      const { data } = parsed;
      if (data.products) this.saveProducts(data.products);
      if (data.categories) this.saveCategories(data.categories);
      if (data.heroSlides) this.saveHeroSlides(data.heroSlides);
      if (data.faqs) this.saveFAQs(data.faqs);
      if (data.settings) this.saveSettings(data.settings, adminName);
      if (data.paymentConfig) this.savePaymentConfig(data.paymentConfig, adminName);
      if (data.coupons) this.saveCoupons(data.coupons);
      if (data.campaigns) this.saveCampaigns(data.campaigns);
      if (data.policies) this.savePolicies(data.policies, adminName);
      if (data.colors) this.saveColors(data.colors);
      if (data.sizes) this.saveSizes(data.sizes);
      if (data.sizeCharts) this.saveSizeCharts(data.sizeCharts);
      if (data.contacts) this.saveContacts(data.contacts, adminName);
      if (data.socialLinks) this.saveSocialLinks(data.socialLinks, adminName);
      if (data.homepageSections) this.saveHomepageSections(data.homepageSections, adminName);

      this.logActivity({
        adminName,
        adminRole: 'super_admin',
        action: 'System Database Restored from Backup',
        category: 'setting',
        details: `Restored snapshot from ${parsed.backupTimestamp || 'uploaded file'}`
      });

      return { success: true, message: 'System database successfully restored!' };
    } catch (e: any) {
      return { success: false, message: `Failed to restore backup: ${e.message}` };
    }
  }

  static createFullBackup(): string {
    return this.generateFullBackupJson();
  }

  static restoreFullBackup(jsonString: string, adminName = 'Super Admin'): { success: boolean; message: string } {
    return this.restoreFromBackupJson(jsonString, adminName);
  }

  static resetToDefaults(adminName = 'Super Admin'): { success: boolean; message: string } {
    try {
      this.saveProducts(INITIAL_PRODUCTS);
      this.saveCategories(CATEGORIES);
      this.saveHeroSlides(HERO_SLIDES);
      this.saveFAQs(SIDER_FAQS);
      this.saveSettings(DEFAULT_BUSINESS_SETTINGS, adminName);
      this.savePaymentConfig(PAYMENT_ACCOUNTS_CONFIG, adminName);
      this.saveCoupons(DEFAULT_COUPONS);
      this.saveCampaigns(PRESET_CAMPAIGNS);
      this.savePolicies(DEFAULT_POLICIES, adminName);
      this.saveColors(DEFAULT_COLORS);
      this.saveSizes(DEFAULT_MASTER_SIZES);
      this.saveSizeCharts(DEFAULT_SIZE_CHARTS);
      this.saveContacts(DEFAULT_CONTACTS, adminName);
      this.saveSocialLinks(DEFAULT_SOCIAL_LINKS, adminName);
      this.saveHomepageSections(DEFAULT_HOMEPAGE_SECTIONS, adminName);

      this.logActivity({
        adminName,
        adminRole: 'super_admin',
        action: 'System Reset to Factory Default Data',
        category: 'setting',
        details: 'Reinitialized all store products, categories, CMS and settings'
      });

      return { success: true, message: 'All store data reset to default successfully.' };
    } catch (e: any) {
      return { success: false, message: `Reset failed: ${e.message}` };
    }
  }

  // --- CSV Exporters ---

  static exportOrdersToCSV(orders: OrderDetails[], wholesale: WholesaleInquiry[]): string {
    const headers = [
      'Order ID',
      'Type',
      'Date & Time',
      'Customer Name',
      'Phone',
      'WhatsApp',
      'District',
      'Thana / Area',
      'Full Address',
      'Products Summary',
      'Quantity',
      'Subtotal (BDT)',
      'Delivery Fee (BDT)',
      'Discount (BDT)',
      'Total (BDT)',
      'Payment Method',
      'Payment Status',
      'Transaction ID',
      'Sender Last 4',
      'Order Status',
      'Customer Note'
    ];

    const rows: string[][] = [];

    orders.forEach(o => {
      const prods = (o.items || []).map(it => `${it.product?.code || ''} (${it.selectedSize || ''}/${it.selectedColor?.name || ''} x${it.quantity || 1})`).join('; ');
      const totalQty = (o.items || []).reduce((s, it) => s + (it.quantity || 1), 0);
      rows.push([
        o.orderId || '',
        'Retail',
        o.createdAt || '',
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `'${o.phone || ''}`,
        `'${o.whatsappNumber || o.phone || ''}`,
        `"${o.district || ''}"`,
        `"${o.area || ''}"`,
        `"${(o.fullAddress || '').replace(/"/g, '""')}"`,
        `"${prods.replace(/"/g, '""')}"`,
        totalQty.toString(),
        (o.subtotal || 0).toString(),
        (o.deliveryFee || 0).toString(),
        (o.discount || 0).toString(),
        (o.total || 0).toString(),
        (o.paymentMethod || 'COD').toUpperCase(),
        o.paymentStatus || 'Pending',
        o.transactionId || 'N/A',
        o.senderLast4 || 'N/A',
        o.orderStatus || 'Pending',
        `"${(o.customerNote || '').replace(/"/g, '""')}"`
      ]);
    });

    wholesale.forEach(w => {
      rows.push([
        w.id || '',
        'Wholesale',
        w.createdAt || '',
        `"${(w.customerName || '').replace(/"/g, '""')} (${(w.businessName || '').replace(/"/g, '""')})"`,
        `'${w.phone || ''}`,
        `'${w.whatsappNumber || w.phone || ''}`,
        `"${w.district || ''}"`,
        `"${w.area || ''}"`,
        `"${(w.fullAddress || '').replace(/"/g, '""')}"`,
        `"${w.productCode || ''} - ${w.productName || ''} (${w.targetColor || ''})"`,
        (w.targetQuantity || 0).toString(),
        (w.totalEstimatedAmount || 0).toString(),
        '0',
        '0',
        (w.totalEstimatedAmount || 0).toString(),
        (w.paymentMethod || 'COD').toUpperCase(),
        w.paymentStatus || 'Pending',
        w.transactionId || 'N/A',
        w.senderLast4 || 'N/A',
        w.orderStatus || 'Pending',
        `"${(w.additionalMessage || '').replace(/"/g, '""')}"`
      ]);
    });

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  static exportProductsToCSV(products: Product[]): string {
    const headers = [
      'SKU / Code',
      'Name',
      'Name (Bangla)',
      'Category',
      'Retail Price (BDT)',
      'Wholesale Price (BDT)',
      'Wholesale MOQ',
      'Stock',
      'Featured',
      'New Arrival',
      'Fabric',
      'Sizes Available',
      'Colors Available'
    ];

    const rows = products.map(p => [
      p.code || '',
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.nameBn || '').replace(/"/g, '""')}"`,
      p.category || '',
      (p.retailPrice || 0).toString(),
      (p.wholesalePrice || 0).toString(),
      (p.wholesaleMOQ || 12).toString(),
      (p.stock || 0).toString(),
      p.isFeatured ? 'YES' : 'NO',
      p.isNewArrival ? 'YES' : 'NO',
      `"${(p.fabric || '').replace(/"/g, '""')}"`,
      `"${(p.sizes || []).map(s => s.size).join('/')}"`,
      `"${(p.colors || []).map(c => c.name).join('/')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
