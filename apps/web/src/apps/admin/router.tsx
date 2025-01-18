import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './layouts'
import { Dashboard } from './pages/dashboard'
import { Login } from './pages/login'
import { NotFound } from './pages/404'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router 