
import { Alert as ChakraAlert } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { forwardRef } from 'react';

interface AlertProps {
  children: React.ReactNode;
  status?: 'info' | 'warning' | 'success' | 'error';
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, status = 'info', ...props }, ref) => {
    return (
      <ChakraAlert.Root ref={ref} status={status} {...props}>
        <ChakraAlert.Indicator>
          <InfoIcon />
        </ChakraAlert.Indicator>
        <ChakraAlert.Content>
          {children}
        </ChakraAlert.Content>
      </ChakraAlert.Root>
    );
  }
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <ChakraAlert.Description>{children}</ChakraAlert.Description>;
};

Alert.displayName = 'Alert';
