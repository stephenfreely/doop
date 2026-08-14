import { darkColors, lightColors } from '@/theme/colors';
import { padding, radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const lightTheme = {
  colors: lightColors,
  spacing,
  padding,
  radius,
  typography,
};

export const darkTheme = {
  colors: darkColors,
  spacing,
  padding,
  radius,
  typography,
};

export type AppTheme = typeof lightTheme;
