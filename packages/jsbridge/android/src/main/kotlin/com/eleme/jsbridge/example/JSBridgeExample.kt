package com.eleme.jsbridge.example

import android.webkit.WebView
import com.eleme.jsbridge.ElemeJSBridge
import org.json.JSONObject

class JSBridgeExample(webView: WebView) {
    private val bridge = ElemeJSBridge(webView).apply {
        // 开启调试模式
        setDebug(true)
        
        // 注册获取设备信息的处理器
        register("getDeviceInfo") { _ ->
            val deviceInfo = JSONObject().apply {
                put("platform", "android")
                put("version", android.os.Build.VERSION.RELEASE)
                put("model", android.os.Build.MODEL)
            }
            { BridgeResponse(200, "Success", deviceInfo) }
        }

        // 注册获取位置信息的处理器
        register("getLocation") { _ ->
            // 模拟异步获取位置
            Thread {
                val location = JSONObject().apply {
                    put("latitude", 31.230416)
                    put("longitude", 121.473701)
                }
                { BridgeResponse(200, "Success", location) }
            }.start()
            { BridgeResponse(200, "Getting location...") }
        }

        // 注册分享处理器
        register("share") { params ->
            params?.let {
                val title = it.optString("title")
                val content = it.optString("content")
                val url = it.optString("url")
                
                // 实现分享逻辑
                println("Sharing: $title - $content - $url")
                { BridgeResponse(200, "Shared successfully") }
            } ?: { BridgeResponse(400, "Invalid parameters") }
        }
    }

    // 调用 JS 方法示例
    fun callJavaScript() {
        val params = JSONObject().apply {
            put("message", "Hello from Android!")
        }
        
        bridge.call("jsMethod", params) { response ->
            println("JS response: ${response.message}")
        }
    }
} 