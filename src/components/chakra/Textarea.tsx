
import { Textarea as ChakraTextarea, TextareaProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return <ChakraTextarea ref={ref} {...props} />;
  }
);

Textarea.displayName = "Textarea";
