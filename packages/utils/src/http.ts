import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestCache } from './requestCache';
import { RequestRetrier, RetryConfig } from './retry';

// 创建请求缓存实例
const requestCache = new RequestCache();

// 创建重试器实例
const requestRetrier = new RequestRetrier();

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  interface AxiosRequestConfig {
    useCache?: boolean;
    cacheKey?: string;
    cacheTime?: number;
    retry?: RetryConfig | boolean;
  }
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`; 
    }

    // 应用缓存拦截
    const interceptedConfig = await requestCache.requestInterceptor(config);
    return interceptedConfig as InternalAxiosRequestConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 应用缓存拦截
    response = requestCache.responseInterceptor(response);
    
    // 如果是缓存的响应，直接返回数据
    if ((response.config as any)._cached) {
      return (response.config as any)._cached;
    }
    
    return response.data;
  },
  async error => {
    const config = error.config;

    // 如果配置了重试
    if (config?.retry) {
      const retryConfig = typeof config.retry === 'boolean' ? {} : config.retry;
      const retrier = new RequestRetrier(retryConfig);

      try {
        // 执行重试
        return await retrier.retry(
          () => http.request(config),
          config
        );
      } catch (retryError) {
        // 重试失败，继续处理原始错误
        error = retryError;
      }
    }

    // 处理未授权错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 导出实例，方便外部管理
export { requestCache, requestRetrier };
export default http;