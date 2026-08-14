import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Icon } from '@/components/Icon/Icon';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { Screen } from '@/components/Screen/Screen';
import { AppText } from '@/components/Text/AppText';
import { useGetUser } from '@/features/auth/hooks/useGetUser';
import { useGetDog } from '@/features/dogs/hooks/useGetDog';
import { WalkListItem } from '@/features/walks/components/WalkListItem';
import { useGetWalks } from '@/features/walks/hooks/useGetWalks';
import type { Walk } from '@/features/walks/types/walk';
import { calculateWalkStats } from '@/features/walks/utils/stats';
import { formatDistance } from '@/utils/format';

export function WalkHistoryScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { data: user } = useGetUser();
  const { data: dog, isLoading: isDogLoading } = useGetDog(user?.id);
  const {
    data: walkList,
    isLoading: isWalksLoading,
    isError,
    error,
    refetch,
  } = useGetWalks(dog?.id, {
    select: (walks) => {
      const stats = calculateWalkStats(walks);
      return {
        walks,
        stats: {
          ...stats,
          formattedTotalDistance: formatDistance(stats.totalDistanceMetres),
        },
      };
    },
  });

  if (isWalksLoading || isDogLoading) {
    return (
      <Screen>
        <LoadingState message="Loading walk history…" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState
          title="Could not load walks"
          message={error.message}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  const walks = walkList?.walks ?? [];
  const stats = walkList?.stats ?? {
    totalWalks: 0,
    formattedTotalDistance: formatDistance(0),
  };

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
      <View style={styles.heading}>
        <AppText variant="title">Walk history</AppText>
        <View style={styles.metaRow}>
          <Icon name="paw-outline" size={16} color={theme.colors.textMuted} />
          <AppText variant="caption">
            {stats.totalWalks} walks · {stats.formattedTotalDistance} total
          </AppText>
        </View>
      </View>

      {walks.length === 0 ? (
        <EmptyState
          title="No walks yet"
          message="Completed walks will show up here, including any stool samples you logged."
        />
      ) : (
        <FlatList
          data={walks}
          keyExtractor={(item) => item.id}
          renderItem={renderWalk}
          style={styles.list}
          contentInsetAdjustmentBehavior="automatic"
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  heading: {
    gap: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
}));
