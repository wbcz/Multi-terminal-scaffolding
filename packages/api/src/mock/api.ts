import type { Product, ApiResponse, PageResult } from '@eleme/types';
import { mockProducts } from './products';

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

export const mockApi = {
  getProducts: (params: GetProductsParams): ApiResponse<PageResult<Product>> => {
    const { page = 1, pageSize = 10 } = params;
    const total = mockProducts.length;
    const list = mockProducts.slice((page - 1) * pageSize, page * pageSize);

    return {
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        pageSize,
        current: page,
      },
    };
  },

  createProduct: (data: Omit<Product, 'id' | 'createTime' | 'updateTime'>): ApiResponse<Product> => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: mockProducts.length + 1,
      createTime: now,
      updateTime: now,
    };
    mockProducts.push(newProduct);
    return {
      code: 0,
      message: 'success',
      data: newProduct,
    };
  },

  updateProduct: (id: number, data: Partial<Product>): ApiResponse<Product> => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Product not found',
        data: null as any,
      };
    }

    const now = new Date().toISOString();
    const updatedProduct: Product = {
      ...mockProducts[index],
      ...data,
      updateTime: now,
    };
    mockProducts[index] = updatedProduct;

    return {
      code: 0,
      message: 'success',
      data: updatedProduct,
    };
  },

  updateStatus: (params: UpdateProductStatusParams): ApiResponse<null> => {
    const { productId, status } = params;
    const index = mockProducts.findIndex(p => p.id === productId);
    if (index === -1) {
      return {
        code: 404,
        message: 'Product not found',
        data: null,
      };
    }

    mockProducts[index].status = status;
    return {
      code: 0,
      message: 'success',
      data: null,
    };
  },
}; 