import { OrderDetails, OrderStatus, PaymentStatus } from '../types';

export type NotificationEvent =
  | 'ORDER_CREATED'
  | 'PAYMENT_SUBMITTED_FOR_VERIFICATION'
  | 'ORDER_CONFIRMED'
  | 'ORDER_PROCESSING'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'WHOLESALE_INQUIRY_CREATED';

export interface NotificationPayload {
  event: NotificationEvent;
  orderId: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId?: string | null;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface NotificationProvider {
  sendSMS?: (phone: string, text: string) => Promise<boolean>;
  sendEmail?: (email: string, subject: string, body: string) => Promise<boolean>;
  sendWhatsAppNotification?: (phone: string, template: string) => Promise<boolean>;
}

/**
 * Clean Notification Architecture Dispatcher
 * Allows plug-and-play integration with SMS Gateways (Greenweb, BulkSMS BD)
 * and Email services when real credentials are provided.
 */
export class NotificationService {
  private static provider: NotificationProvider | null = null;

  /**
   * Registers a production SMS / Email / WhatsApp provider
   */
  static registerProvider(provider: NotificationProvider): void {
    this.provider = provider;
  }

  /**
   * Dispatches order event notifications
   */
  static async notifyOrderEvent(payload: NotificationPayload): Promise<{ success: boolean; dispatched: boolean }> {
    // Log structured event for backend/telemetry
    console.info(`[NotificationService] Event: ${payload.event} for Order ${payload.orderId}`, {
      orderId: payload.orderId,
      customer: payload.customerName,
      phone: payload.phone,
      amount: payload.totalAmount,
      method: payload.paymentMethod,
      paymentStatus: payload.paymentStatus,
      transactionId: payload.transactionId,
      timestamp: payload.timestamp
    });

    if (this.provider) {
      // Future real API integration point
      try {
        if (this.provider.sendSMS) {
          const smsText = `Sider Fashion: Your order ${payload.orderId} of BDT ${payload.totalAmount} has been placed. Status: ${payload.orderStatus}. Helpline: 01712773063`;
          await this.provider.sendSMS(payload.phone, smsText);
        }
        return { success: true, dispatched: true };
      } catch (err) {
        console.error('[NotificationService] Failed to send external notification', err);
        return { success: false, dispatched: false };
      }
    }

    // Default: Clean decoupled architecture ready for backend hookup
    return { success: true, dispatched: false };
  }

  /**
   * Formats a customer-ready WhatsApp Order confirmation message
   */
  static formatWhatsAppOrderSlip(order: OrderDetails): string {
    const itemsFormatted = (order.itemRecords || order.items.map(i => ({
      productName: i.product.name,
      productCode: i.product.code,
      selectedSize: i.selectedSize,
      selectedColor: { name: i.selectedColor.name },
      quantity: i.quantity,
      subtotal: (i.isWholesale ? i.product.wholesalePrice : i.product.retailPrice) * i.quantity
    }))).map(item => `• ${item.productName} [${item.productCode}] | Size: ${item.selectedSize} | Color: ${item.selectedColor.name} | Qty: ${item.quantity} (৳${item.subtotal})`).join('\n');

    let paymentInfo = `• *Payment Method:* ${order.paymentMethod.toUpperCase()}\n• *Payment Status:* ${order.paymentStatus}`;
    if (order.transactionId) {
      paymentInfo += `\n• *Transaction ID (TrxID):* ${order.transactionId}`;
    }

    return (
      `*SIDER FASHION OFFICIAL ORDER SLIP*\n` +
      `---------------------------------------\n` +
      `• *Order ID:* ${order.orderId}\n` +
      `• *Date:* ${new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}\n` +
      `• *Customer Name:* ${order.customerName}\n` +
      `• *Phone:* ${order.phone}\n` +
      (order.whatsappNumber && order.whatsappNumber !== order.phone ? `• *WhatsApp:* ${order.whatsappNumber}\n` : '') +
      `• *Delivery Address:* ${order.fullAddress}, ${order.area}, ${order.district}\n` +
      `• *Zone:* ${order.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳120)'}\n\n` +
      `${paymentInfo}\n\n` +
      `*Ordered Items:*\n` +
      `${itemsFormatted}\n\n` +
      `---------------------------------------\n` +
      `• *Subtotal:* ৳${order.subtotal}\n` +
      `• *Delivery Fee:* ৳${order.deliveryFee}\n` +
      (order.discount > 0 ? `• *Discount (${order.couponCode || 'Coupon'}):* -৳${order.discount}\n` : '') +
      `• *Total Payable:* ৳${order.total}\n` +
      `---------------------------------------\n` +
      (order.customerNote ? `• *Customer Note:* ${order.customerNote}\n\n` : '\n') +
      `*Factory Hotline:* 01712773063 / 01612241112\n` +
      `Ashulia, Savar, Dhaka, Bangladesh.`
    );
  }
}
