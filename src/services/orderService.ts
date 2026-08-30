import { 
  OrderDetails, 
  OrderItemRecord, 
  CartItem, 
  PaymentMethod, 
  PaymentStatus, 
  OrderStatus,
  WholesaleInquiry 
} from '../types';
import { DELIVERY_FEES } from '../data/bangladeshDistricts';
import { AnalyticsTrackingService } from './analyticsTrackingService';

const ORDERS_STORAGE_KEY = 'sider_orders_v2';
const WHOLESALE_ORDERS_KEY = 'sider_wholesale_orders_v2';
const ORDER_COUNTER_KEY = 'sider_order_seq_2026';
const WHOLESALE_COUNTER_KEY = 'sider_ws_seq_2026';

/**
 * Utility to normalize Bangladeshi phone numbers for secure comparison
 */
export function normalizeBdPhone(phone: string): string {
  if (!phone) return '';
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If starts with 880, strip 88
  if (digits.startsWith('880') && digits.length === 13) {
    return '0' + digits.slice(3);
  }
  return digits;
}

/**
 * Validates Bangladeshi Phone Number format (013-019, exactly 11 digits)
 * Rejects obviously invalid / fake patterns like 00000000000, 11111111111, 12345678901, etc.
 */
export function isValidBdPhone(phone: string): boolean {
  const norm = normalizeBdPhone(phone);
  if (!/^01[3-9]\d{8}$/.test(norm)) {
    return false;
  }

  // Reject numbers where all digits are the same or the last 8 digits are the same
  const last8 = norm.slice(3);
  if (/^(\d)\1{7}$/.test(last8)) {
    return false;
  }

  // Reject obvious trivial sequences like 01234567890 or 01987654321
  if (norm === '01234567890' || norm === '01987654321' || norm === '01000000000') {
    return false;
  }

  return true;
}

/**
 * Generates a strictly unique, incremental Order ID in format: SF-2026-000001
 */
export function generateUniqueOrderId(): string {
  const year = new Date().getFullYear();
  let currentSeq = 1;
  
  try {
    const saved = localStorage.getItem(ORDER_COUNTER_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        currentSeq = parsed + 1;
      }
    }
  } catch {
    currentSeq = Math.floor(1000 + Math.random() * 9000);
  }

  try {
    localStorage.setItem(ORDER_COUNTER_KEY, currentSeq.toString());
  } catch {
    // fallback
  }

  const paddedNumber = currentSeq.toString().padStart(6, '0');
  return `SF-${year}-${paddedNumber}`;
}

/**
 * Generates a strictly unique Wholesale Order ID: SF-WS-2026-000001
 */
export function generateUniqueWholesaleOrderId(): string {
  const year = new Date().getFullYear();
  let currentSeq = 1;
  
  try {
    const saved = localStorage.getItem(WHOLESALE_COUNTER_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        currentSeq = parsed + 1;
      }
    }
  } catch {
    currentSeq = Math.floor(100 + Math.random() * 900);
  }

  try {
    localStorage.setItem(WHOLESALE_COUNTER_KEY, currentSeq.toString());
  } catch {
    // fallback
  }

  const paddedNumber = currentSeq.toString().padStart(6, '0');
  return `SF-WS-${year}-${paddedNumber}`;
}

/**
 * Backend-ready Order Service Layer
 */
