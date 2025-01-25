import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd/es/table';
import type { Key } from 'react';

export interface CrossPageTableProps<T> extends Omit<TableProps<T>, 'rowSelection'> {
  /** 选中项的 key 数组 */
  selectedKeys?: Key[];
  /** 选中项变化时的回调 */
  onSelectedChange?: (selectedKeys: Key[]) => void;
  /** 当前页数据总数 */
  total: number;
  /** 是否默认选中当前页所有数据 */
  defaultSelectAll?: boolean;
}

/**
 * 跨分页选择表格组件
 * 支持跨分页选择和数据回显
 */
export function CrossPageTable<T extends { id: Key }>({
  selectedKeys: propSelectedKeys,
  onSelectedChange,
  columns,
  dataSource,
  pagination,
  total,
  defaultSelectAll = false,
  ...restProps
}: CrossPageTableProps<T>) {
  // 内部维护选中项状态
  const [selectedKeys, setSelectedKeys] = useState<Key[]>(propSelectedKeys || []);
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);

  // 处理外部选中项变化
  useEffect(() => {
    if (propSelectedKeys) {
      setSelectedKeys(propSelectedKeys);
    }
  }, [propSelectedKeys]);

  // 处理选中项变化
  const handleSelect = useCallback((record: T, selected: boolean) => {
    const newSelectedKeys = selected
      ? [...selectedKeys, record.id]
      : selectedKeys.filter(key => key !== record.id);
    
    setSelectedKeys(newSelectedKeys);
    onSelectedChange?.(newSelectedKeys);
  }, [selectedKeys, onSelectedChange]);

  // 处理全选/取消全选
  const handleSelectAll = useCallback((selected: boolean, selectedRows: T[]) => {
    // 获取当前页所有数据的 key
    const currentPageKeys = dataSource?.map(item => item.id) || [];
    
    // 如果是全选，将当前页所有未选中的 key 添加到选中列表
    // 如果是取消全选，将当前页所有已选中的 key 从选中列表中移除
    const newSelectedKeys = selected
      ? [...new Set([...selectedKeys, ...currentPageKeys])]
      : selectedKeys.filter(key => !currentPageKeys.includes(key));

    setSelectedKeys(newSelectedKeys);
    onSelectedChange?.(newSelectedKeys);
  }, [selectedKeys, onSelectedChange, dataSource]);

  // 处理分页变化
  const handlePageChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);  
    
    if (pagination && typeof pagination === 'object' && pagination.onChange) {
      pagination.onChange(page, size);
    }
  }, [pagination]);

  // 计算当前页选中状态
  const getCheckboxProps = useCallback((record: T) => ({
    checked: selectedKeys.includes(record.id),
    onChange: (e: any) => handleSelect(record, e.target.checked)
  }), [selectedKeys, handleSelect]);

  // 处理反选
  const handleInvert = useCallback(() => {
    if (!dataSource) return;

    const currentPageKeys = dataSource.map(item => item.id);
    const newSelectedKeys = [...selectedKeys];

    currentPageKeys.forEach(key => {
      const index = newSelectedKeys.indexOf(key);
      if (index > -1) {
        newSelectedKeys.splice(index, 1);
      } else {
        newSelectedKeys.push(key);
      }
    });

    setSelectedKeys(newSelectedKeys);
    onSelectedChange?.(newSelectedKeys);
  }, [dataSource, selectedKeys, onSelectedChange]);

  return (
    <div>
      {selectedKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          已选择 <span style={{ color: '#1890ff' }}>{selectedKeys.length}</span> 项
          <a
            style={{ marginLeft: 8 }}
            onClick={() => {
              setSelectedKeys([]);
              onSelectedChange?.([]);
            }}
          >
            清空
          </a>
        </div>
      )}
      <Table<T>
        {...restProps}
        columns={columns}
        dataSource={dataSource}
        pagination={
          pagination === false
            ? false
            : {
                ...(typeof pagination === 'object' ? pagination : {}),
                total,
                current: currentPage,
                pageSize,
                onChange: handlePageChange
              }
        }
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onSelect: handleSelect,
          onSelectAll: handleSelectAll,
          getCheckboxProps,
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE
          ]
        }}
      />
    </div>
  );
}