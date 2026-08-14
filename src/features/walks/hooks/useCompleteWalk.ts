import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useCreateWalk } from '@/features/walks/hooks/useWalkMutations';
import { stopLocationTracking } from '@/services/location/locationService';
import { useActiveWalkStore } from '@/stores/activeWalkStore';

export function useCompleteWalk() {
  const router = useRouter();
  const createWalk = useCreateWalk();
  const [isSaving, setIsSaving] = useState(false);

  async function completeWalk() {
    setIsSaving(true);
    await stopLocationTracking();

    const store = useActiveWalkStore.getState();

    if (!store.dogId || !store.startedAt) {
      store.setPendingSaveError('Walk is missing a start time or dog.');
      setIsSaving(false);
      return;
    }

    if (store.route.length < 1) {
      store.pauseWalk();
      store.setPendingSaveError(
        'Need at least one GPS point before saving. Resume walking, then stop again.',
      );
      setIsSaving(false);
      return;
    }

    store.stopWalk();
    const snapshot = useActiveWalkStore.getState();
    const dogId = snapshot.dogId;
    const startedAt = snapshot.startedAt;

    if (!dogId || !startedAt) {
      store.setPendingSaveError('Walk is missing a start time or dog.');
      setIsSaving(false);
      return;
    }

    try {
      const walk = await createWalk.mutateAsync({
        dogId,
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date(snapshot.endedAt ?? Date.now()).toISOString(),
        distanceMetres: snapshot.distanceMetres,
        route: snapshot.route,
        stools: snapshot.stools,
      });

      store.reset();
      router.replace(`/walk/${walk.id}`);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : 'Could not save the walk. Your route is still on this device.';
      useActiveWalkStore.getState().setPendingSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function retrySave() {
    await completeWalk();
  }

  function discardWalk() {
    void stopLocationTracking();
    useActiveWalkStore.getState().reset();
    router.replace('/');
  }

  return {
    completeWalk,
    retrySave,
    discardWalk,
    isSaving: isSaving || createWalk.isPending,
  };
}
