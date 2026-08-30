import React from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Truck, 
  X, 
  ShoppingBag,
  ShieldCheck,
  Phone,
  Clock,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';
import { NotificationService } from '../services/notificationService';

export const OrderSuccessModal: React.FC = () => {
  const { 
    isOrderSuccessOpen, 
    setIsOrderSuccessOpen, 
    latestPlacedOrder, 
    openWhatsAppChat,
    setIsTrackingOpen,
    setCurrentView
  } = useCart();

  if (!isOrderSuccessOpen || !latestPlacedOrder) return null;

  const handleWhatsAppConfirm = () => {
    const formattedSlip = NotificationService.formatWhatsAppOrderSlip(latestPlacedOrder);
    openWhatsAppChat(formattedSlip);
  };

  const handleTrack = () => {
    setIsOrderSuccessOpen(false);
    setIsTrackingOpen(true);
  };

  const handleDone = () => {
    setIsOrderSuccessOpen(false);
    setCurrentView('retail');
  };

  const isPrepaid = latestPlacedOrder.paymentMethod === 'bkash' || latestPlacedOrder.paymentMethod === 'nagad';

  return (
    <div id="order-success-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        id="order-success-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-order-success-btn"
          onClick={() => setIsOrderSuccessOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-sm">
              Order Confirmed (অর্ডার সফলভাবে জমা হয়েছে)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Thank You, {latestPlacedOrder.customerName}!
            </h2>
            <p className="text-xs text-zinc-400 font-bangla">
              আপনার অর্ডারটি আমাদের ডাটাবেজে রেকর্ড করা হয়েছে। সাভার কারখানা থেকে দ্রুত পার্সেল প্রস্তুত করা হবে।
            </p>
          </div>
        </div>

        {/* Receipt Details Box */}
        <div className="mt-5 bg-zinc-900 p-4 sm:p-5 rounded-xl border border-zinc-800 space-y-3 text-xs">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <span className="text-zinc-400 font-medium">Order ID (অর্ডার নম্বর):</span>
            <span className="font-mono font-black text-amber-300 text-sm bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-800">
              {latestPlacedOrder.orderId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
            <div>
              <span className="text-zinc-500 block text-[10px]">Customer Phone:</span>
              <span className="font-semibold text-white font-mono">{latestPlacedOrder.phone}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">Delivery Area &amp; Zone:</span>
              <span className="font-semibold text-white">
                {latestPlacedOrder.area}, {latestPlacedOrder.district} ({latestPlacedOrder.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
              </span>
            </div>
          </div>

          {/* Payment Method & Status Display */}
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-medium">Payment Method:</span>
              <span className="font-bold uppercase text-white">
                {latestPlacedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : latestPlacedOrder.paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-medium">Payment Status:</span>
              {latestPlacedOrder.paymentMethod === 'cod' ? (
                <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800 text-[11px]">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>COD / Pending (Pay on Delivery)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800 text-[11px]">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>Verification Pending (যাচাই প্রক্রিয়াধীন)</span>
                </span>
              )}
            </div>

            {isPrepaid && (
              <div className="space-y-1.5 pt-1.5 border-t border-zinc-800 text-[11px]">
                {latestPlacedOrder.senderLast4 && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">Sender Number (Last 4):</span>
                    <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      •••• •••• {latestPlacedOrder.senderLast4}
                    </span>
                  </div>
                )}

                {latestPlacedOrder.transactionId && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">Submitted TrxID:</span>
                    <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded uppercase border border-zinc-800">
                      {latestPlacedOrder.transactionId}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Submitted Paid Amount:</span>
                  <span className="font-mono font-bold text-amber-400">
                    ৳{latestPlacedOrder.paymentAmount || latestPlacedOrder.total}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Prepaid Verification Notice */}
          {isPrepaid && (
            <div className="p-3 bg-sky-950/50 border border-sky-800 rounded-lg text-[11px] text-sky-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong>Payment Notice:</strong> Your prepaid payment is pending verification. Sider Fashion factory staff will verify this transaction before packing and dispatch.
              </div>
            </div>
          )}

          {/* Itemized Table */}
          <div className="border-t border-zinc-800 pt-2.5 space-y-2">
            <div className="font-semibold text-zinc-300 flex justify-between">
              <span>Items Ordered ({latestPlacedOrder.items.reduce((t, i) => t + i.quantity, 0)})</span>
              <span>Subtotal</span>
            </div>

            {latestPlacedOrder.items.map((item, idx) => {
              const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
              return (
                <div key={idx} className="flex justify-between text-zinc-400 pl-1 text-[11px]">
                  <span>
                    • {item.product.name} [{item.product.code}] ({item.selectedSize}, {item.selectedColor.name}) × {item.quantity}
                  </span>
                  <span className="font-mono font-bold text-zinc-200">৳{price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          {/* Calculations */}
          <div className="border-t border-zinc-800 pt-2 space-y-1 text-[11px]">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-white">৳{latestPlacedOrder.subtotal}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Delivery Fee ({latestPlacedOrder.deliveryZone === 'inside_dhaka' ? 'Dhaka ৳70' : 'Outside ৳120'}):</span>
              <span className="font-mono font-bold text-white">+৳{latestPlacedOrder.deliveryFee}</span>
            </div>
            {latestPlacedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Coupon Discount ({latestPlacedOrder.couponCode || 'Promo'}):</span>
                <span className="font-mono">-৳{latestPlacedOrder.discount}</span>
              </div>
            )}
            <div className="border-t border-zinc-700 pt-1.5 flex justify-between text-sm font-extrabold text-white">
              <span>Total Payable Amount:</span>
              <span className="text-base text-amber-400 font-sans font-black">৳{latestPlacedOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Return reminder */}
        <div className="mt-3 p-2.5 bg-amber-950/40 border border-amber-900/60 rounded-lg text-[11px] text-amber-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="font-bangla">
            মনে রাখবেন: ডেলিভারিম্যানের সামনে পার্সেল চেক করে রিসিভ করার সুযোগ রয়েছে। প্রয়োজনে ৭ দিনের মধ্যে এক্সচেঞ্জ সুবিধা পাবেন।
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2.5">
          <button
            id="order-success-whatsapp-btn"
            onClick={handleWhatsAppConfirm}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Order Copy to Sider WhatsApp (অর্ডার স্লিপ পাঠান)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTrack}
              className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold py-2.5 px-3 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Order Status</span>
            </button>

            <button
              onClick={handleDone}
              className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-3 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-zinc-400">
            Factory Hotline: <a href="tel:01712773063" className="font-bold text-amber-400 hover:underline">01712773063</a> / <a href="tel:01612241112" className="font-bold text-amber-400 hover:underline">01612241112</a>
          </div>
        </div>

      </div>
    </div>
  );
};
