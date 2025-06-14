
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { VendorFormValues } from "./schemas/vendorSchema";

interface AddressSectionProps {
  form: UseFormReturn<VendorFormValues>;
}

const AddressSection = ({ form }: AddressSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="Enter state" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIN Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter PIN code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default AddressSection;
