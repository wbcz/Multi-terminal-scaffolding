import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseRequestOptions<TData, TParams> {
  manual?: boolean;
  defaultParams?: TParams;
  defaultData?: TData;
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (error: Error, params: TParams) => void;
  formatResult?: (res: Awaited<TData>) => TData;
}

export function useRequest<TData = unknown, TParams = unknown>(
  service: (params: TParams) => Promise<TData>,
  options: UseRequestOptions<TData, TParams> = {}
) {
  const {
    manual = false,
    defaultParams,
    defaultData,
    onSuccess,
    onError,
    formatResult,
  } = options;

  const [data, setData] = useState<TData | undefined>(defaultData);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState<Error>();

  const mountedRef = useRef(true);
  const countRef = useRef(0);
  const serviceRef = useRef(service);

  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(
    async (params: TParams = defaultParams as TParams) => {
      setLoading(true);
      setError(undefined);

      const count = ++countRef.current;

      try {
        const rawResponse = await serviceRef.current(params);
        
        if (!mountedRef.current || count !== countRef.current) {
          return;
        }

        const response = formatResult ? formatResult(rawResponse) : rawResponse as TData;

        setData(response);
        onSuccess?.(response, params);
        return response;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        
        if (!mountedRef.current || count !== countRef.current) {
          return;
        }

        setError(error);
        onError?.(error, params);
        throw error;
      } finally {
        if (mountedRef.current && count === countRef.current) {
          setLoading(false);
        }
      }
    },
    [defaultParams, formatResult, onSuccess, onError]
  );

  const refresh = useCallback(() => {
    if (!defaultParams) return Promise.reject(new Error('No params found'));
    return run(defaultParams);
  }, [run, defaultParams]);

  useEffect(() => {
    if (!manual) {
      run(defaultParams as TParams);
    }
  }, [manual, defaultParams, run]);

  const mutate = useCallback(
    (newData: TData | ((oldData: TData | undefined) => TData)) => {
      setData(typeof newData === 'function' ? (newData as Function)(data) : newData);
    },
    [data]
  );

  return {
    data,
    error,
    loading,
    run,
    refresh,
    mutate,
  };
} 