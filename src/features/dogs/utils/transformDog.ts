import type { DogResponse } from '@/features/dogs/schemas/dogSchema';
import type { Dog } from '@/features/dogs/types/dog';

export function transformDog(dog: DogResponse): Dog {
  const breed = dog.breed?.trim() || undefined;
  const photoUrl = dog.photoUrl?.trim() || undefined;

  return {
    id: dog.id,
    ownerId: dog.ownerId,
    name: dog.name,
    createdAt: dog.createdAt,
    breed,
    photoUrl,
    breedLabel: breed ?? 'Good dog',
    initial: dog.name.trim().charAt(0).toUpperCase() || '?',
  };
}
