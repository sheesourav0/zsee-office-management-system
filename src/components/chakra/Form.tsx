
import { 
  Box, 
  BoxProps, 
  FormControl as ChakraFormControl,
  FormControlProps,
  FormLabel as ChakraFormLabel,
  FormLabelProps,
  FormErrorMessage as ChakraFormErrorMessage,
  FormErrorMessageProps,
  FormHelperText as ChakraFormHelperText,
  FormHelperTextProps
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  (props, ref) => {
    return <ChakraFormControl ref={ref} {...props} />;
  }
);

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    return <ChakraFormLabel ref={ref} {...props} />;
  }
);

export const FormErrorMessage = forwardRef<HTMLDivElement, FormErrorMessageProps>(
  (props, ref) => {
    return <ChakraFormErrorMessage ref={ref} {...props} />;
  }
);

export const FormHelperText = forwardRef<HTMLDivElement, FormHelperTextProps>(
  (props, ref) => {
    return <ChakraFormHelperText ref={ref} {...props} />;
  }
);

export interface FormFieldProps extends BoxProps {
  children: ReactNode;
  control?: any;
  name?: string;
  render?: any;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, control, name, render, ...props }, ref) => {
    if (render && control && name) {
      return render({ field: { name, value: "", onChange: () => {} } });
    }
    return <Box ref={ref} {...props}>{children}</Box>;
  }
);

export interface FormItemProps extends BoxProps {}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ children, ...props }, ref) => {
    return <Box ref={ref} mb={4} {...props}>{children}</Box>;
  }
);

export interface FormMessageProps extends BoxProps {}

export const FormMessage = forwardRef<HTMLDivElement, FormMessageProps>(
  ({ children, ...props }, ref) => {
    return <ChakraFormErrorMessage ref={ref} {...props}>{children}</ChakraFormErrorMessage>;
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
FormField.displayName = "FormField";
FormItem.displayName = "FormItem";
FormMessage.displayName = "FormMessage";
Form.displayName = "Form";
