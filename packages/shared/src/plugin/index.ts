export * from './core'
export * from './plugins/logger'
export * from './plugins/auth'
export * from './plugins/theme'

// 使用示例
import { PluginSystem, IPlugin } from './core'
import { LoggerPlugin } from './plugins/logger'
import { AuthPlugin } from './plugins/auth'
import { ThemePlugin } from './plugins/theme'

// 创建示例函数
export async function createExamplePluginSystem() {
  // 创建插件系统实例
  const system = new PluginSystem()

  // 注册插件
  await system.register(new LoggerPlugin())
  await system.register(new AuthPlugin())
  await system.register(new ThemePlugin())

  // 使用示例
  // 1. 使用日志插件
  const messages = await system.executeHook('beforeLog', 'Hello, World!')
  console.log('Formatted messages:', messages)

  // 2. 使用认证插件
  const user = {
    id: '1',
    name: 'John Doe',
    roles: ['admin']
  }
  system.emit('login', user)
  const hasPermission = await system.executeHook('checkPermission', 'admin')
  console.log('Has admin permission:', hasPermission)

  // 3. 使用主题插件
  const theme = {
    name: 'custom',
    colors: {
      primary: '#f5222d',
      secondary: '#faad14',
      background: '#f0f2f5',
      text: '#333333'
    }
  }
  await system.executeHook('beforeThemeChange', theme)
  system.emit('themeChanged', theme)

  return system
} 