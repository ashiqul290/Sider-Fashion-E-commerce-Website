import { Product, CategoryInfo, RetailCategoryKey, WholesalePricingTier } from '../types';

export const OFFICIAL_FACEBOOK_URL = 'https://www.facebook.com/share/1G2hyYvWFR/';

export const BRAND_CONTACTS = {
  name: 'Sider Fashion',
  tagline: 'Quality Fashion, Directly from Our Own Manufacturing',
  taglineBn: 'নিজস্ব কারখানায় তৈরি — পাইকারি ও খুচরা বিক্রি',
  locationDisplay: 'Ashulia, Savar, Dhaka, Bangladesh',
  locationArea: 'Ashulia, Savar, Dhaka (Near Savar Cantonment & EPZ Garment Hub)',
  phones: ['01712773063', '01612241112'],
  whatsappNumbers: ['01712773063', '01612241112'],
  primaryPhone: '01712773063',
  secondaryPhone: '01612241112',
  wholesalePhone: '01612241112',
  email: 'siderfashion.bd@gmail.com',
  facebookUrl: 'https://www.facebook.com/share/1G2hyYvWFR/',
  workingHours: '9:00 AM – 10:00 PM (Everyday)',
  factoryAddress: 'Ashulia Industrial Zone, Savar, Dhaka, Bangladesh',
};

// Retail Category Tabs displayed above product grid
export const RETAIL_CATEGORY_TABS: { key: RetailCategoryKey; label: string; labelBn: string; badge?: string }[] = [
  { key: 'all', label: 'ALL', labelBn: 'সকল পোশাক' },
  { key: 'shirt', label: 'SHIRT', labelBn: 'শার্ট' },
  { key: 'katua', label: 'KATUA', labelBn: 'কতুয়া' },
  { key: 'mens', label: "MEN'S", labelBn: 'মেনস কালেকশন' },
  { key: 'new-arrival', label: 'NEW ARRIVAL', labelBn: 'নতুন কালেকশন', badge: 'Hot' },
];

