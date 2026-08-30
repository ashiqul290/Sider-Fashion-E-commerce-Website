import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  ArrowUp,
  ArrowDown,
  Tag
} from 'lucide-react';
import { CategoryInfo, RetailCategoryKey } from '../../types';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminCategoriesTabProps {
  onRefresh: () => void;
  adminName: string;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  onRefresh,
  adminName
}) => {
  const [categories, setCategories] = useState<CategoryInfo[]>(AdminStoreService.getCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form Fields
  const [key, setKey] = useState<RetailCategoryKey>('shirt');
  const [customSlug, setCustomSlug] = useState('');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [badge, setBadge] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setKey('shirt');
    setCustomSlug('');
    setName('');
    setNameBn('');
    setImage('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80');
    setDescription('');
    setDescriptionBn('');
    setBadge('');
    setIsUpcoming(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryInfo) => {
    setEditingCategory(cat);
    setKey(cat.key);
    setCustomSlug(cat.key);
    setName(cat.name);
    setNameBn(cat.nameBn);
    setImage(cat.image);
    setDescription(cat.description || '');
    setDescriptionBn(cat.descriptionBn || '');
    setBadge(cat.badge || '');
    setIsUpcoming(!!cat.isUpcoming);
    setIsActive(cat.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenKey = (customSlug.trim() || key) as RetailCategoryKey;

    const catToSave: CategoryInfo = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      key: chosenKey,
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      description,
      descriptionBn,
      badge: badge.trim() || undefined,
      isUpcoming,
      isActive,
      itemCount: editingCategory ? editingCategory.itemCount : 0
    };

    if (editingCategory) {
      AdminStoreService.updateCategory(catToSave, adminName);
      showToast(`Category "${catToSave.name}" updated.`);
    } else {
      AdminStoreService.addCategory(catToSave, adminName);
      showToast(`Category "${catToSave.name}" added to store.`);
    }

    setCategories(AdminStoreService.getCategories());
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    const res = AdminStoreService.deleteCategory(id, adminName);
    if (res.success) {
      showToast(res.message);
      setCategories(AdminStoreService.getCategories());
      onRefresh();
    }
  };

  const handleToggleActive = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const updated = { ...cat, isActive: !cat.isActive };
    AdminStoreService.updateCategory(updated, adminName);
    setCategories(AdminStoreService.getCategories());
    showToast('Category visibility updated.');
    onRefresh();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCategories(updated);
    AdminStoreService.saveCategories(updated);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Category Management</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage storefront navigation categories, promotional badges, and category hero banners.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-36 bg-stone-100 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-transparent"></div>
                
                {cat.badge && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                    {cat.badge}
                  </span>
                )}

                {/* Reorder Buttons */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-stone-900/80 p-1 rounded-lg">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-stone-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Up/Left"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === categories.length - 1}
                    className="p-1 text-stone-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Down/Right"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                  <div className="font-black text-sm">{cat.name}</div>
                  <div className="text-xs text-stone-300 font-bangla">{cat.nameBn}</div>
                </div>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-500">
                  <span>Slug / Key: <strong className="font-mono text-stone-800">{cat.key}</strong></span>
                  {cat.isUpcoming ? (
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">Upcoming</span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Active Live</span>
                  )}
                </div>
                {cat.description && (
                  <p className="text-stone-600 line-clamp-2 text-[11px]">{cat.description}</p>
                )}
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                  cat.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {cat.isActive !== false ? 'Active (Live)' : 'Hidden'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Name (EN) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Traditional Katua"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Name (Bangla)</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="e.g. ঐতিহ্যবাহী কতুয়া"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-bangla"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Key / Slug *</label>
                <input
                  type="text"
                  required
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. mens-katua, polo-shirts"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Badge (e.g. Hot, Sale, New)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Optional badge label"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUpcoming}
                    onChange={(e) => setIsUpcoming(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-800">Mark as Upcoming</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-800">Active Live</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
