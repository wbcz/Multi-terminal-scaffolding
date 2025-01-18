import { mockProducts } from './products';
import type { Product, ApiResponse, PageResult } from '@eleme/types';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // 获取商品列表
  async getProducts(params: any): Promise<ApiResponse<PageResult<Product>>> {
    await delay(500); // 模拟网络延迟
    
    let filteredProducts = [...mockProducts];
    
    // 处理搜索
    if (params.keyword) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.includes(params.keyword) || 
        p.description.includes(params.keyword)
      );
    }

    // 处理状态筛选
    if (params.status && params.status !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.status === params.status);
    }

    // 处理分页
    const pageSize = params.pageSize || 10;
    const current = params.page || 1;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredProducts.slice(start, end);

    return {
      code: 0,
      message: 'success',
      data: {
        list,
        total: filteredProducts.length,
        pageSize,
        current
      }
    };
  },

  // 更新商品状态
  async updateStatus(params: { productId: number; status: 'on' | 'off' }): Promise<ApiResponse<null>> {
    await delay(500);
    
    const product = mockProducts.find(p => p.id === params.productId);
    if (product) {
      product.status = params.status;
    }

    return {
      code: 0,
      message: 'success',
      data: null
    };
  },

  // 创建商品
  async createProduct(data: Omit<Product, 'id' | 'createTime' | 'updateTime'>): Promise<ApiResponse<Product>> {
    await delay(500);
    
    const newProduct: Product = {
      ...data,
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    mockProducts.push(newProduct);

    return {
      code: 0,
      message: 'success',
      data: newProduct
    };
  },

  // 更新商品
  async updateProduct(id: number, data: Partial<Product>): Promise<ApiResponse<Product>> {
    await delay(500);
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('商品不存在');
    }

    Object.assign(product, data, {
      updateTime: new Date().toISOString()
    });

    return {
      code: 0,
      message: 'success',
      data: product
    };
  }
}; 