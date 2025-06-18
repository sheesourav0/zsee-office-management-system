
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface DialogProps extends Omit<ModalProps, 'children'> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onOpenChange, children, isOpen, onClose, ...props }, ref) => {
    const handleClose = () => {
      if (onClose) onClose();
      if (onOpenChange) onOpenChange(false);
    };

    return (
      <Modal isOpen={open || isOpen || false} onClose={handleClose} {...props}>
        <ModalOverlay />
        <ModalContent ref={ref}>
          {children}
        </ModalContent>
      </Modal>
    );
  }
);

export const DialogContent = forwardRef<HTMLDivElement, ModalContentProps & { className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <ModalContent ref={ref} className={className} {...props}>
        <ModalCloseButton />
        {children}
      </ModalContent>
    );
  }
);

export const DialogHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <ModalHeader ref={ref} {...props}>
        {children}
      </ModalHeader>
    );
  }
);

export const DialogTitle = forwardRef<HTMLHeadingElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <span ref={ref}>{children}</span>;
  }
);

export const DialogBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, ...props }, ref) => {
    return (
      <ModalBody ref={ref} {...props}>
        {children}
      </ModalBody>
    );
  }
);

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogBody.displayName = "DialogBody";
