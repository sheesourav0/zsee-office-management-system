
import { Field } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  [key: string]: any;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref) => {
    return (
      <Field.Label
        ref={ref}
        fontWeight="medium"
        fontSize="sm"
        {...props}
      >
        {children}
      </Field.Label>
    );
  }
);

Label.displayName = 'Label';
