import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { TransportStatusBadge } from './TransportStatusBadge';
import { theme } from '../theme';
import { Route } from '../types';

interface RouteCardProps {
  route: Route;
  onPress?: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onPress }) => {
  return (
    <AppCard variant="interactive" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{route.name}</Text>
          <TransportStatusBadge status={route.status} />
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
      </View>

      <Text style={styles.description}>{route.description}</Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="bus-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{route.vehicleName} ({route.vehicleNumber})</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{route.driverName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{route.assignedStudents} students</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{route.stops.length} stops</Text>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  headerLeft: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  details: {
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
});
