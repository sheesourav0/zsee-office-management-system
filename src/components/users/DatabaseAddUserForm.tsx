
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  VStack,
  Button as ChakraButton,
} from "@chakra-ui/react";
import { Input } from "@/components/chakra/Input";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { FormControl, FormLabel, FormErrorMessage } from "@/components/chakra/Form";
import { Select } from "@/components/chakra/Select";
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
    return <Box textAlign="center" p={8}>Loading departments...</Box>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle display="flex" alignItems="center" gap={2}>
          <UserPlus size={20} />
          Add New User
        </CardTitle>
        <CardDescription>
          Create a new user account with Supabase authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
          <VStack gap={6}>
            <FormControl isInvalid={!!form.formState.errors.name}>
              <FormLabel>Full Name</FormLabel>
              <Input placeholder="John Doe" {...form.register("name")} />
              <FormErrorMessage>
                {form.formState.errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="user@example.com" {...form.register("email")} />
              <FormErrorMessage>
                {form.formState.errors.email?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.department_id}>
              <FormLabel>Department (Optional)</FormLabel>
              <Select 
                placeholder="Select a department"
                {...form.register("department_id")}
              >
                <option value="">No Department</option>
                {departments
                  .filter(dept => dept?.id && typeof dept.id === 'string' && dept.id.trim() !== '')
                  .map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
              </Select>
              <FormErrorMessage>
                {form.formState.errors.department_id?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.join_date}>
              <FormLabel>Join Date</FormLabel>
              <Input type="date" {...form.register("join_date")} />
              <FormErrorMessage>
                {form.formState.errors.join_date?.message}
              </FormErrorMessage>
            </FormControl>

            <Button 
              type="submit" 
              width="full" 
              loading={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </VStack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DatabaseAddUserForm;
