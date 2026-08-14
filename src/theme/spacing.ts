/**
 * Spacing scale — use for gap, margin, and layout offsets.
 * Values are in density-independent pixels.
 */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

/**
 * Padding tokens — named for common UI surfaces so screens
 * do not invent one-off padding values.
 */
export const padding = {
  none: spacing.none,
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  screen: spacing.md,
  card: spacing.md,
  button: spacing.md,
  input: spacing.md,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export type SpacingToken = keyof typeof spacing;
export type PaddingToken = keyof typeof padding;
