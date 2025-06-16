
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

const formSchema = z.object({
  invoiceDate: z.date({ required_error: "Invoice date is required" }),
  billedToParty: z.object({
    name: z.string().min(1, { message: "Party name is required" }),
    address: z.string().min(10, { message: "Address is required" }),
    gstin: z.string().min(1, { message: "GSTIN is required" }),
    state: z.string().min(1, { message: "State is required" }),
    code: z.string().min(1, { message: "Code is required" }),
  }),
  items: z.array(z.object({
    description: z.string().min(5, { message: "Description must be at least 5 characters" }),
    quantity: z.string().min(1, { message: "Quantity is required" }),
    rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Rate must be a positive number",
    }),
    sgstRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "SGST rate must be a positive number",
    }),
    cgstRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "CGST rate must be a positive number",
    }),
  })).min(1, { message: "At least one item is required" }),
  totalInWords: z.string().min(1, { message: "Amount in words is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const AddInvoiceForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedInvoice, setLastCreatedInvoice] = useState<InvoiceData | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{
        description: "",
        quantity: "1",
        rate: "",
        sgstRate: "9",
        cgstRate: "9",
      }],
      billedToParty: {
        name: "",
        address: "",
        gstin: "",
        state: "Arunachal Pradesh",
        code: "12",
      },
      totalInWords: "",
    },
  });

  const calculateItemTotal = (item: any) => {
    const quantity = parseFloat(item.quantity || "0");
    const rate = parseFloat(item.rate || "0");
    const sgstRate = parseFloat(item.sgstRate || "0");
    const cgstRate = parseFloat(item.cgstRate || "0");
    
    const baseAmount = quantity * rate;
    const sgstAmount = (baseAmount * sgstRate) / 100;
    const cgstAmount = (baseAmount * cgstRate) / 100;
    
    return {
      baseAmount,
      sgstAmount,
      cgstAmount,
      total: baseAmount + sgstAmount + cgstAmount
    };
  };

  const calculateGrandTotal = () => {
    const items = form.watch("items");
    return items.reduce((sum, item) => {
      const itemCalc = calculateItemTotal(item);
      return sum + itemCalc.total;
    }, 0);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Generate Invoice number
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const invoiceNumber = `001/${day}/${month}/${year}`;
      
      const invoiceData: InvoiceData = {
        invoiceNumber,
        invoiceDate: data.invoiceDate.toLocaleDateString('en-GB'),
        pan: "AABCZ1684M",
        gstin: "12AABCZ1684M1Z2",
        state: "Arunachal Pradesh",
        code: "12",
        billedToParty: {
          name: data.billedToParty.name,
          address: data.billedToParty.address,
          gstin: data.billedToParty.gstin,
          state: data.billedToParty.state,
          code: data.billedToParty.code,
        },
        items: data.items.map((item, index) => {
          const calc = calculateItemTotal(item);
          return {
            slNo: index + 1,
            description: item.description,
            quantity: parseFloat(item.quantity),
            rate: parseFloat(item.rate),
            sgstRate: parseFloat(item.sgstRate),
            sgstAmount: calc.sgstAmount,
            cgstRate: parseFloat(item.cgstRate),
            cgstAmount: calc.cgstAmount,
            total: calc.total,
          };
        }),
        totalInvoiceAmount: calculateGrandTotal(),
        totalInWords: data.totalInWords,
        bankDetails: {
          bankName: "HDFC Bank",
          accountNumber: "50200078568850",
          branchName: "Chandmari",
          ifscCode: "HDFC0000631",
        },
      };
      
      setLastCreatedInvoice(invoiceData);
      
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

        {/* Billed to Party Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billed to Party</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="billedToParty.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Executive Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billedToParty.gstin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSTIN</FormLabel>
                  <FormControl>
                    <Input placeholder="Party GSTIN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="billedToParty.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="PHE & WS Division, Yachuli, A.P."
                    className="resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="billedToParty.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Arunachal Pradesh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billedToParty.code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Description</h3>
          
          {form.watch("items").map((_, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Item {index + 1}</h4>
              </div>
              
              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Maintenance work of 0.66 MLD Water Treatment Plant includes all necessary tasks."
                        className="resize-none min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`items.${index}.rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate (₹)</FormLabel>
                      <FormControl>
                        <Input placeholder="2,166,571" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`items.${index}.sgstRate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SGST (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`items.${index}.cgstRate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGST (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">Total</label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                    ₹{calculateItemTotal(form.watch("items")[index]).total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Calculation */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Total Invoice Amount</h4>
          <div className="text-2xl font-bold text-blue-600">
            ₹{calculateGrandTotal().toLocaleString()}
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="totalInWords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Invoice Amount (in words)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Twenty five lakh fifty six thousand five hundred and fifty four only" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Generate Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddInvoiceForm;
