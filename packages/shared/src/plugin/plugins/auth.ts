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

  async install(context: PluginContext) {
    // 注册认证相关钩子
    context.registerHook('beforeAuth', this.beforeAuth.bind(this))
    context.registerHook('afterAuth', this.afterAuth.bind(this))
    context.registerHook('checkPermission', this.checkPermission.bind(this))

    // 监听登录和登出事件
    context.events.on('login', this.onLogin.bind(this))
    context.events.on('logout', this.onLogout.bind(this))
  }

  private async beforeAuth(credentials: { username: string; password: string }) {
    console.log('Validating credentials...')
    return credentials
  }

  private async afterAuth(user: User) {
    this.currentUser = user
    console.log('User authenticated:', user.name)
  }

  private async checkPermission(requiredRole: string) {
    if (!this.currentUser) {
      throw new Error('No user authenticated')
    }
    return this.currentUser.roles.includes(requiredRole)
  }

  private onLogin(user: User) {
    this.currentUser = user
    console.log('User logged in:', user.name)
  }

  private onLogout() {
    this.currentUser = null
    console.log('User logged out')
  }
} 