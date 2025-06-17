import { useState } from "react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Select } from "@/components/chakra/Select";
import { Textarea } from "@/components/chakra/Textarea";
import { DatePicker } from "@/components/chakra/DatePicker";
import { 
  FormItem, 
  FormControl, 
  FormField, 
  FormLabel, 
  FormMessage 
} from "@/components/chakra/Form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

const projects = [
  { id: "1", name: "Amrit WTP" },
  { id: "2", name: "YACHULI" },
  { id: "3", name: "Sample Testing" },
  { id: "4", name: "Piyong IoT" },
  { id: "5", name: "Machuika" }
];

const vendors = [
  { id: "1", name: "King Longkai" },
  { id: "2", name: "BMP SYSTEMS" },
  { id: "3", name: "P.R.S ENTERPRISE" },
  { id: "4", name: "SKY MARKETING" },
  { id: "5", name: "Agmatic Technologies" },
  { id: "6", name: "DIVYANSHU AUTOMATION" }
];

const paymentStatuses = [
  { id: "unpaid", name: "Unpaid" },
  { id: "partial", name: "Partial" },
  { id: "paid", name: "Paid" },
  { id: "hold", name: "On Hold" }
];

const formSchema = z.object({
  projectId: z.string({ required_error: "Please select a project" }),
  vendorId: z.string({ required_error: "Please select a vendor" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  payableAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Payable amount must be a positive number",
  }),
  description: z.string().optional(),
  paymentStatus: z.string({ required_error: "Please select a payment status" }),
  transportStatus: z.string().optional(),
  date: z.date({ required_error: "Payment date is required" }),
  invoice: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddPaymentForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      vendorId: "",
      amount: "",
      payableAmount: "",
      description: "",
      paymentStatus: "unpaid",
      transportStatus: "not-applicable",
      invoice: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Payment data:", data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Payment record added successfully");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to add payment record");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <option value="">Select project</option>
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
          name="vendorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <option value="">Select vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount (₹)</FormLabel>
              <FormControl>
                <Input placeholder="Enter total amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="payableAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payable Amount (₹)</FormLabel>
              <FormControl>
                <Input placeholder="Enter payable amount" {...field} />
              </FormControl>
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter payment description" 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  {paymentStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
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
          name="transportStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transport Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <option value="not-applicable">Not Applicable</option>
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="invoice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter invoice number (optional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button" onClick={() => form.reset()}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Payment"}
        </Button>
      </div>
    </form>
  );
};

export default AddPaymentForm;
