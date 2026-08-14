import type { DogResponse } from '@/features/dogs/schemas/dogSchema';

export type Dog = Omit<DogResponse, 'breed' | 'photoUrl'> & {
  breed?: string;
  photoUrl?: string;
  breedLabel: string;
  initial: string;
};
