import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout as AntLayout, Menu } from 'antd'
import { UserOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons'

const { Header, Sider, Content } = AntLayout

export const Layout: React.FC = () => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', background: '#001529', color: '#fff' }}>
        <div style={{ float: 'left', width: 120, height: 31, margin: '16px 24px 16px 0' }}>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>饿了么后台</h1>
        </div>
      </Header>
      <AntLayout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: 'dashboard',
                icon: <DashboardOutlined />,
                label: '仪表盘'
              },
              {
                key: 'users',
                icon: <UserOutlined />,
                label: '用户管理'
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: '系统设置'
              }
            ]}
          />
        </Sider>
        <Content style={{ padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
} 