// Full Category Architecture & Registry (supports future expansion seamlessly)
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'mens-shirts',
    key: 'shirt',
    name: "Men's Shirts",
    nameBn: 'পুরুষদের শার্ট',
    description: '100% Premium Cotton, Oxford & Linen Casual & Formal Shirts made in our factory.',
    descriptionBn: 'প্রিমিয়াম ১০০% কটন, অক্সফোর্ড ও লিনেন ফরমাল ও ক্যাজুয়াল শার্ট।',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 4
  },
  {
    id: 'mens-katua',
    key: 'katua',
    name: "Men's Katua",
    nameBn: 'পুরুষদের কতুয়া',
    description: 'Traditional & modern tailored Katua in Jacquard, Linen and Combed Cotton.',
    descriptionBn: 'আরামদায়ক জ্যাকার্ড ও কটন ফেব্রিকের আভিজাত্যপূর্ণ পুরুষদের কতুয়া।',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 4
  },
  {
    id: 'mens-all',
    key: 'mens',
    name: "Men's Collection",
    nameBn: 'পুরুষদের কালেকশন',
    description: 'Complete range of shirts and katua manufactured at our Ashulia unit.',
    descriptionBn: 'শার্ট ও কতুয়ার সম্পূর্ণ মেনস কালেকশন।',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 8
  },
  {
    id: 'new-arrivals',
    key: 'new-arrival',
    name: 'New Arrivals',
    nameBn: 'নতুন আগমন',
    description: 'Fresh seasonal drops and limited edition designs straight from the loom.',
    descriptionBn: 'এই সিজনের একদম নতুন ও আকর্ষণীয় সব ফ্যাশন ডিজাইন।',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 5
  },
  // Future expansion categories (Ready in architecture)
  {
    id: 'womens-fashion',
    key: 'womens',
    name: "Women's Fashion",
    nameBn: 'উইমেনস ফ্যাশন',
    description: 'Upcoming designer Kurti, 3-Piece & ethnic wear crafted in our Savar unit.',
    descriptionBn: 'আসন্ন এক্সক্লুসিভ কুর্তি ও থ্রি-পিস কালেকশন।',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    isActive: false,
    isUpcoming: true,
    itemCount: 0
  },
  {
    id: 'womens-dresses',
    key: 'womens-dresses',
    name: "Women's Dresses",
    nameBn: 'উইমেনস ড্রেসেস',
    description: 'Chic one-piece, maxis and casual dresses launching soon.',
    descriptionBn: 'আসন্ন ফ্যাশনেবল ওয়ান-পিস ও ক্যাজুয়াল ড্রেস।',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    isActive: false,
    isUpcoming: true,
    itemCount: 0
  },
  {
    id: 'kids',
    key: 'kids',
    name: "Kids Collection",
    nameBn: 'কিডস কালেকশন',
    description: 'Comfortable & soft organic cotton outfits for children.',
    descriptionBn: 'শিশুদের আরামদায়ক কটন পোশাক।',
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80',
    isActive: false,
    isUpcoming: true,
    itemCount: 0
  },
  {
    id: 'festive-collection',
    key: 'festive-collection',
    name: "Festive & Eid Collection",
    nameBn: 'ঈদ ও উৎসবের কালেকশন',
    description: 'Special edition artisanal designs for major festivals.',
    descriptionBn: 'ঈদ ও উৎসব উপলক্ষে বিশেষ ডিজাইনের কালেকশন।',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    isActive: false,
    isUpcoming: true,
    itemCount: 0
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Men's Shirts
  {
    id: 'sf-sh-101',
    code: 'SF-SH-101',
    name: 'Royal Oxford Formal Cotton Shirt',
    nameBn: 'রয়্যাল অক্সফোর্ড ফরমাল কটন শার্ট',
    category: 'mens-shirts',
    categoryName: "Men's Shirts",
    categoryNameBn: 'পুরুষদের শার্ট',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from 100% long-staple combed Oxford cotton. Designed with a reinforced spread collar, high-density stitching, and pearlized buttons for an impeccable corporate or smart-casual look.',
    descriptionBn: '১০০% কম্বড অক্সফোর্ড কটন ফেব্রিক দিয়ে আমাদের নিজস্ব কারখানায় তৈরি। সফট ফিনিশিং, আরামদায়ক ও নিখুঁত সেলাই। অফিস বা ক্যাজুয়াল যেকোনো পরিবেশের জন্য দারুণ মানানসই।',
    fabric: '100% Combed Oxford Cotton (180 GSM)',
    fabricBn: '১০০% কম্বড অক্সফোর্ড কটন (১৮০ জিএসএম)',
    colors: [
      { name: 'Sky Blue', nameBn: 'আকাশি নীল', hex: '#87ceeb' },
      { name: 'Pure White', nameBn: 'সাদা', hex: '#f8fafc' },
      { name: 'Classic Navy', nameBn: 'নেভি ব্লু', hex: '#1e293b' },
      { name: 'Charcoal Black', nameBn: 'কালো', hex: '#18181b' }
    ],
    sizes: [
      { size: 'S', chestInches: 36, lengthInches: 27, shoulderInches: 16.5, sleeveInches: 23.5, collarInches: 14.5, stock: 20 },
      { size: 'M', chestInches: 38, lengthInches: 28, shoulderInches: 17.5, sleeveInches: 24, collarInches: 15, stock: 45 },
      { size: 'L', chestInches: 40, lengthInches: 29, shoulderInches: 18.5, sleeveInches: 24.5, collarInches: 15.5, stock: 60 },
      { size: 'XL', chestInches: 42, lengthInches: 30, shoulderInches: 19.5, sleeveInches: 25, collarInches: 16, stock: 35 },
      { size: 'XXL', chestInches: 44, lengthInches: 31, shoulderInches: 20.5, sleeveInches: 25.5, collarInches: 16.5, stock: 15 }
    ],
    retailPrice: 850,
    originalRetailPrice: 1050,
    wholesalePrice: 480,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 480, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 450, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 420, label: '100+ pcs' }
    ],
    stock: 175,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewsCount: 48,
    tags: ['Formal', 'Cotton', 'Oxford', 'Best Seller']
  },
  {
    id: 'sf-sh-102',
    code: 'SF-SH-102',
    name: 'Casual Washed Denim Cotton Shirt',
    nameBn: 'ক্যাজুয়াল ওয়াশড ডেনিম কটন শার্ট',
    category: 'mens-shirts',
    categoryName: "Men's Shirts",
    categoryNameBn: 'পুরুষদের শার্ট',
    images: [
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Enzyme-washed soft indigo denim cotton with double-chest flap pockets and contrast heavy stitching. Timeless rugged appeal tailored for youth fashion.',
    descriptionBn: 'এনজাইম ওয়াশড প্রিমিয়াম কটন ডেনিম শার্ট। ডাবল পকেট, কন্ট্রাস্ট সেলাই এবং ১০০% আরামদায়ক ফিনিশিং।',
    fabric: 'Soft Washed Denim Cotton (6.5 oz)',
    fabricBn: 'সফট ওয়াশড ডেনিম কটন',
    colors: [
      { name: 'Light Indigo', nameBn: 'হালকা নীল', hex: '#5b84b1' },
      { name: 'Deep Indigo', nameBn: 'গাঢ় নীল', hex: '#203a43' },
      { name: 'Vintage Black', nameBn: 'ভিন্টেজ কালো', hex: '#2c3539' }
    ],
    sizes: [
      { size: 'S', chestInches: 36, lengthInches: 27, shoulderInches: 16.5, sleeveInches: 23.5, stock: 15 },
      { size: 'M', chestInches: 38, lengthInches: 28, shoulderInches: 17.5, sleeveInches: 24, stock: 35 },
      { size: 'L', chestInches: 40, lengthInches: 29, shoulderInches: 18.5, sleeveInches: 24.5, stock: 45 },
      { size: 'XL', chestInches: 42, lengthInches: 30, shoulderInches: 19.5, sleeveInches: 25, stock: 30 },
      { size: 'XXL', chestInches: 44, lengthInches: 31, shoulderInches: 20.5, sleeveInches: 25.5, stock: 15 }
    ],
    retailPrice: 920,
    originalRetailPrice: 1150,
    wholesalePrice: 520,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 520, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 490, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 460, label: '100+ pcs' }
    ],
    stock: 140,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.85,
    reviewsCount: 34,
    tags: ['Denim', 'Casual', 'Youth']
  },
  {
    id: 'sf-sh-103',
    code: 'SF-SH-103',
    name: 'Smart Casual Micro Check Shirt',
    nameBn: 'স্মার্ট ক্যাজুয়াল মাইক্রো চেক শার্ট',
    category: 'mens-shirts',
    categoryName: "Men's Shirts",
    categoryNameBn: 'পুরুষদের শার্ট',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Modern woven yarn-dyed micro check pattern. Washed for extra softness with double-needle tailoring for durable daily wear.',
    descriptionBn: 'আকর্ষণীয় মাইক্রো চেক ডিজাইনের কটন শার্ট। ১০০% কালার গ্যারান্টি ও প্রি-শ্রাংক ফ্যাব্রিক।',
    fabric: '100% Pure Twill Cotton',
    fabricBn: '১০০% পিওর টুইল কটন',
    colors: [
      { name: 'Maroon & Navy Grid', nameBn: 'মেরুন ও নেভি', hex: '#800020' },
      { name: 'Forest Green Plaid', nameBn: 'ফরেস্ট গ্রিন', hex: '#2d5a27' },
      { name: 'Slate Grey Box', nameBn: 'গ্রে চেক', hex: '#708090' }
    ],
    sizes: [
      { size: 'S', chestInches: 36, lengthInches: 27, shoulderInches: 16.5, sleeveInches: 23.5, stock: 15 },
      { size: 'M', chestInches: 38, lengthInches: 28, shoulderInches: 17.5, sleeveInches: 24, stock: 35 },
      { size: 'L', chestInches: 40, lengthInches: 29, shoulderInches: 18.5, sleeveInches: 24.5, stock: 45 },
      { size: 'XL', chestInches: 42, lengthInches: 30, shoulderInches: 19.5, sleeveInches: 25, stock: 30 },
      { size: 'XXL', chestInches: 44, lengthInches: 31, shoulderInches: 20.5, sleeveInches: 25.5, stock: 12 }
    ],
    retailPrice: 890,
    originalRetailPrice: 1100,
    wholesalePrice: 490,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 490, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 460, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 430, label: '100+ pcs' }
    ],
    stock: 137,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 19,
    tags: ['Check', 'Smart Casual', 'Everyday']
  },
  {
    id: 'sf-sh-104',
    code: 'SF-SH-104',
    name: 'Summer Breeze Linen-Cotton Shirt',
    nameBn: 'সামার ব্রিজ লিনেন-কটন ক্যাজুয়াল শার্ট',
    category: 'mens-shirts',
    categoryName: "Men's Shirts",
    categoryNameBn: 'পুরুষদের শার্ট',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed specifically for Bangladesh warm climate. Blend of 60% linen and 40% organic cotton for superior sweat-wicking and breezy breathability.',
    descriptionBn: 'বাংলাদেশের আবহাওয়ার উপযোগী ৬০% লিনেন ও ৪০% অর্গানিক কটন শার্ট। গরমে পরার জন্য অত্যন্ত উপযোগী।',
    fabric: 'Linen-Cotton Blend (160 GSM)',
    fabricBn: 'লিনেন-কটন ব্লেন্ড (১৬০ জিএসএম)',
    colors: [
      { name: 'Olive Green', nameBn: 'অলিভ গ্রিন', hex: '#556b2f' },
      { name: 'Sand Beige', nameBn: 'স্যান্ড বেইজ', hex: '#d2b48c' },
      { name: 'Pastel Peach', nameBn: 'পিচ', hex: '#ffdab9' }
    ],
    sizes: [
      { size: 'S', chestInches: 36, lengthInches: 27, shoulderInches: 16.5, sleeveInches: 23.5, stock: 10 },
      { size: 'M', chestInches: 38, lengthInches: 28, shoulderInches: 17.5, sleeveInches: 24, stock: 25 },
      { size: 'L', chestInches: 40, lengthInches: 29, shoulderInches: 18.5, sleeveInches: 24.5, stock: 35 },
      { size: 'XL', chestInches: 42, lengthInches: 30, shoulderInches: 19.5, sleeveInches: 25, stock: 20 },
      { size: 'XXL', chestInches: 44, lengthInches: 31, shoulderInches: 20.5, sleeveInches: 25.5, stock: 10 }
    ],
    retailPrice: 950,
    originalRetailPrice: 1200,
    wholesalePrice: 550,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 550, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 510, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 480, label: '100+ pcs' }
    ],
    stock: 100,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 42,
    tags: ['Linen', 'Summer', 'Breathable']
  },

  // 2. Men's Katua
  {
    id: 'sf-kt-201',
    code: 'SF-KT-201',
    name: 'Premium Jacquard Weave Men’s Katua',
    nameBn: 'প্রিমিয়াম জ্যাকার্ড উইভ পুরুষদের কতুয়া',
    category: 'mens-katua',
    categoryName: "Men's Katua",
    categoryNameBn: 'পুরুষদের কতুয়া',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Artisanal Jacquard patterned Katua with band collar (Mandarin neckline) and handcrafted wooden buttons. Perfect for Jummah prayers, cultural festivals and formal events.',
    descriptionBn: 'নিজস্ব ফ্যাক্টরিতে বোনা জ্যাকার্ড কতুয়া। চাইনিজ কলার, হ্যান্ডক্রাফটেড বোতাম ও আভিজাত্যপূর্ণ লুক। জুম্মার নামাজ, ঈদ ও ঘরোয়া যেকোনো অনুষ্ঠানে পরা যায়।',
    fabric: 'Jacquard Textured Pure Cotton (200 GSM)',
    fabricBn: 'জ্যাকার্ড টেক্সচার্ড পিওর কটন (২০০ জিএসএম)',
    colors: [
      { name: 'Royal Off-White', nameBn: 'অফ হোয়াইট', hex: '#fdfbf7' },
      { name: 'Emerald Forest', nameBn: 'পান্না সবুজ', hex: '#0f52ba' },
      { name: 'Maroon Ruby', nameBn: 'রুবী মেরুন', hex: '#800000' },
      { name: 'Coal Black', nameBn: 'কালো', hex: '#111827' }
    ],
    sizes: [
      { size: 'S', chestInches: 38, lengthInches: 36, shoulderInches: 17, sleeveInches: 23, stock: 20 },
      { size: 'M', chestInches: 40, lengthInches: 38, shoulderInches: 18, sleeveInches: 23.5, stock: 40 },
      { size: 'L', chestInches: 42, lengthInches: 40, shoulderInches: 19, sleeveInches: 24, stock: 55 },
      { size: 'XL', chestInches: 44, lengthInches: 42, shoulderInches: 20, sleeveInches: 24.5, stock: 35 },
      { size: 'XXL', chestInches: 46, lengthInches: 44, shoulderInches: 21, sleeveInches: 25, stock: 20 }
    ],
    retailPrice: 990,
    originalRetailPrice: 1250,
    wholesalePrice: 560,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 560, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 520, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 480, label: '100+ pcs' }
    ],
    stock: 170,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.95,
    reviewsCount: 56,
    tags: ['Katua', 'Jacquard', 'Eid Special', 'Top Wholesale Seller']
  },
  {
    id: 'sf-kt-202',
    code: 'SF-KT-202',
    name: 'Minimalist Solid Cotton Short Katua',
    nameBn: 'মিনিমালিস্ট সলিড কটন শর্ট কতুয়া',
    category: 'mens-katua',
    categoryName: "Men's Katua",
    categoryNameBn: 'পুরুষদের কতুয়া',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Everyday comfort short Katua with curved hemline and deep side slit pockets. Highly demanded by university students and wholesale clothing shop owners.',
    descriptionBn: 'নিত্যদিনের জন্য আরামদায়ক শর্ট কতুয়া। সাইড পকেট ও আধুনিক কাট। পাইকারি বাজারে দারুণ জনপ্রিয়।',
    fabric: '100% Breathable Slub Cotton',
    fabricBn: '১০০% স্লাব কটন ফেব্রিক',
    colors: [
      { name: 'Mustard Yellow', nameBn: 'সরিষা হলুদ', hex: '#e1ad01' },
      { name: 'Charcoal Grey', nameBn: 'চারকোল ধূসর', hex: '#4a4a4a' },
      { name: 'Sea Blue', nameBn: 'সি ব্লু', hex: '#006994' }
    ],
    sizes: [
      { size: 'S', chestInches: 37, lengthInches: 34, shoulderInches: 17, sleeveInches: 23, stock: 15 },
      { size: 'M', chestInches: 39, lengthInches: 36, shoulderInches: 18, sleeveInches: 23.5, stock: 30 },
      { size: 'L', chestInches: 41, lengthInches: 38, shoulderInches: 19, sleeveInches: 24, stock: 40 },
      { size: 'XL', chestInches: 43, lengthInches: 40, shoulderInches: 20, sleeveInches: 24.5, stock: 25 },
      { size: 'XXL', chestInches: 45, lengthInches: 42, shoulderInches: 21, sleeveInches: 25, stock: 15 }
    ],
    retailPrice: 790,
    originalRetailPrice: 990,
    wholesalePrice: 440,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 440, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 410, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 380, label: '100+ pcs' }
    ],
    stock: 125,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 31,
    tags: ['Short Katua', 'Cotton', 'Casual']
  },
  {
    id: 'sf-kt-203',
    code: 'SF-KT-203',
    name: 'Embroidered Placket Festive Katua',
    nameBn: 'সূক্ষ্ম এমব্রয়ডারি করা উৎসবের কতুয়া',
    category: 'mens-katua',
    categoryName: "Men's Katua",
    categoryNameBn: 'পুরুষদের কতুয়া',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Subtle computerized tonal embroidery along the collar and button placket. Tailored for wedding guest wear, family gatherings and festive seasons.',
    descriptionBn: 'কলার ও প্লাকেটে সূক্ষ্ম এমব্রয়ডারি ডিজাইন। যেকোনো উৎসব বা ঘরোয়া আয়োজনের জন্য দারুণ একটি পছন্দ।',
    fabric: 'Fine Cotton Silk Finish Blend',
    fabricBn: 'ফাইন কটন সিল্ক ফিনিশ ব্লেন্ড',
    colors: [
      { name: 'Deep Maroon', nameBn: 'গাঢ় মেরুন', hex: '#63081e' },
      { name: 'Ivory Cream', nameBn: 'আইভরি ক্রিম', hex: '#fffff0' },
      { name: 'Midnight Blue', nameBn: 'মিডনাইট ব্লু', hex: '#191970' }
    ],
    sizes: [
      { size: 'S', chestInches: 38, lengthInches: 36, shoulderInches: 17, sleeveInches: 23, stock: 15 },
      { size: 'M', chestInches: 40, lengthInches: 38, shoulderInches: 18, sleeveInches: 23.5, stock: 25 },
      { size: 'L', chestInches: 42, lengthInches: 40, shoulderInches: 19, sleeveInches: 24, stock: 35 },
      { size: 'XL', chestInches: 44, lengthInches: 42, shoulderInches: 20, sleeveInches: 24.5, stock: 20 },
      { size: 'XXL', chestInches: 46, lengthInches: 44, shoulderInches: 21, sleeveInches: 25, stock: 10 }
    ],
    retailPrice: 1090,
    originalRetailPrice: 1390,
    wholesalePrice: 620,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 620, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 580, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 540, label: '100+ pcs' }
    ],
    stock: 105,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 27,
    tags: ['Festive', 'Embroidery', 'Party Wear']
  },
  {
    id: 'sf-kt-204',
    code: 'SF-KT-204',
    name: 'Khadi Textured Casual Katua',
    nameBn: 'খাদি টেক্সচার্ড ক্যাজুয়াল কতুয়া',
    category: 'mens-katua',
    categoryName: "Men's Katua",
    categoryNameBn: 'পুরুষদের কতুয়া',
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Raw textured handloom feel Khadi cotton with natural coconut shell buttons. Eco-conscious fashion made with traditional weaving techniques at our facility.',
    descriptionBn: 'ন্যাচারাল খাদি কটন ও নারিকেলের খোসার বোতাম। আরামদায়ক ও রুচিশীল খাঁটি দেশীয় পোশাক।',
    fabric: 'Pure Deshi Khadi Cotton',
    fabricBn: '১০০% দেশি খাদি কটন',
    colors: [
      { name: 'Natural Sand', nameBn: 'ন্যাচারাল স্যান্ড', hex: '#e8d8b8' },
      { name: 'Teal Blue', nameBn: 'টিল ব্লু', hex: '#008080' },
      { name: 'Rust Orange', nameBn: 'রাস্ট অরেঞ্জ', hex: '#b7410e' }
    ],
    sizes: [
      { size: 'S', chestInches: 38, lengthInches: 36, shoulderInches: 17, sleeveInches: 23, stock: 15 },
      { size: 'M', chestInches: 40, lengthInches: 38, shoulderInches: 18, sleeveInches: 23.5, stock: 20 },
      { size: 'L', chestInches: 42, lengthInches: 40, shoulderInches: 19, sleeveInches: 24, stock: 30 },
      { size: 'XL', chestInches: 44, lengthInches: 42, shoulderInches: 20, sleeveInches: 24.5, stock: 25 },
      { size: 'XXL', chestInches: 46, lengthInches: 44, shoulderInches: 21, sleeveInches: 25, stock: 12 }
    ],
    retailPrice: 850,
    originalRetailPrice: 1050,
    wholesalePrice: 470,
    wholesaleMOQ: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 49, pricePerPiece: 470, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 440, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 410, label: '100+ pcs' }
    ],
    stock: 102,
    isFeatured: false,
    rating: 4.85,
    reviewsCount: 22,
    tags: ['Khadi', 'Deshi Handloom', 'Casual']
  }
];

