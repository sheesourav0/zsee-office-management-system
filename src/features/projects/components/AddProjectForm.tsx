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

const projectSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  endDate: z.date({
    required_error: "Please select an end date.",
  }),
  description: z.string().optional(),
  budget: z.number({
    required_error: "Please enter the project budget.",
  }).min(1, {
    message: "Budget must be greater than 0.",
  }),
});

interface AddProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddProjectForm = ({ onSubmit, onCancel }: AddProjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      department: "",
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      budget: 0,
    },
  });

  const handleSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(values);
      toast.success("Project created successfully!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <Box as="form" onSubmit={form.handleSubmit(handleSubmit)} gap={4}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Project Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="civil">Civil</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Flex gap={4}>
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Flex>

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Budget" {...field} />
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
                  placeholder="Project Description"
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
          <Button type="submit" loading={isSubmitting}>
            Create Project
          </Button>
        </Flex>
      </Box>
    </Form>
  );
};

export default AddProjectForm;
