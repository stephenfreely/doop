import { create } from 'zustand';

import { calculateDistance } from '@/features/walks/utils/distance';
import { validateCoordinate } from '@/features/walks/utils/validateCoordinate';
import { nextWalkStatus } from '@/features/walks/utils/walkStatus';
import type { Coordinate, StoolLog, WalkStatus } from '@/features/walks/types/walk';

/**
 * Transient client/device state for the walk currently in progress.
 *
 * Intentionally NOT server state — the walk does not exist in Supabase
 * until the user presses Stop and we successfully create it.
 */
export type ActiveWalkState = {
  status: WalkStatus;
  dogId: string | null;
  startedAt: number | null;
  endedAt: number | null;
  route: Coordinate[];
  distanceMetres: number;
  stools: StoolLog[];
  /**
   * Set when createWalk mutation fails so we can retry without losing data.
   */
  pendingSaveError: string | null;

  startWalk: (dogId: string) => void;
  pauseWalk: () => void;
  resumeWalk: () => void;
  stopWalk: () => void;
  addCoordinate: (
    coordinate: Coordinate,
    accuracyMetres?: number | null,
  ) => void;
  addStool: (stool: StoolLog) => void;
  updateStool: (stool: StoolLog) => void;
  removeStool: (id: string) => void;
  setPendingSaveError: (message: string | null) => void;
  reset: () => void;
};

const initialState = {
  status: 'idle' as WalkStatus,
  dogId: null as string | null,
  startedAt: null as number | null,
  endedAt: null as number | null,
  route: [] as Coordinate[],
  distanceMetres: 0,
  stools: [] as StoolLog[],
  pendingSaveError: null as string | null,
};

export const useActiveWalkStore = create<ActiveWalkState>((set, get) => ({
  ...initialState,

  startWalk: (dogId) => {
    const { status, startedAt } = get();
    // startedAt is kept after Stop until reset(), so a failed save
    // cannot be overwritten by starting a new walk.
    if (status !== 'idle' || startedAt !== null) {
      return;
    }

    set({
      status: nextWalkStatus(status, 'start'),
      dogId,
      startedAt: Date.now(),
      endedAt: null,
      route: [],
      distanceMetres: 0,
      stools: [],
      pendingSaveError: null,
    });
  },

  pauseWalk: () => {
    const { status } = get();
    const next = nextWalkStatus(status, 'pause');
    if (next === status) {
      return;
    }

    set({ status: next });
  },

  resumeWalk: () => {
    const { status } = get();
    const next = nextWalkStatus(status, 'resume');
    if (next === status) {
      return;
    }

    set({ status: next });
  },

  stopWalk: () => {
    const { status } = get();
    if (status === 'idle') {
      return;
    }

    // Keep route/distance until reset() after a successful save.
    // This prevents data loss when the createWalk mutation fails.
    set({
      status: nextWalkStatus(status, 'stop'),
      endedAt: Date.now(),
    });
  },

  addCoordinate: (coordinate, accuracyMetres = null) => {
    const { status, route, distanceMetres } = get();
    if (status !== 'active') {
      return;
    }

    const previous = route.length > 0 ? route[route.length - 1] : null;
    const distanceFromPrevious = previous
      ? calculateDistance(previous, coordinate)
      : 0;

    const validation = validateCoordinate(coordinate, {
      accuracyMetres,
      previous,
      distanceFromPreviousMetres: previous ? distanceFromPrevious : undefined,
    });

    if (!validation.valid) {
      return;
    }

    set({
      route: [...route, coordinate],
      distanceMetres: previous
        ? distanceMetres + distanceFromPrevious
        : distanceMetres,
    });
  },

  addStool: (stool) => {
    set((state) => ({ stools: [...state.stools, stool] }));
  },

  updateStool: (stool) => {
    set((state) => ({
      stools: state.stools.map((item) => (item.id === stool.id ? stool : item)),
    }));
  },

  removeStool: (id) => {
    set((state) => ({
      stools: state.stools.filter((item) => item.id !== id),
    }));
  },

  setPendingSaveError: (message) => {
    set({ pendingSaveError: message });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
