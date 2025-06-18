
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CheckboxProps {
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  [key: string]: any;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ children, checked, onCheckedChange, ...props }, ref) => {
    return (
      <ChakraCheckbox.Root
        ref={ref}
        checked={checked}
        onCheckedChange={({ checked }) => onCheckedChange?.(checked)}
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
