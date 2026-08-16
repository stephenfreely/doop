import { queryOptions, useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/features/auth/api/authApi';
import type { AuthUser } from '@/features/auth/schemas/authSchema';
import type { UseSelectQueryOptions } from '@/lib/query';
import { queryKeys } from '@/lib/queryKeys';

export function getUserQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.user,
    queryFn: getCurrentUser,
  });
}

export function useGetUser<TData = AuthUser | null>(
  options?: UseSelectQueryOptions<AuthUser | null, TData>,
) {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: getCurrentUser,
    ...options,
  });
}
