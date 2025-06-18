
import { 
  Table as ChakraTable
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.Root ref={ref} className={className} {...props}>
        <ChakraTable.ScrollArea>
          {children}
        </ChakraTable.ScrollArea>
      </ChakraTable.Root>
    );
  }
);

export const TableHeader = forwardRef<HTMLTableSectionElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.Header ref={ref} className={className} {...props}>
        {children}
      </ChakraTable.Header>
    );
  }
);

export const TableBody = forwardRef<HTMLTableSectionElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.Body ref={ref} className={className} {...props}>
        {children}
      </ChakraTable.Body>
    );
  }
);

export const TableRow = forwardRef<HTMLTableRowElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.Row ref={ref} className={className} {...props}>
        {children}
      </ChakraTable.Row>
    );
  }
);

export const TableHead = forwardRef<HTMLTableCellElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.ColumnHeader ref={ref} className={className} {...props}>
        {children}
      </ChakraTable.ColumnHeader>
    );
  }
);

export const TableCell = forwardRef<HTMLTableCellElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.Cell ref={ref} className={className} {...props}>
        {children}
      </ChakraTable.Cell>
    );
  }
);

export const TableFooter = forwardRef<HTMLTableSectionElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.Footer ref={ref} className={className} {...props}>
        {children}
      </ChakraTable.Footer>
    );
  }
);

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ChakraTable.Caption ref={ref} className={className} {...props}>
        {children}
      </ChakraTable.Caption>
    );
  }
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
TableFooter.displayName = 'TableFooter';
TableCaption.displayName = 'TableCaption';
