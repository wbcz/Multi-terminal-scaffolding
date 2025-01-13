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
├── packages
│   ├── api                 # API 接口
│   ├── hooks              # 通用 Hooks
│   ├── shared             # 共享组件
│   ├── types              # 类型定义
│   ├── ui                 # UI 组件库
│   └── utils              # 工具函数
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview

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