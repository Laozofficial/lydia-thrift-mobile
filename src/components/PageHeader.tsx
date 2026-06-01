import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
    marginBottom: 16,
    gap: 12,
  },
  textWrap: { flex: 1 },
  title: {
    ...typography.display,
    fontSize: colors.font.xxl,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    fontSize: colors.font.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
