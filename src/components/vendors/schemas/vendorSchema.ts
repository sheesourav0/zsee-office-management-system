
import { z } from "zod";

export const vendorFormSchema = z.object({
  name: z.string().min(3, { message: "Vendor name must be at least 3 characters" }),
  contactPerson: z.string().min(3, { message: "Contact person name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  pincode: z.string().min(5, { message: "PIN code must be at least 5 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  description: z.string().optional(),
  gst: z.string().min(15, { message: "GST number must be 15 characters" }).max(15),
  bankAccountNumber: z.string().min(9, { message: "Account number must be at least 9 characters" }),
  ifscCode: z.string().min(11, { message: "IFSC code must be 11 characters" }).max(11),
  bankName: z.string().min(2, { message: "Bank name must be at least 2 characters" }),
  branchName: z.string().min(2, { message: "Branch name must be at least 2 characters" }),
  accountHolderName: z.string().min(3, { message: "Account holder name must be at least 3 characters" }),
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;
