import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  type PressableProps,
} from 'react-native';

import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
/** onBackground = wine screen; onSurface = white card */
type Tone = 'onBackground' | 'onSurface';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  loading?: boolean;
  variant?: Variant;
  tone?: Tone;
  danger?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  loading = false,
  variant = 'primary',
  tone = 'onBackground',
  danger = false,
  disabled,
  style,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  const look = resolveLook(variant, tone, danger);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        look.container,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={look.spinnerColor} />
      ) : (
        <Text style={[styles.text, look.text]}>{title}</Text>
      )}
    </Pressable>
  );
}

function resolveLook(variant: Variant, tone: Tone, danger: boolean) {
  if (danger) {
    if (tone === 'onSurface') {
      return {
        container: styles.dangerOnSurface,
        text: styles.dangerTextOnSurface,
        spinnerColor: colors.error,
      };
    }
    return {
      container: styles.dangerOnBackground,
      text: styles.dangerTextOnBackground,
      spinnerColor: colors.error,
    };
  }

  if (variant === 'primary') {
    if (tone === 'onSurface') {
      return {
        container: styles.primaryOnSurface,
        text: styles.primaryTextOnSurface,
        spinnerColor: '#fff',
      };
    }
    return {
      container: styles.primaryOnBackground,
      text: styles.primaryTextOnBackground,
      spinnerColor: colors.primary,
    };
  }

  if (variant === 'secondary') {
    if (tone === 'onSurface') {
      return {
        container: styles.secondaryOnSurface,
        text: styles.secondaryTextOnSurface,
        spinnerColor: colors.primary,
      };
    }
    return {
      container: styles.secondaryOnBackground,
      text: styles.secondaryTextOnBackground,
      spinnerColor: colors.primary,
    };
  }

  if (variant === 'outline') {
    if (tone === 'onSurface') {
      return {
        container: styles.outlineOnSurface,
        text: styles.outlineTextOnSurface,
        spinnerColor: colors.primary,
      };
    }
    return {
      container: styles.outlineOnBackground,
      text: styles.outlineTextOnBackground,
      spinnerColor: '#fff',
    };
  }

  // ghost
  if (tone === 'onSurface') {
    return {
      container: styles.ghostOnSurface,
      text: styles.ghostTextOnSurface,
      spinnerColor: colors.primary,
    };
  }
  return {
    container: styles.ghostOnBackground,
    text: styles.ghostTextOnBackground,
    spinnerColor: '#fff',
  };
}

const styles = StyleSheet.create({
  base: {
    borderRadius: colors.radius.md,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.55 },
  text: { ...typography.button },

  primaryOnBackground: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  primaryTextOnBackground: { color: colors.primary },

  primaryOnSurface: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  primaryTextOnSurface: { color: '#fff' },

  secondaryOnBackground: {
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.cream,
  },
  secondaryTextOnBackground: { color: colors.primary },

  secondaryOnSurface: {
    backgroundColor: colors.surfaceVariant,
    borderWidth: 2,
    borderColor: colors.borderOnSurface,
  },
  secondaryTextOnSurface: { color: colors.primary },

  outlineOnBackground: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: colors.onBackground,
  },
  outlineTextOnBackground: { color: colors.onBackground },

  outlineOnSurface: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  outlineTextOnSurface: { color: colors.primary },

  ghostOnBackground: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  ghostTextOnBackground: { color: colors.onBackground },

  ghostOnSurface: {
    backgroundColor: colors.surfaceVariant,
    borderWidth: 2,
    borderColor: colors.borderOnSurface,
  },
  ghostTextOnSurface: { color: colors.primary },

  dangerOnBackground: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  dangerTextOnBackground: { color: '#FECACA' },

  dangerOnSurface: {
    backgroundColor: colors.errorBg,
    borderWidth: 2,
    borderColor: colors.error,
  },
  dangerTextOnSurface: { color: colors.error, fontFamily: fonts.semibold },
});
