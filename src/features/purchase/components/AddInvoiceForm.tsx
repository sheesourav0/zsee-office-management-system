
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const pos = [
  { id: "1", number: "PO-2024-001", vendor: "Agmatic Technologies", amount: 250000 },
  { id: "2", number: "PO-2024-002", vendor: "P.R.S ENTERPRISE", amount: 220000 },
  { id: "3", number: "PO-2024-003", vendor: "BMP SYSTEMS", amount: 45000 }
];

const formSchema = z.object({
  poId: z.string({ required_error: "Please select a PO" }),
  invoiceDate: z.date({ required_error: "Invoice date is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  taxRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Tax rate must be a positive number",
  }),
  discount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Discount must be a positive number",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AddInvoiceForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poId: "",
      taxRate: "18",
      discount: "0",
    },
  });

  const selectedPO = pos.find(po => po.id === form.watch("poId"));

  const calculateInvoiceTotal = () => {
    if (!selectedPO) {
      return {
        baseAmount: 0,
        discountAmount: 0,
        taxableAmount: 0,
        taxAmount: 0,
        totalAmount: 0
      };
    }
    
    const baseAmount = selectedPO.amount;
    const taxRate = parseFloat(form.watch("taxRate") || "0");
    const discount = parseFloat(form.watch("discount") || "0");
    
    const discountAmount = (baseAmount * discount) / 100;
    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    
    return {
      baseAmount,
      discountAmount,
      taxableAmount,
      taxAmount,
      totalAmount: taxableAmount + taxAmount
    };
  };

  const invoiceCalculation = calculateInvoiceTotal();

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Invoice data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto-generate Invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      toast.success(`Invoice ${invoiceNumber} generated successfully`);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to generate invoice");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="poId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Purchase Order</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO for invoice generation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pos.map((po) => (
                    <SelectItem key={po.id} value={po.id}>
                      {po.number} - {po.vendor} (₹{po.amount.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedPO && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">PO Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">PO Number:</span>
                <p className="font-medium">{selectedPO.number}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Vendor:</span>
                <p className="font-medium">{selectedPO.vendor}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Invoice Date</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tax rate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter discount percentage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedPO && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">Invoice Calculation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Amount:</span>
                <span>₹{invoiceCalculation.baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-₹{invoiceCalculation.discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxable Amount:</span>
                <span>₹{invoiceCalculation.taxableAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Amount:</span>
                <span>₹{invoiceCalculation.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{invoiceCalculation.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !selectedPO}>
            {isSubmitting ? "Generating..." : "Generate Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddInvoiceForm;
