import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MessageSquare, 
  MapPin, 
  DollarSign, 
  ShoppingBag, 
  Factory, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { OrderDetails, WholesaleInquiry } from '../../types';
import { CustomerProfile } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminCustomersTabProps {
  orders: OrderDetails[];
  wholesaleOrders: WholesaleInquiry[];
  onRefresh: () => void;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  orders,
  wholesaleOrders
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'wholesale' | 'repeat'>('all');
  
  const customers = AdminStoreService.buildCustomerDirectory(orders, wholesaleOrders);

  const filtered = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.businessName && c.businessName.toLowerCase().includes(q)) || c.district.toLowerCase().includes(q);
    const matchFilter = customerFilter === 'all' || 
      (customerFilter === 'wholesale' && c.isWholesaleCustomer) || 
      (customerFilter === 'repeat' && c.totalOrders > 1);
    return matchQ && matchFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Customer Intelligence Directory</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Auto-aggregated buyer profiles derived directly from verified customer orders and wholesale inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500">Unique Buyers:</span>
          <span className="px-3 py-1 bg-stone-100 text-stone-950 font-black rounded-xl text-xs font-mono">
            {customers.length} Accounts
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, district, or business name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value as any)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="all">All Registered Customers</option>
          <option value="repeat">Repeat Buyers (&gt; 1 Order)</option>
          <option value="wholesale">Wholesale &amp; Bulk Buyers</option>
        </select>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer Name &amp; Business</th>
                <th className="py-3 px-4">Phone &amp; WhatsApp</th>
                <th className="py-3 px-4">District &amp; Address</th>
                <th className="py-3 px-4 text-center">Total Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr key={cust.normalizedPhone} className="hover:bg-stone-50/70 transition-colors">
                    
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-950 text-sm">{cust.name}</div>
                      {cust.businessName && (
                        <div className="text-[11px] text-indigo-900 font-medium">{cust.businessName}</div>
                      )}
                      <div className="text-[10px] text-stone-400">
                        Last Active: {new Date(cust.lastOrderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                      <div>{cust.phone}</div>
                      {cust.whatsappNumber && cust.whatsappNumber !== cust.phone && (
                        <div className="text-[10px] text-stone-500 font-sans">WA: {cust.whatsappNumber}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">{cust.district}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-xs">{cust.fullAddress}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-stone-100 px-2.5 py-1 rounded-lg font-mono font-black text-stone-900 text-xs">
                        {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-amber-900 text-sm">
                      ৳{cust.totalSpent.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      {cust.isWholesaleCustomer ? (
                        <span className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Wholesale Partner
                        </span>
                      ) : (
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-medium">
                          Retail Customer
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${cust.phone}`}
                          className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/880${(cust.whatsappNumber || cust.phone || '').replace(/\D/g, '').replace(/^0+/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                          title="Open WhatsApp Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
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
