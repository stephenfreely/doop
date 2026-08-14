import {
  authUserSchema,
  type AuthUser,
} from '@/features/auth/schemas/authSchema';
import { mockAuth } from '@/lib/mockApi';
import { parseApiResponse } from '@/lib/parseApiResponse';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type { AuthUser };

function mapUser(user: { id: string; email?: string | null }): AuthUser {
  return parseApiResponse(
    authUserSchema,
    {
      id: user.id,
      email: user.email ?? '',
    },
    'user',
  );
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockAuth.getUser();
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return mapUser(data.user);
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  if (!isSupabaseConfigured || !supabase) {
    return mockAuth.signIn(email);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? 'Unable to sign in');
  }

  return mapUser(data.user);
}

export async function signUp(
  email: string,
  password: string,
): Promise<AuthUser> {
  if (!isSupabaseConfigured || !supabase) {
    return mockAuth.signUp(email);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? 'Unable to sign up');
  }

  return mapUser(data.user);
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    await mockAuth.signOut();
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
