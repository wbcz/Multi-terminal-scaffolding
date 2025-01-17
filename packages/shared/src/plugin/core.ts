import { EventEmitter } from 'events'

// 定义钩子函数的类型
type HookFunction<T = any> = (...args: any[]) => Promise<T> | T

export interface IPlugin {
  name: string
  version: string
  install: (context: PluginContext) => void | Promise<void>
}

export interface PluginContext {
  events: EventEmitter
  hooks: Record<string, HookFunction[]>
  registerHook: (name: string, fn: HookFunction) => void
  getPlugins: () => IPlugin[]
  getPlugin: (name: string) => IPlugin | undefined
}

export class PluginSystem {
  private plugins: IPlugin[] = []
  private events: EventEmitter
  private hooks: Record<string, HookFunction[]> = {}

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
  private registerHook(name: string, fn: HookFunction): void {
    if (!this.hooks[name]) {
      this.hooks[name] = []
    }
    this.hooks[name].push(fn)
  }

  // 串行执行钩子（按顺序等待每个钩子完成）
  async executeHookSerial(name: string, ...args: any[]) {
    const hooks = this.hooks[name] || []
    const results = []
    
    for (const hook of hooks) {
      try {
        const result = await hook(...args)
        results.push(result)
      } catch (error: unknown) {
        console.error(`Error executing hook ${name}:`, error)
      }
    }
    
    return results
  }

  // 并行执行钩子（所有钩子同时执行）
  async executeHookParallel(name: string, ...args: any[]) {
    const hooks = this.hooks[name] || []
    
    try {
      const results = await Promise.all(
        hooks.map(hook => hook(...args).catch((error: unknown) => {
          console.error(`Error executing hook ${name}:`, error)
          return null
        }))
      )
      return results.filter(result => result !== null)
    } catch (error: unknown) {
      console.error(`Error executing hooks ${name}:`, error)
      return []
    }
  }

  // 默认的执行方法（可以选择使用串行或并行）
  async executeHook(name: string, ...args: any[]) {
    return this.executeHookSerial(name, ...args)
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