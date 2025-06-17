
import { 
  Table as ChakraTable, 
  Thead, 
  Tbody, 
  Tfoot, 
  Tr, 
  Th, 
  Td, 
  TableCaption,
  TableContainer,
  TableProps 
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...props }, ref) => {
    return (
      <TableContainer>
        <ChakraTable ref={ref} variant="simple" {...props}>
          {children}
        </ChakraTable>
      </TableContainer>
    );
  }
);

export const TableHeader = forwardRef<HTMLTableSectionElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <Thead ref={ref} {...props}>
        {children}
      </Thead>
    );
  }
);

export const TableBody = forwardRef<HTMLTableSectionElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <Tbody ref={ref} {...props}>
        {children}
      </Tbody>
    );
  }
);

export const TableFooter = forwardRef<HTMLTableSectionElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <Tfoot ref={ref} {...props}>
        {children}
      </Tfoot>
    );
  }
);

export const TableRow = forwardRef<HTMLTableRowElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <Tr ref={ref} {...props}>
        {children}
      </Tr>
    );
  }
);

export const TableHead = forwardRef<HTMLTableCellElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <Th ref={ref} {...props}>
        {children}
      </Th>
    );
  }
);

export const TableCell = forwardRef<HTMLTableCellElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <Td ref={ref} {...props}>
        {children}
      </Td>
    );
  }
);

export const TableCaption = forwardRef<HTMLTableCaptionElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <TableCaption ref={ref} {...props}>
        {children}
      </TableCaption>
    );
  }
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableFooter.displayName = 'TableFooter';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
TableCaption.displayName = 'TableCaption';
