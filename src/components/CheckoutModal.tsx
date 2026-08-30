import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshDistricts';
import { PAYMENT_ACCOUNTS_CONFIG } from '../data/paymentAccounts';
import { PaymentMethod } from '../types';
import { isValidBdPhone } from '../services/orderService';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cartSubtotal, 
    deliveryZone, 
    setDeliveryZone, 
    deliveryFee, 
    discountAmount, 
    couponCode, 
    cartTotal,
    createOrder,
    openLegalModal
  } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka City (North / South)');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [senderLast4, setSenderLast4] = useState('');
  const [paidAmountInput, setPaidAmountInput] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const prepaidProductAmount = Math.max(0, cartSubtotal - discountAmount);

  // Prepaid bKash/Nagad payments collect the product amount only.
  useEffect(() => {
    setPaidAmountInput(prepaidProductAmount.toString());
  }, [prepaidProductAmount]);

  // Reset form submission state and error message when checkout modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setIsSubmitting(false);
      setErrorMessage(null);
    }
  }, [isCheckoutOpen]);

  // Auto detect delivery zone when district changes
  useEffect(() => {
    const found = BANGLADESH_DISTRICTS.find(d => d.name === selectedDistrict);
    if (found) {
      setDeliveryZone(found.zone);
    }
  }, [selectedDistrict, setDeliveryZone]);

  // Reset error when inputs change
  useEffect(() => {
    setErrorMessage(null);
  }, [fullName, phone, fullAddress, area, paymentMethod, transactionId, senderLast4]);

  if (!isCheckoutOpen) return null;

  const transactionIdLengthError =
    (paymentMethod === 'bkash' || paymentMethod === 'nagad') && transactionId.trim().length > 10
      ? 'Transaction ID cannot be more than 10 characters.'
      : null;

  const handleCopyAccount = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Customer Details Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!isValidBdPhone(phone)) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi phone number (e.g., 01712773063).');
      return;
    }

    if (!area.trim()) {
      setErrorMessage('Please enter your Thana / Area (থানা / এলাকা).');
      return;
    }

    if (!fullAddress.trim() || fullAddress.trim().length < 5) {
      setErrorMessage('Please provide your complete delivery street/house address (সম্পূর্ণ ঠিকানা).');
      return;
    }

    // 2. Payment Method specific validation
    let parsedPaidAmount = prepaidProductAmount;
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      const methodTitle = paymentMethod === 'bkash' ? 'bKash' : 'Nagad';
      const cleanTrx = transactionId.trim();
      if (!cleanTrx) {
        setErrorMessage(`Please enter your ${methodTitle} Transaction ID to confirm your payment.`);
        return;
      }
      if (cleanTrx.length < 6 || cleanTrx.length > 10) {
        setErrorMessage(`Please enter a valid ${methodTitle} Transaction ID (6-10 characters).`);
        return;
      }

      const cleanLast4 = senderLast4.trim();
      if (!cleanLast4 || !/^\d{4}$/.test(cleanLast4)) {
        setErrorMessage('Please enter the exact last 4 digits of your payment sender phone number (e.g. 1234).');
        return;
      }

      const parsed = parseFloat(paidAmountInput);
      if (isNaN(parsed) || parsed !== prepaidProductAmount) {
        setErrorMessage(`Paid amount must match the product total (৳${prepaidProductAmount}).`);
        return;
      }
      parsedPaidAmount = parsed;
    }

    if (!policyAccepted) {
      setErrorMessage('You must accept the Return & Exchange policy to place an order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = createOrder({
        customerName: fullName.trim(),
        phone: phone.trim(),
        whatsappNumber: whatsappNumber.trim() || phone.trim(),
        district: selectedDistrict,
        area: area.trim(),
        fullAddress: fullAddress.trim(),
        deliveryZone,
        deliveryFee,
        paymentMethod,
        transactionId: (paymentMethod === 'bkash' || paymentMethod === 'nagad') ? transactionId.trim() : null,
        senderLast4: (paymentMethod === 'bkash' || paymentMethod === 'nagad') ? senderLast4.trim() : null,
        paidAmount: (paymentMethod === 'bkash' || paymentMethod === 'nagad') ? parsedPaidAmount : undefined,
        items: [...cart],
        subtotal: cartSubtotal,
        discount: discountAmount,
        couponCode: couponCode || undefined,
        total: cartTotal,
        customerNote: orderNotes.trim() || undefined
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      } else {
        // Order successfully placed! Reset form state so next order is ready
        setIsSubmitting(false);
        setTransactionId('');
        setSenderLast4('');
        setOrderNotes('');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred while placing your order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        id="checkout-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500 text-black">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Secure Checkout &amp; Order Placement
              </h2>
              <p className="text-xs text-zinc-400 font-bangla">
                অর্ডার নিশ্চিত করতে আপনার সঠিক ডেলিভারি ঠিকানা ও তথ্য প্রদান করুন
              </p>
            </div>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="m-4 sm:m-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Customer Details & Address */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Personal Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center">1</span>
                  <span>Customer Contact Details</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Full Name (আপনার নাম) *
                  </label>
                  <input
                    id="checkout-name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abir Hossain"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Phone Number (মোবাইল নম্বর) *
                    </label>
                    <input
                      id="checkout-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX (11 digits)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      WhatsApp Number (অপশনাল)
                    </label>
                    <input
                      id="checkout-whatsapp-input"
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center">2</span>
                  <span>Delivery Address in Bangladesh</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      District (জেলা) *
                    </label>
                    <select
                      id="checkout-district-select"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {BANGLADESH_DISTRICTS.map((d, i) => (
                        <option key={i} value={d.name} className="bg-zinc-900 text-white">
                          {d.name} ({d.nameBn}) — {d.zone === 'inside_dhaka' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳120)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Thana / Area (থানা / এলাকা) *
                    </label>
                    <input
                      id="checkout-area-input"
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Dhanmondi / Mirpur / Savar"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Full Street Address (বাড়ি, রোড, ফ্লাট বা এলাকা বিবরণ) *
                  </label>
                  <textarea
                    id="checkout-address-input"
                    required
                    rows={2}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="House no, Road no, Village / Sector, Landmark..."
                    className="w-full px-3.5 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Special Delivery Instructions (অপশনাল)
                  </label>
                  <input
                    id="checkout-notes-input"
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Deliver after 3 PM / Call before coming"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center">3</span>
                  <span>Payment Method (পেমেন্ট পদ্ধতি)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-amber-500 bg-amber-950/40 shadow-xs ring-1 ring-amber-500'
                        : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Banknote className="w-5 h-5 text-emerald-400" />
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-amber-500"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-white">Cash on Delivery</div>
                      <div className="text-[11px] text-zinc-300 font-bangla">ক্যাশ অন ডেলিভারি</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Pay after receiving parcel</div>
                    </div>
                  </div>

                  {/* bKash */}
                  <div
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-950/40 shadow-xs ring-1 ring-pink-500'
                        : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Smartphone className="w-5 h-5 text-pink-400" />
                      <input
                        type="radio"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="text-pink-500"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-white">bKash (বিকাশ)</div>
                      <div className="text-[11px] text-zinc-300 font-bangla">অগ্রিম বিকাশ পেমেন্ট</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">TrxID Verification</div>
                    </div>
                  </div>

                  {/* Nagad */}
                  <div
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-950/40 shadow-xs ring-1 ring-orange-500'
                        : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Smartphone className="w-5 h-5 text-orange-400" />
                      <input
                        type="radio"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="text-orange-500"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-white">Nagad (নগদ)</div>
                      <div className="text-[11px] text-zinc-300 font-bangla">অগ্রিম নগদ পেমেন্ট</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">TrxID Verification</div>
                    </div>
                  </div>
                </div>

                {/* Conditional bKash instructions & TrxID Input */}
                {paymentMethod === 'bkash' && (
                  <div className="p-4 bg-pink-950/30 border border-pink-900/60 rounded-xl space-y-3.5 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-pink-900/40 pb-2">
                      <div className="font-bold text-pink-300 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-pink-400" />
                        <span>bKash Payment Instructions (বিকাশ পেমেন্ট)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(PAYMENT_ACCOUNTS_CONFIG.bkash.accountNumber)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-pink-700 rounded-md text-pink-300 font-mono font-bold hover:bg-zinc-800 cursor-pointer text-[11px]"
                      >
                        {copiedNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-pink-400" />}
                        <span>{PAYMENT_ACCOUNTS_CONFIG.bkash.accountNumber}</span>
                      </button>
                    </div>

                    <div className="text-pink-200 space-y-1 font-bangla text-[11px] leading-relaxed bg-zinc-900/80 p-2.5 rounded-lg border border-pink-900/40">
                      <div>১. বিকাশ অ্যাপে যান অথবা ডায়াল করুন <strong>*247#</strong></div>
                      <div>২. <strong>Send Money</strong> করে বিকাশ নম্বরে পণ্যের মোট <strong>৳{prepaidProductAmount}</strong> পাঠান: <span className="font-mono font-bold text-amber-400">{PAYMENT_ACCOUNTS_CONFIG.bkash.accountNumber}</span> ({PAYMENT_ACCOUNTS_CONFIG.bkash.accountType})</div>
                      <div>৩. সফলভাবে পেমেন্ট করার পর নিচের তথ্যগুলো দিন।</div>
                    </div>

                    {/* Sender phone last 4 digits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-pink-300 mb-1">
                          Sender Number (Last 4 Digits) *
                        </label>
                        <input
                          id="checkout-bkash-senderlast4-input"
                          type="text"
                          maxLength={4}
                          required
                          value={senderLast4}
                          onChange={(e) => setSenderLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="e.g. 1234"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-center tracking-widest font-bold"
                        />
                        <span className="text-[10px] text-zinc-400 font-bangla block mt-0.5">
                          যে নম্বর থেকে টাকা পাঠিয়েছেন তার শেষ ৪ ডিজিট
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-pink-300 mb-1">
                          Paid Amount (টাকার পরিমাণ) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-sm">৳</span>
                          <input
                            id="checkout-bkash-amount-input"
                            type="number"
                            required
                            min={prepaidProductAmount}
                            max={prepaidProductAmount}
                            readOnly
                            value={paidAmountInput}
                            placeholder={prepaidProductAmount.toString()}
                            className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono font-bold cursor-not-allowed"
                          />
                        </div>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          Product Total: ৳{prepaidProductAmount}
                        </span>
                      </div>
                    </div>

                    {/* TrxID */}
                    <div>
                      <label className="block text-xs font-bold text-pink-300 mb-1">
                        bKash Transaction ID (TrxID) *
                      </label>
                      <input
                        id="checkout-bkash-trxid-input"
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 9B72LK9A1X (Enter exact TrxID)"
                        aria-invalid={Boolean(transactionIdLengthError)}
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-zinc-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono uppercase font-bold ${transactionIdLengthError ? 'border-rose-500' : 'border-zinc-800'}`}
                      />
                      {transactionIdLengthError && (
                        <p className="mt-1 text-[11px] font-medium text-rose-400" role="alert">
                          {transactionIdLengthError}
                        </p>
                      )}
                    </div>

                    <div className="p-2 bg-pink-950/50 rounded-lg border border-pink-800/40 text-[11px] text-pink-300 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Security Notice:</strong> We will NEVER ask for your bKash PIN or password. Your payment will be set to <strong>Verification Pending</strong> and verified by factory staff.
                      </span>
                    </div>
                  </div>
                )}

                {/* Conditional Nagad instructions & TrxID Input */}
                {paymentMethod === 'nagad' && (
                  <div className="p-4 bg-orange-950/30 border border-orange-900/60 rounded-xl space-y-3.5 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-orange-900/40 pb-2">
                      <div className="font-bold text-orange-300 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-orange-400" />
                        <span>Nagad Payment Instructions (নগদ পেমেন্ট)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(PAYMENT_ACCOUNTS_CONFIG.nagad.accountNumber)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-orange-700 rounded-md text-orange-300 font-mono font-bold hover:bg-zinc-800 cursor-pointer text-[11px]"
                      >
                        {copiedNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-orange-400" />}
                        <span>{PAYMENT_ACCOUNTS_CONFIG.nagad.accountNumber}</span>
                      </button>
                    </div>

                    <div className="text-orange-200 space-y-1 font-bangla text-[11px] leading-relaxed bg-zinc-900/80 p-2.5 rounded-lg border border-orange-900/40">
                      <div>১. নগদ অ্যাপে যান অথবা ডায়াল করুন <strong>*167#</strong></div>
                      <div>২. <strong>Send Money</strong> করে নগদ নম্বরে পণ্যের মোট <strong>৳{prepaidProductAmount}</strong> পাঠান: <span className="font-mono font-bold text-amber-400">{PAYMENT_ACCOUNTS_CONFIG.nagad.accountNumber}</span> ({PAYMENT_ACCOUNTS_CONFIG.nagad.accountType})</div>
                      <div>৩. সফলভাবে পেমেন্ট করার পর নিচের তথ্যগুলো দিন।</div>
                    </div>

                    {/* Sender phone last 4 digits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-orange-300 mb-1">
                          Sender Number (Last 4 Digits) *
                        </label>
                        <input
                          id="checkout-nagad-senderlast4-input"
                          type="text"
                          maxLength={4}
                          required
                          value={senderLast4}
                          onChange={(e) => setSenderLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="e.g. 1234"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-center tracking-widest font-bold"
                        />
                        <span className="text-[10px] text-zinc-400 font-bangla block mt-0.5">
                          যে নম্বর থেকে টাকা পাঠিয়েছেন তার শেষ ৪ ডিজিট
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-orange-300 mb-1">
                          Paid Amount (টাকার পরিমাণ) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-sm">৳</span>
                          <input
                            id="checkout-nagad-amount-input"
                            type="number"
                            required
                            min={prepaidProductAmount}
                            max={prepaidProductAmount}
                            readOnly
                            value={paidAmountInput}
                            placeholder={prepaidProductAmount.toString()}
                            className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold cursor-not-allowed"
                          />
                        </div>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          Product Total: ৳{prepaidProductAmount}
                        </span>
                      </div>
                    </div>

                    {/* TrxID */}
                    <div>
                      <label className="block text-xs font-bold text-orange-300 mb-1">
                        Nagad Transaction ID (TrxID) *
                      </label>
                      <input
                        id="checkout-nagad-trxid-input"
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 71A9B2C4 (Enter exact TrxID)"
                        aria-invalid={Boolean(transactionIdLengthError)}
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-zinc-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono uppercase font-bold ${transactionIdLengthError ? 'border-rose-500' : 'border-zinc-800'}`}
                      />
                      {transactionIdLengthError && (
                        <p className="mt-1 text-[11px] font-medium text-rose-400" role="alert">
                          {transactionIdLengthError}
                        </p>
                      )}
                    </div>

                    <div className="p-2 bg-orange-950/50 rounded-lg border border-orange-800/40 text-[11px] text-orange-300 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Security Notice:</strong> We will NEVER ask for your Nagad PIN or password. Your payment will be set to <strong>Verification Pending</strong> and verified by factory staff.
                      </span>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Right Column: Order Summary & Return Policy Agreement */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Order Items Review Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="font-bold text-white text-sm border-b border-zinc-800 pb-2">
                  Order Items ({cart.reduce((t, i) => t + i.quantity, 0)})
                </h4>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item, idx) => {
                    const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                        <div className="flex items-center gap-2">
                          <img 
                            src={item.product.images[0]} 
                            alt="" 
                            className="w-10 h-12 object-cover rounded border border-zinc-800"
                          />
                          <div>
                            <div className="font-bold text-white line-clamp-1">{item.product.name}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">
                              {item.product.code} | {item.selectedColor.name} | Size: {item.selectedSize}
                            </div>
                            <div className="text-[11px] text-zinc-400">Qty: {item.quantity} × ৳{price}</div>
                          </div>
                        </div>
                        <div className="font-bold text-amber-400 text-right">
                          ৳{price * item.quantity}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown Calculation */}
                <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Product Subtotal:</span>
                    <span className="font-bold text-white font-sans">৳{cartSubtotal}</span>
                  </div>

                  <div className="flex justify-between text-zinc-400">
                    <span className="flex items-center gap-1">
                      <span>Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                    </span>
                    <span className="font-bold text-white font-sans">+৳{deliveryFee}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Coupon Discount ({couponCode}):</span>
                      <span>-৳{discountAmount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-base font-black text-white">
                    <span>Total Amount (সর্বমোট):</span>
                    <span className="text-xl text-amber-400 font-sans">৳{cartTotal}</span>
                  </div>
                </div>
              </div>

              {/* Crucial Return & Exchange Policy Notice Display */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Return &amp; Exchange Policy:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openLegalModal('returns')}
                    className="text-[11px] underline text-amber-400 font-medium cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
                
                <p className="leading-relaxed font-bangla text-zinc-300 text-[11px]">
                  • ডেলিভারি ম্যানের সামনে পার্সেল খুলে পণ্য দেখে নেওয়ার সুযোগ রয়েছে।<br />
                  • সাইজ বা কালার এক্সচেঞ্জ অথবা রিটার্নের ক্ষেত্রে রিটার্ন ডেলিভারি চার্জ প্রযোজ্য।
                </p>

                <label className="flex items-start gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="mt-0.5 text-amber-500 rounded focus:ring-amber-400"
                  />
                  <span className="text-[11px] font-semibold text-white font-bangla">
                    আমি রিটার্ন, এক্সচেঞ্জ ও ডেলিভারি পলিসি পড়েছি এবং সম্মত আছি।
                  </span>
                </label>
              </div>

              {/* Confirm Order Button */}
              <button
                id="checkout-confirm-order-btn"
                type="submit"
                disabled={isSubmitting || !policyAccepted}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 px-6 rounded-xl text-base shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm Order (অর্ডার কনফার্ম করুন)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center">
                Need help? Call our Savar factory helpline: <a href="tel:01712773063" className="font-bold underline text-amber-400">01712773063</a>
              </p>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
