import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { AppText } from '@/components/Text/AppText';
import { WalkMap } from '@/features/walks/components/WalkMap';
import { useCompleteWalk } from '@/features/walks/hooks/useCompleteWalk';
import { useWalkTracking } from '@/features/walks/hooks/useWalkTracking';
import { useActiveWalkStore } from '@/stores/activeWalkStore';
import { formatDistance } from '@/utils/format';

export function ActiveWalkScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const [
    status,
    route,
    distanceMetres,
    stools,
    pendingSaveError,
    pauseWalk,
    resumeWalk,
  ] = useActiveWalkStore(
    useShallow((state) => [
      state.status,
      state.route,
      state.distanceMetres,
      state.stools,
      state.pendingSaveError,
      state.pauseWalk,
      state.resumeWalk,
    ]),
  );
  const { error: trackingError } = useWalkTracking();
  const { completeWalk, retrySave, discardWalk, isSaving } = useCompleteWalk();

  const isPaused = status === 'paused';
  const canRetrySave = Boolean(pendingSaveError) && status === 'idle';

  return (
    <View style={styles.screen}>
      <WalkMap
        route={route}
        showsUserLocation
        followsUserLocation={status === 'active'}
      />

      <View style={styles.panel}>
        <View style={styles.statusRow}>
          <Icon
            name={isPaused ? 'pause-circle-outline' : 'navigate-circle-outline'}
            size={18}
            color={theme.colors.primary}
          />
          <AppText variant="caption">
            {isPaused ? 'Paused' : status === 'active' ? 'Walking' : 'Stopped'}
          </AppText>
        </View>
        <AppText variant="stat">{formatDistance(distanceMetres)}</AppText>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Icon
              name="location-outline"
              size={14}
              color={theme.colors.textMuted}
            />
            <AppText variant="caption">{route.length} GPS points</AppText>
          </View>
          <View style={styles.meta}>
            <Icon
              name="medkit-outline"
              size={14}
              color={theme.colors.textMuted}
            />
            <AppText variant="caption">
              {stools.length === 0
                ? 'No stool logs'
                : `${stools.length} stool ${stools.length === 1 ? 'log' : 'logs'}`}
            </AppText>
          </View>
        </View>

        {trackingError && <AppText variant="caption">{trackingError}</AppText>}
        {pendingSaveError && (
          <AppText variant="caption">{pendingSaveError}</AppText>
        )}

        <View style={styles.actions}>
          {canRetrySave && (
            <>
              <Button
                title={isSaving ? 'Saving…' : 'Retry save'}
                icon="refresh-outline"
                disabled={isSaving}
                onPress={() => void retrySave()}
                style={styles.action}
              />
              <Button
                title="Discard"
                variant="danger"
                icon="trash-outline"
                disabled={isSaving}
                onPress={discardWalk}
                style={styles.action}
              />
            </>
          )}
          {!canRetrySave && (
            <>
              <Button
                title={isPaused ? 'Resume' : 'Pause'}
                variant="secondary"
                icon={isPaused ? 'play-outline' : 'pause-outline'}
                disabled={status === 'idle' || isSaving}
                onPress={isPaused ? resumeWalk : pauseWalk}
                style={styles.action}
              />
              <Button
                title={isSaving ? 'Saving…' : 'Stop Walk'}
                variant="danger"
                icon="stop-circle-outline"
                disabled={isSaving}
                onPress={() => void completeWalk()}
                style={styles.action}
              />
            </>
          )}
        </View>

        {!canRetrySave && (
          <Button
            title="Log stool"
            variant="secondary"
            icon="camera-outline"
            disabled={isSaving}
            onPress={() => router.push('/walk/stool')}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  panel: {
    padding: theme.padding.screen,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  action: {
    flex: 1,
  },
}));
