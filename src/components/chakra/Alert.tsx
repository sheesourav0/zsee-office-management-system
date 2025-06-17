
import { Alert as ChakraAlert, AlertIcon, AlertProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraAlert ref={ref} {...props}>
        <AlertIcon />
        {children}
      </ChakraAlert>
    );
  }
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

Alert.displayName = 'Alert';
