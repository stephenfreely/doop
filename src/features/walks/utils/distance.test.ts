import {
  accumulateDistance,
  calculateDistance,
} from '@/features/walks/utils/distance';
import type { Coordinate } from '@/features/walks/types/walk';

function point(latitude: number, longitude: number, timestamp = 1): Coordinate {
  return { latitude, longitude, timestamp };
}

describe('calculateDistance', () => {
  it('returns 0 for the same coordinate', () => {
    const origin = point(0, 0);
    expect(calculateDistance(origin, origin)).toBe(0);
  });

  it('uses the Haversine formula for 0.001° of latitude', () => {
    const from = point(0, 0);
    const to = point(0.001, 0);
    // 1° latitude ≈ 111_194.9 m at the equator with R = 6_371_000
    expect(calculateDistance(from, to)).toBeCloseTo(111.195, 2);
  });
});

describe('accumulateDistance', () => {
  it('returns 0 for fewer than two points', () => {
    expect(accumulateDistance([])).toBe(0);
    expect(accumulateDistance([point(0, 0)])).toBe(0);
  });

  it('sums consecutive segments', () => {
    const route = [point(0, 0, 1), point(0.001, 0, 2), point(0.002, 0, 3)];
    const total = accumulateDistance(route);
    expect(total).toBeCloseTo(222.39, 1);
  });
});
