/** Typography tokens — Outfit (sans-serif) across body and display */
export const fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  display: 'Outfit_700Bold',
  displayMedium: 'Outfit_600SemiBold',
} as const;

export const typography = {
  display: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: -0.7,
    lineHeight: 31,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 19,
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.medium,
    fontSize: 11,
    letterSpacing: 0.2,
    lineHeight: 15,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    letterSpacing: 0.15,
  },
} as const;
