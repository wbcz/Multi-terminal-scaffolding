import { importEntry } from '../../src';

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

    // 获取外部脚本和样式
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

// 启动应用
async function bootstrap() {
  console.log('开始加载子应用...');
  
  // 并行加载两个子应用
  await Promise.all([
    loadMicroApp('sub-app-1', 'http://localhost:3001/sub1', 'app1-container'),
    loadMicroApp('sub-app-2', 'http://localhost:3001/sub2', 'app2-container')
  ]);

  console.log('所有子应用加载完成');
}

// 确保 DOM 加载完成后再启动应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
} 