export const typography = {
  family: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
    xxxl: 40,
    huge: 56,
  },
  hierarchy: {
    display: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    },
    title: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600',
    },
    heading: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
  },
} as const;

export type Typography = typeof typography;