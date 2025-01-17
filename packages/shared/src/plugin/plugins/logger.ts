import { IPlugin, PluginContext } from '../core'

export class LoggerPlugin implements IPlugin {
  name = 'logger'
  version = '1.0.0'

  async install(context: PluginContext) {
    // 注册日志钩子
    context.registerHook('beforeLog', this.beforeLog.bind(this))
    context.registerHook('afterLog', this.afterLog.bind(this))

    // 监听其他插件的事件
    context.events.on('error', this.onError.bind(this))
  }

  private beforeLog(message: string) {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] ${message}`
  }

  private afterLog(message: string) {
    console.log('Log saved:', message)
  }

  private onError(error: Error) {
    console.error('Error caught by logger:', error)
  }
} 