import { importEntry } from './index';

/**
 * 加载单个子应用
 * @param name 应用名称
 * @param url 应用入口地址
 * @param containerId 容器ID
 */
async function loadMicroApp(name: string, url: string, containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return;
  }

  try {
    console.log(`[${name}] 开始加载应用:`, url);
    // 显示加载状态
    container.innerHTML = '<div class="loading">加载中...</div>';

    // 加载子应用
    const app = await importEntry(url, {
      getTemplate: true,
      executeScripts: true,
      getStyles: true
    });
    console.log(`[${name}] 应用入口加载完成`);

    // 获取外部资源
    console.log(`[${name}] 开始加载外部资源`);
    const [scripts, styles] = await Promise.all([
      app.getExternalScripts(),
      app.getExternalStyleSheets()
    ]);
    console.log(`[${name}] 外部资源加载完成:`, { scripts: scripts.length, styles: styles.length });

    // 渲染模板
    console.log(`[${name}] 开始渲染模板`);
    container.innerHTML = app.template;
    console.log(`[${name}] 模板渲染完成`);

    // 等待 DOM 渲染
    await new Promise(resolve => setTimeout(resolve, 50));

    // 在沙箱中执行脚本
    console.log(`[${name}] 开始执行脚本`);
    await app.execScripts(name, true);
    console.log(`[${name}] 脚本执行完成`);

  } catch (error) {
    console.error(`[${name}] 加载失败:`, error);
    container.innerHTML = `
      <div class="error">
        <h3>加载失败</h3>
        <p>${error instanceof Error ? error.message : '未知错误'}</p>
      </div>
    `;
  }
}

/**
 * 启动所有子应用
 */
async function bootstrap() {
  console.log('开始加载子应用...');
  
  // 并行加载多个子应用
  await Promise.all([
    loadMicroApp('app1', 'http://localhost:3000/sub1', 'app1-container'),
    loadMicroApp('app2', 'http://localhost:3000/sub2', 'app2-container'),
    // 可以继续添加更多子应用
  ]);

  console.log('所有子应用加载完成');
}

// 确保 DOM 加载完成后再启动应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

// 导出接口供外部使用
export {
  loadMicroApp,
  bootstrap
}; 