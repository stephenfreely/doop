import { prettifyError, type ZodType } from 'zod';

/**
 * Validate an API payload with Zod. Throws on failure so TanStack Query
 * surfaces it as a query/mutation error instead of caching invalid data.
 */
export function parseApiResponse<T>(
  schema: ZodType<T>,
  data: unknown,
  entity: string,
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid ${entity} response:\n${prettifyError(result.error)}`,
    );
  }

  return result.data;
}
