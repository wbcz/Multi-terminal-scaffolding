package com.eleme.jsbridge

import android.webkit.JavascriptInterface
import org.json.JSONObject

/**
 * JavaScript 接口类
 * 用于接收 JavaScript 的调用
 */
internal class JavaScriptInterface(private val bridge: JSBridge) {
    
    /**
     * 处理 JavaScript 调用
     */
    @JavascriptInterface
    fun call(methodData: String) {
        try {
            val json = JSONObject(methodData)
            val method = json.getString("method")
            val data = json.optString("data")
            val callbackId = json.optString("callbackId")
            
            bridge.handleCall(method, data, callbackId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    
    /**
     * 处理 JavaScript 回调
     */
    @JavascriptInterface
    fun onCallback(callbackId: String, responseData: String) {
        bridge.handleCallback(callbackId, responseData)
    }
} 