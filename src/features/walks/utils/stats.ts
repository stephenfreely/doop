import type { WalkResponse } from '@/features/walks/schemas/walkSchema';
import { isWithinCurrentWeek } from '@/utils/dates';

export type WalkStats = {
  walksThisWeek: number;
  distanceThisWeekMetres: number;
  totalWalks: number;
  totalDistanceMetres: number;
};

/**
 * Derive walking statistics from completed walks.
 * Pure function — easy to unit test and extend (pace, longest walk, etc.).
 */
export function calculateWalkStats(
  walks: Pick<WalkResponse, 'startedAt' | 'distanceMetres'>[],
  now: Date = new Date(),
): WalkStats {
  const thisWeek = walks.filter((walk) =>
    isWithinCurrentWeek(walk.startedAt, now),
  );

  return {
    walksThisWeek: thisWeek.length,
    distanceThisWeekMetres: thisWeek.reduce(
      (sum, walk) => sum + walk.distanceMetres,
      0,
    ),
    totalWalks: walks.length,
    totalDistanceMetres: walks.reduce(
      (sum, walk) => sum + walk.distanceMetres,
      0,
    ),
  };
}
