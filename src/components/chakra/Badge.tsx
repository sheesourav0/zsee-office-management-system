
import { Badge as ChakraBadge, BadgeProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CustomBadgeProps extends BadgeProps {
  variant?: 'solid' | 'outline' | 'subtle';
}

export const Badge = forwardRef<HTMLSpanElement, CustomBadgeProps>(
  ({ variant = 'solid', children, ...props }, ref) => {
    return (
      <ChakraBadge
        ref={ref}
        variant={variant}
        {...props}
      >
        {children}
      </ChakraBadge>
    );
  }
);

Badge.displayName = 'Badge';
