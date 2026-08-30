import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock, 
  Phone, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Eye,
  MessageSquare
} from 'lucide-react';
import { OrderDetails, WholesaleInquiry } from '../../types';
import { AdminStoreService } from '../../services/adminStoreService';
import { OrderService } from '../../services/orderService';

interface AdminSuspiciousOrdersTabProps {
  orders: OrderDetails[];
  wholesaleOrders: WholesaleInquiry[];
  onRefresh: () => void;
  adminName: string;
}

export const AdminSuspiciousOrdersTab: React.FC<AdminSuspiciousOrdersTabProps> = ({
  orders,
  wholesaleOrders,
  onRefresh,
  adminName
}) => {
  const flags = AdminStoreService.analyzeSuspiciousOrders(orders, wholesaleOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleMarkSafe = (orderId: string) => {
    OrderService.updateOrderStatus(orderId, 'Processing', adminName, 'Marked safe by admin after manual review');
    showToast(`Order #${orderId} marked safe and confirmed.`);
    onRefresh();
  };

  const handleCancelSuspicious = (orderId: string) => {
    const reason = prompt('Cancellation Reason for Suspicious Activity:', 'Duplicate / Fraudulent Transaction details');
    if (reason) {
      OrderService.updateOrderStatus(orderId, 'Cancelled', adminName, reason);
      showToast(`Order #${orderId} cancelled.`);
      onRefresh();
    }
  };

  const filteredFlags = flags.filter(f => {
    const q = searchQuery.toLowerCase().trim();
    return !q || f.orderId.toLowerCase().includes(q) || f.customerName.toLowerCase().includes(q) || f.phone.includes(q);
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
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Suspicious &amp; High-Risk Orders Detection</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated intelligence engine detects duplicate TrxIDs, rapid order velocities, and abnormal quantities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500">Flagged Count:</span>
          <span className="px-3 py-1 bg-rose-600 text-white font-black rounded-xl text-xs font-mono">
            {flags.length} High-Risk Orders
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <Search className="w-4 h-4 text-stone-400 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search flagged orders by ID, Customer Name, or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
        />
      </div>

      {/* Flags List */}
      <div className="space-y-3">
        {filteredFlags.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-emerald-700 text-xs flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <span className="font-bold">No suspicious or duplicate transactions detected.</span>
            <span className="text-stone-400">All customer checkout orders pass safety checks.</span>
          </div>
        ) : (
          filteredFlags.map((flag) => {
            const relatedOrder = orders.find(o => o.orderId === flag.orderId);
            return (
              <div 
                key={flag.orderId}
                className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-rose-950 text-sm">{flag.orderId}</span>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      {flag.severity} RISK
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {flag.customerName} ({flag.phone})
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-400 font-mono">
                    Flagged: {new Date(flag.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Reasons List */}
                <div className="space-y-1.5 bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                  <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Risk Factors Detected:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-950 space-y-0.5 font-medium">
                    {flag.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Related Order Details Preview */}
                {relatedOrder && (
                  <div className="text-xs text-stone-600 flex flex-wrap items-center gap-4 bg-stone-50 p-2.5 rounded-xl">
                    <div>Payment: <strong>{relatedOrder.paymentMethod.toUpperCase()}</strong> ({relatedOrder.paymentStatus})</div>
                    <div>Total: <strong className="font-mono text-stone-900">৳{relatedOrder.total}</strong></div>
                    <div>District: <strong>{relatedOrder.district}</strong></div>
                    {relatedOrder.transactionId && <div>TrxID: <strong className="font-mono">{relatedOrder.transactionId}</strong></div>}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleCancelSuspicious(flag.orderId)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Cancel / Reject Order
                  </button>
                  <button
                    onClick={() => handleMarkSafe(flag.orderId)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Mark Safe &amp; Process
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
