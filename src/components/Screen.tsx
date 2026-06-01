import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareScrollView } from './KeyboardAwareScrollView';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = ViewProps & {
  scroll?: boolean;
  padded?: boolean;
};

export function Screen({ children, scroll = false, padded = true, style, ...rest }: Props) {
  const content = (
    <View style={[padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {scroll ? (
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
          {content}
        </KeyboardAwareScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    flex: 1,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.screenBottom,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
});
