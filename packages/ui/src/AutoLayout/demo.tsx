import React from 'react';
import { AutoLayout } from './index';
import styled from 'styled-components';

const DemoBox = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e8e8e8;
`;

const ColorBlock = styled.div<{ color?: string }>`
  width: 100px;
  height: 50px;
  background-color: ${props => props.color || '#1890ff'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AutoLayoutDemo = () => {
  return (
    <DemoBox>
      <h3>基础水平布局</h3>
      <AutoLayout spacing={16}>
        <ColorBlock>Block 1</ColorBlock>
        <ColorBlock color="#52c41a">Block 2</ColorBlock>
        <ColorBlock color="#722ed1">Block 3</ColorBlock>
      </AutoLayout>

      <h3>垂直布局</h3>
      <AutoLayout direction="vertical" spacing={16}>
        <ColorBlock>Block 1</ColorBlock>
        <ColorBlock color="#52c41a">Block 2</ColorBlock>
        <ColorBlock color="#722ed1">Block 3</ColorBlock>
      </AutoLayout>

      <h3>自适应填充</h3>
      <AutoLayout fill spacing={16} justify="space-between">
        <ColorBlock>Block 1</ColorBlock>
        <ColorBlock color="#52c41a">Block 2</ColorBlock>
        <ColorBlock color="#722ed1">Block 3</ColorBlock>
      </AutoLayout>

      <h3>居中对齐</h3>
      <AutoLayout spacing={16} justify="center" align="center">
        <ColorBlock>Block 1</ColorBlock>
        <ColorBlock color="#52c41a">Block 2</ColorBlock>
        <ColorBlock color="#722ed1">Block 3</ColorBlock>
      </AutoLayout>

      <h3>自动换行</h3>
      <AutoLayout spacing={16} wrap maxWidth="300px">
        <ColorBlock>Block 1</ColorBlock>
        <ColorBlock color="#52c41a">Block 2</ColorBlock>
        <ColorBlock color="#722ed1">Block 3</ColorBlock>
        <ColorBlock color="#eb2f96">Block 4</ColorBlock>
      </AutoLayout>
    </DemoBox>
  );
}; 