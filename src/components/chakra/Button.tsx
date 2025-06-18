
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ loading, disabled, children, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        disabled={disabled || loading}
        loading={loading}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";
