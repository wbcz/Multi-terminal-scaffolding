import { EventEmitter } from 'events'

export interface IPlugin {
  name: string
  version: string
  install: (context: PluginContext) => void | Promise<void>
}

export interface PluginContext {
  events: EventEmitter
  hooks: Record<string, Function[]>
  registerHook: (name: string, fn: Function) => void
  getPlugins: () => IPlugin[]
  getPlugin: (name: string) => IPlugin | undefined
}

export class PluginSystem {
  private plugins: IPlugin[] = []
  private events: EventEmitter
  private hooks: Record<string, Function[]> = {}

  constructor() {
    this.events = new EventEmitter()
  }

  // 注册插件
  async register(plugin: IPlugin) {
    if (this.getPlugin(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`)
    }

    const context: PluginContext = {
      events: this.events,
      hooks: this.hooks,
      registerHook: this.registerHook.bind(this),
      getPlugins: () => [...this.plugins],
      getPlugin: this.getPlugin.bind(this)
    }

    await plugin.install(context)
    this.plugins.push(plugin)
  }

  // 注册钩子
  private registerHook(name: string, fn: Function) {
    if (!this.hooks[name]) {
      this.hooks[name] = []
    }
    this.hooks[name].push(fn)
  }

  // 执行钩子
  async executeHook(name: string, ...args: any[]) {
    const hooks = this.hooks[name] || []
    const results = []
    
    for (const hook of hooks) {
      try {
        const result = await hook(...args)
        results.push(result)
      } catch (error) {
        console.error(`Error executing hook ${name}:`, error)
      }
    }
    
    return results
  }

  // 获取插件
  getPlugin(name: string) {
    return this.plugins.find(p => p.name === name)
  }

  // 获取所有插件
  getPlugins() {
    return [...this.plugins]
  }

  // 发送事件
  emit(event: string, ...args: any[]) {
    this.events.emit(event, ...args)
  }

  // 监听事件
  on(event: string, listener: (...args: any[]) => void) {
    this.events.on(event, listener)
  }
} 