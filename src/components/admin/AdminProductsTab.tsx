import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Star, 
  Sparkles, 
  Image as ImageIcon, 
  SlidersHorizontal, 
  CheckCircle2, 
  X, 
  Layers, 
  Upload, 
  DollarSign, 
  Boxes, 
  AlertCircle,
  TrendingDown,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { Product, ProductCategory, ProductColor, ProductSize, WholesalePricingTier, CategoryInfo } from '../../types';
import { AdminStoreService, DEFAULT_COLORS, DEFAULT_MASTER_SIZES } from '../../services/adminStoreService';
import { compressImageFile } from '../../utils/imageCompressor';

interface AdminProductsTabProps {
  products: Product[];
  onRefresh: () => void;
  adminName: string;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onRefresh,
  adminName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'featured' | 'new-arrival'>('all');

  // Dynamic Categories, Sizes, Colors from Store
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>(AdminStoreService.getCategories());
  const [masterSizes, setMasterSizes] = useState<string[]>(AdminStoreService.getSizes());
  const [masterColors, setMasterColors] = useState<ProductColor[]>(AdminStoreService.getColors());

  useEffect(() => {
    setCategoriesList(AdminStoreService.getCategories());
    setMasterSizes(AdminStoreService.getSizes());
    setMasterColors(AdminStoreService.getColors());
  }, [products]);

  // Edit/Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('mens-shirts');
  const [categoryName, setCategoryName] = useState("Men's Shirts");
  const [categoryNameBn, setCategoryNameBn] = useState('পুরুষদের শার্ট');
  const [images, setImages] = useState<string[]>(['']);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [fabric, setFabric] = useState('100% Combed Cotton');
  const [fabricBn, setFabricBn] = useState('১০০% কম্বড কটন');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [retailPrice, setRetailPrice] = useState<number>(850);
  const [originalRetailPrice, setOriginalRetailPrice] = useState<number>(950);
  const [wholesalePrice, setWholesalePrice] = useState<number>(480);
  const [wholesaleMOQ, setWholesaleMOQ] = useState<number>(12);
  const [stock, setStock] = useState<number>(100);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [tags, setTags] = useState<string>('Cotton, Factory Direct, Casual');

  // Colors & Sizes Matrix
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([DEFAULT_COLORS[0], DEFAULT_COLORS[1]]);
  const [sizesList, setSizesList] = useState<ProductSize[]>([
    { size: 'M', chestInches: 40, lengthInches: 28.5, stock: 30 },
    { size: 'L', chestInches: 42, lengthInches: 29.5, stock: 40 },
    { size: 'XL', chestInches: 44, lengthInches: 30.5, stock: 30 }
  ]);

