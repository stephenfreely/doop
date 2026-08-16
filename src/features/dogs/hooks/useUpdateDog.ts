import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateDog } from '@/features/dogs/api/dogsApi';
import { transformDog } from '@/features/dogs/utils/transformDog';
import { queryKeys } from '@/lib/queryKeys';

export function useUpdateDog(ownerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      breed?: string;
      photoUrl?: string;
    }) => {
      if (!ownerId) {
        throw new Error('You must be signed in to update a dog profile');
      }
      return transformDog(await updateDog(ownerId, input));
    },
    onSuccess: (dog) => {
      if (ownerId) {
        queryClient.setQueryData(queryKeys.dog(ownerId), dog);
      }
    },
  });
}
