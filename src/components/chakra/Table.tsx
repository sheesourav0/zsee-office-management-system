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
        {children}
      </ChakraTable.Root>
    );
  }
);

export const TableHeader = forwardRef<HTMLTableSectionElement, { children: ReactNode; className?: string }>(
  ({ children, ...props }, ref) => {
    return <ChakraTable.Header ref={ref} {...props}>{children}</ChakraTable.Header>;
  }
);

export const TableBody = forwardRef<HTMLTableSectionElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return <ChakraTable.Body ref={ref} {...props}>{children}</ChakraTable.Body>;
  }
);

export const TableFooter = forwardRef<HTMLTableSectionElement, { children: ReactNode }>(
  ({ children, ...props }, ref) => {
    return <ChakraTable.Footer ref={ref} {...props}>{children}</ChakraTable.Footer>;
  }
);

export const TableRow = forwardRef<HTMLTableRowElement, { children: ReactNode; className?: string }>(
  ({ children, ...props }, ref) => {
    return <ChakraTable.Row ref={ref} {...props}>{children}</ChakraTable.Row>;
  }
);

export const TableHead = forwardRef<HTMLTableCellElement, { 
  children: ReactNode; 
  className?: string;
  fontWeight?: string;
  textAlign?: string;
}>(
  ({ children, ...props }, ref) => {
    return <ChakraTable.ColumnHeader ref={ref} {...props}>{children}</ChakraTable.ColumnHeader>;
  }
);

export const TableCell = forwardRef<HTMLTableCellElement, { 
  children: ReactNode; 
  className?: string;
  fontWeight?: string;
  textAlign?: string;
  colSpan?: number;
  color?: string;
}>(
  ({ children, colSpan, color, ...props }, ref) => {
    const style = color ? { color } : {};
    return <ChakraTable.Cell ref={ref} colSpan={colSpan} style={style} {...props}>{children}</ChakraTable.Cell>;
  }
);

export const TableCaption = forwardRef<HTMLTableCaptionElement, { children: ReactNode; className?: string }>(
  ({ children, ...props }, ref) => {
    return <caption ref={ref} {...props}>{children}</caption>;
  }
);

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";
