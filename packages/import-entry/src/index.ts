import type { ImportEntryOpts, ImportEntryResult } from './types';
import { loadResource, loadResources, executeScript, appendStyle } from './loader';

/**
 * 解析 HTML 中的资源
 * @param html HTML 内容
 * @returns 解析结果
 */
function parseHTML(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 获取所有外部脚本
  const scripts = Array.from(doc.querySelectorAll('script[src]')).map(script => ({
    url: script.getAttribute('src') || '',
    type: 'script' as const,
    attrs: Array.from(script.attributes).reduce((acc, attr) => {
      if (attr.name !== 'src') {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {} as Record<string, string>)
  }));

  // 获取所有内联脚本
  const inlineScripts = Array.from(doc.querySelectorAll('script:not([src])')).map(script => script.textContent || '');

  // 获取所有外部样式
  const styles = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map(link => ({
    url: link.getAttribute('href') || '',
    type: 'style' as const,
    attrs: Array.from(link.attributes).reduce((acc, attr) => {
      if (attr.name !== 'href') {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {} as Record<string, string>)
  }));

  // 获取所有内联样式
  const inlineStyles = Array.from(doc.querySelectorAll('style')).map(style => style.textContent || '');

  // 获取模板内容
  const template = doc.body.innerHTML;

  return {
    scripts,
    inlineScripts,
    styles,
    inlineStyles,
    template
  };
}

/**
 * 导入 HTML 入口
 * @param entry 入口 URL 或 HTML 内容
 * @param opts 选项
 * @returns 导入结果
 */
export async function importEntry(
  entry: string,
  opts: ImportEntryOpts = {}
): Promise<ImportEntryResult> {
  const {
    getTemplate = true,
    executeScripts: shouldExecuteScripts = true,
    getStyles = true,
    ignorePreloadAssets = false,
    requestHeaders = {}
  } = opts;

  // 判断是否是 URL
  const isUrl = /^https?:\/\//.test(entry);

  // 获取 HTML 内容
  let html: string;
  if (isUrl) {
    const response = await fetch(entry, { headers: requestHeaders });
    html = await response.text();
  } else {
    html = entry;
  }

  // 解析 HTML
  const {
    scripts,
    inlineScripts,
    styles,
    inlineStyles,
    template
  } = parseHTML(html);

  // 获取资源的基础路径
  const assetPublicPath = isUrl
    ? new URL('.', entry).href
    : window.location.origin + '/';

  // 处理资源 URL，将相对路径转换为绝对路径
  const processUrl = (url: string) => {
    if (/^https?:\/\//.test(url)) {
      return url;
    }
    return new URL(url, assetPublicPath).href;
  };

  // 处理外部脚本
  const getExternalScripts = async () => {
    if (!shouldExecuteScripts) return [];
    const results = await loadResources(
      scripts.map(script => ({
        ...script,
        url: processUrl(script.url)
      }))
    );
    return results.map(result => result.content);
  };

  // 处理外部样式
  const getExternalStyleSheets = async () => {
    if (!getStyles) return [];
    const results = await loadResources(
      styles.map(style => ({
        ...style,
        url: processUrl(style.url)
      }))
    );
    return results.map(result => result.content);
  };

  // 执行脚本
  const execScripts = async (proxy: Window, strictGlobal = false) => {
    if (!shouldExecuteScripts) return;

    // 执行内联脚本
    inlineScripts.forEach(script => {
      executeScript(script, proxy, strictGlobal);
    });

    // 加载并执行外部脚本
    const externalScripts = await getExternalScripts();
    externalScripts.forEach(script => {
      executeScript(script, proxy, strictGlobal);
    });
  };

  // 如果需要样式，立即加载并添加
  if (getStyles) {
    // 添加内联样式
    inlineStyles.forEach(style => {
      appendStyle(style);
    });

    // 加载并添加外部样式
    const externalStyles = await getExternalStyleSheets();
    externalStyles.forEach(style => {
      appendStyle(style);
    });
  }

  return {
    template: getTemplate ? template : '',
    assetPublicPath,
    getExternalScripts,
    getExternalStyleSheets,
    execScripts
  };
}

export * from './types';
export * from './loader'; 