  // Wholesale Tiers
  const [tiers, setTiers] = useState<WholesalePricingTier[]>([
    { minQty: 12, maxQty: 49, pricePerPiece: 480, label: '12–49 pcs' },
    { minQty: 50, maxQty: 99, pricePerPiece: 450, label: '50–99 pcs' },
    { minQty: 100, pricePerPiece: 420, label: '100+ pcs' }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setCode(`SF-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setNameBn('');
    const defaultCat = categoriesList[0] || { key: 'mens-shirts', name: "Men's Shirts", nameBn: 'পুরুষদের শার্ট' };
    setSelectedCategoryKey(defaultCat.key);
    setCategoryName(defaultCat.name);
    setCategoryNameBn(defaultCat.nameBn);
    setImages(['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80']);
    setFabric('100% Combed Cotton');
    setFabricBn('১০০% কম্বড কটন');
    setDescription('Crafted at our Savar factory using premium cotton weave.');
    setDescriptionBn('আমাদের সাভার কারখানায় তৈরি প্রিমিয়াম কটন পোশাক।');
    setShortDescription('Premium finish directly from Savar factory.');
    setRetailPrice(850);
    setOriginalRetailPrice(950);
    setWholesalePrice(480);
    setWholesaleMOQ(12);
    setStock(100);
    setIsFeatured(true);
    setIsNewArrival(true);
    setTags('Cotton, Factory Direct, Casual');
    setSelectedColors(masterColors.slice(0, 2));
    setSizesList([
      { size: 'M', chestInches: 40, lengthInches: 28.5, stock: 30 },
      { size: 'L', chestInches: 42, lengthInches: 29.5, stock: 40 },
      { size: 'XL', chestInches: 44, lengthInches: 30.5, stock: 30 }
    ]);
    setTiers([
      { minQty: 12, maxQty: 49, pricePerPiece: 480, label: '12–49 pcs' },
      { minQty: 50, maxQty: 99, pricePerPiece: 450, label: '50–99 pcs' },
      { minQty: 100, pricePerPiece: 420, label: '100+ pcs' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setCode(prod.code);
    setName(prod.name);
    setNameBn(prod.nameBn);
    setSelectedCategoryKey(prod.category);
    setCategoryName(prod.categoryName || prod.category);
    setCategoryNameBn(prod.categoryNameBn || prod.category);
    setImages(prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80']);
    setFabric(prod.fabric);
    setFabricBn(prod.fabricBn);
    setDescription(prod.description);
    setDescriptionBn(prod.descriptionBn);
    setShortDescription(prod.shortDescription || '');
    setRetailPrice(prod.retailPrice);
    setOriginalRetailPrice(prod.originalRetailPrice || prod.retailPrice);
    setWholesalePrice(prod.wholesalePrice);
    setWholesaleMOQ(prod.wholesaleMOQ || 12);
    setStock(prod.stock);
    setIsFeatured(!!prod.isFeatured);
    setIsNewArrival(!!prod.isNewArrival);
    setTags(prod.tags ? prod.tags.join(', ') : 'Cotton, Factory Direct');
    setSelectedColors(prod.colors && prod.colors.length > 0 ? prod.colors : masterColors.slice(0, 2));
    setSizesList(prod.sizes && prod.sizes.length > 0 ? prod.sizes : [
      { size: 'M', chestInches: 40, lengthInches: 28.5, stock: Math.floor(prod.stock / 3) },
      { size: 'L', chestInches: 42, lengthInches: 29.5, stock: Math.floor(prod.stock / 3) },
      { size: 'XL', chestInches: 44, lengthInches: 30.5, stock: Math.floor(prod.stock / 3) }
    ]);
    setTiers(prod.wholesaleTiers && prod.wholesaleTiers.length > 0 ? prod.wholesaleTiers : [
      { minQty: prod.wholesaleMOQ || 12, maxQty: 49, pricePerPiece: prod.wholesalePrice, label: `${prod.wholesaleMOQ || 12}–49 pcs` },
      { minQty: 50, pricePerPiece: prod.wholesalePrice - 30, label: '50+ pcs' }
    ]);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    // Calculate total stock from sizes
    const computedStock = sizesList.reduce((sum, s) => sum + (s.stock || 0), 0);
    const finalStock = computedStock > 0 ? computedStock : stock;

    const prodToSave: Product = {
      id: editingProduct ? editingProduct.id : `sf-prod-${Date.now()}`,
      code: code.trim(),
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      category: selectedCategoryKey as ProductCategory,
      categoryName: categoryName,
      categoryNameBn: categoryNameBn,
      images: images.filter(Boolean),
      fabric: fabric.trim(),
      fabricBn: fabricBn.trim() || fabric.trim(),
      description: description.trim(),
      descriptionBn: descriptionBn.trim() || description.trim(),
      shortDescription: shortDescription.trim(),
      retailPrice: Number(retailPrice),
      originalRetailPrice: Number(originalRetailPrice) || undefined,
      wholesalePrice: Number(wholesalePrice),
      wholesaleMOQ: Number(wholesaleMOQ) || 12,
      wholesaleTiers: tiers,
      stock: finalStock,
      isFeatured,
      isNewArrival,
      rating: editingProduct?.rating ?? 4.8,
      reviewsCount: editingProduct?.reviewsCount ?? 12,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      colors: selectedColors,
      sizes: sizesList
    };

    if (editingProduct) {
      AdminStoreService.updateProduct(prodToSave, adminName);
      showToast(`Product "${prodToSave.name}" updated successfully.`);
    } else {
      AdminStoreService.addProduct(prodToSave, adminName);
      showToast(`Product "${prodToSave.name}" added to live catalog.`);
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    const res = AdminStoreService.deleteProduct(id, adminName);
    if (res.success) {
      showToast(res.message);
      setDeleteConfirmId(null);
      onRefresh();
    }
  };

  const handleDuplicate = (id: string) => {
    const dup = AdminStoreService.duplicateProduct(id, adminName);
    if (dup) {
      showToast(`Product duplicated as ${dup.code}`);
      onRefresh();
    }
  };

  // Image upload with automated client-side compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const optimizedBase64 = await compressImageFile(file, 1000, 1000, 0.8);
      if (optimizedBase64) {
        setImages(prev => [...prev.filter(Boolean), optimizedBase64]);
        showToast('Image uploaded and optimized successfully.');
      }
    } catch {
      showToast('Failed to optimize image.');
    }
  };

  // Filtering
  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStock = stockFilter === 'all' || (stockFilter === 'low' && p.stock <= 10 && p.stock > 0) || (stockFilter === 'out' && p.stock <= 0);
    const matchStatus = statusFilter === 'all' || (statusFilter === 'featured' && p.isFeatured) || (statusFilter === 'new-arrival' && p.isNewArrival);
    return matchQ && matchCat && matchStock && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-stone-950 font-sans">Product Catalog Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage {products.length} live products, pricing, wholesale tiers, and variant inventory.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
          />
        </div>

        {/* Dynamic Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans cursor-pointer"
        >
          <option value="all">All Categories ({categoriesList.length})</option>
          {categoriesList.map(c => (
            <option key={c.key} value={c.key}>{c.name} ({c.nameBn})</option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as any)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans cursor-pointer"
        >
          <option value="all">All Stock Statuses</option>
          <option value="low">Low Stock (&le; 10 pcs)</option>
          <option value="out">Out of Stock (0 pcs)</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans cursor-pointer"
        >
          <option value="all">All Status Badges</option>
          <option value="featured">Featured on Home</option>
          <option value="new-arrival">New Arrival Drops</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Info</th>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Retail Price</th>
                <th className="py-3 px-4 text-right">Wholesale (MOQ)</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No products found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=150&q=80'}
                          alt={prod.name}
                          className="w-12 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-stone-900 line-clamp-1">{prod.name}</div>
                          <div className="text-[11px] text-stone-500 font-bangla">{prod.nameBn}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5">{prod.fabric}</div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">
                      {prod.code}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {prod.categoryName || prod.category}
                      </span>
                    </td>

                    {/* Retail Price */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-950">
                      ৳{prod.retailPrice}
                      {prod.originalRetailPrice && prod.originalRetailPrice > prod.retailPrice && (
                        <div className="text-[10px] text-stone-400 line-through">৳{prod.originalRetailPrice}</div>
                      )}
                    </td>

                    {/* Wholesale */}
                    <td className="py-3 px-4 text-right font-mono text-amber-900">
                      <span className="font-bold">৳{prod.wholesalePrice}</span>
                      <span className="text-[10px] text-stone-500 block">MOQ: {prod.wholesaleMOQ || 12} pcs</span>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        prod.stock <= 0 
                          ? 'bg-rose-100 text-rose-800' 
                          : prod.stock <= 10 
                            ? 'bg-amber-100 text-amber-800 animate-pulse' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {prod.stock} pcs
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {prod.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold" title="Featured">
                            Home
                          </span>
                        )}
                        {prod.isNewArrival && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold" title="New Arrival">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(prod.id)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-950">Delete Product Permanently?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete this product? This action will remove it from the customer storefront immediately.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-950">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
                </h3>
                <p className="text-xs text-stone-500">
                  Fill in retail, wholesale, variants, and image details.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Oxford Cotton Casual Shirt"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Product Name (Bangla)</label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="e.g. অক্সফোর্ড কটন ক্যাজুয়াল শার্ট"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">SKU / Product Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SF-SH-101"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Dynamic Category Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={selectedCategoryKey}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCategoryKey(val);
                      const found = categoriesList.find(c => c.key === val);
                      if (found) {
                        setCategoryName(found.name);
                        setCategoryNameBn(found.nameBn);
                      }
                    }}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {categoriesList.map(c => (
                      <option key={c.key} value={c.key}>{c.name} ({c.nameBn})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & MOQ Section */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Retail &amp; Wholesale Pricing Rules
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Retail Price (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Original Price (Strikeout ৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={originalRetailPrice}
                      onChange={(e) => setOriginalRetailPrice(Number(e.target.value))}
                      placeholder="e.g. 950"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">Wholesale Base (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={wholesalePrice}
                      onChange={(e) => setWholesalePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">Wholesale MOQ (Pcs) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={wholesaleMOQ}
                      onChange={(e) => setWholesaleMOQ(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-amber-900"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes Matrix with Stock */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Sizes &amp; Variant Stock Breakdown
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    Total: {sizesList.reduce((s, x) => s + (x.stock || 0), 0)} pcs
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sizesList.map((sz, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-stone-900 text-sm">{sz.size}</span>
                        <button
                          type="button"
                          onClick={() => setSizesList(sizesList.filter((_, i) => i !== idx))}
                          className="text-stone-400 hover:text-rose-600 text-xs"
                        >
                          &times;
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-500">Stock (pcs)</label>
                        <input
                          type="number"
                          min={0}
                          value={sz.stock}
                          onChange={(e) => {
                            const updated = [...sizesList];
                            updated[idx].stock = Number(e.target.value);
                            setSizesList(updated);
                          }}
                          className="w-full px-2 py-1 border border-stone-200 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Available Master Size */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-stone-600">Add Size Variant:</span>
                  <select
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const sName = e.target.value;
                      if (!sizesList.find(s => s.size === sName)) {
                        setSizesList([...sizesList, { size: sName, chestInches: 40, lengthInches: 29, stock: 20 }]);
                      }
                      e.target.value = '';
                    }}
                    className="px-2 py-1 bg-white border border-stone-200 rounded text-xs font-mono"
                  >
                    <option value="">+ Select from Master Sizes</option>
                    {masterSizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Color Swatches Matrix */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Color Options ({selectedColors.length} Selected)
                </div>

                <div className="flex flex-wrap gap-2">
                  {masterColors.map((col, idx) => {
                    const isSelected = selectedColors.some(c => c.name === col.name);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedColors(selectedColors.filter(c => c.name !== col.name));
                          } else {
                            setSelectedColors([...selectedColors, col]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                          isSelected ? 'bg-white border-amber-500 shadow-xs ring-1 ring-amber-400' : 'bg-stone-100 border-stone-200 opacity-60'
                        }`}
                      >
                        <div style={{ backgroundColor: col.hex }} className="w-3.5 h-3.5 rounded-full border border-stone-300" />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Images Section */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Product Photography &amp; Images
                </div>

                <div className="space-y-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[idx] = e.target.value;
                          setImages(updated);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                      />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-stone-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setImages([...images, ''])}
                      className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                    >
                      + Add Image URL
                    </button>
                    <label className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Fabric & Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fabric &amp; Composition</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Combed Cotton"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fabric (Bangla)</label>
                  <input
                    type="text"
                    value={fabricBn}
                    onChange={(e) => setFabricBn(e.target.value)}
                    placeholder="e.g. ১০০% কম্বড কটন"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Description (Bangla)</label>
                  <textarea
                    rows={3}
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                  />
                </div>
              </div>

              {/* Badges & Tags */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-200">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600"
                    />
                    <span className="text-xs font-bold text-stone-800">Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600"
                    />
                    <span className="text-xs font-bold text-stone-800">Mark as New Arrival Drop</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Create Product'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
