
import { Badge as ChakraBadge } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'subtle';
  className?: string;
  [key: string]: any;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'solid', ...props }, ref) => {
    return (
      <ChakraBadge ref={ref} variant={variant} {...props}>
        {children}
      </ChakraBadge>
    );
  }
);

Badge.displayName = 'Badge';
