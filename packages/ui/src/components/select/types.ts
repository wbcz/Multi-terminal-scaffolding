export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  options: Option[];
  value?: Option['value'];
  onChange?: (value: Option['value']) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface SelectState {
  isOpen: boolean;
  selectedOption?: Option;
  highlightedIndex: number;
} 