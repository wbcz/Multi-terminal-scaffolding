package com.eleme.jsbridge

/**
 * Bridge 回调接口
 */
fun interface Callback {
    fun onCallback(response: BridgeResponse)
} 