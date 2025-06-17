
import { ProgressBar } from '@chakra-ui/react';
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
      <ProgressBar.Root ref={ref} value={value} {...props}>
        <ProgressBar.Track>
          <ProgressBar.Range className={indicatorClassName} />
        </ProgressBar.Track>
      </ProgressBar.Root>
    );
  }
);

Progress.displayName = 'Progress';
