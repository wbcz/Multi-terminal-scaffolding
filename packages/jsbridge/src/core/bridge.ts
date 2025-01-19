import { BridgeOptions, BridgeResponse, BridgeHandler, BridgeCallback, MessageQueueItem } from '../types/bridge';

export class JSBridge {
  private static instance: JSBridge;
  private readonly namespace: string;
  private readonly timeout: number;
  private debug: boolean;
  private handlers: Map<string, BridgeHandler>;
  private callbacks: Map<string, BridgeCallback>;
  private readyPromise: Promise<void>;
  private readyResolver?: () => void;
  private messageQueue: MessageQueueItem[] = [];
  private isReady: boolean = false;

  private constructor(options: BridgeOptions = {}) {
    this.namespace = options.namespace || 'ElemeJSBridge';
    this.timeout = options.timeout || 30000;
    this.debug = options.debug || false;
    this.handlers = new Map();
    this.callbacks = new Map();
    
    // 初始化就绪状态 Promise
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });

    this.initBridge();
  }

  /**
   * 获取 JSBridge 单例实例
   * @param options 初始化配置项
   */
  static getInstance(options?: BridgeOptions): JSBridge {
    if (!JSBridge.instance) {
      JSBridge.instance = new JSBridge(options);
    }
    return JSBridge.instance;
  }

  private initBridge(): void {
    (window as any)[this.namespace] = {
      handleNativeCall: this.handleNativeCall.bind(this),
      handleNativeCallback: this.handleNativeCallback.bind(this),
      notifyBridgeReady: this.notifyBridgeReady.bind(this),
    };
  }

  /**
   * 注册 JS 处理器，供 Native 调用
   * @param method 方法名
   * @param handler 处理函数
   */
  register(method: string, handler: BridgeHandler): void {
    this.handlers.set(method, handler);
    this.log(`Registered handler for method: ${method}`);
  }

  /**
   * 注销 JS 处理器
   * @param method 方法名
   */
  unregister(method: string): void {
    this.handlers.delete(method);
    this.log(`Unregistered handler for method: ${method}`);
  }

  /**
   * 等待 JSBridge 就绪
   * @param timeout 超时时间（毫秒）
   * @returns Promise<void>
   */
  async waitForReady(timeout?: number): Promise<void> {
    if (timeout) {
      return Promise.race([
        this.readyPromise,
        new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error('JSBridge ready timeout')), timeout);
        }),
      ]);
    }
    return this.readyPromise;
  }

  /**
   * 由 Native 端调用，通知 JSBridge 已就绪
   */
  private notifyBridgeReady(): void {
    this.log('Bridge is ready');
    this.isReady = true;
    this.readyResolver?.();
    // 处理队列中的消息
    this.flushMessageQueue();
  }

  /**
   * 处理消息队列中的所有消息
   */
  private flushMessageQueue(): void {
    this.log(`Flushing message queue, ${this.messageQueue.length} messages`);
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.doCall(message.method, message.data, message.callback);
      }
    }
  }

  /**
   * 实际执行调用 Native 方法的逻辑
   */
  private doCall(method: string, params?: any, callback?: BridgeCallback): void {
    const callbackId = callback ? `cb_${Date.now()}` : undefined;
    
    if (callback && callbackId) {
      const timeoutId = setTimeout(() => {
        this.callbacks.delete(callbackId);
        callback({
          code: 504,
          message: `Call to ${method} timed out after ${this.timeout}ms`
        });
      }, this.timeout);

      this.callbacks.set(callbackId, (response) => {
        clearTimeout(timeoutId);
        this.callbacks.delete(callbackId);
        callback(response);
      });
    }

    const message = {
      method,
      params,
      callbackId,
    };

    this.log(`Calling native method: ${method}`, message);
    if ((window as any).ElemeJSBridge?.call) {
      (window as any).ElemeJSBridge.call(JSON.stringify(message));
    } else {
      if (callback) {
        callback({
          code: 500,
          message: 'JSBridge not initialized'
        });
      }
    }
  }

  /**
   * 调用 Native 方法
   * @param method 方法名
   * @param params 参数
   * @returns Promise<BridgeResponse>
   */
  async call<T = any>(method: string, params?: any): Promise<BridgeResponse<T>> {
    return new Promise((resolve, reject) => {
      const callback = (response: BridgeResponse) => {
        if (response.code === 200) {
          resolve(response as BridgeResponse<T>);
        } else {
          reject(new Error(response.message));
        }
      };

      if (!this.isReady) {
        // Bridge还未就绪，将消息加入队列
        this.log(`Bridge not ready, queueing message: ${method}`);
        this.messageQueue.push({
          method,
          data: params,
          callback
        });
      } else {
        // Bridge已就绪，直接执行
        this.doCall(method, params, callback);
      }
    });
  }

  private handleNativeCall(message: { method: string; params?: any; callbackId?: string }): void {
    this.log('Received native call:', message);
    const { method, params, callbackId } = message;
    const handler = this.handlers.get(method);

    if (handler) {
      handler(params, (response) => {
        if (callbackId) {
          this.sendCallback(callbackId, response);
        }
      });
    } else {
      if (callbackId) {
        this.sendCallback(callbackId, {
          code: 404,
          message: `Handler not found for method: ${method}`,
        });
      }
    }
  }

  private handleNativeCallback(callbackId: string, response: BridgeResponse): void {
    this.log('Received native callback:', { callbackId, response });
    const callback = this.callbacks.get(callbackId);
    if (callback) {
      callback(response);
    }
  }

  private sendCallback(callbackId: string, response: BridgeResponse): void {
    this.log('Sending callback to native:', { callbackId, response });
    if ((window as any).ElemeJSBridge?.handleCallback) {
      (window as any).ElemeJSBridge.handleCallback(callbackId, JSON.stringify(response));
    }
  }

  /**
   * 设置调试模式
   * @param enabled 是否启用调试
   */
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  private log(message: string, ...args: any[]): void {
    if (this.debug) {
      console.log(`[${this.namespace}] ${message}`, ...args);
    }
  }
}