# Axios 请求流程详解

## 核心类结构

```typescript
class Axios {
  // 拦截器管理
  interceptors = {
    request: new InterceptorManager<AxiosRequestConfig>(),
    response: new InterceptorManager<AxiosResponse>()
  };

  // 请求方法
  request(config: AxiosRequestConfig): Promise<any> {
    // 实现见下文
  }
}
```

## 请求处理流程

1. **初始化请求链**
```typescript
const chain = [
  {
    fulfilled: (config) => dispatchRequest(config),
    rejected: undefined
  }
];
```

2. **添加拦截器**
```typescript
// 请求拦截器（后进先出 LIFO）
this.interceptors.request.forEach(interceptor => {
  chain.unshift(interceptor);
});

// 响应拦截器（先进先出 FIFO）
this.interceptors.response.forEach(interceptor => {
  chain.push(interceptor);
});
```

3. **执行 Promise 链**
```typescript
let promise = Promise.resolve(config);

while (chain.length) {
  const { fulfilled, rejected } = chain.shift();
  promise = promise.then(fulfilled, rejected);
}
```

## 请求流程示意图

```
┌─────────────────────────────────────────────────────────────────┐
│                        Request Flow                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Request Interceptors → Dispatch Request → Response Interceptors │
│  (LIFO)                                    (FIFO)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 拦截器执行顺序

假设有以下拦截器：
```typescript
// 请求拦截器
axios.interceptors.request.use(config => {
  // Request Interceptor 1
});
axios.interceptors.request.use(config => {
  // Request Interceptor 2
});

// 响应拦截器
axios.interceptors.response.use(response => {
  // Response Interceptor 1
});
axios.interceptors.response.use(response => {
  // Response Interceptor 2
});
```

执行顺序将是：
```
Request Interceptor 2
↓
Request Interceptor 1
↓
Dispatch Request
↓
Response Interceptor 1
↓
Response Interceptor 2
```

## 实际应用示例

```typescript
// 创建 axios 实例
const http = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 添加请求拦截器
http.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  response => {
    // 处理响应数据
    return response.data;
  },
  error => {
    // 处理错误
    if (error.response?.status === 401) {
      // 处理未授权
    }
    return Promise.reject(error);
  }
);
```

## 注意事项

1. **拦截器执行顺序**
   - 请求拦截器：后添加的先执行（LIFO）
   - 响应拦截器：先添加的先执行（FIFO）

2. **错误处理**
   - 任何拦截器都可以抛出错误
   - 错误会被传递到下一个错误处理器

3. **Promise 链**
   - 整个过程是一个 Promise 链
   - 可以在任何环节中断或修改请求/响应

4. **配置合并**
   - 实例配置
   - 请求配置
   - 默认配置

## 最佳实践

1. **请求拦截器**
   - 添加认证信息
   - 请求参数处理
   - 请求日志记录

2. **响应拦截器**
   - 响应数据转换
   - 错误统一处理
   - 刷新 token

3. **错误处理**
   - 网络错误
   - 业务错误
   - 认证错误 