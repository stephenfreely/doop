import { z } from 'zod';

export const dogSchema = z.object({
  name: z.string().min(1, 'Dog name is required').max(60),
  breed: z.string().max(60).optional().or(z.literal('')),
  photoUrl: z.string().optional().or(z.literal('')),
});

export const dogResponseSchema = z.object({
  id: z.string().min(1),
  ownerId: z.string().min(1),
  name: z.string().min(1),
  breed: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  createdAt: z.string().min(1),
});

export type DogFormValues = z.infer<typeof dogSchema>;
export type DogResponse = z.infer<typeof dogResponseSchema>;
