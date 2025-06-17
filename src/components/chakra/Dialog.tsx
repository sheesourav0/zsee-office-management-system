
import { 
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogCloseTrigger,
  DialogTitle,
  DialogDescription
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  [key: string]: any;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ children, open, onOpenChange, ...props }, ref) => {
    const handleOpenChange = (details: any) => {
      if (onOpenChange) onOpenChange(details.open);
    };

    return (
      <DialogRoot 
        open={open} 
        onOpenChange={handleOpenChange}
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

export { DialogHeader, DialogFooter, DialogBody, DialogCloseTrigger, DialogTitle, DialogDescription };
export const DialogContent = DialogContent;
export const DialogTrigger = ({ children }: { children: React.ReactNode }) => children;

Dialog.displayName = 'Dialog';
