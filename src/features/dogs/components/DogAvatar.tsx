import { Image, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';

type DogAvatarProps = {
  name: string;
  photoUrl?: string;
  size?: 'sm' | 'lg';
};

export function DogAvatar({ name, photoUrl, size = 'sm' }: DogAvatarProps) {
  styles.useVariants({ size });
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={styles.image} />;
  }

  return (
    <View style={styles.fallback}>
      <AppText style={styles.initial}>{initial}</AppText>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  image: {
    backgroundColor: theme.colors.surfaceMuted,
    variants: {
      size: {
        sm: { width: 56, height: 56, borderRadius: 28 },
        lg: { width: 96, height: 96, borderRadius: 48 },
      },
    },
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryMuted,
    variants: {
      size: {
        sm: { width: 56, height: 56, borderRadius: 28 },
        lg: { width: 96, height: 96, borderRadius: 48 },
      },
    },
  },
  initial: {
    color: theme.colors.primary,
    fontWeight: '700',
    variants: {
      size: {
        sm: { fontSize: 22 },
        lg: { fontSize: 36 },
      },
    },
  },
}));
