import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  AlertCircle,
  Factory,
  ShieldCheck,
  RotateCcw,
  Ban,
  MessageSquare
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderService } from '../services/orderService';
import { OrderDetails, OrderStatus, PaymentStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingOpen, setIsTrackingOpen, openWhatsAppChat } = useCart();
  const [orderIdQuery, setOrderIdQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [matchingOrders, setMatchingOrders] = useState<OrderDetails[]>([]);
  const [searchedOrder, setSearchedOrder] = useState<OrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSearchedOrder(null);
    setMatchingOrders([]);
    setHasSearched(true);

    const result = OrderService.lookupOrders(orderIdQuery, phoneQuery);
    if (result.found && result.orders.length > 0) {
      setMatchingOrders(result.orders);
      setSearchedOrder(result.orders[0]);
    } else {
      setErrorMessage(result.message || 'No order found with the provided details.');
    }
  };

  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const currentStep = searchedOrder ? getStatusStepIndex(searchedOrder.orderStatus) : 0;

  const timelineSteps = [
    { label: 'Order Received', labelBn: 'অর্ডার গ্রহণ', desc: 'Order logged in factory system', icon: Clock },
    { label: 'Confirmed', labelBn: 'অর্ডার নিশ্চিত', desc: 'Order verified and queued', icon: CheckCircle2 },
    { label: 'Factory Processing', labelBn: 'সাভার কারখানায় প্রসেসিং', desc: 'Garment QC & Packing', icon: Factory },
    { label: 'Shipped / In Transit', labelBn: 'কুরিয়ারে হস্তান্তর', desc: 'Steadfast / Sundarban courier transit', icon: Package },
    { label: 'Delivered', labelBn: 'ডেলিভারি সম্পন্ন', desc: 'Received and inspected by customer', icon: Truck },
  ];

  return (
    <div id="tracking-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        id="tracking-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-800 max-h-[92vh] overflow-y-auto text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-tracking-modal-btn"
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
          <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/80">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Track Sider Fashion Order (অর্ডার ট্র্যাকিং)
            </h3>
            <p className="text-xs text-zinc-400 font-bangla">
              আপনার Order ID (যেমন: SF-2026-000001) অথবা মোবাইল নম্বর দিয়ে পার্সেল ট্র্যাক করুন
            </p>
          </div>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Order ID (অর্ডার আইডি)
              </label>
              <input
                id="tracking-orderid-input"
                type="text"
                value={orderIdQuery}
                onChange={(e) => setOrderIdQuery(e.target.value)}
                placeholder="e.g. SF-2026-000001"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Phone Number (মোবাইল নম্বর)
              </label>
              <input
                id="tracking-phone-input"
                type="tel"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <button
            id="tracking-submit-btn"
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-pointer shadow-md transition-all active:scale-98"
          >
            <Search className="w-4 h-4" />
            <span>Search &amp; Track Order (অর্ডার খুঁজুন)</span>
          </button>
        </form>

        {/* Error / Not found message */}
        {hasSearched && errorMessage && (
          <div className="mt-4 p-4 bg-amber-950/40 border border-amber-900/60 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">{errorMessage}</div>
              <p className="text-[11px] text-zinc-400">
                Please double check your Order ID and registered mobile number, or call our factory hotline: <strong className="text-amber-400">01712773063</strong>
              </p>
            </div>
          </div>
        )}

        {/* Order Found Details */}
        {hasSearched && searchedOrder && (
          <div className="mt-5 space-y-4 animate-in fade-in duration-300">
            
            {/* Multiple Orders Selector Tabs */}
            {matchingOrders.length > 1 && (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Found {matchingOrders.length} orders for this customer:</span>
                  <span className="text-[11px] font-normal text-zinc-400">Select an order to view</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchingOrders.map((ord) => (
                    <button
                      key={ord.orderId}
                      type="button"
                      onClick={() => setSearchedOrder(ord)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        searchedOrder.orderId === ord.orderId
                          ? 'bg-amber-500 text-black shadow-xs'
                          : 'bg-zinc-950 border border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {ord.orderId} ({ord.orderStatus})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Top summary card */}
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                <div>
                  <span className="text-xs text-zinc-400">Order ID:</span>
                  <span className="font-mono font-black text-amber-300 ml-1.5 text-sm bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    {searchedOrder.orderId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                    Order Status: {searchedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Customer & Payment details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                <div>
                  <div className="text-zinc-500 text-[10px]">Customer:</div>
                  <div className="font-bold text-white">{searchedOrder.customerName} ({searchedOrder.phone})</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">{searchedOrder.fullAddress}, {searchedOrder.area}, {searchedOrder.district}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment Method:</span>
                    <span className="font-bold uppercase text-white">{searchedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment Status:</span>
                    <span className={`font-bold ${searchedOrder.paymentStatus === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {searchedOrder.paymentStatus}
                    </span>
                  </div>
                  {searchedOrder.transactionId && (
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">TrxID:</span>
                      <span className="font-mono font-bold text-zinc-200">{searchedOrder.transactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-zinc-800 pt-1 font-bold">
                    <span>Total Amount:</span>
                    <span className="text-amber-400 font-sans">৳{searchedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special status banners (Cancelled / Returned / Exchanged) */}
            {searchedOrder.orderStatus === 'Cancelled' && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400" />
                <span>This order was cancelled. Please contact support if you have questions.</span>
              </div>
            )}

            {searchedOrder.orderStatus === 'Returned' && (
              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-300 text-xs flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-zinc-400" />
                <span>This order was marked as returned.</span>
              </div>
            )}

            {/* Timeline for Active Orders */}
            {searchedOrder.orderStatus !== 'Cancelled' && (
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Dispatch Timeline (ডেলিভারি ট্র্যাকিং ধাপসমূহ)
                </h4>

                <div className="space-y-3">
                  {timelineSteps.map((step, idx) => {
                    const Icon = step.icon;
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="flex items-start gap-3 relative">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          isCurrent
                            ? 'bg-amber-500 text-black ring-4 ring-amber-500/20'
                            : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 pb-1">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-xs font-bold ${isCurrent ? 'text-amber-400' : isPassed ? 'text-white' : 'text-zinc-500'}`}>
                              {step.label}
                            </h5>
                            <span className="text-[10px] text-zinc-500 font-bangla">{step.labelBn}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Itemized list */}
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs space-y-1.5">
              <div className="font-bold text-zinc-200 mb-1">Ordered Items ({searchedOrder.items.length}):</div>
              {searchedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-zinc-400 text-[11px]">
                  <span>• {item.product.name} [{item.product.code}] ({item.selectedSize}, {item.selectedColor.name}) × {item.quantity}</span>
                  <span className="font-mono font-bold text-zinc-200">৳{(item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice) * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Help Callout */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
              <span>Need dispatch updates or address modification?</span>
              <button
                onClick={() => openWhatsAppChat(`Hello Sider Fashion! I am checking status and dispatch for Order ID: ${searchedOrder.orderId}.`)}
                className="flex items-center gap-1 text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
