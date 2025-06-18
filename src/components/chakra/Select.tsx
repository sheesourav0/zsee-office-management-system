
import { 
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface SelectProps extends ChakraSelectProps {
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ onValueChange, onChange, children, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(e);
      if (onValueChange) onValueChange(e.target.value);
    };

    return (
      <ChakraSelect ref={ref} onChange={handleChange} {...props}>
        {children}
      </ChakraSelect>
    );
  }
);

export interface SelectTriggerProps {
  children: ReactNode;
}

export const SelectTrigger = ({ children }: SelectTriggerProps) => {
  return <>{children}</>;
};

export interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <option value="" disabled>{placeholder}</option>;
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
