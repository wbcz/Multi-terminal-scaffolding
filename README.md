# 饿了么后台管理系统

基于 React + TypeScript + Vite 的后台管理系统。

## 技术栈

- React 18
- TypeScript 5
- Vite 4
- Ant Design 5
- MobX
- React Router 6
- Styled Components
- pnpm workspace

## 项目结构

```bash
/packages               # 共享包目录
  /jsbridge            # JSBridge SDK
  /api                 # API 接口封装
  /hooks               # 通用 Hooks
  /types               # 类型定义
  /ui                  # UI 组件库
  /utils               # 工具函数
```

## JSBridge SDK

用于 Web 和 Native 应用之间的双向通信。

### 特性

- Web 和 Native 双向通信
- 同步异步调用支持
- 消息队列和加载顺序处理
- 完整的错误处理
- TypeScript 类型支持

### 使用示例

```typescript
import { createJSBridge, BridgeMethods } from '@eleme/jsbridge';

// 创建 JSBridge 实例
const bridge = createJSBridge({
  debug: true,
  timeout: 5000
});

// 等待 bridge 就绪
await bridge.ready();

// 异步调用
try {
  const response = await bridge.call(BridgeMethods.GET_LOCATION);
  console.log('Location:', response.data);
} catch (error) {
  console.error('Failed to get location:', error);
}

// 同步调用
const response = bridge.callSync(BridgeMethods.GET_DEVICE_INFO);
console.log('Device info:', response.data);

// 注册处理方法
bridge.register('customMethod', (data, callback) => {
  callback({
    code: 200,
    message: 'Success',
    data: { processed: true }
  });
});
```

### 文档

- [时序图](packages/jsbridge/docs/sequence.puml)
- [流程图](packages/jsbridge/docs/flow.puml)

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
pnpm build
```

### 开发

```bash
pnpm dev
```

## 特性

- 📦 基于 pnpm workspace 的 monorepo 工程
- 🚀 基于 Vite 的快速开发和构建
- 💪 TypeScript 类型安全
- 🎨 Ant Design 组件库
- 📱 响应式布局
- 🔐 基于角色的权限控制
- 📊 数据可视化
- 🌐 国际化支持
- 🎯 状态管理
- 🔍 TypeScript 类型检查
- 📝 ESLint + Prettier 代码规范
- 📦 组件按需加载
- 🚀 自动化部署

## 插件系统

项目使用插件系统来实现功能的模块化和可扩展性。

### 内置插件

- 🔍 日志插件：统一的日志记录和格式化
- 🔐 认证插件：用户认证和权限控制
- 🎨 主题插件：主题切换和样式管理
- 💾 存储插件：数据持久化（支持 localStorage、sessionStorage、IndexedDB）

### 使用示例

```typescript
// 创建插件系统
const system = new PluginSystem()

// 注册插件
await system.register(new LoggerPlugin())
await system.register(new AuthPlugin())
await system.register(new ThemePlugin())
await system.register(new StoragePlugin())

// 使用插件功能
// 1. 日志记录
await system.executeHook('beforeLog', 'Hello, World!')

// 2. 用户认证
await system.executeHook('checkPermission', 'admin')

// 3. 主题切换
await system.executeHook('beforeThemeChange', theme)

// 4. 数据存储
await system.executeHook('setItem', 'key', value, {
  type: 'local',
  expireIn: 24 * 60 * 60 * 1000 // 1天过期
})
```

### 开发新插件

1. 实现 `IPlugin` 接口
```typescript
class MyPlugin implements IPlugin {
  name = 'myPlugin'
  version = '1.0.0'
  
  async install(context: PluginContext) {
    // 注册钩子
    context.registerHook('myHook', this.myHook.bind(this))
    // 监听事件
    context.events.on('myEvent', this.onMyEvent.bind(this))
  }
}
```

2. 注册插件
```typescript
await system.register(new MyPlugin())
```

3. 使用插件
```typescript
await system.executeHook('myHook', ...args)
system.emit('myEvent', ...args)
``` 