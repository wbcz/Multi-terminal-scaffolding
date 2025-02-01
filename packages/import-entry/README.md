# @eleme/import-entry

基于 qiankun 思想实现的微前端应用加载器，用于解析和加载子应用的 HTML 入口。

## 特性

- 🚀 支持加载远程和本地 HTML
- 📦 自动解析和加载外部资源
- 🔒 支持沙箱隔离
- 🎨 支持样式隔离
- 📝 支持模板解析
- ⚡️ 异步加载和执行
- 🛡️ TypeScript 支持

## 安装

```bash
pnpm add @eleme/import-entry
```

## 使用示例

```typescript
import { importEntry } from '@eleme/import-entry';

async function loadMicroApp() {
  // 加载子应用
  const app = await importEntry('http://localhost:3001', {
    getTemplate: true,
    executeScripts: true,
    getStyles: true
  });

  // 创建代理对象（沙箱）
  const proxy = new Proxy(window, {
    get(target, prop) {
      // 可以在这里添加一些特殊处理
      return target[prop];
    }
  });

  // 执行脚本
  await app.execScripts(proxy, true);

  // 渲染模板
  const container = document.getElementById('micro-app-container');
  if (container) {
    container.innerHTML = app.template;
  }
}
```

## API

### importEntry(entry, opts?)

加载并解析 HTML 入口。

#### 参数

- `entry` (string): HTML 入口 URL 或 HTML 内容
- `opts` (object): 可选配置项
  - `getTemplate` (boolean): 是否获取模板，默认 `true`
  - `executeScripts` (boolean): 是否执行脚本，默认 `true`
  - `getStyles` (boolean): 是否获取样式，默认 `true`
  - `ignorePreloadAssets` (boolean): 是否忽略预加载资源，默认 `false`
  - `requestHeaders` (object): 自定义请求头

#### 返回值

返回一个 Promise，解析为包含以下属性的对象：

- `template` (string): HTML 模板内容
- `assetPublicPath` (string): 资源公共路径
- `getExternalScripts` (function): 获取外部脚本
- `getExternalStyleSheets` (function): 获取外部样式
- `execScripts` (function): 执行脚本

## 高级用法

### 1. 自定义资源加载

```typescript
import { loadResource } from '@eleme/import-entry';

// 加载单个资源
const script = await loadResource({
  url: 'http://example.com/script.js',
  type: 'script',
  timeout: 5000
});

// 加载多个资源
const resources = await loadResources([
  {
    url: 'http://example.com/style.css',
    type: 'style'
  },
  {
    url: 'http://example.com/script.js',
    type: 'script'
  }
]);
```

### 2. 沙箱隔离

```typescript
// 创建更严格的沙箱
const proxy = new Proxy(window, {
  get(target, prop) {
    // 禁止访问某些全局变量
    if (prop === 'someGlobalVar') {
      return undefined;
    }
    return target[prop];
  },
  set(target, prop, value) {
    // 禁止修改某些全局变量
    if (prop === 'someGlobalVar') {
      return false;
    }
    target[prop] = value;
    return true;
  }
});

// 使用严格模式执行脚本
await app.execScripts(proxy, true);
```

### 3. 样式隔离

```typescript
import { appendStyle } from '@eleme/import-entry';

// 添加带有作用域的样式
appendStyle(css, {
  'data-namespace': 'micro-app-1'
});
```

## 注意事项

1. **安全性**
   - 确保加载的资源来自可信源
   - 使用沙箱隔离子应用
   - 注意 CORS 配置

2. **性能优化**
   - 合理使用缓存
   - 避免重复加载资源
   - 控制并发请求数量

3. **兼容性**
   - 注意浏览器兼容性
   - 处理跨域问题
   - 处理资源加载失败

## 贡献

欢迎提交 Issue 或 Pull Request 来改进这个包。 