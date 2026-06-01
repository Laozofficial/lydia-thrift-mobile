import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ChoiceChip({ label, selected, onPress, style }: Props) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected, style]}
      onPress={onPress}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: colors.radius.md,
    borderWidth: 2,
    borderColor: colors.borderOnSurface,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceVariant,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.primary,
  },
});
