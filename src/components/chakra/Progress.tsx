
import { Progress as ChakraProgress } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface CustomProgressProps {
  value?: number;
  size?: string;
  className?: string;
  indicatorClassName?: string;
  [key: string]: any;
}

export const Progress = forwardRef<HTMLDivElement, CustomProgressProps>(
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

Progress.displayName = "Progress";
