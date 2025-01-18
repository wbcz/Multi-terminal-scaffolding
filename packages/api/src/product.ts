import type { Product, ApiResponse, PageResult } from '@eleme/types';
import { mockApi } from '../../../apps/web/src/modules/merchant/mock/api';

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  category?: string[];
  sortField?: string;
  sortOrder?: string;
}

interface UpdateProductStatusParams {
  productId: number;
  status: 'on' | 'off';
}

export const productApi = {
  // 获取商品列表
  getProducts: (params: GetProductsParams) =>
    mockApi.getProducts(params),

  // 创建商品
  createProduct: (data: Omit<Product, 'id' | 'createTime' | 'updateTime'>) =>
    mockApi.createProduct(data),

  // 更新商品
  updateProduct: (id: number, data: Partial<Product>) =>
    mockApi.updateProduct(id, data),

  // 更新商品状态
  updateStatus: (params: UpdateProductStatusParams) =>
    mockApi.updateStatus(params),

  // 获取商品详情
  getProduct: (id: number) =>
    Promise.resolve({
      code: 0,
      message: 'success',
      data: mockApi.getProducts({ page: 1, pageSize: 1 }).then(res => 
        res.data.list.find(p => p.id === id)
      )
    } as ApiResponse<Product>),
}; 