package com.eleme.jsbridge

import android.webkit.WebView
import android.webkit.JavascriptInterface
import org.json.JSONObject
import java.util.concurrent.ConcurrentHashMap

class ElemeJSBridge(private val webView: WebView) {
    companion object {
        private const val BRIDGE_NAME = "ElemeJSBridge"
        private const val DEFAULT_TIMEOUT = 30000L
    }

    private val handlers = ConcurrentHashMap<String, BridgeHandler>()
    private val callbacks = ConcurrentHashMap<String, BridgeCallback>()
    private var debug = false

    init {
        webView.addJavascriptInterface(this, BRIDGE_NAME)
    }

    // 注册处理器
    fun register(method: String, handler: BridgeHandler) {
        handlers[method] = handler
    }

    // 注销处理器
    fun unregister(method: String) {
        handlers.remove(method)
    }

    // 调用 JS 方法
    fun call(method: String, params: JSONObject?, callback: BridgeCallback?) {
        val callbackId = if (callback != null) {
            val id = "cb_${System.currentTimeMillis()}"
            callbacks[id] = callback
            id
        } else null

        val jsParams = JSONObject().apply {
            put("method", method)
            if (params != null) put("params", params)
            if (callbackId != null) put("callbackId", callbackId)
        }

        val js = "javascript:window.$BRIDGE_NAME.handleNativeCall(${jsParams})"
        webView.post { webView.evaluateJavascript(js, null) }
    }

    // JS 调用 Native 的入口
    @JavascriptInterface
    fun call(paramsJson: String) {
        try {
            val params = JSONObject(paramsJson)
            val method = params.getString("method")
            val data = if (params.has("params")) params.getJSONObject("params") else null
            val callbackId = if (params.has("callbackId")) params.getString("callbackId") else null

            val handler = handlers[method]
            if (handler != null) {
                handler.invoke(data) { response ->
                    if (callbackId != null) {
                        sendCallback(callbackId, response)
                    }
                }
            } else {
                if (callbackId != null) {
                    sendCallback(callbackId, BridgeResponse(404, "Handler not found"))
                }
            }
        } catch (e: Exception) {
            log("Error handling JS call: ${e.message}")
        }
    }

    // 处理 JS 回调
    @JavascriptInterface
    fun handleCallback(callbackId: String, responseJson: String) {
        try {
            val callback = callbacks.remove(callbackId)
            if (callback != null) {
                val response = BridgeResponse.fromJson(responseJson)
                callback.invoke(response)
            }
        } catch (e: Exception) {
            log("Error handling callback: ${e.message}")
        }
    }

    private fun sendCallback(callbackId: String, response: BridgeResponse) {
        val js = "javascript:window.$BRIDGE_NAME.handleNativeCallback('$callbackId', ${response.toJson()})"
        webView.post { webView.evaluateJavascript(js, null) }
    }

    private fun log(message: String) {
        if (debug) {
            println("[$BRIDGE_NAME] $message")
        }
    }

    fun setDebug(enabled: Boolean) {
        debug = enabled
    }
}

// 数据类
data class BridgeResponse(
    val code: Int,
    val message: String,
    val data: JSONObject? = null
) {
    fun toJson(): String {
        return JSONObject().apply {
            put("code", code)
            put("message", message)
            data?.let { put("data", it) }
        }.toString()
    }

    companion object {
        fun fromJson(json: String): BridgeResponse {
            val obj = JSONObject(json)
            return BridgeResponse(
                code = obj.getInt("code"),
                message = obj.getString("message"),
                data = if (obj.has("data")) obj.getJSONObject("data") else null
            )
        }
    }
}

// 类型定义
typealias BridgeHandler = (params: JSONObject?) -> (BridgeResponse) -> Unit
typealias BridgeCallback = (BridgeResponse) -> Unit 