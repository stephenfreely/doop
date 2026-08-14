import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type IconName = ComponentProps<typeof Ionicons>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

export function Icon({ name, size = 20, color }: IconProps) {
  const { theme } = useUnistyles();

  return (
    <Ionicons
      name={name}
      size={size}
      color={(color ?? theme.colors.text) as string}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
