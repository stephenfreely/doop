import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Icon } from '@/components/Icon/Icon';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { Screen } from '@/components/Screen/Screen';
import { AppText } from '@/components/Text/AppText';
import { useGetUser } from '@/features/auth/hooks/useGetUser';
import { DogAvatar } from '@/features/dogs/components/DogAvatar';
import { useGetDog } from '@/features/dogs/hooks/useGetDog';
import { WalkListItem } from '@/features/walks/components/WalkListItem';
import { useGetWalks } from '@/features/walks/hooks/useGetWalks';
import { useStartWalk } from '@/features/walks/hooks/useStartWalk';
import type { Walk } from '@/features/walks/types/walk';
import { calculateWalkStats } from '@/features/walks/utils/stats';
import { useActiveWalkStore } from '@/stores/activeWalkStore';
import { formatDistance } from '@/utils/format';

export function HomeScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { data: user } = useGetUser();
  const {
    data: dog,
    isLoading: isDogLoading,
    isError: isDogError,
    error: dogError,
    refetch: refetchDog,
  } = useGetDog(user?.id);
  const {
    data: walkList,
    isLoading: isWalksLoading,
    isError: isWalksError,
    error: walksError,
    refetch: refetchWalks,
  } = useGetWalks(dog?.id, {
    select: (walks) => {
      const stats = calculateWalkStats(walks);
      return {
        recent: walks.slice(0, 8),
        stats: {
          ...stats,
          formattedDistanceThisWeek: formatDistance(
            stats.distanceThisWeekMetres,
          ),
        },
      };
    },
  });
  const { startWalk, isStarting, error } = useStartWalk();
  const walkInProgress = useActiveWalkStore(
    (state) => state.status !== 'idle' || state.startedAt !== null,
  );

  if (isDogLoading) {
    return (
      <Screen>
        <LoadingState message="Loading home…" />
      </Screen>
    );
  }

  if (isDogError) {
    return (
      <Screen>
        <ErrorState
          title="Could not load dog"
          message={dogError.message}
          onRetry={() => void refetchDog()}
        />
      </Screen>
    );
  }

  if (!dog) {
    return (
      <Screen>
        <AppText variant="title">Home</AppText>
        <EmptyState
          title="No dog yet"
          message="Add a dog profile before you start a walk."
        />
        <Button
          title="Add dog"
          icon="paw-outline"
          onPress={() => router.push('/dog')}
        />
      </Screen>
    );
  }

  const stats = walkList?.stats ?? {
    walksThisWeek: 0,
    formattedDistanceThisWeek: formatDistance(0),
  };
  const recent = walkList?.recent ?? [];

  function renderWalk({ item }: { item: Walk }) {
    return (
      <WalkListItem
        walk={item}
        onPress={() => router.push(`/walk/${item.id}`)}
      />
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <DogAvatar name={dog.name} photoUrl={dog.photoUrl} size="lg" />
        <View style={styles.headerCopy}>
          <AppText variant="title">{dog.name}</AppText>
          <AppText variant="caption">{dog.breedLabel}</AppText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <View style={styles.statLabel}>
            <Icon
              name="navigate-outline"
              size={16}
              color={theme.colors.textMuted}
            />
            <AppText variant="caption">This week</AppText>
          </View>
          <AppText variant="stat">{stats.formattedDistanceThisWeek}</AppText>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statLabel}>
            <Icon name="paw-outline" size={16} color={theme.colors.textMuted} />
            <AppText variant="caption">Walks this week</AppText>
          </View>
          <AppText variant="stat">{stats.walksThisWeek}</AppText>
        </Card>
      </View>

      <Button
        title={
          isStarting
            ? 'Starting…'
            : walkInProgress
              ? 'Continue walk'
              : 'Start Walk'
        }
        icon={walkInProgress ? 'play-outline' : 'walk-outline'}
        disabled={isStarting}
        onPress={() => void startWalk(dog.id)}
      />
      {error && <AppText variant="caption">{error}</AppText>}

      <Card style={styles.recentCard}>
        <View style={styles.sectionTitle}>
          <Icon name="time-outline" size={18} color={theme.colors.text} />
          <AppText variant="subtitle">Recent walks</AppText>
        </View>
        {isWalksLoading && <LoadingState message="Loading walks…" />}
        {isWalksError && (
          <ErrorState
            title="Could not load walks"
            message={walksError.message}
            onRetry={() => void refetchWalks()}
          />
        )}
        {!isWalksLoading && !isWalksError && (
          <FlatList
            data={recent}
            keyExtractor={(item) => item.id}
            renderItem={renderWalk}
            style={styles.list}
            contentInsetAdjustmentBehavior="automatic"
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <EmptyState
                title="No walks yet"
                message="Start a walk to track distance and log stool samples for your vet."
              />
            }
          />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  recentCard: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
}));
