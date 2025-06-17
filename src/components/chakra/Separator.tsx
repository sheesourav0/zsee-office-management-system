
import { Separator as ChakraSeparator } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  [key: string]: any;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', ...props }, ref) => {
    return <ChakraSeparator ref={ref} orientation={orientation} {...props} />;
  }
);

Separator.displayName = 'Separator';
