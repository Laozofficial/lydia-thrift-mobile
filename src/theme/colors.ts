/** Lydia Thrift design tokens — twelveAI-style structure, thrift brand palette */
export const colors = {
  primary: '#6B0F1A',
  accent: '#6B0F1A',
  accentLight: '#F5E9DA',
  accentDark: '#4F0B14',
  secondary: '#F5E9DA',

  background: '#FFF9F2',
  surface: '#FFFFFF',
  surfaceVariant: '#FDF1E6',

  text: '#2D0A10',
  textSecondary: '#6D4950',
  textMuted: '#9B777E',

  border: '#EAD9CC',
  borderFocus: '#6B0F1A',

  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',

  glass: {
    surface: 'rgba(255,255,255,0.78)',
    surfaceStrong: 'rgba(255,255,255,0.92)',
    border: 'rgba(107,15,26,0.18)',
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
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
