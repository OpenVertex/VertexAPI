'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PublicApiCard from '@/components/PublicApiCard';
import Logo from '@/components/Logo';
import { ApiItem, ApiCheckResult } from '@/lib/types';
import { RefreshCw, Search, LayoutGrid, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Initial fetch
  useEffect(() => {
    fetchApis();
  }, []);

  // Auto refresh logic
  useEffect(() => {
    if (apis.length === 0 || isCheckingAll) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleCheckAll();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [apis, isCheckingAll]);

  const fetchApis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/apis');
      const data = await res.json();
      setApis(data);
    } catch (error) {
      console.error('Failed to fetch APIs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async (id: string) => {
    const api = apis.find(a => a.id === id);
    if (!api) return;

    updateApiStatus(id, { status: 'checking' });

    try {
      const res = await fetch(`/api/check?url=${encodeURIComponent(api.url)}`);
      const result: ApiCheckResult = await res.json();
      
      const updates = {
        status: result.status,
        latency: result.latency,
        errorMessage: result.error,
        lastChecked: new Date().toISOString()
      };

      updateApiStatus(id, updates);

      // Persist to backend
      fetch('/api/apis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (error) {
      updateApiStatus(id, { status: 'offline', errorMessage: '网络错误' });
    }
  };

  const handleCheckAll = async () => {
    if (isCheckingAll) return;
    setIsCheckingAll(true);
    await Promise.all(apis.map(api => handleCheck(api.id)));
    setIsCheckingAll(false);
  };

  const updateApiStatus = (id: string, updates: Partial<ApiItem>) => {
    setApis(prev => prev.map(api => api.id === id ? { ...api, ...updates } : api));
  };

  const filteredApis = apis.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = apis.filter(a => a.status === 'online').length;
  const isSystemHealthy = onlineCount === apis.length && apis.length > 0;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <Navbar />

      <div className="space-y-12">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-10"
        >
          <div className="flex justify-center mb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <Logo size={100} className="drop-shadow-2xl" />
            </motion.div>
          </div>
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-dark text-sakura-dark text-xs font-black tracking-widest uppercase">
            <Sparkles size={14} />
            <span>实时服务状态监测</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">
            Vertex <span className="text-sakura-dark">Status</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-700 font-bold text-lg leading-relaxed px-4">
            为您实时呈现所有公共服务的运行状况与网络延迟。
            <br className="hidden md:block" />
            我们致力于提供最稳定、最透明的服务体验。
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <div className={`
              flex items-center space-x-3 px-8 py-4 rounded-[2rem] glass shadow-lg transition-all duration-500
              ${isSystemHealthy ? 'bg-green-50/50' : 'bg-amber-50/50'}
            `}>
              <div className={`w-3 h-3 rounded-full ${isSystemHealthy ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
              <span className={`text-lg font-black ${isSystemHealthy ? 'text-green-700' : 'text-amber-700'}`}>
                {isSystemHealthy ? '所有服务运行正常' : '部分服务可能存在波动'}
              </span>
            </div>
            
            <button 
              onClick={handleCheckAll}
              disabled={isCheckingAll}
              className="flex items-center space-x-2 px-8 py-4 bg-sakura hover:bg-sakura-dark text-white rounded-[2rem] font-black shadow-xl shadow-pink-100 transition-all hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group"
            >
              {/* Progress bar background for countdown */}
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                initial={{ width: "0%" }}
                animate={{ width: `${(countdown / 60) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
              <RefreshCw size={20} className={isCheckingAll ? 'animate-spin' : ''} />
              <span>{isCheckingAll ? '正在同步数据...' : `立即刷新 (${countdown}s)`}</span>
            </button>
          </div>
        </motion.section>

        {/* Search & Filter Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sakura transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="搜索特定服务名称..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full glass-dark border-none rounded-[1.5rem] pl-14 pr-6 py-4 focus:ring-4 focus:ring-sakura/10 transition-all outline-none text-gray-700 font-bold"
            />
          </div>

          <div className="flex items-center space-x-6 text-sm font-black text-gray-600 uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>在线: {onlineCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>离线: {apis.length - onlineCount}</span>
            </div>
          </div>
        </section>

        {/* Grid Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="w-16 h-16 border-4 border-sakura/20 border-t-sakura rounded-full animate-spin" />
            <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">正在链接星辰... 🚀</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <AnimatePresence mode="popLayout">
              {filteredApis.map(api => (
                <PublicApiCard 
                  key={api.id} 
                  api={api} 
                  onCheck={handleCheck}
                />
              ))}
            </AnimatePresence>
            
            {filteredApis.length === 0 && (
              <div className="col-span-full py-24 glass rounded-[3rem] flex flex-col items-center justify-center border-dashed border-2 border-white/40">
                <LayoutGrid className="w-16 h-16 text-gray-200 mb-6" />
                <p className="text-gray-400 text-xl font-black uppercase tracking-widest">找不到相关服务</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-6 text-sakura font-black hover:underline flex items-center space-x-2"
                >
                  <span>查看全部服务</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center py-10 space-y-4"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-600 font-black uppercase tracking-widest text-xs">
            <Heart size={14} className="text-sakura" />
            <span>致力于打造最透明的服务平台</span>
          </div>
          <p className="text-gray-500 text-[10px] font-bold">
            © 2024 Vertex API Manager. 数据每 5 分钟自动同步。
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

function StatCard({ label, count, color }: { label: string, count: string | number, color: string }) {
  return (
    <div className="glass p-4 rounded-2xl shadow-sm border border-white/20">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black mt-1 ${color.includes('text') ? color.split(' ')[1] : 'text-gray-800'}`}>
        {count}
      </p>
    </div>
  );
}
