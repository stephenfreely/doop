import type {
  StoolLog,
  WalkResponse,
} from '@/features/walks/schemas/walkSchema';
import type { Stool, Walk } from '@/features/walks/types/walk';
import { getStoolRatingMeta } from '@/features/walks/utils/stoolRating';
import { latestStool } from '@/features/walks/utils/stools';
import { formatDistance, formatDuration, formatWalkDate } from '@/utils/format';

export function transformStool(stool: StoolLog): Stool {
  return {
    ...stool,
    ratingMeta: getStoolRatingMeta(stool.rating),
    formattedRecordedAt: formatWalkDate(stool.recordedAt),
  };
}

export function transformWalk(walk: WalkResponse): Walk {
  const start = new Date(walk.startedAt).getTime();
  const end = new Date(walk.endedAt).getTime();
  const durationMs =
    Number.isFinite(start) && Number.isFinite(end)
      ? Math.max(0, end - start)
      : 0;
  const stools = walk.stools.map(transformStool);

  return {
    ...walk,
    durationMs,
    formattedDuration: formatDuration(durationMs),
    formattedDistance: formatDistance(walk.distanceMetres),
    formattedStartedAt: formatWalkDate(walk.startedAt),
    stoolCount: stools.length,
    stools,
    latestStool: latestStool(stools),
  };
}

export function transformWalks(walks: WalkResponse[]): Walk[] {
  return walks.map(transformWalk);
}
