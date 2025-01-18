import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons'

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>仪表盘</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="用户总数"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="订单总数"
              value={93}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="销售额"
              value={11280}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
} 