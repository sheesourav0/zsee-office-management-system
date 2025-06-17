
import { Card as ChakraCard, CardBody, CardHeader, CardFooter, CardProps, BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraCard ref={ref} {...props}>
        {children}
      </ChakraCard>
    );
  }
);

export const CardContent = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardBody ref={ref} {...props}>
        {children}
      </CardBody>
    );
  }
);

export const CardHeader = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardHeader ref={ref} {...props}>
        {children}
      </CardHeader>
    );
  }
);

export const CardFooter = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardFooter ref={ref} {...props}>
        {children}
      </CardFooter>
    );
  }
);

export const CardTitle = forwardRef<HTMLHeadingElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <h3 ref={ref} style={{ fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.2' }} {...props}>
        {children}
      </h3>
    );
  }
);

export const CardDescription = forwardRef<HTMLParagraphElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <p ref={ref} style={{ fontSize: '0.875rem', color: 'gray.500' }} {...props}>
        {children}
      </p>
    );
  }
);

Card.displayName = 'Card';
CardContent.displayName = 'CardContent';
CardHeader.displayName = 'CardHeader';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
