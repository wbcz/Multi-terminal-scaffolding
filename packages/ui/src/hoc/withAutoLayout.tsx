import React from 'react';
import styled from 'styled-components';
import { AutoLayoutProps } from '../AutoLayout';

// 提取 Auto Layout 相关的 props
type AutoLayoutStyleProps = Pick<
  AutoLayoutProps,
  'direction' | 'spacing' | 'fill' | 'justify' | 'align' | 'wrap' | 'padding' | 'minWidth' | 'maxWidth'
>;

// 创建容器组件
const AutoLayoutWrapper = styled.div<AutoLayoutStyleProps>`
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

export interface WithAutoLayoutProps extends AutoLayoutStyleProps {
  /**
   * 是否启用 Auto Layout
   * @default false
   */
  enableAutoLayout?: boolean;
  
  /**
   * Auto Layout 容器的 className
   */
  autoLayoutClassName?: string;
  
  /**
   * Auto Layout 容器的样式
   */
  autoLayoutStyle?: React.CSSProperties;
}

/**
 * 高阶组件：为组件添加 Auto Layout 能力
 * @param WrappedComponent 需要包装的组件
 * @returns 包装后的组件
 */
export function withAutoLayout<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return React.forwardRef<any, P & WithAutoLayoutProps>((props, ref) => {
    const {
      enableAutoLayout,
      direction = 'horizontal',
      spacing = 0,
      fill = false,
      justify = 'start',
      align = 'start',
      wrap = false,
      padding,
      minWidth,
      maxWidth,
      autoLayoutClassName,
      autoLayoutStyle,
      ...componentProps
    } = props;

    // 如果未启用 Auto Layout，直接渲染原组件
    if (!enableAutoLayout) {
      return <WrappedComponent {...(componentProps as P)} ref={ref} />;
    }

    // 启用 Auto Layout，使用 AutoLayoutWrapper 包装
    return (
      <AutoLayoutWrapper
        className={autoLayoutClassName}
        style={autoLayoutStyle}
        direction={direction}
        spacing={spacing}
        fill={fill}
        justify={justify}
        align={align}
        wrap={wrap}
        padding={padding}
        minWidth={minWidth}
        maxWidth={maxWidth}
      >
        <WrappedComponent {...(componentProps as P)} ref={ref} />
      </AutoLayoutWrapper>
    );
  });
} 