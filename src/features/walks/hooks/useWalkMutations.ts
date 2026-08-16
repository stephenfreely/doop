import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createWalk,
  deleteWalk,
  updateWalk,
} from '@/features/walks/api/walksApi';
import type {
  CreateWalkInput,
  UpdateWalkInput,
} from '@/features/walks/schemas/walkSchema';
import { transformWalk } from '@/features/walks/utils/transformWalk';
import { queryKeys } from '@/lib/queryKeys';

export function useCreateWalk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWalkInput) =>
      transformWalk(await createWalk(input)),
    onSuccess: (walk) => {
      queryClient.invalidateQueries({ queryKey: ['walks'] });
      queryClient.setQueryData(queryKeys.walk(walk.id), walk);
    },
  });
}

export function useUpdateWalk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateWalkInput;
    }) => transformWalk(await updateWalk(id, input)),
    onSuccess: (walk) => {
      queryClient.invalidateQueries({ queryKey: ['walks'] });
      queryClient.setQueryData(queryKeys.walk(walk.id), walk);
    },
  });
}

export function useDeleteWalk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWalk(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['walks'] });
      queryClient.removeQueries({ queryKey: queryKeys.walk(id) });
    },
  });
}
