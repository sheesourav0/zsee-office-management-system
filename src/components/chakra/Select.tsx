
import { 
  Select as ChakraSelect,
  SelectContent as ChakraSelectContent,
  SelectItem as ChakraSelectItem,
  SelectTrigger as ChakraSelectTrigger,
  SelectValueText
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface SelectProps {
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  className?: string;
  [key: string]: any;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ onValueChange, children, value, defaultValue, placeholder, ...props }, ref) => {
    return (
      <ChakraSelect.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={({ value }) => onValueChange?.(value)}
        {...props}
      >
        {children}
      </ChakraSelect.Root>
    );
  }
);

export interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraSelect.Trigger ref={ref} {...props}>
        {children}
      </ChakraSelect.Trigger>
    );
  }
);

export interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <SelectValueText placeholder={placeholder} />;
};

export interface SelectContentProps {
  children: ReactNode;
}

export const SelectContent = ({ children }: SelectContentProps) => {
  return <ChakraSelect.Content>{children}</ChakraSelect.Content>;
};

export interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export const SelectItem = ({ value, children }: SelectItemProps) => {
  return <ChakraSelect.Item item={value}>{children}</ChakraSelect.Item>;
};

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
