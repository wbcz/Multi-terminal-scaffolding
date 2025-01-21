import { 
  createMiddlewareManager, 
  LoggerMiddleware,
  AuthMiddleware,
  ErrorMiddleware,
  type Middleware,
  type Context,
  PluginSystem,
  AuthPlugin, 
  StoragePlugin,
  LoggerPlugin,
  type IPlugin 
} from '@wbcz/shared'

export class AdminApplication {
  private middlewareManager = createMiddlewareManager(process.env.NODE_ENV === 'development')
  private pluginSystem = new PluginSystem()

  // 注册中间件
  use(middleware: Middleware) {
    this.middlewareManager.use(middleware)
    return this
  }

  // 注册插件
  async registerPlugin(plugin: IPlugin) {
    await this.pluginSystem.register(plugin)
    return this
  }

  // 处理请求
  async handleRequest(request: Request): Promise<Response> {
    const ctx: Context = {
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        params: {},
        query: this.parseQueryString(request.url),
        body: await this.parseRequestBody(request)
      },
      response: {
        status: 200,
        headers: {},
        body: null
      },
      state: {}
    }

    try {
      await this.middlewareManager.execute(ctx)
    } catch (error) {
      // 确保错误被正确处理
      ctx.error = error as Error
      await this.middlewareManager.execute(ctx)
    }

    return new Response(JSON.stringify(ctx.response.body), {
      status: ctx.response.status,
      headers: new Headers(ctx.response.headers)
    })
  }

  // 启动应用
  async bootstrap(): Promise<void> {
    console.log('core')
    // 注册核心插件
    await this.registerPlugin(new LoggerPlugin())
    await this.registerPlugin(new StoragePlugin())
    await this.registerPlugin(new AuthPlugin())
    console.log('core plugins registered')
    // 配置认证中间件
    const authPlugin = this.pluginSystem.getPlugin('auth') as AuthPlugin
    if (authPlugin) {
      this.use(new AuthMiddleware({
        authPlugin,
        excludePaths: ['/api/login', '/api/register'],
        requireRoles: {
          '/api/admin': ['admin'],
          '/api/manager': ['manager', 'admin']
        }
      }))
    }
    console.log('auth middleware configured')
    // 初始化完成
    console.log('Admin application bootstrapped')
    return Promise.resolve()
  }

  private parseQueryString(url: string): Record<string, string> {
    const query: Record<string, string> = {}
    const searchParams = new URL(url).searchParams
    for (const [key, value] of searchParams) {
      query[key] = value
    }
    return query
  }

  private async parseRequestBody(request: Request): Promise<any> {
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return request.json()
    }
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      const body: Record<string, string> = {}
      for (const [key, value] of formData) {
        body[key] = value.toString()
      }
      return body
    }
    return null
  }
} 