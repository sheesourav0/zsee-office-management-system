
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CheckboxProps {
  children?: React.ReactNode;
  checked?: boolean;
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  [key: string]: any;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, checked, isChecked, onChange, onCheckedChange, ...props }, ref) => {
    const handleChange = (details: any) => {
      const isChecked = details.checked;
      if (onChange) onChange(isChecked);
      if (onCheckedChange) onCheckedChange(isChecked);
    };

    return (
      <ChakraCheckbox.Root
        ref={ref}
        checked={checked || isChecked}
        onCheckedChange={handleChange}
        {...props}
      >
        <ChakraCheckbox.HiddenInput />
        <ChakraCheckbox.Control>
          <ChakraCheckbox.Indicator />
        </ChakraCheckbox.Control>
        {children && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
      </ChakraCheckbox.Root>
    );
  }
);

Checkbox.displayName = 'Checkbox';
