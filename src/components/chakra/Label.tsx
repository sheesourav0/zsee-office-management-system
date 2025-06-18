
import { Field } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  [key: string]: any;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (props, ref) => {
    return <Field.Label ref={ref} {...props} />;
  }
);

Label.displayName = "Label";
