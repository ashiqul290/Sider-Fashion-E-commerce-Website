import React, { useState } from 'react';
import { 
  Eye, 
  ShoppingBag, 
  Zap, 
  MessageSquare, 
  Star, 
  Check, 
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    quickBuy, 
    setQuickViewProduct, 
    setActiveProductDetail, 
    openWhatsAppChat 
  } = useCart();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Default', nameBn: 'ডিফল্ট', hex: '#000' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || 'L');
  const [imageIndex, setImageIndex] = useState(0);

  const handleCardClick = () => {
    setActiveProductDetail(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, selectedSize, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProductDetail(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProductDetail(product);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Hello Sider Fashion! I want to order this item (Retail):\n• Product: ${product.name} (${product.code})\n• Color: ${selectedColor.name}\n• Selected Size: ${selectedSize}\n• Retail Price: ৳${product.retailPrice}\n\nPlease confirm availability and delivery to my address.`;
    openWhatsAppChat(msg);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-amber-500/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-zinc-950">
        <img
          src={product.images[imageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-black/90 backdrop-blur-xs text-amber-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow-xs border border-zinc-800">
            {product.code}
          </span>
          {product.isBestSeller && (
            <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Category Tag (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/80 backdrop-blur-xs text-zinc-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs border border-zinc-700">
            {product.categoryName}
          </span>
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={handleQuickView}
            className="bg-amber-500 text-black hover:bg-amber-400 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1.5">
          {/* Rating & Fabric tag */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="text-[11px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded truncate max-w-[170px]">
              {product.fabric}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-zinc-500 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name (English & Bangla) */}
          <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-400 font-bangla line-clamp-1">
            {product.nameBn}
          </p>
        </div>

        {/* Color & Size Variant Selectors directly on Card */}
        <div className="space-y-2 pt-2 border-t border-zinc-800" onClick={(e) => e.stopPropagation()}>
          
          {/* Color Swatches */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400">Color:</span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((color, idx) => {
                const isSelected = selectedColor.hex === color.hex;
                return (
                  <button
                    key={color.hex + idx}
                    type="button"
                    title={`${color.name} (${color.nameBn})`}
                    onClick={() => {
                      setSelectedColor(color);
                      if (product.images[idx]) {
                        setImageIndex(idx);
                      }
                    }}
                    className={`w-5 h-5 rounded-full border transition-transform flex items-center justify-center cursor-pointer ${
                      isSelected ? 'ring-2 ring-amber-400 scale-110 border-white' : 'border-zinc-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <Check className={`w-3 h-3 ${color.hex === '#f8fafc' || color.hex === '#fffff0' || color.hex === '#fdfbf7' ? 'text-zinc-950' : 'text-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Pills */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400">Sizes:</span>
            <div className="flex items-center gap-1">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                return (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSelectedSize(s.size)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing Breakdown (Clean Retail Focus) */}
        <div className="pt-2.5 border-t border-zinc-800 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 block">Retail Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-amber-400 font-sans">
                ৳{product.retailPrice}
              </span>
              {product.originalRetailPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  ৳{product.originalRetailPrice}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 justify-end font-bangla">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              রেডি স্টক
            </span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <button
            id={`add-to-cart-btn-${product.id}`}
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-2.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-zinc-700"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            id={`buy-now-btn-${product.id}`}
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>

        {/* WhatsApp Direct Inquiry Button */}
        <button
          id={`whatsapp-order-btn-${product.id}`}
          type="button"
          onClick={handleWhatsAppOrder}
          className="w-full flex items-center justify-center gap-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 py-2 rounded-lg text-[11px] font-semibold border border-emerald-800/60 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Order via WhatsApp (সরাসরি অর্ডার)</span>
        </button>

      </div>
    </div>
  );
};
