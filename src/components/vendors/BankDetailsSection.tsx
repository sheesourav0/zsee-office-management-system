
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { VendorFormValues } from "./schemas/vendorSchema";

interface BankDetailsSectionProps {
  form: UseFormReturn<VendorFormValues>;
}

const BankDetailsSection = ({ form }: BankDetailsSectionProps) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium mb-4">Bank Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter account holder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bankAccountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter bank account number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormField
          control={form.control}
          name="ifscCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter IFSC code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter bank name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="branchName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter branch name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BankDetailsSection;
