
// Simple toast implementation since we removed sonner
let toastId = 0;

interface Toast {
  id: number;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts: Toast[] = [];
const listeners: (() => void)[] = [];

export const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
  info: (message: string) => console.log('Info:', message),
  warning: (message: string) => console.warn('Warning:', message),
};

export const useToast = () => {
  return {
    toast: (options: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
      console.log('Toast:', options);
    },
    toasts: [],
    dismiss: (id: number) => console.log('Dismiss toast:', id),
  };
};
