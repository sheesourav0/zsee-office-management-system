
import { FormLabel, FormLabelProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Label = forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    return (
      <FormLabel
        ref={ref}
        fontWeight="medium"
        fontSize="sm"
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';
