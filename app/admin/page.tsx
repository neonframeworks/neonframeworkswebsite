'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Upload,
  Grid,
  Mail,
  LogOut,
  Video,
  LayoutDashboard,
  Menu,
  X,
  Image as ImageIcon,
  MessageSquareQuote,
  Star
} from 'lucide-react';
import AdminUpload from '@/components/AdminUpload';
import AdminDashboard from '@/components/AdminDashboard';

type Tab = 'upload' | 'portfolio' | 'highlights' | 'logos' | 'youtube' | 'testimonials' | 'contacts';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'upload', label: 'Upload Media', icon: Upload },
  { id: 'portfolio', label: 'Manage Portfolio', icon: Grid },
  { id: 'highlights', label: 'Concert Highlights', icon: Star },
  { id: 'logos', label: 'Brand Partners', icon: ImageIcon },
  { id: 'youtube', label: 'YouTube Videos', icon: Video },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { id: 'contacts', label: 'Contact Leads', icon: Mail },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const CloudinaryUsageWidget = () => {
    const [usage, setUsage] = useState<{ used_percent: number; limit_text: string; used_text: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      fetch('/api/cloudinary-usage')
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          
          const usedPercent = data.storage?.used_percent ?? data.credits?.used_percent ?? 0;
          const usedGb = data.storage?.usage ? (data.storage.usage / (1024 * 1024 * 1024)).toFixed(3) + 'GB' : '0GB';
          const limitGb = data.storage?.limit ? (data.storage.limit / (1024 * 1024 * 1024)).toFixed(1) + 'GB' : (data.credits?.limit ? data.credits.limit + 'Cr' : '∞');
          
          setUsage({ used_percent: Number(usedPercent), limit_text: limitGb, used_text: usedGb });
        })
        .catch(err => {
          setError(err.message.includes('missing') ? 'API Keys needed' : 'Usage unavailable');
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="mx-3 mb-4 h-12 bg-white/5 rounded-xl animate-pulse" />;
    
    return (
      <div className="mx-3 mb-4 p-3 glass rounded-xl border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-white/50">Storage / Quota</span>
          {error ? (
            <span className="text-[9px] text-red-400">{error}</span>
          ) : (
            <span className="text-[10px] font-semibold text-[#952EBE]">{usage?.used_percent.toFixed(1)}%</span>
          )}
        </div>
        {!error && usage && (
          <>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
              <div 
                className="h-full bg-gradient-to-r from-[#952EBE] to-[#3A46DA] transition-all duration-1000" 
                style={{ width: `${Math.min(usage.used_percent, 100)}%` }}
              />
            </div>
            <div className="text-[9px] text-white/30 text-right">
              {usage.used_text} / {usage.limit_text}
            </div>
          </>
        )}
      </div>
    );
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-6' : 'p-6'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#952EBE] to-[#3A46DA] flex items-center justify-center">
          <Video size={18} className="text-white" />
        </div>
        <div>
          <div className="text-xs font-black gradient-text leading-none">NEONFRAMEWORKS</div>
          <div className="text-white/30 text-[10px] mt-0.5">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25 mb-3 px-3">
          Navigation
        </div>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#952EBE]/20 to-[#3A46DA]/20 text-white border border-[#952EBE]/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={activeTab === tab.id ? 'text-[#952EBE]' : ''} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Usage Widget */}
      <CloudinaryUsageWidget />

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
      >
        {loggingOut ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-red-400 rounded-full animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        Sign Out
      </button>

      {/* Credit */}
      <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-white/30 text-center">
          Created with ❤️ by <br />
          <a href="https://pixelbytes.online" target="_blank" rel="noopener noreferrer" className="text-[#952EBE] hover:text-white transition-colors font-medium">Pixelbytes</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#07090F]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-white/5 fixed left-0 top-0 h-full">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed left-0 top-0 h-full w-64 bg-[#07090F] border-r border-white/5 z-50 lg:hidden"
      >
        <div className="absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <Sidebar mobile />
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        {/* Top bar */}
        <div className="border-b border-white/5 px-6 py-4 flex items-center gap-4 sticky top-0 bg-[#07090F]/95 backdrop-blur z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/50 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <LayoutDashboard size={16} className="text-[#952EBE]" />
            <h1 className="text-white font-bold text-sm">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2 text-white/30 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 max-w-6xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'upload' && <AdminUpload />}
            {activeTab === 'portfolio' && <AdminDashboard activeTab="portfolio" />}
            {activeTab === 'highlights' && <AdminDashboard activeTab="highlights" />}
            {activeTab === 'logos' && <AdminDashboard activeTab="logos" />}
            {activeTab === 'youtube' && <AdminDashboard activeTab="youtube" />}
            {activeTab === 'testimonials' && <AdminDashboard activeTab="testimonials" />}
            {activeTab === 'contacts' && <AdminDashboard activeTab="contacts" />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
