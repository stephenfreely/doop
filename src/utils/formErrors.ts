import { ZodError } from 'zod';

export function fieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!result[key]) {
      result[key] = issue.message;
    }
  }

  return result;
}
