import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  XCircle, 
  RotateCcw, 
  RefreshCw, 
  Eye, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  User, 
  Download, 
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Printer,
  ChevronDown,
  Layers,
  Factory
} from 'lucide-react';
import { OrderDetails, WholesaleInquiry, OrderStatus, PaymentStatus } from '../../types';
import { OrderService } from '../../services/orderService';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminOrdersTabProps {
  orders: OrderDetails[];
  wholesaleOrders: WholesaleInquiry[];
  onRefresh: () => void;
  adminName: string;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  wholesaleOrders,
  onRefresh,
  adminName
}) => {
  const [orderTypeTab, setOrderTypeTab] = useState<'retail' | 'wholesale'>('retail');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  
  // Selected Order for Full Modal View
  const [selectedRetailOrder, setSelectedRetailOrder] = useState<OrderDetails | null>(null);
  const [selectedWholesaleOrder, setSelectedWholesaleOrder] = useState<WholesaleInquiry | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateRetailStatus = (orderId: string, newStatus: OrderStatus) => {
    const success = OrderService.updateOrderStatus(orderId, newStatus, adminName);
    if (success) {
      showToast(`Order #${orderId} status updated to "${newStatus}"`);
      onRefresh();
      if (selectedRetailOrder && selectedRetailOrder.orderId === orderId) {
        const updatedList = OrderService.getAllOrders();
        const updated = updatedList.find(o => o.orderId === orderId);
        if (updated) setSelectedRetailOrder(updated);
      }
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, newPaymentStatus: PaymentStatus) => {
    const success = OrderService.updatePaymentStatus(orderId, newPaymentStatus, adminName);
    if (success) {
      showToast(`Order #${orderId} payment status updated to "${newPaymentStatus}"`);
      onRefresh();
      if (selectedRetailOrder && selectedRetailOrder.orderId === orderId) {
        const updatedList = OrderService.getAllOrders();
        const updated = updatedList.find(o => o.orderId === orderId);
        if (updated) setSelectedRetailOrder(updated);
      }
    }
  };

  const handleUpdateWholesaleStatus = (inquiryId: string, newStatus: OrderStatus) => {
    const success = OrderService.updateWholesaleStatus(inquiryId, newStatus, adminName);
    if (success) {
      showToast(`Wholesale #${inquiryId} status updated to "${newStatus}"`);
      onRefresh();
      if (selectedWholesaleOrder && selectedWholesaleOrder.id === inquiryId) {
        const updatedList = OrderService.getAllWholesaleInquiries();
        const updated = updatedList.find(w => w.id === inquiryId);
        if (updated) setSelectedWholesaleOrder(updated);
      }
    }
  };

  // Filtered Retail
  const filteredRetailOrders = orders.filter(ord => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || 
      ord.orderId.toLowerCase().includes(q) || 
      ord.customerName.toLowerCase().includes(q) || 
      ord.phone.includes(q) ||
      (ord.transactionId && ord.transactionId.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || ord.orderStatus === statusFilter;
    const matchPay = paymentFilter === 'all' || ord.paymentStatus === paymentFilter;
    return matchQ && matchStatus && matchPay;
  });

  // Filtered Wholesale
  const filteredWholesaleOrders = wholesaleOrders.filter(ws => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || 
      ws.id.toLowerCase().includes(q) || 
      ws.customerName.toLowerCase().includes(q) || 
      ws.phone.includes(q) || 
      ws.productCode.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || ws.orderStatus === statusFilter;
    const matchPay = paymentFilter === 'all' || ws.paymentStatus === paymentFilter;
    return matchQ && matchStatus && matchPay;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[11px] font-bold">Pending</span>;
      case 'Processing':
        return <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md text-[11px] font-bold">Processing</span>;
      case 'Shipped':
        return <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md text-[11px] font-bold">Shipped</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md text-[11px] font-bold">Delivered</span>;
      case 'Cancelled':
        return <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md text-[11px] font-bold">Cancelled</span>;
      case 'Returned':
        return <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-md text-[11px] font-bold">Returned</span>;
      case 'Exchanged':
        return <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md text-[11px] font-bold">Exchanged</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md text-[11px] font-bold">{status}</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
      case 'Verified':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">Paid / Verified</span>;
      case 'Verification Pending':
        return <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">Verification Needed</span>;
      case 'Failed':
        return <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">Failed</span>;
      case 'Refunded':
        return <span className="bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded text-[10px] font-bold">Refunded</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-medium">Pending (COD)</span>;
    }
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
          <h2 className="text-xl font-black text-stone-950 font-sans">Orders &amp; Dispatch Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time fulfillment tracking for retail orders and Savar factory wholesale dispatches.
          </p>
        </div>

        {/* Tab switch between Retail and Wholesale */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setOrderTypeTab('retail')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              orderTypeTab === 'retail' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Retail Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setOrderTypeTab('wholesale')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              orderTypeTab === 'wholesale' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Wholesale Dispatches ({wholesaleOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Phone or TrxID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="all">All Order Statuses</option>
          <option value="Pending">Pending (New)</option>
          <option value="Processing">Processing at Factory</option>
          <option value="Shipped">Shipped / With Courier</option>
          <option value="Delivered">Delivered Successfully</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
          <option value="Exchanged">Exchanged</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="all">All Payment Statuses</option>
          <option value="Verification Pending">Verification Pending (bKash/Nagad)</option>
          <option value="Paid">Paid / Verified</option>
          <option value="Pending">Pending (COD)</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {orderTypeTab === 'retail' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4 text-right">Amount (BDT)</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {filteredRetailOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      No retail orders found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRetailOrders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-stone-50/70 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-amber-900">{ord.orderId}</div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(ord.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{ord.customerName}</div>
                        <div className="font-mono text-[11px] text-stone-600">{ord.phone}</div>
                        <div className="text-[10px] text-stone-400 truncate max-w-xs">{ord.district} • {ord.area}</div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800 line-clamp-1">
                          {ord.items.map(it => `${it.product.code} (${it.selectedSize} x${it.quantity})`).join(', ')}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {ord.items.reduce((s, it) => s + it.quantity, 0)} total pcs
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-black text-stone-950 text-sm">৳{ord.total}</div>
                        <div className="text-[10px] text-stone-400 font-mono">Del: ৳{ord.deliveryFee}</div>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold uppercase text-[11px] text-stone-800">{ord.paymentMethod}</div>
                        <div className="mt-0.5">{getPaymentBadge(ord.paymentStatus)}</div>
                        {ord.transactionId && (
                          <div className="text-[10px] font-mono text-stone-500 mt-0.5">Trx: {ord.transactionId}</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(ord.orderStatus)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedRetailOrder(ord)}
                          className="inline-flex items-center gap-1 bg-stone-100 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Inquiry / Dispatch ID</th>
                  <th className="py-3 px-4">Business &amp; Contact</th>
                  <th className="py-3 px-4">Product &amp; Quantity</th>
                  <th className="py-3 px-4 text-right">Estimated Amount</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {filteredWholesaleOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      No wholesale inquiries found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredWholesaleOrders.map((ws) => (
                    <tr key={ws.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-indigo-900">{ws.id}</div>
                        <div className="text-[10px] text-stone-400">
                          {new Date(ws.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{ws.businessName || ws.customerName}</div>
                        <div className="text-[11px] text-stone-600 font-mono">{ws.phone}</div>
                        <div className="text-[10px] text-stone-400">Contact: {ws.customerName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{ws.productCode} - {ws.productName}</div>
                        <div className="text-[11px] font-mono text-amber-900 font-bold">
                          {ws.targetQuantity} pcs (Tier: ৳{ws.appliedTierPrice || 0}/pc)
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-black text-stone-950 text-sm">
                          ৳{(ws.totalEstimatedAmount || 0).toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-stone-800 font-medium">{ws.district}</div>
                        <div className="text-[10px] text-stone-400 truncate max-w-xs">{ws.area}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(ws.orderStatus || 'Pending')}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedWholesaleOrder(ws)}
                          className="inline-flex items-center gap-1 bg-stone-100 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Retail Order Inspector Modal */}
      {selectedRetailOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg text-amber-900">{selectedRetailOrder.orderId}</span>
                  {getStatusBadge(selectedRetailOrder.orderStatus)}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(selectedRetailOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedRetailOrder(null)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control Bar */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Update Order &amp; Fulfillment Status
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Exchanged'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateRetailStatus(selectedRetailOrder.orderId, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedRetailOrder.orderStatus === st
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="font-bold uppercase tracking-wider text-stone-500">Customer Details</div>
                <div className="text-sm font-black text-stone-900">{selectedRetailOrder.customerName}</div>
                <div className="flex items-center gap-2 text-stone-700 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <a href={`tel:${selectedRetailOrder.phone}`} className="hover:underline">{selectedRetailOrder.phone}</a>
                </div>
                {selectedRetailOrder.whatsappNumber && (
                  <div className="text-stone-500 font-mono text-[11px]">
                    WhatsApp: {selectedRetailOrder.whatsappNumber}
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="font-bold uppercase tracking-wider text-stone-500">Delivery Address</div>
                <div className="text-stone-900 font-medium">{selectedRetailOrder.fullAddress}</div>
                <div className="text-stone-500">
                  {selectedRetailOrder.area}, {selectedRetailOrder.district} (Zone: {selectedRetailOrder.deliveryZone})
                </div>
                {selectedRetailOrder.customerNote && (
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-900 text-[11px] font-medium mt-1">
                    <strong>Customer Note:</strong> {selectedRetailOrder.customerNote}
                  </div>
                )}
              </div>
            </div>

            {/* Itemized Order Products */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700">Itemized Products</div>
              <div className="space-y-2">
                {selectedRetailOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=100&q=80'}
                        alt={item.product.name}
                        className="w-12 h-14 rounded-lg object-cover border border-stone-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-stone-900">{item.product.name}</div>
                        <div className="text-[11px] font-mono text-stone-500">SKU: {item.product.code}</div>
                        <div className="text-[11px] text-stone-600 mt-0.5">
                          Size: <strong>{item.selectedSize}</strong> • Color: <strong>{item.selectedColor.name}</strong> • Qty: <strong>{item.quantity}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-xs text-stone-900">৳{item.product.retailPrice * item.quantity}</div>
                      <div className="text-[10px] text-stone-400">৳{item.product.retailPrice} / piece</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary & Payment Verification */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold uppercase tracking-wider text-stone-700">Payment Breakdown</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase">{selectedRetailOrder.paymentMethod}</span>
                  {getPaymentBadge(selectedRetailOrder.paymentStatus)}
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>৳{selectedRetailOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge:</span>
                  <span>৳{selectedRetailOrder.deliveryFee}</span>
                </div>
                {selectedRetailOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount:</span>
                    <span>-৳{selectedRetailOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-950 font-black text-sm pt-2 border-t border-stone-200">
                  <span>Total Payable:</span>
                  <span>৳{selectedRetailOrder.total}</span>
                </div>
              </div>

              {/* Prepaid details */}
              {(selectedRetailOrder.paymentMethod === 'bkash' || selectedRetailOrder.paymentMethod === 'nagad') && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="font-bold text-amber-900 text-xs">Prepaid Transaction Submitted:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>TrxID: <strong className="text-stone-900">{selectedRetailOrder.transactionId || 'Not Provided'}</strong></div>
                    <div>Sender Last 4: <strong className="text-stone-900">{selectedRetailOrder.senderLast4 || 'N/A'}</strong></div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedRetailOrder.orderId, 'Verified')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Mark Verified / Paid
                    </button>
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedRetailOrder.orderId, 'Failed')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Reject Payment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Audit History Timeline */}
            {selectedRetailOrder.statusHistory && selectedRetailOrder.statusHistory.length > 0 && (
              <div className="space-y-2 text-xs">
                <div className="font-bold uppercase tracking-wider text-stone-500">Status History Timeline</div>
                <div className="space-y-1 border-l-2 border-amber-300 ml-2 pl-3">
                  {selectedRetailOrder.statusHistory.map((h, i) => (
                    <div key={i} className="text-[11px] text-stone-600">
                      <span className="font-bold text-stone-900">{h.status}</span> — {new Date(h.timestamp).toLocaleString()} ({h.changedBy})
                      {h.notes && <span className="text-stone-500 italic block">{h.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRetailOrder(null)}
                className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Wholesale Inquiry Inspector Modal */}
      {selectedWholesaleOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg text-indigo-900">{selectedWholesaleOrder.id}</span>
                  {getStatusBadge(selectedWholesaleOrder.orderStatus || 'Pending')}
                </div>
                <p className="text-xs text-stone-500">
                  Wholesale Factory Dispatch • {new Date(selectedWholesaleOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedWholesaleOrder(null)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Status switcher */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700">Update Wholesale Status</div>
              <div className="flex flex-wrap gap-2">
                {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateWholesaleStatus(selectedWholesaleOrder.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedWholesaleOrder.orderStatus === st
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Business & Order Details */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="font-bold text-stone-900 text-sm">{selectedWholesaleOrder.businessName || 'Wholesale Buyer'}</div>
              <div>Contact Person: <strong>{selectedWholesaleOrder.customerName}</strong></div>
              <div>Phone: <strong className="font-mono">{selectedWholesaleOrder.phone}</strong></div>
              <div>Location: {selectedWholesaleOrder.fullAddress || selectedWholesaleOrder.district}</div>
              <div>Product: <strong>{selectedWholesaleOrder.productCode} - {selectedWholesaleOrder.productName}</strong></div>
              <div>Quantity: <strong className="text-amber-900 font-mono">{selectedWholesaleOrder.targetQuantity} pcs</strong></div>
              <div>Estimated Value: <strong className="text-stone-950 font-mono text-sm">৳{(selectedWholesaleOrder.totalEstimatedAmount || 0).toLocaleString()}</strong></div>
              {selectedWholesaleOrder.additionalMessage && (
                <div className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 mt-2">
                  <strong>Notes / Message:</strong> {selectedWholesaleOrder.additionalMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-200">
              <button
                onClick={() => setSelectedWholesaleOrder(null)}
                className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
