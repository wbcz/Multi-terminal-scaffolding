import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

const Layout: React.FC = () => {
  const location = useLocation()

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>管理后台</h1>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            仪表盘
          </Link>
          <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>
            用户管理
          </Link>
        </nav>
      </header>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout 