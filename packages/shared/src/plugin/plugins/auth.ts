import { IPlugin, PluginContext } from '../core'
import { StoragePlugin } from './storage'

interface User {
  id: string
  name: string
  roles: string[]
}

const AUTH_STORAGE_KEY = 'auth:currentUser'
const SESSION_EXPIRY_TIME = 24 * 60 * 60 * 1000 // 24小时

export class AuthPlugin implements IPlugin {
  name = 'auth'
  version = '1.0.0'
  private currentUser: User | null = null
  private initialized = false
  private context: PluginContext | null = null

  async install(context: PluginContext) {
    this.context = context
    
    // 检查存储插件是否已注册
    const storagePlugin = context.getPlugin('storage')
    if (!storagePlugin || !(storagePlugin instanceof StoragePlugin)) {
      throw new Error('Storage plugin is required but not found')
    }

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
      if (!this.context) {
        throw new Error('Plugin context not initialized')
      }

      // 从存储插件恢复用户会话
      const getItemHooks = this.context.hooks['getItem'] || []
      if (getItemHooks.length > 0) {
        const savedUser = await getItemHooks[0](AUTH_STORAGE_KEY)
        if (savedUser && typeof savedUser === 'object') {
          this.currentUser = savedUser as User
        }
      }

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
    if (!this.context) {
      throw new Error('Plugin context not initialized')
    }

    this.currentUser = user
    // 使用存储插件持久化用户信息，设置过期时间
    const setItemHooks = this.context.hooks['setItem'] || []
    if (setItemHooks.length > 0) {
      await setItemHooks[0](AUTH_STORAGE_KEY, user, {
        expireIn: SESSION_EXPIRY_TIME
      })
    }
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

  private async onLogin(user: User) {
    if (!this.context) {
      throw new Error('Plugin context not initialized')
    }

    this.currentUser = user
    // 使用存储插件持久化用户信息，设置过期时间
    const setItemHooks = this.context.hooks['setItem'] || []
    if (setItemHooks.length > 0) {
      await setItemHooks[0](AUTH_STORAGE_KEY, user, {
        expireIn: SESSION_EXPIRY_TIME
      })
    }
    console.log('User logged in:', user.name)
  }

  private async onLogout() {
    if (!this.context) {
      throw new Error('Plugin context not initialized')
    }

    this.currentUser = null
    // 使用存储插件清除用户信息
    const removeItemHooks = this.context.hooks['removeItem'] || []
    if (removeItemHooks.length > 0) {
      await removeItemHooks[0](AUTH_STORAGE_KEY)
    }
    console.log('User logged out')
  }

  // 公共方法
  async getCurrentUser(): Promise<User | null> {
    if (!this.initialized) {
      await this.initialize()
    }
    return this.currentUser
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null && user.roles.includes(role)
  }
}