import type { ResourceLoaderConfig, ResourceLoadResult } from './types';
import { MultipleProxySandbox } from './sandbox';

// 存储应用沙箱实例的 Map
const sandboxMap = new Map<string, MultipleProxySandbox>();

/**
 * 获取或创建应用沙箱
 * @param appName 应用名称
 * @returns 沙箱实例
 */
function getOrCreateSandbox(appName: string): MultipleProxySandbox {
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
 * @param appName 应用名称
 * @param strictGlobal 是否严格全局作用域
 * @returns Promise<void>
 */
export async function executeScript(script: string, appName: string, strictGlobal = false): Promise<void> {
  try {
    // 获取或创建沙箱实例
    const sandbox = getOrCreateSandbox(appName);
    
    // 激活沙箱
    sandbox.active();
    
    // 获取代理对象
    const proxy = sandbox.getProxy();
    debugger
    // 包装脚本内容
    const wrappedScript = `
      try {
        with(window) {
          ${script}
        }
      } catch(e) {
        console.error('[${appName}] Script execution error:', e);
        throw e;
      }
    `;

    // 创建函数
    const executeFunction = new Function('window', 'self', 'globalThis', wrappedScript);

    // 执行函数
    executeFunction.call(proxy, proxy, proxy, proxy);

    return Promise.resolve();
  } catch (error) {
    console.error(`[${appName}] Error executing script:`, error);
    return Promise.reject(error);
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