export interface Context {
  request: {
    url: string
    method: string
    headers: Record<string, string>
    params: Record<string, string>
    query: Record<string, string>
    body: any
  }
  response: {
    status: number
    headers: Record<string, string>
    body: any
  }
  state: Record<string, any>
  error?: Error
}

export type Next = () => Promise<void>

export interface Middleware {
  name: string
  order?: number
  before?: (ctx: Context, next: Next) => Promise<void>
  after?: (ctx: Context) => Promise<void>
  error?: (ctx: Context, error: Error) => Promise<void>
}

export interface MiddlewareManager {
  use(middleware: Middleware): void
  execute(ctx: Context): Promise<void>
} 