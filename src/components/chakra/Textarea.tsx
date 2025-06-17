
import { Textarea as ChakraTextarea } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  [key: string]: any;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ ...props }, ref) => {
    return <ChakraTextarea ref={ref} {...props} />;
  }
);

Textarea.displayName = 'Textarea';
