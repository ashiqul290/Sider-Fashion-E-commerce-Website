import React from 'react';
import { Banknote, Smartphone, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const PaymentMethodsSection: React.FC = () => {
  return (
    <section id="payment-methods-section" className="py-14 bg-black border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-900/60 px-2.5 py-0.5 rounded-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure Bangladesh Payments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Payment Methods
          </h2>
          <p className="text-sm text-zinc-400 font-bangla">
            ক্যাশ অন ডেলিভারি (COD), বিকাশ ও নগদ পেমেন্ট সুবিধা
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          
          {/* 1. Cash on Delivery (COD) */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs hover:border-amber-500/60 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-sm">
                Most Popular
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Cash on Delivery (COD)
              </h3>
              <p className="text-xs font-semibold text-emerald-400 font-bangla">
                ক্যাশ অন ডেলিভারি
              </p>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Pay in cash directly to the delivery rider once your parcel arrives at your doorstep in any district of Bangladesh.
            </p>
          </div>

          {/* 2. bKash */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs hover:border-pink-500/60 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-pink-950/80 text-pink-400 flex items-center justify-center border border-pink-800">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-950/90 text-pink-300 border border-pink-800 px-2 py-0.5 rounded-sm">
                Mobile Banking
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                bKash Payment
              </h3>
              <p className="text-xs font-semibold text-pink-400 font-bangla">
                বিকাশ মার্চেন্ট / পার্সোনাল
              </p>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Pay conveniently through your bKash app. Official merchant number is provided during checkout verification.
            </p>
          </div>

          {/* 3. Nagad */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs hover:border-orange-500/60 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-950/80 text-orange-400 flex items-center justify-center border border-orange-800">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-950/90 text-orange-300 border border-orange-800 px-2 py-0.5 rounded-sm">
                Mobile Banking
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Nagad Payment
              </h3>
              <p className="text-xs font-semibold text-orange-400 font-bangla">
                নগদ পেমেন্ট
              </p>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Fast and hassle-free payment directly from your Nagad mobile wallet with instant SMS transaction reference.
            </p>
          </div>

        </div>

        {/* Security & Admin note */}
        <div className="mt-8 max-w-2xl mx-auto text-center text-xs text-zinc-400 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 inline-block mr-1.5 -mt-0.5" />
          <span>Payment details are confirmed upon order placement. Official bKash/Nagad accounts can be configured in admin settings.</span>
        </div>

      </div>
    </section>
  );
};
