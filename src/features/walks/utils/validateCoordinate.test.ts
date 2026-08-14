import { calculateDistance } from '@/features/walks/utils/distance';
import { validateCoordinate } from '@/features/walks/utils/validateCoordinate';
import type { Coordinate } from '@/features/walks/types/walk';

const origin: Coordinate = {
  latitude: -33.8688,
  longitude: 151.2093,
  timestamp: 1_000,
};

describe('validateCoordinate', () => {
  it('accepts a valid first coordinate', () => {
    expect(validateCoordinate(origin)).toEqual({ valid: true });
  });

  it('rejects non-finite values', () => {
    expect(
      validateCoordinate({ latitude: Number.NaN, longitude: 0, timestamp: 1 }),
    ).toEqual({ valid: false, reason: 'Non-finite coordinate values' });
  });

  it('rejects latitude out of range', () => {
    expect(
      validateCoordinate({ latitude: 100, longitude: 0, timestamp: 1 }),
    ).toEqual({ valid: false, reason: 'Latitude out of range' });
  });

  it('rejects inaccurate GPS updates', () => {
    expect(validateCoordinate(origin, { accuracyMetres: 80 })).toEqual({
      valid: false,
      reason: 'Accuracy too low',
    });
  });

  it('rejects movement below the 1m threshold', () => {
    const next = {
      ...origin,
      latitude: origin.latitude + 0.000001,
      timestamp: 2_000,
    };
    const distance = calculateDistance(origin, next);

    expect(
      validateCoordinate(next, {
        previous: origin,
        distanceFromPreviousMetres: distance,
      }),
    ).toEqual({ valid: false, reason: 'Movement below minimum threshold' });
  });

  it('rejects implausible GPS jumps', () => {
    const jumped: Coordinate = {
      latitude: origin.latitude + 0.1,
      longitude: origin.longitude,
      timestamp: origin.timestamp + 1_000,
    };
    const distance = calculateDistance(origin, jumped);

    expect(
      validateCoordinate(jumped, {
        previous: origin,
        distanceFromPreviousMetres: distance,
      }),
    ).toEqual({ valid: false, reason: 'Implausible GPS jump' });
  });

  it('accepts a realistic walking update', () => {
    const next: Coordinate = {
      latitude: origin.latitude + 0.00003,
      longitude: origin.longitude,
      timestamp: origin.timestamp + 2_000,
    };
    const distance = calculateDistance(origin, next);

    expect(
      validateCoordinate(next, {
        previous: origin,
        distanceFromPreviousMetres: distance,
        accuracyMetres: 12,
      }),
    ).toEqual({ valid: true });
  });
});
