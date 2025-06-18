
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  leftIcon?: ReactNode;
  isLoading?: boolean;
  variant?: "outline" | "solid" | "ghost" | "subtle" | "surface" | "plain";
  to?: string;
  as?: any;
  [key: string]: any;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ loading, isLoading, disabled, children, leftIcon, variant, ...props }, ref) => {
    const isLoadingState = loading || isLoading;
    
    // Map old variants to new ones
    const mappedVariant = variant === "secondary" ? "outline" : 
                         variant === "destructive" ? "solid" :
                         variant === "default" ? "solid" : variant;

    return (
      <ChakraButton
        ref={ref}
        disabled={disabled || isLoadingState}
        loading={isLoadingState}
        variant={mappedVariant}
        {...props}
      >
        {leftIcon && <span style={{ marginRight: '8px' }}>{leftIcon}</span>}
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";
