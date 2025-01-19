/**
 * JSBridge 初始化配置项
 */
export interface BridgeOptions {
  /** 是否开启调试模式 */
  debug?: boolean;
  /** 调用超时时间(ms) */
  timeout?: number;
  /** 命名空间,用于隔离不同JSBridge实例 */
  namespace?: string;
}

/**
 * JSBridge 方法调用配置项
 */
export interface CallOptions {
  /** 调用超时时间(ms) */
  timeout?: number;
  /** 是否同步调用 */
  sync?: boolean;
}

/**
 * JSBridge 响应数据结构
 */
export interface BridgeResponse<T = any> {
  /** 响应状态码 */
  code: number;
  /** 响应信息 */
  message: string;
  /** 响应数据 */
  data?: T;
}

/**
 * JSBridge 回调函数类型
 */
export type BridgeCallback<T = any> = (response: BridgeResponse<T>) => void;

/**
 * JSBridge 处理器函数类型
 */
export interface BridgeHandler {
  (data: any, callback: BridgeCallback): void;
}

/**
 * 消息队列项
 */
export interface MessageQueueItem {
  /** 调用的方法名 */
  method: string;
  /** 调用参数 */
  params: any;
  /** 回调函数 */
  callback?: BridgeCallback;
  /** 是否同步调用 */
  sync?: boolean;
}

/**
 * JSBridge 接口定义
 */
export interface JSBridgeInterface {
  /** 初始化JSBridge */
  init(options?: BridgeOptions): void;
  /** 等待JSBridge就绪 */
  ready(): Promise<void>;
  /** 异步调用原生方法 */
  call<T = any>(method: string, params?: any, options?: CallOptions): Promise<BridgeResponse<T>>;
  /** 同步调用原生方法 */
  callSync<T = any>(method: string, params?: any): BridgeResponse<T>;
  /** 注册供原生调用的方法 */
  register(method: string, handler: BridgeHandler): void;
  /** 注销已注册的方法 */
  unregister(method: string): void;
  /** 销毁JSBridge实例 */
  destroy(): void;
}