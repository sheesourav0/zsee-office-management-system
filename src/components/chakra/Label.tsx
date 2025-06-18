
import { FormLabel, FormLabelProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Label = forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    return <FormLabel ref={ref} {...props} />;
  }
);

Label.displayName = "Label";
