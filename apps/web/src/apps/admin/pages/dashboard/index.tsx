import React, { Suspense } from 'react'

export function Component() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div className="dashboard">
        <h2>仪表盘</h2>
        <div className="dashboard-content">
          <p>欢迎使用饿了么管理后台</p>
        </div>
      </div>
    </Suspense>
  )
} 