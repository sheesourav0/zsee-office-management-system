
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
import { Download, Plus, Trash2 } from "lucide-react";
import { generatePOPDF, downloadPDF, type POData } from "@/utils/pdfGenerator";

const projects = [
  { id: "1", name: "Amni WTP" },
  { id: "2", name: "YACHULI" },
  { id: "3", name: "Sample Testing" },
  { id: "4", name: "Piyong IoT" },
  { id: "5", name: "Machuika" }
];

const vendors = [
  { 
    id: "1", 
    name: "Yati Infotech Solution Pvt. Ltd.", 
    address: "Plot No. A-87, Sector-5, Gautam Buddha Nagar\nNoida Uttar Pradesh - 2, Pin Code-201301",
    gstin: "09AABCY2902M1Z3",
    email: "billing.yispl@ymail.com/jayanti@yatievbattery.com",
    phone: "+91 70424 14931"
  },
  { 
    id: "2", 
    name: "BMP SYSTEMS", 
    address: "Business Address",
    gstin: "12AABCZ1684M1Z2",
    email: "",
    phone: ""
  },
  { 
    id: "3", 
    name: "P.R.S ENTERPRISE", 
    address: "Business Address",
    gstin: "18AABCP1234M1Z5",
    email: "",
    phone: ""
  }
];

const formSchema = z.object({
  projectId: z.string({ required_error: "Please select a project" }),
  vendorId: z.string({ required_error: "Please select a vendor" }),
  items: z.array(z.object({
    description: z.string().min(5, { message: "Description must be at least 5 characters" }),
    quantity: z.string().min(1, { message: "Quantity is required" }),
    unit: z.string().min(1, { message: "Unit is required" }),
    rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Rate must be a positive number",
    }),
    gstRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "GST rate must be a positive number",
    }),
  })).min(1, { message: "At least one item is required" }),
  deliveryDate: z.date({ required_error: "Delivery date is required" }),
  deliveryAddress: z.string().optional(),
  contactDetails: z.string().optional(),
  dispatchPeriod: z.string().optional(),
  transportationCharges: z.string().optional(),
  priceBasis: z.string().optional(),
  paymentTerms: z.string().optional(),
  specialInstructions: z.string().optional(),
  materialRequiredFor: z.string().optional(),
  requisitionedBy: z.string().optional(),
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
      items: [{
        description: "",
        quantity: "",
        unit: "Pcs",
        rate: "",
        gstRate: "18",
      }],
      deliveryAddress: "ZSEE Smart Solution India Private Limited\n03rd Floor, The Institution of Engineers Building,\nPanbazar, Guwahati, Assam - 781001\nGSTIN: 18AABCZ1684M1ZQ",
      contactDetails: "Hasrath Bava (8137805784)",
      dispatchPeriod: "Immediate",
      transportationCharges: "Extra as Actual",
      priceBasis: "Ex-works",
      paymentTerms: "100% payment against PI prior to dispatch",
      specialInstructions: "N/A",
      materialRequiredFor: "",
      requisitionedBy: "Hasrath Bava (81378 05784)",
    },
  });

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, {
      description: "",
      quantity: "",
      unit: "Pcs",
      rate: "",
      gstRate: "18",
    }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    }
  };

  const calculateItemTotal = (item: any) => {
    const quantity = parseFloat(item.quantity || "0");
    const rate = parseFloat(item.rate || "0");
    return quantity * rate;
  };

  const calculateGrandTotal = () => {
    const items = form.watch("items");
    const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const totalGst = items.reduce((sum, item) => {
      const itemTotal = calculateItemTotal(item);
      const gstRate = parseFloat(item.gstRate || "0");
      return sum + (itemTotal * gstRate / 100);
    }, 0);
    return subtotal + totalGst;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Generate PO number
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      const poNumber = `ZSEE/${year}-${month}/JUNE/${randomNum}`;
      
      const selectedProject = projects.find(p => p.id === data.projectId);
      const selectedVendor = vendors.find(v => v.id === data.vendorId);
      
      if (!selectedVendor) {
        toast.error("Please select a vendor");
        return;
      }
      
      const poData: POData = {
        poNumber,
        date: new Date().toLocaleDateString('en-GB'),
        project: selectedProject?.name || "",
        vendor: selectedVendor.name,
        vendorDetails: {
          name: selectedVendor.name,
          address: selectedVendor.address,
          gstin: selectedVendor.gstin,
          email: selectedVendor.email,
          phone: selectedVendor.phone,
        },
        items: data.items.map((item, index) => ({
          slNo: index + 1,
          description: item.description,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          gstRate: parseFloat(item.gstRate),
          rate: parseFloat(item.rate),
          amount: calculateItemTotal(item),
        })),
        deliveryDate: data.deliveryDate.toLocaleDateString('en-GB'),
        terms: data.paymentTerms || "100% payment against PI prior to dispatch",
        specialInstructions: data.specialInstructions,
        deliveryAddress: data.deliveryAddress,
        contactDetails: data.contactDetails,
        dispatchPeriod: data.dispatchPeriod,
        transportationCharges: data.transportationCharges,
        priceBasis: data.priceBasis,
        paymentTerms: data.paymentTerms,
        materialRequiredFor: data.materialRequiredFor,
        requisitionedBy: data.requisitionedBy,
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

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Particulars of Work</h3>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {form.watch("items").map((_, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Item {index + 1}</h4>
                {form.watch("items").length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter item description" 
                        className="resize-none min-h-[60px]"
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
                        <Input placeholder="Qty" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`items.${index}.unit`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="Pcs" {...field} />
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
                        <Input placeholder="Rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`items.${index}.gst`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="18" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">Amount</label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                    ₹{calculateItemTotal(form.watch("items")[index]).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Calculation */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Total Amount</h4>
          <div className="text-2xl font-bold text-blue-600">
            ₹{calculateGrandTotal().toLocaleString()}
          </div>
        </div>
        
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

        {/* Terms & Conditions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Terms & Conditions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter delivery address" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact person and phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dispatchPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dispatch Period</FormLabel>
                  <FormControl>
                    <Input placeholder="Immediate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transportationCharges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportation Charges</FormLabel>
                  <FormControl>
                    <Input placeholder="Extra as Actual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priceBasis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Basis</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex-works" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input placeholder="100% payment against PI prior to dispatch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="materialRequiredFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Required For</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requisitionedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requisitioned By</FormLabel>
                  <FormControl>
                    <Input placeholder="Person name and contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
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
        </div>
        
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
