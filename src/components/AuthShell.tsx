import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from './AppLogo';
import { KeyboardAwareScrollView } from './KeyboardAwareScrollView';
import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';

type Props = {
  children: React.ReactNode;
  badges?: [string, string?];
};

export function AuthShell({ children, badges }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.ambientTop} />
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
  safe: { flex: 1, backgroundColor: colors.accentLight },
  ambientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: colors.accent,
    opacity: 0.12,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    minHeight: '100%',
  },
  sheet: { gap: 12, width: '100%' },
  logo: { marginBottom: 4 },
  badges: { flexDirection: 'row', gap: 8, paddingHorizontal: 4, justifyContent: 'center' },
  badge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: colors.radius.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  badgeMuted: { backgroundColor: colors.glass.surfaceStrong },
  badgeText: { ...typography.caption, color: colors.accent },
  badgeTextMuted: { color: colors.textSecondary },
  card: {
    backgroundColor: colors.glass.surfaceStrong,
    borderRadius: colors.radius.xxl,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
});
