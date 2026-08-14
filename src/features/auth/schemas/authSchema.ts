import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const authUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().or(z.literal('')),
});

export type AuthFormValues = z.infer<typeof authSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
