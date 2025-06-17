
import { Input as ChakraInput, InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <ChakraInput
        ref={ref}
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.400' }}
        _focus={{ borderColor: 'primary.500', boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)' }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
