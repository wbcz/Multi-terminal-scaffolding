import { BridgeOptions, BridgeResponse, BridgeHandler, BridgeCallback } from '../types/bridge';

export class JSBridge {
  private static instance: JSBridge;
  private readonly namespace: string;
  private readonly timeout: number;
  private debug: boolean;
  private handlers: Map<string, BridgeHandler>;
  private callbacks: Map<string, BridgeCallback>;

  private constructor(options: BridgeOptions = {}) {
    this.namespace = options.namespace || 'ElemeJSBridge';
    this.timeout = options.timeout || 30000;
    this.debug = options.debug || false;
    this.handlers = new Map();
    this.callbacks = new Map();

    this.initBridge();
  }

  static getInstance(options?: BridgeOptions): JSBridge {
    if (!JSBridge.instance) {
      JSBridge.instance = new JSBridge(options);
    }
    return JSBridge.instance;
  }

  private initBridge(): void {
    // 初始化全局 JSBridge 对象
    (window as any)[this.namespace] = {
      handleNativeCall: this.handleNativeCall.bind(this),
      handleNativeCallback: this.handleNativeCallback.bind(this),
    };
  }

  // 注册处理器
  register(method: string, handler: BridgeHandler): void {
    this.handlers.set(method, handler);
    this.log(`Registered handler for method: ${method}`);
  }

  // 注销处理器
  unregister(method: string): void {
    this.handlers.delete(method);
    this.log(`Unregistered handler for method: ${method}`);
  }

  // 调用原生方法
  call<T = any>(method: string, params?: any): Promise<BridgeResponse<T>> {
    return new Promise((resolve, reject) => {
      const callbackId = `cb_${Date.now()}`;
      const timeoutId = setTimeout(() => {
        this.callbacks.delete(callbackId);
        reject(new Error(`Call to ${method} timed out after ${this.timeout}ms`));
      }, this.timeout);

      this.callbacks.set(callbackId, (response) => {
        clearTimeout(timeoutId);
        this.callbacks.delete(callbackId);
        resolve(response as BridgeResponse<T>);
      });

      const message = {
        method,
        params,
        callbackId,
      };

      this.log(`Calling native method: ${method}`, message);
      // 调用 Android 的 JSBridge 方法
      if ((window as any).ElemeJSBridge?.call) {
        (window as any).ElemeJSBridge.call(JSON.stringify(message));
      } else {
        reject(new Error('JSBridge not initialized'));
      }
    });
  }

  // 处理原生调用
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

  // 处理原生回调
  private handleNativeCallback(callbackId: string, response: BridgeResponse): void {
    this.log('Received native callback:', { callbackId, response });
    const callback = this.callbacks.get(callbackId);
    if (callback) {
      callback(response);
    }
  }

  // 发送回调给原生
  private sendCallback(callbackId: string, response: BridgeResponse): void {
    this.log('Sending callback to native:', { callbackId, response });
    if ((window as any).ElemeJSBridge?.handleCallback) {
      (window as any).ElemeJSBridge.handleCallback(callbackId, JSON.stringify(response));
    }
  }

  // 设置调试模式
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  // 日志输出
  private log(message: string, ...args: any[]): void {
    if (this.debug) {
      console.log(`[${this.namespace}] ${message}`, ...args);
    }
  }
} 