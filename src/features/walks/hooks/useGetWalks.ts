import { useQuery } from '@tanstack/react-query';

import { getWalk, getWalks } from '@/features/walks/api/walksApi';
import type { WalkResponse } from '@/features/walks/schemas/walkSchema';
import type { Walk } from '@/features/walks/types/walk';
import {
  transformWalk,
  transformWalks,
} from '@/features/walks/utils/transformWalk';
import {
  createParsedQueryOptions,
  type UseSelectQueryOptions,
} from '@/lib/query';
import { queryKeys } from '@/lib/queryKeys';

export function getWalksQueryOptions<TResult = Walk[]>(
  dogId: string | undefined,
  options?: UseSelectQueryOptions<Walk[], TResult>,
) {
  const { select, ...rest } = options ?? {};

  return createParsedQueryOptions<WalkResponse[], Walk[], TResult>({
    queryKey: queryKeys.walks(dogId ?? 'unknown'),
    queryFn: () => getWalks(dogId!),
    transform: transformWalks,
    select,
    ...rest,
    enabled: rest.enabled ?? Boolean(dogId),
  });
}

export function useGetWalks<TResult = Walk[]>(
  dogId: string | undefined,
  options?: UseSelectQueryOptions<Walk[], TResult>,
) {
  return useQuery(getWalksQueryOptions(dogId, options));
}

export function getWalkQueryOptions<TResult = Walk | null>(
  walkId: string | undefined,
  options?: UseSelectQueryOptions<Walk | null, TResult>,
) {
  const { select, ...rest } = options ?? {};

  return createParsedQueryOptions<WalkResponse | null, Walk | null, TResult>({
    queryKey: queryKeys.walk(walkId ?? 'unknown'),
    queryFn: () => getWalk(walkId!),
    transform: (walk) => (walk ? transformWalk(walk) : null),
    select,
    ...rest,
    enabled: rest.enabled ?? Boolean(walkId),
  });
}

export function useGetWalk<TResult = Walk | null>(
  walkId: string | undefined,
  options?: UseSelectQueryOptions<Walk | null, TResult>,
) {
  return useQuery(getWalkQueryOptions(walkId, options));
}
