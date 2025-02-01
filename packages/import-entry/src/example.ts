import { importEntry } from './index';

async function loadMicroApp() {
  try {
    // 加载子应用
    const app = await importEntry('http://localhost:3001', {
      getTemplate: true,
      executeScripts: true,
      getStyles: true
    });

    // 创建代理对象
    const proxy = new Proxy(window, {
      get(target: Window & typeof globalThis, prop: PropertyKey) {
        // 可以在这里添加一些特殊处理
        return Reflect.get(target, prop);
      },
      set(target: Window & typeof globalThis, prop: PropertyKey, value: any) {
        // 可以在这里添加一些特殊处理
        Reflect.set(target, prop, value);
        return true;
      }
    });

    // 获取外部脚本
    const scripts = await app.getExternalScripts();
    console.log('External scripts:', scripts);

    // 获取外部样式
    const styles = await app.getExternalStyleSheets();
    console.log('External styles:', styles);

    // 执行脚本
    await app.execScripts(proxy, true);

    // 渲染模板
    const container = document.getElementById('micro-app-container');
    if (container) {
      container.innerHTML = app.template;
    }
  } catch (error) {
    console.error('Failed to load micro app:', error);
  }
}

// 使用示例
loadMicroApp(); 