import { Context, Middleware, Next } from '../types'

export class LoggerMiddleware implements Middleware {
  name = 'logger'
  order = -9999 // 最先执行

  async before(ctx: Context, next: Next): Promise<void> {
    const startTime = Date.now()
    console.log(`[${ctx.request.method}] ${ctx.request.url} - Request:`, {
      params: ctx.request.params,
      query: ctx.request.query,
      body: ctx.request.body
    })

    await next()

    const duration = Date.now() - startTime
    console.log(`[${ctx.request.method}] ${ctx.request.url} - Response:`, {
      status: ctx.response.status,
      duration: `${duration}ms`,
      body: ctx.response.body
    })
  }

  async error(ctx: Context, error: Error): Promise<void> {
    console.error(`[${ctx.request.method}] ${ctx.request.url} - Error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  }
} 