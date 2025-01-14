import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AutoLayoutProps } from '../AutoLayout';

// 提取 Auto Layout 相关的 props
type AutoLayoutStyleProps = Pick<
  AutoLayoutProps,
  'direction' | 'spacing' | 'fill' | 'justify' | 'align' | 'wrap' | 'padding' | 'minWidth' | 'maxWidth'
>;

// 创建容器组件
const FlexContainer = styled.div<AutoLayoutStyleProps>`
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

export interface WithAutoFlexLayoutProps extends AutoLayoutStyleProps {
  enableAutoFlex?: boolean;
  autoFlexConfig?: {
    recursive?: boolean;
    excludeSelectors?: string[];
    defaultSpacing?: number;
    overrideRules?: {
      [selector: string]: Partial<AutoLayoutStyleProps>;
    };
  };
}

interface LayoutInfo {
  direction: 'horizontal' | 'vertical';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  spacing?: number;
}

function analyzeLayout(element: HTMLElement): LayoutInfo {
  const computedStyle = window.getComputedStyle(element);
  const children = Array.from(element.children);
  
  // 如果没有子元素，返回默认布局
  if (children.length === 0) {
    return { direction: 'horizontal' };
  }

  const childRects = children.map(child => (child as HTMLElement).getBoundingClientRect());
  const parentRect = element.getBoundingClientRect();

  // 分析子元素的排列方式
  let isVertical = true;
  let isHorizontal = true;
  let maxHorizontalGap = 0;
  let maxVerticalGap = 0;
  let hasWrapping = false;

  for (let i = 1; i < childRects.length; i++) {
    const prev = childRects[i - 1];
    const curr = childRects[i];

    // 检测水平间距
    const horizontalGap = curr.left - prev.right;
    maxHorizontalGap = Math.max(maxHorizontalGap, horizontalGap);

    // 检测垂直间距
    const verticalGap = curr.top - prev.bottom;
    maxVerticalGap = Math.max(maxVerticalGap, verticalGap);

    // 检测是否有换行
    if (curr.left < prev.left) {
      hasWrapping = true;
    }

    // 检测排列方向
    if (Math.abs(curr.top - prev.top) > 5) {
      isHorizontal = false;
    }
    if (Math.abs(curr.left - prev.left) > 5) {
      isVertical = false;
    }
  }

  // 分析对齐方式
  const alignItems = computedStyle.alignItems;
  const justifyContent = computedStyle.justifyContent;

  // 分析间距
  const spacing = Math.round(isVertical ? maxVerticalGap : maxHorizontalGap);

  // 确定主轴方向
  let direction: 'horizontal' | 'vertical';
  if (isVertical && !isHorizontal) {
    direction = 'vertical';
  } else if (!isVertical && isHorizontal) {
    direction = 'horizontal';
  } else {
    // 如果两个方向都有或都没有，根据内容区域比例决定
    const contentRatio = parentRect.width / parentRect.height;
    direction = contentRatio >= 1 ? 'horizontal' : 'vertical';
  }

  // 分析对齐方式
  const justify = justifyContent === 'center' ? 'center' :
                 justifyContent === 'flex-end' ? 'end' :
                 justifyContent === 'space-between' ? 'space-between' : 'start';

  const align = alignItems === 'center' ? 'center' :
               alignItems === 'flex-end' ? 'end' :
               alignItems === 'stretch' ? 'stretch' : 'start';

  return {
    direction,
    justify,
    align,
    wrap: hasWrapping,
    spacing: spacing > 0 ? spacing : undefined
  };
}

function applyAutoLayout(
  element: HTMLElement | null,
  config: Required<NonNullable<WithAutoFlexLayoutProps['autoFlexConfig']>>,
  isRoot = true
) {
  if (!element || !config || config.excludeSelectors?.some(selector => element.matches(selector))) {
    return;
  }

  // 分析当前元素的布局
  const layoutInfo = analyzeLayout(element);

  // 应用布局样式
  element.style.display = 'flex';
  element.style.flexDirection = layoutInfo.direction === 'vertical' ? 'column' : 'row';
  element.style.gap = `${layoutInfo.spacing || config.defaultSpacing}px`;
  element.style.justifyContent = layoutInfo.justify === 'center' ? 'center' :
                                layoutInfo.justify === 'end' ? 'flex-end' :
                                layoutInfo.justify === 'space-between' ? 'space-between' : 'flex-start';
  element.style.alignItems = layoutInfo.align === 'center' ? 'center' :
                            layoutInfo.align === 'end' ? 'flex-end' :
                            layoutInfo.align === 'stretch' ? 'stretch' : 'flex-start';
  element.style.flexWrap = layoutInfo.wrap ? 'wrap' : 'nowrap';

  // 应用覆盖规则
  for (const [selector, rules] of Object.entries(config.overrideRules || {})) {
    if (element.matches(selector)) {
      if (rules.direction) {
        element.style.flexDirection = rules.direction === 'vertical' ? 'column' : 'row';
      }
      if (rules.justify) {
        element.style.justifyContent = rules.justify === 'center' ? 'center' :
                                     rules.justify === 'end' ? 'flex-end' :
                                     rules.justify === 'space-between' ? 'space-between' : 'flex-start';
      }
      if (rules.align) {
        element.style.alignItems = rules.align === 'center' ? 'center' :
                                 rules.align === 'end' ? 'flex-end' :
                                 rules.align === 'stretch' ? 'stretch' : 'flex-start';
      }
      if (rules.wrap !== undefined) {
        element.style.flexWrap = rules.wrap ? 'wrap' : 'nowrap';
      }
      if (rules.spacing !== undefined) {
        element.style.gap = `${rules.spacing}px`;
      }
    }
  }

  // 递归处理子元素
  if (config.recursive) {
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        applyAutoLayout(child, config, false);
      }
    });
  }
}

export function withAutoFlexLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return React.forwardRef<HTMLDivElement, P & WithAutoFlexLayoutProps>((props, ref) => {
    const {
      enableAutoFlex,
      autoFlexConfig,
      direction,
      spacing,
      fill,
      justify,
      align,
      wrap,
      padding,
      minWidth,
      maxWidth,
      ...componentProps
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!enableAutoFlex) return;

      const config: Required<NonNullable<WithAutoFlexLayoutProps['autoFlexConfig']>> = {
        recursive: true,
        excludeSelectors: [],
        defaultSpacing: spacing as number || 16,
        overrideRules: {},
        ...autoFlexConfig,
      };

      applyAutoLayout(containerRef.current, config);
    }, [enableAutoFlex, autoFlexConfig, spacing]);

    const layoutProps: AutoLayoutStyleProps = {
      direction,
      spacing,
      fill,
      justify,
      align,
      wrap,
      padding,
      minWidth,
      maxWidth,
    };

    return (
      <FlexContainer ref={containerRef} {...layoutProps}>
        <WrappedComponent {...componentProps as P} />
      </FlexContainer>
    );
  });
} 