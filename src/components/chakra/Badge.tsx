
import { Badge as ChakraBadge, BadgeProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (props, ref) => {
    return <ChakraBadge ref={ref} {...props} />;
  }
);

Badge.displayName = "Badge";
