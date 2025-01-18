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

```
├── apps
│   └── web                 # Web 应用
│       └── src
│           └── modoules        # 微应用
│               ├── admin   # 管理后台
│               ├── merchant # 商户端
│               └── platform # 平台端
├── packages
│   ├── api                 # API 接口
│   ├── hooks              # 通用 Hooks
│   ├── shared             # 基础设施
│   │   └── plugin         # 插件系统
│   │   └── middleware     # 中间件
│   ├── types              # 类型定义
│   ├── ui                 # UI 组件库
│   └── utils              # 工具函数
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev:admin      # 管理后台
pnpm dev:merchant   # 商户端
pnpm dev:platform   # 平台端

# 构建
pnpm build:admin    # 管理后台
pnpm build:merchant # 商户端
pnpm build:platform # 平台端

# 预览
pnpm serve:admin    # 管理后台
pnpm serve:merchant # 商户端
pnpm serve:platform # 平台端

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
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