import type { Coordinate } from '@/features/walks/types/walk';

const MAX_ACCURACY_METRES = 50;
const MIN_MOVEMENT_METRES = 1;
const MAX_SPEED_METRES_PER_SECOND = 15; // ~54 km/h — reject GPS jumps

type ValidationResult = { valid: true } | { valid: false; reason: string };

type ValidateOptions = {
  accuracyMetres?: number | null;
  previous?: Coordinate | null;
  distanceFromPreviousMetres?: number;
};

/**
 * Reject obviously inaccurate or impossible GPS updates.
 * Keeps validation at the boundary before coordinates enter the store.
 */
export function validateCoordinate(
  coordinate: Coordinate,
  options: ValidateOptions = {},
): ValidationResult {
  const { latitude, longitude, timestamp } = coordinate;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(timestamp)
  ) {
    return { valid: false, reason: 'Non-finite coordinate values' };
  }

  if (latitude < -90 || latitude > 90) {
    return { valid: false, reason: 'Latitude out of range' };
  }

  if (longitude < -180 || longitude > 180) {
    return { valid: false, reason: 'Longitude out of range' };
  }

  if (
    options.accuracyMetres != null &&
    options.accuracyMetres > MAX_ACCURACY_METRES
  ) {
    return { valid: false, reason: 'Accuracy too low' };
  }

  const previous = options.previous;
  if (previous) {
    if (timestamp < previous.timestamp) {
      return { valid: false, reason: 'Timestamp older than previous' };
    }

    const distance = options.distanceFromPreviousMetres ?? 0;

    if (distance < MIN_MOVEMENT_METRES) {
      return { valid: false, reason: 'Movement below minimum threshold' };
    }

    const elapsedSeconds = (timestamp - previous.timestamp) / 1000;
    if (elapsedSeconds > 0) {
      const speed = distance / elapsedSeconds;
      if (speed > MAX_SPEED_METRES_PER_SECOND) {
        return { valid: false, reason: 'Implausible GPS jump' };
      }
    }
  }

  return { valid: true };
}
