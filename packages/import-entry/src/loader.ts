import type { ResourceLoaderConfig, ResourceLoadResult } from './types';
import { MultipleProxySandbox } from './sandbox';

// 存储应用沙箱实例的 Map
const sandboxMap = new Map<string, MultipleProxySandbox>();

/**
 * 获取或创建应用沙箱
 * @param appName 应用名称
 * @returns 沙箱实例
 */
export function getOrCreateSandbox(appName: string): MultipleProxySandbox {
  if (!sandboxMap.has(appName)) {
    // 创建共享上下文
    const context = {
      document: window.document,
      history: window.history,
      location: window.location
    };
    
    // 创建新的沙箱实例
    const sandbox = new MultipleProxySandbox(appName, context);
    sandboxMap.set(appName, sandbox);
  }
  return sandboxMap.get(appName)!;
}

/**
 * 加载资源
 * @param config 资源加载配置
 * @returns 资源加载结果
 */
export async function loadResource(config: ResourceLoaderConfig): Promise<ResourceLoadResult> {
  const { url, type, attrs = {}, timeout = 10000 } = config;

  try {
    // 设置超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // 加载资源
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': type === 'script' ? 'text/javascript' : 'text/css'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to load ${type} from ${url}: ${response.statusText}`);
    }

    const content = await response.text();

    return {
      content,
      url,
      type
    };
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`Loading ${type} from ${url} timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * 执行脚本
 * @param script 脚本内容
 * @param proxy 代理对象
 * @param strictGlobal 是否严格全局作用域
 * @returns Promise<void>
 */
export function executeScript(script: string, proxy: Window, strictGlobal = false): void {
  try {
    if (strictGlobal) {
      // 使用 IIFE 并通过闭包传递 proxy 对象
      const strictScript = `
        (function(proxy) {
          with(proxy) {
            ${script}
          }
        })(this);
      `;

      // 使用 Function 构造函数创建一个新的函数作用域，并绑定 proxy 作为 this
      const executeFunction = new Function('proxy', `
        with(proxy) {
          ${script}
        }
      `);
      executeFunction.call(proxy, proxy);

    } else {
      // 直接在当前作用域执行脚本
      (0, eval)(script);
    }
  } catch (error) {
    console.error('Error executing script:', error);
    throw error;
  }
}

/**
 * 添加样式
 * @param style 样式内容
 * @param attrs 样式属性
 */
export function appendStyle(style: string, attrs: Record<string, string> = {}): void {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.textContent = style;

  // 添加自定义属性
  Object.entries(attrs).forEach(([key, value]) => {
    styleElement.setAttribute(key, value);
  });

  document.head.appendChild(styleElement);
}

/**
 * 批量加载资源
 * @param configs 资源配置数组
 * @returns 资源加载结果数组
 */
export async function loadResources(configs: ResourceLoaderConfig[]): Promise<ResourceLoadResult[]> {
  return Promise.all(configs.map(config => loadResource(config)));
} 