import { Image, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/components/Icon/Icon';
import { AppText } from '@/components/Text/AppText';
import type { Stool } from '@/features/walks/types/walk';

type StoolLogCardProps = {
  stool: Stool;
  onPress?: () => void;
};

export function StoolLogCard({ stool, onPress }: StoolLogCardProps) {
  const { theme } = useUnistyles();
  const rating = stool.ratingMeta;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.pressed,
      ]}
    >
      {stool.photoUri && (
        <Image source={{ uri: stool.photoUri }} style={styles.photo} />
      )}
      {!stool.photoUri && (
        <View style={[styles.photoFallback, { backgroundColor: rating.color }]}>
          <Icon name="camera-outline" size={18} color="#FFFFFF" />
        </View>
      )}

      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <View style={[styles.badge, { backgroundColor: rating.color }]} />
          <AppText variant="subtitle">
            {rating.value} · {rating.label}
          </AppText>
        </View>
        <AppText variant="caption">{stool.formattedRecordedAt}</AppText>
        {stool.description && (
          <AppText variant="caption" numberOfLines={2}>
            {stool.description}
          </AppText>
        )}
      </View>

      {onPress && (
        <Icon name="chevron-forward" size={18} color={theme.colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.padding.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    borderCurve: 'continuous',
  },
  photoFallback: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
  },
}));
