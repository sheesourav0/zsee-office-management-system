
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogTitle,
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
        <DialogContent ref={ref}>
          {children}
        </DialogContent>
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
      <DialogContent ref={ref} className={className} {...props}>
        <DialogCloseTrigger />
        {children}
      </DialogContent>
    );
  }
);

export const DialogHeader = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return (
      <DialogHeader ref={ref} {...props}>
        {children}
      </DialogHeader>
    );
  }
);

export const DialogTitle = forwardRef<HTMLHeadingElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <DialogTitle ref={ref}>{children}</DialogTitle>;
  }
);

export const DialogBody = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return (
      <DialogBody ref={ref} {...props}>
        {children}
      </DialogBody>
    );
  }
);

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogBody.displayName = "DialogBody";
