
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
import { Download } from "lucide-react";
import { generateInvoicePDF, downloadPDF, type InvoiceData } from "@/utils/pdfGenerator";

const pos = [
  { 
    id: "1", 
    number: "ZSEE/2025-06/JUNE/001", 
    vendor: "Yati Infotech Solution Pvt. Ltd.", 
    amount: 106578,
    project: "Amni WTP"
  },
  { 
    id: "2", 
    number: "ZSEE/2025-06/JUNE/002", 
    vendor: "P.R.S ENTERPRISE", 
    amount: 220000,
    project: "YACHULI"
  },
  { 
    id: "3", 
    number: "ZSEE/2025-06/JUNE/003", 
    vendor: "BMP SYSTEMS", 
    amount: 45000,
    project: "Piyong IoT"
  }
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
  const [lastCreatedInvoice, setLastCreatedInvoice] = useState<InvoiceData | null>(null);

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
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        totalAmount: 0
      };
    }
    
    const baseAmount = selectedPO.amount;
    const taxRate = parseFloat(form.watch("taxRate") || "0");
    const discount = parseFloat(form.watch("discount") || "0");
    
    const discountAmount = (baseAmount * discount) / 100;
    const taxableAmount = baseAmount - discountAmount;
    
    // Split GST into CGST and SGST for intrastate, or use IGST for interstate
    const cgstRate = taxRate / 2;
    const sgstRate = taxRate / 2;
    const cgstAmount = (taxableAmount * cgstRate) / 100;
    const sgstAmount = (taxableAmount * sgstRate) / 100;
    const totalTax = cgstAmount + sgstAmount;
    
    return {
      baseAmount,
      discountAmount,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      igstAmount: 0, // Use for interstate transactions
      totalAmount: taxableAmount + totalTax
    };
  };

  const invoiceCalculation = calculateInvoiceTotal();

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Invoice data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto-generate Invoice number with proper format
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const invoiceNumber = `001/${day}/${month}/${year}`;
      
      if (selectedPO) {
        const invoiceData: InvoiceData = {
          invoiceNumber,
          poNumber: selectedPO.number,
          vendor: selectedPO.vendor,
          invoiceDate: data.invoiceDate.toLocaleDateString('en-GB'),
          dueDate: data.dueDate.toLocaleDateString('en-GB'),
          baseAmount: selectedPO.amount,
          taxRate: parseFloat(data.taxRate),
          discount: parseFloat(data.discount),
          taxAmount: invoiceCalculation.cgstAmount + invoiceCalculation.sgstAmount,
          totalAmount: invoiceCalculation.totalAmount,
          cgstAmount: invoiceCalculation.cgstAmount,
          sgstAmount: invoiceCalculation.sgstAmount,
          igstAmount: invoiceCalculation.igstAmount,
        };
        
        setLastCreatedInvoice(invoiceData);
      }
      
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

  const handleDownloadPDF = async () => {
    if (!lastCreatedInvoice) return;
    
    try {
      const pdf = await generateInvoicePDF(lastCreatedInvoice);
      downloadPDF(pdf, `${lastCreatedInvoice.invoiceNumber.replace(/\//g, '-')}.pdf`);
      toast.success("Invoice PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
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
                      {po.number} - {po.vendor} - {po.project} (₹{po.amount.toLocaleString()})
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
              <div>
                <span className="text-muted-foreground">Project:</span>
                <p className="font-medium">{selectedPO.project}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-medium">₹{selectedPO.amount.toLocaleString()}</p>
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
                <FormLabel>GST Rate (%)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GST rate" {...field} />
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
              {invoiceCalculation.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{invoiceCalculation.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxable Amount:</span>
                <span>₹{invoiceCalculation.taxableAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST ({parseFloat(form.watch("taxRate") || "18") / 2}%):</span>
                <span>₹{invoiceCalculation.cgstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST ({parseFloat(form.watch("taxRate") || "18") / 2}%):</span>
                <span>₹{invoiceCalculation.sgstAmount.toLocaleString()}</span>
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
          {lastCreatedInvoice && (
            <Button variant="outline" type="button" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || !selectedPO}>
            {isSubmitting ? "Generating..." : "Generate Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddInvoiceForm;
