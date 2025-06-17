
import { 
  Table as ChakraTable
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface TableProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.ScrollArea>
        <ChakraTable.Root ref={ref} variant="simple" {...props}>
          {children}
        </ChakraTable.Root>
      </ChakraTable.ScrollArea>
    );
  }
);

export const TableHeader = forwardRef<HTMLTableSectionElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.Header ref={ref} {...props}>
        {children}
      </ChakraTable.Header>
    );
  }
);

export const TableBody = forwardRef<HTMLTableSectionElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.Body ref={ref} {...props}>
        {children}
      </ChakraTable.Body>
    );
  }
);

export const TableFooter = forwardRef<HTMLTableSectionElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.Footer ref={ref} {...props}>
        {children}
      </ChakraTable.Footer>
    );
  }
);

export const TableRow = forwardRef<HTMLTableRowElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.Row ref={ref} {...props}>
        {children}
      </ChakraTable.Row>
    );
  }
);

export const TableHead = forwardRef<HTMLTableCellElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.ColumnHeader ref={ref} {...props}>
        {children}
      </ChakraTable.ColumnHeader>
    );
  }
);

export const TableCell = forwardRef<HTMLTableCellElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTable.Cell ref={ref} {...props}>
        {children}
      </ChakraTable.Cell>
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
