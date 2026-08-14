export const STOOL_RATING_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

export type StoolRating = (typeof STOOL_RATING_VALUES)[number];

export type StoolTone = 'concern' | 'watch' | 'ok' | 'good' | 'alert';

export type StoolRatingMeta = {
  value: StoolRating;
  label: string;
  hint: string;
  color: string;
  tone: StoolTone;
};

/**
 * Bristol-inspired scale. Vets ask for this pattern when a puppy is unwell.
 */
export const STOOL_RATINGS: StoolRatingMeta[] = [
  {
    value: 1,
    label: 'Hard pellets',
    hint: 'Separate lumps — often constipation',
    color: '#92400E',
    tone: 'concern',
  },
  {
    value: 2,
    label: 'Lumpy',
    hint: 'Lumpy sausage-shaped stool',
    color: '#A16207',
    tone: 'watch',
  },
  {
    value: 3,
    label: 'Cracked',
    hint: 'Sausage with cracks on the surface',
    color: '#4D7C0F',
    tone: 'ok',
  },
  {
    value: 4,
    label: 'Ideal',
    hint: 'Smooth, soft sausage — healthy target',
    color: '#15803D',
    tone: 'good',
  },
  {
    value: 5,
    label: 'Soft blobs',
    hint: 'Soft pieces with clear edges',
    color: '#CA8A04',
    tone: 'watch',
  },
  {
    value: 6,
    label: 'Mushy',
    hint: 'Fluffy, ragged edges — loose stool',
    color: '#C2410C',
    tone: 'concern',
  },
  {
    value: 7,
    label: 'Watery',
    hint: 'Entirely liquid — diarrhea',
    color: '#B91C1C',
    tone: 'alert',
  },
];

const ratingByValue = new Map(
  STOOL_RATINGS.map((rating) => [rating.value, rating]),
);

export function getStoolRatingMeta(value: number): StoolRatingMeta {
  return ratingByValue.get(value as StoolRating) ?? STOOL_RATINGS[3];
}

export function isStoolRating(value: number): value is StoolRating {
  return STOOL_RATING_VALUES.includes(value as StoolRating);
}
