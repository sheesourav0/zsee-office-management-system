
import * as React from "react";
import * as RadixUI from "radix-ui";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof RadixUI.Progress.Root>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Progress.Root> & {
    indicatorClassName?: string;
  }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <RadixUI.Progress.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <RadixUI.Progress.Indicator
      className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </RadixUI.Progress.Root>
));
Progress.displayName = RadixUI.Progress.Root.displayName;

export { Progress };
