import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signIn, signOut, signUp } from '@/features/auth/api/authApi';
import { queryKeys } from '@/lib/queryKeys';

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.user, user);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.user, user);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.user, null);
      queryClient.clear();
    },
  });
}
