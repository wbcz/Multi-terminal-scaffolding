import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import type { FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
`;

const LoginCard = styled(Card)`
  width: 400px;
`;

const StyledForm = styled(Form)`
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormData>();

  const handleSubmit = async (values: LoginFormData) => {
    try {
      // TODO: 调用登录 API
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error('登录失败');
    }
  };

  return (
    <Container>
      <LoginCard title="饿了么后台管理系统">
        <StyledForm
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </StyledForm>
      </LoginCard>
    </Container>
  );
};

export default LoginPage; 