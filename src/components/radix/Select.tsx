
import * as React from "react";
import * as RadixUI from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = RadixUI.Select.Root;
const SelectGroup = RadixUI.Select.Group;
const SelectValue = RadixUI.Select.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof RadixUI.Select.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Select.Trigger>
>(({ className, children, ...props }, ref) => (
  <RadixUI.Select.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <RadixUI.Select.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </RadixUI.Select.Icon>
  </RadixUI.Select.Trigger>
));
SelectTrigger.displayName = RadixUI.Select.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof RadixUI.Select.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Select.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <RadixUI.Select.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </RadixUI.Select.ScrollUpButton>
));
SelectScrollUpButton.displayName = RadixUI.Select.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof RadixUI.Select.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Select.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <RadixUI.Select.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </RadixUI.Select.ScrollDownButton>
));
SelectScrollDownButton.displayName = RadixUI.Select.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof RadixUI.Select.Content>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Select.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <RadixUI.Select.Portal>
    <RadixUI.Select.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <RadixUI.Select.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </RadixUI.Select.Viewport>
      <SelectScrollDownButton />
    </RadixUI.Select.Content>
  </RadixUI.Select.Portal>
));
SelectContent.displayName = RadixUI.Select.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof RadixUI.Select.Label>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Select.Label>
>(({ className, ...props }, ref) => (
  <RadixUI.Select.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = RadixUI.Select.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixUI.Select.Item>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Select.Item>
>(({ className, children, ...props }, ref) => (
  <RadixUI.Select.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <RadixUI.Select.ItemIndicator>
        <Check className="h-4 w-4" />
      </RadixUI.Select.ItemIndicator>
    </span>

    <RadixUI.Select.ItemText>{children}</RadixUI.Select.ItemText>
  </RadixUI.Select.Item>
));
SelectItem.displayName = RadixUI.Select.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof RadixUI.Select.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixUI.Select.Separator>
>(({ className, ...props }, ref) => (
  <RadixUI.Select.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = RadixUI.Select.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
