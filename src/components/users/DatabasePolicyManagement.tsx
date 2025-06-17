import { useState, useEffect } from "react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Label } from "@/components/chakra/Label";
import { Textarea } from "@/components/chakra/Textarea";
import { Badge } from "@/components/chakra/Badge";
import { Checkbox } from "@/components/chakra/Checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Select } from "@/components/chakra/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/chakra/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

interface DatabasePolicy {
  id: string;
  name: string;
  description: string;
  databaseType: string;
  connectionString: string;
  query: string;
  isActive: boolean;
}

const databasePolicySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  databaseType: z.string().min(1, { message: "Database type is required." }),
  connectionString: z.string().min(10, { message: "Connection string must be at least 10 characters." }),
  query: z.string().min(10, { message: "Query must be at least 10 characters." }),
  isActive: z.boolean().default(true),
});

const DatabasePolicyManagement = () => {
  const [policies, setPolicies] = useState<DatabasePolicy[]>([]);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<DatabasePolicy | null>(null);
  const [isEditPolicyOpen, setIsEditPolicyOpen] = useState(false);

  const form = useForm<z.infer<typeof databasePolicySchema>>({
    resolver: zodResolver(databasePolicySchema),
    defaultValues: {
      name: "",
      description: "",
      databaseType: "",
      connectionString: "",
      query: "",
      isActive: true,
    },
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = () => {
    const storedPolicies = localStorage.getItem("databasePolicies");
    if (storedPolicies) {
      setPolicies(JSON.parse(storedPolicies));
    }
  };

  const savePolicies = (policiesToSave: DatabasePolicy[]) => {
    localStorage.setItem("databasePolicies", JSON.stringify(policiesToSave));
    loadPolicies();
  };

  const addPolicy = (values: z.infer<typeof databasePolicySchema>) => {
    const newPolicy: DatabasePolicy = {
      id: Date.now().toString(),
      ...values,
    };
    const updatedPolicies = [...policies, newPolicy];
    savePolicies(updatedPolicies);
    setIsAddPolicyOpen(false);
    form.reset();
    toast.success("Policy added successfully!");
  };

  const updatePolicy = (id: string, values: z.infer<typeof databasePolicySchema>) => {
    const updatedPolicies = policies.map((policy) =>
      policy.id === id ? { ...policy, ...values } : policy
    );
    savePolicies(updatedPolicies);
    setIsEditPolicyOpen(false);
    setSelectedPolicy(null);
    toast.success("Policy updated successfully!");
  };

  const deletePolicy = (id: string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      const updatedPolicies = policies.filter((policy) => policy.id !== id);
      savePolicies(updatedPolicies);
      toast.success("Policy deleted successfully!");
    }
  };

  const togglePolicyStatus = (id: string) => {
    const updatedPolicies = policies.map((policy) =>
      policy.id === id ? { ...policy, isActive: !policy.isActive } : policy
    );
    savePolicies(updatedPolicies);
    toast.success("Policy status updated successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Policies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={() => setIsAddPolicyOpen(true)}>Add Policy</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Database Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.description}</TableCell>
                <TableCell>{policy.databaseType}</TableCell>
                <TableCell>
                  <Badge variant={policy.isActive ? "default" : "secondary"}>
                    {policy.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPolicy(policy);
                      setIsEditPolicyOpen(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePolicy(policy.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={isAddPolicyOpen} onOpenChange={setIsAddPolicyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Database Policy</DialogTitle>
            </DialogHeader>
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...form.register("name")} />
              </FormControl>
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...form.register("description")} />
              </FormControl>
              <FormMessage>{form.formState.errors.description?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel>Database Type</FormLabel>
              <FormControl>
                <Select {...form.register("databaseType")}>
                  <option value="">Select a database type</option>
                  <option value="MySQL">MySQL</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MongoDB">MongoDB</option>
                </Select>
              </FormControl>
              <FormMessage>{form.formState.errors.databaseType?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel>Connection String</FormLabel>
              <FormControl>
                <Input {...form.register("connectionString")} />
              </FormControl>
              <FormMessage>{form.formState.errors.connectionString?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel>Query</FormLabel>
              <FormControl>
                <Textarea {...form.register("query")} />
              </FormControl>
              <FormMessage>{form.formState.errors.query?.message}</FormMessage>
            </FormItem>
            <Button onClick={form.handleSubmit(addPolicy)}>Add Policy</Button>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditPolicyOpen} onOpenChange={setIsEditPolicyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Database Policy</DialogTitle>
            </DialogHeader>
            {selectedPolicy && (
              <EditPolicyForm
                policy={selectedPolicy}
                onUpdate={updatePolicy}
                onClose={() => {
                  setIsEditPolicyOpen(false);
                  setSelectedPolicy(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface EditPolicyFormProps {
  policy: DatabasePolicy;
  onUpdate: (id: string, values: z.infer<typeof databasePolicySchema>) => void;
  onClose: () => void;
}

const EditPolicyForm = ({ policy, onUpdate, onClose }: EditPolicyFormProps) => {
  const form = useForm<z.infer<typeof databasePolicySchema>>({
    resolver: zodResolver(databasePolicySchema),
    defaultValues: {
      name: policy.name,
      description: policy.description,
      databaseType: policy.databaseType,
      connectionString: policy.connectionString,
      query: policy.query,
      isActive: policy.isActive,
    },
  });

  const submitUpdate = (values: z.infer<typeof databasePolicySchema>) => {
    onUpdate(policy.id, values);
    onClose();
  };

  return (
    <form onSubmit={form.handleSubmit(submitUpdate)} className="space-y-4">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input {...form.register("name")} />
        </FormControl>
        <FormMessage>{form.formState.errors.name?.message}</FormMessage>
      </FormItem>
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea {...form.register("description")} />
        </FormControl>
        <FormMessage>{form.formState.errors.description?.message}</FormMessage>
      </FormItem>
      <FormItem>
        <FormLabel>Database Type</FormLabel>
        <FormControl>
          <Select {...form.register("databaseType")}>
            <option value="">Select a database type</option>
            <option value="MySQL">MySQL</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MongoDB">MongoDB</option>
          </Select>
        </FormControl>
        <FormMessage>{form.formState.errors.databaseType?.message}</FormMessage>
      </FormItem>
      <FormItem>
        <FormLabel>Connection String</FormLabel>
        <FormControl>
          <Input {...form.register("connectionString")} />
        </FormControl>
        <FormMessage>{form.formState.errors.connectionString?.message}</FormMessage>
      </FormItem>
      <FormItem>
        <FormLabel>Query</FormLabel>
        <FormControl>
          <Textarea {...form.register("query")} />
        </FormControl>
        <FormMessage>{form.formState.errors.query?.message}</FormMessage>
      </FormItem>
      <FormItem>
        <FormLabel>Active</FormLabel>
        <FormControl>
          <Checkbox
            checked={form.watch("isActive")}
            onCheckedChange={(checked) => form.setValue("isActive", checked)}
          />
        </FormControl>
        <FormMessage>{form.formState.errors.isActive?.message}</FormMessage>
      </FormItem>
      <Button type="submit">Update Policy</Button>
    </form>
  );
};

export default DatabasePolicyManagement;
