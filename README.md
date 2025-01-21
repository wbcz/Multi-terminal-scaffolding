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
├── apps
│   └── web                 # Web 应用
│       └── src
│           └── modoules        # 微应用
│               ├── admin   # 管理后台
│               ├── merchant # 商户端
│               └── platform # 平台端
├── packages
│   ├── jsbridge           # JSBridge SDK
│   ├── api                # API 接口
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
- 🌉 Web 和 Native 双向通信

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


## 组件开发指南

### 传统组件 vs Headless 组件

#### 1. 耦合度
- **传统组件**：
  - 样式和逻辑紧密耦合
  - UI 和行为在同一个组件中
  - 修改成本较高

- **Headless 组件**：
  - 逻辑与 UI 完全分离
  - 使用 hooks 提供行为
  - 样式完全由使用者控制

#### 2. 可定制性
- **传统组件**：
  - 样式固定，仅支持有限的 props 配置
  - 修改样式需要覆盖默认样式或使用主题
  - 组件结构固定，难以扩展

- **Headless 组件**：
  - 完全的样式自由度
  - 可以自定义任何 HTML 结构
  - 可以添加任何额外的功能

#### 3. 关注点分离
- **传统组件**：
  - 行为、状态和 UI 都在一个文件中
  - 难以复用部分功能
  - 测试需要考虑 UI 和逻辑

- **Headless 组件**：
  - 逻辑和 UI 分离
  - 便于逻辑复用
  - 更容易进行单元测试

#### 4. 可访问性
- **传统组件**：
  - 可访问性实现固定
  - 难以根据特定需求调整

- **Headless 组件**：
  - 通过 props getter 提供完整的可访问性支持
  - 可以根据需求自定义可访问性实现

#### 5. 使用场景
- **传统组件适合**：
  - 快速开发
  - 统一的 UI 风格
  - 简单的交互需求

- **Headless 组件适合**：
  - 需要高度自定义的场景
  - 复杂的交互需求
  - 多个不同风格的 UI 主题
  - 需要复用逻辑但 UI 差异大的场景

#### 6. 维护成本
- **传统组件**：
  - 修改影响所有使用处
  - 样式修改可能产生冲突
  - 功能扩展可能破坏现有功能

- **Headless 组件**：
  - 逻辑变更和 UI 变更可以独立进行
  - 每个使用处可以独立维护 UI
  - 更容易进行单元测试

### 选择建议

1. 选择传统组件当：
   - 需要快速开发
   - 需要统一的 UI 风格
   - 交互需求简单
   - 不需要高度自定义

2. 选择 Headless 组件当：
   - 需要高度自定义
   - 有复杂的交互需求
   - 需要支持多种 UI 主题
   - 需要良好的可测试性
   - 需要复用逻辑但 UI 差异大

### 示例
可以参考 `packages/ui/src/components/select` 目录下的示例：
- `TraditionalSelect.tsx`: 传统组件实现
- `HeadlessSelect.tsx`: Headless 组件实现
- `example.tsx`: 两种实现的对比示例 