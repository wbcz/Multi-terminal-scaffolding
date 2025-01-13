import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { Button } from '@wbcz/ui';
// 根据 lint_context_0 中的错误提示,这里存在以下几个问题:

// 1. 找不到 react 模块
// 解决方案:需要在 apps/web/package.json 中添加 react 依赖:
// "dependencies": {
//   "react": "^18.0.0"
// }

// 2. 找不到 styled-components 模块 
// 解决方案:需要在 apps/web/package.json 中添加 styled-components 依赖:
// "dependencies": {
//   "styled-components": "^6.0.0"
// }

// 3. 找不到 react/jsx-runtime 模块
// 解决方案:这个通常是 TypeScript 配置问题,需要在 tsconfig.json 中添加:
// "compilerOptions": {
//   "jsx": "react-jsx"
// }

const StyledCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const Home: React.FC = () => {
  return (
    <StyledCard title="Welcome">
      <Button>测试</Button>
      <p>Welcome to React TypeScript App!</p>
      <p>This is a starter template with React, TypeScript, Ant Design, and more.</p>
    </StyledCard>
  );
};

export default Home;