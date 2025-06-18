import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/chakra/Select";
import { Textarea } from "@/components/chakra/Textarea";
import { DatePicker } from "@/components/chakra/DatePicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/chakra/Form";
import { toast } from "@/hooks/use-toast";

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(3, {
    message: "Invoice number must be at least 3 characters.",
  }),
  vendor: z.string().min(1, {
    message: "Please select a vendor.",
  }),
  project: z.string().min(1, {
    message: "Please select a project.",
  }),
  invoiceDate: z.date(),
  dueDate: z.date(),
  amount: z.number().min(0, {
    message: "Amount must be a positive number.",
  }),
  description: z.string().optional(),
});

interface AddInvoiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddInvoiceForm = ({ onSubmit, onCancel }: any) => {
  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: "",
      vendor: "",
      project: "",
      invoiceDate: new Date(),
      dueDate: new Date(),
      amount: 0,
      description: "",
    },
  });

  const { handleSubmit } = form;

  const submitHandler = (values: z.infer<typeof invoiceSchema>) => {
    console.log(values);
    toast.success("Invoice created successfully!");
    onSubmit(values);
  };
  
  return (
    <Form>
      <Box as="form" gap={4}>
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <Input placeholder="INV-2023-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vendor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vendor-1">Vendor 1</SelectItem>
                  <SelectItem value="vendor-2">Vendor 2</SelectItem>
                  <SelectItem value="vendor-3">Vendor 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="project-1">Project 1</SelectItem>
                  <SelectItem value="project-2">Project 2</SelectItem>
                  <SelectItem value="project-3">Project 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoiceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Date</FormLabel>
              <DatePicker
                onSelect={field.onChange}
                defaultValue={field.value}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <DatePicker
                onSelect={field.onChange}
                defaultValue={field.value}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter invoice description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Flex gap={4} justify="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit(submitHandler)}>
            Create Invoice
          </Button>
        </Flex>
      </Box>
    </Form>
  );
};

export default AddInvoiceForm;
