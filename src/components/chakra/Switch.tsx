
import { Switch as ChakraSwitch } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  [key: string]: any;
}

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (details: any) => {
      if (onCheckedChange) onCheckedChange(details.checked);
    };

    return (
      <ChakraSwitch.Root
        ref={ref}
        checked={checked}
        onCheckedChange={handleChange}
        {...props}
      >
        <ChakraSwitch.HiddenInput />
        <ChakraSwitch.Control>
          <ChakraSwitch.Thumb />
        </ChakraSwitch.Control>
      </ChakraSwitch.Root>
    );
  }
);

Switch.displayName = 'Switch';
