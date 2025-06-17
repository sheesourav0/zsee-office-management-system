
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface SelectProps {
  children: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  [key: string]: any;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, placeholder, ...props }, ref) => {
    return (
      <NativeSelectRoot>
        <NativeSelectField
          ref={ref}
          placeholder={placeholder}
          {...props}
        >
          {children}
        </NativeSelectField>
      </NativeSelectRoot>
    );
  }
);

Select.displayName = 'Select';
