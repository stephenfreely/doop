/**
 * Primitive colour values. Screens and components should prefer
 * semantic tokens on `theme.colors`, not these raw hues.
 */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',

  stone50: '#FAFAF9',
  stone100: '#F5F5F4',
  stone200: '#E7E5E4',
  stone400: '#A8A29E',
  stone500: '#78716C',
  stone800: '#292524',
  stone900: '#1C1917',
  stone950: '#0C0A09',

  teal700: '#0F766E',
  teal600: '#0D9488',
  teal400: '#2DD4BF',
  teal200: '#99F6E4',

  red700: '#B91C1C',
  red200: '#FECACA',
  red100: '#FEE2E2',
  red400: '#F87171',

  green700: '#15803D',
  green400: '#4ADE80',

  amber700: '#B45309',
  amber100: '#FEF3C7',
  amber400: '#FBBF24',
} as const;
