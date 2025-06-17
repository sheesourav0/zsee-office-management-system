
import * as React from "react";
import * as RadixUI from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixUI.Checkbox.Root>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Checkbox.Root>
>(({ className, ...props }, ref) => (
  <RadixUI.Checkbox.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <RadixUI.Checkbox.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </RadixUI.Checkbox.Indicator>
  </RadixUI.Checkbox.Root>
));
Checkbox.displayName = RadixUI.Checkbox.Root.displayName;

export { Checkbox };
