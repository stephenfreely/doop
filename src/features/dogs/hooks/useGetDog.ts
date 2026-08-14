import { useQuery } from '@tanstack/react-query';

import { getDog } from '@/features/dogs/api/dogsApi';
import type { DogResponse } from '@/features/dogs/schemas/dogSchema';
import type { Dog } from '@/features/dogs/types/dog';
import { transformDog } from '@/features/dogs/utils/transformDog';
import {
  createParsedQueryOptions,
  type UseSelectQueryOptions,
} from '@/lib/query';
import { queryKeys } from '@/lib/queryKeys';

export function getDogQueryOptions<TResult = Dog | null>(
  ownerId: string | undefined,
  options?: UseSelectQueryOptions<Dog | null, TResult>,
) {
  const { select, ...rest } = options ?? {};

  return createParsedQueryOptions<DogResponse | null, Dog | null, TResult>({
    queryKey: queryKeys.dog(ownerId ?? 'unknown'),
    queryFn: () => getDog(ownerId!),
    transform: (dog) => (dog ? transformDog(dog) : null),
    select,
    ...rest,
    enabled: rest.enabled ?? Boolean(ownerId),
  });
}

export function useGetDog<TResult = Dog | null>(
  ownerId: string | undefined,
  options?: UseSelectQueryOptions<Dog | null, TResult>,
) {
  return useQuery(getDogQueryOptions(ownerId, options));
}
