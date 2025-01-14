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

export interface WithRecursiveAutoLayoutProps extends AutoLayoutStyleProps {
  /**
   * 是否启用 Auto Layout
   * @default false
   */
  enableAutoLayout?: boolean;
  
  /**
   * 是否递归处理子组件
   * @default false
   */
  recursive?: boolean;

  /**
   * 子组件的 Auto Layout 配置
   */
  childrenAutoLayout?: Partial<AutoLayoutStyleProps>;
  
  /**
   * Auto Layout 容器的 className
   */
  autoLayoutClassName?: string;
  
  /**
   * Auto Layout 容器的样式
   */
  autoLayoutStyle?: React.CSSProperties;

  /**
   * 需要排除的子组件类型
   */
  excludeComponents?: React.ComponentType[];

  /**
   * 子组件
   */
  children?: React.ReactNode;
}

/**
 * 判断组件是否是 React 元素
 */
const isReactElement = (child: any): child is React.ReactElement => {
  return React.isValidElement(child);
};

/**
 * 判断组件是否需要被排除
 */
const shouldExcludeComponent = (
  component: React.ReactElement,
  excludeComponents: React.ComponentType[] = []
) => {
  return excludeComponents.some(ExcludeComponent => {
    return component.type === ExcludeComponent;
  });
};

/**
 * 递归处理子组件
 */
const processChildren = (
  children: React.ReactNode,
  childrenAutoLayout: Partial<AutoLayoutStyleProps> = {},
  excludeComponents: React.ComponentType[] = []
): React.ReactNode => {
  return React.Children.map(children, child => {
    if (!isReactElement(child)) {
      return child;
    }

    // 如果组件在排除列表中，直接返回
    if (shouldExcludeComponent(child, excludeComponents)) {
      return child;
    }

    // 处理子组件的 props
    const childProps = {
      ...child.props,
      enableAutoLayout: true,
      ...childrenAutoLayout,
      // 递归处理孙组件
      children: processChildren(
        child.props.children,
        childrenAutoLayout,
        excludeComponents
      ),
    };

    // 创建新的组件实例
    return React.cloneElement(child, childProps);
  });
};

/**
 * 高阶组件：为组件及其子组件添加 Auto Layout 能力
 * @param WrappedComponent 需要包装的组件
 * @returns 包装后的组件
 */
export function withRecursiveAutoLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return React.forwardRef<any, P & WithRecursiveAutoLayoutProps>((props, ref) => {
    const {
      enableAutoLayout,
      recursive = false,
      childrenAutoLayout,
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
      excludeComponents,
      children,
      ...componentProps
    } = props;

    // 如果未启用 Auto Layout，直接渲染原组件
    if (!enableAutoLayout) {
      return <WrappedComponent {...(componentProps as P)} ref={ref}>
        {children}
      </WrappedComponent>;
    }

    // 处理子组件
    const processedChildren = recursive
      ? processChildren(children, childrenAutoLayout, excludeComponents)
      : children;

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
        <WrappedComponent {...(componentProps as P)} ref={ref}>
          {processedChildren}
        </WrappedComponent>
      </AutoLayoutWrapper>
    );
  });
} 