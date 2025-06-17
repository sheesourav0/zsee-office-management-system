
import { Avatar as ChakraAvatar } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface AvatarProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraAvatar.Root ref={ref} {...props}>
        {children}
      </ChakraAvatar.Root>
    );
  }
);

export const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <ChakraAvatar.Fallback>{children}</ChakraAvatar.Fallback>
);

export const AvatarImage = ({ src, alt }: { src: string; alt?: string }) => (
  <ChakraAvatar.Image src={src} alt={alt} />
);

Avatar.displayName = 'Avatar';
