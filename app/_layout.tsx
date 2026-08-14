import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native-unistyles';

import { ErrorState } from '@/components/ErrorState/ErrorState';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { Screen } from '@/components/Screen/Screen';
import { useGetUser } from '@/features/auth/hooks/useGetUser';
import { QueryProvider } from '@/providers/QueryProvider';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryProvider>
        <RootNavigator />
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { data: user, isLoading, isError, refetch } = useGetUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuth = segments[0] === 'sign-in';

    if (!user && !inAuth) {
      router.replace('/sign-in');
      return;
    }

    if (user && inAuth) {
      router.replace('/');
    }
  }, [isLoading, router, segments, user]);

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="Starting Doop…" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState
          title="Could not load session"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="dog" options={{ title: 'Dog profile' }} />
      <Stack.Screen name="walk/active" options={{ title: 'Active walk' }} />
      <Stack.Screen
        name="walk/stool"
        options={{
          title: 'Log stool',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="walk/[id]" options={{ title: 'Walk details' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
