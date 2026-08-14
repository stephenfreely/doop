import { formatDistance, formatDuration } from '@/utils/format';

describe('formatDistance', () => {
  it('formats metres under 1 km', () => {
    expect(formatDistance(842)).toBe('842 m');
  });

  it('formats kilometres to two decimal places', () => {
    expect(formatDistance(2420)).toBe('2.42 km');
  });
});

describe('formatDuration', () => {
  it('formats minutes', () => {
    expect(formatDuration(32 * 60_000)).toBe('32 min');
  });

  it('formats whole hours', () => {
    expect(formatDuration(2 * 60 * 60_000)).toBe('2 hr');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90 * 60_000)).toBe('1 hr 30 min');
  });
});
