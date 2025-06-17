import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { policyService, userPolicyService } from "@/lib/supabase-services";
import { CreatePolicy, UpdatePolicy, AssignPolicy, CreatePolicySchema, UpdatePolicySchema, AssignPolicySchema } from "@/lib/schemas/policy";

export const usePolicies = () => {
  return useQuery({
    queryKey: ['policies'],
    queryFn: policyService.getAll,
  });
};

export const usePolicy = (id: string) => {
  return useQuery({
    queryKey: ['policies', id],
    queryFn: () => policyService.getAll().then(policies => policies?.find(p => p.id === id)),
    enabled: !!id,
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (policyData: CreatePolicy) => {
      const validatedData = CreatePolicySchema.parse(policyData);
      // Transform the validated data to match the service interface
      const serviceData = {
        id: validatedData.id,
        name: validatedData.name,
        description: validatedData.description,
        permissions: validatedData.permissions,
        department_id: validatedData.department_id,
        user_type: validatedData.user_type,
      };
      return policyService.create(serviceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success("Policy created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating policy:", error);
      toast.error(error.message || "Failed to create policy");
    },
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (policyData: UpdatePolicy & { id: string }) => {
      const validatedData = UpdatePolicySchema.parse(policyData);
      const { id, ...updateData } = policyData;
      return policyService.update(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success("Policy updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating policy:", error);
      toast.error(error.message || "Failed to update policy");
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: policyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success("Policy deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting policy:", error);
      toast.error(error.message || "Failed to delete policy");
    },
  });
};

export const useAssignPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData: AssignPolicy) => {
      const validatedData = AssignPolicySchema.parse(assignmentData);
      return userPolicyService.assignPolicy(validatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-policies'] });
      toast.success("Policy assigned successfully");
    },
    onError: (error: any) => {
      console.error("Error assigning policy:", error);
      toast.error(error.message || "Failed to assign policy");
    },
  });
};

export const useRemovePolicyAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, policyId }: { userId: string; policyId: string }) => {
      return userPolicyService.removeAssignment(userId, policyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-policies'] });
      toast.success("Policy assignment removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing policy assignment:", error);
      toast.error(error.message || "Failed to remove policy assignment");
    },
  });
};

export const useUserPolicies = (userId: string) => {
  return useQuery({
    queryKey: ['user-policies', userId],
    queryFn: () => userPolicyService.getUserPolicies(userId),
    enabled: !!userId,
  });
};