// Helper to calculate tiered price per piece based on ordered wholesale quantity
export const getWholesaleTierPrice = (product: Product, quantity: number): { pricePerPiece: number; tierLabel: string } => {
  if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) {
    return { pricePerPiece: product.wholesalePrice, tierLabel: `MOQ ${product.wholesaleMOQ}+ pcs` };
  }

  // Find matching tier
  for (const tier of product.wholesaleTiers) {
    if (tier.maxQty !== undefined) {
      if (quantity >= tier.minQty && quantity <= tier.maxQty) {
        return { pricePerPiece: tier.pricePerPiece, tierLabel: tier.label || `${tier.minQty}–${tier.maxQty} pcs` };
      }
    } else {
      if (quantity >= tier.minQty) {
        return { pricePerPiece: tier.pricePerPiece, tierLabel: tier.label || `${tier.minQty}+ pcs` };
      }
    }
  }

  // Fallback if below MOQ: lowest tier price or base price
  return { pricePerPiece: product.wholesalePrice, tierLabel: `MOQ ${product.wholesaleMOQ} pcs` };
};

export const WHY_CHOOSE_US = [
  {
    title: 'Own Manufacturing Facility',
    titleBn: 'নিজস্ব কারখানা',
    subtitle: 'Factory in Ashulia, Savar with skilled master tailors & quality fabric sourcing.',
    subtitleBn: 'সাভার ও আশুলিয়ায় নিজস্ব কারখানায় দক্ষ কারিগর দ্বারা নিখুঁত ফিনিশিং।',
    icon: 'Factory'
  },
  {
    title: 'Retail & Wholesale Available',
    titleBn: 'পাইকারি ও খুচরা সুবিধা',
    subtitle: 'Direct pricing for single buyers and competitive bulk rates for shop owners.',
    subtitleBn: 'এক পিস খুচরা অর্ডারের পাশাপাশি সারা দেশের শোরুমের জন্য পাইকারি রেট।',
    icon: 'PackageCheck'
  },
  {
    title: 'Check Before You Accept',
    titleBn: 'ডেলিভারি চেক করে রিসিভ',
    subtitle: 'Verify fabric and fitting in front of the delivery person with full return/exchange rights.',
    subtitleBn: 'ডেলিভারিম্যানের সামনে প্রোডাক্ট চেক করে নেওয়ার সুযোগ ও সহজ রিটার্ন ব্যবস্থা।',
    icon: 'ShieldCheck'
  },
  {
    title: 'Fast Nationwide Delivery',
    titleBn: 'সারা দেশে দ্রুত ডেলিভারি',
    subtitle: 'Inside Dhaka ৳70 (24-48h), Outside Dhaka ৳120 (48-72h) via leading couriers.',
    subtitleBn: 'ঢাকার ভেতর মাত্র ৭০ টাকা এবং ঢাকার বাইরে ১২০ টাকায় হোম ডেলিভারি।',
    icon: 'Truck'
  }
];
