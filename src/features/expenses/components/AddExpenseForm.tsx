
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/chakra/Button';
import { Input } from '@/components/chakra/Input';
import { Textarea } from '@/components/chakra/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/chakra/Select';
import { DatePicker } from '@/components/chakra/DatePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra/Card';
import { FormItem, FormLabel, FormMessage } from '@/components/chakra/Form';
import { VStack, HStack } from '@chakra-ui/react';
import { toast } from '@/hooks/use-toast';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
  receipt: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseFormProps {
  onSuccess?: () => void;
}

const AddExpenseForm = ({ onSuccess }: AddExpenseFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      // Save expense logic here
      toast.success('Expense added successfully');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4}>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Input
                {...register('description')}
                placeholder="Enter expense description"
              />
              {errors.description && (
                <FormMessage>{errors.description.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && (
                <FormMessage>{errors.amount.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select {...register('category')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office Supplies</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="meals">Meals</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <FormMessage>{errors.category.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Date</FormLabel>
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
                placeholder="Select date"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Receipt (Optional)</FormLabel>
              <Textarea
                {...register('receipt')}
                placeholder="Receipt details or notes"
              />
            </FormItem>

            <HStack gap={2} width="100%" justifyContent="flex-end">
              <Button variant="outline" onClick={() => reset()}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Add Expense
              </Button>
            </HStack>
          </VStack>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddExpenseForm;
