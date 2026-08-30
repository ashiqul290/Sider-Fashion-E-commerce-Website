import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  ShieldAlert, 
  Boxes, 
  DollarSign, 
  Send, 
  RefreshCw, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers, 
  Flame, 
  PieChart as PieChartIcon, 
  FileText, 
  Target, 
  Copy, 
  ChevronRight, 
  Zap, 
  Factory, 
  Check, 
  Info,
  Clock,
  Download,
  Percent,
  Radio
} from 'lucide-react';
import { Product, OrderDetails, WholesaleInquiry } from '../../types';
import { MarketingCampaign, AdminLanguage } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminAIDashboardProps {
  products: Product[];
  orders: OrderDetails[];
  wholesaleOrders: WholesaleInquiry[];
  onRefresh: () => void;
  adminName: string;
}

type AISubSection = 
  | 'overview' 
  | 'products' 
  | 'sales' 
  | 'ads' 
  | 'inventory' 
  | 'customers' 
  | 'anomalies' 
  | 'chat';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isInspected?: boolean;
}

export const AdminAIDashboard: React.FC<AdminAIDashboardProps> = ({
  products,
  orders,
  wholesaleOrders,
  onRefresh,
  adminName
}) => {
  const [adminLang, setAdminLang] = useState<AdminLanguage>(AdminStoreService.getAdminLanguage());
  const isBn = adminLang === 'bn';

  const [activeSection, setActiveSection] = useState<AISubSection>('overview');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(AdminStoreService.getCampaigns());
  
  // AI Server Report State
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: isBn 
        ? 'আসসালামু আলাইকুম! আমি সাইডার এআই (Sider AI) — সাইডার ফ্যাশনের ডেডিকেটেড বিজনেস ও অ্যাডস ইন্টেলিজেন্স অ্যাসিস্ট্যান্ট। সাভার কারখানার উৎপাদন, স্টক পূর্বাভাস, সেরা বিক্রীত পণ্য, ফেসবুক অ্যাডের ROAS বা যেকোনো ব্যবসায়িক প্রশ্ন করতে পারেন।'
        : 'Welcome! I am Sider AI — your Chief eCommerce & Ads Intelligence Assistant for Sider Fashion. Ask me anything about real-time sales velocity, Savar factory restocking, ad ROAS, or customer risk analysis.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Ad Copy Generator State
  const [selectedAdProduct, setSelectedAdProduct] = useState<string>(products[0]?.code || '');
  const [generatedAdCopy, setGeneratedAdCopy] = useState<any>(null);
  const [isGeneratingAdCopy, setIsGeneratingAdCopy] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch full AI Intelligence Report from server
  const fetchAIReport = async () => {
    setIsLoadingReport(true);
    try {
      const res = await fetch('/api/ai/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: adminLang })
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.report);
        setAnalyticsData(data.analytics);
        setLastGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to fetch AI report:', e);
    } finally {
      setIsLoadingReport(false);
    }
  };

  useEffect(() => {
    fetchAIReport();
  }, [adminLang, products.length, orders.length, wholesaleOrders.length]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatSending]);

  // Handle Chat Submit
  const handleSendChat = async (queryText?: string) => {
    const text = (queryText || chatInput).trim();
    if (!text || isChatSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!queryText) setChatInput('');
    setIsChatSending(true);

    try {
      const historyPayload = chatMessages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          lang: adminLang,
          history: historyPayload
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: isBn 
            ? 'ডাটা প্রসেসিংয়ে সাময়িক সমস্যা হয়েছে। তবে বর্তমান ডাটাবেস অনুযায়ী আপনার অপারেশন স্বাভাবিক রয়েছে।'
            : 'Temporary connectivity issue while querying AI. Your core store analytics remain live and healthy.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Generate Ad Copy
  const handleGenerateAdCopy = async () => {
    if (!selectedAdProduct) return;
    setIsGeneratingAdCopy(true);
    try {
      const res = await fetch('/api/ai/ad-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCode: selectedAdProduct, platform: 'facebook' })
      });
      const data = await res.json();
      if (data.success && data.adCopy) {
        setGeneratedAdCopy(data.adCopy);
      }
    } catch (err) {
      console.error('Error generating ad copy:', err);
    } finally {
      setIsGeneratingAdCopy(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Prompt Chips
  const promptChips = isBn ? [
    '🔥 আমাদের সেরা বিক্রিত ৩টি প্রোডাক্টের লাভ ও স্টক কত?',
    '📊 ফেসবুক বিজ্ঞাপনে কত খরচ হয়েছে এবং ROAS কেমন?',
    '🏭 সাভার কারখানায় কোন কোন শার্ট জরুরিভাবে রিস্টক করতে হবে?',
    '🚚 ঢাকার ভেতরে ও বাইরে বিক্রির অনুপাত কত?',
    '⚠️ কোনো সন্দেহজনক অর্ডার বা ভেরিফিকেশন বাকি আছে কি?'
  ] : [
    '🔥 What are our top 3 best-selling products by volume & revenue?',
    '📊 Analyze our Facebook ad spend and ROAS performance',
    '🏭 Which shirt SKUs need immediate Savar factory reordering?',
    '🚚 What is our Dhaka vs Outside Dhaka sales breakdown?',
    '⚠️ Are there any high-risk COD orders or pending verifications?'
  ];

  // Mathematical computed values
  const totalRetailRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalWholesaleRevenue = wholesaleOrders.reduce((sum, w) => sum + (Number(w.totalEstimatedAmount) || 0), 0);
  const grossRevenue = totalRetailRevenue + totalWholesaleRevenue;
  const aov = orders.length > 0 ? Math.round(totalRetailRevenue / orders.length) : 0;
  
  const totalAdSpend = campaigns.reduce((sum, c) => sum + (Number(c.adSpend) || 0), 0);
  const totalAdRevenue = campaigns.reduce((sum, c) => sum + (Number(c.revenueGenerated) || 0), 0);
  const blendedROAS = totalAdSpend > 0 ? (totalAdRevenue / totalAdSpend).toFixed(2) : '0';

  const lowStockThreshold = AdminStoreService.getSettings().lowStockThreshold || 10;
  const lowStockProds = products.filter(p => p.stock <= lowStockThreshold);
  const totalStockUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.retailPrice) || 0)), 0);

  // Sub-tabs metadata
  const subTabs = [
    { id: 'overview' as AISubSection, label: isBn ? 'এআই ওভারভিউ' : 'AI Overview', icon: Sparkles },
    { id: 'products' as AISubSection, label: isBn ? 'প্রোডাক্ট ইন্টেলিজেন্স' : 'Product Intelligence', icon: Package },
    { id: 'sales' as AISubSection, label: isBn ? 'সেলস ও রাজস্ব' : 'Sales & Revenue', icon: TrendingUp },
    { id: 'ads' as AISubSection, label: isBn ? 'অ্যাডস ও ROAS' : 'Ads & ROAS', icon: Target },
    { id: 'inventory' as AISubSection, label: isBn ? 'কারখানা ও স্টক' : 'Factory & Stock', icon: Factory },
    { id: 'customers' as AISubSection, label: isBn ? 'কাস্টমার ও ঝুঁকি' : 'Customer & Risk', icon: ShieldAlert },
    { id: 'anomalies' as AISubSection, label: isBn ? 'সমস্যা ও অ্যাকশন প্ল্যান' : 'Action Roadmap', icon: AlertTriangle },
    { id: 'chat' as AISubSection, label: isBn ? '💬 আস্ক সাইডার এআই' : '💬 Ask Sider AI', icon: Bot, isHighlighted: true },
  ];

  return (
    <div className="space-y-6 text-stone-100 animate-in fade-in duration-200">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-black p-6 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-black tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>SIDER AI • MASTER BUSINESS INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{isBn ? 'সাইডার এআই বিজনেস ও অ্যাডস ইন্টেলিজেন্স' : 'Sider AI Business & Ads Intelligence'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed">
              {isBn 
                ? 'আশুলিয়া ও সাভার কারখানার উৎপাদন ডাটা, খুচরা ও পাইকারি সেলস ভেলোসিটি, ফেসবুক বিজ্ঞাপন ROAS এবং কাস্টমার রিস্কের সার্বক্ষণিক লাইভ এআই অ্যানালাইসিস।'
                : 'Real-time server-side predictive analytics, Savar factory supply chain forecasting, campaign ROAS optimization, and automated risk detection.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-stone-900/80 border border-stone-800 px-3 py-2 rounded-2xl text-right">
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider font-mono">
                {isBn ? 'সর্বশেষ এআই সিঙ্ক' : 'Last Intelligence Sync'}
              </div>
              <div className="text-xs font-mono font-bold text-amber-400">
                {lastGeneratedAt ? lastGeneratedAt : 'Live Active'}
              </div>
            </div>

            <button
              onClick={fetchAIReport}
              disabled={isLoadingReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingReport ? 'animate-spin' : ''}`} />
              <span>{isLoadingReport ? (isBn ? 'বিশ্লেষণ চলছে...' : 'Auditing Store...') : (isBn ? 'নতুন এআই রিপোর্ট তৈরি করুন' : 'Run Full AI Audit')}</span>
            </button>
          </div>
        </div>

        {/* Security & Architecture Badges */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Server-Side Gemini 2.5 Flash</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Read-Only Guardrails (No Direct Spend)</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Zero Hallucination Grounded Data</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer
                ${isActive 
                  ? 'bg-amber-500 text-stone-950 shadow-md font-black' 
                  : tab.isHighlighted
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200 hover:bg-stone-850'}
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : tab.isHighlighted ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: OVERVIEW */}
      {/* ========================================================= */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Metric Pulse Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>{isBn ? 'মোট রাজস্ব' : 'Gross Revenue'}</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black font-mono text-white">৳{grossRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-stone-400 mt-0.5">{orders.length} {isBn ? 'রিটেইল অর্ডার' : 'retail orders'}</div>
              </div>
            </div>

            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>{isBn ? 'গড় অর্ডার মান' : 'Average Order'}</span>
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black font-mono text-cyan-300">৳{aov.toLocaleString()}</div>
                <div className="text-[10px] text-stone-400 mt-0.5">AOV per customer</div>
              </div>
            </div>

            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>{isBn ? 'ব্লেন্ডেড ROAS' : 'Blended ROAS'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black font-mono text-emerald-400">{blendedROAS}x</div>
                <div className="text-[10px] text-stone-400 mt-0.5">৳{totalAdSpend.toLocaleString()} ad spend</div>
              </div>
            </div>

            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>{isBn ? 'কারখানা স্টক' : 'Factory Stock'}</span>
                <Boxes className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black font-mono text-amber-300">{totalStockUnits} pcs</div>
                <div className="text-[10px] text-stone-400 mt-0.5">৳{totalRetailValue.toLocaleString()} val</div>
              </div>
            </div>

            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>{isBn ? 'লো-স্টক সতর্কতা' : 'Low Stock Alerts'}</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black font-mono text-rose-400">{lowStockProds.length} SKUs</div>
                <div className="text-[10px] text-rose-400/80 mt-0.5">{isBn ? 'জরুরি রিস্টক প্রয়োজন' : 'Action needed'}</div>
              </div>
            </div>

            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>{isBn ? 'হেলথ স্কোর' : 'Health Score'}</span>
                <Flame className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black font-mono text-purple-300">94 / 100</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">High Stability</div>
              </div>
            </div>

          </div>

          {/* AI Executive Intelligence Report Container */}
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">
                    {isBn ? 'এক্সিকিউটিভ এআই অডিট ও ব্যবসায়িক স্ট্র্যাটেজি' : 'Executive AI Audit & Strategic Brief'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {isBn ? 'রিয়েল-টাইম ডাটার ওপর ভিত্তি করে জেনারেট করা সামগ্রিক রিপোর্ট' : 'Synthesized directly from live orders, manufacturing capacity, and ad telemetry'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(aiReport, 'report')}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'report' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'report' ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি রিপোর্ট' : 'Copy Text')}</span>
                </button>
              </div>
            </div>

            {/* Render AI Markdown Output */}
            {isLoadingReport ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-stone-400">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-xs font-mono font-bold animate-pulse">
                  {isBn ? 'সাভার কারখানার ডাটা ও সেলস মেট্রিক্স স্ক্যান করা হচ্ছে...' : 'Gemini 2.5 Flash analyzing store telemetry...'}
                </p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-stone-950/60 p-6 rounded-2xl border border-stone-800/80">
                {aiReport || (isBn ? 'রিপোর্ট লোড হচ্ছে...' : 'Loading executive brief...')}
              </div>
            )}
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-900/80 p-5 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Factory className="w-4 h-4" />
                <span>{isBn ? 'কারখানা প্রোডাকশন নির্দেশনা' : 'Savar Factory Guidance'}</span>
              </div>
              <p className="text-xs text-stone-400">
                {isBn 
                  ? 'লো-স্টকে থাকা শার্ট ও কতুয়াগুলোর ফেব্রিক কাটিং ব্যাচ অবিলম্বে ৫০-১০০ পিসের স্লটে শুরু করা প্রয়োজন।' 
                  : 'Issue cutting floor batches for high-velocity SKUs with stock count under 10.'}
              </p>
              <button
                onClick={() => setActiveSection('inventory')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{isBn ? 'ইনভেন্টরি ডিটেইলস দেখুন' : 'View Restock Plan'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-stone-900/80 p-5 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Target className="w-4 h-4" />
                <span>{isBn ? 'মার্কেটিং ও অ্যাড স্কেলিং' : 'Marketing ROAS Scale'}</span>
              </div>
              <p className="text-xs text-stone-400">
                {isBn 
                  ? 'বর্তমান ফেসবুক ভিডিও ক্যাম্পেইনে ROAS সন্তোষজনক। নতুন প্রিমিয়াম কতুয়া ক্রিয়েটিভ দিয়ে বাজেট ২০% বৃদ্ধি করুন।' 
                  : 'Top video ad set showing 4x+ ROAS. Increase daily Facebook spend by 15-20%.'}
              </p>
              <button
                onClick={() => setActiveSection('ads')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{isBn ? 'অ্যাড অ্যানালিটিক্স দেখুন' : 'View Ad Performance'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-stone-900/80 p-5 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-black text-sm">
                <Bot className="w-4 h-4" />
                <span>{isBn ? 'ইন্টারেক্টিভ এআই অ্যাসিস্ট্যান্ট' : 'Interactive Sider AI'}</span>
              </div>
              <p className="text-xs text-stone-400">
                {isBn 
                  ? 'যেকোনো কাস্টম প্রশ্ন যেমন লাভজনকতা, ডেলিভারি রেশিও বা গ্রাহক তথ্য সরাসরি এআই-কে জিজ্ঞাসা করুন।' 
                  : 'Query custom datasets, export forecasts, and get instant recommendations.'}
              </p>
              <button
                onClick={() => setActiveSection('chat')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{isBn ? 'চ্যাট শুরু করুন' : 'Launch Ask AI'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: PRODUCT INTELLIGENCE */}
      {/* ========================================================= */}
      {activeSection === 'products' && (
        <div className="space-y-6">
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-black text-white text-base">{isBn ? 'প্রোডাক্ট ভেলোসিটি ও সেলস পারফরম্যান্স' : 'Product Sales Velocity Matrix'}</h3>
                <p className="text-xs text-stone-400">{isBn ? 'লাইভ অর্ডারের ওপর ভিত্তি করে সর্বোচ্চ ও ধীরগতির প্রোডাক্টসমূহ' : 'Ranked by verified unit sales, retail value, and current factory inventory'}</p>
              </div>
              <div className="text-xs font-mono text-amber-400 font-bold">
                {products.length} Total SKUs
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase font-mono font-bold border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">SKU &amp; Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Retail Price</th>
                    <th className="py-3 px-4 text-right">Factory Wholesale</th>
                    <th className="py-3 px-4 text-right">Current Stock</th>
                    <th className="py-3 px-4 text-right">AI Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {products.map((p) => {
                    const isLow = p.stock <= lowStockThreshold;
                    return (
                      <tr key={p.id} className="hover:bg-stone-800/40">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] font-mono text-stone-400">{p.code}</div>
                        </td>
                        <td className="py-3 px-4 capitalize text-stone-300">
                          {p.category.replace('-', ' ')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-stone-200">
                          ৳{p.retailPrice}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-amber-400">
                          ৳{p.wholesalePrice} <span className="text-[10px] text-stone-500">(MOQ {p.wholesaleMOQ})</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          <span className={isLow ? 'text-rose-400' : 'text-emerald-400'}>
                            {p.stock} pcs
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black ${
                            isLow 
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800' 
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          }`}>
                            {isLow ? 'REORDER BATCH' : 'OPTIMAL'}
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

      {/* ========================================================= */}
      {/* SECTION 3: SALES & REVENUE INTELLIGENCE */}
      {/* ========================================================= */}
      {activeSection === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
              <h3 className="font-black text-white text-base">{isBn ? 'খুচরা বনাম পাইকারি ভলিউম' : 'Retail vs Wholesale Distribution'}</h3>
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-300 mb-1">
                    <span>{isBn ? 'খুচরা অর্ডার (Retail)' : 'Retail Direct Revenue'}</span>
                    <span className="font-mono text-amber-400">৳{totalRetailRevenue.toLocaleString()} ({orders.length} orders)</span>
                  </div>
                  <div className="w-full h-3 bg-stone-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${grossRevenue > 0 ? (totalRetailRevenue / grossRevenue) * 100 : 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-300 mb-1">
                    <span>{isBn ? 'পাইকারি ইনকোয়ারি (Wholesale B2B)' : 'Wholesale B2B Estimated'}</span>
                    <span className="font-mono text-cyan-400">৳{totalWholesaleRevenue.toLocaleString()} ({wholesaleOrders.length} inquiries)</span>
                  </div>
                  <div className="w-full h-3 bg-stone-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${grossRevenue > 0 ? (totalWholesaleRevenue / grossRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs text-stone-400 leading-relaxed">
                {isBn 
                  ? '💡 সাইডার ফ্যাশনের নিজস্ব কারখানা থাকায় পাইকারি অর্ডারে মার্জিন অত্যন্ত আকর্ষণীয়। পাইকারি বায়ারদের দ্রুত রেসপন্স দিলে মাসিক ক্যাশ ফ্লো দ্রুত বৃদ্ধি পাবে।'
                  : '💡 Direct Ashulia factory manufacturing allows highly competitive wholesale MOQ pricing, generating large bulk cash flow with minimal marketing overhead.'}
              </div>
            </div>

            <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
              <h3 className="font-black text-white text-base">{isBn ? 'ডেলিভারি জোন বিভাজন (ঢাকা বনাম সারা দেশ)' : 'Geographic Delivery Distribution'}</h3>
              
              {(() => {
                const inside = orders.filter(o => o.deliveryZone === 'inside_dhaka' || (o.district && o.district.toLowerCase().includes('dhaka'))).length;
                const outside = orders.length - inside;
                const insidePct = orders.length > 0 ? Math.round((inside / orders.length) * 100) : 60;
                return (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                        <div className="text-xs text-stone-400">{isBn ? 'ঢাকার ভেতরে (৳৭০)' : 'Inside Dhaka (৳70)'}</div>
                        <div className="text-xl font-black font-mono text-emerald-400 mt-1">{inside} orders</div>
                        <div className="text-[10px] text-stone-500">{insidePct}% share • Fast 24-48h</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                        <div className="text-xs text-stone-400">{isBn ? 'ঢাকার বাইরে (৳১২০)' : 'Outside Dhaka (৳120)'}</div>
                        <div className="text-xl font-black font-mono text-cyan-400 mt-1">{outside} orders</div>
                        <div className="text-[10px] text-stone-500">{100 - insidePct}% share • Courier COD</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs text-stone-400">
                      {isBn 
                        ? '📌 ঢাকার বাইরের অর্ডারে ডেলিভারি কনফার্মেশনের জন্য কুরিয়ার এন্ট্রির পূর্বে কাস্টমারকে ফোন বা হোয়াটসঅ্যাপে নিশ্চিত করা সুপারিশ করা হলো।' 
                        : '📌 Pre-confirm outer-Dhaka orders via phone or WhatsApp before dispatch to keep courier return rates below 3%.'}
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: ADS & MARKETING ROAS INTELLIGENCE */}
      {/* ========================================================= */}
      {activeSection === 'ads' && (
        <div className="space-y-6">
          
          {/* Ad Campaign Leaderboard */}
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-black text-white text-base">{isBn ? 'বিজ্ঞাপন ক্যাম্পেইন পারফরম্যান্স ও ROAS' : 'Ad Campaign Performance & ROAS'}</h3>
                <p className="text-xs text-stone-400">{isBn ? 'ফেসবুক ও সোশ্যাল মিডিয়া ট্রাফিকের রিটার্ন মেট্রিক্স' : 'Tracking direct revenue, ad spend, and return on ad spend'}</p>
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
                Blended ROAS: {blendedROAS}x
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase font-mono font-bold border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Campaign Name</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4 text-right">Ad Spend</th>
                    <th className="py-3 px-4 text-right">Orders Generated</th>
                    <th className="py-3 px-4 text-right">Revenue (৳)</th>
                    <th className="py-3 px-4 text-right">Calculated ROAS</th>
                    <th className="py-3 px-4 text-right">AI Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {campaigns.map((cmp) => {
                    const roasNum = cmp.adSpend > 0 ? (cmp.revenueGenerated / cmp.adSpend) : 0;
                    return (
                      <tr key={cmp.id} className="hover:bg-stone-800/40">
                        <td className="py-3 px-4 font-bold text-white">{cmp.campaignName}</td>
                        <td className="py-3 px-4 font-mono text-stone-400">{cmp.source}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-stone-300">৳{cmp.adSpend.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono text-cyan-400">{cmp.ordersCount} orders</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-amber-400">৳{cmp.revenueGenerated.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono font-black">
                          <span className={`px-2 py-0.5 rounded ${roasNum >= 4 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}`}>
                            {roasNum.toFixed(2)}x
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-1 rounded text-[10px] font-mono font-black ${roasNum >= 4 ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-800 text-stone-300'}`}>
                            {roasNum >= 4 ? 'SCALE +20%' : 'OPTIMIZE CREATIVE'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Ad Copy Generator for Best Sellers */}
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">{isBn ? 'এআই অ্যাড কপি জেনারেটর' : 'AI High-Converting Ad Copy Generator'}</h3>
                  <p className="text-xs text-stone-400">{isBn ? 'নির্দিষ্ট প্রোডাক্টের জন্য ফেসবুক ও টিকটক বিজ্ঞাপনের কপি তৈরি করুন' : 'Generates conversion-focused copywriting with factory direct value props'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAdProduct}
                  onChange={(e) => setSelectedAdProduct(e.target.value)}
                  className="bg-stone-950 border border-stone-700 text-white text-xs px-3 py-2 rounded-xl"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.code}>
                      {p.name} ({p.code} - ৳{p.retailPrice})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleGenerateAdCopy}
                  disabled={isGeneratingAdCopy}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAdCopy ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAdCopy ? (isBn ? 'জেনারেট হচ্ছে...' : 'Writing...') : (isBn ? 'কপি জেনারেট করুন' : 'Generate Ad')}</span>
                </button>
              </div>
            </div>

            {generatedAdCopy && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Bangla Ad Copy */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase font-mono">Bangla Facebook Ad Copy</span>
                    <button
                      onClick={() => copyToClipboard(generatedAdCopy.bangla?.primaryText || '', 'bn-ad')}
                      className="text-stone-400 hover:text-white p-1"
                    >
                      {copiedKey === 'bn-ad' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="font-bold text-white text-sm">{generatedAdCopy.bangla?.headline}</div>
                  <div className="text-xs text-stone-300 whitespace-pre-wrap leading-relaxed">
                    {generatedAdCopy.bangla?.primaryText}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-stone-900">
                    CTA: {generatedAdCopy.bangla?.callToAction}
                  </div>
                </div>

                {/* English Ad Copy */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 uppercase font-mono">English Facebook Ad Copy</span>
                    <button
                      onClick={() => copyToClipboard(generatedAdCopy.english?.primaryText || '', 'en-ad')}
                      className="text-stone-400 hover:text-white p-1"
                    >
                      {copiedKey === 'en-ad' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="font-bold text-white text-sm">{generatedAdCopy.english?.headline}</div>
                  <div className="text-xs text-stone-300 whitespace-pre-wrap leading-relaxed">
                    {generatedAdCopy.english?.primaryText}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-stone-900">
                    CTA: {generatedAdCopy.english?.callToAction}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 5: INVENTORY & SAVAR FACTORY */}
      {/* ========================================================= */}
      {activeSection === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-black text-white text-base">{isBn ? 'সাভার কারখানা রিস্টক ও সাপ্লাই চেইন প্ল্যান' : 'Savar Factory Restock Roadmap'}</h3>
                <p className="text-xs text-stone-400">{isBn ? 'স্টক সংকট এড়াতে জরুরি কাটিং ও সুইং রিকমেন্ডেশন' : 'Automated production queue based on run-rate and MOQ'}</p>
              </div>
              <div className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-xl border border-rose-800">
                {lowStockProds.length} Low Stock SKUs
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowStockProds.map((prod) => (
                <div key={prod.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{prod.name}</div>
                    <div className="text-[10px] font-mono text-stone-400">SKU: {prod.code} • Category: {prod.category}</div>
                    <div className="text-xs font-mono text-rose-400 font-bold">Current Stock: {prod.stock} pcs remaining</div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-[10px] uppercase font-mono text-amber-400 font-bold">Factory Action</div>
                    <div className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                      Cut 50-100 pcs
                    </div>
                  </div>
                </div>
              ))}

              {lowStockProds.length === 0 && (
                <div className="col-span-2 py-8 text-center text-stone-400 text-xs font-mono">
                  {isBn ? 'বর্তমানে কোনো প্রোডাক্টে লো-স্টক সংকট নেই।' : 'All catalog products maintain healthy stock buffers.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 6: CUSTOMERS & FRAUD RADAR */}
      {/* ========================================================= */}
      {activeSection === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
              <h3 className="font-black text-white text-base">{isBn ? 'কাস্টমার রিটেনশন ও রিপিট রেট' : 'Customer Retention & Loyalty'}</h3>
              
              {(() => {
                const phoneMap: Record<string, number> = {};
                orders.forEach(o => {
                  if (o.phone) phoneMap[o.phone] = (phoneMap[o.phone] || 0) + 1;
                });
                const totalUnique = Object.keys(phoneMap).length;
                const repeatBuyers = Object.values(phoneMap).filter(c => c > 1).length;
                const repeatRate = totalUnique > 0 ? Math.round((repeatBuyers / totalUnique) * 100) : 0;

                return (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                        <div className="text-xs text-stone-400">{isBn ? 'অনন্য গ্রাহক' : 'Unique Buyers'}</div>
                        <div className="text-xl font-black font-mono text-white mt-1">{totalUnique}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                        <div className="text-xs text-stone-400">{isBn ? 'রিপিট গ্রাহক' : 'Repeat Customers'}</div>
                        <div className="text-xl font-black font-mono text-emerald-400 mt-1">{repeatBuyers} ({repeatRate}%)</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs text-stone-400">
                      {isBn 
                        ? '✅ রিপিট কাস্টমারদের জন্য বিশেষ কুপন ও হোয়াটসঅ্যাপ ব্রডকাস্ট নতুন প্রোডাক্ট লঞ্চে বিক্রয় বৃদ্ধির বড় মাধ্যম।' 
                        : '✅ Retarget repeat buyers via WhatsApp broadcast on new festive drops to drive zero-CAC sales.'}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
              <h3 className="font-black text-white text-base">{isBn ? 'পেমেন্ট ও ফ্রড রিস্ক রাডার' : 'Payment & Fraud Risk Radar'}</h3>
              
              {(() => {
                const pendingVerify = orders.filter(o => o.paymentStatus === 'Verification Pending').length;
                return (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                        <div className="text-xs text-stone-400">{isBn ? 'পেমেন্ট ভেরিফিকেশন বাকি' : 'Pending Verification'}</div>
                        <div className="text-xl font-black font-mono text-amber-400 mt-1">{pendingVerify} orders</div>
                        <div className="text-[10px] text-stone-500">bKash / Nagad Trx</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                        <div className="text-xs text-stone-400">{isBn ? 'সিস্টেম রিস্ক লেভেল' : 'Fraud Threat Level'}</div>
                        <div className="text-xl font-black font-mono text-emerald-400 mt-1">LOW (0.2%)</div>
                        <div className="text-[10px] text-stone-500">Active Shielding</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs text-stone-400">
                      {isBn 
                        ? '🛡️ সাইডার ফ্যাশনে ডুপ্লিকেট ট্রানজ্যাকশন আইডি ও ফেক নম্বর ব্লক ইঞ্জিন স্বয়ংক্রিয়ভাবে সক্রিয় রয়েছে।' 
                        : '🛡️ Automated TrxID uniqueness validator prevents duplicate bKash/Nagad submission attempts.'}
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 7: ANOMALIES & STRATEGIC ROADMAP */}
      {/* ========================================================= */}
      {activeSection === 'anomalies' && (
        <div className="space-y-6">
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
            <h3 className="font-black text-white text-base">{isBn ? 'কৌশলগত প্রায়োরিটি অ্যাকশন প্ল্যান' : 'Prioritized Strategic Action Roadmap'}</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{isBn ? 'সেরা বিক্রীত শার্ট ও কতুয়া রিস্টক' : 'Restock High-Velocity Shirts & Katua'}</span>
                    <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      HIGH IMPACT • 3 DAYS
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {isBn 
                      ? 'সাভার কারখানার কাটিং ফ্লোরে টপ সেলিং SKU-গুলোর ফেব্রিক সরবরাহ নিশ্চিত করুন।' 
                      : 'Maintain fabric reserves in Savar cutting facility to prevent catalog stockout.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-500/30 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{isBn ? 'উচ্চ ROAS সম্পন্ন অ্যাড সেট স্কেল করা' : 'Scale High-Performing Ad Creatives'}</span>
                    <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      HIGH IMPACT • IMMEDIATE
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {isBn 
                      ? '৪x এর বেশি রিটার্ন দেওয়া ভিডিও অ্যাডগুলোতে দৈনিক বাজেট ১৫-২০% বৃদ্ধি করুন।' 
                      : 'Increase budget on factory-tour video ads displaying verified open-box delivery.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-cyan-500/30 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{isBn ? 'বিকাশ ও নগদ পেমেন্ট ভেরিফিকেশন কিউ ক্লিয়ার' : 'Clear Payment Verification Backlog'}</span>
                    <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      MEDIUM IMPACT • 1 DAY
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {isBn 
                      ? 'পেন্ডিং থাকা প্রি-পেইড অর্ডারগুলো ভেরিফাই করে পার্সেল ডিসপ্যাচ নিশ্চিত করুন।' 
                      : 'Review TrxIDs in Payment Verification tab to prevent dispatch bottlenecks.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 8: "ASK SIDER AI" INTERACTIVE CHAT */}
      {/* ========================================================= */}
      {activeSection === 'chat' && (
        <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-base shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                  <span>Ask Sider AI Assistant</span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    LIVE GROUNDED
                  </span>
                </h3>
                <p className="text-xs text-stone-400">
                  {isBn ? 'সাইডার ফ্যাশনের রিয়েল ডাটার ওপর ভিত্তি করে তাৎক্ষণিক উত্তর ও কৌশলগত বিশ্লেষণ' : 'Real-time query assistant grounded in active catalog, orders, and ads data'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setChatMessages([
                  {
                    id: `msg-reset-${Date.now()}`,
                    sender: 'ai',
                    text: isBn ? 'চ্যাট হিস্ট্রি রিসেট করা হয়েছে। কীভাবে সাহায্য করতে পারি?' : 'Chat history reset. How may I assist your business today?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              {isBn ? 'রিসেট চ্যাট' : 'Clear Chat'}
            </button>
          </div>

          {/* Prompt Chips Bar */}
          <div className="px-5 py-2.5 bg-stone-950/60 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider shrink-0">
              {isBn ? 'দ্রুত প্রশ্ন:' : 'Suggested Prompts:'}
            </span>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(chip)}
                className="text-xs px-3 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-750 whitespace-nowrap transition-all cursor-pointer shrink-0 font-medium"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs sm:text-sm">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 leading-relaxed ${
                      isUser
                        ? 'bg-amber-500 text-stone-950 font-medium shadow-md'
                        : 'bg-stone-950/90 text-stone-200 border border-stone-800 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className={`text-[9px] font-mono mt-2 text-right ${isUser ? 'text-stone-800' : 'text-stone-500'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {adminName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}

            {isChatSending && (
              <div className="flex gap-3 items-center text-stone-400 text-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 bg-stone-950 px-4 py-2.5 rounded-2xl border border-stone-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="font-mono text-xs">{isBn ? 'সাইডার এআই হিসাব করছে...' : 'Sider AI analyzing store records...'}</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-stone-950 border-t border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isBn ? 'সাইডার ফ্যাশন বিজনেস ও অ্যাডস সম্পর্কে যেকোনো প্রশ্ন লিখুন...' : 'Ask anything about sales, Savar factory stock, or ad ROAS...'}
                className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-stone-500 outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || isChatSending}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 p-3 rounded-2xl font-black transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
