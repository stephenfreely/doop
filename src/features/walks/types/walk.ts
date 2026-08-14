import type {
  StoolLog,
  WalkResponse,
} from '@/features/walks/schemas/walkSchema';
import type { StoolRatingMeta } from '@/features/walks/utils/stoolRating';

export type {
  Coordinate,
  StoolLog,
  StoolRating,
} from '@/features/walks/schemas/walkSchema';

export type WalkStatus = 'idle' | 'active' | 'paused';

export type Stool = StoolLog & {
  ratingMeta: StoolRatingMeta;
  formattedRecordedAt: string;
};

export type Walk = Omit<WalkResponse, 'stools'> & {
  durationMs: number;
  formattedDuration: string;
  formattedDistance: string;
  formattedStartedAt: string;
  stoolCount: number;
  stools: Stool[];
  latestStool: Stool | undefined;
};
