
import { 
  Avatar as ChakraAvatar, 
  AvatarProps,
  AvatarBadge,
  AvatarGroup
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (props, ref) => {
    return <ChakraAvatar ref={ref} {...props} />;
  }
);

export interface AvatarImageProps {
  src?: string;
  alt?: string;
}

export const AvatarImage = ({ src, alt }: AvatarImageProps) => {
  return null; // In Chakra UI v3, image is handled by the Avatar component itself
};

export interface AvatarFallbackProps {
  children: ReactNode;
}

export const AvatarFallback = ({ children }: AvatarFallbackProps) => {
  return <>{children}</>; // In Chakra UI v3, fallback is handled by the Avatar component itself
};

Avatar.displayName = "Avatar";
