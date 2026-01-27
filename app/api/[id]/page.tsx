'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ApiItem } from '@/lib/types';
import { 
  ArrowLeft, 
  BookOpen, 
  Globe, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ShieldAlert,
  Terminal,
  Copy,
  Check,
  Play,
  Code,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ApiDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [api, setApi] = useState<ApiItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Testing states
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [showParams, setShowParams] = useState(false);
  const [queryParams, setQueryParams] = useState<{key: string, value: string}[]>([{key: '', value: ''}]);
  const [requestBody, setRequestBody] = useState('');

  useEffect(() => {
    fetchApiDetail();
  }, [id]);

  const handleTestApi = async () => {
    if (!api || isTesting) return;
    
    setIsTesting(true);
    setTestResult(null);

    // Convert queryParams array to object
    const paramsObj: Record<string, string> = {};
    queryParams.forEach(p => {
      if (p.key.trim()) paramsObj[p.key] = p.value;
    });
    
    try {
      let parsedBody = null;
      if (requestBody.trim()) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch (e) {
          parsedBody = requestBody;
        }
      }

      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: api.url,
          method: api.method,
          queryParams: paramsObj,
          body: parsedBody
        }),
      });
      
      const data = await res.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({ error: error.message || '测试失败' });
    } finally {
      setIsTesting(false);
    }
  };

  const fetchApiDetail = async () => {
    try {
      const res = await fetch('/api/apis');
      const data: ApiItem[] = await res.json();
      const found = data.find(item => item.id === id);
      if (found) {
        setApi(found);
        
        // Initialize test params with defaults
        if (found.defaultQueryParams && found.defaultQueryParams.length > 0) {
          setQueryParams(found.defaultQueryParams);
          setShowParams(true);
        }
        if (found.defaultRequestBody) {
          setRequestBody(found.defaultRequestBody);
          setShowParams(true);
        }

        // If status is unknown or old, trigger a fresh check
        if (found.status === 'unknown') {
          handleCheck(found);
        }
      } else {
        setApi(null);
      }
    } catch (error) {
      console.error('获取详情失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async (targetApi: ApiItem) => {
    try {
      const res = await fetch(`/api/check?url=${encodeURIComponent(targetApi.url)}`);
      const result = await res.json();
      
      const updates = {
        status: result.status,
        latency: result.latency,
        errorMessage: result.error,
        lastChecked: new Date().toISOString()
      };

      setApi(prev => prev ? { ...prev, ...updates } : null);

      // Persist to backend
      fetch('/api/apis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (error) {
      console.error('检测失败', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sakura/30 border-t-sakura rounded-full animate-spin" />
      </div>
    );
  }

  if (!api) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">未找到该接口</h1>
        <button onClick={() => router.back()} className="mt-4 text-sakura font-bold hover:underline">返回上一页</button>
      </div>
    );
  }

  const isOnline = api.status === 'online';

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-sakura transition-colors font-bold group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>返回列表</span>
        </button>

        {/* Hero Card */}
        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-sakura/10 rounded-full blur-3xl" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-black border ${
                  api.method === 'GET' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-green-100 text-green-600 border-green-200'
                }`}>
                  {api.method}
                </span>
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black ${
                  isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {isOnline ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                  <span>{isOnline ? '在线' : '离线'}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter">
                {api.name}
              </h1>
              <p className="text-gray-500 font-medium text-lg max-w-xl leading-relaxed">
                {api.description || '暂无简介'}
              </p>
            </div>

            <div className="flex md:flex-col gap-4">
               <div className="glass-dark p-4 rounded-2xl border border-white/20 min-w-[120px]">
                <div className="flex items-center text-gray-400 mb-1">
                  <Zap size={14} className="mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">延迟</span>
                </div>
                <p className="text-xl font-black text-gray-700">{api.latency !== undefined ? `${api.latency}ms` : '--'}</p>
              </div>
              <div className="glass-dark p-4 rounded-2xl border border-white/20 min-w-[120px]">
                <div className="flex items-center text-gray-400 mb-1">
                  <Clock size={14} className="mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">最近同步</span>
                </div>
                <p className="text-xl font-black text-gray-700">
                  {api.lastChecked ? new Date(api.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* URL & Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Endpoint URL */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center space-x-2 px-2">
              <Globe size={20} className="text-sakura-dark" />
              <span>接口地址</span>
            </h2>
            <div className="glass p-4 rounded-3xl flex items-center justify-between border border-white/40 group">
              <code className="text-gray-600 font-mono text-sm md:text-base break-all flex-grow px-2">
                {api.url}
              </code>
              <button 
                onClick={() => copyToClipboard(api.url)}
                className="ml-4 p-3 bg-white/50 hover:bg-white/80 rounded-2xl transition-all text-gray-500 hover:text-sakura"
                title="复制链接"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </section>

          {/* Test Interface */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-gray-800 flex items-center space-x-2">
                <Terminal size={20} className="text-sakura-dark" />
                <span>在线测试</span>
              </h2>
              <button 
                onClick={handleTestApi}
                disabled={isTesting}
                className={`
                  flex items-center space-x-2 px-6 py-2.5 rounded-2xl font-black text-sm transition-all
                  ${isTesting 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-sakura text-white shadow-lg shadow-pink-100 hover:-translate-y-0.5 active:translate-y-0'}
                `}
              >
                {isTesting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
                <span>{isTesting ? '正在发送请求...' : '发送测试请求'}</span>
              </button>
            </div>

            {/* Params Editor */}
            <div className="glass rounded-3xl border border-white/40 overflow-hidden">
              <button 
                onClick={() => setShowParams(!showParams)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center space-x-2 text-gray-600 font-bold text-sm">
                  <Settings size={16} />
                  <span>请求参数设置</span>
                  {queryParams.filter(p => p.key).length > 0 && (
                    <span className="bg-sakura/10 text-sakura text-[10px] px-2 py-0.5 rounded-full">
                      {queryParams.filter(p => p.key).length} Params
                    </span>
                  )}
                </div>
                {showParams ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>

              <AnimatePresence>
                {showParams && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/20 p-6 space-y-6"
                  >
                    {/* Query Params */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Query Parameters</span>
                        <button 
                          onClick={() => setQueryParams([...queryParams, {key: '', value: ''}])}
                          className="p-1.5 hover:bg-sakura/10 text-sakura rounded-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {queryParams.map((param, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input 
                              type="text" 
                              placeholder="Key" 
                              value={param.key}
                              onChange={(e) => {
                                const newParams = [...queryParams];
                                newParams[index].key = e.target.value;
                                setQueryParams(newParams);
                              }}
                              className="flex-1 bg-white/40 border border-white/20 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sakura/20"
                            />
                            <input 
                              type="text" 
                              placeholder="Value" 
                              value={param.value}
                              onChange={(e) => {
                                const newParams = [...queryParams];
                                newParams[index].value = e.target.value;
                                setQueryParams(newParams);
                              }}
                              className="flex-1 bg-white/40 border border-white/20 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sakura/20"
                            />
                            <button 
                              onClick={() => {
                                if (queryParams.length > 1) {
                                  setQueryParams(queryParams.filter((_, i) => i !== index));
                                } else {
                                  setQueryParams([{key: '', value: ''}]);
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Request Body (only for non-GET) */}
                    {api.method !== 'GET' && api.method !== 'HEAD' && (
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Request Body (JSON)</span>
                        <textarea 
                          placeholder='{ "key": "value" }'
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          className="w-full h-32 bg-white/40 border border-white/20 rounded-2xl p-4 text-sm font-mono outline-none focus:ring-2 focus:ring-sakura/20 resize-none"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {testResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                {/* Result Header */}
                <div className="flex items-center space-x-4 px-4 py-3 glass-dark rounded-2xl text-xs font-bold">
                  <div className={`flex items-center space-x-1.5 ${
                    testResult.status >= 200 && testResult.status < 300 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>状态码:</span>
                    <span className="font-black">{testResult.status || 'ERROR'}</span>
                  </div>
                  {testResult.latency && (
                    <div className="text-sky-600 flex items-center space-x-1.5">
                      <span>耗时:</span>
                      <span className="font-black">{testResult.latency}ms</span>
                    </div>
                  )}
                </div>

                {/* Result Body */}
                <div className="glass p-6 rounded-3xl border border-white/40 bg-gray-900/5 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-gray-500 text-xs font-black uppercase tracking-widest">
                      {testResult.isImage ? <ImageIcon size={14} /> : <Code size={14} />}
                      <span>{testResult.isImage ? '响应图片' : '响应内容'}</span>
                    </div>
                    {!testResult.isImage && (
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify(testResult.body, null, 2))}
                        className="text-gray-400 hover:text-sakura transition-colors"
                        title="复制响应内容"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                  </div>
                  
                  {testResult.isImage ? (
                    <div className="flex justify-center p-4 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                      <img 
                        src={testResult.body} 
                        alt="API Response" 
                        className="max-w-full h-auto rounded-xl shadow-lg"
                      />
                    </div>
                  ) : (
                    <pre className="font-mono text-sm text-gray-700 overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-sakura/20">
                      {typeof testResult.body === 'object' 
                        ? JSON.stringify(testResult.body, null, 2) 
                        : testResult.body || testResult.error || '无返回内容'}
                    </pre>
                  )}
                </div>
              </motion.div>
            )}
          </section>

          {/* Detailed Instructions */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center space-x-2 px-2">
              <BookOpen size={20} className="text-sakura-dark" />
              <span>使用指南</span>
            </h2>
            <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/40 prose prose-sakura max-w-none">
              {api.instruction ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {api.instruction}
                </ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 space-y-2">
                  <Terminal size={40} className="opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">管理员暂未提供详细说明</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
