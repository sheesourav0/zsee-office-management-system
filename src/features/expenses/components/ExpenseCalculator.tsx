
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Button } from '@/components/chakra/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/chakra/Select';
import { DatePicker } from '@/components/chakra/DatePicker';
import { Badge } from '@/components/chakra/Badge';
import { VStack, HStack, SimpleGrid, Box, Text } from '@chakra-ui/react';
import { Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ExpenseData {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseCalculatorProps {
  expenses?: ExpenseData[];
}

const ExpenseCalculator = ({ expenses = [] }: ExpenseCalculatorProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const categoryMatch = selectedCategory === 'all' || expense.category === selectedCategory;
      const dateMatch = (!startDate || expenseDate >= startDate) && 
                       (!endDate || expenseDate <= endDate);
      return categoryMatch && dateMatch;
    });
  }, [expenses, selectedCategory, startDate, endDate]);

  const calculations = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const average = filteredExpenses.length > 0 ? total / filteredExpenses.length : 0;
    const categories = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      average,
      count: filteredExpenses.length,
      categories,
      highest: Math.max(...filteredExpenses.map(e => e.amount), 0),
      lowest: Math.min(...filteredExpenses.map(e => e.amount), 0),
    };
  }, [filteredExpenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <VStack gap={6} align="stretch">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Expense Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VStack gap={4}>
            <HStack gap={4} width="100%">
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Category</Text>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Start Date</Text>
                <DatePicker
                  date={startDate}
                  setDate={setStartDate}
                  placeholder="Start date"
                />
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={2}>End Date</Text>
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                  placeholder="End date"
                />
              </Box>
            </HStack>
          </VStack>
        </CardContent>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <Card>
          <CardContent>
            <VStack align="start">
              <HStack>
                <DollarSign className="h-4 w-4 text-green-600" />
                <Text fontSize="sm" fontWeight="medium">Total Expenses</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {formatCurrency(calculations.total)}
              </Text>
              <Badge colorScheme="green">{calculations.count} expenses</Badge>
            </VStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <VStack align="start">
              <HStack>
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <Text fontSize="sm" fontWeight="medium">Average Expense</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {formatCurrency(calculations.average)}
              </Text>
              <Badge colorScheme="blue">Per expense</Badge>
            </VStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <VStack align="start">
              <HStack>
                <TrendingUp className="h-4 w-4 text-red-600" />
                <Text fontSize="sm" fontWeight="medium">Highest Expense</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="red.600">
                {formatCurrency(calculations.highest)}
              </Text>
              <Badge colorScheme="red">Maximum</Badge>
            </VStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <VStack align="start">
              <HStack>
                <TrendingDown className="h-4 w-4 text-purple-600" />
                <Text fontSize="sm" fontWeight="medium">Lowest Expense</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {formatCurrency(calculations.lowest)}
              </Text>
              <Badge colorScheme="purple">Minimum</Badge>
            </VStack>
          </CardContent>
        </Card>
      </SimpleGrid>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {Object.entries(calculations.categories).map(([category, amount]) => (
              <HStack key={category} justifyContent="space-between" p={3} bg="gray.50" rounded="md">
                <Text fontWeight="medium" textTransform="capitalize">{category}</Text>
                <Text fontWeight="bold" color="green.600">{formatCurrency(amount)}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </CardContent>
      </Card>
    </VStack>
  );
};

export default ExpenseCalculator;
