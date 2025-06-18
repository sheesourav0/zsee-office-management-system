
import {
  Tabs as ChakraTabs
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface CustomTabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const Tabs = forwardRef<HTMLDivElement, CustomTabsProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    return (
      <ChakraTabs.Root ref={ref} value={value} onValueChange={onValueChange} {...props}>
        {children}
      </ChakraTabs.Root>
    );
  }
);

export const TabsList = forwardRef<HTMLDivElement, { 
  children: ReactNode; 
  className?: string; 
}>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTabs.List ref={ref} className={className} {...props}>
        {children}
      </ChakraTabs.List>
    );
  }
);

export interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <ChakraTabs.Trigger ref={ref} value={value} className={className} {...props}>
        {children}
      </ChakraTabs.Trigger>
    );
  }
);

export const TabsContent = forwardRef<HTMLDivElement, { 
  value: string; 
  className?: string; 
  children: ReactNode;
}>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <ChakraTabs.Content ref={ref} value={value} className={className} {...props}>
        {children}
      </ChakraTabs.Content>
    );
  }
);

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
