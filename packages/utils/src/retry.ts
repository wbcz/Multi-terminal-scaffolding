import type { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * 重试配置接口
 */
export interface RetryConfig {
  /** 最大重试次数 */
  retries?: number;
  /** 重试延迟时间（毫秒） */
  retryDelay?: number;
  /** 是否使用指数退避策略 */
  useExponentialBackoff?: boolean;
  /** 自定义重试条件 */
  retryCondition?: (error: AxiosError) => boolean;
  /** 重试前的回调函数 */
  onRetry?: (retryCount: number, error: AxiosError) => void;
}

/**
 * 默认的重试配置
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  retries: 3,
  retryDelay: 1000,
  useExponentialBackoff: true,
  retryCondition: (error: AxiosError) => {
    // 默认对网络错误和 5xx 错误进行重试
    return !error.response || (error.response.status >= 500 && error.response.status <= 599);
  },
  onRetry: () => {}
};

/**
 * 请求重试器类
 */
export class RequestRetrier {
  private config: Required<RetryConfig>;

  constructor(config?: RetryConfig) {
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  /**
   * 计算重试延迟时间
   */
  private getRetryDelay(retryCount: number): number {
    const { retryDelay, useExponentialBackoff } = this.config;
    
    if (!useExponentialBackoff) {
      return retryDelay;
    }

    // 使用指数退避策略：delay * 2^retryCount
    return retryDelay * Math.pow(2, retryCount);
  }

  /**
   * 执行重试逻辑
   */
  async retry<T>(
    request: () => Promise<T>,
    originalConfig: AxiosRequestConfig
  ): Promise<T> {
    let lastError: AxiosError;
    let retryCount = 0;

    while (retryCount < this.config.retries) {
      try {
        return await request();
      } catch (error) {
        lastError = error as AxiosError;

        // 检查是否满足重试条件
        if (!this.config.retryCondition(lastError)) {
          throw lastError;
        }

        // 最后一次重试失败直接抛出错误
        if (retryCount === this.config.retries - 1) {
          throw lastError;
        }

        // 触发重试回调
        this.config.onRetry(retryCount, lastError);

        // 等待重试延迟时间
        const delay = this.getRetryDelay(retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));

        retryCount++;
      }
    }

    throw lastError!;
  }
} 