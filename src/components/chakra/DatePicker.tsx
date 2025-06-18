
import { Input } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultValue?: Date;
  placeholder?: string;
  // Legacy props for backward compatibility
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  onChange?: (date: Date | undefined) => void;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ selected, onSelect, defaultValue, placeholder, date, setDate, onChange, ...props }, ref) => {
    // Use legacy props if provided for backward compatibility
    const currentDate = selected || date;
    const handleChange = onSelect || setDate || onChange;
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value ? new Date(e.target.value) : undefined;
      if (handleChange) handleChange(dateValue);
    };

    const value = currentDate 
      ? currentDate.toISOString().split('T')[0]
      : defaultValue 
        ? defaultValue.toISOString().split('T')[0]
        : '';

    return (
      <Input
        ref={ref}
        type="date"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

DatePicker.displayName = "DatePicker";
