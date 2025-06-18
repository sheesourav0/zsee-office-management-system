
import {
  Table as ChakraTable,
  TableProps,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  TableContainerProps
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...props }, ref) => {
    return (
      <TableContainer>
        <ChakraTable ref={ref} {...props}>
          {children}
        </ChakraTable>
      </TableContainer>
    );
  }
);

export const TableHeader = forwardRef<HTMLTableSectionElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <Thead ref={ref}>{children}</Thead>;
  }
);

export const TableBody = forwardRef<HTMLTableSectionElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <Tbody ref={ref}>{children}</Tbody>;
  }
);

export const TableRow = forwardRef<HTMLTableRowElement, { children: ReactNode }>(
  ({ children }, ref) => {
    return <Tr ref={ref}>{children}</Tr>;
  }
);

export const TableHead = forwardRef<HTMLTableCellElement, { children: ReactNode; className?: string; textAlign?: string }>(
  ({ children, textAlign, ...props }, ref) => {
    return <Th ref={ref} textAlign={textAlign as any} {...props}>{children}</Th>;
  }
);

export const TableCell = forwardRef<HTMLTableCellElement, { children: ReactNode; className?: string; fontWeight?: string; textAlign?: string }>(
  ({ children, fontWeight, textAlign, ...props }, ref) => {
    return <Td ref={ref} fontWeight={fontWeight} textAlign={textAlign as any} {...props}>{children}</Td>;
  }
);

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
