import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import styled from 'styled-components';

export interface ButtonProps extends AntButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
}

const StyledButton = styled(AntButton)<ButtonProps>`
  &.ant-btn-primary {
    background: ${props => props.variant === 'secondary' ? '#666' : '#1890ff'};
  }
`;

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return <StyledButton {...props} type={variant === 'text' ? 'link' : 'primary'} variant={variant} />;
}; 