import type { ResourceLoaderConfig, ResourceLoadResult } from './types';

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
 */
export function executeScript(script: string, proxy: Window, strictGlobal = false): void {
  // 创建一个新的 script 元素
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.text = script;

  // 如果需要严格的全局作用域
  if (strictGlobal) {
    // 使用 with 语句限制全局作用域
    const strictScript = `
      (function(window) {
        with(window) {
          ${script}
        }
      })(window.proxy);
    `;
    scriptElement.text = strictScript;
  }

  // 将脚本添加到文档中执行
  document.head.appendChild(scriptElement);
  document.head.removeChild(scriptElement);
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