
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Input } from "@/components/chakra/Input";
import { Select } from "@/components/chakra/Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/chakra/Form";
import { Plus, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { BillingProject, ProjectPayment } from "../types/billingTypes";

interface PaymentTrackingProps {
  refreshTrigger: number;
}

const paymentSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  reference: z.string().min(1, "Reference is required"),
  notes: z.string().optional(),
});

const PaymentTracking = ({ refreshTrigger }: PaymentTrackingProps) => {
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      projectId: "",
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: "",
      reference: "",
      notes: "",
    },
  });

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    const storedPayments = JSON.parse(localStorage.getItem('billing_payments') || '[]');
    setProjects(storedProjects);
    setPayments(storedPayments);
  };

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    const newPayment: ProjectPayment = {
      id: Date.now().toString(),
      projectId: values.projectId,
      amount: values.amount,
      paymentDate: values.paymentDate,
      paymentMethod: values.paymentMethod,
      reference: values.reference,
      notes: values.notes,
      createdAt: new Date().toISOString(),
    };

    // Add payment
    const updatedPayments = [...payments, newPayment];
    localStorage.setItem('billing_payments', JSON.stringify(updatedPayments));

    // Update project totals
    const updatedProjects = projects.map(project => {
      if (project.id === values.projectId) {
        const newTotalReceived = project.totalReceived + values.amount;
        return {
          ...project,
          totalReceived: newTotalReceived,
          totalPending: project.totalCost - newTotalReceived,
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });
    
    localStorage.setItem('billing_projects', JSON.stringify(updatedProjects));
    
    setIsAddPaymentOpen(false);
    form.reset();
    loadData();
    toast.success("Payment recorded successfully!");
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddPaymentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className={project.totalPending === 0 ? 'border-green-200 bg-green-50' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">₹{project.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Received:</span>
                  <span className="font-medium text-green-600">₹{project.totalReceived.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className={`font-medium ${project.totalPending === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{project.totalPending.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(project.totalReceived / project.totalCost) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-center mt-1">
                    {Math.round((project.totalReceived / project.totalCost) * 100)}% Completed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No payments recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{getProjectName(payment.projectId)}</TableCell>
                      <TableCell className="text-green-600">₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>{payment.notes || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} (Pending: ₹{project.totalPending.toLocaleString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter amount" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormControl>
                      <Input placeholder="Transaction reference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Additional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Payment</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentTracking;
