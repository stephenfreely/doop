import { palette } from '@/theme/palette';

/**
 * Semantic colour tokens. Names describe role, not hue, so
 * light/dark themes can swap values without touching UI code.
 */
export const lightColors = {
  background: palette.stone100,
  surface: palette.white,
  surfaceMuted: palette.stone50,
  text: palette.stone900,
  textMuted: palette.stone500,
  textOnPrimary: palette.white,
  border: palette.stone200,
  primary: palette.teal700,
  primaryPressed: palette.teal600,
  primaryMuted: palette.teal200,
  danger: palette.red700,
  dangerMuted: palette.red100,
  success: palette.green700,
  warning: palette.amber700,
  warningMuted: palette.amber100,
  mapAccent: palette.teal700,
} as const;

export const darkColors = {
  background: palette.stone950,
  surface: palette.stone900,
  surfaceMuted: palette.stone800,
  text: palette.stone50,
  textMuted: palette.stone400,
  textOnPrimary: palette.stone950,
  border: palette.stone800,
  primary: palette.teal400,
  primaryPressed: palette.teal200,
  primaryMuted: palette.teal700,
  danger: palette.red400,
  dangerMuted: palette.red700,
  success: palette.green400,
  warning: palette.amber400,
  warningMuted: palette.amber700,
  mapAccent: palette.teal400,
} as const;

export type SemanticColors = typeof lightColors;
