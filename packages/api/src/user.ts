import { http } from '@eleme/shared';
import type { User, ApiResponse, PageResult } from '@eleme/types';

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortField?: string;
  sortOrder?: string;
}

interface UpdateUserStatusParams {
  userId: number;
  status: 'active' | 'disabled';
}

export const userApi = {
  // 获取用户列表
  getUsers: (params: GetUsersParams) =>
    http.get<ApiResponse<PageResult<User>>>('/api/admin/users', { params }),

  // 更新用户状态
  updateStatus: (params: UpdateUserStatusParams) =>
    http.put<ApiResponse<null>>(`/api/admin/users/${params.userId}/status`, {
      status: params.status
    }),

  // 获取用户详情
  getUser: (id: number) =>
    http.get<ApiResponse<User>>(`/api/admin/users/${id}`),
}; 