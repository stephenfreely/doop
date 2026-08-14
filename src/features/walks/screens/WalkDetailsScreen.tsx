import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Icon } from '@/components/Icon/Icon';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { Screen } from '@/components/Screen/Screen';
import { AppText } from '@/components/Text/AppText';
import { StoolLogCard } from '@/features/walks/components/StoolLogCard';
import { WalkMap } from '@/features/walks/components/WalkMap';
import { useGetWalk } from '@/features/walks/hooks/useGetWalks';
import { useDeleteWalk } from '@/features/walks/hooks/useWalkMutations';

export function WalkDetailsScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: walk, isLoading, isError, error, refetch } = useGetWalk(id);
  const deleteWalk = useDeleteWalk();

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading walk…" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState
          title="Could not load walk"
          message={error.message}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  if (!walk) {
    return (
      <Screen>
        <ErrorState
          title="Walk not found"
          message="This walk may have been deleted."
          onRetry={() => router.replace('/history')}
        />
      </Screen>
    );
  }

  const stools = walk.stools;

  async function onDelete() {
    if (!walk) {
      return;
    }
    await deleteWalk.mutateAsync(walk.id);
    router.replace('/history');
  }

  return (
    <Screen>
      <AppText variant="title">{walk.formattedDistance}</AppText>
      <View style={styles.metaRow}>
        <Icon name="time-outline" size={16} color={theme.colors.textMuted} />
        <AppText variant="caption">
          {walk.formattedStartedAt} · {walk.formattedDuration}
        </AppText>
      </View>

      <View style={styles.mapWrap}>
        <WalkMap route={walk.route} />
      </View>

      <Card>
        <View style={styles.sectionTitle}>
          <Icon name="map-outline" size={18} color={theme.colors.text} />
          <AppText variant="subtitle">Details</AppText>
        </View>
        <AppText>Distance: {walk.formattedDistance}</AppText>
        <AppText>Duration: {walk.formattedDuration}</AppText>
        <AppText>Points: {walk.route.length}</AppText>
        {walk.notes && <AppText>Notes: {walk.notes}</AppText>}
      </Card>

      <Card>
        <View style={styles.sectionTitle}>
          <Icon name="medkit-outline" size={18} color={theme.colors.text} />
          <AppText variant="subtitle">Stool logs</AppText>
        </View>
        <AppText variant="caption">
          Photos and ratings your vet can use to spot patterns.
        </AppText>
        {stools.length === 0 ? (
          <EmptyState
            title="No stool logged"
            message="Add a sample from this walk — photo, consistency, and notes."
          />
        ) : (
          stools.map((stool) => (
            <StoolLogCard
              key={stool.id}
              stool={stool}
              onPress={() =>
                router.push({
                  pathname: '/walk/stool',
                  params: { walkId: walk.id, stoolId: stool.id },
                })
              }
            />
          ))
        )}
        <Button
          title="Add stool log"
          icon="camera-outline"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: '/walk/stool',
              params: { walkId: walk.id },
            })
          }
        />
      </Card>

      {deleteWalk.isError && (
        <AppText variant="caption">{deleteWalk.error.message}</AppText>
      )}

      <Button
        title={deleteWalk.isPending ? 'Deleting…' : 'Delete walk'}
        variant="danger"
        icon="trash-outline"
        disabled={deleteWalk.isPending}
        onPress={() => void onDelete()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  mapWrap: {
    height: 280,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderCurve: 'continuous',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
}));
