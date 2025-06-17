
import { Textarea as ChakraTextarea, TextareaProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <ChakraTextarea
        ref={ref}
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.400' }}
        _focus={{ borderColor: 'primary.500', boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)' }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
