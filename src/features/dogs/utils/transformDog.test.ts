import { transformDog } from '@/features/dogs/utils/transformDog';

describe('transformDog', () => {
  it('normalises optional fields and adds display values', () => {
    const dog = transformDog({
      id: 'dog-1',
      ownerId: 'owner-1',
      name: 'mabel',
      breed: '  ',
      photoUrl: null,
      createdAt: '2026-08-14T10:00:00.000Z',
    });

    expect(dog.breed).toBeUndefined();
    expect(dog.photoUrl).toBeUndefined();
    expect(dog.breedLabel).toBe('Good dog');
    expect(dog.initial).toBe('M');
  });
});
