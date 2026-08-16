import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Query options a hook consumer may pass, excluding identity fields the hook
 * owns. `select` is typed against the transformed view model stored in the
 * query cache.
 */
export type UseSelectQueryOptions<TView, TResult, TError = Error> = Omit<
  UseQueryOptions<TView, TError, TResult>,
  'queryKey' | 'queryFn'
>;
