
import { Badge as ChakraBadge, BadgeProps } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface CustomBadgeProps extends Omit<BadgeProps, 'variant'> {
  children: ReactNode;
  variant?: "outline" | "solid" | "subtle" | "surface" | "plain" | "secondary" | "default" | "destructive";
  colorScheme?: string;
  className?: string;
  [key: string]: any;
}

export const Badge = forwardRef<HTMLSpanElement, CustomBadgeProps>(
  ({ children, variant = "subtle", colorScheme, ...props }, ref) => {
    // Map old variants to new valid ones
    const mappedVariant = variant === "secondary" ? "subtle" : 
                         variant === "default" ? "solid" :
                         variant === "destructive" ? "solid" : variant;

    return (
      <ChakraBadge
        ref={ref}
        variant={mappedVariant as "outline" | "solid" | "subtle" | "surface" | "plain"}
        colorScheme={colorScheme}
        {...props}
      >
        {children}
      </ChakraBadge>
    );
  }
);

Badge.displayName = "Badge";
