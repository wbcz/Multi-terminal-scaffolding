import { useState, useCallback, useMemo } from 'react';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export interface UseTableOptions<T = any> {
  defaultPageSize?: number;
  defaultParams?: Partial<TableParams>;
  onParamsChange?: (params: TableParams) => void;
  fetchData?: (params: TableParams) => Promise<{ data: T[]; total: number }>;
}

export function useTable<T = any>({
  defaultPageSize = 10,
  defaultParams = {},
  onParamsChange,
  fetchData,
}: UseTableOptions<T> = {}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [params, setParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: defaultPageSize,
      ...defaultParams.pagination,
    },
    ...defaultParams,
  });

  const fetch = useCallback(async (newParams: TableParams = params) => {
    if (!fetchData) return;
    
    setLoading(true);
    try {
      const { data: newData, total } = await fetchData(newParams);
      setData(newData);
      setParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total,
        },
      }));
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, params]);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue>,
      sorter: SorterResult<T> | SorterResult<T>[]
    ) => {
      const newParams: TableParams = {
        pagination,
        filters,
        sortField: Array.isArray(sorter) ? undefined : sorter.field as string,
        sortOrder: Array.isArray(sorter) ? undefined : sorter.order as string,
      };

      setParams(newParams);
      onParamsChange?.(newParams);
      fetch(newParams);
    },
    [fetch, onParamsChange]
  );

  const tableProps = useMemo(
    () => ({
      dataSource: data,
      loading,
      pagination: params.pagination,
      onChange: handleTableChange,
    }),
    [data, loading, params.pagination, handleTableChange]
  );

  return {
    tableProps,
    loading,
    data,
    params,
    refresh: () => fetch(params),
    setData,
  };
} 