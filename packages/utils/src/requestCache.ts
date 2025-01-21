import { LRUCache } from './cache';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * 扩展 AxiosRequestConfig 类型,添加缓存相关配置
 */
interface CacheConfig extends AxiosRequestConfig {
  useCache?: boolean; // 是否使用缓存
  cacheKey?: string; // 自定义缓存键
  cacheTime?: number; // 缓存时间（毫秒）
  _cached?: any; // 内部使用的缓存数据属性
}

/**
 * 缓存项的数据结构
 */
interface CacheItem {
  data: any; // 缓存的响应数据
  timestamp: number; // 缓存时间戳
}

/**
 * 请求缓存管理类
 * 用于管理 HTTP 请求的缓存,支持 LRU 缓存策略
 */
export class RequestCache {
  private cache: LRUCache<string, CacheItem>;
  private defaultCacheTime: number;

  /**
   * 创建请求缓存实例
   * @param capacity 缓存容量,默认 100 条
   * @param defaultCacheTime 默认缓存时间,默认 5 分钟
   */
  constructor(capacity: number = 100, defaultCacheTime: number = 5 * 60 * 1000) {
    this.cache = new LRUCache(capacity);
    this.defaultCacheTime = defaultCacheTime;
  }

  /**
   * 生成缓存键
   * 如果配置中指定了 cacheKey 则使用,否则根据请求信息生成
   * @param config 请求配置
   * @returns 缓存键
   */
  private generateCacheKey(config: CacheConfig): string {
    if (config.cacheKey) {
      return config.cacheKey;
    }
    
    const { url, method = 'get', params, data } = config;
    return `${method}_${url}_${JSON.stringify(params)}_${JSON.stringify(data)}`;
  }

  /**
   * 检查缓存是否在有效期内
   * @param cacheItem 缓存项
   * @param cacheTime 缓存时间
   * @returns 是否有效
   */
  private isCacheValid(cacheItem: CacheItem, cacheTime: number): boolean {
    return Date.now() - cacheItem.timestamp < cacheTime;
  }

  /**
   * 请求拦截器
   * 在请求发送前检查是否有可用的缓存
   * @param config 请求配置
   * @returns 处理后的配置
   */
  requestInterceptor = (config: CacheConfig): CacheConfig | Promise<CacheConfig> => {
    if (!config.useCache) {
      return config;
    }

    const cacheKey = this.generateCacheKey(config);
    const cachedItem = this.cache.get(cacheKey);
    
    if (cachedItem && this.isCacheValid(cachedItem, config.cacheTime || this.defaultCacheTime)) {
      // 使用显式属性存储缓存数据
      config._cached = cachedItem.data;
    }

    return config;
  };

  /**
   * 响应拦截器
   * 缓存响应数据
   * @param response Axios 响应对象
   * @returns 处理后的响应
   */
  responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    const config = response.config as CacheConfig;
    
    if (config.useCache) {
      const cacheKey = this.generateCacheKey(config);
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response;
  };

  /**
   * 清除特定请求的缓存
   * @param config 请求配置
   */
  clearCache(config: CacheConfig): void {
    const cacheKey = this.generateCacheKey(config);
    this.cache.delete(cacheKey);
  }

  /**
   * 清除所有缓存数据
   */
  clearAllCache(): void {
    this.cache.clear();
  }
} 