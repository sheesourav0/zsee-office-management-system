
import { 
  Tabs as ChakraTabs
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  [key: string]: any;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, defaultValue, value, onValueChange, ...props }, ref) => {
    return (
      <ChakraTabs.Root 
        ref={ref} 
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        {...props}
      >
        {children}
      </ChakraTabs.Root>
    );
  }
);

export const TabList = forwardRef<HTMLDivElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTabs.List ref={ref} {...props}>
        {children}
      </ChakraTabs.List>
    );
  }
);

export const TabPanels = forwardRef<HTMLDivElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

export const Tab = forwardRef<HTMLButtonElement, any>(
  ({ children, value, ...props }, ref) => {
    return (
      <ChakraTabs.Trigger ref={ref} value={value} {...props}>
        {children}
      </ChakraTabs.Trigger>
    );
  }
);

export const TabPanel = forwardRef<HTMLDivElement, any>(
  ({ children, value, ...props }, ref) => {
    return (
      <ChakraTabs.Content ref={ref} value={value} {...props}>
        {children}
      </ChakraTabs.Content>
    );
  }
);

Tabs.displayName = 'Tabs';
