
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Button } from '@/components/chakra/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/chakra/Select';
import { Table } from '@/components/chakra/Table';
import { Badge } from '@/components/chakra/Badge';
import { VStack, HStack, SimpleGrid, Box, Text } from '@chakra-ui/react';
import { Calendar, Download, FileText, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface MonthlyStatementsProps {
  expenses: Expense[];
}

const MonthlyStatements = ({ expenses }: MonthlyStatementsProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  const monthlyData = useMemo(() => {
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === parseInt(selectedYear) &&
             expenseDate.getMonth() + 1 === parseInt(selectedMonth);
    });

    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    const categories = filtered.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const dailyTotals = filtered.reduce((acc, exp) => {
      const day = new Date(exp.date).getDate();
      acc[day] = (acc[day] || 0) + exp.amount;
      return acc;
    }, {} as Record<number, number>);

    return {
      expenses: filtered,
      total,
      categories,
      dailyTotals,
      count: filtered.length,
      average: filtered.length > 0 ? total / filtered.length : 0,
    };
  }, [expenses, selectedYear, selectedMonth]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

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

  const handleDownloadStatement = () => {
    toast.success('Monthly statement downloaded successfully');
  };

  const selectedMonthName = months.find(m => m.value === selectedMonth)?.label;

  return (
    <VStack gap={6} align="stretch">
      <Card>
        <CardHeader>
          <HStack justifyContent="space-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Statements
            </CardTitle>
            <Button variant="outline" onClick={handleDownloadStatement}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </HStack>
        </CardHeader>
        <CardContent>
          <HStack gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Year</Text>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger width="120px">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Month</Text>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger width="150px">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Box>
          </HStack>
        </CardContent>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Card>
          <CardContent>
            <VStack align="start">
              <HStack>
                <FileText className="h-4 w-4 text-blue-600" />
                <Text fontSize="sm" fontWeight="medium">Total Expenses</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {formatCurrency(monthlyData.total)}
              </Text>
              <Badge colorScheme="blue">{selectedMonthName} {selectedYear}</Badge>
            </VStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <VStack align="start">
              <HStack>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <Text fontSize="sm" fontWeight="medium">Average Expense</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {formatCurrency(monthlyData.average)}
              </Text>
              <Badge colorScheme="green">{monthlyData.count} expenses</Badge>
            </VStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <VStack align="start">
              <HStack>
                <Calendar className="h-4 w-4 text-purple-600" />
                <Text fontSize="sm" fontWeight="medium">Categories</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {Object.keys(monthlyData.categories).length}
              </Text>
              <Badge colorScheme="purple">Active categories</Badge>
            </VStack>
          </CardContent>
        </Card>
      </SimpleGrid>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Box overflowX="auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Description</Table.ColumnHeader>
                  <Table.ColumnHeader>Category</Table.ColumnHeader>
                  <Table.ColumnHeader>Amount</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {monthlyData.expenses.map((expense) => (
                  <Table.Row key={expense.id}>
                    <Table.Cell>{new Date(expense.date).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{expense.description}</Table.Cell>
                    <Table.Cell>{getCategoryBadge(expense.category)}</Table.Cell>
                    <Table.Cell fontWeight="medium">{formatCurrency(expense.amount)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          {monthlyData.expenses.length === 0 && (
            <Box textAlign="center" py={8}>
              <p className="text-muted-foreground">
                No expenses found for {selectedMonthName} {selectedYear}
              </p>
            </Box>
          )}
        </CardContent>
      </Card>
    </VStack>
  );
};

export default MonthlyStatements;
