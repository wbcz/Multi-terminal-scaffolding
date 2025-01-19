package com.eleme.jsbridge

import org.json.JSONObject

/**
 * Bridge 处理器接口
 */
fun interface BridgeHandler {
    fun handle(data: JSONObject?, callback: Callback)
} 