import React from 'react';
import styled from 'styled-components';

export interface AutoLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 布局方向
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
  
  /**
   * 间距大小
   * @default 0
   */
  spacing?: number;
  
  /**
   * 是否自动填充父容器
   * @default false
   */
  fill?: boolean;
  
  /**
   * 主轴对齐方式
   * @default 'start'
   */
  justify?: 'start' | 'center' | 'end' | 'space-between';
  
  /**
   * 交叉轴对齐方式
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end' | 'stretch';
  
  /**
   * 是否自动换行
   * @default false
   */
  wrap?: boolean;
  
  /**
   * 内边距
   */
  padding?: number | string;
  
  /**
   * 最小宽度
   */
  minWidth?: number | string;
  
  /**
   * 最大宽度
   */
  maxWidth?: number | string;
  
  children?: React.ReactNode;
}

const StyledAutoLayout = styled.div<AutoLayoutProps>`
  display: flex;
  flex-direction: ${props => props.direction === 'vertical' ? 'column' : 'row'};
  gap: ${props => typeof props.spacing === 'number' ? `${props.spacing}px` : props.spacing || '0'};
  justify-content: ${props => {
    switch (props.justify) {
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'space-between': return 'space-between';
      default: return 'flex-start';
    }
  }};
  align-items: ${props => {
    switch (props.align) {
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'stretch': return 'stretch';
      default: return 'flex-start';
    }
  }};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  padding: ${props => typeof props.padding === 'number' ? `${props.padding}px` : props.padding || '0'};
  min-width: ${props => typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth || 'auto'};
  max-width: ${props => typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth || 'none'};
  ${props => props.fill && `
    width: 100%;
    height: 100%;
  `}
`;

export const AutoLayout: React.FC<AutoLayoutProps> = ({ 
  children,
  direction = 'horizontal',
  spacing = 0,
  fill = false,
  justify = 'start',
  align = 'start',
  wrap = false,
  padding,
  minWidth,
  maxWidth,
  ...rest
}) => {
  return (
    <StyledAutoLayout
      direction={direction}
      spacing={spacing}
      fill={fill}
      justify={justify}
      align={align}
      wrap={wrap}
      padding={padding}
      minWidth={minWidth}
      maxWidth={maxWidth}
      {...rest}
    >
      {children}
    </StyledAutoLayout>
  );
}; 