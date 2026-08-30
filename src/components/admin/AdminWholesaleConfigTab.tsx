import React, { useState } from 'react';
import { 
  Factory, 
  Boxes, 
  CheckCircle2, 
  Save, 
  Sliders, 
  Percent, 
  Phone, 
  MessageSquare, 
  ArrowRight,
  TrendingDown,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Product, WholesaleInquiry } from '../../types';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminWholesaleConfigTabProps {
  products: Product[];
  wholesaleOrders: WholesaleInquiry[];
  onRefresh: () => void;
  adminName: string;
}

export const AdminWholesaleConfigTab: React.FC<AdminWholesaleConfigTabProps> = ({
  products,
  wholesaleOrders,
  onRefresh,
  adminName
}) => {
  const currentSettings = AdminStoreService.getSettings();
  const [globalMOQ, setGlobalMOQ] = useState<number>(currentSettings.globalWholesaleMOQ || 12);
  const [defaultDiscount, setDefaultDiscount] = useState<number>(currentSettings.defaultWholesaleDiscountPercent || 40);
  const [wholesalePhone, setWholesalePhone] = useState<string>(currentSettings.wholesalePhone || '01612241112');
  const [factoryAddress, setFactoryAddress] = useState<string>(currentSettings.factoryAddress || 'Ashulia Industrial Zone, Savar, Dhaka');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveWholesaleConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentSettings,
      globalWholesaleMOQ: Number(globalMOQ),
      defaultWholesaleDiscountPercent: Number(defaultDiscount),
      wholesalePhone,
      factoryAddress
    };
    AdminStoreService.saveSettings(updated, adminName);
    showToast('Global Wholesale & MOQ configuration saved! Storefront updated in real-time.');
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
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-indigo-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Wholesale MOQ &amp; Factory Rules</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Set global minimum order quantities, factory bulk tier rules, and wholesale hotline routing.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-bold font-mono">
          Global MOQ: {globalMOQ} Pieces
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSaveWholesaleConfig} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">
          Master Wholesale Settings
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Global Wholesale Minimum Order Quantity (MOQ) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={1}
                value={globalMOQ}
                onChange={(e) => setGlobalMOQ(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm font-mono font-bold text-indigo-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-medium">
                Pieces / Order
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              This governs the minimum quantity validation in the Wholesale calculator and cart across the entire website.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Average Factory Wholesale Margin Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={10}
                max={80}
                value={defaultDiscount}
                onChange={(e) => setDefaultDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-medium">
                % Below Retail
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Used when calculating wholesale price estimates for showroom and shop owners.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Dedicated Wholesale &amp; Factory Hotline Phone
            </label>
            <input
              type="text"
              required
              value={wholesalePhone}
              onChange={(e) => setWholesalePhone(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Direct phone number displayed on wholesale cards, inquiry buttons, and quick dialers.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Factory &amp; Showroom Dispatch Address
            </label>
            <input
              type="text"
              required
              value={factoryAddress}
              onChange={(e) => setFactoryAddress(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Displayed in wholesale trust badges and dispatch location headers.
            </p>
          </div>

        </div>

        <div className="flex justify-end pt-4 border-t border-stone-200">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Wholesale Rules</span>
          </button>
        </div>
      </form>

      {/* Catalog Wholesale MOQ Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Product Wholesale Pricing &amp; MOQ Matrix ({products.length} Products)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
              <tr>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Retail Price</th>
                <th className="py-2.5 px-3">Base Wholesale</th>
                <th className="py-2.5 px-3">Active MOQ</th>
                <th className="py-2.5 px-3">Volume Discount Tiers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-stone-900">{p.name}</div>
                    <div className="font-mono text-[10px] text-stone-500">SKU: {p.code}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-700">৳{p.retailPrice}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-900">৳{p.wholesalePrice}</td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className="bg-stone-100 px-2 py-0.5 rounded font-bold">{p.wholesaleMOQ || globalMOQ} pcs</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.wholesaleTiers && p.wholesaleTiers.length > 0 ? (
                        p.wholesaleTiers.map((t, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-indigo-100">
                            {t.label || `${t.minQty}+ pcs`}: ৳{t.pricePerPiece}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-400 text-[11px]">Standard rate</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
