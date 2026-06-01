import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';

type Props = {
  onPress: () => void;
  label?: string;
};

export function BackButton({ onPress, label = 'Back' }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.btn} hitSlop={12}>
      <Text style={styles.arrow}>←</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 8,
  },
  arrow: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
});
