import React, { ReactElement } from 'react';

export interface LayoutAnalysisResult {
  type: 'flex' | 'grid' | 'block' | 'unknown';
  direction?: 'row' | 'column';
  mainAxisAlignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  crossAxisAlignment?: 'start' | 'center' | 'end' | 'stretch';
  spacing?: {
    gap?: number;
    padding?: string | number;
    margin?: string | number;
  };
  size?: {
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: string | number;
  };
  children?: {
    count: number;
    items: LayoutAnalysisResult[];
  };
  className?: string;
  elementType?: string;
}

/**
 * 分析 React 组件的静态布局信息
 */
export function analyzeLayout(element: ReactElement): LayoutAnalysisResult {
  if (!element) return { type: 'unknown' };

  const { style, className, children } = element.props;
  const elementType = element.type as any;
  const elementName = typeof elementType === 'string' ? elementType : elementType?.displayName || elementType?.name || 'Component';

  // 记录基本信息
  const result: LayoutAnalysisResult = {
    type: 'unknown',
    className,
    elementType: elementName
  };

  // 分析内联样式
  if (style) {
    result.type = getLayoutType(style);

    if (result.type === 'flex') {
      result.direction = style.flexDirection === 'column' ? 'column' : 'row';
      result.mainAxisAlignment = getMainAxisAlignment(style.justifyContent);
      result.crossAxisAlignment = getCrossAxisAlignment(style.alignItems);
    }

    if (style.gap !== undefined || style.padding !== undefined || style.margin !== undefined) {
      result.spacing = {
        gap: style.gap,
        padding: style.padding,
        margin: style.margin,
      };
    }

    if (hasSize(style)) {
      result.size = {
        width: style.width,
        height: style.height,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        minHeight: style.minHeight,
        maxHeight: style.maxHeight,
      };
    }
  }

  // 根据类名分析布局
  if (className) {
    if (isFlexContainer(className)) {
      result.type = 'flex';
      result.direction = getDirectionFromClass(className);
      result.spacing = getSpacingFromClass(className);
    }

    if (hasSizeConstraints(className)) {
      result.size = getSizeFromClass(className);
    }
  }

  // 递归分析子元素
  if (children) {
    const childrenArray = Array.isArray(children) ? children : [children];
    const validChildren = childrenArray.filter((child): child is ReactElement => React.isValidElement(child));
    
    if (validChildren.length > 0) {
      result.children = {
        count: validChildren.length,
        items: validChildren.map(child => analyzeLayout(child)),
      };
    }
  }

  return result;
}

// 辅助函数
function isFlexContainer(className: string): boolean {
  return (
    className.includes('flex') ||
    className.includes('section') ||
    className.includes('card-group') ||
    className.includes('info-list') ||
    className.includes('stats-group')
  );
}

function getDirectionFromClass(className: string): 'row' | 'column' {
  return (
    className.includes('column') ||
    className.includes('section') ||
    className.includes('info-list')
  ) ? 'column' : 'row';
}

function getSpacingFromClass(className: string): { gap?: number } {
  if (className.includes('section')) return { gap: 16 };
  if (className.includes('card-group')) return { gap: 16 };
  if (className.includes('info-list')) return { gap: 12 };
  if (className.includes('stats-group')) return { gap: 24 };
  return {};
}

function hasSizeConstraints(className: string): boolean {
  return className.includes('card-item') || className.includes('stats-item');
}

function getSizeFromClass(className: string): { minWidth?: number } {
  if (className.includes('card-item')) return { minWidth: 240 };
  if (className.includes('stats-item')) return { minWidth: 160 };
  return {};
}

function hasSize(style: React.CSSProperties): boolean {
  return (
    style.width !== undefined ||
    style.height !== undefined ||
    style.minWidth !== undefined ||
    style.maxWidth !== undefined ||
    style.minHeight !== undefined ||
    style.maxHeight !== undefined
  );
}

/**
 * 获取布局类型
 */
function getLayoutType(style?: React.CSSProperties): LayoutAnalysisResult['type'] {
  if (!style) return 'unknown';
  
  if (style.display === 'flex' || style.display === 'inline-flex') {
    return 'flex';
  }
  
  if (style.display === 'grid' || style.display === 'inline-grid') {
    return 'grid';
  }
  
  if (style.display === 'block') {
    return 'block';
  }
  
  return 'unknown';
}

/**
 * 获取主轴对齐方式
 */
function getMainAxisAlignment(
  justifyContent?: string
): LayoutAnalysisResult['mainAxisAlignment'] {
  switch (justifyContent) {
    case 'flex-start':
      return 'start';
    case 'center':
      return 'center';
    case 'flex-end':
      return 'end';
    case 'space-between':
      return 'space-between';
    case 'space-around':
      return 'space-around';
    default:
      return 'start';
  }
}

/**
 * 获取交叉轴对齐方式
 */
function getCrossAxisAlignment(
  alignItems?: string
): LayoutAnalysisResult['crossAxisAlignment'] {
  switch (alignItems) {
    case 'flex-start':
      return 'start';
    case 'center':
      return 'center';
    case 'flex-end':
      return 'end';
    case 'stretch':
      return 'stretch';
    default:
      return 'start';
  }
}

/**
 * 格式化布局分析结果
 */
