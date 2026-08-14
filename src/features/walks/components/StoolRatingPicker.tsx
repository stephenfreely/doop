import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';
import type { StoolRating } from '@/features/walks/types/walk';
import {
  getStoolRatingMeta,
  STOOL_RATINGS,
} from '@/features/walks/utils/stoolRating';

type StoolRatingPickerProps = {
  value: StoolRating | null;
  onChange: (rating: StoolRating) => void;
};

export function StoolRatingPicker({ value, onChange }: StoolRatingPickerProps) {
  const selected = value ? getStoolRatingMeta(value) : null;

  return (
    <View style={styles.wrap}>
      <AppText variant="caption">Consistency</AppText>
      <View style={styles.row}>
        {STOOL_RATINGS.map((rating) => {
          const selectedRating = value === rating.value;
          return (
            <Pressable
              key={rating.value}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedRating }}
              accessibilityLabel={`${rating.value}. ${rating.label}`}
              onPress={() => onChange(rating.value)}
              style={[
                styles.chip,
                { borderColor: rating.color },
                selectedRating && { backgroundColor: rating.color },
              ]}
            >
              <AppText
                style={[
                  styles.chipLabel,
                  selectedRating ? styles.chipLabelOn : { color: rating.color },
                ]}
              >
                {rating.value}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {selected && (
        <View style={styles.hint}>
          <View style={[styles.dot, { backgroundColor: selected.color }]} />
          <View style={styles.hintCopy}>
            <AppText variant="subtitle">{selected.label}</AppText>
            <AppText variant="caption">{selected.hint}</AppText>
          </View>
        </View>
      )}
      {!selected && (
        <AppText variant="caption">
          Tap a number. 4 is healthy; 1 is very hard, 7 is watery.
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  chip: {
    flex: 1,
    minHeight: 44,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  chipLabelOn: {
    color: theme.colors.textOnPrimary,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.padding.sm,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: theme.radius.full,
    marginTop: 6,
  },
  hintCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
}));
