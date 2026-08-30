import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Save, 
  RefreshCw,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { Product } from '../../types';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminInventoryTabProps {
  products: Product[];
  onRefresh: () => void;
  adminName: string;
}

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({
  products,
  onRefresh,
  adminName
}) => {
  const currentSettings = AdminStoreService.getSettings();
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(currentSettings.lowStockThreshold || 10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [adjustingStockMap, setAdjustingStockMap] = useState<Record<string, number>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStockDelta = (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const newStock = Math.max(0, prod.stock + delta);
    const updated: Product = { ...prod, stock: newStock };
    AdminStoreService.updateProduct(updated, adminName);
    showToast(`Stock updated for ${prod.name}: ${newStock} pcs`);
    onRefresh();
  };

  const handleSaveThreshold = () => {
    const updated = { ...currentSettings, lowStockThreshold: Number(lowStockThreshold) };
    AdminStoreService.saveSettings(updated, adminName);
    showToast(`Low stock threshold updated to ${lowStockThreshold} pcs.`);
    onRefresh();
  };

  const filtered = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    const matchStock = filterStock === 'all' || 
      (filterStock === 'low' && p.stock <= lowStockThreshold && p.stock > 0) || 
      (filterStock === 'out' && p.stock <= 0);
    return matchQ && matchStock;
  });

  const lowStockCount = products.filter(p => p.stock <= lowStockThreshold && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const totalStockUnits = products.reduce((s, p) => s + (p.stock || 0), 0);

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
            <Boxes className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Inventory &amp; Stock Control</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor real-time warehouse inventory, variant stock quantities, and restock alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-stone-100 rounded-xl text-xs font-bold text-stone-800 font-mono">
            Total In-Stock: <strong className="text-stone-950">{totalStockUnits.toLocaleString()} pcs</strong>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Low Stock Items</span>
          <div className="text-xl font-black text-amber-900">{lowStockCount} Products</div>
          <p className="text-[11px] text-stone-400">&le; {lowStockThreshold} pcs remaining</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Out of Stock Items</span>
          <div className="text-xl font-black text-rose-900">{outOfStockCount} Products</div>
          <p className="text-[11px] text-stone-400">Needs immediate manufacturing run</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Threshold Alert</span>
            <div className="text-lg font-black text-stone-900 mt-1">{lowStockThreshold} pcs</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={100}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="w-16 px-2 py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold"
            />
            <button
              onClick={handleSaveThreshold}
              className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by SKU or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value as any)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="all">All Stock Statuses</option>
          <option value="low">Low Stock Alert (&le; {lowStockThreshold} pcs)</option>
          <option value="out">Out of Stock (0 pcs)</option>
        </select>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4">Size Breakdown</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No products found matching stock criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=100&q=80'}
                          alt={prod.name}
                          className="w-10 h-12 rounded-lg object-cover border border-stone-200"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{prod.name}</div>
                          <div className="text-[10px] text-stone-500 font-bangla">{prod.nameBn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-stone-700">{prod.code}</td>

                    <td className="py-3 px-4 text-center font-mono font-black text-sm text-stone-950">
                      {prod.stock} pcs
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.sizes && prod.sizes.length > 0 ? (
                          prod.sizes.map((s, idx) => (
                            <span key={idx} className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-mono">
                              {s.size}: <strong>{s.stock || 0}</strong>
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 text-[10px]">Unified stock</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        prod.stock <= 0 
                          ? 'bg-rose-100 text-rose-800' 
                          : prod.stock <= lowStockThreshold 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {prod.stock <= 0 ? 'Out of Stock' : prod.stock <= lowStockThreshold ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStockDelta(prod.id, -5)}
                          className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer text-[10px] font-bold px-2"
                          title="Reduce 5 pcs"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockDelta(prod.id, -1)}
                          className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                          title="Reduce 1 pc"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleStockDelta(prod.id, 1)}
                          className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                          title="Add 1 pc"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleStockDelta(prod.id, 10)}
                          className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 cursor-pointer text-[10px] font-bold px-2"
                          title="Restock +10 pcs"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleStockDelta(prod.id, 50)}
                          className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 cursor-pointer text-[10px] font-bold px-2"
                          title="Factory batch +50 pcs"
                        >
                          +50
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

    </div>
  );
};
