import { JSBridge } from './core/bridge';
export * from './types';

export const createJSBridge = JSBridge.getInstance;

// 预设一些常用的方法名
export const BridgeMethods = {
  // 导航相关
  NAVIGATE: 'navigate',
  NAVIGATE_BACK: 'navigateBack',
  
  // 设备信息
  GET_DEVICE_INFO: 'getDeviceInfo',
  GET_NETWORK_TYPE: 'getNetworkType',
  
  // 存储相关
  GET_STORAGE: 'getStorage',
  SET_STORAGE: 'setStorage',
  REMOVE_STORAGE: 'removeStorage',
  
  // 分享
  SHARE: 'share',
  
  // 支付
  PAY: 'pay',
  
  // 扫码
  SCAN: 'scan',
  
  // 定位
  GET_LOCATION: 'getLocation',
  
  // 图片相关
  CHOOSE_IMAGE: 'chooseImage',
  PREVIEW_IMAGE: 'previewImage',
  
  // 剪贴板
  GET_CLIPBOARD: 'getClipboard',
  SET_CLIPBOARD: 'setClipboard',
} as const; 