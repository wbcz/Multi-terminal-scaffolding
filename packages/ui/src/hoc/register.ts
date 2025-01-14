import React from 'react';
import { withRecursiveAutoLayout, WithRecursiveAutoLayoutProps } from './withRecursiveAutoLayout';
import { AutoLayoutConfig } from './config';

export interface RegisterOptions {
  /**
   * 组件名称前缀
   * @default 'AutoLayout'
   */
  prefix?: string;

  /**
   * 默认配置
   */
  defaultConfig?: AutoLayoutConfig;

  /**
   * 是否默认启用递归
   * @default false
   */
  defaultRecursive?: boolean;

  /**
   * 需要排除的组件类型
   */
  excludeComponents?: React.ComponentType[];
}

type EnhancedComponentProps<P> = P & WithRecursiveAutoLayoutProps;

/**
 * 批量注册组件
 * @param components 需要注册的组件
 * @param options 注册选项
 */
export function registerAutoLayoutComponents<
  T extends Record<string, React.ComponentType<any>>
>(
  components: T,
  options: RegisterOptions = {}
): Record<string, React.ForwardRefExoticComponent<any>> {
  const {
    prefix = 'AutoLayout',
    defaultConfig = {},
    defaultRecursive = false,
    excludeComponents = [],
  } = options;

  return Object.entries(components).reduce((acc, [name, Component]) => {
    // 创建增强组件
    const EnhancedComponent = React.memo(withRecursiveAutoLayout(Component));

    // 创建预配置的组件
    const PresetComponent = React.forwardRef<
      any,
      EnhancedComponentProps<React.ComponentProps<typeof Component>>
    >((props, ref) => {
      const combinedProps = {
        ...defaultConfig,
        ...props,
        ref,
        enableAutoLayout: true,
        recursive: defaultRecursive,
        excludeComponents,
      };

      return React.createElement(EnhancedComponent, combinedProps);
    });

    // 设置显示名称
    PresetComponent.displayName = `${prefix}${name}`;

    // 添加到结果对象
    acc[`${prefix}${name}`] = PresetComponent;

    return acc;
  }, {} as Record<string, React.ForwardRefExoticComponent<any>>);
}

/**
 * 创建预设组件
 * @param Component 原始组件
 * @param config 预设配置
 */
export function createPresetComponent<P extends object>(
  Component: React.ComponentType<P>,
  config: Partial<AutoLayoutConfig> = {}
): React.ForwardRefExoticComponent<P & WithRecursiveAutoLayoutProps> {
  const EnhancedComponent = withRecursiveAutoLayout(Component);

  return React.forwardRef<any, P & WithRecursiveAutoLayoutProps>((props, ref) => {
    const combinedProps = {
      ...config,
      ...props,
      ref,
      enableAutoLayout: true,
    };

    return React.createElement(EnhancedComponent, combinedProps);
  });
} 