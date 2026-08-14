import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  LocationPermissionError,
  LocationUnavailableError,
  startLocationTracking,
  stopLocationTracking,
} from '@/services/location/locationService';
import { useActiveWalkStore } from '@/stores/activeWalkStore';

/**
 * Bridges the location service and the active-walk store.
 * Screens only care about start / stop / incoming coordinates.
 */
export function useWalkTracking() {
  const [status, addCoordinate] = useActiveWalkStore(
    useShallow((state) => [state.status, state.addCoordinate]),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'active') {
      void stopLocationTracking();
      return;
    }

    let cancelled = false;

    startLocationTracking((update) => {
      addCoordinate(
        {
          latitude: update.latitude,
          longitude: update.longitude,
          timestamp: update.timestamp,
        },
        update.accuracyMetres,
      );
    })
      .then(() => {
        if (!cancelled) {
          setError(null);
        }
      })
      .catch((caught: unknown) => {
        if (cancelled) {
          return;
        }

        if (caught instanceof LocationPermissionError) {
          setError(
            'Location permission was denied. Enable it in Settings to track a walk.',
          );
          return;
        }

        if (caught instanceof LocationUnavailableError) {
          setError('Location services are unavailable. Check that GPS is on.');
          return;
        }

        setError('Could not start GPS tracking. Try again.');
      });

    return () => {
      cancelled = true;
      void stopLocationTracking();
    };
  }, [addCoordinate, status]);

  return { error };
}
