
import { 
  Select as ChakraSelect,
  createListCollection
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface SelectProps {
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
  value?: string;
  className?: string;
  [key: string]: any;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ onValueChange, children, value, placeholder, ...props }, ref) => {
    // For simple cases, we'll use a native select for compatibility
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) onValueChange(e.target.value);
    };

    return (
      <select 
        ref={ref} 
        value={value} 
        onChange={handleChange}
        className="chakra-select"
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
    );
  }
);

export interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export const SelectTrigger = ({ children, className }: SelectTriggerProps) => {
  return <div className={className}>{children}</div>;
};

export interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <span>{placeholder}</span>;
};

export interface SelectContentProps {
  children: ReactNode;
}

export const SelectContent = ({ children }: SelectContentProps) => {
  return <>{children}</>;
};

export interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export const SelectItem = ({ value, children }: SelectItemProps) => {
  return <option value={value}>{children}</option>;
};

Select.displayName = "Select";
