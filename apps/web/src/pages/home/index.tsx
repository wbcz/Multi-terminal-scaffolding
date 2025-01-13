import React from 'react';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const HomePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>欢迎使用饿了么后台管理系统</Title>
      <StyledCard title="系统概览">
        <p>这里是系统的主页面，您可以在这里查看系统的整体情况。</p>
      </StyledCard>
    </div>
  );
};

export default HomePage; 