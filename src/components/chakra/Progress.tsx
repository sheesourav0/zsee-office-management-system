
import { Progress as ChakraProgress } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
  [key: string]: any;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, indicatorClassName, ...props }, ref) => {
    return (
      <ChakraProgress.Root ref={ref} value={value} {...props}>
        <ChakraProgress.Track>
          <ChakraProgress.Range className={indicatorClassName} />
        </ChakraProgress.Track>
      </ChakraProgress.Root>
    );
  }
);

Progress.displayName = 'Progress';
