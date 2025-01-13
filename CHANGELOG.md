# Changelog

All notable changes to this project will be documented in this file.

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