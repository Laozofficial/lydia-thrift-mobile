import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, findNodeHandle, type TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useKeyboardScroll } from './KeyboardAwareScrollView';
import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  hint?: string;
};

export function TextField({ label, error, hint, style, onFocus, secureTextEntry, ...rest }: Props) {
  const hasError = Boolean(error);
  const keyboardScroll = useKeyboardScroll();
  const inputRef = useRef<TextInput>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.wrap}>
      <View style={[styles.inputContainer, hasError && styles.inputError]}>
        <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={[styles.input, isPassword && styles.inputWithToggle, style]}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={isPassword && !passwordVisible}
            onFocus={(event) => {
              const tag = inputRef.current ? findNodeHandle(inputRef.current) : null;
              if (tag != null) keyboardScroll?.scrollToFocused(tag);
              onFocus?.(event);
            }}
            {...rest}
          />
          {isPassword ? (
            <Pressable
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
              onPress={() => setPasswordVisible((v) => !v)}
              style={styles.eyeBtn}
              hitSlop={8}
            >
              <Feather name={passwordVisible ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
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
    borderColor: colors.borderOnSurface,
    borderRadius: colors.radius.sm,
    backgroundColor: colors.surface,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 6,
  },
  inputWithToggle: {
    paddingRight: 4,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 4,
  },
  error: { marginTop: 6, fontSize: 12, color: colors.error, marginLeft: 4 },
  hint: { marginTop: 6, fontSize: 12, color: colors.textMuted, marginLeft: 4 },
});
