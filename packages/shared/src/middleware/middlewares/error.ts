import { Context, Middleware } from '../types'

export interface ErrorMiddlewareOptions {
  debug?: boolean
  errorMap?: Record<string, number>
}

export class ErrorMiddleware implements Middleware {
  name = 'error'
  order = -9998 // 在日志之后执行

  constructor(private options: ErrorMiddlewareOptions = {}) {}

  async error(ctx: Context, error: Error): Promise<void> {
    // 设置错误状态码
    ctx.response.status = this.getErrorStatus(error)

    // 构建错误响应
    const errorResponse: Record<string, any> = {
      error: error.name,
      message: error.message
    }

    // 在调试模式下添加堆栈信息
    if (this.options.debug) {
      errorResponse.stack = error.stack
    }

    ctx.response.body = errorResponse
  }

  private getErrorStatus(error: Error): number {
    if (this.options.errorMap) {
      const status = this.options.errorMap[error.name]
      if (status) {
        return status
      }
    }

    // 默认错误状态码映射
    switch (error.name) {
      case 'ValidationError':
        return 400
      case 'UnauthorizedError':
        return 401
      case 'ForbiddenError':
        return 403
      case 'NotFoundError':
        return 404
      case 'ConflictError':
        return 409
      default:
        return 500
    }
  }
} 