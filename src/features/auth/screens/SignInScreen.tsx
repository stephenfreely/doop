import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Field } from '@/components/Field/Field';
import { Screen } from '@/components/Screen/Screen';
import { AppText } from '@/components/Text/AppText';
import { useSignIn, useSignUp } from '@/features/auth/hooks/useAuthMutations';
import { authSchema } from '@/features/auth/schemas/authSchema';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fieldErrors } from '@/utils/formErrors';

export function SignInScreen() {
  const signIn = useSignIn();
  const signUp = useSignUp();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = mode === 'signIn' ? signIn : signUp;
  const title = mode === 'signIn' ? 'Sign in' : 'Create account';

  async function onSubmit() {
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    await mutation.mutateAsync(parsed.data);
  }

  return (
    <Screen>
      <AppText variant="title">Doop</AppText>
      <AppText variant="caption">
        Track walks. Keep the architecture small.
      </AppText>

      <Card testID="sign-in.form">
        <AppText variant="subtitle">{title}</AppText>
        <Field
          testID="sign-in.email-field"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <Field
          testID="sign-in.password-field"
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        {mutation.error && (
          <AppText testID="sign-in.error-text" variant="caption">
            {mutation.error.message}
          </AppText>
        )}
        <Button
          testID="sign-in.submit-button"
          title={mutation.isPending ? 'Please wait…' : title}
          disabled={mutation.isPending}
          onPress={() => void onSubmit()}
        />
        <Button
          testID="sign-in.toggle-mode-button"
          variant="ghost"
          title={
            mode === 'signIn'
              ? 'Need an account? Sign up'
              : 'Already have an account? Sign in'
          }
          onPress={() => {
            setMode(mode === 'signIn' ? 'signUp' : 'signIn');
            mutation.reset();
          }}
        />
      </Card>

      {!isSupabaseConfigured && (
        <AppText testID="sign-in.mock-mode-notice" variant="caption">
          Supabase is not configured. Sign-in uses local AsyncStorage so you can
          demo the app without a backend.
        </AppText>
      )}
    </Screen>
  );
}
