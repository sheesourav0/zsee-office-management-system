
import { useState } from "react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/chakra/Select";
import { Textarea } from "@/components/chakra/Textarea";
import { DatePicker } from "@/components/chakra/DatePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { FormItem, FormLabel, FormControl, FormMessage, Form, FormField } from "@/components/chakra/Form";
import { Label } from "@/components/chakra/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

const departments = [
  { id: "civil", name: "Civil" },
  { id: "mechanical", name: "Mechanical" },
  { id: "design", name: "Design" },
  { id: "accounts", name: "Accounts" },
  { id: "tender", name: "Tender" },
  { id: "purchase", name: "Purchase" },
  { id: "automation", name: "Automation" }
];

const formSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  department: z.string({ required_error: "Please select a department" }),
  description: z.string().optional(),
  budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget must be a positive number",
  }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" })
    .refine((date) => date > new Date(), {
      message: "End date must be in the future",
    }),
  manager: z.string().min(3, { message: "Manager name must be at least 3 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const AddProjectForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      description: "",
      budget: "",
      manager: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call
      console.log("Project data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Project added successfully");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to add project");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
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
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter project description" 
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter budget amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Manager</FormLabel>
              <FormControl>
                <Input placeholder="Enter project manager's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddProjectForm;
