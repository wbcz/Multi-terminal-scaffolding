/**
 * 多实例代理沙箱
 * 实现应用之间的隔离
 */
export class MultipleProxySandbox {
  private name: string;
  private proxy: Window | null;
  private sandboxRunning: boolean;
  private fakeWindow: Record<string, any>;
  private context: Record<string, any>;

  /**
   * 激活沙箱
   */
  active() {
    this.sandboxRunning = true;
  }

  /**
   * 失活沙箱
   */
  inactive() {
    this.sandboxRunning = false;
  }

  /**
   * 构造函数
   * @param name 沙箱名称
   * @param context 共享的上下文对象
   */
  constructor(name: string, context: Record<string, any> = {}) {
    this.name = name;
    this.proxy = null;
    this.sandboxRunning = false;
    this.context = context;
    this.fakeWindow = Object.create(null);

    const proxy = new Proxy(this.fakeWindow, {
      set: (target, prop: string, value) => {
        if (this.sandboxRunning) {
          // 如果是共享对象，则更新共享对象
          if (Object.keys(this.context).includes(prop)) {
            this.context[prop] = value;
          }
          // 更新自身属性
          target[prop] = value;
        }
        return true;
      },

      get: (target, prop: string) => {
        // 优先从共享对象中获取
        if (Object.keys(this.context).includes(prop)) {
          return this.context[prop];
        }
        // 否则从自身属性中获取
        return target[prop];
      },

      has: (target, prop) => {
        // 检查属性是否存在于共享对象或自身
        return Object.keys(this.context).includes(prop as string) || Object.prototype.hasOwnProperty.call(target, prop);
      }
    }) as unknown as Window;

    this.proxy = proxy;
  }

  /**
   * 获取代理对象
   */
  getProxy(): Window {
    return this.proxy as Window;
  }

  /**
   * 获取沙箱名称
   */
  getName(): string {
    return this.name;
  }

  /**
   * 判断沙箱是否运行中
   */
  isRunning(): boolean {
    return this.sandboxRunning;
  }

  /**
   * 更新共享上下文
   * @param context 新的共享上下文
   */
  updateContext(context: Record<string, any>) {
    this.context = { ...this.context, ...context };
  }

  /**
   * 清理沙箱
   */
  clear() {
    this.inactive();
    this.fakeWindow = Object.create(null);
  }
} 