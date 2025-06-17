
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Textarea } from "@/components/chakra/Textarea";
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/chakra/Form";
import { Select } from "@/components/chakra/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Switch } from "@/components/chakra/Switch";
import { toast } from "@/hooks/use-toast";

interface DatabasePolicy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  databaseType: string;
  connectionString: string;
  query: string;
  createdAt: string;
  updatedAt: string;
}

const databaseTypes = [
  { id: "mysql", name: "MySQL" },
  { id: "postgresql", name: "PostgreSQL" },
  { id: "mongodb", name: "MongoDB" },
  { id: "others", name: "Others" },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Policy name must be at least 2 characters" }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  databaseType: z.string({ required_error: "Please select a database type" }),
  connectionString: z.string().optional(),
  query: z.string().optional(),
});

const DatabasePolicyManagement = () => {
  const [policies, setPolicies] = useState<DatabasePolicy[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      databaseType: "mysql",
      connectionString: "",
      query: "",
    },
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = () => {
    const storedPolicies = JSON.parse(localStorage.getItem('database_policies') || '[]');
    setPolicies(storedPolicies);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newPolicy: DatabasePolicy = {
      id: Date.now().toString(),
      name: values.name,
      description: values.description || '',
      isActive: values.isActive,
      databaseType: values.databaseType,
      connectionString: values.connectionString || '',
      query: values.query || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      const existingPolicies = JSON.parse(localStorage.getItem('database_policies') || '[]');
      existingPolicies.push(newPolicy);
      localStorage.setItem('database_policies', JSON.stringify(existingPolicies));

      setPolicies(existingPolicies);
      toast.success("Policy added successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to add policy");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Policy Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter policy name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="databaseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <option value="">Select database type</option>
                      {databaseTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Select>
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
                <FormLabel>Policy Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter policy description" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="connectionString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection String (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter connection string" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter query" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Policy Status</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" loading={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Policy"}
          </Button>
        </form>

        {policies.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Existing Policies</h3>
            <ul>
              {policies.map((policy) => (
                <li key={policy.id} className="py-2 border-b">
                  {policy.name} - {policy.databaseType}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabasePolicyManagement;
