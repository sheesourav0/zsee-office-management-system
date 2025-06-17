
import { Field } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface FormItemProps {
  children: React.ReactNode;
  invalid?: boolean;
  [key: string]: any;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ children, invalid, ...props }, ref) => {
    return (
      <Field.Root ref={ref} invalid={invalid} {...props}>
        {children}
      </Field.Root>
    );
  }
);

export const FormField = ({ children, ...props }: any) => {
  return children(props);
};

export const FormControl = FormItem;
export const FormLabel = ({ children, ...props }: any) => (
  <Field.Label {...props}>{children}</Field.Label>
);
export const FormMessage = ({ children, ...props }: any) => (
  <Field.ErrorText {...props}>{children}</Field.ErrorText>
);
export const FormErrorMessage = FormMessage;

FormItem.displayName = 'FormItem';
