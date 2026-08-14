import { useActiveWalkStore } from '@/stores/activeWalkStore';
import type { Coordinate } from '@/features/walks/types/walk';

function point(
  latitude: number,
  longitude: number,
  timestamp: number,
): Coordinate {
  return { latitude, longitude, timestamp };
}

describe('activeWalkStore', () => {
  beforeEach(() => {
    useActiveWalkStore.getState().reset();
  });

  it('starts a walk from idle', () => {
    useActiveWalkStore.getState().startWalk('dog-1');
    const state = useActiveWalkStore.getState();

    expect(state.status).toBe('active');
    expect(state.dogId).toBe('dog-1');
    expect(state.startedAt).toEqual(expect.any(Number));
    expect(state.route).toEqual([]);
  });

  it('pauses and resumes without losing the route', () => {
    const store = useActiveWalkStore.getState();
    store.startWalk('dog-1');
    store.addCoordinate(point(-33.8688, 151.2093, 1_000));

    store.pauseWalk();
    expect(useActiveWalkStore.getState().status).toBe('paused');

    store.addCoordinate(point(-33.869, 151.2095, 2_000));
    expect(useActiveWalkStore.getState().route).toHaveLength(1);

    store.resumeWalk();
    expect(useActiveWalkStore.getState().status).toBe('active');
  });

  it('accumulates distance from valid coordinates', () => {
    const store = useActiveWalkStore.getState();
    store.startWalk('dog-1');
    store.addCoordinate(point(0, 0, 1_000));
    store.addCoordinate(point(0.001, 0, 81_000));

    const state = useActiveWalkStore.getState();
    expect(state.route).toHaveLength(2);
    expect(state.distanceMetres).toBeCloseTo(111.195, 2);
  });

  it('keeps the route after stop so a failed save can retry', () => {
    const store = useActiveWalkStore.getState();
    store.startWalk('dog-1');
    store.addCoordinate(point(0, 0, 1_000));
    store.stopWalk();

    const state = useActiveWalkStore.getState();
    expect(state.status).toBe('idle');
    expect(state.route).toHaveLength(1);
    expect(state.startedAt).not.toBeNull();
    expect(state.endedAt).not.toBeNull();
  });

  it('does not start a new walk until the previous one is reset', () => {
    const store = useActiveWalkStore.getState();
    store.startWalk('dog-1');
    store.addCoordinate(point(0, 0, 1_000));
    store.stopWalk();
    store.startWalk('dog-2');

    expect(useActiveWalkStore.getState().dogId).toBe('dog-1');
  });

  it('keeps stool logs on the active walk until reset', () => {
    const store = useActiveWalkStore.getState();
    store.startWalk('dog-1');
    store.addStool({
      id: 'stool-1',
      recordedAt: '2026-08-14T09:00:00.000Z',
      rating: 4,
      description: 'normal',
    });

    expect(useActiveWalkStore.getState().stools).toHaveLength(1);

    store.updateStool({
      id: 'stool-1',
      recordedAt: '2026-08-14T09:00:00.000Z',
      rating: 6,
      description: 'mushy',
    });
    expect(useActiveWalkStore.getState().stools[0]?.rating).toBe(6);

    store.removeStool('stool-1');
    expect(useActiveWalkStore.getState().stools).toEqual([]);
  });
});
