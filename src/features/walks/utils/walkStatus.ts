import type { WalkStatus } from '@/features/walks/types/walk';

export type WalkStatusAction = 'start' | 'pause' | 'resume' | 'stop';

/** Pure walk-status transitions, independent of Zustand. */
export function nextWalkStatus(
  status: WalkStatus,
  action: WalkStatusAction,
): WalkStatus {
  switch (action) {
    case 'start':
      return status === 'idle' ? 'active' : status;
    case 'pause':
      return status === 'active' ? 'paused' : status;
    case 'resume':
      return status === 'paused' ? 'active' : status;
    case 'stop':
      return 'idle';
    default:
      return status;
  }
}
