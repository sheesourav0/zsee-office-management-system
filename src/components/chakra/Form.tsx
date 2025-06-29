
import { 
  Field,
  Box,
  BoxProps
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export const FormControl = forwardRef<HTMLDivElement, BoxProps & { isInvalid?: boolean }>(
  ({ isInvalid, children, ...props }, ref) => {
    return (
      <Field.Root ref={ref} invalid={isInvalid} {...props}>
        {children}
      </Field.Root>
    );
  }
);

export const FormLabel = forwardRef<HTMLLabelElement, { children: ReactNode; className?: string; [key: string]: any }>(
  ({ children, ...props }, ref) => {
    return <Field.Label ref={ref} {...props}>{children}</Field.Label>;
  }
);

export const FormErrorMessage = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return <Field.ErrorText ref={ref} {...props}>{children}</Field.ErrorText>;
  }
);

export const FormHelperText = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return <Field.HelperText ref={ref} {...props}>{children}</Field.HelperText>;
  }
);

export const FormDescription = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, ...props }, ref) => {
    return <Field.HelperText ref={ref} {...props}>{children}</Field.HelperText>;
  }
);

export interface FormFieldProps extends BoxProps {
  children?: ReactNode;
  control?: any;
  name?: string;
  render?: any;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, control, name, render, ...props }, ref) => {
    if (render && control && name) {
      return (
        <Field.Root ref={ref} {...props}>
          {render({ field: { name, value: "", onChange: () => {} } })}
        </Field.Root>
      );
    }
    return (
      <Field.Root ref={ref} {...props}>
        {children}
      </Field.Root>
    );
  }
);

export interface FormItemProps extends BoxProps {}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <Field.Root ref={ref} mb={4} {...props}>
        {children}
      </Field.Root>
    );
  }
);

export interface FormMessageProps extends BoxProps {}

export const FormMessage = forwardRef<HTMLDivElement, FormMessageProps>(
  ({ children, ...props }, ref) => {
    return <Field.ErrorText ref={ref} {...props}>{children}</Field.ErrorText>;
  }
);

export interface FormProps extends BoxProps {}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, ...props }, ref) => {
    return <Box ref={ref} as="form" {...props}>{children}</Box>;
  }
);

FormControl.displayName = "FormControl";
FormLabel.displayName = "FormLabel";
FormErrorMessage.displayName = "FormErrorMessage";
FormHelperText.displayName = "FormHelperText";
FormDescription.displayName = "FormDescription";
FormField.displayName = "FormField";
FormItem.displayName = "FormItem";
FormMessage.displayName = "FormMessage";
Form.displayName = "Form";
