
import { Box, BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box 
        ref={ref} 
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        {...props}
      >
        {children}
      </Box>
    );
  }
);

export const CardContent = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} p={6} {...props}>
        {children}
      </Box>
    );
  }
);

export const CardHeader = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} p={6} pb={4} {...props}>
        {children}
      </Box>
    );
  }
);

export const CardFooter = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} p={6} pt={4} {...props}>
        {children}
      </Box>
    );
  }
);

export const CardTitle = forwardRef<HTMLHeadingElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box as="h3" ref={ref} fontSize="lg" fontWeight="600" lineHeight="1.2" {...props}>
        {children}
      </Box>
    );
  }
);

export const CardDescription = forwardRef<HTMLParagraphElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box as="p" ref={ref} fontSize="sm" color="gray.500" {...props}>
        {children}
      </Box>
    );
  }
);

Card.displayName = 'Card';
CardContent.displayName = 'CardContent';
CardHeader.displayName = 'CardHeader';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
