import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = ViewProps & {
  onPress?: () => void;
};

export function Card({ children, onPress, style, ...rest }: Props) {
  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: colors.radius.lg,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.borderOnSurface,
  },
  pressed: {
    opacity: 0.94,
  },
});
