# InterceptorManager 实现原理

## 核心实现

```typescript
/**
 * 拦截器处理器接口
 */
interface Interceptor<T> {
  fulfilled: (value: T) => T | Promise<T>;
  rejected?: (error: any) => any;
}

/**
 * 拦截器管理器类
 */
class InterceptorManager<T> {
  // 存储拦截器的数组
  private handlers: (Interceptor<T> | null)[] = [];

  /**
   * 添加拦截器
   * @param fulfilled 成功处理函数
   * @param rejected 错误处理函数
   * @returns 拦截器ID，用于移除
   */
  use(fulfilled: (value: T) => T | Promise<T>, rejected?: (error: any) => any): number {
    this.handlers.push({
      fulfilled,
      rejected
    });
    return this.handlers.length - 1;
  }

  /**
   * 移除拦截器
   * @param id 拦截器ID
   */
  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * 遍历所有拦截器
   * @param fn 遍历函数
   */
  forEach(fn: (h: Interceptor<T>) => void): void {
    this.handlers.forEach(h => {
      if (h !== null) {
        fn(h);
      }
    });
  }

  /**
   * 清空所有拦截器
   */
  clear(): void {
    this.handlers = [];
  }
}
```

## 工作原理

1. **数据结构**
```typescript
private handlers: (Interceptor<T> | null)[] = [];
```
- 使用数组存储拦截器
- 每个拦截器包含成功和失败处理函数
- 支持通过索引快速访问和移除

2. **添加拦截器**
```typescript
use(fulfilled: (value: T) => T | Promise<T>, rejected?: (error: any) => any): number {
  this.handlers.push({
    fulfilled,
    rejected
  });
  return this.handlers.length - 1;
}
```
- 将拦截器添加到数组末尾
- 返回数组索引作为拦截器ID
- 支持异步处理函数

3. **移除拦截器**
```typescript
eject(id: number): void {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
}
```
- 通过ID快速定位拦截器
- 将指定位置设为 null 而不是删除
- 保持其他拦截器的索引不变

4. **遍历拦截器**
```typescript
forEach(fn: (h: Interceptor<T>) => void): void {
  this.handlers.forEach(h => {
    if (h !== null) {
      fn(h);
    }
  });
}
```
- 遍历所有非空拦截器
- 跳过已被移除的拦截器
- 执行传入的回调函数

## 使用示例

```typescript
// 创建拦截器管理器
const manager = new InterceptorManager<AxiosRequestConfig>();

// 添加请求拦截器
const requestInterceptorId = manager.use(
  config => {
    // 处理请求配置
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 添加另一个拦截器
const loggingInterceptorId = manager.use(
  config => {
    console.log('Request:', config);
    return config;
  }
);

// 移除特定拦截器
manager.eject(loggingInterceptorId);

// 遍历所有拦截器
manager.forEach(interceptor => {
  // 处理每个拦截器
  const result = interceptor.fulfilled(config);
});
```

## 实际应用场景

1. **请求拦截器**
```typescript
// 认证拦截器
manager.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 请求参数处理
manager.use(config => {
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }
  return config;
});
```

2. **响应拦截器**
```typescript
// 响应数据转换
manager.use(
  response => response.data,
  error => Promise.reject(error.response?.data)
);

// 错误处理
manager.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 处理认证错误
    }
    return Promise.reject(error);
  }
);
```

## 注意事项

1. **拦截器顺序**
- 请求拦截器：后添加的先执行
- 响应拦截器：先添加的先执行

2. **错误处理**
- 每个拦截器都应该处理可能的错误
- 错误会沿着拦截器链传播

3. **性能考虑**
- 移除拦截器时使用 null 标记而不是删除元素
- 遍历时跳过已移除的拦截器

4. **类型安全**
- 使用泛型确保类型安全
- 支持不同类型的请求和响应处理 