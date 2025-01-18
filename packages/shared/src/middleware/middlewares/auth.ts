import { Context, Middleware, Next } from '../types'
import { AuthPlugin } from '../../plugin/plugins/auth'

export interface AuthMiddlewareOptions {
  authPlugin: AuthPlugin
  excludePaths?: string[]
  requireRoles?: Record<string, string[]>
}

export class AuthMiddleware implements Middleware {
  name = 'auth'
  order = -1000 // 在日志之后，其他中间件之前执行

  constructor(private options: AuthMiddlewareOptions) {}

  async before(ctx: Context, next: Next): Promise<void> {
    const { url } = ctx.request
    
    // 检查是否在排除路径中
    if (this.options.excludePaths?.some(path => url.startsWith(path))) {
      await next()
      return
    }

    // 检查认证状态
    const isAuthenticated = await this.options.authPlugin.isAuthenticated()
    if (!isAuthenticated) {
      ctx.response.status = 401
      ctx.response.body = { error: 'Unauthorized' }
      return
    }

    // 检查角色权限
    const requiredRoles = this.getRequiredRoles(url)
    if (requiredRoles.length > 0) {
      const hasRole = await Promise.all(
        requiredRoles.map(role => this.options.authPlugin.hasRole(role))
      )
      
      if (!hasRole.every(Boolean)) {
        ctx.response.status = 403
        ctx.response.body = { error: 'Forbidden' }
        return
      }
    }

    await next()
  }

  private getRequiredRoles(url: string): string[] {
    if (!this.options.requireRoles) {
      return []
    }

    // 查找匹配的路径规则
    const matchedPath = Object.keys(this.options.requireRoles)
      .find(path => url.startsWith(path))

    return matchedPath ? this.options.requireRoles[matchedPath] : []
  }
} 