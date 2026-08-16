import { queryOptions, useQuery } from '@tanstack/react-query';

import { getDog } from '@/features/dogs/api/dogsApi';
import type { Dog } from '@/features/dogs/types/dog';
import { transformDog } from '@/features/dogs/utils/transformDog';
import type { UseSelectQueryOptions } from '@/lib/query';
import { queryKeys } from '@/lib/queryKeys';

async function fetchDog(ownerId: string) {
  const dog = await getDog(ownerId);
  return dog ? transformDog(dog) : null;
}

export function getDogQueryOptions(ownerId: string | undefined) {
  return queryOptions({
    queryKey: queryKeys.dog(ownerId ?? 'unknown'),
    queryFn: () => fetchDog(ownerId!),
    enabled: Boolean(ownerId),
  });
}

export function useGetDog<TData = Dog | null>(
  ownerId: string | undefined,
  options?: UseSelectQueryOptions<Dog | null, TData>,
) {
  return useQuery({
    queryKey: queryKeys.dog(ownerId ?? 'unknown'),
    queryFn: () => fetchDog(ownerId!),
    ...options,
    enabled: options?.enabled ?? Boolean(ownerId),
  });
}
