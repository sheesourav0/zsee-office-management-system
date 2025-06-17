
import { Select as ChakraSelect, SelectProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    return (
      <ChakraSelect
        ref={ref}
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.400' }}
        _focus={{ borderColor: 'primary.500', boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)' }}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';
