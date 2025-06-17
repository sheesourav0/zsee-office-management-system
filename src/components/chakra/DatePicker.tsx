
import { Input } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface DatePickerProps {
  date?: Date | null;
  setDate?: (date: Date | null) => void;
  placeholder?: string;
  [key: string]: any;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ date, setDate, placeholder = "Select date", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (setDate) {
        setDate(value ? new Date(value) : null);
      }
    };

    const formatDate = (date: Date | null) => {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    };

    return (
      <Input
        ref={ref}
        type="date"
        value={formatDate(date)}
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';
