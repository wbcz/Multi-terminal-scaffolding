import type { Product } from '@eleme/types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: '香辣鸡腿堡',
    price: 1500, // 15.00元
    stock: 100,
    category: ['food'],
    description: '美味的香辣鸡腿堡',
    status: 'on',
    createTime: '2024-01-20 10:00:00',
    updateTime: '2024-01-20 10:00:00'
  },
  {
    id: 2,
    name: '可乐',
    price: 500, // 5.00元
    stock: 200,
    category: ['drink'],
    description: '冰爽可乐',
    status: 'on',
    createTime: '2024-01-20 10:00:00',
    updateTime: '2024-01-20 10:00:00'
  },
  {
    id: 3,
    name: '薯条',
    price: 800, // 8.00元
    stock: 150,
    category: ['food', 'snack'],
    description: '黄金脆薯条',
    status: 'off',
    createTime: '2024-01-20 10:00:00',
    updateTime: '2024-01-20 10:00:00'
  }
]; 