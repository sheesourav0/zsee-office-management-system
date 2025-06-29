
import { forwardRef, SelectHTMLAttributes } from "react";

export interface SimpleSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className || ''}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

SimpleSelect.displayName = "SimpleSelect";
