import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';
import { Button } from '@/components/Button/Button';

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="subtitle">{title}</AppText>
      <AppText variant="caption">{message}</AppText>
      {onRetry && <Button title="Try again" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    gap: theme.spacing.sm,
    paddingVertical: theme.padding.lg,
  },
}));
