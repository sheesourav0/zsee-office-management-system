
import { Input } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultValue?: Date;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ selected, onSelect, defaultValue, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value ? new Date(e.target.value) : undefined;
      if (onSelect) onSelect(date);
    };

    const value = selected 
      ? selected.toISOString().split('T')[0]
      : defaultValue 
        ? defaultValue.toISOString().split('T')[0]
        : '';

    return (
      <Input
        ref={ref}
        type="date"
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

DatePicker.displayName = "DatePicker";
