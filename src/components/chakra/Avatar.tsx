
import { Avatar as ChakraAvatar } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: string;
  className?: string;
  [key: string]: any;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (props, ref) => {
    return (
      <ChakraAvatar.Root ref={ref} {...props}>
        <ChakraAvatar.Image />
        <ChakraAvatar.Fallback />
      </ChakraAvatar.Root>
    );
  }
);

export interface AvatarImageProps {
  src?: string;
  alt?: string;
}

export const AvatarImage = ({ src, alt }: AvatarImageProps) => {
  return <ChakraAvatar.Image src={src} alt={alt} />;
};

export interface AvatarFallbackProps {
  children: ReactNode;
}

export const AvatarFallback = ({ children }: AvatarFallbackProps) => {
  return <ChakraAvatar.Fallback>{children}</ChakraAvatar.Fallback>;
};

Avatar.displayName = "Avatar";
