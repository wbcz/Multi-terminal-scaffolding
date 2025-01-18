import React from 'react'
import ReactDOM from 'react-dom/client'
import { AdminApplication } from './application'
import { App } from './App'
import './styles/index.css'

// 创建应用实例
const app = new AdminApplication()

// 启动应用
app.bootstrap().then(() => {
  // 渲染 React 应用
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}).catch(error => {
  console.error('Failed to bootstrap admin application:', error)
}) 