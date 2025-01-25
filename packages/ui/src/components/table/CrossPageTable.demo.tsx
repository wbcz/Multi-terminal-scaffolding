import React, { useState } from 'react';
import { CrossPageTable } from './CrossPageTable';
import type { Key } from 'react';

interface DataItem {
  id: number;
  name: string;
  age: number;
  address: string;
}

// 模拟数据生成
const generateData = (page: number, pageSize: number): DataItem[] => {
  const offset = (page - 1) * pageSize;
  return Array.from({ length: pageSize }, (_, index) => ({
    id: offset + index + 1,
    name: `用户 ${offset + index + 1}`,
    age: Math.floor(Math.random() * 50) + 20,
    address: `地址 ${offset + index + 1}`
  }));
};

export default function CrossPageTableDemo() {
  // 选中的 keys
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);
  // 总数据量
  const total = 100;

  // 列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    }
  ];

  // 处理分页变化
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 处理选中变化
  const handleSelectedChange = (newSelectedKeys: Key[]) => {
    setSelectedKeys(newSelectedKeys);
    console.log('选中项变化:', newSelectedKeys);
  };

  return (
    <div>
      <h2>跨分页选择表格示例</h2>
      <CrossPageTable<DataItem>
        columns={columns}
        dataSource={generateData(currentPage, pageSize)}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`
        }}
        total={total}
        selectedKeys={selectedKeys}
        onSelectedChange={handleSelectedChange}
        rowKey="id"
      />

      <div style={{ marginTop: 16 }}>
        <h3>当前选中项：</h3>
        <pre>{JSON.stringify(selectedKeys, null, 2)}</pre>
      </div>
    </div>
  );
} 