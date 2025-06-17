
import { 
  Card as ChakraCard,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraCard.Root ref={ref} className={className} {...props}>
        {children}
      </ChakraCard.Root>
    );
  }
);

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraCard.Header ref={ref} className={className} {...props}>
        {children}
      </ChakraCard.Header>
    );
  }
);

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraCard.Body ref={ref} className={className} {...props}>
        {children}
      </ChakraCard.Body>
    );
  }
);

export const CardTitle = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraCard.Title ref={ref} className={className} {...props}>
        {children}
      </ChakraCard.Title>
    );
  }
);

export const CardDescription = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraCard.Description ref={ref} className={className} {...props}>
        {children}
      </ChakraCard.Description>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
