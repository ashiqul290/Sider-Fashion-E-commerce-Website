import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Phone, 
  ShieldCheck, 
  Copy, 
  ExternalLink,
  DollarSign,
  User,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { OrderDetails, WholesaleInquiry, PaymentStatus } from '../../types';
import { OrderService } from '../../services/orderService';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminPaymentVerificationTabProps {
  orders: OrderDetails[];
  wholesaleOrders: WholesaleInquiry[];
  onRefresh: () => void;
  adminName: string;
}

export const AdminPaymentVerificationTab: React.FC<AdminPaymentVerificationTabProps> = ({
  orders,
  wholesaleOrders,
  onRefresh,
  adminName
}) => {
  const [filterMethod, setFilterMethod] = useState<'all' | 'bkash' | 'nagad'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Combine prepaid orders
  const prepaidRetail = orders.filter(o => o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad');

  // Duplicate Transaction ID Analysis
  const duplicateTrxMap = useMemo(() => {
    const map = new Map<string, string[]>();
    prepaidRetail.forEach(o => {
      if (o.transactionId && o.transactionId.trim() && o.transactionId !== 'NOT ENTERED') {
        const clean = o.transactionId.trim().toUpperCase();
        const list = map.get(clean) || [];
        list.push(o.orderId);
        map.set(clean, list);
      }
    });
    return map;
  }, [prepaidRetail]);

  const duplicateTrxCount = useMemo(() => {
    let count = 0;
    duplicateTrxMap.forEach(orderIds => {
      if (orderIds.length > 1) count++;
    });
    return count;
  }, [duplicateTrxMap]);

  // Filtered list
  const filteredList = prepaidRetail.filter(o => {
    const matchMethod = filterMethod === 'all' || o.paymentMethod === filterMethod;
    const matchStatus = filterStatus === 'all' || o.paymentStatus === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || 
      o.orderId.toLowerCase().includes(q) || 
      o.customerName.toLowerCase().includes(q) || 
      o.phone.includes(q) || 
      (o.transactionId && o.transactionId.toLowerCase().includes(q));
    return matchMethod && matchStatus && matchQ;
  });

  const handleVerify = (orderId: string) => {
    const success = OrderService.updatePaymentStatus(orderId, 'Verified', adminName);
    if (success) {
      OrderService.updateOrderStatus(orderId, 'Processing', adminName);
      showToast(`Order #${orderId} verified and moved to Processing!`);
      onRefresh();
    }
  };

  const handleReject = (orderId: string) => {
    const reason = prompt('Please enter rejection reason (e.g. Invalid TrxID or Amount mismatch):', 'Transaction not found on merchant statement');
    if (reason !== null) {
      OrderService.updatePaymentStatus(orderId, 'Failed', adminName);
      showToast(`Payment rejected for Order #${orderId}`);
      onRefresh();
    }
  };

  const handleSetPending = (orderId: string) => {
    OrderService.updatePaymentStatus(orderId, 'Verification Pending', adminName);
    showToast(`Order #${orderId} set back to Verification Pending`);
    onRefresh();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied "${text}" to clipboard`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Duplicate TrxID Alert Banner */}
      {duplicateTrxCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 space-y-1">
            <strong className="block font-black text-rose-950 text-sm">
              Critical Warning: {duplicateTrxCount} Duplicate Transaction IDs Detected!
            </strong>
            <p>
              Multiple orders are sharing identical Transaction IDs. Please inspect below for red <strong>DUPLICATE TRX WARNING</strong> badges to prevent fraudulent duplicate fulfillment.
            </p>
          </div>
        </div>
      )}

      {/* Top Warning Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <strong className="block font-bold">Manual Verification Required for bKash &amp; Nagad:</strong>
          <p>
            When a customer submits a TrxID at checkout, it is <strong>NOT</strong> automatically confirmed. 
            Compare the submitted TrxID, sender last 4 digits, and paid amount against your official bKash Merchant App / Nagad statement before clicking <strong>Verify Payment</strong>.
          </p>
        </div>
      </div>

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-stone-950 font-sans">Payment Verification Center</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit and approve bKash and Nagad mobile financial transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-stone-500 font-bold">Pending Approvals</div>
            <div className="text-base font-black text-amber-700 font-mono">
              {prepaidRetail.filter(o => o.paymentStatus === 'Verification Pending').length} Orders
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search TrxID, Phone, or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
          />
        </div>

        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value as any)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="all">All Payment Channels (bKash &amp; Nagad)</option>
          <option value="bkash">bKash Mobile Banking</option>
          <option value="nagad">Nagad Mobile Banking</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="all">All Verification Statuses</option>
          <option value="Verification Pending">Verification Pending (Action Needed)</option>
          <option value="Verified">Verified / Approved</option>
          <option value="Failed">Failed / Rejected</option>
        </select>
      </div>

      {/* Verification Cards / Table */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-400 text-xs">
            No payments currently match your filter criteria.
          </div>
        ) : (
          filteredList.map((ord) => {
            const cleanTrx = ord.transactionId?.trim().toUpperCase() || '';
            const matchingOrders = cleanTrx && duplicateTrxMap.get(cleanTrx) ? duplicateTrxMap.get(cleanTrx)! : [];
            const isDuplicate = matchingOrders.length > 1;

            return (
              <div 
                key={ord.orderId}
                className={`bg-white p-5 rounded-2xl border transition-all ${
                  isDuplicate 
                    ? 'border-rose-300 ring-2 ring-rose-200 bg-rose-50/20' 
                    : ord.paymentStatus === 'Verification Pending'
                      ? 'border-amber-300 shadow-xs ring-1 ring-amber-200' 
                      : 'border-stone-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Order & Customer Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-sm text-stone-900">{ord.orderId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.paymentMethod === 'bkash' ? 'bg-pink-100 text-pink-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {ord.paymentMethod}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'Verification Pending'
                          ? 'bg-amber-100 text-amber-900 animate-pulse'
                          : ord.paymentStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-rose-100 text-rose-900'
                      }`}>
                        {ord.paymentStatus}
                      </span>

                      {isDuplicate && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Duplicate TrxID ({matchingOrders.length} Orders)</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-700 font-medium">
                      Customer: <strong className="text-stone-950">{ord.customerName}</strong> ({ord.phone}) • {ord.district}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Order Total: <strong className="font-mono text-stone-900">৳{ord.total}</strong> ({ord.items.length} items) • Placed on {new Date(ord.createdAt).toLocaleString()}
                    </div>
                    {isDuplicate && (
                      <div className="text-[11px] font-bold text-rose-700">
                        Other orders with this TrxID: {matchingOrders.filter(id => id !== ord.orderId).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Middle: Submitted Transaction ID & Comparison Box */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Submitted TrxID</span>
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
                        <span className={isDuplicate ? 'text-rose-700 underline font-black' : ''}>
                          {ord.transactionId || 'NOT ENTERED'}
                        </span>
                        {ord.transactionId && (
                          <button
                            onClick={() => handleCopy(ord.transactionId || '')}
                            className="p-1 hover:bg-stone-200 rounded text-stone-500 cursor-pointer"
                            title="Copy TrxID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="border-l border-stone-200 pl-4">
                      <span className="text-[10px] text-stone-400 block font-sans">Sender Phone (Last 4)</span>
                      <div className="font-bold text-stone-900">{ord.senderLast4 ? `****${ord.senderLast4}` : 'N/A'}</div>
                    </div>

                    <div className="border-l border-stone-200 pl-4">
                      <span className="text-[10px] text-stone-400 block font-sans">Expected Amount</span>
                      <div className="font-bold text-stone-950">৳{ord.total}</div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {ord.paymentStatus === 'Verification Pending' ? (
                      <>
                        <button
                          onClick={() => handleVerify(ord.orderId)}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify</span>
                        </button>
                        <button
                          onClick={() => handleReject(ord.orderId)}
                          className="flex items-center gap-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSetPending(ord.orderId)}
                          className="text-xs font-bold text-stone-500 hover:text-amber-800 underline cursor-pointer"
                        >
                          Set to Pending
                        </button>
                        {ord.paymentStatus === 'Failed' && (
                          <button
                            onClick={() => handleVerify(ord.orderId)}
                            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            Verify Anyway
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
