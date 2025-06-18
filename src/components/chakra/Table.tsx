
import {
  Table as ChakraTable
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export interface TableProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.Root ref={ref} {...props}>
        <ChakraTable.Root>
          {children}
        </ChakraTable.Root>
      </ChakraTable.Root>
    );
  }
);

export const TableHeader = forwardRef<HTMLTableSectionElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <ChakraTable.Header ref={ref}>{children}</ChakraTable.Header>;
  }
);

export const TableBody = forwardRef<HTMLTableSectionElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <ChakraTable.Body ref={ref}>{children}</ChakraTable.Body>;
  }
);

export const TableRow = forwardRef<HTMLTableRowElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <ChakraTable.Row ref={ref}>{children}</ChakraTable.Row>;
  }
);

export const TableHead = forwardRef<HTMLTableCellElement, { 
  children: ReactNode; 
  className?: string; 
  textAlign?: string;
}>(
  ({ children, textAlign, ...props }, ref) => {
    return (
      <ChakraTable.ColumnHeader ref={ref} textAlign={textAlign as any} {...props}>
        {children}
      </ChakraTable.ColumnHeader>
    );
  }
);

export const TableCell = forwardRef<HTMLTableCellElement, { 
  children: ReactNode; 
  className?: string; 
  fontWeight?: string; 
  textAlign?: string;
}>(
  ({ children, fontWeight, textAlign, ...props }, ref) => {
    return (
      <ChakraTable.Cell ref={ref} fontWeight={fontWeight} textAlign={textAlign as any} {...props}>
        {children}
      </ChakraTable.Cell>
    );
  }
);

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
