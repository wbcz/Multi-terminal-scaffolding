import React from 'react';
import styled from 'styled-components';
import { withAutoFlexLayout } from './withAutoFlexLayout';

// 示例卡片组件
const Card = styled.div`
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// 示例按钮组件
const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: white;
  cursor: pointer;
  &:hover {
    background: #40a9ff;
  }
`;

// 示例表单组件
const Form = styled.form`
  width: 100%;
`;

const FormItem = styled.div`
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  &:focus {
    border-color: #40a9ff;
    outline: none;
  }
`;

// 示例组件
const DemoComponent: React.FC = () => {
  return (
    <div>
      {/* 卡片组 - 自动检测为水平布局 */}
      <div>
        <Card>卡片 1</Card>
        <Card>卡片 2</Card>
        <Card>卡片 3</Card>
      </div>

      {/* 按钮组 - 自动检测为水平布局，居中对齐 */}
      <div style={{ textAlign: 'center' }}>
        <Button>按钮 1</Button>
        <Button>按钮 2</Button>
        <Button>按钮 3</Button>
      </div>

      {/* 表单 - 自动检测为垂直布局 */}
      <Form>
        <FormItem>
          <label>用户名</label>
          <Input type="text" placeholder="请输入用户名" />
        </FormItem>
        <FormItem>
          <label>密码</label>
          <Input type="password" placeholder="请输入密码" />
        </FormItem>
        <FormItem>
          <Button type="submit">提交</Button>
        </FormItem>
      </Form>

      {/* 网格布局 - 自动检测换行 */}
      <div style={{ width: '100%' }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} style={{ width: 'calc(33.33% - 16px)', margin: '8px' }}>
            网格项 {index + 1}
          </Card>
        ))}
      </div>

      {/* 混合布局 - 自动检测嵌套结构 */}
      <div>
        <div>
          <h3>左侧内容</h3>
          <div>
            <Button>操作 1</Button>
            <Button>操作 2</Button>
          </div>
        </div>
        <div>
          <h3>右侧内容</h3>
          <Card>
            <p>一些描述文本</p>
            <Button>详情</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// 创建增强组件
const EnhancedDemo = withAutoFlexLayout(DemoComponent);

// 导出示例
export const AutoFlexLayoutDemo: React.FC = () => {
  return (
    <div style={{ padding: 24, background: '#f0f2f5' }}>
      <h2>自动弹性布局示例</h2>
      
      <EnhancedDemo
        enableAutoFlex
        autoFlexConfig={{
          recursive: true,
          defaultSpacing: 16,
          // 可以通过 overrideRules 覆盖自动检测的结果
          overrideRules: {
            // 对特定元素强制应用某些布局属性
            '.grid': {
              wrap: true,
              justify: 'space-between'
            }
          }
        }}
      />
    </div>
  );
}; 