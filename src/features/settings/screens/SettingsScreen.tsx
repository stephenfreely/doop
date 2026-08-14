import { useRouter } from 'expo-router';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Screen } from '@/components/Screen/Screen';
import { AppText } from '@/components/Text/AppText';
import { useSignOut } from '@/features/auth/hooks/useAuthMutations';
import { useGetUser } from '@/features/auth/hooks/useGetUser';
import { isSupabaseConfigured } from '@/lib/supabase';

export function SettingsScreen() {
  const router = useRouter();
  const { data: user } = useGetUser();
  const signOut = useSignOut();

  return (
    <Screen>
      <AppText variant="title">Settings</AppText>

      <Card>
        <AppText variant="subtitle">Account</AppText>
        <AppText>{user?.email || 'Signed in'}</AppText>
        <AppText variant="caption">
          {isSupabaseConfigured
            ? 'Connected to Supabase.'
            : 'Local mock mode — add EXPO_PUBLIC_SUPABASE_URL to use a real backend.'}
        </AppText>
        <Button
          title="Edit dog profile"
          variant="secondary"
          icon="paw-outline"
          onPress={() => router.push('/dog')}
        />
        <Button
          title={signOut.isPending ? 'Signing out…' : 'Sign out'}
          variant="danger"
          icon="log-out-outline"
          disabled={signOut.isPending}
          onPress={() => void signOut.mutateAsync()}
        />
      </Card>
    </Screen>
  );
}
