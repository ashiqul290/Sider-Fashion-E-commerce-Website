import React, { useState } from 'react';
import { 
  ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Search, 
  Filter, 
  ExternalLink, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { MediaAsset } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';
import { compressImageFile } from '../../utils/imageCompressor';

interface AdminMediaLibraryTabProps {
  onRefresh: () => void;
  adminName: string;
}

export const AdminMediaLibraryTab: React.FC<AdminMediaLibraryTabProps> = ({
  onRefresh,
  adminName
}) => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>(AdminStoreService.getMedia());
  const [searchQuery, setSearchQuery] = useState('');
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<'product' | 'banner' | 'category' | 'general'>('product');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const optimizedBase64 = await compressImageFile(file, 1000, 1000, 0.8);
      if (optimizedBase64) {
        const newAsset: MediaAsset = {
          id: `med-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: optimizedBase64,
          sizeKb: Math.round(optimizedBase64.length / 1024),
          category: 'product',
          uploadedAt: new Date().toISOString(),
          usedInCount: 0
        };
        AdminStoreService.addMedia(newAsset, adminName);
        setMediaList(AdminStoreService.getMedia());
        showToast('Image uploaded and optimized for Media Library!');
        onRefresh();
      }
    } catch {
      showToast('Failed to optimize image.');
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;

    const newAsset: MediaAsset = {
      id: `med-${Date.now()}`,
      name: newMediaName.trim() || 'Uploaded Web Asset',
      url: newMediaUrl.trim(),
      category: newMediaCategory,
      uploadedAt: new Date().toISOString(),
      usedInCount: 0
    };

    AdminStoreService.addMedia(newAsset, adminName);
    setMediaList(AdminStoreService.getMedia());
    setNewMediaName('');
    setNewMediaUrl('');
    showToast('Asset added to Media Library!');
    onRefresh();
  };

  const handleDelete = (id: string) => {
    const res = AdminStoreService.deleteMedia(id, adminName);
    if (!res.success) {
      alert(res.message);
      return;
    }
    setMediaList(AdminStoreService.getMedia());
    showToast(res.message);
    onRefresh();
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Image URL copied to clipboard!');
  };

  const filtered = mediaList.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    return !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  });

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
            <ImageIcon className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Media &amp; Image Assets Library</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Store and organize high-resolution product photography, factory banners, and promotional graphics.
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Image File</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Add by URL Form */}
      <form onSubmit={handleAddUrl} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Image Name / Title..."
          value={newMediaName}
          onChange={(e) => setNewMediaName(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
        />
        <input
          type="url"
          required
          placeholder="Paste Image URL (https://...)"
          value={newMediaUrl}
          onChange={(e) => setNewMediaUrl(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
        />
        <select
          value={newMediaCategory}
          onChange={(e) => setNewMediaCategory(e.target.value as any)}
          className="px-3 py-2 border border-stone-200 rounded-xl text-xs"
        >
          <option value="product">Product Photo</option>
          <option value="banner">Hero Banner</option>
          <option value="category">Category Card</option>
          <option value="general">General Asset</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
        >
          Add URL
        </button>
      </form>

      {/* Search Bar */}
      <div className="relative bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <Search className="w-4 h-4 text-stone-400 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search media files by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden group flex flex-col justify-between">
            <div className="relative h-40 bg-stone-100 overflow-hidden">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-2 left-2 bg-stone-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                {item.category}
              </span>
            </div>

            <div className="p-3 space-y-1 text-xs">
              <div className="font-bold text-stone-900 line-clamp-1 text-[11px]">{item.name}</div>
              <div className="text-[10px] text-stone-400">
                {new Date(item.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="p-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleCopy(item.url)}
                className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                title="Copy Image URL"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                title="Delete Media"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
