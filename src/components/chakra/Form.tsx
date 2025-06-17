
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const FormItem = forwardRef<HTMLDivElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <FormControl ref={ref} {...props}>
        {children}
      </FormControl>
    );
  }
);

export const FormField = ({ children, ...props }: any) => {
  return children(props);
};

export const FormControl_ = FormControl;
export const FormLabel_ = FormLabel;
export const FormMessage = FormErrorMessage;

FormItem.displayName = 'FormItem';
