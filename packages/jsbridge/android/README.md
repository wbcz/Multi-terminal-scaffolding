# Eleme JSBridge for Android

这是饿了么 JSBridge 的 Android 端实现，用于实现 Web 端和 Android 原生端的双向通信。

## 特性

- 支持 Web 调用 Native 方法
- 支持 Native 调用 Web 方法
- 支持同步和异步调用
- 支持超时处理
- 支持调试模式

## 安装

1. 将 JSBridge 模块添加到你的 Android 项目中：

```gradle
dependencies {
    implementation project(':jsbridge')
}
```

## 使用方法

### 1. 初始化 JSBridge

```kotlin
val webView = findViewById<WebView>(R.id.webView)
val bridge = ElemeJSBridge(webView)
```

### 2. 注册 Native 处理器

```kotlin
// 注册一个简单的处理器
bridge.register("getDeviceInfo") { params ->
    val deviceInfo = JSONObject().apply {
        put("platform", "android")
        put("version", android.os.Build.VERSION.RELEASE)
        put("model", android.os.Build.MODEL)
    }
    { BridgeResponse(200, "Success", deviceInfo) }
}

// 注册一个异步处理器
bridge.register("getLocation") { params ->
    // 异步获取位置
    Thread {
        val location = JSONObject().apply {
            put("latitude", 31.230416)
            put("longitude", 121.473701)
        }
        { BridgeResponse(200, "Success", location) }
    }.start()
    { BridgeResponse(200, "Getting location...") }
}
```

### 3. 调用 JS 方法

```kotlin
val params = JSONObject().apply {
    put("message", "Hello from Android!")
}

bridge.call("jsMethod", params) { response ->
    println("JS response: ${response.message}")
}
```

### 4. Web 端调用 Native 方法

```javascript
// 异步调用
window.ElemeJSBridge.call('getDeviceInfo').then(response => {
    console.log('Device info:', response.data);
});

// 带参数的调用
window.ElemeJSBridge.call('share', {
    title: '分享标题',
    content: '分享内容',
    url: 'https://ele.me'
}).then(response => {
    console.log('Share result:', response.message);
});
```

## 响应格式

所有的响应都遵循以下格式：

```typescript
interface BridgeResponse {
    code: number;      // 状态码
    message: string;   // 响应消息
    data?: any;        // 响应数据（可选）
}
```

常见状态码：
- 200: 成功
- 400: 参数错误
- 404: 处理器未找到
- 408: 请求超时
- 500: 内部错误

## 调试模式

开启调试模式可以查看详细的日志信息：

```kotlin
bridge.setDebug(true)
```

## 注意事项

1. 确保在主线程中调用 WebView 相关的方法
2. 处理好异步操作的生命周期
3. 注意内存泄漏问题，在适当的时机注销处理器
4. 处理好异常情况，避免崩溃

## 示例代码

完整的示例代码可以参考 `JSBridgeExample.kt`。 