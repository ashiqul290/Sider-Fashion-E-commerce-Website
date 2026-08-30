import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Zap, 
  MessageSquare, 
  Star, 
  Check, 
  Factory, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Ruler, 
  Layers,
  ChevronRight,
  Info,
  Building2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACTS } from '../data/products';

interface ProductDetailsModalProps {
  product?: Product | null;
  onClose?: () => void;
}

interface ProductDetailsModalContentProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailsModalContent: React.FC<ProductDetailsModalContentProps> = ({
  product,
  onClose
}) => {
  const { 
    addToCart, 
    quickBuy, 
    setIsWholesaleModalOpen, 
    openWhatsAppChat,
    setIsReturnPolicyModalOpen,
    openSizeGuide
  } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Default', nameBn: 'ডিফল্ট', hex: '#000' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const currentSizeObj = product.sizes.find(s => s.size === selectedSize);

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setSizeError(null);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('অনুগ্রহ করে একটি সাইজ সিলেক্ট করুন (Please select a size)');
      return;
    }
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError('অনুগ্রহ করে একটি সাইজ সিলেক্ট করুন (Please select a size)');
      return;
    }
    quickBuy(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  const handleWhatsAppInquiry = () => {
    const msg = `Hello Sider Fashion!\nI want to order:\n• Product: ${product.name} (${product.code})\n• Color: ${selectedColor.name} (${selectedColor.nameBn})\n• Size: ${selectedSize || 'Not selected'}\n• Quantity: ${quantity}\n• Retail Price: ৳${product.retailPrice * quantity}\n\nPlease let me know the delivery schedule for my area.`;
    openWhatsAppChat(msg);
  };

  const handleWholesaleInquiry = () => {
    onClose();
    setIsWholesaleModalOpen(true);
  };

  return (
    <div id="product-details-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        id="product-details-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-details-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
          
          {/* Gallery Column */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <span className="bg-black/90 text-amber-400 text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-xs border border-zinc-800">
                  {product.code}
                </span>
                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  Own Factory Made
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-amber-500 scale-95' : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Bangladesh Delivery & Return Assurance Card */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center justify-between font-bold text-white border-b border-zinc-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  রিটার্ন ও এক্সচেঞ্জ পলিসি
                </span>
                <button 
                  onClick={() => setIsReturnPolicyModalOpen(true)}
                  className="text-amber-400 hover:underline text-[11px] font-bold"
                >
                  বিস্তারিত পড়ুন &rarr;
                </button>
              </div>
              <p className="leading-relaxed font-bangla text-zinc-400">
                ডেলিভারিম্যানের সামনে পোশাকটি চেক করে রিসিভ করতে পারবেন। পছন্দ না হলে সাথে সাথে রিটার্ন বা এক্সচেঞ্জ করতে পারবেন (রিটার্ন ডেলিভারি চার্জ প্রযোজ্য)।
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 font-semibold text-zinc-200">
                <div className="bg-zinc-950 p-2 rounded-md border border-zinc-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>ঢাকা সিটি: ৳৭০</span>
                </div>
                <div className="bg-zinc-950 p-2 rounded-md border border-zinc-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>ঢাকার বাইরে: ৳১২০</span>
                </div>
              </div>
            </div>

          </div>

          {/* Details & Purchase Controls Column */}
          <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-sm">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-zinc-500">({product.reviewsCount} customer reviews)</span>
                </div>
              </div>

              {/* Title & SKU */}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                  {product.name}
                </h1>
                <p className="text-sm font-semibold text-zinc-400 font-bangla mt-0.5">
                  {product.nameBn}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span>Product Code: <strong className="text-white">{product.code}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold font-sans">
                    Stock: {product.stock > 0 ? `${product.stock} pcs in Savar factory` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Pricing Box with Wholesale highlight */}
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-zinc-400 block">Retail Price (খুচরা মূল্য):</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">
                      ৳{product.retailPrice}
                    </span>
                    {product.originalRetailPrice && (
                      <span className="text-sm text-zinc-500 line-through">
                        ৳{product.originalRetailPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-l border-amber-900/60 pl-3">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-sm">
                    <Factory className="w-3 h-3" />
                    Wholesale Rate
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    ৳{product.wholesalePrice} <span className="text-[11px] font-normal text-zinc-400">(MOQ {product.wholesaleMOQ} pcs)</span>
                  </div>
                </div>
              </div>

              {/* Color Swatch Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    Select Color: <strong className="text-white">{selectedColor.name} ({selectedColor.nameBn})</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((color, idx) => {
                    const isSelected = selectedColor.hex === color.hex;
                    return (
                      <button
                        key={color.hex + idx}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500 text-black shadow-xs font-bold'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-zinc-600 inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection & Guide Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    Select Size: <strong className="text-white font-mono text-sm">{selectedSize || 'None'}</strong>
                    {currentSizeObj && (
                      <span className="ml-2 text-zinc-400 text-[11px]">
                        (Chest: {currentSizeObj.chestInches}", Length: {currentSizeObj.lengthInches}")
                      </span>
                    )}
                  </span>
                  
                  {/* Size Guide Trigger */}
                  <button
                    id="open-size-guide-from-product-btn"
                    type="button"
                    onClick={() => openSizeGuide(product)}
                    className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/80 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Ruler className="w-3.5 h-3.5 text-amber-400" />
                    <span>Size Guide &amp; Finder</span>
                    <span className="text-[10px] text-amber-400 font-bangla font-normal">(সাইজ গাইড)</span>
                  </button>
                </div>

                {sizeError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold bg-rose-950/70 border border-rose-800 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{sizeError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    const isOutOfStock = s.stock === 0;

                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleSelectSize(s.size)}
                        className={`relative px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isOutOfStock
                            ? 'opacity-40 bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed line-through'
                            : isSelected
                            ? 'border-amber-500 bg-amber-500 text-black shadow-sm ring-2 ring-amber-500/40'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-sm">{s.size}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                        </div>
                        <span className={`block text-[10px] font-normal mt-0.5 ${isSelected ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {s.chestInches}" chest
                        </span>
                        {s.stock > 0 && s.stock <= 15 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-bold px-1 rounded-full">
                            {s.stock} left
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Micro Smart Fit prompt */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Not sure which size fits you?</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openSizeGuide(product)}
                    className="text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Calculate Recommended Size &rarr;
                  </button>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-semibold text-zinc-300">Quantity:</span>
                <div className="flex items-center border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-white min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-400">
                  Total: <strong className="text-amber-400 font-mono">৳{product.retailPrice * quantity}</strong>
                </span>
              </div>

              {/* Fabric Specs & Description */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-xs">
                <div className="font-semibold text-white">ফেব্রিক ও স্পেসিফিকেশন:</div>
                <p className="text-zinc-300 leading-relaxed font-bangla">
                  {product.descriptionBn}
                </p>
                <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900 p-2 rounded-md border border-zinc-800">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Fabric:</strong> {product.fabric}</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-zinc-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 py-3 px-4 rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Order Now / অর্ডার করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="modal-whatsapp-order-btn"
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Order</span>
                </button>

                <button
                  id="modal-wholesale-request-btn"
                  onClick={handleWholesaleInquiry}
                  className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 py-2.5 px-3 rounded-lg text-xs font-bold border border-zinc-800 hover:border-amber-500/50 transition-colors cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Wholesale Inquiry (পাইকারি)</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product: propProduct, 
  onClose: propOnClose 
}) => {
  const { 
    activeProductDetail,
    setActiveProductDetail
  } = useCart();

  const product = propProduct !== undefined ? propProduct : activeProductDetail;
  const onClose = propOnClose || (() => setActiveProductDetail(null));

  if (!product) return null;

  return <ProductDetailsModalContent key={product.id} product={product} onClose={onClose} />;
};
