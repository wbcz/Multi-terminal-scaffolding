import { Context, Middleware, MiddlewareManager } from './types'

export class DefaultMiddlewareManager implements MiddlewareManager {
  private middlewares: Middleware[] = []

  use(middleware: Middleware): void {
    this.middlewares.push(middleware)
    // 根据 order 排序，order 越小越先执行
    this.middlewares.sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  async execute(ctx: Context): Promise<void> {
    const middlewares = [...this.middlewares]

    // 创建中间件调用链
    const createNext = (index: number): (() => Promise<void>) => {
      return async () => {
        if (index >= middlewares.length) {
          return
        }

        const middleware = middlewares[index]
        const next = createNext(index + 1)

        try {
          // 执行 before 钩子
          if (middleware.before) {
            await middleware.before(ctx, next)
          } else {
            await next()
          }

          // 执行 after 钩子
          if (middleware.after) {
            await middleware.after(ctx)
          }
        } catch (error) {
          ctx.error = error as Error
          // 执行错误处理
          if (middleware.error) {
            await middleware.error(ctx, error as Error)
          } else {
            throw error
          }
        }
      }
    }

    // 开始执行中间件链
    await createNext(0)()
  }
} 