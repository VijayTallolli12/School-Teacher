import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  style,
}) => {
  const variantStyle = variants[variant];

  return (
    <View style={[styles.base, variantStyle.container, style]}>
      <Text style={[styles.text, variantStyle.text]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.weight.medium,
  },
});

const variants: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  success: {
    container: { backgroundColor: theme.colors.successContainer },
    text: { color: theme.colors.success },
  },
  warning: {
    container: { backgroundColor: theme.colors.warningContainer },
    text: { color: theme.colors.warning },
  },
  error: {
    container: { backgroundColor: theme.colors.errorContainer },
    text: { color: theme.colors.error },
  },
  info: {
    container: { backgroundColor: theme.colors.infoContainer },
    text: { color: theme.colors.info },
  },
  neutral: {
    container: { backgroundColor: theme.colors.surfaceSecondary },
    text: { color: theme.colors.textSecondary },
  },
  primary: {
    container: { backgroundColor: theme.colors.primaryContainer },
    text: { color: theme.colors.primary },
  },
};
