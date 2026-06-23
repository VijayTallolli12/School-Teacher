import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface DashboardCardProps {
  icon: string;
  value: number;
  label: string;
  color?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  value,
  label,
  color = theme.colors.primary,
}) => {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <Text style={[styles.icon, { color }]}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  icon: {
    fontSize: theme.typography.fontSize.xxl,
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
