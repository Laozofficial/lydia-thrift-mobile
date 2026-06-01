import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  /** White text on wine background (default) */
  onBackground?: boolean;
};

export function PageHeader({ title, subtitle, right, onBackground = true }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={[styles.title, onBackground && styles.titleOnBg]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, onBackground && styles.subtitleOnBg]}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  textWrap: { flex: 1 },
  title: {
    ...typography.display,
    fontSize: colors.font.xxl,
    color: colors.text,
  },
  titleOnBg: { color: colors.onBackground },
  subtitle: {
    ...typography.body,
    fontSize: colors.font.sm,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  subtitleOnBg: { color: colors.onBackgroundMuted },
});
