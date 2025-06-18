
import {
  DialogRoot,
  DialogContent as ChakraDialogContent,
  DialogHeader as ChakraDialogHeader,
  DialogFooter as ChakraDialogFooter,
  DialogBody as ChakraDialogBody,
  DialogTitle as ChakraDialogTitle,
  DialogBackdrop,
  DialogCloseTrigger,
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onOpenChange, children, ...props }, ref) => {
    return (
      <DialogRoot open={open} onOpenChange={({ open }) => onOpenChange?.(open)} {...props}>
        <DialogBackdrop />
        <ChakraDialogContent ref={ref}>
          {children}
        </ChakraDialogContent>
      </DialogRoot>
    );
  }
);

export const DialogContent = forwardRef<HTMLDivElement, { 
  className?: string; 
  children: ReactNode;
}>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraDialogContent ref={ref} className={className} {...props}>
        <DialogCloseTrigger />
        {children}
      </ChakraDialogContent>
    );
  }
);

export const DialogHeader = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraDialogHeader ref={ref} {...props}>
        {children}
      </ChakraDialogHeader>
    );
  }
);

export const DialogTitle = forwardRef<HTMLHeadingElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <ChakraDialogTitle ref={ref}>{children}</ChakraDialogTitle>;
  }
);

export const DialogBody = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraDialogBody ref={ref} {...props}>
        {children}
      </ChakraDialogBody>
    );
  }
);

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogBody.displayName = "DialogBody";
