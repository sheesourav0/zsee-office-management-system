
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { vendorFormSchema, type VendorFormValues } from "./schemas/vendorSchema";
import BasicInfoSection from "./BasicInfoSection";
import AddressSection from "./AddressSection";
import BankDetailsSection from "./BankDetailsSection";

interface AddVendorFormProps {
  onSuccess?: () => void;
}

const AddVendorForm = ({ onSuccess }: AddVendorFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      gst: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      category: "",
      description: "",
      accountHolderName: "",
      bankAccountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
    },
  });

  const onSubmit = async (data: VendorFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Vendor data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Vendor added successfully");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to add vendor");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoSection form={form} />
        <AddressSection form={form} />
        <BankDetailsSection form={form} />
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding Vendor..." : "Add Vendor"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVendorForm;