export function formatLayoutAnalysis(result: LayoutAnalysisResult, level: number = 0): string {
  const indent = '  '.repeat(level);
  let output = '';

  // 组件标识
  const componentName = [
    result.elementType,
    result.className && `[${result.className}]`,
  ].filter(Boolean).join(' ');

  output += `${indent}└─ ${componentName}\n`;

  // 布局信息
  if (result.type !== 'unknown') {
    output += `${indent}   ├─ 布局: ${getLayoutDescription(result)}\n`;
  }

  // 间距信息
  if (result.spacing && hasSpacing(result.spacing)) {
    output += `${indent}   ├─ 间距: ${getSpacingDescription(result.spacing)}\n`;
  }

  // 尺寸信息
  if (result.size && hasSizeInfo(result.size)) {
    output += `${indent}   ├─ 尺寸: ${getSizeDescription(result.size)}\n`;
  }

  // 子元素
  if (result.children && result.children.count > 0) {
    result.children.items.forEach(child => {
      output += formatLayoutAnalysis(child, level + 1);
    });
  }

  return output;
}

function getLayoutDescription(result: LayoutAnalysisResult): string {
  if (result.type === 'flex') {
    return `Flex ${result.direction} ${result.mainAxisAlignment} ${result.crossAxisAlignment}`;
  }
  return result.type;
}

function hasSpacing(spacing: LayoutAnalysisResult['spacing']): boolean {
  if (!spacing) return false;
  return spacing.gap !== undefined || spacing.padding !== undefined || spacing.margin !== undefined;
}

function getSpacingDescription(spacing: NonNullable<LayoutAnalysisResult['spacing']>): string {
  const parts = [];
  if (spacing.gap !== undefined) parts.push(`间隔 ${spacing.gap}px`);
  if (spacing.padding !== undefined) parts.push(`内边距 ${spacing.padding}`);
  if (spacing.margin !== undefined) parts.push(`外边距 ${spacing.margin}`);
  return parts.join(', ');
}

function hasSizeInfo(size: LayoutAnalysisResult['size']): boolean {
  if (!size) return false;
  return (
    size.width !== undefined ||
    size.height !== undefined ||
    size.minWidth !== undefined ||
    size.maxWidth !== undefined ||
    size.minHeight !== undefined ||
    size.maxHeight !== undefined
  );
}

function getSizeDescription(size: NonNullable<LayoutAnalysisResult['size']>): string {
  const parts = [];
  if (size.width !== undefined) parts.push(`宽 ${size.width}`);
  if (size.height !== undefined) parts.push(`高 ${size.height}`);
  if (size.minWidth !== undefined) parts.push(`最小宽 ${size.minWidth}`);
  if (size.maxWidth !== undefined) parts.push(`最大宽 ${size.maxWidth}`);
  if (size.minHeight !== undefined) parts.push(`最小高 ${size.minHeight}`);
  if (size.maxHeight !== undefined) parts.push(`最大高 ${size.maxHeight}`);
  return parts.join(', ');
}

/**
 * 生成带自适应布局样式的 DOM 结构
 */
export function generateLayoutStructure(result: LayoutAnalysisResult): string {
  return `
<div class="layout-analysis">
  ${generateNode(result, 0)}
</div>

<style>
.layout-analysis {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.layout-node {
  margin: 4px 0;
  padding: 8px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
}

.layout-node:hover {
  border-color: #1890ff;
}

.layout-content {
  margin-left: 20px;
}

.layout-info {
  color: #666;
  margin: 4px 0;
}

.layout-type {
  color: #1890ff;
  font-weight: bold;
}

.layout-class {
  color: #52c41a;
}

.layout-props {
  color: #722ed1;
}

.layout-children {
  margin-left: 20px;
  padding-left: 10px;
  border-left: 2px solid #f0f0f0;
}
</style>`;
}

function generateNode(node: LayoutAnalysisResult, level: number): string {
  const indent = '  '.repeat(level);
  let output = `${indent}<div class="layout-node">`;

  // 组件标识
  output += '\n  ' + indent + '<div class="layout-content">';
  output += `\n    ${indent}<span class="layout-type">${node.elementType || 'div'}</span>`;
  if (node.className) {
    output += `\n    ${indent}<span class="layout-class">[${node.className}]</span>`;
  }

  // 布局信息
  if (node.type !== 'unknown') {
    output += `\n    ${indent}<div class="layout-info layout-props">`;
    output += `\n      ${indent}布局: ${getLayoutDescription(node)}`;
    output += '\n    ' + indent + '</div>';
  }

  // 间距信息
  if (node.spacing && hasSpacing(node.spacing)) {
    output += `\n    ${indent}<div class="layout-info">`;
    output += `\n      ${indent}间距: ${getSpacingDescription(node.spacing)}`;
    output += '\n    ' + indent + '</div>';
  }

  // 尺寸信息
  if (node.size && hasSizeInfo(node.size)) {
    output += `\n    ${indent}<div class="layout-info">`;
    output += `\n      ${indent}尺寸: ${getSizeDescription(node.size)}`;
    output += '\n    ' + indent + '</div>';
  }

  // 子元素
  if (node.children && node.children.count > 0) {
    output += `\n    ${indent}<div class="layout-children">`;
    node.children.items.forEach(child => {
      output += '\n' + generateNode(child, level + 2);
    });
    output += '\n    ' + indent + '</div>';
  }

  output += '\n  ' + indent + '</div>';
  output += '\n' + indent + '</div>';

  return output;
} 