
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactElement;
  isLoading?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'solid', size = 'md', children, leftIcon, isLoading, loading, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        size={size}
        leftIcon={leftIcon}
        isLoading={isLoading || loading}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';
