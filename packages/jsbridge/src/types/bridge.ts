/**
 * JSBridge 初始化配置项
 */
export interface BridgeOptions {
  /** 是否开启调试模式 */
  debug?: boolean;
  /** 调用超时时间(ms) */
  timeout?: number;
  /** 命名空间 */
  namespace?: string;
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
export type BridgeCallback = (response: BridgeResponse) => void;

/**
 * JSBridge 处理器函数类型
 */
export type BridgeHandler = (data: any, callback: BridgeCallback) => void;

/**
 * 消息队列项
 */
export interface MessageQueueItem {
  /** 调用的方法名 */
  method: string;
  /** 调用参数 */
  data: any;
  /** 回调函数 */
  callback?: BridgeCallback;
} 