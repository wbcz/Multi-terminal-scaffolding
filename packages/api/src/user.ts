import { http } from '@eleme/utils';
import type { User, ApiResponse } from '@eleme/types';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export const userApi = {
  login(params: LoginParams) {
    return http.post<LoginResult>('/api/login', params);
  },

  getCurrentUser() {
    return http.get<User>('/api/user/current');
  },

  updateProfile(data: Partial<User>) {
    return http.put<User>('/api/user/profile', data);
  },

  logout() {
    return http.post<void>('/api/logout');
  },
}; 