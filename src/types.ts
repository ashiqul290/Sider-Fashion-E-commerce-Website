export type ProductCategory = 
  | 'mens-shirts' 
  | 'mens-katua' 
  | 'mens-fashion' 
  | 'womens-fashion' 
  | 'womens-dresses'
  | 'kids'
  | 'festive-collection'
  | 'summer-collection'
  | 'winter-collection'
  | 'new-arrivals';

export type RetailCategoryKey = 'all' | 'shirt' | 'katua' | 'mens' | 'new-arrival' | string;

export interface WholesalePricingTier {
  minQty: number;
  maxQty?: number; // undefined means 100+
  pricePerPiece: number;
  label?: string; // e.g. "12–49 pcs"
}

export interface ProductColor {
  id?: string;
  name: string;
  nameBn: string;
  hex: string;
  image?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface ProductSize {
  size: string; // 'S', 'M', 'L', 'XL', 'XXL'
  chestInches: number;
  lengthInches: number;
  shoulderInches?: number;
  sleeveInches?: number;
  collarInches?: number;
  stock: number;
}

export type FitPreference = 'slim' | 'regular' | 'relaxed';

export interface SizeChartRow {
  size: string;
  chestInches: number;
  chestCm: number;
  lengthInches: number;
  lengthCm: number;
  shoulderInches: number;
  shoulderCm: number;
  sleeveInches: number;
  sleeveCm: number;
  collarInches?: number;
  collarCm?: number;
  recommendedWeightKg: string; // e.g. "55-65 kg"
  recommendedHeightFt: string; // e.g. "5'5\" - 5'8\""
}

export interface CategorySizeChart {
  id: string;
  categoryId: ProductCategory | string;
  categoryName: string;
  categoryNameBn: string;
  description: string;
  descriptionBn: string;
  chartRows: SizeChartRow[];
  fitTips: string[];
  fitTipsBn: string[];
}

export interface SizeRecommendationInput {
  heightFeet: number;
  heightInches: number;
  weightKg: number;
  fitPreference: FitPreference;
  categoryId?: string;
}

export interface SizeRecommendationResult {
  recommendedSize: string;
  alternativeSize?: string;
  fitConfirmed: boolean;
  chestEstimateInches: number;
  explanation: string;
  explanationBn: string;
  matchScore: number;
}

export interface FAQItem {
  id: string;
  category: 'size' | 'delivery' | 'return' | 'wholesale' | 'payment' | 'factory';
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
}

export interface Product {
  id: string;
  code: string; // e.g. "SF-SH-101"
  name: string;
  nameBn: string;
  category: ProductCategory;
  categoryName: string;
  categoryNameBn: string;
  images: string[];
  description: string;
  descriptionBn: string;
  shortDescription?: string;
  shortDescriptionBn?: string;
  fullDescription?: string;
  fullDescriptionBn?: string;
  fabric: string;
  fabricBn: string;
  fit?: string;
  fitBn?: string;
  pattern?: string;
  patternBn?: string;
  careInstructions?: string[];
  careInstructionsBn?: string[];
  suitableFor?: string;
  suitableForBn?: string;
  manufacturedBy?: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  retailPrice: number; // In BDT (৳)
  originalRetailPrice?: number; // In BDT (৳) for discount display
  wholesalePrice: number; // In BDT (৳) - Base MOQ tier price
  wholesaleMOQ: number; // Minimum Order Quantity for wholesale (e.g. 12)
  wholesaleTiers?: WholesalePricingTier[]; // Tiered wholesale volume pricing
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface CategoryInfo {
  id: string;
  key: RetailCategoryKey;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  image: string;
  isActive: boolean; // active in Sider Fashion current catalog vs upcoming
  isUpcoming?: boolean;
  itemCount: number;
  badge?: string;
  badgeBn?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  isWholesale?: boolean;
}

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned' 
  | 'Exchanged';

export type PaymentStatus = 
  | 'Pending' 
  | 'Verification Pending' 
  | 'Verified' 
  | 'Paid' 
  | 'Failed' 
  | 'Refunded';

export interface DistrictInfo {
  name: string;
  nameBn: string;
  zone: DeliveryZone;
}

export interface OrderItemRecord {
  productId: string;
  productCode: string; // SKU
  productName: string;
  productNameBn?: string;
  category: string;
  selectedSize: string;
  selectedColor: {
    name: string;
    nameBn?: string;
    hex: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image?: string;
  isWholesale?: boolean;
}

export interface OrderDetails {
  orderId: string; // e.g. "SF-2026-000001"
  createdAt: string; // ISO 8601 string
  customerName: string;
  phone: string;
  whatsappNumber: string;
  district: string;
  area: string;
  fullAddress: string;
  deliveryZone: DeliveryZone;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  senderLast4?: string | null;
  paymentAmount: number;
  paymentTimestamp: string | null;
  orderStatus: OrderStatus;
  customerNote?: string;
  notes?: string;
  items: CartItem[];
  itemRecords?: OrderItemRecord[];
  orderType?: 'retail' | 'wholesale';
  isVerificationRequired?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  trafficSource?: string;
  productCost?: number;
  estimatedProfit?: number;
}

export interface WholesaleSizeBreakdown {
  [size: string]: number;
}

export interface WholesaleInquiry {
  id: string; // e.g. "SF-WS-2026-000001"
  createdAt: string;
  customerName: string;
  businessName: string;
  phone: string;
  whatsappNumber: string;
  productCode: string;
  productName: string;
  targetQuantity: number;
  sizeBreakdown?: WholesaleSizeBreakdown | string;
  targetColor?: string;
  district: string;
  area?: string;
  fullAddress?: string;
  appliedTierPrice?: number;
  totalEstimatedAmount?: number;
  additionalMessage?: string;
  orderStatus?: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  transactionId?: string | null;
  senderLast4?: string | null;
  isVerificationRequired?: boolean;
}

export type NavigationView = 
  | 'home' 
  | 'retail'
  | 'shop' 
  | 'wholesale' 
  | 'categories' 
  | 'size-guide' 
  | 'faq' 
  | 'contact' 
  | 'about' 
  | 'tracking'
  | 'privacy'
  | 'terms'
  | 'shipping'
  | 'returns'
  | 'admin';

export type LegalDocType = 'privacy' | 'terms' | 'shipping' | 'returns';

export interface PaymentAccountConfig {
  bkash: {
    accountNumber: string;
    accountType: 'Personal (Send Money)' | 'Merchant (Payment)' | 'Agent';
    instructionsEn: string[];
    instructionsBn: string[];
  };
  nagad: {
    accountNumber: string;
    accountType: 'Personal (Send Money)' | 'Merchant (Payment)';
    instructionsEn: string[];
    instructionsBn: string[];
  };
}

export interface HeroSlideButton {
  text: string;
  textBn?: string;
  action: 'shop' | 'category' | 'wholesale';
  categoryKey?: RetailCategoryKey;
  variant?: 'primary' | 'secondary' | 'outline';
  id?: string;
}

export interface HeroSlide {
  slideId: string;
  title: string;
  titleBn?: string;
  subtitle: string;
  subtitleBn?: string;
  badge?: string;
  badgeBn?: string;
  image: string;
  mobileImage?: string;
  imageAlt: string;
  buttons: HeroSlideButton[];
  active: boolean;
  alignment?: 'left' | 'center' | 'right';
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

