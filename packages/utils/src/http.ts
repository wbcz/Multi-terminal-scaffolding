import axios from 'axios';
import { RequestCache } from './requestCache';

// 创建请求缓存实例
const requestCache = new RequestCache();

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
http.interceptors.request.use(
  async config => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 应用缓存拦截
    return requestCache.requestInterceptor(config);
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 应用缓存拦截
    response = requestCache.responseInterceptor(response);
    
    // 如果是缓存的响应，直接返回数据
    if ((response.config as any).cached) {
      return (response.config as any).cached;
    }
    
    return response.data;
  },
  error => {
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 导出缓存实例，方便外部管理缓存
export { requestCache };
export default http; 