import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/features/auth/api/authApi';
import type { AuthUser } from '@/features/auth/schemas/authSchema';
import {
  createParsedQueryOptions,
  type UseSelectQueryOptions,
} from '@/lib/query';
import { queryKeys } from '@/lib/queryKeys';

export function getUserQueryOptions<TResult = AuthUser | null>(
  options?: UseSelectQueryOptions<AuthUser | null, TResult>,
) {
  const { select, ...rest } = options ?? {};

  return createParsedQueryOptions<AuthUser | null, AuthUser | null, TResult>({
    queryKey: queryKeys.user,
    queryFn: getCurrentUser,
    transform: (user) => user,
    select,
    ...rest,
  });
}

export function useGetUser<TResult = AuthUser | null>(
  options?: UseSelectQueryOptions<AuthUser | null, TResult>,
) {
  return useQuery(getUserQueryOptions(options));
}
