
import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  department_id: z.string().optional(),
  join_date: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
