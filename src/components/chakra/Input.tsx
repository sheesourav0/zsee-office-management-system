
import { Input as ChakraInput } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface InputProps {
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  [key: string]: any;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    return <ChakraInput ref={ref} {...props} />;
  }
);

Input.displayName = 'Input';
