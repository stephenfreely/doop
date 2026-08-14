import { transformWalk } from '@/features/walks/utils/transformWalk';
import type { WalkResponse } from '@/features/walks/schemas/walkSchema';

function walk(overrides: Partial<WalkResponse> = {}): WalkResponse {
  return {
    id: 'walk-1',
    dogId: 'dog-1',
    startedAt: '2026-08-14T10:00:00.000Z',
    endedAt: '2026-08-14T10:32:00.000Z',
    distanceMetres: 842,
    route: [],
    stools: [],
    ...overrides,
  };
}

describe('transformWalk', () => {
  it('adds duration, formatted labels, and stool derived fields', () => {
    const result = transformWalk(
      walk({
        stools: [
          {
            id: 'older',
            recordedAt: '2026-08-14T10:05:00.000Z',
            rating: 3,
          },
          {
            id: 'newer',
            recordedAt: '2026-08-14T10:20:00.000Z',
            rating: 4,
          },
        ],
      }),
    );

    expect(result.durationMs).toBe(32 * 60_000);
    expect(result.formattedDuration).toBe('32 min');
    expect(result.formattedDistance).toBe('842 m');
    expect(result.stoolCount).toBe(2);
    expect(result.latestStool?.id).toBe('newer');
    expect(result.latestStool?.ratingMeta.label).toBe('Ideal');
    expect(result.stools[0]?.ratingMeta.label).toBe('Cracked');
  });
});
