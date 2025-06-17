
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface SelectProps {
  children: React.ReactNode;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  [key: string]: any;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, placeholder, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(event);
      if (onValueChange) onValueChange(event.target.value);
    };

    return (
      <NativeSelectRoot>
        <NativeSelectField
          ref={ref}
          placeholder={placeholder}
          onChange={handleChange}
          {...props}
        >
          {children}
        </NativeSelectField>
      </NativeSelectRoot>
    );
  }
);

// For compatibility with shadcn/ui patterns
export const SelectTrigger = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, ...props }, ref) => {
    return (
      <NativeSelectRoot>
        <NativeSelectField ref={ref} {...props}>
          {children}
        </NativeSelectField>
      </NativeSelectRoot>
    );
  }
);

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <option value="" disabled>{placeholder}</option>;
};

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return <option value={value}>{children}</option>;
};

Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
