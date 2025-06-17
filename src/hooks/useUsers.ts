
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService, authService } from "@/lib/supabase-services";
import { CreateUser, UpdateUser, CreateUserSchema, UpdateUserSchema } from "@/lib/schemas/user";

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: profileService.getAll,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => profileService.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: CreateUser) => {
      const validatedData = CreateUserSchema.parse(userData);
      
      // Create auth user first
      const tempPassword = Math.random().toString(36).slice(-12);
      const { data: authData } = await authService.signUp(
        validatedData.email,
        tempPassword,
        { name: validatedData.name }
      );
      
      if (!authData.user) {
        throw new Error("Failed to create auth user");
      }
      
      // Create profile
      const profileData = {
        id: authData.user.id,
        name: validatedData.name,
        email: validatedData.email,
        department_id: validatedData.department_id || null,
        join_date: validatedData.join_date || new Date().toISOString().split('T')[0],
        is_active: validatedData.is_active ?? true,
      };
      
      return profileService.create(profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...userData }: UpdateUser & { id: string }) => {
      const validatedData = UpdateUserSchema.parse(userData);
      return profileService.update(id, validatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: profileService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    },
  });
};
