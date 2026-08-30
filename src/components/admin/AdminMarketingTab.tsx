import React, { useState } from 'react';
import { 
  TrendingUp, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  DollarSign, 
  Percent, 
  Calendar, 
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Coupon, MarketingCampaign } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminMarketingTabProps {
  onRefresh: () => void;
  adminName: string;
}

export const AdminMarketingTab: React.FC<AdminMarketingTabProps> = ({
  onRefresh,
  adminName
}) => {
  const [subTab, setSubTab] = useState<'coupons' | 'attribution'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>(AdminStoreService.getCoupons());
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(AdminStoreService.getCampaigns());

  // Coupon Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(100);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(1000);
  const [maxDiscount, setMaxDiscount] = useState<number>(300);
  const [scope, setScope] = useState<'all' | 'retail' | 'wholesale'>('all');
  const [isActive, setIsActive] = useState(true);

  // Campaign Modal
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campName, setCampName] = useState('');
  const [campSource, setCampSource] = useState('Facebook Ads');
  const [campSpend, setCampSpend] = useState<number>(2000);
  const [campVisitors, setCampVisitors] = useState<number>(500);
  const [campOrders, setCampOrders] = useState<number>(15);
  const [campRevenue, setCampRevenue] = useState<number>(14000);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenCouponCreate = () => {
    setEditingCoupon(null);
    setCode('SUMMER100');
    setDiscountType('fixed');
    setDiscountValue(100);
    setMinOrderAmount(1200);
    setMaxDiscount(300);
    setScope('retail');
    setIsActive(true);
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const toSave: Coupon = {
      id: editingCoupon ? editingCoupon.id : `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
      isActive,
      timesUsed: editingCoupon ? editingCoupon.timesUsed : 0,
      applicableScope: scope,
      createdAt: editingCoupon ? editingCoupon.createdAt : new Date().toISOString()
    };

    if (editingCoupon) {
      AdminStoreService.updateCoupon(toSave, adminName);
      showToast(`Coupon "${toSave.code}" updated.`);
    } else {
      AdminStoreService.addCoupon(toSave, adminName);
      showToast(`Coupon "${toSave.code}" created.`);
    }

    setCoupons(AdminStoreService.getCoupons());
    setIsCouponModalOpen(false);
    onRefresh();
  };

  const handleDeleteCoupon = (id: string) => {
    AdminStoreService.deleteCoupon(id, adminName);
    setCoupons(AdminStoreService.getCoupons());
    showToast('Coupon removed.');
    onRefresh();
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) return;

    const camp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      campaignName: campName.trim(),
      source: campSource,
      adSpend: Number(campSpend),
      visitorsCount: Number(campVisitors),
      ordersCount: Number(campOrders),
      revenueGenerated: Number(campRevenue),
      createdAt: new Date().toISOString()
    };

    AdminStoreService.addCampaign(camp, adminName);
    setCampaigns(AdminStoreService.getCampaigns());
    setIsCampaignModalOpen(false);
    showToast('Campaign metrics logged!');
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
          <h2 className="text-xl font-black text-stone-950 font-sans">Marketing, Coupons &amp; Ad Attribution</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage discount voucher codes, track ad spend, and measure ROAS on Facebook &amp; WhatsApp campaigns.
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSubTab('coupons')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subTab === 'coupons' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setSubTab('attribution')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subTab === 'attribution' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Campaigns &amp; ROAS ({campaigns.length})
          </button>
        </div>
      </div>

      {/* SubTab 1: Coupons */}
      {subTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenCouponCreate}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((cpn) => (
              <div key={cpn.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-lg text-amber-900 tracking-wider bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {cpn.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cpn.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                      {cpn.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-stone-900">
                    Discount: {cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `৳${cpn.discountValue} FLAT OFF`}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Min Order: <strong className="font-mono text-stone-700">৳{cpn.minOrderAmount}</strong> • Scope: <strong className="uppercase">{cpn.applicableScope}</strong>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Used: <strong className="font-mono text-stone-700">{cpn.timesUsed} times</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => {
                      const updated = { ...cpn, isActive: !cpn.isActive };
                      AdminStoreService.updateCoupon(updated, adminName);
                      setCoupons(AdminStoreService.getCoupons());
                      showToast(`Coupon ${cpn.code} status toggled.`);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    {cpn.isActive ? 'Disable' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(cpn.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Marketing Attribution & ROAS */}
      {subTab === 'attribution' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Ad Campaign</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Campaign Name &amp; Channel</th>
                    <th className="py-3 px-4 text-right">Ad Spend (৳)</th>
                    <th className="py-3 px-4 text-right">Visitors</th>
                    <th className="py-3 px-4 text-right">Orders Generated</th>
                    <th className="py-3 px-4 text-right">Revenue (৳)</th>
                    <th className="py-3 px-4 text-right">Calculated ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {campaigns.map((cmp) => {
                    const roas = cmp.adSpend > 0 ? (cmp.revenueGenerated / cmp.adSpend).toFixed(2) : 'Organic';
                    return (
                      <tr key={cmp.id} className="hover:bg-stone-50/70">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{cmp.campaignName}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{cmp.source}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-700">
                          ৳{cmp.adSpend.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-stone-600">
                          {cmp.visitorsCount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-800">
                          {cmp.ordersCount} orders
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-amber-900 text-sm">
                          ৳{cmp.revenueGenerated.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono">
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${
                            typeof roas === 'string' 
                              ? 'bg-purple-100 text-purple-900' 
                              : Number(roas) >= 4 
                                ? 'bg-emerald-100 text-emerald-900' 
                                : 'bg-amber-100 text-amber-900'
                          }`}>
                            {typeof roas === 'string' ? roas : `${roas}x ROAS`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">
                {editingCoupon ? 'Edit Coupon' : 'Create Voucher Coupon'}
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SIDER100"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="fixed">Fixed Amount (৳)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Minimum Order Spend (৳) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Applicable Scope</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="all">All Orders (Retail &amp; Wholesale)</option>
                  <option value="retail">Retail Orders Only</option>
                  <option value="wholesale">Wholesale Orders Only</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">Log Marketing Campaign</h3>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Eid Drop Savar Video Ad"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Traffic Channel</label>
                <select
                  value={campSource}
                  onChange={(e) => setCampSource(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Instagram Ads">Instagram Ads</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Organic Page">Organic Page Live</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ad Spend (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={campSpend}
                    onChange={(e) => setCampSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Orders Generated</label>
                  <input
                    type="number"
                    min={0}
                    value={campOrders}
                    onChange={(e) => setCampOrders(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Total Revenue (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={campRevenue}
                  onChange={(e) => setCampRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
                >
                  Log Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
