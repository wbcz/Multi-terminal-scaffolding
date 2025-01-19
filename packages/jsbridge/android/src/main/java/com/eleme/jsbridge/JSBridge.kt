package com.eleme.jsbridge

import android.webkit.WebView
import android.os.Handler
import android.os.Looper
import org.json.JSONObject
import java.util.concurrent.ConcurrentHashMap

/**
 * JSBridge 核心类
 * 负责 JavaScript 和 Android 原生之间的双向通信
 */
class JSBridge private constructor(private val webView: WebView) {
    private val handlers = ConcurrentHashMap<String, BridgeHandler>()
    private val callbacks = ConcurrentHashMap<String, Callback>()
    private val mainHandler = Handler(Looper.getMainLooper())
    
    companion object {
        private const val BRIDGE_NAME = "ElemeJSBridge"
        private var instance: JSBridge? = null
        
        @JvmStatic
        fun getInstance(webView: WebView): JSBridge {
            return instance ?: synchronized(this) {
                instance ?: JSBridge(webView).also { instance = it }
            }
        }
    }
    
    init {
        setupBridge()
    }
    
    /**
     * 设置 Bridge
     */
    private fun setupBridge() {
        // 注入 JavaScript 接口
        webView.addJavascriptInterface(JavaScriptInterface(this), BRIDGE_NAME)
        
        // 注册默认处理器
        registerDefaultHandlers()
    }
    
    /**
     * 注册默认处理器
     */
    private fun registerDefaultHandlers() {
        // 设备信息
        register("getDeviceInfo") { data, callback ->
            val deviceInfo = JSONObject().apply {
                put("platform", "android")
                put("osVersion", android.os.Build.VERSION.RELEASE)
                put("deviceModel", android.os.Build.MODEL)
                put("manufacturer", android.os.Build.MANUFACTURER)
            }
            callback.onCallback(BridgeResponse.success(deviceInfo))
        }
        
        // 网络状态
        register("getNetworkType") { _, callback ->
            val networkType = NetworkUtils.getNetworkType(webView.context)
            callback.onCallback(BridgeResponse.success(networkType))
        }
    }
    
    /**
     * 注册处理器
     */
    fun register(method: String, handler: BridgeHandler) {
        handlers[method] = handler
    }
    
    /**
     * 注销处理器
     */
    fun unregister(method: String) {
        handlers.remove(method)
    }
    
    /**
     * 处理来自 JavaScript 的调用
     */
    internal fun handleCall(method: String, data: String?, callbackId: String?) {
        val handler = handlers[method]
        if (handler == null) {
            callbackToJs(callbackId, BridgeResponse.error(404, "Handler not found"))
            return
        }
        
        try {
            val callback = object : Callback {
                override fun onCallback(response: BridgeResponse) {
                    callbackToJs(callbackId, response)
                }
            }
            
            val parsedData = if (data.isNullOrEmpty()) null else JSONObject(data)
            handler.handle(parsedData, callback)
        } catch (e: Exception) {
            callbackToJs(callbackId, BridgeResponse.error(500, e.message ?: "Internal error"))
        }
    }
    
    /**
     * 调用 JavaScript 方法
     */
    fun callHandler(method: String, data: Any?, callback: Callback? = null) {
        val callbackId = if (callback != null) {
            val id = "native_cb_${System.currentTimeMillis()}"
            callbacks[id] = callback
            id
        } else null
        
        val jsonData = JSONObject().apply {
            put("method", method)
            put("data", data ?: JSONObject())
            callbackId?.let { put("callbackId", it) }
        }
        
        // 在主线程执行 JavaScript 调用
        mainHandler.post {
            val js = "javascript:window.$BRIDGE_NAME.onNativeCall('${jsonData}')"
            webView.evaluateJavascript(js, null)
        }
    }
    
    /**
     * 向 JavaScript 发送回调
     */
    private fun callbackToJs(callbackId: String?, response: BridgeResponse) {
        if (callbackId == null) return
        
        mainHandler.post {
            val js = "javascript:window.$BRIDGE_NAME.onNativeCallback('$callbackId', '${response.toJson()}')"
            webView.evaluateJavascript(js, null)
        }
    }
    
    /**
     * 处理 JavaScript 的回调
     */
    internal fun handleCallback(callbackId: String, responseData: String) {
        val callback = callbacks.remove(callbackId) ?: return
        try {
            val response = BridgeResponse.fromJson(responseData)
            callback.onCallback(response)
        } catch (e: Exception) {
            callback.onCallback(BridgeResponse.error(500, "Invalid response format"))
        }
    }
    
    /**
     * 清理资源
     */
    fun destroy() {
        handlers.clear()
        callbacks.clear()
        instance = null
    }
} 