export class OrderService {
  /**
   * Retrieves all retail orders from persistent storage
   */
  static getStoredOrders(): OrderDetails[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read orders from storage', e);
    }
    return [];
  }

  static getAllOrders(): OrderDetails[] {
    return this.getStoredOrders();
  }

  /**
   * Retrieves all wholesale inquiries from persistent storage
   */
  static getStoredWholesaleOrders(): WholesaleInquiry[] {
    try {
      const data = localStorage.getItem(WHOLESALE_ORDERS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read wholesale orders from storage', e);
    }
    return [];
  }

  static getAllWholesaleInquiries(): WholesaleInquiry[] {
    return this.getStoredWholesaleOrders();
  }

  /**
   * Saves or updates the local orders repository (synchronous local replica + API sync ready)
   */
  static saveOrdersToStorage(orders: OrderDetails[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Keep up to latest 100 orders locally to prevent quota exhaustion
        const toSave = orders.length > 100 ? orders.slice(0, 100) : orders;
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(toSave));
      }
    } catch {
      // Safe fallback when storage is restricted
    }
  }

  static saveWholesaleOrdersToStorage(inquiries: WholesaleInquiry[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const toSave = inquiries.length > 100 ? inquiries.slice(0, 100) : inquiries;
        localStorage.setItem(WHOLESALE_ORDERS_KEY, JSON.stringify(toSave));
      }
    } catch {
      // Safe fallback when storage is restricted
    }
  }

  /**
   * Checks if a Transaction ID is already used in any existing retail or wholesale order
   */
  static isTransactionIdDuplicate(transactionId: string): boolean {
    if (!transactionId || !transactionId.trim()) return false;
    const cleanTrx = transactionId.trim().toUpperCase();

    const retailOrders = this.getStoredOrders();
    const isUsedInRetail = retailOrders.some(
      order => order.transactionId && order.transactionId.trim().toUpperCase() === cleanTrx
    );
    if (isUsedInRetail) return true;

    const wholesaleOrders = this.getStoredWholesaleOrders();
    const isUsedInWholesale = wholesaleOrders.some(
      inq => inq.transactionId && inq.transactionId.trim().toUpperCase() === cleanTrx
    );
    return isUsedInWholesale;
  }

  /**
   * Transforms CartItems into permanent OrderItemRecords
   */
  static createItemRecords(items: CartItem[]): OrderItemRecord[] {
    return items.map(item => {
      const unitPrice = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
      return {
        productId: item.product.id,
        productCode: item.product.code,
        productName: item.product.name,
        productNameBn: item.product.nameBn,
        category: item.product.category,
        selectedSize: item.selectedSize,
        selectedColor: {
          name: item.selectedColor.name,
          nameBn: item.selectedColor.nameBn,
          hex: item.selectedColor.hex
        },
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
        image: item.product.images?.[0] || '',
        isWholesale: !!item.isWholesale
      };
    });
  }

  /**
   * Processes and stores a new Retail Customer Order
   */
  static createRetailOrder(params: {
    customerName: string;
    phone: string;
    whatsappNumber?: string;
    district: string;
    area: string;
    fullAddress: string;
    deliveryZone: 'inside_dhaka' | 'outside_dhaka';
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
  }): { success: boolean; order?: OrderDetails; error?: string } {
    // 1. Customer validation
    const cleanName = params.customerName.trim();
    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter your full name (minimum 2 characters).' };
    }

    const cleanPhone = normalizeBdPhone(params.phone);
    if (!isValidBdPhone(cleanPhone)) {
      return { success: false, error: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712773063).' };
    }

    if (!params.area.trim()) {
      return { success: false, error: 'Please enter your Thana / Area.' };
    }

    if (!params.fullAddress.trim() || params.fullAddress.trim().length < 5) {
      return { success: false, error: 'Please provide a complete street/house delivery address.' };
    }

    if (!params.items || params.items.length === 0) {
      return { success: false, error: 'Your cart is empty. Please add items to proceed.' };
    }

    // 2. Calculate verified server-side total
    const itemRecords = this.createItemRecords(params.items);
    const calculatedSubtotal = itemRecords.reduce((sum, item) => sum + item.subtotal, 0);
    const verifiedDeliveryFee = DELIVERY_FEES[params.deliveryZone] ?? params.deliveryFee;
    const discount = Math.max(0, params.discount || 0);
    const calculatedTotal = Math.max(0, calculatedSubtotal + verifiedDeliveryFee - discount);
    const prepaidProductAmount = Math.max(0, calculatedSubtotal - discount);

    // 3. Validate Payment Method & Transaction ID Requirements
    let sanitizedTrxId: string | null = null;
    let sanitizedSenderLast4: string | null = null;
    let recordedPaidAmount = prepaidProductAmount;
    let initialPaymentStatus: PaymentStatus = 'Pending';

    if (params.paymentMethod === 'cod') {
      sanitizedTrxId = null;
      sanitizedSenderLast4 = null;
      initialPaymentStatus = 'Pending';
      recordedPaidAmount = 0;
    } else if (params.paymentMethod === 'bkash' || params.paymentMethod === 'nagad') {
      const methodLabel = params.paymentMethod === 'bkash' ? 'bKash' : 'Nagad';
      const rawTrx = (params.transactionId || '').trim();

      if (!rawTrx) {
        return { 
          success: false, 
          error: `Transaction ID is required for ${methodLabel} payment. Please complete payment and enter your TrxID.` 
        };
      }

      if (rawTrx.length < 6 || rawTrx.length > 10) {
        return {
          success: false,
          error: `Please enter a valid ${methodLabel} Transaction ID (6-10 characters).`
        };
      }

      // Check for duplicate Transaction ID
      if (this.isTransactionIdDuplicate(rawTrx)) {
        return {
          success: false,
          error: 'This Transaction ID has already been used. Please check your payment information.'
        };
      }

      sanitizedTrxId = rawTrx.toUpperCase();

      // Validate sender phone last 4 digits
      const rawLast4 = (params.senderLast4 || '').trim();
      if (!rawLast4 || !/^\d{4}$/.test(rawLast4)) {
        return {
          success: false,
          error: 'Please enter the exact last 4 digits of your payment sender mobile number.'
        };
      }
      sanitizedSenderLast4 = rawLast4;

      // Validate paid amount
      if (params.paidAmount !== undefined && params.paidAmount !== null) {
        if (params.paidAmount !== prepaidProductAmount) {
          return {
            success: false,
            error: `Paid amount must match the product total (৳${prepaidProductAmount}).`
          };
        }
        recordedPaidAmount = params.paidAmount;
      } else {
        recordedPaidAmount = calculatedTotal;
      }

      // Pre-paid orders are submitted as 'Verification Pending'
      initialPaymentStatus = 'Verification Pending';
    } else {
      return { success: false, error: 'Invalid payment method selected.' };
    }

    // 4. Suspicious Pattern Detection (High rapid order frequency)
    // NOTE: Does NOT reject legitimate customers. Simply flags for manual factory verification.
    const existingOrders = this.getStoredOrders();
    const recentFromSamePhone = existingOrders.filter(o => {
      if (normalizeBdPhone(o.phone) !== cleanPhone) return false;
      const orderTime = new Date(o.createdAt).getTime();
      const now = Date.now();
      return (now - orderTime) < (5 * 60 * 1000); // within last 5 minutes
    });

    const isSuspicious = recentFromSamePhone.length >= 4;

    // 5. Generate Unique Order ID
    const orderId = generateUniqueOrderId();
    const nowIso = new Date().toISOString();
    const activeUtm = AnalyticsTrackingService.getActiveAttribution();

    // Calculate estimated base manufacturing cost (using wholesale price or 55% base cost)
    const estimatedCost = itemRecords.reduce((sum, item) => {
      const p = item.productCode;
      const unitCost = item.isWholesale ? (item.unitPrice * 0.75) : (item.unitPrice * 0.55);
      return sum + (unitCost * item.quantity);
    }, 0);
    const estimatedProfit = Math.max(0, calculatedSubtotal - estimatedCost);

    const newOrder: OrderDetails = {
      orderId,
      createdAt: nowIso,
      customerName: cleanName,
      phone: cleanPhone,
      whatsappNumber: params.whatsappNumber?.trim() ? normalizeBdPhone(params.whatsappNumber) : cleanPhone,
      district: params.district.trim(),
      area: params.area.trim(),
      fullAddress: params.fullAddress.trim(),
      deliveryZone: params.deliveryZone,
      deliveryFee: verifiedDeliveryFee,
      subtotal: calculatedSubtotal,
      discount,
      couponCode: params.couponCode || undefined,
      total: calculatedTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: initialPaymentStatus,
      transactionId: sanitizedTrxId,
      senderLast4: sanitizedSenderLast4,
      paymentAmount: recordedPaidAmount,
      paymentTimestamp: params.paymentMethod === 'cod' ? null : nowIso,
      orderStatus: isSuspicious ? 'Pending' : 'Confirmed',
      customerNote: params.customerNote?.trim() || undefined,
      notes: params.customerNote?.trim() || undefined,
      items: params.items,
      itemRecords,
      orderType: 'retail',
      isVerificationRequired: isSuspicious,
      utmSource: activeUtm.utmSource,
      utmMedium: activeUtm.utmMedium,
      utmCampaign: activeUtm.utmCampaign,
      utmContent: activeUtm.utmContent,
      utmTerm: activeUtm.utmTerm,
      trafficSource: activeUtm.trafficSource || 'direct',
      productCost: Math.round(estimatedCost),
      estimatedProfit: Math.round(estimatedProfit)
    };

    // Track order event
    AnalyticsTrackingService.trackEvent('order_placed', {
      value: calculatedTotal,
      quantity: itemRecords.reduce((s, i) => s + i.quantity, 0)
    });

    // 6. Store permanently (newest order first)
    const updatedOrders = [newOrder, ...existingOrders];
    this.saveOrdersToStorage(updatedOrders);

    // Send to backend API
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder })
    }).catch(e => console.error('Failed to post order to backend', e));

    return { success: true, order: newOrder };
  }

  /**
   * Processes and stores a Wholesale Order Inquiry
   */
  static createWholesaleOrder(params: {
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
  }): { success: boolean; inquiry?: WholesaleInquiry; error?: string } {
    const cleanName = params.customerName.trim();
    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter your name or contact person name (minimum 2 characters).' };
    }

    const cleanPhone = normalizeBdPhone(params.phone);
    if (!isValidBdPhone(cleanPhone)) {
      return { success: false, error: 'Please enter a valid 11-digit Bangladeshi mobile number.' };
    }

    if (params.targetQuantity < 12) {
      return { success: false, error: 'Wholesale orders require a minimum of 12 pieces.' };
    }

    // Check duplicate transaction ID if provided for wholesale
    if (params.transactionId && params.transactionId.trim()) {
      if (this.isTransactionIdDuplicate(params.transactionId.trim())) {
        return {
          success: false,
          error: 'This Transaction ID has already been used. Please check your payment information.'
        };
      }
    }

    const wholesaleId = generateUniqueWholesaleOrderId();
    const nowIso = new Date().toISOString();

    let paymentStatus: PaymentStatus = 'Pending';
    let transactionId: string | null = null;
    let senderLast4: string | null = null;

    if (params.paymentMethod && params.paymentMethod !== 'cod' && params.transactionId) {
      transactionId = params.transactionId.trim().toUpperCase();
      senderLast4 = params.senderLast4?.trim() || null;
      paymentStatus = 'Verification Pending';
    }

    const newInquiry: WholesaleInquiry = {
      id: wholesaleId,
      createdAt: nowIso,
      customerName: cleanName,
      businessName: params.businessName.trim() || 'Retail Shop / Showroom',
      phone: cleanPhone,
      whatsappNumber: params.whatsappNumber ? normalizeBdPhone(params.whatsappNumber) : cleanPhone,
      productCode: params.productCode,
      productName: params.productName,
      targetQuantity: params.targetQuantity,
      sizeBreakdown: params.sizeBreakdown,
      targetColor: params.targetColor || 'Standard Assorted',
      district: params.district.trim(),
      area: params.area?.trim() || '',
      fullAddress: params.fullAddress?.trim() || '',
      appliedTierPrice: params.appliedTierPrice,
      totalEstimatedAmount: params.totalEstimatedAmount,
      additionalMessage: params.additionalMessage?.trim() || '',
      orderStatus: 'Pending',
      paymentMethod: params.paymentMethod || 'cod',
      paymentStatus,
      transactionId,
      senderLast4
    };

    try {
      const stored = this.getStoredWholesaleOrders();
      this.saveWholesaleOrdersToStorage([newInquiry, ...stored]);
    } catch {
      // Safe fallback
    }

    // Send to backend API
    fetch('/api/wholesale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiry: newInquiry })
    }).catch(e => console.error('Failed to post wholesale inquiry to backend', e));

    return { success: true, inquiry: newInquiry };
  }

  /**
   * Secure Order Lookup: Checks both Order ID and Phone Number
   * Returns all matching orders for a phone number or single order for Order ID.
   */
  static lookupOrders(orderIdQuery: string, phoneQuery: string): {
    found: boolean;
    orders: OrderDetails[];
    message?: string;
  } {
    const cleanId = orderIdQuery.trim().toUpperCase();
    const cleanPhone = normalizeBdPhone(phoneQuery.trim());

    if (!cleanId && !cleanPhone) {
      return {
        found: false,
        orders: [],
        message: 'Please enter your Order ID (e.g. SF-2026-000001) or 11-digit mobile number.'
      };
    }

    const allOrders = this.getStoredOrders();

    const matches = allOrders.filter(order => {
      const orderIdMatch = cleanId ? order.orderId.toUpperCase() === cleanId : false;
      const phoneMatch = cleanPhone ? normalizeBdPhone(order.phone) === cleanPhone || normalizeBdPhone(order.whatsappNumber) === cleanPhone : false;

      if (cleanId && cleanPhone) {
        return orderIdMatch && phoneMatch;
      } else if (cleanId) {
        return orderIdMatch;
      } else if (cleanPhone) {
        return phoneMatch;
      }
      return false;
    });

    if (matches.length > 0) {
      return { found: true, orders: matches };
    }

    return {
      found: false,
      orders: [],
      message: cleanId && cleanPhone 
        ? `No order found matching Order ID "${cleanId}" with phone "${phoneQuery}". Please verify your details.`
        : cleanId 
          ? `No order found with Order ID "${cleanId}". Please check your order confirmation slip.`
          : `No order found registered under mobile number "${phoneQuery}".`
    };
  }

  /**
   * Single order lookup helper (for backwards compatibility)
   */
  static lookupOrder(orderIdQuery: string, phoneQuery: string): {
    found: boolean;
    order?: OrderDetails;
    message?: string;
  } {
    const res = this.lookupOrders(orderIdQuery, phoneQuery);
    if (res.found && res.orders.length > 0) {
      return { found: true, order: res.orders[0] };
    }
    return { found: false, message: res.message };
  }

  /**
   * Updates Order Status (for Admin Panel / Backend synchronization)
   */
  static updateOrderStatus(orderId: string, newStatus: OrderStatus, adminName?: string, notes?: string): boolean {
    const orders = this.getStoredOrders();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index === -1) return false;

    orders[index].orderStatus = newStatus;
    if (notes) {
      orders[index].notes = notes;
    }
    this.saveOrdersToStorage(orders);

    // Call backend API
    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orders[index], adminName: adminName || 'Admin' })
    }).catch(e => console.error('Failed to update order status on server', e));

    return true;
  }

  /**
   * Updates Payment Verification Status (for Admin Panel verification)
   */
  static updatePaymentStatus(orderId: string, newPaymentStatus: PaymentStatus, adminName?: string, notes?: string): boolean {
    const orders = this.getStoredOrders();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index === -1) return false;

    orders[index].paymentStatus = newPaymentStatus;
    if (notes) {
      orders[index].notes = notes;
    }
    this.saveOrdersToStorage(orders);

    // Call backend API
    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orders[index], adminName: adminName || 'Admin' })
    }).catch(e => console.error('Failed to update order payment status on server', e));

    return true;
  }

  /**
   * Updates Wholesale Order Inquiry Status
   */
  static updateWholesaleStatus(inquiryId: string, newStatus: OrderStatus, adminName?: string): boolean {
    const wholesaleOrders = this.getStoredWholesaleOrders();
    const index = wholesaleOrders.findIndex(w => w.id === inquiryId);
    if (index === -1) return false;

    wholesaleOrders[index].orderStatus = newStatus;
    this.saveWholesaleOrdersToStorage(wholesaleOrders);

    // Call backend API
    fetch(`/api/wholesale/${encodeURIComponent(inquiryId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiry: wholesaleOrders[index], adminName: adminName || 'Admin' })
    }).catch(e => console.error('Failed to update wholesale status on server', e));

    return true;
  }

  /**
   * Updates Wholesale Payment Status
   */
  static updateWholesalePaymentStatus(inquiryId: string, newPaymentStatus: PaymentStatus, adminName?: string): boolean {
    const wholesaleOrders = this.getStoredWholesaleOrders();
    const index = wholesaleOrders.findIndex(w => w.id === inquiryId);
    if (index === -1) return false;

    wholesaleOrders[index].paymentStatus = newPaymentStatus;
    this.saveWholesaleOrdersToStorage(wholesaleOrders);

    // Call backend API
    fetch(`/api/wholesale/${encodeURIComponent(inquiryId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiry: wholesaleOrders[index], adminName: adminName || 'Admin' })
    }).catch(e => console.error('Failed to update wholesale payment status on server', e));

    return true;
  }

  /**
   * Deletes a retail order
   */
  static deleteOrder(orderId: string, adminName?: string): boolean {
    const orders = this.getStoredOrders();
    const filtered = orders.filter(o => o.orderId !== orderId);
    if (filtered.length === orders.length) return false;
    this.saveOrdersToStorage(filtered);

    // Call backend API
    fetch(`/api/orders/${encodeURIComponent(orderId)}?adminName=${encodeURIComponent(adminName || 'Admin')}`, {
      method: 'DELETE'
    }).catch(e => console.error('Failed to delete order on server', e));

    return true;
  }

  /**
   * Deletes a wholesale inquiry
   */
  static deleteWholesaleInquiry(inquiryId: string, adminName?: string): boolean {
    const wholesaleOrders = this.getStoredWholesaleOrders();
    const filtered = wholesaleOrders.filter(w => w.id !== inquiryId);
    if (filtered.length === wholesaleOrders.length) return false;
    this.saveWholesaleOrdersToStorage(filtered);

    // Call backend API
    fetch(`/api/wholesale/${encodeURIComponent(inquiryId)}?adminName=${encodeURIComponent(adminName || 'Admin')}`, {
      method: 'DELETE'
    }).catch(e => console.error('Failed to delete wholesale inquiry on server', e));

    return true;
  }
}
