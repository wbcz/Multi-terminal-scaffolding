import React, { useState } from 'react';
import { Card, Table, Button, Space, Form, Input, Select, InputNumber, Modal, message } from 'antd';
import { useTable, useForm, useRequest } from '@eleme/hooks';
import type { Product } from '@eleme/types';
import { productApi } from '@eleme/api';

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  category: string[];
  description: string;
  status: 'on' | 'off';
}

export default function ProductManagement() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 商品列表
  const { tableProps, refresh } = useTable<Product>({
    defaultPageSize: 10,
    fetchData: async (params) => {
      const res = await productApi.getProducts(params);
      return {
        data: res.list,
        total: res.total
      };
    }
  });

  // 商品表单
  const { formProps, submit, reset } = useForm<ProductFormData>({
    defaultValues: editingProduct || {
      name: '',
      price: 0,
      stock: 0,
      category: [],
      description: '',
      status: 'on'
    },
    // 提交前转换数据
    transform: (values) => ({
      ...values,
      price: Number(values.price) * 100, // 转换为分
    }),
    // 提交处理
    onSubmit: async (values) => {
      if (editingProduct?.id) {
        await productApi.updateProduct(editingProduct.id, values);
      } else {
        await productApi.createProduct(values);
      }
      message.success(editingProduct ? '更新成功' : '创建成功');
      setModalVisible(false);
      refresh();
    }
  });

  // 更新商品状态
  const { run: updateStatus } = useRequest(productApi.updateStatus, {
    manual: true,
    onSuccess: () => {
      message.success('状态更新成功');
      refresh();
    }
  });

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 200
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 120,
      render: (price: number) => `¥${(price / 100).toFixed(2)}`
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ color: status === 'on' ? '#52c41a' : '#ff4d4f' }}>
          {status === 'on' ? '上架' : '下架'}
        </span>
      )
    },
    {
      title: '操作',
      width: 200,
      render: (_, record: Product) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingProduct(record);
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type={record.status === 'on' ? 'default' : 'primary'}
            danger={record.status === 'on'}
            onClick={() => updateStatus({
              productId: record.id,
              status: record.status === 'on' ? 'off' : 'on'
            })}
          >
            {record.status === 'on' ? '下架' : '上架'}
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="商品管理">
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditingProduct(null);
          setModalVisible(true);
        }}
      >
        新增商品
      </Button>

      <Table<Product>
        {...tableProps}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title={editingProduct ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={submit}
        onCancel={() => {
          setModalVisible(false);
          reset();
        }}
        width={600}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[
              { required: true, message: '请输入价格' },
              { type: 'number', min: 0, message: '价格必须大于0' }
            ]}
          >
            <InputNumber
              prefix="￥"
              style={{ width: '100%' }}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="库存"
            rules={[
              { required: true, message: '请输入库存' },
              { type: 'number', min: 0, message: '库存必须大于0' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
          >
            <Select
              mode="multiple"
              options={[
                { label: '食品', value: 'food' },
                { label: '饮料', value: 'drink' },
                { label: '零食', value: 'snack' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="商品描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
} 