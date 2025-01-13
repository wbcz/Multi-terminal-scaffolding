# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.2 (2025-01-13)


### ♻️ Code Refactoring | 代码重构

* 优化 TypeScript 配置结构和继承关系 ([98c8fcb](https://github.com/your-username/your-repo/commit/98c8fcb23a0e07bc10b92dc9f56eb15b41ee83b2))


### 📝 Documentation | 文档

* 添加 Cursor 规则文件，描述项目目录结构 ([57a3ec6](https://github.com/your-username/your-repo/commit/57a3ec6ab3b808674e89ee307c12e41ddbe4c008))
* 添加项目说明文档 ([9589c57](https://github.com/your-username/your-repo/commit/9589c57b2dbb43fccdb79b312c4300baf9fea40c))


### 🐛 Bug Fixes | Bug 修复

* 修复 UI 包的 Button 组件类型定义 ([78b2c55](https://github.com/your-username/your-repo/commit/78b2c55cd6f607ba54f9c6964926e427176ffd92))
* 修改 UI 包入口文件为编译后的文件 ([c1d3d61](https://github.com/your-username/your-repo/commit/c1d3d6176b64179c7200455158aba020b5df6ba0))


### 🔨 Chore | 构建/工程依赖/工具

* 配置 UI 包的发布设置 ([c0fc6da](https://github.com/your-username/your-repo/commit/c0fc6daad470dfb1fb65f1cb0e4c6305e57b930b))
* 升级 UI 包版本到 0.0.2 ([24bc6c9](https://github.com/your-username/your-repo/commit/24bc6c99a8131ebd802c7be33493ad9b3841f6da))
* 升级 UI 包版本到 0.0.3 ([7aac24a](https://github.com/your-username/your-repo/commit/7aac24a55ee6e0eff4987ccd511713ebaf33b74c))
* 使用 pnpm add 将 React 相关依赖降级到 18.x 版本 ([fa732b1](https://github.com/your-username/your-repo/commit/fa732b1c3a8b5943e1311c7b644f375187791461))
* 使用 pnpm up 升级 UI 包依赖到最新版本 ([e969c40](https://github.com/your-username/your-repo/commit/e969c4068358780e2f87ea42bd3802e25914894a))
* 修改 UI 包名为 @wbcz/ui ([318c029](https://github.com/your-username/your-repo/commit/318c029ec310e7db11277da07a06ec7e94a13112))


### ✨ Features | 新功能

* 初始化项目 ([565778d](https://github.com/your-username/your-repo/commit/565778db64aff23bbaf245b8f5883c22af023c86))
* 初始化项目，添加 hooks 和 ui 包 ([bba64cb](https://github.com/your-username/your-repo/commit/bba64cb4a54ca3bb8e3ef229f2551c3bbb17f2c7))


### 📦‍ Build System | 打包构建

* 添加版本管理配置 ([287d1f1](https://github.com/your-username/your-repo/commit/287d1f1289519f20f0deec52cc84e92e9b313c84))
* 添加版本号 ([4830cbc](https://github.com/your-username/your-repo/commit/4830cbc315d46ee0cfc863a1524c6b84d29a3435))

## [0.0.4] - 2024-01-14

### Added
- 新增 `@wbcz/hooks` 包
  - 实现 `useRequest` Hook，支持异步请求状态管理
  - 支持加载状态、错误处理和数据缓存
  - 支持 TypeScript 类型定义
  - 支持本地开发模式

- 新增 `@wbcz/ui` 包
  - 实现基础 Button 组件
  - 支持本地开发模式
  - 支持 ESM 和 CommonJS 两种格式
  - 添加类型声明文件

### Changed
- 更新项目工程化配置
  - 使用 Vite 构建工具
  - 配置 TypeScript 编译选项
  - 优化开发体验

### Fixed
- 修复包依赖关系
- 修复构建配置问题 