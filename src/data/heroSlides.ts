import { HeroSlide } from '../types';

export const HERO_SLIDES: HeroSlide[] = [
  // 1. SIDER FASHION STORE: Premium modern store flagship aesthetic representing the overall brand
  {
    slideId: 'slide-store-flagship',
    title: 'SIDER FASHION STORE',
    titleBn: 'সেরা ফ্যাশনের আধুনিক ঠিকানা — সাইডার ফ্যাশন',
    subtitle: 'Modern Garment Manufacturing & Premium Menswear Collection',
    subtitleBn: 'নিজস্ব কারখানায় প্রস্তুত — ১০০% মানসম্মত ফেব্রিক ও এক্সপোর্ট ফিনিশিং',
    badge: 'Own Savar Factory • 100% In-House Production',
    badgeBn: 'সাভার ও আশুলিয়ায় নিজস্ব কারখানা — সরাসরি উৎপাদন',
    image: '/src/assets/images/hero_store_flagship_1788006333464.jpg',
    mobileImage: '/src/assets/images/hero_store_flagship_1788006333464.jpg',
    imageAlt: 'Sider Fashion Luxury Menswear Flagship Store & Collection',
    buttons: [
      {
        id: 'hero-btn-store-shop',
        text: 'SHOP NOW',
        textBn: 'এখনই কিনুন',
        action: 'shop',
        categoryKey: 'all',
        variant: 'primary'
      },
      {
        id: 'hero-btn-store-wholesale',
        text: 'WHOLESALE',
        textBn: 'পাইকারি পোর্টাল',
        action: 'wholesale',
        variant: 'secondary'
      }
    ],
    active: true,
    alignment: 'left'
  },

  // 2. HANGING PRODUCT: Actual clothing product in clean fashion studio
  {
    slideId: 'slide-hanging-shirt',
    title: 'PREMIUM OXFORD SHIRTS',
    titleBn: '১০০% প্রিমিয়াম কটন ও অক্সফোর্ড শার্ট',
    subtitle: 'Flawless tailoring, breathable premium weave & long-lasting comfort',
    subtitleBn: 'আভিজাত্য ও আরামের অনন্য মেলবন্ধন — ডেলিভারিম্যানের সামনে দেখে নেওয়ার সুযোগ',
    badge: '100% Premium Combed Cotton',
    badgeBn: '১০০% কম্বড কটন • কালার ও ফেব্রিক গ্যারান্টি',
    image: '/src/assets/images/hero_hanging_shirt_1788006362811.jpg',
    mobileImage: '/src/assets/images/hero_hanging_shirt_1788006362811.jpg',
    imageAlt: 'Sider Fashion Premium Cotton Oxford Hanging Shirt Studio Shoot',
    buttons: [
      {
        id: 'hero-btn-shirt-shop',
        text: 'SHOP SHIRTS',
        textBn: 'শার্ট কালেকশন',
        action: 'category',
        categoryKey: 'shirt',
        variant: 'primary'
      },
      {
        id: 'hero-btn-shirt-all',
        text: 'SHOP NOW',
        textBn: 'সব কালেকশন',
        action: 'shop',
        categoryKey: 'all',
        variant: 'secondary'
      }
    ],
    active: true,
    alignment: 'left'
  },

  // 3. MODEL WEARING PRODUCT: Male fashion model in professional photoshoot
  {
    slideId: 'slide-model-katua',
    title: 'SIGNATURE KATUA COLLECTION',
    titleBn: 'ঐতিহ্যের সাথে আধুনিক স্টাইল — প্রিমিয়াম কতুয়া',
    subtitle: 'Exclusive jacquard textures, bespoke embroidery & festive elegance',
    subtitleBn: 'উৎসব ও আড্ডায় আপনার ব্যক্তিত্বর প্রকাশ — নিখুঁত কাটিং ও আভিজাত্য',
    badge: 'Signature Cultural & Modern Attire',
    badgeBn: 'এক্সক্লুসিভ জ্যাকার্ড ও সুতি কতুয়া কালেকশন',
    image: '/src/assets/images/hero_model_katua_1788006377967.jpg',
    mobileImage: '/src/assets/images/hero_model_katua_1788006377967.jpg',
    imageAlt: 'Sider Fashion Male Model Wearing Signature Katua in Studio Shoot',
    buttons: [
      {
        id: 'hero-btn-katua-shop',
        text: 'SHOP KATUA',
        textBn: 'কতুয়া কালেকশন দেখুন',
        action: 'category',
        categoryKey: 'katua',
        variant: 'primary'
      },
      {
        id: 'hero-btn-katua-all',
        text: 'SHOP NOW',
        textBn: 'এখনই কিনুন',
        action: 'shop',
        categoryKey: 'all',
        variant: 'secondary'
      }
    ],
    active: true,
    alignment: 'left'
  },

  // 4. PRODUCT DISPLAY: Multiple apparel products arranged professionally (T-Shirts, Polos, Jerseys)
  {
    slideId: 'slide-product-display',
    title: 'T-SHIRTS, POLOS & SPORTS JERSEYS',
    titleBn: 'প্রিমিয়াম টি-শার্ট, পোলো ও জার্সি সম্ভার',
    subtitle: 'High-GSM drop-shoulder tees, moisture-wicking jerseys & classic polos',
    subtitleBn: 'প্রতিদিনের স্মার্ট স্টাইলে প্রিমিয়াম জিএসএম কটন ও স্পোর্টস কালেকশন',
    badge: 'Heavy GSM Cotton & Dry-Fit Microfiber',
    badgeBn: 'উন্নত ড্রপ শোল্ডার ও ড্রাই-ফিট স্পোর্টস জার্সি',
    image: '/src/assets/images/hero_product_display_1788006395796.jpg',
    mobileImage: '/src/assets/images/hero_product_display_1788006395796.jpg',
    imageAlt: 'Sider Fashion T-Shirts, Polo Shirts and Jerseys Curated Display',
    buttons: [
      {
        id: 'hero-btn-tees-shop',
        text: 'SHOP T-SHIRTS',
        textBn: 'টি-শার্ট ও পোলো দেখুন',
        action: 'category',
        categoryKey: 'tshirt',
        variant: 'primary'
      },
      {
        id: 'hero-btn-jersey-shop',
        text: 'SPORTS JERSEYS',
        textBn: 'জার্সি কালেকশন',
        action: 'category',
        categoryKey: 'jersey',
        variant: 'secondary'
      }
    ],
    active: true,
    alignment: 'left'
  },

  // 5. LIFESTYLE FASHION: Male model in realistic urban lifestyle setting
  {
    slideId: 'slide-lifestyle-fashion',
    title: 'Modern LIFESTYLE & CASUALS',
    titleBn: 'স্মার্ট লুক ও প্রতিদিনের স্বাচ্ছন্দ্য',
    subtitle: 'Effortless everyday fits tailored for confidence, comfort & trend',
    subtitleBn: 'আপনার পছন্দের আধুনিক ফিট ও টেকসই কাপড়ের ১০০% নিশ্চয়তা',
    badge: 'Everyday Modern Casuals',
    badgeBn: 'স্মার্ট ক্যাজুয়াল • ১০০% কালার ও ফেব্রিক গ্যারান্টি',
    image: '/src/assets/images/hero_lifestyle_man_1788006418142.jpg',
    mobileImage: '/src/assets/images/hero_lifestyle_man_1788006418142.jpg',
    imageAlt: 'Sider Fashion Male Model in Urban Lifestyle Environment',
    buttons: [
      {
        id: 'hero-btn-lifestyle-shop',
        text: 'SHOP NOW',
        textBn: 'এখনই কিনুন',
        action: 'shop',
        categoryKey: 'all',
        variant: 'primary'
      },
      {
        id: 'hero-btn-lifestyle-wholesale',
        text: 'WHOLESALE RATES',
        textBn: 'পাইকারি রেট',
        action: 'wholesale',
        variant: 'secondary'
      }
    ],
    active: true,
    alignment: 'left'
  }
];

