import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';

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
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: colors.radius.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  arrow: {
    fontSize: 16,
    color: colors.onBackground,
    fontFamily: fonts.bold,
  },
  label: {
    ...typography.caption,
    color: colors.onBackground,
    fontFamily: fonts.semibold,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 13,
  },
});
