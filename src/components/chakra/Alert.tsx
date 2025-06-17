
import { Alert as ChakraAlert, AlertProps } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { forwardRef } from 'react';

export const Alert = forwardRef<HTMLDivElement, AlertProps & { children: React.ReactNode }>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraAlert ref={ref} {...props}>
        <InfoIcon />
        {children}
      </ChakraAlert>
    );
  }
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

Alert.displayName = 'Alert';
