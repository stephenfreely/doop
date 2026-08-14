import { z } from 'zod';

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timestamp: z.number().positive(),
});

export const stoolRatingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
]);

export const stoolLogSchema = z.object({
  id: z.string().min(1),
  recordedAt: z.string().min(1),
  photoUri: z.string().min(1).optional(),
  rating: stoolRatingSchema,
  description: z.string().max(500).optional(),
});

export const walkSchema = z.object({
  id: z.string().min(1),
  dogId: z.string().min(1),
  startedAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
  endedAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
  distanceMetres: z.number().min(0),
  route: z.array(coordinateSchema),
  notes: z.string().optional(),
  stools: z.array(stoolLogSchema).default([]),
});

export const createWalkInputSchema = z.object({
  dogId: z.string().min(1),
  startedAt: z.string().min(1),
  endedAt: z.string().min(1),
  distanceMetres: z.number().min(0),
  route: z.array(coordinateSchema).min(1, 'Walk needs at least one GPS point'),
  notes: z.string().optional(),
  stools: z.array(stoolLogSchema).optional(),
});

export const updateWalkInputSchema = z.object({
  notes: z.string().optional(),
  stools: z.array(stoolLogSchema).optional(),
});

export type Coordinate = z.infer<typeof coordinateSchema>;
export type StoolRating = z.infer<typeof stoolRatingSchema>;
export type StoolLog = z.infer<typeof stoolLogSchema>;
export type WalkResponse = z.infer<typeof walkSchema>;
export type CreateWalkInput = z.infer<typeof createWalkInputSchema>;
export type UpdateWalkInput = z.infer<typeof updateWalkInputSchema>;
export type StoolLogInput = z.infer<typeof stoolLogSchema>;
