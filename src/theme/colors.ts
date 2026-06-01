/** Lydia's Thrift — wine (#6B0F1A) screen background, white content surfaces */
export const colors = {
  primary: '#6B0F1A',
  accent: '#6B0F1A',
  accentDark: '#4F0B14',

  /** Only app / screen background */
  background: '#6B0F1A',

  /** Cards, inputs, tab bar */
  surface: '#FFFFFF',
  surfaceMuted: 'rgba(255,255,255,0.14)',

  cream: '#F5E9DA',

  /** Text on wine background */
  onBackground: '#FFFFFF',
  onBackgroundMuted: 'rgba(255,255,255,0.78)',
  onBackgroundSubtle: 'rgba(255,255,255,0.55)',

  /** Text on white surfaces */
  text: '#2D0A10',
  textSecondary: '#6D4950',
  textMuted: '#9B777E',

  border: 'rgba(255,255,255,0.22)',
  borderOnSurface: '#E8D5C8',
  borderFocus: '#6B0F1A',

  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',

  /** @deprecated use surfaceMuted on wine screens */
  accentLight: 'rgba(255,255,255,0.16)',
  secondary: '#FFFFFF',
  surfaceVariant: '#F7EDE4',

  glass: {
    surface: 'rgba(255,255,255,0.92)',
    surfaceStrong: '#FFFFFF',
    border: 'rgba(255,255,255,0.35)',
  },

  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
    full: 9999,
  },

  font: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
} as const;
