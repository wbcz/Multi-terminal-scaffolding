import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Content, Footer } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
`;

const StyledContent = styled(Content)`
  padding: 24px;
`;

const StyledFooter = styled(Footer)`
  text-align: center;
`;

const MainLayout: React.FC = () => {
  return (
    <StyledLayout>
      <StyledHeader>饿了么后台管理系统</StyledHeader>
      <StyledContent>
        <Outlet />
      </StyledContent>
      <StyledFooter>饿了么 ©2024</StyledFooter>
    </StyledLayout>
  );
};

export default MainLayout; 