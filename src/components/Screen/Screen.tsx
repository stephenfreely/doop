import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
}: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView
        style={[styles.safe, style]}
        edges={['top', 'left', 'right']}
      >
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
      <View style={[styles.content, styles.fill, contentStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.padding.screen,
    gap: theme.spacing.md,
  },
  fill: {
    flex: 1,
  },
}));
