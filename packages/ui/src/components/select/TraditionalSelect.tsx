import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SelectProps, Option } from './types';

const SelectWrapper = styled.div`
  position: relative;
  width: 200px;
`;

const SelectButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    border-color: #40a9ff;
  }
  
  ${props => props.isOpen && `
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  `}
`;

const DropdownList = styled.ul<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 4px 0;
  padding: 4px 0;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  list-style: none;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const Option = styled.li<{ isHighlighted?: boolean; isSelected?: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
  
  ${props => props.isHighlighted && `
    background: #f5f5f5;
  `}
  
  ${props => props.isSelected && `
    background: #e6f7ff;
    font-weight: 500;
  `}
`;

export const TraditionalSelect: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  
  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  };
  
  return (
    <SelectWrapper ref={wrapperRef}>
      <SelectButton
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        isOpen={isOpen}
        disabled={disabled}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </SelectButton>
      
      <DropdownList isOpen={isOpen}>
        {options.map((option, index) => (
          <Option
            key={option.value}
            onClick={() => handleSelect(option)}
            isHighlighted={index === highlightedIndex}
            isSelected={option.value === value}
          >
            {option.label}
          </Option>
        ))}
      </DropdownList>
    </SelectWrapper>
  );
}; 