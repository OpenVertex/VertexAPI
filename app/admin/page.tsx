'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ApiCard from '@/components/ApiCard';
import ApiModal from '@/components/ApiModal';
import { ApiItem, ApiCheckResult } from '@/lib/types';
import { Plus, RefreshCw, Search, LayoutGrid, LogIn, ShieldCheck, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminPage() {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<ApiItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(60);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Initial fetch
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
      fetchApis();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Auto refresh logic
  useEffect(() => {
    if (!isLoggedIn || apis.length === 0 || isCheckingAll) return;

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
  }, [isLoggedIn, apis, isCheckingAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        fetchApis();
      } else {
        setLoginError(data.message);
      }
    } catch (err) {
      setLoginError('登录请求失败');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setApis([]);
  };

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

  const handleSaveApi = async (apiData: Partial<ApiItem>) => {
    const method = apiData.id ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/apis', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });
      const saved = await res.json();
      
      if (apiData.id) {
        setApis(prev => prev.map(a => a.id === saved.id ? saved : a));
      } else {
        setApis(prev => [...prev, saved]);
      }
    } catch (error) {
      console.error('Failed to save API', error);
    }
  };

  const handleDeleteApi = async (id: string) => {
    try {
      await fetch(`/api/apis?id=${id}`, { method: 'DELETE' });
      setApis(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete API', error);
    }
  };

  const filteredApis = apis.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass max-w-md w-full p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-sky-400" />
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-sakura/20 rounded-2xl mb-4">
              <ShieldCheck size={40} className="text-sakura-dark" />
            </div>
            <h1 className="text-3xl font-black text-gray-800">管理后台登录</h1>
            <p className="text-gray-500 mt-2">请输入管理员账号和密码以进入管理模式</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">账号</label>
              <input 
                type="text" 
                required
                value={loginData.username}
                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full bg-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sakura-dark/50 transition-all"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">密码</label>
              <input 
                type="password" 
                required
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full bg-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sakura-dark/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-sky-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-200 hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn size={20} />
              <span>登录后台</span>
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-sakura transition-colors font-medium underline">返回公开列表页</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <Navbar onLogout={handleLogout} isAdmin={true} />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center">
              管理 <span className="text-sakura-dark mx-2">控制台</span>
              <Settings className="w-8 h-8 text-sakura-dark ml-2 animate-spin-slow" />
            </h1>
            <p className="text-gray-500 mt-2 font-medium">在此管理您的所有接口数据和监测规则 ✨</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索接口..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="glass-dark border-none rounded-2xl pl-10 pr-4 py-2.5 w-full md:w-64 focus:ring-2 focus:ring-sakura-dark/30 transition-all outline-none"
              />
            </div>
            
            <button 
              onClick={handleCheckAll}
              disabled={isCheckingAll || apis.length === 0}
              className={`
                p-2.5 rounded-2xl glass shadow-md transition-all relative overflow-hidden
                ${isCheckingAll ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/60 active:scale-95'}
              `}
              title={`自动刷新倒计时: ${countdown}s`}
            >
              {/* Progress bar background for countdown */}
              {!isCheckingAll && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-sakura/30"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(countdown / 60) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              )}
              <RefreshCw className={`text-sky-600 ${isCheckingAll ? 'animate-spin' : ''}`} size={22} />
            </button>

            <button 
              onClick={() => { setEditingApi(null); setModalOpen(true); }}
              className="flex items-center space-x-2 bg-sakura hover:bg-sakura-dark text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">新增接口</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="接口总数" count={apis.length} color="bg-gray-100" />
          <StatCard label="在线" count={apis.filter(a => a.status === 'online').length} color="bg-green-100 text-green-600" />
          <StatCard label="离线" count={apis.filter(a => a.status === 'offline').length} color="bg-red-100 text-red-600" />
          <StatCard label="平均延迟" count={`${Math.round(apis.reduce((acc, a) => acc + (a.latency || 0), 0) / (apis.filter(a => a.latency).length || 1))}ms`} color="bg-sky-100 text-sky-600" />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-sakura/30 border-t-sakura rounded-full animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse">正在加载管理列表...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredApis.map(api => (
                <ApiCard 
                  key={api.id} 
                  api={api} 
                  isAdmin={true}
                  onCheck={handleCheck}
                  onEdit={(api) => { setEditingApi(api); setModalOpen(true); }}
                  onDelete={handleDeleteApi}
                />
              ))}
            </AnimatePresence>
            
            {filteredApis.length === 0 && (
              <div className="col-span-full py-20 glass rounded-3xl flex flex-col items-center justify-center border-dashed border-2 border-white/40">
                <div className="bg-white/50 p-6 rounded-full mb-4">
                  <LayoutGrid className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-gray-400 text-lg font-medium">暂无接口数据</p>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="mt-4 text-sakura font-bold hover:underline"
                >
                  点击创建您的第一个接口
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ApiModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        api={editingApi}
        onSave={handleSaveApi}
      />

      <div className="fixed bottom-4 right-4 z-10 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <div className="glass p-3 rounded-2xl flex items-center space-x-2 text-xs font-bold text-gray-500">
          <span>管理模式已开启 ✨</span>
        </div>
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
