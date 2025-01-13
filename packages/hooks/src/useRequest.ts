import { useState, useCallback } from 'react';
import type { ApiResponse } from '@eleme/types';

interface RequestOptions<TData, TParams> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  defaultParams?: TParams;
}

export function useRequest<TData = any, TParams = void>(
  requestFn: (params: TParams) => Promise<ApiResponse<TData>>,
  options: RequestOptions<TData, TParams> = {}
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (params: TParams = options.defaultParams as TParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await requestFn(params);
        setData(response.data);
        options.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [requestFn, options]
  );

  return {
    data,
    loading,
    error,
    run,
  };
} 