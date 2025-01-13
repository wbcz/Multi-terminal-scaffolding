import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const Home: React.FC = () => {
  return (
    <StyledCard title="Welcome">
      <p>Welcome to React TypeScript App!</p>
      <p>This is a starter template with React, TypeScript, Ant Design, and more.</p>
    </StyledCard>
  );
};

export default Home; 