import { selectWithTransform } from '@/lib/query';

describe('selectWithTransform', () => {
  const transform = (values: number[]) => values.map((value) => value * 2);

  it('returns the transformed view when no select is provided', () => {
    const select = selectWithTransform(transform);
    expect(select([1, 2, 3])).toEqual([2, 4, 6]);
  });

  it('applies select to the transformed view', () => {
    const select = selectWithTransform(transform, (values) => values[0]);
    expect(select([1, 2, 3])).toBe(2);
  });
});
