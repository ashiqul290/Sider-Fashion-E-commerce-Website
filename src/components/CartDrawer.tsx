import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Check, 
  Percent,
  Factory
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DELIVERY_FEES } from '../data/bangladeshDistricts';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    deliveryZone, 
    setDeliveryZone, 
    deliveryFee, 
    couponCode, 
    discountAmount, 
    applyCoupon, 
    removeCoupon, 
    cartTotal,
    setIsCheckoutOpen,
    setIsReturnPolicyModalOpen,
    setCurrentView
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg({ text: res.message, success: res.success });
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    setCurrentView('retail');
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-zinc-950 h-full shadow-2xl flex flex-col justify-between border-l border-zinc-800 animate-in slide-in-from-right duration-300 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Your Cart is Empty</h3>
              <p className="text-xs text-zinc-400 font-bangla max-w-xs mx-auto">
                আপনার পছন্দের শার্ট অথবা কতুয়া ব্যাগে যোগ করুন এবং সরাসরি নিজস্ব কারখানা থেকে সংগ্রহ করুন।
              </p>
              <button
                id="cart-empty-browse-btn"
                onClick={handleContinueShopping}
                className="inline-flex items-center gap-2 bg-amber-500 text-black text-xs font-bold py-2.5 px-5 rounded-lg hover:bg-amber-400 cursor-pointer shadow-xs"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="space-y-3">
                {cart.map((item, idx) => {
                  const unitPrice = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
                  return (
                    <div 
                      key={`${item.product.id}-${item.selectedColor.hex}-${item.selectedSize}-${idx}`}
                      className="flex gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                        <img 
                          src={item.selectedColor.image || item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedColor.hex, item.selectedSize)}
                              className="text-zinc-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span className="flex items-center gap-1 font-mono text-zinc-300">
                              <span className="w-2.5 h-2.5 rounded-full border border-zinc-700" style={{ backgroundColor: item.selectedColor.hex }} />
                              {item.selectedColor.name}
                            </span>
                            <span>•</span>
                            <span className="bg-zinc-800 text-zinc-200 font-bold px-1.5 py-0.2 rounded text-[10px] border border-zinc-700">
                              Size: {item.selectedSize}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-amber-400">
                            {item.product.code}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-zinc-700 rounded-md bg-zinc-950 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedColor.hex, item.selectedSize, item.quantity - 1)}
                              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedColor.hex, item.selectedSize, item.quantity + 1)}
                              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-amber-400 font-sans">
                              ৳{unitPrice * item.quantity}
                            </div>
                            <span className="text-[10px] text-zinc-500">
                              (৳{unitPrice}/pc)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Zone Selector in Cart */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Delivery Location</span>
                  </span>
                  <span className="text-amber-400 font-mono font-bold">
                    +৳{DELIVERY_FEES[deliveryZone]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryZone('inside_dhaka')}
                    className={`p-2 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-amber-500 bg-zinc-950 text-white shadow-xs ring-1 ring-amber-500'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-zinc-200 font-bold">Inside Dhaka</div>
                    <div className="text-[11px] font-bold text-amber-400">৳70 (24-48h)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryZone('outside_dhaka')}
                    className={`p-2 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-amber-500 bg-zinc-950 text-white shadow-xs ring-1 ring-amber-500'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-zinc-200 font-bold">Outside Dhaka</div>
                    <div className="text-[11px] font-bold text-amber-400">৳120 (48-72h)</div>
                  </button>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-1.5">
                {!couponCode ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Coupon code (e.g. SIDER10)"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 p-2.5 rounded-lg text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5" />
                      <span>Code: <strong>{couponCode}</strong> (-৳{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-red-400 text-[11px] font-bold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponMsg && !couponCode && (
                  <p className={`text-[11px] ${couponMsg.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Check on delivery note */}
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="font-bangla text-zinc-300">
                  ডেলিভারিম্যানের সামনে পোশাক চেক করে রিসিভ করতে পারবেন। পছন্দ না হলে রিটার্ন/এক্সচেঞ্জ সুবিধা।
                  <button
                    onClick={() => setIsReturnPolicyModalOpen(true)}
                    className="underline font-bold ml-1 text-amber-400"
                  >
                    পলিসি দেখুন
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900 space-y-3">
            {/* Calculation Breakdown as requested */}
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Product Subtotal:</span>
                <span className="font-semibold text-white font-sans">৳{cartSubtotal}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                <span className="font-semibold text-white font-sans">+৳{deliveryFee}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-৳{discountAmount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-base font-extrabold text-white">
                <span>Total Amount:</span>
                <span className="text-xl text-amber-400 font-sans">৳{cartTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout (অর্ডার সম্পন্ন করুন)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
