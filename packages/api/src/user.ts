import { http } from '@wbcz/utils';
import type { User, ApiResponse, PageResult } from '@wbcz/types';

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

type UserApi = {
  getUsers: (params: GetUsersParams) => Promise<ApiResponse<PageResult<User>>>;
  updateStatus: (params: UpdateUserStatusParams) => Promise<ApiResponse<null>>;
  getUser: (id: number) => Promise<ApiResponse<User>>;
};

export const userApi: UserApi = {
  // 获取用户列表
  getUsers: async (params: GetUsersParams) => {
    const res = await http.get<ApiResponse<PageResult<User>>>('/api/admin/users', { params });
    return res.data;
  },

  // 更新用户状态
  updateStatus: async (params: UpdateUserStatusParams) => {
    const res = await http.put<ApiResponse<null>>(`/api/admin/users/${params.userId}/status`, {
      status: params.status
    });
    return res.data;
  },

  // 获取用户详情
  getUser: async (id: number) => {
    const res = await http.get<ApiResponse<User>>(`/api/admin/users/${id}`);
    return res.data;
  },
}; 