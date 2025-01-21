import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestCache } from './requestCache';
import { RequestRetrier, RetryConfig } from './retry';

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  interface AxiosRequestConfig {
    useCache?: boolean;
    cacheKey?: string;
    cacheTime?: number;
    retry?: RetryConfig | boolean;
  }
}

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 缓存拦截器
const cacheInterceptor = (requestCache: RequestCache) => {
  return {
    request: async (config: InternalAxiosRequestConfig) => {
      const interceptedConfig = await requestCache.requestInterceptor(config);
      return interceptedConfig as InternalAxiosRequestConfig;
    },
    response: (response: AxiosResponse) => {
      response = requestCache.responseInterceptor(response);
      
      if ((response.config as any)._cached) {
        return (response.config as any)._cached;
      }
      
      return response;
    }
  };
};

// 重试拦截器
const retryInterceptor = () => {
  return {
    response: async (error: any) => {
      const config = error.config;

      if (config?.retry) {
        const retryConfig = typeof config.retry === 'boolean' ? {} : config.retry;
        const retrier = new RequestRetrier(retryConfig);

        try {
          return await retrier.retry(
            () => http.request(config),
            config
          );
        } catch (retryError) {
          error = retryError;
        }
      }
      
      return Promise.reject(error);
    }
  };
};

// 认证拦截器
const authInterceptor = () => {
  return {
    request: (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    response: (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  };
};

// 响应数据转换拦截器
const transformInterceptor = () => {
  return {
    response: (response: AxiosResponse) => {
      return response.data;
    }
  };
};

// 创建拦截器实例
const requestCache = new RequestCache();

// 注册拦截器
const { request: cacheRequestInterceptor, response: cacheResponseInterceptor } = cacheInterceptor(requestCache);
const { response: retryResponseInterceptor } = retryInterceptor();
const { request: authRequestInterceptor, response: authResponseInterceptor } = authInterceptor();
const { response: transformResponseInterceptor } = transformInterceptor();

// 添加请求拦截器
http.interceptors.request.use(cacheRequestInterceptor);
http.interceptors.request.use(authRequestInterceptor);

// 添加响应拦截器
http.interceptors.response.use(transformResponseInterceptor, authResponseInterceptor);
http.interceptors.response.use(cacheResponseInterceptor, retryResponseInterceptor);

export { requestCache };
export default http;