import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './layouts/Layout'

const ProductManagement = lazy(() => import('./pages/ProductManagement'))

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
        path: 'products',
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <ProductManagement />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/products" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.VITE_APP_BASE_URL || '/merchant',
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true
  } as any
})

export default router 