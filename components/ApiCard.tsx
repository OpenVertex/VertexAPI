'use client';

import React from 'react';
import { ApiItem, ApiMethod } from '@/lib/types';
import { Play, Edit2, Trash2, Globe, Clock, Zap, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ApiCardProps {
  api: ApiItem;
  isAdmin?: boolean;
  onCheck?: (id: string) => void;
  onEdit?: (api: ApiItem) => void;
  onDelete?: (id: string) => void;
}

const methodColors: Record<ApiMethod, string> = {
  GET: 'bg-blue-100 text-blue-600 border-blue-200',
  POST: 'bg-green-100 text-green-600 border-green-200',
  PUT: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  DELETE: 'bg-red-100 text-red-600 border-red-200',
  PATCH: 'bg-purple-100 text-purple-600 border-purple-200',
  HEAD: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function ApiCard({ api, isAdmin = false, onCheck, onEdit, onDelete }: ApiCardProps) {
  const isOnline = api.status === 'online';
  const isOffline = api.status === 'offline';
  const isChecking = api.status === 'checking';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass group relative overflow-hidden rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Link Overlay */}
      <Link href={`/api/${api.id}`} className="absolute inset-0 z-0" title="查看详细说明" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-sakura/10 rounded-full blur-2xl group-hover:bg-sakura/20 transition-all pointer-events-none" />

      <div className="flex flex-col h-full relative z-10 pointer-events-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              w-3 h-3 rounded-full 
              ${isOnline ? 'bg-green-500 animate-breathe-green' : ''}
              ${isOffline ? 'bg-red-500 animate-breathe-red' : ''}
              ${isChecking ? 'bg-blue-500 animate-pulse' : ''}
              ${api.status === 'unknown' ? 'bg-gray-400' : ''}
            `} />
            <h3 className="text-lg font-bold text-gray-800 truncate max-w-[150px]">
              {api.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${methodColors[api.method]}`}>
              {api.method}
            </span>
            <Info size={16} className="text-gray-300 group-hover:text-sakura transition-colors" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 flex-grow">
          <p className="text-[10px] text-gray-400 font-medium line-clamp-1 italic">
            {api.description || '暂无简介'}
          </p>
          
          <div className="flex items-center text-sm text-gray-600 bg-white/30 p-2 rounded-xl border border-white/20">
            <Globe size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{api.url}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              <span>{api.lastChecked ? new Date(api.lastChecked).toLocaleTimeString() : '从未检测'}</span>
            </div>
            {api.latency !== undefined && (
              <div className="flex items-center text-sky-600 font-medium">
                <Zap size={12} className="mr-1" />
                <span>{api.latency}ms</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/20 pointer-events-auto">
          <div className="flex space-x-2">
            {isAdmin && onEdit && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(api);
                }}
                className="p-2 hover:bg-white/50 rounded-xl text-gray-600 transition-colors"
                title="编辑"
              >
                <Edit2 size={16} />
              </button>
            )}
            {isAdmin && onDelete && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(api.id);
                }}
                className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-xl transition-colors"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
            )}
            {!isAdmin && (
              <div className="flex items-center text-[10px] text-gray-400 font-medium">
                <ShieldCheck size={12} className="mr-1" />
                <span>只读模式</span>
              </div>
            )}
          </div>
          
          {onCheck && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCheck(api.id);
              }}
              disabled={isChecking}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all
                ${isChecking 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}
              `}
            >
              {isChecking ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
              <span>{isChecking ? '检测中...' : '立即检测'}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
