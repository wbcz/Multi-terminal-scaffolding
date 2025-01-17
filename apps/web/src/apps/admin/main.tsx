import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './styles/index.css'

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('React error caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </div>
      )
    }

    return this.props.children
  }
}

// 测试组件
const TestApp = () => {
  React.useEffect(() => {
    console.log('TestApp mounted')
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Render</h1>
      <p>If you can see this, React is working!</p>
    </div>
  )
}

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

// 添加调试信息
console.log('Mounting app to:', root)
console.log('Router config:', router)

// 使用错误边界包装应用
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TestApp />
    </ErrorBoundary>
  </React.StrictMode>
) 