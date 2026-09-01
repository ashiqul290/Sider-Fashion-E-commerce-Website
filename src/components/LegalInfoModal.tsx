import React from 'react';
import { X, ShieldCheck, Truck, FileText, Lock, ArrowRight, Phone } from 'lucide-react';
import { LegalDocType } from '../types';
import { BRAND_CONTACTS } from '../data/products';

interface LegalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: LegalDocType;
  setDocType?: (type: LegalDocType) => void;
}

export const LegalInfoModal: React.FC<LegalInfoModalProps> = ({
  isOpen,
  onClose,
  docType,
  setDocType
}) => {
  if (!isOpen) return null;

  return (
    <div id="legal-info-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        id="legal-info-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-legal-info-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        {setDocType && (
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-6 overflow-x-auto">
            <button
              onClick={() => setDocType('returns')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                docType === 'returns'
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              Return &amp; Exchange Policy
            </button>
            <button
              onClick={() => setDocType('shipping')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                docType === 'shipping'
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              Shipping &amp; Delivery
            </button>
            <button
              onClick={() => setDocType('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                docType === 'privacy'
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setDocType('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                docType === 'terms'
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              Terms &amp; Conditions
            </button>
          </div>
        )}

        {/* Content based on docType */}
        {docType === 'returns' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">
                Return &amp; Exchange Policy (রিটার্ন ও এক্সচেঞ্জ পলিসি)
              </h2>
            </div>

            <div className="text-xs sm:text-sm space-y-3 text-zinc-300 leading-relaxed">
              <div className="p-4 bg-amber-950/40 rounded-xl border border-amber-800/80 text-amber-200 font-bangla">
                <strong>প্রধান নীতিমালা:</strong> গ্রাহকের সন্তুষ্টি আমাদের শীর্ষ অগ্রাধিকার। ডেলিভারি ম্যানের উপস্থিতিতে পার্সেল খুলে শার্ট বা কতুয়ার সাইজ ও গুণগত মান যাচাই করে নেওয়ার সম্পূর্ণ সুযোগ রয়েছে।
              </div>

              <h4 className="font-bold text-white pt-2">১. ডেলিভারির সময় রিটার্ন (On-the-spot Return)</h4>
              <p className="font-bangla text-zinc-400">
                যদি পণ্যটি আপনার পছন্দ না হয় বা সাইজে অমিল থাকে, তবে আপনি ডেলিভারি ম্যানের উপস্থিতিতে পণ্যটি ফেরত দিতে পারবেন। এই ক্ষেত্রে রিটার্ন ডেলিভারি চার্জ ক্রেতাকে বহন করতে হবে।
              </p>

              <h4 className="font-bold text-white pt-2">২. সাইজ এক্সচেঞ্জ নীতিমালা (Size Exchange)</h4>
              <p className="font-bangla text-zinc-400">
                পণ্য রিসিভ করার পর ৭ দিনের মধ্যে সাইজ পরিবর্তনের জন্য আমাদের হেল্পলাইনে যোগাযোগ করতে পারেন। পণ্যটি অব্যবহৃত, আনওয়াশড এবং মূল ট্যাগযুক্ত থাকতে হবে। এক্সচেঞ্জ ডেলিভারি খরচ প্রযোজ্য।
              </p>

              <h4 className="font-bold text-white pt-2">৩. ত্রুটিযুক্ত পণ্যের গ্যারান্টি (Defective Items)</h4>
              <p className="font-bangla text-zinc-400">
                আমাদের সাভার কারখানায় প্রতিটি পোশাক ৩ ধাপে কোয়ালিটি চেক করা হয়। এরপরেও কোনো ফেব্রিক ডিফেক্ট বা সেলাই ত্রুটি থাকলে আমরা সম্পূর্ণ বিনামূল্যে এক্সচেঞ্জ করে দেব।
              </p>
            </div>
          </div>
        )}

        {docType === 'shipping' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Truck className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">
                Shipping &amp; Delivery Details (ডেলিভারি সংক্রান্ত তথ্য)
              </h2>
            </div>

            <div className="text-xs sm:text-sm space-y-4 text-zinc-300 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <div className="font-bold text-white text-sm">Inside Dhaka City</div>
                  <div className="text-xl font-black text-amber-400 mt-1">৳70</div>
                  <p className="text-xs text-zinc-400 mt-2 font-bangla">
                    সময়: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি। ক্যাশ অন ডেলিভারি প্রযোজ্য।
                  </p>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <div className="font-bold text-white text-sm">Outside Dhaka (All 64 Districts)</div>
                  <div className="text-xl font-black text-amber-400 mt-1">৳120</div>
                  <p className="text-xs text-zinc-400 mt-2 font-bangla">
                    সময়: ৪৮ থেকে ৭২ ঘণ্টার মধ্যে জেলা ও উপজেলা পর্যায়ে স্টেডফাস্ট ও সুন্দরবন কুরিয়ারের মাধ্যমে হোম/পয়েন্ট ডেলিভারি।
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white">Wholesale Parcel Delivery (পাইকারি ডেলিভারি)</h4>
                <p className="font-bangla text-xs text-zinc-400">
                  পাইকারি লট (১২+ পিস) সাভার আশুলিয়া কারখানা থেকে সরাসরি প্রস্তুত করে সুন্দরবন কুরিয়ার, এসএ পরিবহন বা কার্গোর মাধ্যমে পাঠানো হয়।
                </p>
              </div>
            </div>
          </div>
        )}

        {docType === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Lock className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">
                Privacy Policy (গোপনীয়তা নীতি)
              </h2>
            </div>

            <div className="text-xs sm:text-sm space-y-3 text-zinc-300 leading-relaxed">
              <p>
                At Sider Fashion, we respect and safeguard our customers' personal information. We collect only necessary details to process your apparel orders safely and reliably.
              </p>

              <h4 className="font-bold text-white">1. Information We Collect</h4>
              <p className="text-zinc-400">
                Customer Name, Mobile Phone Number, WhatsApp Number, Shipping Address, District, and Order Preferences. For prepaid orders (bKash/Nagad), we store the Transaction ID solely for payment verification.
              </p>

              <h4 className="font-bold text-white">2. We Never Request Sensitive Financial Data</h4>
              <p className="font-semibold text-rose-400">
                Sider Fashion will NEVER ask for your bKash/Nagad PIN, bank passwords, or OTPs. Please keep your personal credentials strictly confidential.
              </p>

              <h4 className="font-bold text-white">3. Data Protection</h4>
              <p className="text-zinc-400">
                We do not sell, rent, or trade your contact information with third-party advertising companies. Your details are strictly shared with delivery courier partners for physical delivery purposes.
              </p>
            </div>
          </div>
        )}

        {docType === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">
                Terms &amp; Conditions (শর্তাবলী)
              </h2>
            </div>

            <div className="text-xs sm:text-sm space-y-3 text-zinc-300 leading-relaxed">
              <h4 className="font-bold text-white">1. Product Authenticity</h4>
              <p className="text-zinc-400">
                All men's shirts and katua listed on Sider Fashion are manufactured directly at our Savar, Ashulia factory using premium fabrics and professional stitching.
              </p>

              <h4 className="font-bold text-white">2. Pricing &amp; Orders</h4>
              <p className="text-zinc-400">
                Retail prices are fixed with occasional promotional coupons. Wholesale orders are subject to a strict 12-piece Minimum Order Quantity (MOQ).
              </p>

              <h4 className="font-bold text-white">3. Payment Verification</h4>
              <p className="text-zinc-400">
                Entering a bKash or Nagad Transaction ID initiates the verification process. Orders are marked as "Verification Pending" until verified by our billing desk.
              </p>
            </div>
          </div>
        )}

        {/* Footer Contact */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div>
            Need help? Sider Factory Helpline: <span className="font-bold text-white">{BRAND_CONTACTS.primaryPhone}</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
