import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';

const ThemedSpinner = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.colors.primary,
}));

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <View style={styles.wrap}>
      <ThemedSpinner />
      <AppText variant="caption">{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    gap: theme.spacing.sm,
    paddingVertical: theme.padding.lg,
    alignItems: 'center',
  },
}));
