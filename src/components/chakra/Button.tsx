
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  leftIcon?: ReactNode;
  isLoading?: boolean;
  children: ReactNode;
  [key: string]: any;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ loading, isLoading, disabled, children, leftIcon, ...props }, ref) => {
    const isLoadingState = loading || isLoading;

    return (
      <ChakraButton
        ref={ref}
        disabled={disabled || isLoadingState}
        loading={isLoadingState}
        {...props}
      >
        {leftIcon && <span style={{ marginRight: '8px' }}>{leftIcon}</span>}
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";
