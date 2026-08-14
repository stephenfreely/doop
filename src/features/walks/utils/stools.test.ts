import type { StoolLog } from '@/features/walks/types/walk';
import { latestStool, upsertStool } from '@/features/walks/utils/stools';

function stool(overrides: Partial<StoolLog>): StoolLog {
  return {
    id: 'stool-1',
    recordedAt: '2026-08-14T09:00:00.000Z',
    rating: 4,
    ...overrides,
  };
}

describe('stools', () => {
  it('appends a new stool log', () => {
    const next = upsertStool([], stool({ id: 'a' }));
    expect(next).toHaveLength(1);
    expect(next[0]?.id).toBe('a');
  });

  it('replaces an existing stool log by id', () => {
    const next = upsertStool(
      [stool({ id: 'a', rating: 4 })],
      stool({ id: 'a', rating: 7, description: 'watery' }),
    );

    expect(next).toHaveLength(1);
    expect(next[0]?.rating).toBe(7);
    expect(next[0]?.description).toBe('watery');
  });

  it('returns the most recently recorded stool', () => {
    const latest = latestStool([
      stool({ id: 'older', recordedAt: '2026-08-14T08:00:00.000Z' }),
      stool({ id: 'newer', recordedAt: '2026-08-14T09:30:00.000Z', rating: 6 }),
    ]);

    expect(latest?.id).toBe('newer');
    expect(latest?.rating).toBe(6);
  });
});
