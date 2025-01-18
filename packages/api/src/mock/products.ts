import type { Product } from '@eleme/types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: '商品1',
    price: 100,
    stock: 100,
    status: 'on',
    category: ['食品', '零食'],
    description: '这是一个测试商品',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    name: '商品2',
    price: 200,
    stock: 200,
    status: 'off',
    category: ['饮料', '酒水'],
    description: '这是另一个测试商品',
    createTime: '2024-01-02 00:00:00',
    updateTime: '2024-01-02 00:00:00',
  },
]; 