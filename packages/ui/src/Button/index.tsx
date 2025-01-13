import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import styled from 'styled-components';

export interface ButtonProps extends AntButtonProps {
  variant?: 'text' | 'outlined' | 'dashed' | 'solid' | 'filled';
}

const StyledButton = styled(AntButton)`
  &.custom-button {
    border-radius: 4px;
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButton className="custom-button" {...props}>
      {children}
    </StyledButton>
  );
}; 