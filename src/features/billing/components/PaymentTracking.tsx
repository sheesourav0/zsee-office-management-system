
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/chakra/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Input } from '@/components/chakra/Input';
import { Select, SelectItem } from '@/components/chakra/Select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/chakra/Form';
import { VStack, HStack, Table, TableContainer, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface PaymentTrackingProps {
  refreshTrigger: number;
}

interface Payment {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

interface PaymentFormData {
  projectId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  description: string;
}

const PaymentTracking = ({ refreshTrigger }: PaymentTrackingProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  const form = useForm<PaymentFormData>({
    defaultValues: {
      projectId: '',
      amount: 0,
      paymentDate: '',
      paymentMethod: 'bank_transfer',
      description: ''
    }
  });

  useEffect(() => {
    loadPayments();
    loadProjects();
  }, [refreshTrigger]);

  const loadPayments = () => {
    const storedPayments = JSON.parse(localStorage.getItem('billing_payments') || '[]');
    setPayments(storedPayments);
  };

  const loadProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    setProjects(storedProjects);
  };

  const handleAddPayment = (data: PaymentFormData) => {
    const project = projects.find(p => p.id === data.projectId);
    const newPayment: Payment = {
      id: Date.now().toString(),
      projectId: data.projectId,
      projectName: project?.name || 'Unknown Project',
      amount: data.amount,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      status: 'completed',
      description: data.description
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    localStorage.setItem('billing_payments', JSON.stringify(updatedPayments));
    
    form.reset();
    setIsAddingPayment(false);
    toast.success('Payment added successfully');
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'yellow',
      completed: 'green',
      failed: 'red'
    };
    return <Badge colorScheme={statusColors[status as keyof typeof statusColors]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Tracking</h2>
        <Button onClick={() => setIsAddingPayment(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      {isAddingPayment && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddPayment)}>
                <VStack gap={4} align="stretch">
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="check">Check</option>
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Payment description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <HStack gap={2}>
                    <Button type="submit">Add Payment</Button>
                    <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Project</Th>
                  <Th>Amount</Th>
                  <Th>Date</Th>
                  <Th>Method</Th>
                  <Th>Status</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>{payment.projectName}</Td>
                    <Td>₹{payment.amount.toLocaleString()}</Td>
                    <Td>{new Date(payment.paymentDate).toLocaleDateString()}</Td>
                    <Td>{payment.paymentMethod.replace('_', ' ').toUpperCase()}</Td>
                    <Td>{getStatusBadge(payment.status)}</Td>
                    <Td>{payment.description}</Td>
                    <Td>
                      <HStack gap={1}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTracking;
