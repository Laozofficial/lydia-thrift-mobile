/** Typography tokens — DM Sans body, Fraunces display */
export const fonts = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
  display: 'Fraunces_700Bold',
  displayMedium: 'Fraunces_600SemiBold',
} as const;

export const typography = {
  display: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    letterSpacing: 0.15,
  },
} as const;
