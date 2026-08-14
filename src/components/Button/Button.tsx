import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon, type IconName } from '@/components/Icon/Icon';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = PressableProps & {
  title: string;
  variant?: Variant;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = 'primary',
  icon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useUnistyles();
  styles.useVariants({ variant });

  const iconColor = {
    primary: theme.colors.textOnPrimary,
    secondary: theme.colors.text,
    danger: theme.colors.danger,
    ghost: theme.colors.primary,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {icon && <Icon name={icon} size={18} color={iconColor} />}
        <Text style={styles.label}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    minHeight: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.padding.button,
    borderCurve: 'continuous',
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        danger: {
          backgroundColor: theme.colors.dangerMuted,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    variants: {
      variant: {
        primary: {
          color: theme.colors.textOnPrimary,
        },
        secondary: {
          color: theme.colors.text,
        },
        danger: {
          color: theme.colors.danger,
        },
        ghost: {
          color: theme.colors.primary,
        },
      },
    },
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
}));
