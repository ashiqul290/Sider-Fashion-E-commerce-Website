import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  ProductColor, 
  DeliveryZone, 
  OrderDetails, 
  WholesaleInquiry, 
  NavigationView, 
  RetailCategoryKey,
  CategoryInfo,
  HeroSlide,
  FAQItem,
  PaymentAccountConfig,
  LegalDocType,
  PaymentMethod
} from '../types';
import { INITIAL_PRODUCTS, BRAND_CONTACTS, CATEGORIES } from '../data/products';
import { DELIVERY_FEES } from '../data/bangladeshDistricts';
import { OrderService } from '../services/orderService';
import { NotificationService } from '../services/notificationService';
import { AdminStoreService } from '../services/adminStoreService';
import { 
  AdminUser, 
  BusinessSettings, 
  PolicyContent, 
  ContactItem, 
  SocialLinkItem, 
  HomepageSectionConfig 
} from '../types/adminTypes';

interface CartContextType {
  // Products & Catalog state (Connected to Real Backend)
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  refreshProducts: () => void;
  refreshAllData: () => void;

  // Real CMS & Store Dynamic Configs
  categories: CategoryInfo[];
  heroSlides: HeroSlide[];
  faqs: FAQItem[];
  settings: BusinessSettings;
  policies: PolicyContent;
  contacts: ContactItem[];
  socialLinks: SocialLinkItem[];
  homepageSections: HomepageSectionConfig[];
  paymentConfig: PaymentAccountConfig;

  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, selectedColor: ProductColor, selectedSize: string, quantity?: number, isWholesale?: boolean) => void;
  removeFromCart: (productId: string, colorHex: string, size: string) => void;
  updateQuantity: (productId: string, colorHex: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Delivery & Checkout state
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  deliveryFee: number;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotal: number;

  // UI Modals & Navigation states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  activeProductDetail: Product | null;
  setActiveProductDetail: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isAdminManagerOpen: boolean;
  setIsAdminManagerOpen: (open: boolean) => void;
  
  // Master Admin Panel states
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  currentAdminUser: AdminUser | null;
  loginAdmin: (user: AdminUser) => void;
  logoutAdmin: () => void;

  isReturnPolicyModalOpen: boolean;
  setIsReturnPolicyModalOpen: (open: boolean) => void;
  isWholesaleModalOpen: boolean;
  setIsWholesaleModalOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  sizeGuideActiveProduct: Product | null;
  openSizeGuide: (product?: Product | null, initialTab?: 'finder' | 'chart' | 'measure') => void;
  closeSizeGuide: () => void;
  isFAQModalOpen: boolean;
  setIsFAQModalOpen: (open: boolean) => void;
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  legalDocType: LegalDocType;
  setLegalDocType: (type: LegalDocType) => void;
  openLegalModal: (type: LegalDocType) => void;

  // Active navigation view
  currentView: NavigationView;
  setCurrentView: (view: NavigationView) => void;
  activeCategoryFilter: RetailCategoryKey | null;
  setActiveCategoryFilter: (category: RetailCategoryKey | null) => void;
  navigateToCategory: (categoryKey: RetailCategoryKey) => void;

  // Orders and wholesale submissions
  recentOrders: OrderDetails[];
  latestPlacedOrder: OrderDetails | null;
  createOrder: (orderData: {
    customerName: string;
    phone: string;
    whatsappNumber?: string;
    district: string;
    area: string;
    fullAddress: string;
    deliveryZone: DeliveryZone;
    deliveryFee: number;
    paymentMethod: PaymentMethod;
    transactionId?: string | null;
    senderLast4?: string | null;
    paidAmount?: number;
    items: CartItem[];
    subtotal: number;
    discount?: number;
    couponCode?: string;
    total: number;
    customerNote?: string;
  }) => { success: boolean; order?: OrderDetails; error?: string };
  wholesaleInquiries: WholesaleInquiry[];
  submitWholesaleInquiry: (inquiry: {
    customerName: string;
    businessName: string;
    phone: string;
    whatsappNumber?: string;
    productCode: string;
    productName: string;
    targetQuantity: number;
    sizeBreakdown?: Record<string, number>;
    targetColor?: string;
    district: string;
    area?: string;
    fullAddress?: string;
    appliedTierPrice: number;
    totalEstimatedAmount: number;
    additionalMessage?: string;
    paymentMethod?: PaymentMethod;
    transactionId?: string | null;
    senderLast4?: string | null;
  }) => { success: boolean; inquiry?: WholesaleInquiry; error?: string };

  // Direct checkout helper
  quickBuy: (product: Product, selectedColor: ProductColor, selectedSize: string, quantity?: number) => void;

  // WhatsApp Helper
  openWhatsAppChat: (message?: string, phoneNumber?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Data States
  const [products, setProducts] = useState<Product[]>(() => AdminStoreService.getProducts());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => AdminStoreService.getCategories());
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => AdminStoreService.getHeroSlides());
  const [faqs, setFaqs] = useState<FAQItem[]>(() => AdminStoreService.getFAQs());
  const [settings, setSettings] = useState<BusinessSettings>(() => AdminStoreService.getSettings());
  const [policies, setPolicies] = useState<PolicyContent>(() => AdminStoreService.getPolicies());
  const [contacts, setContacts] = useState<ContactItem[]>(() => AdminStoreService.getContacts());
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(() => AdminStoreService.getSocialLinks());
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(() => AdminStoreService.getHomepageSections());
  const [paymentConfig, setPaymentConfig] = useState<PaymentAccountConfig>(() => AdminStoreService.getPaymentConfig());

  // Function to refresh state from AdminStoreService
  const refreshAllData = useCallback(() => {
    setProducts(AdminStoreService.getProducts());
    setCategories(AdminStoreService.getCategories());
    setHeroSlides(AdminStoreService.getHeroSlides());
    setFaqs(AdminStoreService.getFAQs());
    setSettings(AdminStoreService.getSettings());
    setPolicies(AdminStoreService.getPolicies());
    setContacts(AdminStoreService.getContacts());
    setSocialLinks(AdminStoreService.getSocialLinks());
    setHomepageSections(AdminStoreService.getHomepageSections());
    setPaymentConfig(AdminStoreService.getPaymentConfig());
  }, []);

  const refreshProducts = () => {
    setProducts(AdminStoreService.getProducts());
  };

  // Subscribe to real-time sync events from backend database
  useEffect(() => {
    AdminStoreService.init();
    const unsubscribe = AdminStoreService.subscribe(() => {
      refreshAllData();
    });
    return () => {
      unsubscribe();
    };
  }, [refreshAllData]);

  // UTM attribution capture
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || urlParams.get('ref');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmMedium = urlParams.get('utm_medium');
        if (utmSource) {
          sessionStorage.setItem('sider_utm_source', utmSource);
        }
        if (utmCampaign) {
          sessionStorage.setItem('sider_utm_campaign', utmCampaign);
        }
        if (utmMedium) {
          sessionStorage.setItem('sider_utm_medium', utmMedium);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Restore a valid persisted session after a page refresh or Vite reload.
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() =>
    AdminStoreService.getCurrentUser()
  );
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(() =>
    Boolean(AdminStoreService.getCurrentUser())
  );
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const loginAdmin = (user: AdminUser) => {
    setCurrentAdminUser(user);
    setIsAdminPanelOpen(true);
  };

  const logoutAdmin = () => {
    AdminStoreService.logout();
    setCurrentAdminUser(null);
    setIsAdminPanelOpen(false);
  };

  useEffect(() => {
    let isMounted = true;

    const restoreAdminSession = async () => {
      if (!AdminStoreService.getCurrentUser()) return;

      const isValid = await AdminStoreService.verifySession();
      if (!isMounted) return;

      if (!isValid) {
        setCurrentAdminUser(null);
        setIsAdminPanelOpen(false);
        return;
      }

      const verifiedUser = AdminStoreService.getActiveAdmin();
      if (verifiedUser) {
        setCurrentAdminUser(verifiedUser);
        setIsAdminPanelOpen(true);
      }
    };

    restoreAdminSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('sider_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Delivery zone state
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');

  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);
  const [isReturnPolicyModalOpen, setIsReturnPolicyModalOpen] = useState(false);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideActiveProduct, setSizeGuideActiveProduct] = useState<Product | null>(null);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>('returns');

  // View state with URL path routing support
  const [currentView, setCurrentViewInternal] = useState<NavigationView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (path === '/admin') return 'admin';
      if (path === '/retail' || path === '/shop') return 'retail';
      if (path === '/wholesale') return 'wholesale';
      if (path === '/categories') return 'categories';
      if (path === '/size-guide') return 'size-guide';
      if (path === '/faq') return 'faq';
      if (path === '/contact') return 'contact';
      if (path === '/tracking') return 'tracking';
    }
    return 'home';
  });

  const setCurrentView = (view: NavigationView) => {
    setCurrentViewInternal(view);
    if (typeof window !== 'undefined') {
      const pathMap: Record<string, string> = {
        home: '/',
        retail: '/retail',
        shop: '/retail',
        wholesale: '/wholesale',
        categories: '/categories',
        'size-guide': '/size-guide',
        faq: '/faq',
        contact: '/contact',
        tracking: '/tracking',
        about: '/about',
        admin: '/admin'
      };
      const newPath = pathMap[view] || '/';
      if (window.location.pathname !== newPath) {
        window.history.pushState({ view }, '', newPath);
      }
    }
  };

  // Listen to browser popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (path === '/admin') {
        setCurrentViewInternal('admin');
      } else if (path === '/retail' || path === '/shop') {
        setCurrentViewInternal('retail');
      } else if (path === '/wholesale') {
        setCurrentViewInternal('wholesale');
      } else if (path === '/categories') {
        setCurrentViewInternal('categories');
      } else if (path === '/size-guide') {
        setCurrentViewInternal('size-guide');
      } else if (path === '/faq') {
        setCurrentViewInternal('faq');
      } else if (path === '/contact') {
        setCurrentViewInternal('contact');
      } else if (path === '/tracking') {
        setCurrentViewInternal('tracking');
      } else {
        setCurrentViewInternal('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<RetailCategoryKey | null>(null);

  const navigateToCategory = (categoryKey: RetailCategoryKey) => {
    setActiveCategoryFilter(categoryKey);
    setCurrentView('retail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSizeGuide = (product?: Product | null) => {
    setSizeGuideActiveProduct(product || null);
    setIsSizeGuideOpen(true);
  };

  const closeSizeGuide = () => {
    setIsSizeGuideOpen(false);
    setSizeGuideActiveProduct(null);
  };

  const openLegalModal = (type: LegalDocType) => {
    setLegalDocType(type);
    setIsLegalModalOpen(true);
  };

  // Orders state initialized from OrderService
  const [recentOrders, setRecentOrders] = useState<OrderDetails[]>(() => {
    return OrderService.getStoredOrders();
  });
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<OrderDetails | null>(null);

  // Wholesale inquiries state
  const [wholesaleInquiries, setWholesaleInquiries] = useState<WholesaleInquiry[]>(() => {
    return OrderService.getStoredWholesaleOrders();
  });

  // Save cart to local storage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('sider_cart', JSON.stringify(cart));
      }
    } catch {
      // Safe fallback when storage quota is restricted
    }
  }, [cart]);

  // Add Product (Admin support)
  const addProduct = (newProd: Product) => {
    AdminStoreService.addProduct(newProd, currentAdminUser?.name || 'Admin');
    setProducts(AdminStoreService.getProducts());
  };

  const updateProduct = (updatedProd: Product) => {
    AdminStoreService.updateProduct(updatedProd, currentAdminUser?.name || 'Admin');
    setProducts(AdminStoreService.getProducts());
  };

  // Add to cart with stock validation check
  const addToCart = (product: Product, selectedColor: ProductColor, selectedSize: string, quantity = 1, isWholesale = false) => {
    const sizeObj = product.sizes?.find(s => s.size === selectedSize);
    const availableStock = sizeObj ? sizeObj.stock : (product.stock || 50);

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.product.id === product.id && 
                item.selectedColor.hex === selectedColor.hex && 
                item.selectedSize === selectedSize &&
                !!item.isWholesale === !!isWholesale
      );

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, availableStock);
        const updated = [...prevCart];
        updated[existingIndex].quantity = newQty;
        return updated;
      }

      const safeQty = Math.min(quantity, availableStock);
      return [...prevCart, { product, selectedColor, selectedSize, quantity: safeQty, isWholesale }];
    });
    setIsCartOpen(true);
  };

  // Quick buy helper
  const quickBuy = (product: Product, selectedColor: ProductColor, selectedSize: string, quantity = 1) => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Remove from cart
  const removeFromCart = (productId: string, colorHex: string, size: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedColor.hex === colorHex && item.selectedSize === size)
    ));
  };

  // Update quantity with stock ceiling
  const updateQuantity = (productId: string, colorHex: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorHex, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor.hex === colorHex && item.selectedSize === size) {
        const sizeObj = item.product.sizes?.find(s => s.size === size);
        const availableStock = sizeObj ? sizeObj.stock : (item.product.stock || 50);
        return { ...item, quantity: Math.min(quantity, availableStock) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const unitPrice = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return total + (unitPrice * item.quantity);
  }, 0);

  const currentInsideFee = settings?.deliveryFeeInsideDhaka ?? (DELIVERY_FEES.inside_dhaka || 70);
  const currentOutsideFee = settings?.deliveryFeeOutsideDhaka ?? (DELIVERY_FEES.outside_dhaka || 120);
  const deliveryFee = cart.length === 0 ? 0 : (deliveryZone === 'inside_dhaka' ? currentInsideFee : currentOutsideFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    
    // Check AdminStoreService active coupons first
    const dynamicRes = AdminStoreService.validateCoupon(cleanCode, cartSubtotal);
    if (dynamicRes.valid && dynamicRes.coupon) {
      setCouponCode(cleanCode);
      setDiscountAmount(dynamicRes.discountAmount);
      const label = dynamicRes.coupon.discountType === 'percentage' 
        ? `${dynamicRes.coupon.discountValue}% OFF` 
        : `৳${dynamicRes.coupon.discountValue} OFF`;
      return { success: true, message: `🎉 Voucher Applied: ${label}` };
    }

    if (cleanCode === 'SIDER10' || cleanCode === 'SIDERNEW') {
      const disc = Math.round(cartSubtotal * 0.1);
      setCouponCode(cleanCode);
      setDiscountAmount(disc);
      return { success: true, message: '🎉 10% Special Sider discount applied!' };
    } else if (cleanCode === 'EID100' || cleanCode === 'SAVAR50') {
      const disc = 100;
      setCouponCode(cleanCode);
      setDiscountAmount(disc);
      return { success: true, message: '🎉 ৳100 Instant Discount applied!' };
    }
    return { success: false, message: dynamicRes.message || 'Invalid coupon code. Try SIDER10' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
  };

  const cartTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // Create order via OrderService
  const createOrder = (orderData: {
    customerName: string;
    phone: string;
    whatsappNumber?: string;
    district: string;
    area: string;
    fullAddress: string;
    deliveryZone: DeliveryZone;
    deliveryFee: number;
    paymentMethod: PaymentMethod;
    transactionId?: string | null;
    senderLast4?: string | null;
    paidAmount?: number;
    items: CartItem[];
    subtotal: number;
    discount?: number;
    couponCode?: string;
    total: number;
    customerNote?: string;
  }): { success: boolean; order?: OrderDetails; error?: string } => {
    const result = OrderService.createRetailOrder(orderData);
    if (result.success && result.order) {
      setRecentOrders(prev => [result.order!, ...prev]);
      setLatestPlacedOrder(result.order);
      
      // Dispatch notification event
      NotificationService.notifyOrderEvent({
        event: 'ORDER_CREATED',
        orderId: result.order.orderId,
        customerName: result.order.customerName,
        phone: result.order.phone,
        totalAmount: result.order.total,
        paymentMethod: result.order.paymentMethod,
        paymentStatus: result.order.paymentStatus,
        orderStatus: result.order.orderStatus,
        transactionId: result.order.transactionId,
        timestamp: result.order.createdAt
      });

      clearCart();
      setIsCheckoutOpen(false);
      setIsOrderSuccessOpen(true);
      return { success: true, order: result.order };
    }
    return { success: false, error: result.error || 'Failed to place order.' };
  };

  // Submit wholesale inquiry via OrderService
  const submitWholesaleInquiry = (inquiry: {
    customerName: string;
    businessName: string;
    phone: string;
    whatsappNumber?: string;
    productCode: string;
    productName: string;
    targetQuantity: number;
    sizeBreakdown?: Record<string, number>;
    targetColor?: string;
    district: string;
    area?: string;
    fullAddress?: string;
    appliedTierPrice: number;
    totalEstimatedAmount: number;
    additionalMessage?: string;
    paymentMethod?: PaymentMethod;
    transactionId?: string | null;
    senderLast4?: string | null;
  }): { success: boolean; inquiry?: WholesaleInquiry; error?: string } => {
    const result = OrderService.createWholesaleOrder(inquiry);
    if (result.success && result.inquiry) {
      setWholesaleInquiries(prev => [result.inquiry!, ...prev]);
      
      // Notification
      NotificationService.notifyOrderEvent({
        event: 'WHOLESALE_INQUIRY_CREATED',
        orderId: result.inquiry.id,
        customerName: result.inquiry.customerName,
        phone: result.inquiry.phone,
        totalAmount: result.inquiry.totalEstimatedAmount || 0,
        paymentMethod: result.inquiry.paymentMethod || 'cod',
        paymentStatus: result.inquiry.paymentStatus || 'Pending',
        orderStatus: result.inquiry.orderStatus || 'Pending',
        transactionId: result.inquiry.transactionId,
        timestamp: result.inquiry.createdAt
      });

      return { success: true, inquiry: result.inquiry };
    }
    return { success: false, error: result.error || 'Failed to submit wholesale inquiry.' };
  };

  // WhatsApp click generator
  const openWhatsAppChat = (message?: string, phoneNumber?: string) => {
    const primaryContact = contacts.find(c => c.type === 'whatsapp' || c.type === 'hotline')?.value;
    const targetPhone = phoneNumber || primaryContact || settings.primaryPhone || BRAND_CONTACTS.primaryPhone;
    const formattedNumber = targetPhone.startsWith('0') ? `88${targetPhone}` : targetPhone;
    const defaultMsg = "Hello Sider Fashion! I am interested in your clothing collection (Retail / Wholesale). Please provide more details.";
    const text = encodeURIComponent(message || defaultMsg);
    window.open(`https://wa.me/${formattedNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        refreshProducts,
        refreshAllData,
        categories,
        heroSlides,
        faqs,
        settings,
        policies,
        contacts,
        socialLinks,
        homepageSections,
        paymentConfig,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryZone,
        setDeliveryZone,
        deliveryFee,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        activeProductDetail,
        setActiveProductDetail,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAdminManagerOpen,
        setIsAdminManagerOpen,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        currentAdminUser,
        loginAdmin,
        logoutAdmin,
        isReturnPolicyModalOpen,
        setIsReturnPolicyModalOpen,
        isWholesaleModalOpen,
        setIsWholesaleModalOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        sizeGuideActiveProduct,
        openSizeGuide,
        closeSizeGuide,
        isFAQModalOpen,
        setIsFAQModalOpen,
        isLegalModalOpen,
        setIsLegalModalOpen,
        legalDocType,
        setLegalDocType,
        openLegalModal,
        currentView,
        setCurrentView,
        activeCategoryFilter,
        setActiveCategoryFilter,
        navigateToCategory,
        recentOrders,
        latestPlacedOrder,
        createOrder,
        wholesaleInquiries,
        submitWholesaleInquiry,
        quickBuy,
        openWhatsAppChat
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
