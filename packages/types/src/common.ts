// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应数据
export interface PaginationData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API 响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role: string;
  permissions: string[];
  createTime: string;
  updateTime: string;
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResult {
  token: string;
  userInfo: UserInfo;
} 