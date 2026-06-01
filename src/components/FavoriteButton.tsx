import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type Props = {
  active: boolean;
  onPress: () => void;
  size?: 'card' | 'hero';
};

export function FavoriteButton({ active, onPress, size = 'card' }: Props) {
  const isHero = size === 'hero';

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.base, isHero ? styles.hero : styles.card]}
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={isHero ? 28 : 24}
        color={active ? colors.accent : colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  hero: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 4,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
