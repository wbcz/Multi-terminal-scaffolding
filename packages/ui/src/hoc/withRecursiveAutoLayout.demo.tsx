import React from 'react';
import { Button, Form, Input, Card as AntCard } from 'antd';
import styled from 'styled-components';
import { withRecursiveAutoLayout } from './withRecursiveAutoLayout';

// 创建一个复杂的表单组件
const ComplexForm = styled(Form)`
  width: 100%;
`;

// 创建一个卡片组组件
const CardGroup = styled.div`
  width: 100%;
`;

// 创建一个按钮组组件
const ButtonGroup = styled.div`
  width: 100%;
`;

// 使用递归 Auto Layout 包装组件
const AutoLayoutForm = withRecursiveAutoLayout(ComplexForm);
const AutoLayoutCardGroup = withRecursiveAutoLayout(CardGroup);
const AutoLayoutButtonGroup = withRecursiveAutoLayout(ButtonGroup);
const AutoLayoutCard = withRecursiveAutoLayout(AntCard);

// 示例组件
export const RecursiveAutoLayoutDemo = () => {
  return (
    <div style={{ padding: 24, background: '#f5f5f5' }}>
      <h2>递归 Auto Layout 示例</h2>
      
      <AutoLayoutForm
        enableAutoLayout
        recursive
        direction="vertical"
        spacing={24}
        childrenAutoLayout={{
          spacing: 16,
          align: 'stretch',
        }}
      >
        {/* 卡片组 */}
        <AutoLayoutCardGroup
          enableAutoLayout
          direction="horizontal"
          spacing={16}
          wrap
        >
          {/* 卡片 1 */}
          <AutoLayoutCard
            title="基本信息"
            style={{ width: 300 }}
            enableAutoLayout
            direction="vertical"
            spacing={16}
          >
            <Form.Item label="用户名">
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="邮箱">
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </AutoLayoutCard>

          {/* 卡片 2 */}
          <AutoLayoutCard
            title="联系方式"
            style={{ width: 300 }}
            enableAutoLayout
            direction="vertical"
            spacing={16}
          >
            <Form.Item label="手机号">
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item label="地址">
              <Input placeholder="请输入地址" />
            </Form.Item>
          </AutoLayoutCard>

          {/* 卡片 3 */}
          <AutoLayoutCard
            title="其他信息"
            style={{ width: 300 }}
            enableAutoLayout
            direction="vertical"
            spacing={16}
          >
            <Form.Item label="职业">
              <Input placeholder="请输入职业" />
            </Form.Item>
            <Form.Item label="兴趣爱好">
              <Input placeholder="请输入兴趣爱好" />
            </Form.Item>
          </AutoLayoutCard>
        </AutoLayoutCardGroup>

        {/* 按钮组 */}
        <AutoLayoutButtonGroup
          enableAutoLayout
          justify="center"
          spacing={16}
        >
          <Button type="primary">提交</Button>
          <Button>重置</Button>
          <Button>取消</Button>
        </AutoLayoutButtonGroup>
      </AutoLayoutForm>

      <h3 style={{ marginTop: 32 }}>嵌套列表示例</h3>
      <AutoLayoutCardGroup
        enableAutoLayout
        recursive
        direction="vertical"
        spacing={16}
        childrenAutoLayout={{
          direction: 'horizontal',
          spacing: 8,
          wrap: true,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <AutoLayoutCard
            key={i}
            title={`分组 ${i + 1}`}
            enableAutoLayout
            direction="vertical"
            spacing={8}
          >
            <div>
              {Array.from({ length: 4 }).map((_, j) => (
                <AutoLayoutCard
                  key={j}
                  size="small"
                  style={{ width: 200 }}
                >
                  子项 {j + 1}
                </AutoLayoutCard>
              ))}
            </div>
          </AutoLayoutCard>
        ))}
      </AutoLayoutCardGroup>
    </div>
  );
}; 