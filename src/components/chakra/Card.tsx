
import { Card as ChakraCard } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraCard.Root ref={ref} {...props}>
        {children}
      </ChakraCard.Root>
    );
  }
);

export const CardHeader = ({ children, ...props }: CardProps) => (
  <ChakraCard.Header {...props}>{children}</ChakraCard.Header>
);

export const CardContent = ({ children, ...props }: CardProps) => (
  <ChakraCard.Body {...props}>{children}</ChakraCard.Body>
);

export const CardFooter = ({ children, ...props }: CardProps) => (
  <ChakraCard.Footer {...props}>{children}</ChakraCard.Footer>
);

export const CardTitle = ({ children, ...props }: CardProps) => (
  <ChakraCard.Title {...props}>{children}</ChakraCard.Title>
);

export const CardDescription = ({ children, ...props }: CardProps) => (
  <ChakraCard.Description {...props}>{children}</ChakraCard.Description>
);

Card.displayName = 'Card';
