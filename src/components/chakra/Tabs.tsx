
import { 
  Tabs as ChakraTabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  TabsProps 
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTabs ref={ref} {...props}>
        {children}
      </ChakraTabs>
    );
  }
);

export { TabList, TabPanels, Tab, TabPanel };

Tabs.displayName = 'Tabs';
