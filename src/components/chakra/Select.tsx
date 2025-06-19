
import { 
  Select as ChakraSelect,
  createListCollection
} from "@chakra-ui/react";
import { forwardRef, ReactNode, useMemo } from "react";

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
    // Create a simple collection for basic select functionality
    const collection = useMemo(() => {
      return createListCollection({
        items: [
          { label: placeholder || "Select option", value: "" }
        ]
      });
    }, [placeholder]);

    return (
      <ChakraSelect.Root
        ref={ref}
        value={value ? [value] : defaultValue ? [defaultValue] : []}
        onValueChange={({ value }) => onValueChange?.(value[0])}
        collection={collection}
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
  return <ChakraSelect.ValueText placeholder={placeholder} />;
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
  return (
    <ChakraSelect.Item item={{ label: children as string, value }}>
      {children}
    </ChakraSelect.Item>
  );
};

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
