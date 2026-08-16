import { queryOptions, useQuery } from '@tanstack/react-query';

import { getWalk, getWalks } from '@/features/walks/api/walksApi';
import type { Walk } from '@/features/walks/types/walk';
import {
  transformWalk,
  transformWalks,
} from '@/features/walks/utils/transformWalk';
import type { UseSelectQueryOptions } from '@/lib/query';
import { queryKeys } from '@/lib/queryKeys';

async function fetchWalks(dogId: string) {
  return transformWalks(await getWalks(dogId));
}

async function fetchWalk(walkId: string) {
  const walk = await getWalk(walkId);
  return walk ? transformWalk(walk) : null;
}

export function getWalksQueryOptions(dogId: string | undefined) {
  return queryOptions({
    queryKey: queryKeys.walks(dogId ?? 'unknown'),
    queryFn: () => fetchWalks(dogId!),
    enabled: Boolean(dogId),
  });
}

export function useGetWalks<TData = Walk[]>(
  dogId: string | undefined,
  options?: UseSelectQueryOptions<Walk[], TData>,
) {
  return useQuery({
    queryKey: queryKeys.walks(dogId ?? 'unknown'),
    queryFn: () => fetchWalks(dogId!),
    ...options,
    enabled: options?.enabled ?? Boolean(dogId),
  });
}

export function getWalkQueryOptions(walkId: string | undefined) {
  return queryOptions({
    queryKey: queryKeys.walk(walkId ?? 'unknown'),
    queryFn: () => fetchWalk(walkId!),
    enabled: Boolean(walkId),
  });
}

export function useGetWalk<TData = Walk | null>(
  walkId: string | undefined,
  options?: UseSelectQueryOptions<Walk | null, TData>,
) {
  return useQuery({
    queryKey: queryKeys.walk(walkId ?? 'unknown'),
    queryFn: () => fetchWalk(walkId!),
    ...options,
    enabled: options?.enabled ?? Boolean(walkId),
  });
}
