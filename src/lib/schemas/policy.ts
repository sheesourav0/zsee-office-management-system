
import { z } from "zod";

export const CreatePolicySchema = z.object({
  id: z.string().min(1, "Policy ID is required"),
  name: z.string().min(2, "Policy name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
  department_id: z.string().nullable(),
  user_type: z.enum([
    'department-staff',
    'department-manager', 
    'department-supervisor',
    'global-admin',
    'accountant',
    'hr-manager',
    'viewer'
  ]),
});

export const UpdatePolicySchema = z.object({
  name: z.string().min(2, "Policy name must be at least 2 characters").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
  permissions: z.array(z.string()).min(1, "At least one permission is required").optional(),
  department_id: z.string().nullable().optional(),
  user_type: z.enum([
    'department-staff',
    'department-manager', 
    'department-supervisor',
    'global-admin',
    'accountant',
    'hr-manager',
    'viewer'
  ]).optional(),
});

export const AssignPolicySchema = z.object({
  user_id: z.string().uuid("Invalid user ID"),
  policy_id: z.string().min(1, "Policy ID is required"),
  department_id: z.string().nullable(),
});

export type CreatePolicy = z.infer<typeof CreatePolicySchema>;
export type UpdatePolicy = z.infer<typeof UpdatePolicySchema>;
export type AssignPolicy = z.infer<typeof AssignPolicySchema>;
