import React from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Eye,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ReturnPolicySectionProps {
  asModal?: boolean;
  onClose?: () => void;
}

export const ReturnPolicySection: React.FC<ReturnPolicySectionProps> = ({ asModal = false, onClose }) => {
  const content = (
    <div className="space-y-6">
      {/* Policy Header Banner */}
      <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg">
          <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
          <span>Sider Fashion Return &amp; Exchange Policy (রিটার্ন ও এক্সচেঞ্জ নীতি)</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 font-bangla leading-relaxed">
          গ্রাহকদের শতভাগ সন্তুষ্টি নিশ্চিত করতে আমরা উন্মুক্তভাবে ডেলিভারিম্যানের সামনে পণ্য চেক করার সুবিধা প্রদান করি।
        </p>
      </div>

      {/* 3 Step Transparent Policy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step 1 */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-black text-sm flex items-center justify-center">
            ১
          </div>
          <h4 className="font-bold text-white text-sm">
            Check in Front of Courier
          </h4>
          <p className="text-xs text-zinc-400 font-bangla leading-relaxed">
            ডেলিভারি রাইডার থাকাকালীন পার্সেল খুলে শার্ট বা কতুয়ার ফেব্রিক, সাইজ ও কালার চেক করুন।
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-800 text-amber-400 font-black text-sm flex items-center justify-center">
            ২
          </div>
          <h4 className="font-bold text-white text-sm">
            Instant Return or Exchange
          </h4>
          <p className="text-xs text-zinc-400 font-bangla leading-relaxed">
            পণ্য পছন্দ না হলে বা সাইজে সমস্যা হলে তাৎক্ষণিকভাবে রাইডারের কাছে রিটার্ন দিতে পারবেন অথবা অন্য সাইজ এক্সচেঞ্জ রিকোয়েস্ট করতে পারবেন।
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-black text-sm flex items-center justify-center">
            ৩
          </div>
          <h4 className="font-bold text-white text-sm">
            Return Delivery Charge
          </h4>
          <p className="text-xs text-zinc-400 font-bangla leading-relaxed">
            রিটার্ন বা এক্সচেঞ্জের ক্ষেত্রে শুধুমাত্র কুরিয়ার ডেলিভারি চার্জ (ঢাকা ৭০ টাকা / ঢাকার বাইরে ১২০ টাকা) গ্রাহককে পরিশোধ করতে হবে।
          </p>
        </div>

      </div>

      {/* Highlights checklist */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs text-zinc-300">
        <div className="font-bold text-white">Important Return Guidelines:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-bangla">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>প্রোডাক্ট অক্ষত ও ট্যাগসহ থাকতে হবে</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ওয়াশ বা ব্যবহৃত প্রোডাক্ট রিটার্ন গ্রহণযোগ্য নয়</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ম্যানুফ্যাকচারিং ত্রুটিতে ফ্রি এক্সচেঞ্জ প্রযোজ্য</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>হোয়াটসঅ্যাপ হটলাইনে তাৎক্ষণিক রিটার্ন ট্র্যাকিং</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (asModal) {
    return (
      <div id="return-policy-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div 
          id="return-policy-modal-content"
          className="relative bg-zinc-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-800 animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>Return &amp; Exchange Policy</span>
            </h3>
            {onClose && (
              <button
                id="close-return-policy-modal-btn"
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="return-policy-section" className="py-16 bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Transparent Return &amp; Exchange
          </h2>
          <p className="text-zinc-400 font-bangla text-sm">
            নিশ্চিন্তে শপিং করুন — ডেলিভারিম্যানের সামনে প্রোডাক্ট দেখে নেওয়ার সুযোগ।
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {content}
        </div>
      </div>
    </section>
  );
};
