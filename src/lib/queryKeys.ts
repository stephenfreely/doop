export const queryKeys = {
  user: ['user'] as const,
  dog: (ownerId: string) => ['dog', ownerId] as const,
  walks: (dogId: string) => ['walks', dogId] as const,
  walk: (walkId: string) => ['walk', walkId] as const,
};
