'use client';

import React from 'react';
import { ApiItem } from '@/lib/types';
import { ShieldCheck, ShieldAlert, Zap, Clock, ExternalLink, Activity, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PublicApiCardProps {
  api: ApiItem;
  onCheck: (id: string) => void;
}

export default function PublicApiCard({ api, onCheck }: PublicApiCardProps) {
  const isOnline = api.status === 'online';
  const isOffline = api.status === 'offline';
  const isChecking = api.status === 'checking';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-[2rem] p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
    >
      {/* Link Overlay - Makes the whole card clickable except for the check button */}
      <Link href={`/api/${api.id}`} className="absolute inset-0 z-0" title="查看使用说明" />

      {/* Status Glow Effect */}
      <div className={`absolute -inset-0.5 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none ${
        isOnline ? 'bg-green-400' : isOffline ? 'bg-red-400' : 'bg-blue-400'
      }`} />

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Top Section: Icon & Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${
              isOnline ? 'bg-green-100 text-green-600' : 
              isOffline ? 'bg-red-100 text-red-600' : 
              'bg-blue-100 text-blue-600'
            }`}>
              {isOnline ? <ShieldCheck size={24} /> : isOffline ? <ShieldAlert size={24} /> : <Activity size={24} className="animate-spin-slow" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{api.name}</h3>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mt-0.5">
                {isOnline ? '运行正常' : isOffline ? '服务中断' : '状态同步中'}
              </p>
            </div>
          </div>
          <div className="text-gray-300 group-hover:text-sakura transition-colors">
            <Info size={20} />
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-gray-700 font-bold line-clamp-2 mb-6 h-8">
          {api.description || '点击查看该接口的详细使用说明和参数定义。'}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/30 rounded-2xl p-3 border border-white/20">
            <div className="flex items-center text-gray-700 mb-1">
              <Zap size={14} className="mr-1.5" />
              <span className="text-[10px] font-black uppercase">响应时间</span>
            </div>
            <p className="text-sm font-black text-gray-800">
              {api.latency ? `${api.latency}ms` : '--'}
            </p>
          </div>
          <div className="bg-white/30 rounded-2xl p-3 border border-white/20">
            <div className="flex items-center text-gray-700 mb-1">
              <Clock size={14} className="mr-1.5" />
              <span className="text-[10px] font-black uppercase">上次检测</span>
            </div>
            <p className="text-sm font-black text-gray-800">
              {api.lastChecked ? new Date(api.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex items-center justify-between pointer-events-auto relative z-20">
          <div className="flex items-center space-x-1.5 text-gray-600">
            <ExternalLink size={14} />
            <span className="text-[10px] font-bold truncate max-w-[100px]">{new URL(api.url).hostname}</span>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCheck(api.id);
            }}
            disabled={isChecking}
            className={`
              px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2
              ${isChecking 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-white/60 hover:bg-sakura hover:text-white text-sakura-dark shadow-sm'}
            `}
          >
            {isChecking && <div className="w-3 h-3 border-2 border-sakura/30 border-t-sakura rounded-full animate-spin" />}
            <span>{isChecking ? '同步中' : '手动刷新'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
