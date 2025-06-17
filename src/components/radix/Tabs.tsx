
import * as React from "react";
import * as RadixUI from "radix-ui";
import { cn } from "@/lib/utils";

const Tabs = RadixUI.Tabs.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixUI.Tabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Tabs.List>
>(({ className, ...props }, ref) => (
  <RadixUI.Tabs.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = RadixUI.Tabs.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixUI.Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Tabs.Trigger>
>(({ className, ...props }, ref) => (
  <RadixUI.Tabs.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = RadixUI.Tabs.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixUI.Tabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Tabs.Content>
>(({ className, ...props }, ref) => (
  <RadixUI.Tabs.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = RadixUI.Tabs.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
