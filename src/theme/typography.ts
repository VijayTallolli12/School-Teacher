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
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 28,
    massive: 32,
  },
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 26,
    xxl: 28,
    xxxl: 32,
    huge: 36,
    massive: 40,
  },
  hierarchy: {
    h1: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
    },
    h4: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '500',
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
    metric: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
    },
    display: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
    },
    title: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
    },
    heading: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
    },
  },
} as const;

export type Typography = typeof typography;
