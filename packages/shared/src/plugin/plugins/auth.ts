import { IPlugin, PluginContext } from '../core'

interface User {
  id: string
  name: string
  roles: string[]
}

export class AuthPlugin implements IPlugin {
  name = 'auth'
  version = '1.0.0'
  private currentUser: User | null = null
  private initialized = false

  async install(context: PluginContext) {
    // 初始化异步操作
    await this.initialize()

    // 注册认证相关钩子
    context.registerHook('beforeAuth', this.beforeAuth.bind(this))
    context.registerHook('afterAuth', this.afterAuth.bind(this))
    context.registerHook('checkPermission', this.checkPermission.bind(this))

    // 监听登录和登出事件
    context.events.on('login', this.onLogin.bind(this))
    context.events.on('logout', this.onLogout.bind(this))
  }

  private async initialize() {
    if (this.initialized) {
      return
    }

    try {
      // 从本地存储或 API 恢复用户会话
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }

      // 可以添加其他异步初始化逻辑
      // 例如:
      // - 验证 token 有效性
      // - 获取用户权限列表
      // - 同步远程配置

      this.initialized = true
    } catch (error) {
      console.error('Auth plugin initialization failed:', error)
      throw error
    }
  }

  private async beforeAuth(credentials: { username: string; password: string }) {
    if (!this.initialized) {
      throw new Error('Auth plugin not initialized')
    }
    console.log('Validating credentials...')
    return credentials
  }

  private async afterAuth(user: User) {
    this.currentUser = user
    // 持久化用户信息
    localStorage.setItem('currentUser', JSON.stringify(user))
    console.log('User authenticated:', user.name)
  }

  private async checkPermission(requiredRole: string) {
    if (!this.initialized) {
      throw new Error('Auth plugin not initialized')
    }
    if (!this.currentUser) {
      throw new Error('No user authenticated')
    }
    return this.currentUser.roles.includes(requiredRole)
  }

  private onLogin(user: User) {
    this.currentUser = user
    localStorage.setItem('currentUser', JSON.stringify(user))
    console.log('User logged in:', user.name)
  }

  private onLogout() {
    this.currentUser = null
    localStorage.removeItem('currentUser')
    console.log('User logged out')
  }
}