// 导入必要的 React hooks 和类型定义
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { SelectProps, Option, SelectState } from './types';

// 定义 useSelect hook 返回的接口
interface UseSelectReturn extends SelectState {
  // 获取触发器(按钮)属性
  getToggleProps: () => {
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  // 获取选项属性
  getOptionProps: (option: Option, index: number) => {
    onClick: () => void;
    onMouseEnter: () => void;
    role: string;
    'aria-selected': boolean;
  };
  // 获取菜单属性
  getMenuProps: () => {
    role: string;
    'aria-hidden': boolean;
  };
}

// 自定义 Hook: useSelect
// 实现 Select 组件的核心逻辑,返回状态和行为方法
export function useSelect({
  options,
  value,
  onChange,
  disabled = false
}: SelectProps): UseSelectReturn {
  // 管理组件内部状态
  const [state, setState] = useState<SelectState>({
    isOpen: false, // 下拉菜单是否打开
    selectedOption: options.find(opt => opt.value === value), // 当前选中项
    highlightedIndex: -1 // 当前高亮项的索引
  });
  
  // 用于检测点击外部关闭下拉菜单
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // 处理点击组件外部事件
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setState(prev => ({ ...prev, isOpen: false }));
    }
  }, []);
  
  // 添加和清理点击外部的事件监听
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  
  // 处理选项选择
  const handleSelect = useCallback((option: Option) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setState(prev => ({
      ...prev,
      selectedOption: option,
      isOpen: false
    }));
  }, [onChange]);
  
  // 处理键盘事件
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'ArrowDown': // 向下箭头：移动高亮到下一项
        event.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: prev.highlightedIndex < options.length - 1 
            ? prev.highlightedIndex + 1 
            : prev.highlightedIndex
        }));
        break;
      case 'ArrowUp': // 向上箭头：移动高亮到上一项
        event.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: prev.highlightedIndex > 0 
            ? prev.highlightedIndex - 1 
            : prev.highlightedIndex
        }));
        break;
      case 'Enter': // 回车：选中当前高亮项或打开下拉菜单
        event.preventDefault();
        if (state.isOpen && state.highlightedIndex >= 0) {
          handleSelect(options[state.highlightedIndex]);
        } else {
          setState(prev => ({ ...prev, isOpen: true }));
        }
        break;
      case 'Escape': // ESC：关闭下拉菜单
        event.preventDefault();
        setState(prev => ({ ...prev, isOpen: false }));
        break;
    }
  }, [disabled, handleSelect, options, state.highlightedIndex, state.isOpen]);
  
  // 返回状态和行为方法
  return {
    ...state,
    getToggleProps: () => ({
      onClick: () => !disabled && setState(prev => ({ ...prev, isOpen: !prev.isOpen })),
      onKeyDown: handleKeyDown
    }),

    getOptionProps: (option: Option, index: number) => ({
      onClick: () => handleSelect(option),
      onMouseEnter: () => setState(prev => ({ ...prev, highlightedIndex: index })),
      role: 'option',
      'aria-selected': option.value === value
    }),
    getMenuProps: () => ({
      role: 'listbox',
      'aria-hidden': !state.isOpen
    })
  };
}

// Headless Select 组件
// 提供基础的 UI 结构和交互逻辑,样式由使用者自定义
export const HeadlessSelect: React.FC<SelectProps & { className?: string }> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  className
}) => {
  // 使用 useSelect hook 获取状态和行为方法
  const {
    isOpen,
    selectedOption,
    highlightedIndex,
    getToggleProps,
    getOptionProps,
    getMenuProps
  } = useSelect({
    options,
    value,
    onChange,
    disabled
  });
  
  return (
    <div className={className}>
      <button {...getToggleProps()}>
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      
      {isOpen && (
        <ul {...getMenuProps()}>
          {options.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              style={{
                backgroundColor: highlightedIndex === index ? '#f5f5f5' : undefined,
                fontWeight: option.value === value ? 'bold' : undefined
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 