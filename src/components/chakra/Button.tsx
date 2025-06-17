
import { Button as ChakraButton } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CustomButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'solid', size = 'md', children, loading, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        size={size}
        loading={loading}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';
