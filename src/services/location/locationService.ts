import * as Location from 'expo-location';

import type { Coordinate } from '@/features/walks/types/walk';

export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type LocationUpdate = Coordinate & {
  accuracyMetres: number | null;
};

export type LocationTrackingCallback = (update: LocationUpdate) => void;

export class LocationPermissionError extends Error {
  constructor(message = 'Location permission was denied') {
    super(message);
    this.name = 'LocationPermissionError';
  }
}

export class LocationUnavailableError extends Error {
  constructor(message = 'Location services are unavailable') {
    super(message);
    this.name = 'LocationUnavailableError';
  }
}

let subscription: Location.LocationSubscription | null = null;

/**
 * Thin abstraction over Expo Location.
 * Screens depend on this service, not Expo Location directly —
 * so the native implementation can change without UI rewrites.
 */
export async function requestLocationPermission(): Promise<LocationPermissionStatus> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) {
    return 'granted';
  }

  if (!current.canAskAgain && current.status === 'denied') {
    return 'denied';
  }

  const requested = await Location.requestForegroundPermissionsAsync();
  if (requested.granted) {
    return 'granted';
  }

  return requested.status === 'undetermined' ? 'undetermined' : 'denied';
}

export async function getCurrentPosition(): Promise<LocationUpdate> {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp,
      accuracyMetres: position.coords.accuracy,
    };
  } catch {
    throw new LocationUnavailableError();
  }
}

export async function startLocationTracking(
  callback: LocationTrackingCallback,
): Promise<void> {
  if (subscription) {
    return;
  }

  const permission = await requestLocationPermission();
  if (permission !== 'granted') {
    throw new LocationPermissionError();
  }

  const enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) {
    throw new LocationUnavailableError();
  }

  subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 1,
    },
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
        accuracyMetres: position.coords.accuracy,
      });
    },
  );
}

export async function stopLocationTracking(): Promise<void> {
  if (subscription) {
    subscription.remove();
    subscription = null;
  }
}

export function isTracking(): boolean {
  return subscription !== null;
}
