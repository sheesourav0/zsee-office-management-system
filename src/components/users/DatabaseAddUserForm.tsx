
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/radix/Form";
import { Input } from "@/components/radix/Input";
import { Button } from "@/components/radix/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/radix/Select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/radix/Card";
import { UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { departmentService } from "@/lib/supabase-services";
import { useCreateUser } from "@/hooks/useUsers";
import { CreateUser, CreateUserSchema } from "@/lib/schemas/user";

const DatabaseAddUserForm = () => {
  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createUserMutation = useCreateUser();

  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      department_id: undefined,
      join_date: new Date().toISOString().split('T')[0],
      is_active: true,
    },
  });

  const onSubmit = async (values: CreateUser) => {
    createUserMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  if (loadingDepartments) {
    return <div className="flex items-center justify-center p-8">Loading departments...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New User
        </CardTitle>
        <CardDescription>
          Create a new user account with Supabase authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department (Optional)</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "no-department" ? undefined : value)} 
                    value={field.value || "no-department"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-department">No Department</SelectItem>
                      {departments
                        .filter(dept => dept?.id && typeof dept.id === 'string' && dept.id.trim() !== '')
                        .map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="join_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DatabaseAddUserForm;
