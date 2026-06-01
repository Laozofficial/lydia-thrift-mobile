import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from './AppLogo';
import { KeyboardAwareScrollView } from './KeyboardAwareScrollView';
import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

type Props = {
  children: React.ReactNode;
  badges?: [string, string?];
};

export function AuthShell({ children, badges }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScrollView
        centerContent
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <AppLogo size={96} style={styles.logo} />
          {badges ? (
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badges[0]}</Text>
              </View>
              {badges[1] ? (
                <View style={[styles.badge, styles.badgeMuted]}>
                  <Text style={[styles.badgeText, styles.badgeTextMuted]}>{badges[1]}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          <View style={styles.card}>{children}</View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.screenX,
    paddingVertical: spacing.xl,
    minHeight: '100%',
  },
  sheet: { gap: spacing.md, width: '100%' },
  logo: { marginBottom: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.xs, paddingHorizontal: 4, justifyContent: 'center' },
  badge: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: colors.radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeMuted: { backgroundColor: 'rgba(255,255,255,0.08)' },
  badgeText: { ...typography.caption, color: colors.onBackground, fontFamily: fonts.semibold, textTransform: 'none' },
  badgeTextMuted: { color: colors.onBackgroundMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: colors.radius.xl,
    borderWidth: 1,
    borderColor: colors.borderOnSurface,
    padding: spacing.xl,
    marginTop: spacing.sm,
  },
});
