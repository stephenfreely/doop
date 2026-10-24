import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';
import { Button } from '@/components/Button/Button';

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  testID?: string;
};

export function ErrorState({
  title,
  message,
  onRetry,
  testID,
}: ErrorStateProps) {
  return (
    <View style={styles.wrap} testID={testID}>
      <AppText variant="subtitle">{title}</AppText>
      <AppText variant="caption">{message}</AppText>
      {onRetry && (
        <Button
          title="Try again"
          onPress={onRetry}
          testID={testID ? `${testID}-retry` : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    gap: theme.spacing.sm,
    paddingVertical: theme.padding.lg,
  },
}));
