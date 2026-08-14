import { Image, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/components/Icon/Icon';
import { AppText } from '@/components/Text/AppText';
import type { Walk } from '@/features/walks/types/walk';

type WalkListItemProps = {
  walk: Walk;
  onPress: () => void;
};

export function WalkListItem({ walk, onPress }: WalkListItemProps) {
  const { theme } = useUnistyles();
  const stool = walk.latestStool;
  const rating = stool?.ratingMeta;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {stool?.photoUri && (
        <Image source={{ uri: stool.photoUri }} style={styles.thumb} />
      )}
      {!stool?.photoUri && (
        <View
          style={[
            styles.thumbFallback,
            rating && { backgroundColor: rating.color },
          ]}
        >
          <Icon
            name={stool ? 'medkit-outline' : 'walk-outline'}
            size={22}
            color={stool ? '#FFFFFF' : theme.colors.primary}
          />
        </View>
      )}

      <View style={styles.copy}>
        <AppText variant="subtitle">{walk.formattedDistance}</AppText>
        <AppText variant="caption">
          {walk.formattedStartedAt} · {walk.formattedDuration}
        </AppText>
        {rating && (
          <View style={styles.stoolRow}>
            <View style={[styles.dot, { backgroundColor: rating.color }]} />
            <AppText variant="caption">
              {rating.label}
              {walk.stoolCount > 1 ? ` · ${walk.stoolCount} samples` : ''}
            </AppText>
          </View>
        )}
        {!rating && (
          <View style={styles.stoolRow}>
            <Icon
              name="alert-circle-outline"
              size={14}
              color={theme.colors.warning}
            />
            <AppText variant="caption">No stool logged</AppText>
          </View>
        )}
      </View>

      <Icon name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.padding.sm,
    gap: theme.spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    borderCurve: 'continuous',
  },
  thumbFallback: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryMuted,
    borderCurve: 'continuous',
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  stoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
  },
}));
