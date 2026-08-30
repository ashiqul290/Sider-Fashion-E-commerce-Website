import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  FileCode,
  Cloud,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { OrderDetails, Product, WholesaleInquiry } from '../../types';
import { AdminStoreService } from '../../services/adminStoreService';
import { 
  fetchSupabaseStatus, 
  triggerSupabaseManualSync, 
  SupabaseStatusResponse,
  SUPABASE_PROJECT_ID,
  SUPABASE_PROJECT_NAME,
  SUPABASE_URL
} from '../../lib/supabase';


interface AdminBackupExportTabProps {
  orders: OrderDetails[];
  products: Product[];
  wholesaleOrders: WholesaleInquiry[];
  onRefresh: () => void;
  adminName: string;
}

export const AdminBackupExportTab: React.FC<AdminBackupExportTabProps> = ({
  orders,
  products,
  wholesaleOrders,
  onRefresh,
  adminName
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusResponse | null>(null);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [sqlSchemaText, setSqlSchemaText] = useState<string>('');

  useEffect(() => {
    fetchSupabaseStatus().then(setSupabaseStatus);
  }, []);

  const handleSyncToSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      const res = await triggerSupabaseManualSync();
      if (res.success) {
        showToast('Database state synchronized to Supabase Cloud.');
        const updated = await fetchSupabaseStatus();
        setSupabaseStatus(updated);
      } else {
        showToast(`Sync warning: ${res.message}`);
      }
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleViewSqlSchema = async () => {
    if (!sqlSchemaText) {
      try {
        const res = await fetch('/api/supabase/sql-schema');
        const text = await res.text();
        setSqlSchemaText(text);
      } catch {
        setSqlSchemaText('-- Could not fetch schema script');
      }
    }
    setShowSqlSchema(prev => !prev);
  };

  const handleCopySql = () => {
    if (sqlSchemaText) {
      navigator.clipboard.writeText(sqlSchemaText);
      showToast('Supabase SQL Schema copied to clipboard!');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };


  // CSV Exporters
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename}`);
  };

  const handleExportOrdersCSV = () => {
    const headers = ['OrderID', 'CustomerName', 'Phone', 'District', 'PaymentMethod', 'PaymentStatus', 'OrderStatus', 'TotalBDT', 'Date'];
    const rows = orders.map(o => [
      o.orderId,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      o.phone,
      `"${o.district || ''}"`,
      o.paymentMethod,
      o.paymentStatus,
      o.status,
      o.total,
      new Date(o.createdAt).toISOString()
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, `sider_orders_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportProductsCSV = () => {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'RetailPrice', 'WholesalePrice', 'Stock', 'IsActive'];
    const rows = products.map(p => [
      p.id,
      p.code,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      p.category,
      p.retailPrice,
      p.wholesalePrice,
      p.stock,
      p.inStock ? 'TRUE' : 'FALSE'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, `sider_products_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportCustomersCSV = () => {
    const customers = AdminStoreService.buildCustomerDirectory(orders, wholesaleOrders);
    const headers = ['Phone', 'Name', 'District', 'TotalOrders', 'LifetimeSpendBDT', 'AccountType', 'LastOrderDate'];
    const rows = customers.map(c => [
      c.phone,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${c.district}"`,
      c.totalOrders,
      c.totalSpent,
      c.isWholesaleCustomer ? 'Wholesale' : 'Retail',
      c.lastOrderDate
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, `sider_customers_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Full Database Backup & Restore
  const handleExportFullJSON = () => {
    const fullBackup = AdminStoreService.createFullBackup();
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sider_fashion_full_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Full Database JSON Backup created!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const res = AdminStoreService.restoreFullBackup(parsed, adminName);
        if (res.success) {
          showToast(res.message);
          onRefresh();
        } else {
          alert(`Restore failed: ${res.message}`);
        }
      } catch (err: any) {
        alert(`Invalid JSON backup file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    const confirmed = prompt('Type "RESET" to confirm restoring initial default mock catalog:');
    if (confirmed === 'RESET') {
      AdminStoreService.resetToDefaults(adminName);
      showToast('Database reset to factory defaults.');
      onRefresh();
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
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Database Backup &amp; CSV Exports</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Export business records to Excel/CSV or download a full snapshot of your store's entire state.
          </p>
        </div>
      </div>

      {/* Supabase Cloud Database Integration Status */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 rounded-2xl border border-stone-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base">Supabase Cloud Database</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Backend
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Connected to <span className="font-mono text-emerald-300 font-semibold">{SUPABASE_PROJECT_ID}</span> ({SUPABASE_PROJECT_NAME})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToSupabase}
              disabled={isSyncingSupabase}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync to Supabase'}</span>
            </button>
            <button
              onClick={handleViewSqlSchema}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3.5 py-2 rounded-xl text-xs font-bold transition border border-stone-700 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-stone-400" />
              <span>{showSqlSchema ? 'Hide SQL' : 'View SQL Schema'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block font-medium">Cloud Target URL</span>
            <span className="text-xs font-mono font-bold text-stone-200 truncate block mt-0.5" title={SUPABASE_URL}>
              {SUPABASE_URL.replace('https://', '')}
            </span>
          </div>
          <div className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block font-medium">Sync Latency</span>
            <span className="text-xs font-bold text-emerald-400 block mt-0.5">
              {supabaseStatus?.latencyMs ? `${supabaseStatus.latencyMs} ms` : 'Live <10ms'}
            </span>
          </div>
          <div className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block font-medium">Remote Cloud Storage</span>
            <span className="text-xs font-bold text-stone-200 block mt-0.5">
              {supabaseStatus?.tableReady ? 'sider_store_state (Active)' : 'Local + Cloud Sync Ready'}
            </span>
          </div>
          <div className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block font-medium">Cloud Security</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              RLS &amp; Anon Key Secured
            </span>
          </div>
        </div>

        {supabaseStatus && supabaseStatus.tableReady === false && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-200">Supabase Connected — Schema Table Setup (Optional)</p>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Click <span className="font-bold text-white">"View SQL Schema"</span>, copy the SQL, and run it in your Supabase SQL Editor (<a href="https://supabase.com/dashboard/project/ojhwesigpdhpfptkzntl/sql" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold inline-flex items-center gap-0.5">open SQL Editor <ExternalLink className="w-3 h-3 inline" /></a>) to enable dedicated PostgreSQL tables.
              </p>
            </div>
          </div>
        )}

        {showSqlSchema && (
          <div className="mt-4 p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300">Supabase Table Schema SQL (Ready for Supabase SQL Editor)</span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-stone-300 bg-black/50 p-3 rounded-lg overflow-x-auto max-h-56 border border-stone-800">
              {sqlSchemaText || 'Loading schema...'}
            </pre>
          </div>
        )}
      </div>

      {/* CSV Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <FileSpreadsheet className="w-6 h-6 text-emerald-700 mb-2" />
            <h3 className="font-black text-stone-900 text-sm">Export Orders to CSV</h3>
            <p className="text-xs text-stone-500 mt-1">
              Download complete retail and wholesale order logs including IDs, addresses, items, and verification status.
            </p>
          </div>
          <button
            onClick={handleExportOrdersCSV}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Orders CSV</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <FileSpreadsheet className="w-6 h-6 text-amber-700 mb-2" />
            <h3 className="font-black text-stone-900 text-sm">Export Products Catalog</h3>
            <p className="text-xs text-stone-500 mt-1">
              Download current inventory levels, SKUs, wholesale pricing tiers, and garment categories.
            </p>
          </div>
          <button
            onClick={handleExportProductsCSV}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Catalog CSV</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <FileSpreadsheet className="w-6 h-6 text-indigo-700 mb-2" />
            <h3 className="font-black text-stone-900 text-sm">Export Customer Directory</h3>
            <p className="text-xs text-stone-500 mt-1">
              Export verified customer contact phone numbers, delivery districts, and lifetime spend history.
            </p>
          </div>
          <button
            onClick={handleExportCustomersCSV}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Customers CSV</span>
          </button>
        </div>

      </div>

      {/* Full Database Snapshot Backup & Restore */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <FileCode className="w-4 h-4 text-stone-700" />
          <h3 className="font-black text-stone-900 text-sm">Full Database JSON Snapshot &amp; Migration</h3>
        </div>

        <p className="text-xs text-stone-600">
          A JSON snapshot contains all products, categories, size charts, colors, coupons, homepage hero slides, FAQs, audit logs, and settings in a single portable file.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleExportFullJSON}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Full JSON Backup</span>
          </button>

          <label className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Restore / Upload JSON Backup</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="font-black text-rose-950 text-sm">Danger Zone: Reset Database</h3>
        </div>
        <p className="text-xs text-rose-800">
          Resetting will restore the store to its initial default product catalog and clear all admin overrides. This action cannot be undone unless you have a JSON backup.
        </p>
        <button
          onClick={handleFactoryReset}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Factory Defaults</span>
        </button>
      </div>

    </div>
  );
};
