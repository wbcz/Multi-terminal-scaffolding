import { Button, Card, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import styled from 'styled-components';
import { createPresetComponent } from './register';
import { presets } from './config';

// 创建基础容器组件
const ButtonGroup = styled.div`
  display: inline-flex;
`;

// 创建预配置的表单组件
export const AutoLayoutForm = createPresetComponent<FormProps>(Form, {
  ...presets.form,
  fill: true,
});

// 创建预配置的卡片组件
export const AutoLayoutCard = createPresetComponent(Card, {
  ...presets.cardGroup,
});

// 创建预配置的按钮组组件
export const AutoLayoutButtonGroup = createPresetComponent(ButtonGroup, {
  ...presets.buttonGroup,
});

// 创建预配置的输入框组件
export const AutoLayoutInput = createPresetComponent(Input, {
  ...presets.form,
}); 