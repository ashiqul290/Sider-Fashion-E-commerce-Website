import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Ruler, MessageSquare } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';

interface ProductQuickViewModalProps {
  product?: Product | null;
  onClose?: () => void;
}

interface ProductQuickViewModalContentProps {
  product: Product;
  onClose: () => void;
}

const ProductQuickViewModalContent: React.FC<ProductQuickViewModalContentProps> = ({
  product,
  onClose
}) => {
  const { 
    addToCart, 
    quickBuy, 
    setActiveProductDetail, 
    openSizeGuide,
    openWhatsAppChat
  } = useCart();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Default', nameBn: 'ডিফল্ট', hex: '#000' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || 'L');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    quickBuy(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hello Sider Fashion!\nI want to order via WhatsApp:\n• Product: ${product.name} (${product.code})\n• Color: ${selectedColor.name}\n• Size: ${selectedSize}\n• Quantity: ${quantity}\n• Price: ৳${product.retailPrice * quantity}\n\nPlease confirm availability and delivery.`;
    openWhatsAppChat(msg);
  };

  const handleFullDetails = () => {
    onClose();
    setActiveProductDetail(product);
  };

  const handleOpenSizeGuide = () => {
    openSizeGuide(product);
  };

  return (
    <div id="quick-view-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="quick-view-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-quick-view-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Left Thumbnail */}
          <div className="sm:col-span-5 aspect-4/5 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Right Details */}
          <div className="sm:col-span-7 space-y-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-sm">
                  {product.categoryName}
                </span>
                <span className="text-xs text-zinc-400 font-mono">{product.code}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-1">
                {product.name}
              </h3>
              <p className="text-xs text-zinc-400 font-bangla">{product.nameBn}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">৳{product.retailPrice}</span>
              {product.originalRetailPrice && (
                <span className="text-xs text-zinc-500 line-through">৳{product.originalRetailPrice}</span>
              )}
              <span className="text-xs font-semibold text-emerald-400 ml-auto bg-emerald-950/60 px-2 py-0.5 rounded-sm border border-emerald-800">
                Wholesale: ৳{product.wholesalePrice}
              </span>
            </div>

            {/* Colors */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-300">Color: {selectedColor.name}</span>
              <div className="flex items-center gap-1.5">
                {product.colors.map((c, i) => (
                  <button
                    key={c.hex + i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      selectedColor.hex === c.hex ? 'ring-2 ring-amber-500 scale-110' : 'border-zinc-700'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Size: {selectedSize}</span>
                <button
                  onClick={handleOpenSizeGuide}
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedSize === s.size
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                id="quickview-add-to-cart"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 py-2.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </button>

              <button
                id="quickview-buy-now"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-lg text-xs font-bold cursor-pointer shadow-xs"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>

            <button
              id="quickview-whatsapp-order-btn"
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Order via WhatsApp (সরাসরি অর্ডার)</span>
            </button>

            <button
              onClick={handleFullDetails}
              className="w-full text-center text-xs text-amber-400 hover:underline font-bold pt-1 cursor-pointer block"
            >
              View Full Gallery, Fabric Specs &amp; Size Guide &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({ 
  product: propProduct, 
  onClose: propOnClose 
}) => {
  const { 
    quickViewProduct,
    setQuickViewProduct
  } = useCart();

  const product = propProduct !== undefined ? propProduct : quickViewProduct;
  const onClose = propOnClose || (() => setQuickViewProduct(null));

  if (!product) return null;

  return <ProductQuickViewModalContent key={product.id} product={product} onClose={onClose} />;
};
