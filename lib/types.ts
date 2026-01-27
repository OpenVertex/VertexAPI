export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export type ApiStatus = 'online' | 'offline' | 'checking' | 'unknown';

export interface ApiItem {
  id: string;
  name: string;
  method: ApiMethod;
  url: string;
  description?: string;     // 新增：简介
  instruction?: string;     // 新增：详细使用说明
  defaultQueryParams?: { key: string, value: string }[]; // 新增：默认查询参数
  defaultRequestBody?: string; // 新增：默认请求体
  lastChecked?: string;
  status: ApiStatus;
  latency?: number;
  errorMessage?: string;
}

export interface ApiCheckResult {
  status: ApiStatus;
  latency?: number;
  error?: string;
}
