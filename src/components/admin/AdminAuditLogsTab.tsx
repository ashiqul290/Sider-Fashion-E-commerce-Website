import React, { useState } from 'react';
import { 
  FileClock, 
  Search, 
  Trash2, 
  Download, 
  CheckCircle2, 
  User, 
  Layers, 
  Calendar,
  Filter
} from 'lucide-react';
import { AdminAuditLog } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminAuditLogsTabProps {
  onRefresh: () => void;
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({ onRefresh }) => {
  const [logs, setLogs] = useState<AdminAuditLog[]>(AdminStoreService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear old activity logs?')) {
      AdminStoreService.clearAuditLogs();
      setLogs(AdminStoreService.getAuditLogs());
      showToast('Audit logs cleared.');
      onRefresh();
    }
  };

  const filtered = logs.filter(l => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      l.adminName.toLowerCase().includes(q) || 
      l.action.toLowerCase().includes(q) || 
      l.details.toLowerCase().includes(q) ||
      (l.targetId && l.targetId.toLowerCase().includes(q));
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
            <FileClock className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Activity &amp; Security Audit Logs</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable chronological record of admin modifications, order status updates, and inventory changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <Search className="w-4 h-4 text-stone-400 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search activity by admin name, action, or target ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{log.adminName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">
                      {log.targetId || '—'}
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {log.details}
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
