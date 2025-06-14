
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
import { generatePOPDF, downloadPDF, type POData } from "@/utils/pdfGenerator";

const projects = [
  { id: "1", name: "Amni WTP" },
  { id: "2", name: "YACHULI" },
  { id: "3", name: "Sample Testing" },
  { id: "4", name: "Piyong IoT" },
  { id: "5", name: "Machuika" }
];

const vendors = [
  { id: "1", name: "Yati Infotech Solution Pvt. Ltd.", gst: "09AABCY2902M1Z3" },
  { id: "2", name: "BMP SYSTEMS", gst: "12AABCZ1684M1Z2" },
  { id: "3", name: "P.R.S ENTERPRISE", gst: "18AABCP1234M1Z5" },
  { id: "4", name: "Agmatic Technologies", gst: "27AABCA1234M1Z6" },
  { id: "5", name: "DIVYANSHU AUTOMATION", gst: "06AABCD1234M1Z7" }
];

const formSchema = z.object({
  projectId: z.string({ required_error: "Please select a project" }),
  vendorId: z.string({ required_error: "Please select a vendor" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  unitPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Unit price must be a positive number",
  }),
  deliveryDate: z.date({ required_error: "Delivery date is required" }),
  terms: z.string().optional(),
  specialInstructions: z.string().optional(),
  gstRate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddPOForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedPO, setLastCreatedPO] = useState<POData | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      vendorId: "",
      description: "",
      quantity: "",
      unitPrice: "",
      terms: "100% payment against PI prior to dispatch",
      specialInstructions: "",
      gstRate: "18",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("PO data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto-generate PO number with proper format
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      const poNumber = `ZSEE/${year}-${month}/JUNE/${randomNum}`;
      
      const selectedProject = projects.find(p => p.id === data.projectId);
      const selectedVendor = vendors.find(v => v.id === data.vendorId);
      
      const poData: POData = {
        poNumber,
        date: new Date().toLocaleDateString('en-GB'),
        project: selectedProject?.name || "",
        vendor: selectedVendor?.name || "",
        description: data.description,
        quantity: parseFloat(data.quantity),
        unitPrice: parseFloat(data.unitPrice),
        totalAmount: parseFloat(data.quantity) * parseFloat(data.unitPrice),
        deliveryDate: data.deliveryDate.toLocaleDateString('en-GB'),
        terms: data.terms || "100% payment against PI prior to dispatch",
        specialInstructions: data.specialInstructions,
        gstRate: parseFloat(data.gstRate || "18"),
        cgstRate: parseFloat(data.gstRate || "18") / 2,
        sgstRate: parseFloat(data.gstRate || "18") / 2,
      };
      
      setLastCreatedPO(poData);
      
      toast.success(`PO ${poNumber} created successfully`);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to create PO");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!lastCreatedPO) return;
    
    try {
      const pdf = await generatePOPDF(lastCreatedPO);
      downloadPDF(pdf, `${lastCreatedPO.poNumber.replace(/\//g, '-')}.pdf`);
      toast.success("PO PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  const calculateTotal = () => {
    const quantity = parseFloat(form.watch("quantity") || "0");
    const unitPrice = parseFloat(form.watch("unitPrice") || "0");
    const gstRate = parseFloat(form.watch("gstRate") || "18");
    const baseAmount = quantity * unitPrice;
    const gstAmount = (baseAmount * gstRate) / 100;
    return {
      baseAmount,
      gstAmount,
      totalAmount: baseAmount + gstAmount
    };
  };

  const totals = calculateTotal();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
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
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Particulars of Work</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the items/work to be purchased" 
                  className="resize-none min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="Enter quantity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter unit price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Rate (%)</FormLabel>
                <FormControl>
                  <Input placeholder="18" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">Total Amount</label>
            <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
              ₹{totals.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {totals.baseAmount > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Amount Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base Amount:</span>
                <span>₹{totals.baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({form.watch("gstRate") || 18}%):</span>
                <span>₹{totals.gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total Amount:</span>
                <span>₹{totals.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expected Delivery Date</FormLabel>
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
          name="terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 100% payment against PI prior to dispatch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any special handling, delivery instructions, or material requirements" 
                  className="resize-none" 
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
          {lastCreatedPO && (
            <Button variant="outline" type="button" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating PO..." : "Create Purchase Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPOForm;
