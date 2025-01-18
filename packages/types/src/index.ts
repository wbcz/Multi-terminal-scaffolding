export * from './common'; 

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  status: 'active' | 'disabled';
  createTime: string;
}

// 商品相关类型
export interface Product {
  id: number;
  name: string;
  price: number; // 以分为单位
  stock: number;
  category: string[];
  description: string;
  status: 'on' | 'off';
  createTime: string;
  updateTime: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  pageSize: number;
  current: number;
} 