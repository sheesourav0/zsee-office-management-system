
import { Checkbox as ChakraCheckbox, CheckboxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    return (
      <ChakraCheckbox
        ref={ref}
        colorScheme="primary"
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
