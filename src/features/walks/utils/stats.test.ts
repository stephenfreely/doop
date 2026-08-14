import type { WalkResponse } from '@/features/walks/schemas/walkSchema';
import { calculateWalkStats } from '@/features/walks/utils/stats';

function walk(overrides: Partial<WalkResponse>): WalkResponse {
  return {
    id: 'walk-1',
    dogId: 'dog-1',
    startedAt: '2026-08-12T10:00:00.000Z',
    endedAt: '2026-08-12T10:30:00.000Z',
    distanceMetres: 1000,
    route: [],
    stools: [],
    ...overrides,
  };
}

describe('calculateWalkStats', () => {
  const now = new Date('2026-08-14T08:00:00.000Z');

  it('counts walks and distance for the current week', () => {
    const walks = [
      walk({
        id: 'this-week',
        startedAt: '2026-08-12T10:00:00.000Z',
        distanceMetres: 1500,
      }),
      walk({
        id: 'last-week',
        startedAt: '2026-08-02T10:00:00.000Z',
        distanceMetres: 4000,
      }),
    ];

    expect(calculateWalkStats(walks, now)).toEqual({
      walksThisWeek: 1,
      distanceThisWeekMetres: 1500,
      totalWalks: 2,
      totalDistanceMetres: 5500,
    });
  });
});
