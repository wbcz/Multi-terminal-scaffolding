import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'

console.log('Environment:', {
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>出错了！</div>,
    children: [
      {
        index: true,
        lazy: async () => {
          console.log('Loading dashboard component...')
          return import('./pages/dashboard')
        },
        errorElement: <div>加载出错</div>,
      },
      {
        path: 'users',
        lazy: async () => {
          console.log('Loading users component...')
          return import('./pages/users')
        },
        errorElement: <div>加载出错</div>,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.VITE_APP_BASE_URL || '/admin',
  future: {
    v7_relativeSplatPath: true
  }
})

export default router 