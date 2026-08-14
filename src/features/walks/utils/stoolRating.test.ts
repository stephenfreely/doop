import {
  getStoolRatingMeta,
  isStoolRating,
  STOOL_RATINGS,
} from '@/features/walks/utils/stoolRating';

describe('stoolRating', () => {
  it('covers the full Bristol-inspired 1–7 scale', () => {
    expect(STOOL_RATINGS.map((rating) => rating.value)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it('returns metadata for a known rating', () => {
    expect(getStoolRatingMeta(4).label).toBe('Ideal');
    expect(getStoolRatingMeta(7).tone).toBe('alert');
  });

  it('falls back to ideal for unknown values', () => {
    expect(getStoolRatingMeta(0).value).toBe(4);
  });

  it('narrows valid ratings', () => {
    expect(isStoolRating(4)).toBe(true);
    expect(isStoolRating(8)).toBe(false);
  });
});
