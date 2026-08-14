import type { StoolLog } from '@/features/walks/types/walk';

export function upsertStool(stools: StoolLog[], stool: StoolLog): StoolLog[] {
  const exists = stools.some((item) => item.id === stool.id);
  if (!exists) {
    return [...stools, stool];
  }

  return stools.map((item) => (item.id === stool.id ? stool : item));
}

export function latestStool<T extends StoolLog>(stools: T[]): T | undefined {
  return [...stools].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )[0];
}
