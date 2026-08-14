import type { Coordinate } from '@/features/walks/types/walk';

const EARTH_RADIUS_METRES = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Haversine distance between two GPS coordinates in metres.
 * Pure function — easy to unit test and independent of React.
 */
export function calculateDistance(
  previousCoordinate: Coordinate,
  currentCoordinate: Coordinate,
): number {
  const lat1 = toRadians(previousCoordinate.latitude);
  const lat2 = toRadians(currentCoordinate.latitude);
  const deltaLat = toRadians(
    currentCoordinate.latitude - previousCoordinate.latitude,
  );
  const deltaLon = toRadians(
    currentCoordinate.longitude - previousCoordinate.longitude,
  );

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METRES * c;
}

/**
 * Accumulate distance across an ordered route of coordinates.
 */
export function accumulateDistance(route: Coordinate[]): number {
  if (route.length < 2) {
    return 0;
  }

  let total = 0;
  for (let i = 1; i < route.length; i += 1) {
    total += calculateDistance(route[i - 1], route[i]);
  }
  return total;
}
