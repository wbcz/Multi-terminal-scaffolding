import { BridgeOptions, BridgeResponse, BridgeHandler, MessageQueueItem, CallOptions } from '../types';

declare global {
  interface Window {
    WebViewJavascriptBridge?: {
      init?: (callback: () => void) => void;
      callHandler?: (method: string, params: any, callback: (response: any) => void) => void;
      registerHandler?: (method: string, handler: (data: any, callback: (response: any) => void) => void) => void;
    };
    WVJBCallbacks?: Array<(bridge: any) => void>;
    webkit?: {
      messageHandlers: {
        [key: string]: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

export class JSBridge {
  private static instance: JSBridge;
  private options: BridgeOptions = {
    debug: false,
    timeout: 30000,
    namespace: 'ElemeJSBridge'
  };

  private bridge: any = null;
  private readyPromise: Promise<void> | null = null;
  private messageQueue: MessageQueueItem[] = [];
  private handlers: Map<string, BridgeHandler> = new Map();
  private callbackId: number = 0;
  private callbacks: Map<string, (response: any) => void> = new Map();

  private constructor(options?: BridgeOptions) {
    this.options = { ...this.options, ...options };
    this.setupBridge();
  }

  static getInstance(options?: BridgeOptions): JSBridge {
    if (!JSBridge.instance) {
      JSBridge.instance = new JSBridge(options);
    }
    return JSBridge.instance;
  }

  private log(...args: any[]): void {
    if (this.options.debug) {
      console.log(`[${this.options.namespace}]`, ...args);
    }
  }

  private setupBridge(): void {
    if (window.WebViewJavascriptBridge) {
      this.initBridge(window.WebViewJavascriptBridge);
    } else if (window.WVJBCallbacks) {
      window.WVJBCallbacks.push((bridge) => this.initBridge(bridge));
    } else {
      window.WVJBCallbacks = [(bridge) => this.initBridge(bridge)];
      // 注入桥接脚本
      this.injectBridgeScript();
    }
  }

  private injectBridgeScript(): void {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/webviewjavascriptbridge@1.0.0/WebViewJavascriptBridge.js';
    script.async = true;
    document.body.appendChild(script);
  }

  private initBridge(bridge: any): void {
    this.bridge = bridge;
    if (bridge.init) {
      bridge.init(() => {
        this.log('Bridge initialized');
      });
    }
    this.flushMessageQueue();
  }

  private flushMessageQueue(): void {
    this.messageQueue.forEach(item => {
      if (item.sync) {
        this.callNativeSync(item.method, item.params);
      } else {
        this.callNative(item.method, item.params).then(response => {
          item.callback?.(response);
        });
      }
    });
    this.messageQueue = [];
  }

  ready(): Promise<void> {
    if (!this.readyPromise) {
      this.readyPromise = new Promise((resolve) => {
        if (this.bridge) {
          resolve();
        } else {
          const checkBridge = setInterval(() => {
            if (this.bridge) {
              clearInterval(checkBridge);
              resolve();
            }
          }, 100);
        }
      });
    }
    return this.readyPromise;
  }

  private async callNative<T>(method: string, params?: any): Promise<BridgeResponse<T>> {
    await this.ready();

    return new Promise((resolve, reject) => {
      const callbackId = `cb_${++this.callbackId}`;
      const timer = setTimeout(() => {
        this.callbacks.delete(callbackId);
        reject(this.createResponse(408, 'Request timeout'));
      }, this.options.timeout);

      this.callbacks.set(callbackId, (response) => {
        clearTimeout(timer);
        this.callbacks.delete(callbackId);
        resolve(this.parseResponse(response));
      });

      try {
        if (this.bridge?.callHandler) {
          this.bridge.callHandler(method, { ...params, callbackId });
        } else if (window.webkit?.messageHandlers?.[method]) {
          window.webkit.messageHandlers[method].postMessage({ ...params, callbackId });
        } else {
          reject(this.createResponse(404, 'Bridge method not found'));
        }
      } catch (error) {
        reject(this.createResponse(500, 'Failed to call native method'));
      }
    });
  }

  private callNativeSync<T>(method: string, params?: any): BridgeResponse<T> {
    if (!this.bridge) {
      return this.createResponse(503, 'Bridge not ready');
    }

    try {
      if (this.bridge.callSyncHandler) {
        const response = this.bridge.callSyncHandler(method, params);
        return this.parseResponse(response);
      }
      return this.createResponse(501, 'Sync method not implemented');
    } catch (error) {
      return this.createResponse(500, 'Failed to call native method');
    }
  }

  async call<T = any>(method: string, params?: any, options?: CallOptions): Promise<BridgeResponse<T>> {
    const callOptions = { ...this.options, ...options };

    if (!this.bridge) {
      this.messageQueue.push({
        method,
        params,
        callback: (response) => response,
        sync: false
      });
      return this.createResponse(202, 'Message queued');
    }

    return this.callNative<T>(method, params);
  }

  callSync<T = any>(method: string, params?: any): BridgeResponse<T> {
    if (!this.bridge) {
      this.messageQueue.push({
        method,
        params,
        sync: true
      });
      return this.createResponse(202, 'Message queued');
    }

    return this.callNativeSync<T>(method, params);
  }

  register(method: string, handler: BridgeHandler): void {
    this.handlers.set(method, handler);
    if (this.bridge?.registerHandler) {
      this.bridge.registerHandler(method, (data: any, callback: any) => {
        handler(data, (response) => {
          callback(this.stringifyResponse(response));
        });
      });
    }
  }

  unregister(method: string): void {
    this.handlers.delete(method);
    if (this.bridge?.unregisterHandler) {
      this.bridge.unregisterHandler(method);
    }
  }

  destroy(): void {
    this.messageQueue = [];
    this.handlers.clear();
    this.callbacks.clear();
    this.bridge = null;
    this.readyPromise = null;
  }

  private createResponse<T>(code: number, message: string, data?: T): BridgeResponse<T> {
    return { code, message, data };
  }

  private parseResponse<T>(response: any): BridgeResponse<T> {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        code: parsed.code ?? 200,
        message: parsed.message ?? 'Success',
        data: parsed.data
      };
    } catch {
      return this.createResponse(500, 'Invalid response format');
    }
  }

  private stringifyResponse(response: BridgeResponse): string {
    try {
      return JSON.stringify(response);
    } catch {
      return JSON.stringify(this.createResponse(500, 'Failed to stringify response'));
    }
  }
} 