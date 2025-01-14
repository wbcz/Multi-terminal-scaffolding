import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { withAutoLayout } from './withAutoLayout';

// 示例：包装 Ant Design 的 Button 组件
const AutoLayoutButton = withAutoLayout(Button);

// 示例：创建一个简单的卡片组件
const Card = styled.div`
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: white;
`;

// 包装卡片组件
const AutoLayoutCard = withAutoLayout(Card);

// 示例：创建一个输入框组件
const Input = styled.input`
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  &:focus {
    border-color: #40a9ff;
    outline: none;
  }
`;

// 包装输入框组件
const AutoLayoutInput = withAutoLayout(Input);

export const WithAutoLayoutDemo = () => {
  return (
    <div style={{ padding: 24, background: '#f5f5f5' }}>
      <h3>1. 按钮组自动布局</h3>
      <div style={{ marginBottom: 24 }}>
        <AutoLayoutButton
          enableAutoLayout
          spacing={8}
          wrap
        >
          <Button type="primary">主按钮</Button>
          <Button>次按钮</Button>
          <Button type="dashed">虚线按钮</Button>
        </AutoLayoutButton>
      </div>

      <h3>2. 卡片组垂直布局</h3>
      <div style={{ marginBottom: 24 }}>
        <AutoLayoutCard
          enableAutoLayout
          direction="vertical"
          spacing={16}
          padding={16}
        >
          <Card>卡片 1</Card>
          <Card>卡片 2</Card>
          <Card>卡片 3</Card>
        </AutoLayoutCard>
      </div>

      <h3>3. 表单布局</h3>
      <div style={{ marginBottom: 24 }}>
        <AutoLayoutCard
          enableAutoLayout
          direction="vertical"
          spacing={16}
          padding={16}
        >
          <AutoLayoutInput
            enableAutoLayout
            spacing={8}
            align="center"
          >
            <span>用户名：</span>
            <Input placeholder="请输入用户名" />
          </AutoLayoutInput>
          
          <AutoLayoutInput
            enableAutoLayout
            spacing={8}
            align="center"
          >
            <span>密码：</span>
            <Input type="password" placeholder="请输入密码" />
          </AutoLayoutInput>

          <AutoLayoutButton
            enableAutoLayout
            justify="center"
            spacing={16}
          >
            <Button type="primary">登录</Button>
            <Button>取消</Button>
          </AutoLayoutButton>
        </AutoLayoutCard>
      </div>

      <h3>4. 响应式布局</h3>
      <AutoLayoutCard
        enableAutoLayout
        wrap
        spacing={16}
        padding={16}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} style={{ width: 200 }}>
            响应式卡片 {index + 1}
          </Card>
        ))}
      </AutoLayoutCard>
    </div>
  );
}; 