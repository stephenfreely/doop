import { StyleSheet } from 'react-native-unistyles';

import { breakpoints } from '@/theme/breakpoints';
import { darkTheme, lightTheme } from '@/theme/themes';

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Unistyles module augmentation
  export interface UnistylesThemes extends AppThemes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Unistyles module augmentation
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
  settings: {
    // Follow the OS light/dark setting. Requires themes named `light` and `dark`.
    adaptiveThemes: true,
  },
});
