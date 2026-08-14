import {
  queryOptions,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';

/**
 * Query options a hook consumer may pass, excluding identity fields the hook
 * owns. `select` is typed against the transformed view model (not the raw
 * parsed API payload), matching the freely-web useQuery pattern.
 */
export type UseSelectQueryOptions<TView, TResult, TError = Error> = Omit<
  UseQueryOptions<TView, TError, TResult>,
  'queryKey' | 'queryFn'
> & {
  select?: (data: TView) => TResult;
};

/**
 * Run after a successful Zod parse: always map API data into the view model,
 * then apply an optional observer `select`.
 */
export function selectWithTransform<TParsed, TView, TResult = TView>(
  transform: (data: TParsed) => TView,
  select?: (data: TView) => TResult,
) {
  return (data: TParsed): TResult => {
    const view = transform(data);
    return (select ? select(view) : view) as TResult;
  };
}

type ParsedQueryConfig<TParsed, TView, TResult, TKey extends QueryKey> = {
  queryKey: TKey;
  queryFn: () => Promise<TParsed>;
  transform: (data: TParsed) => TView;
  select?: (data: TView) => TResult;
} & Omit<
  UseQueryOptions<TView, Error, TResult, TKey>,
  'queryKey' | 'queryFn' | 'select'
>;

/**
 * Cache the Zod-parsed API payload; derive the view model (and any extra
 * observer select) in `select`.
 */
export function createParsedQueryOptions<
  TParsed,
  TView,
  TResult = TView,
  TKey extends QueryKey = QueryKey,
>({
  queryKey,
  queryFn,
  transform,
  select,
  ...rest
}: ParsedQueryConfig<TParsed, TView, TResult, TKey>) {
  return queryOptions({
    queryKey,
    queryFn,
    ...(rest as Omit<
      UseQueryOptions<TParsed, Error, TResult, TKey>,
      'queryKey' | 'queryFn' | 'select'
    >),
    select: selectWithTransform(transform, select),
  });
}
