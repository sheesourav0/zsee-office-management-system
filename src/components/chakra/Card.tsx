
import { Card as ChakraCard, CardBody, CardHeader, CardFooter } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
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

export interface CardContentProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardBody ref={ref} {...props}>
        {children}
      </CardBody>
    );
  }
);

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardHeader ref={ref} {...props}>
        {children}
      </CardHeader>
    );
  }
);

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardFooter ref={ref} {...props}>
        {children}
      </CardFooter>
    );
  }
);

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraCard.Title ref={ref} {...props}>
        {children}
      </ChakraCard.Title>
    );
  }
);

export interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraCard.Description ref={ref} {...props}>
        {children}
      </ChakraCard.Description>
    );
  }
);

Card.displayName = "Card";
CardContent.displayName = "CardContent";
CardHeader.displayName = "CardHeader";
CardFooter.displayName = "CardFooter";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
