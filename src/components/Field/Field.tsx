import { TextInput, View, type TextInputProps } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';

const ThemedTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.textMuted,
}));

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Field({ label, error, style, ...props }: FieldProps) {
  styles.useVariants({ invalid: Boolean(error) });

  return (
    <View style={styles.wrap}>
      <AppText variant="caption">{label}</AppText>
      <ThemedTextInput style={[styles.input, style]} {...props} />
      {error && <AppText style={styles.error}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    gap: theme.spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.padding.input,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    variants: {
      invalid: {
        true: {
          borderColor: theme.colors.danger,
        },
        false: {},
      },
    },
  },
  error: {
    color: theme.colors.danger,
    fontSize: 13,
  },
}));
