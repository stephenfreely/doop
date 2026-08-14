import {
  createWalkInputSchema,
  updateWalkInputSchema,
  walkSchema,
  type CreateWalkInput,
  type UpdateWalkInput,
  type WalkResponse,
} from '@/features/walks/schemas/walkSchema';
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';
import { mockWalks } from '@/lib/mockApi';
import { parseApiResponse } from '@/lib/parseApiResponse';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type WalkRow = Tables<'walks'>;

function mapWalk(row: WalkRow): WalkResponse {
  return parseApiResponse(
    walkSchema,
    {
      id: row.id,
      dogId: row.dog_id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      distanceMetres: row.distance_metres,
      route: row.route,
      notes: row.notes ?? undefined,
      stools: row.stools ?? [],
    },
    'walk',
  );
}

export async function getWalks(dogId: string): Promise<WalkResponse[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockWalks.getWalks(dogId);
  }

  const { data, error } = await supabase
    .from('walks')
    .select('*')
    .eq('dog_id', dogId)
    .order('started_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapWalk);
}

export async function getWalk(id: string): Promise<WalkResponse | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockWalks.getWalk(id);
  }

  const { data, error } = await supabase
    .from('walks')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapWalk(data) : null;
}

export async function createWalk(
  input: CreateWalkInput,
): Promise<WalkResponse> {
  const parsed = createWalkInputSchema.parse(input);

  if (!isSupabaseConfigured || !supabase) {
    return mockWalks.createWalk(parsed);
  }

  const insert: TablesInsert<'walks'> = {
    dog_id: parsed.dogId,
    started_at: parsed.startedAt,
    ended_at: parsed.endedAt,
    distance_metres: parsed.distanceMetres,
    route: parsed.route,
    notes: parsed.notes ?? null,
    stools: parsed.stools ?? [],
  };

  const { data, error } = await supabase
    .from('walks')
    .insert(insert)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapWalk(data);
}

export async function updateWalk(
  id: string,
  input: UpdateWalkInput,
): Promise<WalkResponse> {
  const parsed = updateWalkInputSchema.parse(input);

  if (!isSupabaseConfigured || !supabase) {
    return mockWalks.updateWalk(id, parsed);
  }

  const patch: TablesUpdate<'walks'> = {};
  if (parsed.notes !== undefined) {
    patch.notes = parsed.notes;
  }
  if (parsed.stools !== undefined) {
    patch.stools = parsed.stools;
  }

  const { data, error } = await supabase
    .from('walks')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapWalk(data);
}

export async function deleteWalk(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    await mockWalks.deleteWalk(id);
    return;
  }

  const { error } = await supabase.from('walks').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}
