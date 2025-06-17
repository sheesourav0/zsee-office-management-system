
import { Button as ChakraButton } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CustomButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactElement;
  isLoading?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'solid', size = 'md', children, leftIcon, isLoading, loading, ...props }, ref) => {
    return (
      <ChakraButton.Root
        ref={ref}
        variant={variant}
        size={size}
        loading={isLoading || loading}
        {...props}
      >
        {leftIcon && <ChakraButton.Icon>{leftIcon}</ChakraButton.Icon>}
        {children}
      </ChakraButton.Root>
    );
  }
);

Button.displayName = 'Button';
