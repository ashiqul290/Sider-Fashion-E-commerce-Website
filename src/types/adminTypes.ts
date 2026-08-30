import { 
  Product, 
  ProductCategory,
  RetailCategoryKey, 
  WholesalePricingTier,
  ProductColor,
  ProductSize,
  CategoryInfo,
  CategorySizeChart,
  FAQItem,
  HeroSlide,
  PaymentAccountConfig,
  OrderDetails,
  WholesaleInquiry,
  PaymentMethod,
  PaymentStatus,
  OrderStatus
} from '../types';

// Admin Roles & Permissions
export type AdminRole = 'owner' | 'admin' | 'super_admin' | 'order_manager' | 'content_manager' | 'marketing_manager';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  roleTitle: string;
  email: string;
  status: 'active' | 'disabled';
  lastLogin?: string;
  lastLogout?: string;
  lastLoginIp?: string;
  avatar?: string;
  createdAt: string;
}

export interface AdminActivityLog {
  id: string;
  timestamp: string; // ISO 8601
  adminName: string;
  adminRole: AdminRole;
  action: string;
  category: 'product' | 'order' | 'payment' | 'inventory' | 'cms' | 'setting' | 'coupon' | 'auth';
  targetId?: string;
  targetName?: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

export type AdminAuditLog = AdminActivityLog;

export interface SuspiciousOrderFlag {
  orderId: string;
  phone: string;
  customerName: string;
  reasons: string[];
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  isReviewed: boolean;
  adminNotes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 100 for ৳100
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate?: string;
  isActive: boolean;
  usageLimit?: number;
  timesUsed: number;
  applicableScope: 'all' | 'retail' | 'wholesale';
  createdAt: string;
}

export interface BusinessSettings {
  brandName: string;
  tagline: string;
  taglineBn: string;
  primaryPhone: string;
  secondaryPhone: string;
  wholesalePhone: string;
  email: string;
  facebookUrl: string;
  locationDisplay: string;
  factoryAddress: string;
  workingHours: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  freeDeliveryThreshold?: number;
  globalWholesaleMOQ: number;
  defaultWholesaleDiscountPercent: number;
  lowStockThreshold: number;
  enableDuplicateTrxBlock: boolean;
  enableAutoSuspiciousFlag: boolean;
}

export type AdminSettings = BusinessSettings;

export interface MarketingCampaign {
  id: string;
  source: string; // e.g. "facebook_ads", "instagram", "tiktok", "google", "direct", "organic", "whatsapp"
  medium?: string;
  campaignName: string;
  adSpend: number; // In BDT (৳)
  visitorsCount: number;
  ordersCount: number;
  revenueGenerated: number;
  notes?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  sizeKb?: number;
  dimensions?: string;
  category: 'product' | 'banner' | 'category' | 'general';
  uploadedAt: string;
  usedInCount: number;
}

export interface CustomerProfile {
  phone: string;
  normalizedPhone: string;
  name: string;
  whatsappNumber: string;
  district: string;
  area: string;
  fullAddress: string;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isWholesaleCustomer: boolean;
  businessName?: string;
  orderIds: string[];
}

export interface ContactItem {
  id: string;
  type: 'hotline' | 'whatsapp' | 'wholesale' | 'email' | 'factory' | 'showroom' | 'other';
  label: string;
  labelBn: string;
  value: string;
  isPrimary: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface SocialLinkItem {
  id: string;
  platform: 'facebook' | 'whatsapp' | 'instagram' | 'tiktok' | 'youtube' | 'messenger' | 'linkedin' | 'twitter' | 'other';
  displayName: string;
  url: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface HomepageSectionConfig {
  id: string;
  key: string;
  title: string;
  titleBn: string;
  subtitle?: string;
  subtitleBn?: string;
  isVisible: boolean;
  displayOrder: number;
  badge?: string;
  badgeBn?: string;
}

export type AdminLanguage = 'bn' | 'en';

export interface PolicyContent {
  returnPolicy: string;
  returnPolicyBn: string;
  exchangePolicy: string;
  exchangePolicyBn: string;
  deliveryPolicy: string;
  deliveryPolicyBn: string;
  shippingInfo: string;
  shippingInfoBn: string;
  privacyPolicy: string;
  privacyPolicyBn: string;
  termsConditions: string;
  termsConditionsBn: string;
  aboutUs: string;
  aboutUsBn: string;
}

export type AdminTab = 
  | 'dashboard'
  | 'sider-ai'
  | 'orders'
  | 'verification'
  | 'suspicious'
  | 'products'
  | 'inventory'
  | 'categories'
  | 'wholesale'
  | 'wholesale-config'
  | 'sizes-colors'
  | 'customers'
  | 'cms'
  | 'hero-cms'
  | 'faqs-cms'
  | 'policies-cms'
  | 'marketing'
  | 'coupons'
  | 'media'
  | 'settings'
  | 'accounts'
  | 'audit'
  | 'audit-logs'
  | 'backup'
  | 'backup-export';

