import { AutoLayoutProps } from '../AutoLayout';

export type AutoLayoutConfig = Partial<
  Pick<
    AutoLayoutProps,
    | 'direction'
    | 'spacing'
    | 'fill'
    | 'justify'
    | 'align'
    | 'wrap'
    | 'padding'
    | 'minWidth'
    | 'maxWidth'
  >
>;

export const defaultAutoLayoutConfig: AutoLayoutConfig = {
  direction: 'horizontal',
  spacing: 16,
  fill: false,
  justify: 'start',
  align: 'start',
  wrap: false,
};

// 预设配置
export const presets = {
  // 表单布局预设
  form: {
    direction: 'vertical',
    spacing: 24,
    align: 'stretch',
  } as AutoLayoutConfig,

  // 卡片组布局预设
  cardGroup: {
    direction: 'horizontal',
    spacing: 16,
    wrap: true,
  } as AutoLayoutConfig,

  // 按钮组布局预设
  buttonGroup: {
    direction: 'horizontal',
    spacing: 8,
    justify: 'center',
  } as AutoLayoutConfig,

  // 列表布局预设
  list: {
    direction: 'vertical',
    spacing: 8,
    align: 'stretch',
  } as AutoLayoutConfig,

  // 网格布局预设
  grid: {
    direction: 'horizontal',
    spacing: 16,
    wrap: true,
    justify: 'space-between',
  } as AutoLayoutConfig,
} as const; 