import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { theme } from '../theme';

interface DashboardCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color?: string;
  onPress?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  value,
  label,
  color = theme.colors.primary,
  onPress,
}) => {
  const content = (
    <>
      <Ionicons name={icon} size={32} color={color} style={styles.icon} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </>
  );

  return (
    <AppCard
      variant="stat"
      accentColor={color}
      onPress={onPress}
      style={styles.card}
      contentStyle={styles.cardContent}
    >
      {content}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  cardContent: {
    alignItems: 'center',
  },
  icon: {
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
