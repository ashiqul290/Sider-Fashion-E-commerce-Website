import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Layers, 
  SlidersHorizontal, 
  CheckCircle2, 
  Sparkles, 
  Factory, 
  Package,
  Trash2,
  Database
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product, ProductCategory } from '../types';

export const AdminProductManagerModal: React.FC = () => {
  const { 
    isAdminManagerOpen, 
    setIsAdminManagerOpen, 
    products, 
    addProduct 
  } = useCart();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [code, setCode] = useState(`SF-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<ProductCategory>('mens-shirts');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80');
  const [fabric, setFabric] = useState('100% Combed Cotton');
  const [fabricBn, setFabricBn] = useState('১০০% কম্বড কটন');
  const [retailPrice, setRetailPrice] = useState<number>(850);
  const [wholesalePrice, setWholesalePrice] = useState<number>(480);
  const [wholesaleMOQ, setWholesaleMOQ] = useState<number>(12);
  const [stock, setStock] = useState<number>(100);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [description, setDescription] = useState('Crafted at our Savar factory using premium cotton weave.');
  const [descriptionBn, setDescriptionBn] = useState('আমাদের সাভার কারখানায় তৈরি প্রিমিয়াম কটন পোশাক।');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [sizesConfig, setSizesConfig] = useState<{ size: string; chest: number; length: number; shoulder: number; sleeve: number }[]>([
    { size: 'S', chest: 38, length: 27.5, shoulder: 17.5, sleeve: 24.5 },
    { size: 'M', chest: 40, length: 28.5, shoulder: 18.0, sleeve: 25.0 },
    { size: 'L', chest: 42, length: 29.5, shoulder: 18.5, sleeve: 25.5 },
    { size: 'XL', chest: 44, length: 30.5, shoulder: 19.2, sleeve: 26.0 },
    { size: 'XXL', chest: 46, length: 31.5, shoulder: 20.0, sleeve: 26.5 }
  ]);

  if (!isAdminManagerOpen) return null;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const categoryNames: Record<ProductCategory, { en: string; bn: string }> = {
      'mens-shirts': { en: "Men's Shirts", bn: 'পুরুষদের শার্ট' },
      'mens-katua': { en: "Men's Katua", bn: 'পুরুষদের কতুয়া' },
      'mens-fashion': { en: "Men's Fashion", bn: 'পুরুষদের ফ্যাশন' },
      'womens-fashion': { en: "Women's Fashion", bn: 'মহিলাদের ফ্যাশন' },
      'womens-dresses': { en: "Women's Dresses", bn: 'মহিলাদের পোশাক' },
      'kids': { en: 'Kids Collection', bn: 'বাচ্চাদের পোশাক' },
      'festive-collection': { en: 'Festive Collection', bn: 'ঈদ ও উৎসবের কালেকশন' },
      'summer-collection': { en: 'Summer Collection', bn: 'সামার কালেকশন' },
      'winter-collection': { en: 'Winter Collection', bn: 'উইন্টার কালেকশন' },
      'new-arrivals': { en: 'New Arrivals', bn: 'নতুন আগমন' }
    };

    const newProd: Product = {
      id: code.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      code,
      name,
      nameBn: nameBn || name,
      category,
      categoryName: categoryNames[category].en,
      categoryNameBn: categoryNames[category].bn,
      images: [imageUrl],
      description,
      descriptionBn,
      fabric,
      fabricBn,
      colors: [
        { name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1e293b' },
        { name: 'White', nameBn: 'সাদা', hex: '#ffffff' }
      ],
      sizes: sizesConfig.map(s => ({
        size: s.size,
        chestInches: s.chest,
        lengthInches: s.length,
        shoulderInches: s.shoulder,
        sleeveInches: s.sleeve,
        stock: Math.floor(stock / sizesConfig.length)
      })),
      retailPrice: Number(retailPrice),
      wholesalePrice: Number(wholesalePrice),
      wholesaleMOQ: Number(wholesaleMOQ),
      stock: Number(stock),
      isFeatured,
      isNewArrival,
      rating: 5.0,
      reviewsCount: 1,
      tags: ['Admin Added', 'Sider Factory', 'New Drop']
    };

    addProduct(newProd);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setName('');
      setNameBn('');
      setCode(`SF-${Math.floor(100 + Math.random() * 900)}`);
    }, 1500);
  };

  return (
    <div id="admin-manager-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        id="admin-manager-modal-content"
        className="relative bg-zinc-950 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-admin-manager-btn"
          onClick={() => setIsAdminManagerOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pb-4 border-b border-zinc-800">
          <div className="p-2.5 rounded-xl bg-amber-950/70 text-amber-400 border border-amber-800/80 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded-sm">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Extensible Architecture Demo</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Admin Product Management Architecture
            </h3>
            <p className="text-xs text-zinc-400 font-bangla">
              নতুন প্রোডাক্ট, ক্যাটাগরি ও পাইকারি মূল্য সংযোজন করার প্রস্তুত আর্কিটেকচার।
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            This panel demonstrates that the entire Sider Fashion catalog is structured with full support for Retail/Wholesale tiering, MOQ, dynamic category expansion, and future PostgreSQL / Firestore backend plugging without UI restructuring.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateProduct} className="mt-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Product Code (SKU) *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white font-mono focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Product Name (English) *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic Mandarin Collar Shirt"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Product Name (Bangla)</label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: ক্লাসিক চাইনিজ কলার শার্ট"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white"
              >
                <option value="mens-shirts">Men's Shirts (শার্ট)</option>
                <option value="mens-katua">Men's Katua (কতুয়া)</option>
                <option value="mens-fashion">Men's Fashion (মেনস ফ্যাশন)</option>
                <option value="womens-fashion">Women's Fashion (উইমেনস ফ্যাশন)</option>
                <option value="new-arrivals">New Arrivals (নতুন আগমন)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Fabric Specifications</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Combed Twill Cotton"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Stock (Pieces in Savar Factory)</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white"
              />
            </div>
          </div>

          {/* Pricing & MOQ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Retail Price (৳)</label>
              <input
                type="number"
                value={retailPrice}
                onChange={(e) => setRetailPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Wholesale Price (৳)</label>
              <input
                type="number"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Wholesale MOQ (Min Pieces)</label>
              <input
                type="number"
                value={wholesaleMOQ}
                onChange={(e) => setWholesaleMOQ(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1">Product Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-300">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700"
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-300">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700"
              />
              <span>Tag as New Arrival</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              id="admin-create-product-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Product to Live Store Catalog</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded-lg text-center font-bold animate-in fade-in">
              🎉 Product successfully registered into Sider Fashion catalog!
            </div>
          )}
        </form>

        {/* Existing Products List Preview */}
        <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2">
          <div className="font-bold text-zinc-300 text-xs">
            Current Dynamic Catalog ({products.length} Products in System):
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">{p.code}</span>
                  <span className="font-semibold text-white">{p.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-zinc-300">Retail: <strong className="text-white">৳{p.retailPrice}</strong></span>
                  <span className="text-emerald-400 font-bold">Wholesale: <strong>৳{p.wholesalePrice}</strong> (MOQ {p.wholesaleMOQ})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
