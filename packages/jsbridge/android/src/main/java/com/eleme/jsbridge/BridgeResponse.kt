package com.eleme.jsbridge

import org.json.JSONObject

/**
 * Bridge 响应数据类
 */
data class BridgeResponse(
    val code: Int,
    val message: String,
    val data: Any? = null
) {
    companion object {
        fun success(data: Any? = null): BridgeResponse {
            return BridgeResponse(200, "Success", data)
        }
        
        fun error(code: Int, message: String): BridgeResponse {
            return BridgeResponse(code, message)
        }
        
        fun fromJson(json: String): BridgeResponse {
            val jsonObject = JSONObject(json)
            return BridgeResponse(
                code = jsonObject.getInt("code"),
                message = jsonObject.getString("message"),
                data = jsonObject.opt("data")
            )
        }
    }
    
    fun toJson(): String {
        return JSONObject().apply {
            put("code", code)
            put("message", message)
            put("data", data ?: JSONObject.NULL)
        }.toString()
    }
} 