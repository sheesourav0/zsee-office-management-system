
import {
  Dialog as ChakraDialog,
  DialogContent as ChakraDialogContent,
  DialogHeader as ChakraDialogHeader,
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
      <ChakraDialog.Root open={open} onOpenChange={({ open }) => onOpenChange?.(open)} {...props}>
        <DialogBackdrop />
        <ChakraDialogContent ref={ref}>
          {children}
        </ChakraDialogContent>
      </ChakraDialog.Root>
    );
  }
);

export const DialogContent = forwardRef<HTMLDivElement, { 
  className?: string; 
  children: ReactNode;
  maxW?: string;
  maxH?: string;
  overflowY?: string;
  [key: string]: any;
}>(
  ({ children, className, maxW, maxH, overflowY, ...props }, ref) => {
    const style = {
      ...(maxW && { maxWidth: maxW }),
      ...(maxH && { maxHeight: maxH }),
      ...(overflowY && { overflowY: overflowY as any })
    };
    
    return (
      <ChakraDialogContent ref={ref} className={className} style={style} {...props}>
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

export const DialogFooter = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={`flex justify-end gap-2 p-4 ${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
);

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogBody.displayName = "DialogBody";
DialogFooter.displayName = "DialogFooter";
