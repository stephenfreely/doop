import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="subtitle">{title}</AppText>
      <AppText variant="caption" style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    gap: theme.spacing.sm,
    paddingVertical: theme.padding.lg,
  },
  message: {
    lineHeight: theme.typography.caption.lineHeight,
  },
}));
