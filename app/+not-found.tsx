import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <AppText variant="subtitle">This screen does not exist.</AppText>
        <Link href="/" style={styles.link}>
          <AppText style={styles.linkText}>Go to home screen</AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.padding.screen,
    backgroundColor: theme.colors.background,
  },
  link: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.padding.md,
  },
  linkText: {
    color: theme.colors.primary,
  },
}));
