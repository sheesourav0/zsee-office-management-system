
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Button } from '@/components/chakra/Button';
import { VStack, HStack, Input, SimpleGrid, Box, Table } from '@chakra-ui/react';
import { Badge } from '@/components/chakra/Badge';
import { toast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  status: 'pending' | 'partial' | 'paid';
  dueDate: string;
  paidAmount: number;
  description: string;
}

interface PaymentTrackingProps {
  refreshTrigger: number;
}

const PaymentTracking = ({ refreshTrigger }: PaymentTrackingProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadPayments();
  }, [refreshTrigger]);

  const loadPayments = () => {
    // Load from localStorage or API
    const storedPayments = JSON.parse(localStorage.getItem('billing_payments') || '[]');
    setPayments(storedPayments);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge colorScheme="green">Paid</Badge>;
      case 'partial':
        return <Badge colorScheme="yellow">Partial</Badge>;
      case 'pending':
        return <Badge colorScheme="red">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handlePaymentUpdate = (paymentId: string, paidAmount: number) => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        const newPaidAmount = payment.paidAmount + paidAmount;
        const newStatus = newPaidAmount >= payment.amount ? 'paid' : 
                         newPaidAmount > 0 ? 'partial' : 'pending';
        return {
          ...payment,
          paidAmount: newPaidAmount,
          status: newStatus as 'pending' | 'partial' | 'paid'
        };
      }
      return payment;
    });
    
    setPayments(updatedPayments);
    localStorage.setItem('billing_payments', JSON.stringify(updatedPayments));
    toast.success('Payment updated successfully');
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      </HStack>

      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={8}>
              <p className="text-muted-foreground">No payments found</p>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Tracking ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Box overflowX="auto">
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Project</Table.ColumnHeader>
                    <Table.ColumnHeader>Description</Table.ColumnHeader>
                    <Table.ColumnHeader>Total Amount</Table.ColumnHeader>
                    <Table.ColumnHeader>Paid Amount</Table.ColumnHeader>
                    <Table.ColumnHeader>Remaining</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Due Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredPayments.map((payment) => (
                    <Table.Row key={payment.id}>
                      <Table.Cell>{payment.projectName}</Table.Cell>
                      <Table.Cell>{payment.description}</Table.Cell>
                      <Table.Cell>{formatCurrency(payment.amount)}</Table.Cell>
                      <Table.Cell>{formatCurrency(payment.paidAmount)}</Table.Cell>
                      <Table.Cell>{formatCurrency(payment.amount - payment.paidAmount)}</Table.Cell>
                      <Table.Cell>{getStatusBadge(payment.status)}</Table.Cell>
                      <Table.Cell>{new Date(payment.dueDate).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const amount = prompt('Enter payment amount:');
                            if (amount && !isNaN(Number(amount))) {
                              handlePaymentUpdate(payment.id, Number(amount));
                            }
                          }}
                        >
                          Add Payment
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </CardContent>
        </Card>
      )}

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Card>
          <CardContent>
            <VStack align="start">
              <p className="text-sm font-medium">Total Pending</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  filteredPayments
                    .filter(p => p.status === 'pending')
                    .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0)
                )}
              </p>
            </VStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <VStack align="start">
              <p className="text-sm font-medium">Partial Payments</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(
                  filteredPayments
                    .filter(p => p.status === 'partial')
                    .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0)
                )}
              </p>
            </VStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <VStack align="start">
              <p className="text-sm font-medium">Total Received</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0)
                )}
              </p>
            </VStack>
          </CardContent>
        </Card>
      </SimpleGrid>
    </VStack>
  );
};

export default PaymentTracking;
