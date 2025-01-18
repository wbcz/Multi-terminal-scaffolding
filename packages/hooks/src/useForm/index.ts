import { useCallback, useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';

export interface UseFormOptions<T = Record<string, unknown>> {
  defaultValues?: Partial<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  onError?: (error: Error | unknown) => void;
  transform?: (values: Partial<T>) => T;
  validateOnMount?: boolean;
}

export function useForm<T = Record<string, unknown>>({
  defaultValues,
  onSubmit,
  onError,
  transform,
  validateOnMount = false,
}: UseFormOptions<T> = {}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 重置表单
  const reset = useCallback(() => {
    form.resetFields();
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  }, [form, defaultValues]);

  // 提交处理
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const transformedValues = transform ? transform(values) : values as T;
      await onSubmit?.(transformedValues);
    } catch (error) {
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [form, onSubmit, onError, transform]);

  // 设置表单值
  const setValues = useCallback(
    (values: Partial<T>) => {
      form.setFieldsValue(values as Record<string, unknown>);
    },
    [form]
  );

  // 获取表单值
  const getValues = useCallback(
    (nameList?: Array<keyof T>) => {
      return form.getFieldsValue(nameList as string[]) as Partial<T>;
    },
    [form]
  );

  // 表单验证
  const validate = useCallback(
    async (nameList?: Array<keyof T>) => {
      try {
        return await form.validateFields(nameList as string[]) as T;
      } catch (error) {
        onError?.(error);
        throw error;
      }
    },
    [form, onError]
  );

  return {
    form,
    loading,
    reset,
    setValues,
    getValues,
    validate,
    submit: handleSubmit,
    formProps: {
      form,
      initialValues: defaultValues,
      onFinish: handleSubmit,
    },
  };
} 