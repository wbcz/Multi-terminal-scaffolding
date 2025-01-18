export * from './types'
export * from './manager'
export * from './middlewares/logger'
export * from './middlewares/auth'
export * from './middlewares/error'

// 导出一个创建中间件管理器的工厂函数
import { DefaultMiddlewareManager } from './manager'
import { LoggerMiddleware } from './middlewares/logger'
import { ErrorMiddleware } from './middlewares/error'

export function createMiddlewareManager(debug = false) {
  const manager = new DefaultMiddlewareManager()
  
  // 添加基础中间件
  manager.use(new LoggerMiddleware())
  manager.use(new ErrorMiddleware({ debug }))
  
  return manager
} 