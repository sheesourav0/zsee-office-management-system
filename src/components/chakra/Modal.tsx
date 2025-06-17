
import { 
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogCloseTrigger
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  children: React.ReactNode;
  size?: string;
  [key: string]: any;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, open, isOpen, onOpenChange, onClose, size, ...props }, ref) => {
    const handleOpenChange = (details: any) => {
      if (onOpenChange) onOpenChange(details.open);
      if (!details.open && onClose) onClose();
    };

    return (
      <DialogRoot 
        open={open || isOpen} 
        onOpenChange={handleOpenChange}
        size={size}
        {...props}
      >
        <DialogBackdrop />
        <DialogContent ref={ref}>
          {children}
        </DialogContent>
      </DialogRoot>
    );
  }
);

export { DialogBackdrop as ModalOverlay };
export { DialogContent as ModalContent };
export { DialogHeader as ModalHeader };
export { DialogFooter as ModalFooter };
export { DialogBody as ModalBody };
export { DialogCloseTrigger as ModalCloseButton };

Modal.displayName = 'Modal';
