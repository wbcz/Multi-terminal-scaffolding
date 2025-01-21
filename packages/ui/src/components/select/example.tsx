import React, { useState } from 'react';
import styled from 'styled-components';
import { TraditionalSelect } from './TraditionalSelect';
import { HeadlessSelect } from './HeadlessSelect';
import type { Option } from './types';

const options: Option[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3', disabled: true },
  { label: '选项4', value: '4' },
];

const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

// 自定义样式的 Headless Select
const StyledHeadlessSelect = styled(HeadlessSelect)`
  position: relative;
  width: 200px;
  
  button {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: white;
    text-align: left;
    cursor: pointer;
    
    &:hover {
      border-color: #40a9ff;
    }
    
    &:focus {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      outline: none;
    }
  }
  
  ul {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 4px 0;
    padding: 4px 0;
    background: white;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style: none;
    z-index: 1000;
  }
  
  li {
    padding: 8px 12px;
    cursor: pointer;
    
    &:hover {
      background: #f5f5f5;
    }
  }
`;

export const SelectExample: React.FC = () => {
  const [traditionalValue, setTraditionalValue] = useState<string | number>();
  const [headlessValue, setHeadlessValue] = useState<string | number>();
  
  return (
    <Wrapper>
      <Section>
        <Title>传统组件</Title>
        <TraditionalSelect
          options={options}
          value={traditionalValue}
          onChange={setTraditionalValue}
          placeholder="请选择一个选项"
        />
      </Section>
      
      <Section>
        <Title>Headless 组件</Title>
        <StyledHeadlessSelect
          options={options}
          value={headlessValue}
          onChange={setHeadlessValue}
          placeholder="请选择一个选项"
        />
      </Section>
    </Wrapper>
  );
}; 