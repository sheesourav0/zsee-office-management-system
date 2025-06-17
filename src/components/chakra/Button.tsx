
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'solid', size = 'md', children, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';
