package com.eleme.jsbridge.example

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.eleme.jsbridge.BridgeResponse
import com.eleme.jsbridge.JSBridge
import org.json.JSONObject

class WebViewActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var bridge: JSBridge
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 初始化 WebView
        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            webViewClient = WebViewClient()
        }
        setContentView(webView)
        
        // 初始化 JSBridge
        bridge = JSBridge.getInstance(webView)
        
        // 注册自定义处理器
        setupBridgeHandlers()
        
        // 加载网页
        webView.loadUrl("https://your-website.com")
    }
    
    private fun setupBridgeHandlers() {
        // 分享处理器
        bridge.register("share") { data, callback ->
            val title = data?.optString("title")
            val content = data?.optString("content")
            val url = data?.optString("url")
            
            // 调用系统分享
            shareToSystem(title, content, url)
            
            callback.onCallback(BridgeResponse.success())
        }
        
        // 支付处理器
        bridge.register("pay") { data, callback ->
            val amount = data?.optDouble("amount") ?: 0.0
            val orderId = data?.optString("orderId")
            
            // 调用支付SDK
            startPayment(amount, orderId) { success ->
                if (success) {
                    callback.onCallback(BridgeResponse.success())
                } else {
                    callback.onCallback(BridgeResponse.error(500, "Payment failed"))
                }
            }
        }
        
        // 扫码处理器
        bridge.register("scan") { _, callback ->
            // 启动扫码界面
            startScanActivity { result ->
                callback.onCallback(BridgeResponse.success(result))
            }
        }
    }
    
    // 调用原生方法示例
    private fun callJavaScript() {
        // 异步调用
        bridge.callHandler("jsMethod", JSONObject().apply {
            put("key", "value")
        }) { response ->
            if (response.code == 200) {
                // 处理成功响应
                val data = response.data
            } else {
                // 处理错误
                val message = response.message
            }
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        bridge.destroy()
    }
    
    // 模拟方法，实际项目中需要实现
    private fun shareToSystem(title: String?, content: String?, url: String?) {
        // 实现系统分享
    }
    
    private fun startPayment(amount: Double, orderId: String?, callback: (Boolean) -> Unit) {
        // 实现支付
    }
    
    private fun startScanActivity(callback: (String) -> Unit) {
        // 实现扫码
    }
} 