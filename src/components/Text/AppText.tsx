import { Text, type TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type AppTextProps = TextProps & {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'stat';
};

export function AppText({ variant = 'body', style, ...props }: AppTextProps) {
  styles.useVariants({ variant });
  return <Text style={[styles.base, style]} {...props} />;
}

const styles = StyleSheet.create((theme) => ({
  base: {
    color: theme.colors.text,
    variants: {
      variant: {
        title: {
          fontSize: theme.typography.title.fontSize,
          fontWeight: theme.typography.title.fontWeight,
          lineHeight: theme.typography.title.lineHeight,
        },
        subtitle: {
          fontSize: theme.typography.subtitle.fontSize,
          fontWeight: theme.typography.subtitle.fontWeight,
          lineHeight: theme.typography.subtitle.lineHeight,
        },
        body: {
          fontSize: theme.typography.body.fontSize,
          fontWeight: theme.typography.body.fontWeight,
          lineHeight: theme.typography.body.lineHeight,
        },
        caption: {
          fontSize: theme.typography.caption.fontSize,
          fontWeight: theme.typography.caption.fontWeight,
          lineHeight: theme.typography.caption.lineHeight,
          color: theme.colors.textMuted,
        },
        stat: {
          fontSize: theme.typography.stat.fontSize,
          fontWeight: theme.typography.stat.fontWeight,
          lineHeight: theme.typography.stat.lineHeight,
          color: theme.colors.primary,
        },
      },
    },
  },
}));
