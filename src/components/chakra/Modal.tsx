
import { 
  Modal as ChakraModal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  ModalProps 
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraModal {...props}>
        <ModalOverlay />
        <ModalContent ref={ref}>
          {children}
        </ModalContent>
      </ChakraModal>
    );
  }
);

export { ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton };

Modal.displayName = 'Modal';
