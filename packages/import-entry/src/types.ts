/**
 * 入口解析选项
 */
export interface ImportEntryOpts {
  /** 是否获取模板 */
  getTemplate?: boolean;
  /** 是否执行脚本 */
  executeScripts?: boolean;
  /** 是否获取样式 */
  getStyles?: boolean;
  /** 是否忽略 prefetch/preload 资源 */
  ignorePreloadAssets?: boolean;
  /** 自定义请求头 */
  requestHeaders?: Record<string, string>;
}

/**
 * 入口解析结果
 */
export interface ImportEntryResult {
  /** 模板内容 */
  template: string;
  /** 异步加载的脚本资源 */
  assetPublicPath: string;
  /** 获取外部脚本 */
  getExternalScripts: () => Promise<string[]>;
  /** 获取外部样式 */
  getExternalStyleSheets: () => Promise<string[]>;
  /** 执行脚本 */
  execScripts: (appName: string, strictGlobal?: boolean) => Promise<void>;
}

/**
 * 资源加载器配置
 */
export interface ResourceLoaderConfig {
  /** 资源 URL */
  url: string;
  /** 资源类型 */
  type: 'script' | 'style';
  /** 自定义属性 */
  attrs?: Record<string, string>;
  /** 加载超时时间 */
  timeout?: number;
}

/**
 * 资源加载结果
 */
export interface ResourceLoadResult {
  /** 资源内容 */
  content: string;
  /** 资源 URL */
  url: string;
  /** 资源类型 */
  type: 'script' | 'style';
} 