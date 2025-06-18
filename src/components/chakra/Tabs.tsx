
import {
  Tabs as ChakraTabs,
  TabsProps,
  TabList as ChakraTabList,
  TabListProps,
  Tab as ChakraTab,
  TabProps,
  TabPanels as ChakraTabPanels,
  TabPanelsProps,
  TabPanel as ChakraTabPanel,
  TabPanelProps
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface CustomTabsProps extends Omit<TabsProps, 'value' | 'onChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, CustomTabsProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    return (
      <ChakraTabs ref={ref} index={0} {...props}>
        {children}
      </ChakraTabs>
    );
  }
);

export const TabsList = forwardRef<HTMLDivElement, TabListProps & { className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTabList ref={ref} className={className} {...props}>
        {children}
      </ChakraTabList>
    );
  }
);

export interface TabsTriggerProps extends TabProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <ChakraTab ref={ref} className={className} {...props}>
        {children}
      </ChakraTab>
    );
  }
);

export const TabsContent = forwardRef<HTMLDivElement, TabPanelProps & { value: string; className?: string }>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <ChakraTabPanel ref={ref} className={className} {...props}>
        {children}
      </ChakraTabPanel>
    );
  }
);

export const TabList = ChakraTabList;
export const Tab = ChakraTab;
export const TabPanels = ChakraTabPanels;
export const TabPanel = ChakraTabPanel;

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
