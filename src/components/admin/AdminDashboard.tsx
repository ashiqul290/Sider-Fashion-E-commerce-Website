import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  ShieldAlert, 
  Boxes, 
  Factory, 
  Layers, 
  Ruler, 
  Users, 
  Sliders, 
  TrendingUp, 
  ImageIcon, 
  Settings, 
  FileClock, 
  Database, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronRight, 
  Bell, 
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Globe,
  Bot,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { AdminTab, AdminUser, AdminLanguage } from '../../types/adminTypes';
import { Product, OrderDetails, WholesaleInquiry } from '../../types';
import { OrderService } from '../../services/orderService';
import { AdminStoreService } from '../../services/adminStoreService';

// Tabs Components
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminAIDashboard } from './AdminAIDashboard';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminPaymentVerificationTab } from './AdminPaymentVerificationTab';
import { AdminSuspiciousOrdersTab } from './AdminSuspiciousOrdersTab';
import { AdminInventoryTab } from './AdminInventoryTab';
import { AdminWholesaleConfigTab } from './AdminWholesaleConfigTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminSizesColorsTab } from './AdminSizesColorsTab';
import { AdminCustomersTab } from './AdminCustomersTab';
import { AdminHomepageCMSTab } from './AdminHomepageCMSTab';
import { AdminMarketingTab } from './AdminMarketingTab';
import { AdminMediaLibraryTab } from './AdminMediaLibraryTab';
import { AdminBusinessSettingsTab } from './AdminBusinessSettingsTab';
import { AdminAuditLogsTab } from './AdminAuditLogsTab';
import { AdminBackupExportTab } from './AdminBackupExportTab';
import { AdminAccountsTab } from './AdminAccountsTab';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onViewStorefront: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onViewStorefront
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [adminLang, setAdminLang] = useState<AdminLanguage>(AdminStoreService.getAdminLanguage());

  // Live Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [wholesaleOrders, setWholesaleOrders] = useState<WholesaleInquiry[]>([]);

  const loadData = () => {
    setProducts(AdminStoreService.getProducts());
    setOrders(OrderService.getAllOrders());
    setWholesaleOrders(OrderService.getAllWholesaleInquiries());
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const toggleLanguage = () => {
    const next: AdminLanguage = adminLang === 'en' ? 'bn' : 'en';
    AdminStoreService.setAdminLanguage(next);
    setAdminLang(next);
  };

  // Badge calculations
  const pendingPaymentVerifications = orders.filter(
    o => (o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad') && o.paymentStatus === 'Verification Pending'
  ).length;

  const suspiciousCount = AdminStoreService.analyzeSuspiciousOrders(orders, wholesaleOrders).length;
  const lowStockCount = products.filter(p => p.stock <= (AdminStoreService.getSettings().lowStockThreshold || 10) && p.stock > 0).length;
  const processingOrdersCount = orders.filter(o => o.status === 'Processing').length;

  // Navigation Items with Bangla/English support
  const isBn = adminLang === 'bn';

  const navGroups = [
    {
      group: isBn ? 'এআই বিজনেস ইন্টেলিজেন্স' : 'AI Business Intelligence',
      items: [
        { 
          id: 'sider-ai' as AdminTab, 
          label: isBn ? '🤖 সাইডার এআই (Sider AI)' : '🤖 Sider AI', 
          icon: Bot, 
          badge: isBn ? 'নতুন এআই' : 'LIVE AI', 
          badgeColor: 'bg-amber-500 text-stone-950 font-black' 
        },
      ]
    },
    {
      group: isBn ? 'মূল অপারেশন' : 'Core Operations',
      items: [
        { id: 'dashboard' as AdminTab, label: isBn ? 'কন্ট্রোল সেন্টার' : 'Control Center', icon: LayoutDashboard, badge: null },
        { id: 'orders' as AdminTab, label: isBn ? 'অর্ডার প্রসেসিং' : 'Order Processing', icon: ShoppingBag, badge: processingOrdersCount > 0 ? `${processingOrdersCount}` : null, badgeColor: 'bg-amber-500 text-stone-950' },
        { id: 'verification' as AdminTab, label: isBn ? 'পেমেন্ট ভেরিফিকেশন' : 'Payment Verification', icon: CreditCard, badge: pendingPaymentVerifications > 0 ? `${pendingPaymentVerifications}` : null, badgeColor: 'bg-rose-600 text-white' },
        { id: 'suspicious' as AdminTab, label: isBn ? 'রিস্ক ও ফ্রড রাডার' : 'Risk & Fraud Radar', icon: ShieldAlert, badge: suspiciousCount > 0 ? `${suspiciousCount}` : null, badgeColor: 'bg-rose-600 text-white' },
      ]
    },
    {
      group: isBn ? 'ক্যাটালগ ও স্টক' : 'Catalog & Inventory',
      items: [
        { id: 'products' as AdminTab, label: isBn ? 'প্রোডাক্ট ক্যাটালগ' : 'Product Catalog', icon: Package, badge: null },
        { id: 'inventory' as AdminTab, label: isBn ? 'ইনভেন্টরি ও স্টক' : 'Inventory & Stock', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null, badgeColor: 'bg-amber-100 text-amber-900' },
        { id: 'wholesale' as AdminTab, label: isBn ? 'হোলসেল ও পাইকারি' : 'Wholesale & MOQ', icon: Factory, badge: null },
        { id: 'categories' as AdminTab, label: isBn ? 'ক্যাটেগরি সমূহ' : 'Categories', icon: Layers, badge: null },
        { id: 'sizes-colors' as AdminTab, label: isBn ? 'সাইজ ও কালার' : 'Sizes & Colors', icon: Ruler, badge: null },
      ]
    },
    {
      group: isBn ? 'মার্কেটিং ও কাস্টমার' : 'Marketing & Customers',
      items: [
        { id: 'customers' as AdminTab, label: isBn ? 'কাস্টমার ডাটাবেস' : 'Customer Intelligence', icon: Users, badge: null },
        { id: 'cms' as AdminTab, label: isBn ? 'হোমপেজ ও এফএকিউ CMS' : 'Homepage CMS & FAQs', icon: Sliders, badge: null },
        { id: 'marketing' as AdminTab, label: isBn ? 'কুপন ও বিজ্ঞাপন ROAS' : 'Coupons & Ad ROAS', icon: TrendingUp, badge: null },
        { id: 'media' as AdminTab, label: isBn ? 'মিডিয়া ফাইলসমূহ' : 'Media Assets', icon: ImageIcon, badge: null },
      ]
    },
    {
      group: isBn ? 'সিস্টেম ও অ্যাডমিন' : 'Administration & System',
      items: [
        { id: 'accounts' as AdminTab, label: isBn ? 'অ্যাডমিন অ্যাকাউন্টস' : 'Admin & Staff Accounts', icon: ShieldCheck, badge: null },
        { id: 'settings' as AdminTab, label: isBn ? 'বিজনেস সেটিংস' : 'Business Settings', icon: Settings, badge: null },
        { id: 'audit' as AdminTab, label: isBn ? 'অডিট হিস্ট্রি' : 'Audit Trail', icon: FileClock, badge: null },
        { id: 'backup' as AdminTab, label: isBn ? 'ব্যাকআপ ও CSV এক্সপোর্ট' : 'Backup & CSV Export', icon: Database, badge: null },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-stone-800 text-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-black text-sm tracking-wide">SIDER ADMIN</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="text-xs bg-stone-800 text-stone-200 hover:text-white px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>{adminLang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
          <button
            onClick={onViewStorefront}
            className="text-xs bg-amber-500 text-stone-950 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation (Desktop + Mobile Drawer) */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-stone-950 text-stone-300 flex flex-col justify-between
            transform transition-transform duration-200 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            border-r border-stone-800
          `}
        >
          {/* Logo & Admin Status */}
          <div>
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-base shadow-xs">
                  S
                </div>
                <div>
                  <h1 className="font-black text-white text-sm tracking-wide">SIDER FASHION</h1>
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Master Admin Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin User Card */}
            <div className="px-5 py-3.5 bg-stone-900/60 border-b border-stone-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser?.name || 'Sider Admin'}</div>
                <div className="text-[10px] text-amber-400 font-medium capitalize">{(currentUser?.role || 'super_admin').replace(/_/g, ' ')}</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
            </div>

            {/* Nav Groups & Links */}
            <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-500 font-mono">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                          ${isActive 
                            ? 'bg-amber-500 text-stone-950 shadow-xs font-black' 
                            : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'}
                        `}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${item.badgeColor || 'bg-stone-800 text-stone-300'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-stone-800 space-y-2 bg-stone-950">
            <button
              onClick={onViewStorefront}
              className="w-full flex items-center justify-center gap-2 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? 'কাস্টমার ওয়েবসাইট দেখুন' : 'Customer Website'}</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগআউট করুন' : 'Sign Out Admin'}</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-950/60 z-30 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto min-h-screen">
          
          {/* Top Bar for Desktop */}
          <header className="hidden lg:flex bg-white border-b border-stone-200 px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{isBn ? 'সক্রিয় সেকশন:' : 'Active Workspace:'}</span>
              <span className="text-sm font-black text-stone-900 capitalize">
                {navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Change Admin Language"
              >
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span>{adminLang === 'en' ? 'বাংলা সংস্করণ' : 'English View'}</span>
              </button>

              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Refresh Store Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isBn ? 'ডাটা সিঙ্ক' : 'Sync Data'}</span>
              </button>

              <button
                onClick={onViewStorefront}
                className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>{isBn ? 'লাইভ ওয়েবসাইট' : 'Live Storefront'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Active Tab View Body */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'sider-ai' && (
              <AdminAIDashboard
                orders={orders}
                wholesaleOrders={wholesaleOrders}
                products={products}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                orders={orders}
                wholesaleOrders={wholesaleOrders}
                products={products}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
                onNavigateTab={(tab) => {
                  if (tab === 'payments') setActiveTab('verification');
                  else if (tab === 'wholesale-config') setActiveTab('wholesale');
                  else setActiveTab(tab);
                }}
              />
            )}

            {activeTab === 'products' && (
              <AdminProductsTab
                products={products}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'orders' && (
              <AdminOrdersTab
                orders={orders}
                wholesaleOrders={wholesaleOrders}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'verification' && (
              <AdminPaymentVerificationTab
                orders={orders}
                wholesaleOrders={wholesaleOrders}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'suspicious' && (
              <AdminSuspiciousOrdersTab
                orders={orders}
                wholesaleOrders={wholesaleOrders}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'inventory' && (
              <AdminInventoryTab
                products={products}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'wholesale' && (
              <AdminWholesaleConfigTab
                products={products}
                wholesaleOrders={wholesaleOrders}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'categories' && (
              <AdminCategoriesTab
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'sizes-colors' && (
              <AdminSizesColorsTab
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'customers' && (
              <AdminCustomersTab
                orders={orders}
                wholesaleOrders={wholesaleOrders}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'cms' && (
              <AdminHomepageCMSTab
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'marketing' && (
              <AdminMarketingTab
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'media' && (
              <AdminMediaLibraryTab
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'accounts' && (
              <AdminAccountsTab
                onRefresh={handleRefresh}
                adminName={currentUser.name}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'settings' && (
              <AdminBusinessSettingsTab
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}

            {activeTab === 'audit' && (
              <AdminAuditLogsTab
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'backup' && (
              <AdminBackupExportTab
                orders={orders}
                products={products}
                wholesaleOrders={wholesaleOrders}
                onRefresh={handleRefresh}
                adminName={currentUser.name}
              />
            )}
          </div>

        </main>
      </div>

    </div>
  );
};
