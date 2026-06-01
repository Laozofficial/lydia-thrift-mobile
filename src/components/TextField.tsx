import { useRef } from 'react';
import { StyleSheet, Text, TextInput, View, findNodeHandle, type TextInputProps } from 'react-native';

import { useKeyboardScroll } from './KeyboardAwareScrollView';
import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  hint?: string;
};

export function TextField({ label, error, hint, style, onFocus, ...rest }: Props) {
  const hasError = Boolean(error);
  const keyboardScroll = useKeyboardScroll();
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.wrap}>
      <View style={[styles.inputContainer, hasError && styles.inputError]}>
        <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={(event) => {
            const tag = inputRef.current ? findNodeHandle(inputRef.current) : null;
            if (tag != null) keyboardScroll?.scrollToFocused(tag);
            onFocus?.(event);
          }}
          {...rest}
        />
      </View>
      {hasError ? <Text style={styles.error}>{error}</Text> : null}
      {!hasError && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: colors.radius.sm,
    backgroundColor: colors.glass.surface,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  labelError: { color: colors.error },
  input: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 6,
  },
  error: { marginTop: 6, fontSize: 12, color: colors.error, marginLeft: 4 },
  hint: { marginTop: 6, fontSize: 12, color: colors.textMuted, marginLeft: 4 },
});
