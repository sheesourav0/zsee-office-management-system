
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CustomButtonProps extends ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
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
