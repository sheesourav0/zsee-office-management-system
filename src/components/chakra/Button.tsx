
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  leftIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ loading, disabled, children, leftIcon, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        disabled={disabled || loading}
        loading={loading}
        {...props}
      >
        {leftIcon && <span style={{ marginRight: '8px' }}>{leftIcon}</span>}
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";
