'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Save, AlignLeft, BookOpen, Settings, Trash2 } from 'lucide-react';
import { ApiItem, ApiMethod } from '@/lib/types';

interface ApiModalProps {
  api?: ApiItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (api: Partial<ApiItem>) => void;
}

const methods: ApiMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];

export default function ApiModal({ api, isOpen, onClose, onSave }: ApiModalProps) {
  const [formData, setFormData] = useState<Partial<ApiItem>>({
    name: '',
    url: '',
    method: 'GET',
    description: '',
    instruction: '',
    defaultQueryParams: [{ key: '', value: '' }],
    defaultRequestBody: '',
  });

  useEffect(() => {
    if (api) {
      setFormData({
        ...api,
        defaultQueryParams: api.defaultQueryParams || [{ key: '', value: '' }],
        defaultRequestBody: api.defaultRequestBody || '',
      });
    } else {
      setFormData({ 
        name: '', 
        url: '', 
        method: 'GET',
        description: '',
        instruction: '',
        defaultQueryParams: [{ key: '', value: '' }],
        defaultRequestBody: '',
      });
    }
  }, [api, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
          <div className="glass rounded-3xl p-8 shadow-2xl overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400" />
            
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold text-gray-800 flex items-center">
                {api ? '编辑接口' : '添加新接口'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1">接口名称</label>
                    <input
                      required
                      type="text"
                      placeholder="例如：百度搜索接口"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sakura-dark/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1">请求方法</label>
                    <div className="flex flex-wrap gap-2">
                      {methods.map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormData({ ...formData, method: m })}
                          className={`
                            px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                            ${formData.method === m 
                              ? 'bg-sakura text-white shadow-md scale-105' 
                              : 'bg-white/40 text-gray-500 hover:bg-white/60'}
                          `}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1">接口 URL</label>
                    <input
                      required
                      type="url"
                      placeholder="https://api.example.com/v1"
                      value={formData.url}
                      onChange={e => setFormData({ ...formData, url: e.target.value })}
                      className="w-full bg-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sakura-dark/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1 flex items-center">
                      <AlignLeft size={14} className="mr-1" /> 接口简介
                    </label>
                    <textarea
                      placeholder="简短介绍接口的功能..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sakura-dark/50 transition-all h-24 resize-none"
                    />
                  </div>

                  {/* Default Params Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-600 font-bold text-sm">
                      <Settings size={16} />
                      <span>默认测试参数</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Query Params</span>
                        <button 
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            defaultQueryParams: [...(formData.defaultQueryParams || []), { key: '', value: '' }]
                          })}
                          className="p-1 hover:bg-sakura/10 text-sakura rounded-lg transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {formData.defaultQueryParams?.map((param, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input 
                              type="text" 
                              placeholder="Key" 
                              value={param.key}
                              onChange={(e) => {
                                const newParams = [...(formData.defaultQueryParams || [])];
                                newParams[index].key = e.target.value;
                                setFormData({ ...formData, defaultQueryParams: newParams });
                              }}
                              className="flex-1 bg-white/40 border border-white/20 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sakura/20"
                            />
                            <input 
                              type="text" 
                              placeholder="Value" 
                              value={param.value}
                              onChange={(e) => {
                                const newParams = [...(formData.defaultQueryParams || [])];
                                newParams[index].value = e.target.value;
                                setFormData({ ...formData, defaultQueryParams: newParams });
                              }}
                              className="flex-1 bg-white/40 border border-white/20 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sakura/20"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const newParams = formData.defaultQueryParams?.filter((_, i) => i !== index);
                                setFormData({ ...formData, defaultQueryParams: newParams?.length ? newParams : [{ key: '', value: '' }] });
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {formData.method !== 'GET' && formData.method !== 'HEAD' && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Request Body (JSON)</span>
                        <textarea 
                          placeholder='{ "key": "value" }'
                          value={formData.defaultRequestBody}
                          onChange={(e) => setFormData({ ...formData, defaultRequestBody: e.target.value })}
                          className="w-full h-24 bg-white/40 border border-white/20 rounded-2xl p-3 text-xs font-mono outline-none focus:ring-2 focus:ring-sakura/20 resize-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 ml-1 flex items-center">
                    <BookOpen size={14} className="mr-1" /> 详细使用说明 (支持 Markdown 风格)
                  </label>
                  <textarea
                    placeholder="在此输入详细的参数说明、请求示例、返回格式等..."
                    value={formData.instruction}
                    onChange={e => setFormData({ ...formData, instruction: e.target.value })}
                    className="w-full bg-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sakura-dark/50 transition-all h-[calc(100%-2rem)] min-h-[300px] resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-200 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center space-x-2"
                >
                  {api ? <Save size={20} /> : <Plus size={20} />}
                  <span>{api ? '保存修改' : '立即创建'}</span>
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
