import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { theme } from '../theme';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  headingLarge: {
    fontSize: theme.typography.fontSize.xxl,
    lineHeight: theme.typography.lineHeight.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  headingMedium: {
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.lineHeight.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  body: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text,
  },
  caption: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

const createTextComponent = (style: object) => {
  const Component: React.FC<TypographyProps> = ({ children, style: styleProp, ...props }) => (
    <Text style={[style, styleProp]} {...props}>
      {children}
    </Text>
  );

  return Component;
};

export const HeadingLarge = createTextComponent(styles.headingLarge);
export const HeadingMedium = createTextComponent(styles.headingMedium);
export const Body = createTextComponent(styles.body);
export const Caption = createTextComponent(styles.caption);
export const Label = createTextComponent(styles.label);
