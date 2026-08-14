import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  LocationPermissionError,
  LocationUnavailableError,
  requestLocationPermission,
} from '@/services/location/locationService';
import { useActiveWalkStore } from '@/stores/activeWalkStore';

export function useStartWalk() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startWalk(dogId: string) {
    const { status, startedAt } = useActiveWalkStore.getState();

    if (status !== 'idle' || startedAt !== null) {
      router.push('/walk/active');
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const permission = await requestLocationPermission();
      if (permission !== 'granted') {
        throw new LocationPermissionError();
      }

      useActiveWalkStore.getState().startWalk(dogId);
      router.push('/walk/active');
    } catch (caught) {
      if (caught instanceof LocationPermissionError) {
        setError(
          'Location permission is required to start a walk. Enable it in Settings and try again.',
        );
      } else if (caught instanceof LocationUnavailableError) {
        setError('Location is unavailable. Turn on GPS and try again.');
      } else {
        setError('Could not start the walk. Try again.');
      }
    } finally {
      setIsStarting(false);
    }
  }

  return { startWalk, isStarting, error, clearError: () => setError(null) };
}
