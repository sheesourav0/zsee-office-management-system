
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CheckboxProps {
  children?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  [key: string]: any;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ children, checked, onChange, ...props }, ref) => {
    const handleChange = (details: any) => {
      const isChecked = details.checked;
      if (onChange) onChange(isChecked);
    };

    return (
      <ChakraCheckbox.Root
        ref={ref}
        checked={checked}
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
