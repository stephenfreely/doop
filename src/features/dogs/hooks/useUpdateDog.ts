import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateDog } from '@/features/dogs/api/dogsApi';
import { queryKeys } from '@/lib/queryKeys';

export function useUpdateDog(ownerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      name: string;
      breed?: string;
      photoUrl?: string;
    }) => {
      if (!ownerId) {
        throw new Error('You must be signed in to update a dog profile');
      }
      return updateDog(ownerId, input);
    },
    onSuccess: (dog) => {
      if (ownerId) {
        queryClient.setQueryData(queryKeys.dog(ownerId), dog);
      }
    },
  });
}
