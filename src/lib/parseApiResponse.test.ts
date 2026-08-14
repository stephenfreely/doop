import { z } from 'zod';

import { parseApiResponse } from '@/lib/parseApiResponse';

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

describe('parseApiResponse', () => {
  it('returns the parsed payload when it matches the schema', () => {
    expect(
      parseApiResponse(schema, { id: 'dog-1', name: 'Mabel' }, 'dog'),
    ).toEqual({ id: 'dog-1', name: 'Mabel' });
  });

  it('throws a readable error when the payload is invalid', () => {
    expect(() => parseApiResponse(schema, { id: 'dog-1' }, 'dog')).toThrow(
      /Invalid dog response/,
    );
  });
});
