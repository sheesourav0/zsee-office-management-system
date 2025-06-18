
import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/chakra/Table';
import { Badge } from '@/components/chakra/Badge';
import { Button } from '@/components/chakra/Button';
import { Input } from '@/components/chakra/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/chakra/Select';
import { VStack, HStack, Box } from '@chakra-ui/react';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  receipt?: string;
}

interface ExpensesListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

const ExpensesList = ({ expenses, onEdit, onDelete }: ExpensesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'description':
          return a.description.localeCompare(b.description);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [expenses, searchTerm, categoryFilter, sortBy]);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      office: 'blue',
      travel: 'green',
      meals: 'orange',
      equipment: 'purple',
      other: 'gray',
    };
    return <Badge colorScheme={colors[category] || 'gray'}>{category}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      if (onDelete) {
        onDelete(id);
        toast.success('Expense deleted successfully');
      }
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <Box position="relative" flex={1}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pl={10}
          />
        </Box>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger width="200px">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="office">Office Supplies</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="meals">Meals</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger width="150px">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="description">Description</SelectItem>
          </SelectContent>
        </Select>
      </HStack>

      <Box overflowX="auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell fontWeight="medium">{formatCurrency(expense.amount)}</TableCell>
                <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <HStack gap={2}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit && onEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </HStack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {filteredAndSortedExpenses.length === 0 && (
        <Box textAlign="center" py={8}>
          <p className="text-muted-foreground">No expenses found</p>
        </Box>
      )}
    </VStack>
  );
};

export default ExpensesList;
