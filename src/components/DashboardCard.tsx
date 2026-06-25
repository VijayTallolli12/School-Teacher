import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface DashboardCardProps {
  icon: keyof typeof Ionicons.glyphMap;
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
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
    padding: theme.spacing.cardPadding,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.icon,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  value: {
    ...theme.typography.hierarchy.metric,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.weight.medium,
  },
});
