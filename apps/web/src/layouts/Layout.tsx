import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import styled from 'styled-components';

const { Header, Content, Footer } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 50px;
  display: flex;
  align-items: center;
`;

const StyledContent = styled(Content)`
  padding: 50px;
`;

const StyledFooter = styled(Footer)`
  text-align: center;
`;

const Layout: React.FC = () => {
  return (
    <StyledLayout>
      <StyledHeader>
        <h1>React TypeScript App</h1>
      </StyledHeader>
      <StyledContent>
        <Outlet />
      </StyledContent>
      <StyledFooter>
        ©{new Date().getFullYear()} React TypeScript App
      </StyledFooter>
    </StyledLayout>
  );
};

export default Layout; 