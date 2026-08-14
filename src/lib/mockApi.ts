import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

import {
  authUserSchema,
  type AuthUser,
} from '@/features/auth/schemas/authSchema';
import {
  dogResponseSchema,
  type DogResponse,
} from '@/features/dogs/schemas/dogSchema';
import {
  walkSchema,
  type CreateWalkInput,
  type UpdateWalkInput,
  type WalkResponse,
} from '@/features/walks/schemas/walkSchema';
import { parseApiResponse } from '@/lib/parseApiResponse';

const DOG_KEY = '@doop/mock/dog';
const WALKS_KEY = '@doop/mock/walks';
const USER_KEY = '@doop/mock/user';

/** Simulated round-trip latency so loading/pending UI can be exercised locally. */
const MOCK_LATENCY_MS = 500;

function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  await simulateNetworkDelay();
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  return JSON.parse(raw) as T;
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

function parseWalk(data: unknown): WalkResponse {
  return parseApiResponse(walkSchema, data, 'walk');
}

function parseDog(data: unknown): DogResponse {
  return parseApiResponse(dogResponseSchema, data, 'dog');
}

function parseUser(data: unknown): AuthUser {
  return parseApiResponse(authUserSchema, data, 'user');
}

export const mockAuth = {
  async getUser(): Promise<AuthUser | null> {
    const user = await readJson<unknown>(USER_KEY, null);
    return user ? parseUser(user) : null;
  },

  async signIn(email: string): Promise<AuthUser> {
    const existing = await this.getUser();
    if (existing && existing.email === email) {
      return existing;
    }
    const user = parseUser({ id: uuidv4(), email });
    await writeJson(USER_KEY, user);
    return user;
  },

  async signUp(email: string): Promise<AuthUser> {
    return this.signIn(email);
  },

  async signOut(): Promise<void> {
    await simulateNetworkDelay();
    await AsyncStorage.removeItem(USER_KEY);
  },
};

export const mockDogs = {
  async getDog(ownerId: string): Promise<DogResponse | null> {
    const stored = await readJson<unknown>(DOG_KEY, null);
    if (!stored) {
      return null;
    }
    const dog = parseDog(stored);
    if (dog.ownerId !== ownerId) {
      return null;
    }
    return dog;
  },

  async upsertDog(
    ownerId: string,
    input: { name: string; breed?: string; photoUrl?: string },
  ): Promise<DogResponse> {
    const existing = await this.getDog(ownerId);
    const dog = parseDog({
      id: existing?.id ?? uuidv4(),
      ownerId,
      name: input.name,
      breed: input.breed,
      photoUrl: input.photoUrl,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
    await writeJson(DOG_KEY, dog);
    return dog;
  },
};

export const mockWalks = {
  async getWalks(dogId: string): Promise<WalkResponse[]> {
    const stored = await readJson<unknown[]>(WALKS_KEY, []);
    return stored
      .map(parseWalk)
      .filter((walk) => walk.dogId === dogId)
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      );
  },

  async getWalk(id: string): Promise<WalkResponse | null> {
    const stored = await readJson<unknown[]>(WALKS_KEY, []);
    const walk = stored.map(parseWalk).find((item) => item.id === id);
    return walk ?? null;
  },

  async createWalk(
    input: CreateWalkInput & { id?: string },
  ): Promise<WalkResponse> {
    const walks = await readJson<unknown[]>(WALKS_KEY, []);
    const walk = parseWalk({
      id: input.id ?? uuidv4(),
      dogId: input.dogId,
      startedAt: input.startedAt,
      endedAt: input.endedAt,
      distanceMetres: input.distanceMetres,
      route: input.route,
      notes: input.notes,
      stools: input.stools ?? [],
    });
    await writeJson(WALKS_KEY, [walk, ...walks]);
    return walk;
  },

  async updateWalk(id: string, input: UpdateWalkInput): Promise<WalkResponse> {
    const walks = (await readJson<unknown[]>(WALKS_KEY, [])).map(parseWalk);
    const index = walks.findIndex((walk) => walk.id === id);
    if (index < 0) {
      throw new Error('Walk not found');
    }

    const current = walks[index];
    if (!current) {
      throw new Error('Walk not found');
    }

    const updated = parseWalk({
      ...current,
      notes: input.notes ?? current.notes,
      stools: input.stools ?? current.stools,
    });
    walks[index] = updated;
    await writeJson(WALKS_KEY, walks);
    return updated;
  },

  async deleteWalk(id: string): Promise<void> {
    const walks = (await readJson<unknown[]>(WALKS_KEY, [])).map(parseWalk);
    await writeJson(
      WALKS_KEY,
      walks.filter((walk) => walk.id !== id),
    );
  },
};
