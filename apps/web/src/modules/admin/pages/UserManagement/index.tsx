import React from 'react';
import { Card, Table, Button, Space, Form, Input, Select, DatePicker, message } from 'antd';
import { useTable, useForm, useRequest } from '@wbcz/hooks';
import type { User } from '@eleme/types';
import { userApi } from '@wbcz/api';

const { RangePicker } = DatePicker;

export default function UserManagement() {
  // 搜索表单
  const { formProps, getValues: getSearchValues } = useForm({
    defaultValues: {
      keyword: '',
      status: 'all',
      dateRange: []
    }
  });

  // 用户列表
  const { tableProps, refresh } = useTable<User>({
    defaultPageSize: 20,
    fetchData: async (params) => {
      const searchValues = getSearchValues();
      const res = await userApi.getUsers({
        ...params,
        keyword: searchValues.keyword,
        status: searchValues.status,
        startDate: searchValues.dateRange?.[0],
        endDate: searchValues.dateRange?.[1]
      });
      return {
        data: res.list,
        total: res.total
      };
    }
  });

  // 更新用户状态
  const { run: updateUserStatus, loading: updating } = useRequest(
    userApi.updateStatus,
    {
      manual: true,
      onSuccess: () => {
        message.success('状态更新成功');
        refresh();
      }
    }
  );

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      width: 80
    },
    {
      title: '用户名',
      dataIndex: 'username',
      sorter: true
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        { text: '活跃', value: 'active' },
        { text: '禁用', value: 'disabled' }
      ],
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
          {status === 'active' ? '活跃' : '禁用'}
        </span>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      sorter: true
    },
    {
      title: '操作',
      width: 200,
      render: (_, record: User) => (
        <Space>
          <Button
            type={record.status === 'active' ? 'default' : 'primary'}
            danger={record.status === 'active'}
            onClick={() => updateUserStatus({
              userId: record.id,
              status: record.status === 'active' ? 'disabled' : 'active'
            })}
            loading={updating}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button type="link" onClick={() => window.open(`/admin/users/${record.id}`)}>
            查看详情
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="用户管理">
      <Form {...formProps} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="keyword">
          <Input.Search
            placeholder="搜索用户名/邮箱"
            style={{ width: 200 }}
            onSearch={() => refresh()}
          />
        </Form.Item>
        <Form.Item name="status">
          <Select
            style={{ width: 120 }}
            options={[
              { label: '全部状态', value: 'all' },
              { label: '活跃', value: 'active' },
              { label: '禁用', value: 'disabled' }
            ]}
          />
        </Form.Item>
        <Form.Item name="dateRange">
          <RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => refresh()}>
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table<User>
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
      />
    </Card>
  );
} 