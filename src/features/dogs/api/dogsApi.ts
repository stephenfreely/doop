import {
  dogResponseSchema,
  type DogResponse,
} from '@/features/dogs/schemas/dogSchema';
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';
import { mockDogs } from '@/lib/mockApi';
import { parseApiResponse } from '@/lib/parseApiResponse';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type DogRow = Tables<'dogs'>;

function mapDog(row: DogRow): DogResponse {
  return parseApiResponse(
    dogResponseSchema,
    {
      id: row.id,
      ownerId: row.owner_id,
      name: row.name,
      breed: row.breed,
      photoUrl: row.photo_url,
      createdAt: row.created_at,
    },
    'dog',
  );
}

export async function getDog(ownerId: string): Promise<DogResponse | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockDogs.getDog(ownerId);
  }

  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapDog(data) : null;
}

export async function updateDog(
  ownerId: string,
  input: { name: string; breed?: string; photoUrl?: string },
): Promise<DogResponse> {
  if (!isSupabaseConfigured || !supabase) {
    return mockDogs.upsertDog(ownerId, input);
  }

  const existing = await getDog(ownerId);

  if (existing) {
    const patch: TablesUpdate<'dogs'> = {
      name: input.name,
      breed: input.breed || null,
      photo_url: input.photoUrl || null,
    };

    const { data, error } = await supabase
      .from('dogs')
      .update(patch)
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapDog(data);
  }

  const insert: TablesInsert<'dogs'> = {
    owner_id: ownerId,
    name: input.name,
    breed: input.breed || null,
    photo_url: input.photoUrl || null,
  };

  const { data, error } = await supabase
    .from('dogs')
    .insert(insert)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapDog(data);
}
