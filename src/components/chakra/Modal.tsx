
import { 
  DialogRoot as ChakraDialogRoot,
  DialogContent as ChakraDialogContent,
  DialogHeader as ChakraDialogHeader,
  DialogBody as ChakraDialogBody,
  DialogFooter as ChakraDialogFooter,
  DialogTitle as ChakraDialogTitle,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface ModalChildProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onOpenChange, children, className, ...props }, ref) => {
    return (
      <ChakraDialogRoot open={open} onOpenChange={({ open }) => onOpenChange(open)} ref={ref} className={className} {...props}>
        {children}
      </ChakraDialogRoot>
    );
  }
);

export const ModalContent = forwardRef<HTMLDivElement, ModalChildProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraDialogContent ref={ref} className={className} {...props}>
        {children}
      </ChakraDialogContent>
    );
  }
);

export const ModalHeader = forwardRef<HTMLDivElement, ModalChildProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraDialogHeader ref={ref} className={className} {...props}>
        {children}
      </ChakraDialogHeader>
    );
  }
);

export const ModalBody = forwardRef<HTMLDivElement, ModalChildProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraDialogBody ref={ref} className={className} {...props}>
        {children}
      </ChakraDialogBody>
    );
  }
);

export const ModalFooter = forwardRef<HTMLDivElement, ModalChildProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraDialogFooter ref={ref} className={className} {...props}>
        {children}
      </ChakraDialogFooter>
    );
  }
);

export const ModalTitle = forwardRef<HTMLDivElement, ModalChildProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraDialogTitle ref={ref} className={className} {...props}>
        {children}
      </ChakraDialogTitle>
    );
  }
);

Modal.displayName = 'Modal';
ModalContent.displayName = 'ModalContent';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ModalTitle.displayName = 'ModalTitle';
