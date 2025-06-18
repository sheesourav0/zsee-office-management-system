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

const poSchema = z.object({
  vendor: z.string().min(1, { message: "Please select a vendor." }),
  project: z.string().min(1, { message: "Please select a project." }),
  poNumber: z.string().min(1, { message: "Please enter a PO number." }),
  poDate: z.date({
    required_error: "Please select a PO date.",
  }),
  expectedDelivery: z.date({
    required_error: "Please select an expected delivery date.",
  }),
  description: z.string().optional(),
});

interface AddPOFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddPOForm = ({ onSubmit, onCancel }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(poSchema),
    defaultValues: {
      vendor: "",
      project: "",
      poNumber: "",
      poDate: new Date(),
      expectedDelivery: new Date(),
      description: "",
    },
  });

  const { handleSubmit, formState } = form;

  const submitHandler = async (values: z.infer<typeof poSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(values);
      toast.success("PO created successfully!");
    } catch (error: any) {
      toast.error(error?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <Box as="form" onSubmit={form.handleSubmit(submitHandler)} gap={4}>
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
                  <SelectItem value="Agmatic Technologies">Agmatic Technologies</SelectItem>
                  <SelectItem value="King Longkai">King Longkai</SelectItem>
                  <SelectItem value="BMP SYSTEMS">BMP SYSTEMS</SelectItem>
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
                  <SelectItem value="Amni WTP">Amni WTP</SelectItem>
                  <SelectItem value="Piyong IoT">Piyong IoT</SelectItem>
                  <SelectItem value="Sample Testing">Sample Testing</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="poNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PO Number</FormLabel>
              <FormControl>
                <Input placeholder="PO-2023-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="poDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PO Date</FormLabel>
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedDelivery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Delivery</FormLabel>
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
              />
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
                  placeholder="Description of the purchase order"
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
          <Button type="submit" isLoading={isSubmitting}>
            Create PO
          </Button>
        </Flex>
      </Box>
    </Form>
  );
};

export default AddPOForm;
