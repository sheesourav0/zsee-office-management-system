
import * as React from "react";
import * as RadixUI from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = RadixUI.DropdownMenu.Root;
const DropdownMenuTrigger = RadixUI.DropdownMenu.Trigger;
const DropdownMenuGroup = RadixUI.DropdownMenu.Group;
const DropdownMenuPortal = RadixUI.DropdownMenu.Portal;
const DropdownMenuSub = RadixUI.DropdownMenu.Sub;
const DropdownMenuRadioGroup = RadixUI.DropdownMenu.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <RadixUI.DropdownMenu.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </RadixUI.DropdownMenu.SubTrigger>
));
DropdownMenuSubTrigger.displayName = RadixUI.DropdownMenu.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.SubContent>
>(({ className, ...props }, ref) => (
  <RadixUI.DropdownMenu.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = RadixUI.DropdownMenu.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <RadixUI.DropdownMenu.Portal>
    <RadixUI.DropdownMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </RadixUI.DropdownMenu.Portal>
));
DropdownMenuContent.displayName = RadixUI.DropdownMenu.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <RadixUI.DropdownMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = RadixUI.DropdownMenu.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <RadixUI.DropdownMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <RadixUI.DropdownMenu.ItemIndicator>
        <Check className="h-4 w-4" />
      </RadixUI.DropdownMenu.ItemIndicator>
    </span>
    {children}
  </RadixUI.DropdownMenu.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = RadixUI.DropdownMenu.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <RadixUI.DropdownMenu.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <RadixUI.DropdownMenu.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </RadixUI.DropdownMenu.ItemIndicator>
    </span>
    {children}
  </RadixUI.DropdownMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = RadixUI.DropdownMenu.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <RadixUI.DropdownMenu.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = RadixUI.DropdownMenu.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof RadixUI.DropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixUI.DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <RadixUI.DropdownMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = RadixUI.DropdownMenu.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
