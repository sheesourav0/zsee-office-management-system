
import { Box, BoxProps, Heading, Text } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface CardProps extends BoxProps {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        shadow="sm"
        {...props}
      >
        {children}
      </Box>
    );
  }
);

export interface CardHeaderProps extends BoxProps {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} p={6} pb={0} {...props}>
        {children}
      </Box>
    );
  }
);

export interface CardContentProps extends BoxProps {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} p={6} pt={0} {...props}>
        {children}
      </Box>
    );
  }
);

export interface CardTitleProps extends BoxProps {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <Heading ref={ref} size="lg" mb={2} {...props}>
        {children}
      </Heading>
    );
  }
);

export interface CardDescriptionProps extends BoxProps {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <Text ref={ref} color="gray.600" {...props}>
        {children}
      </Text>
    );
  }
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
