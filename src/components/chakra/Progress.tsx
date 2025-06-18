
import { Progress as ChakraProgress, ProgressProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface CustomProgressProps extends ProgressProps {
  indicatorClassName?: string;
}

export const Progress = forwardRef<HTMLDivElement, CustomProgressProps>(
  ({ indicatorClassName, ...props }, ref) => {
    return <ChakraProgress ref={ref} {...props} />;
  }
);

Progress.displayName = "Progress";
