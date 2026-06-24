import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { TransportStatusBadge } from './TransportStatusBadge';
import { theme } from '../theme';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress }) => {
  return (
    <AppCard variant="interactive" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="bus-outline" size={20} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{vehicle.name}</Text>
            <Text style={styles.number}>{vehicle.vehicleNumber}</Text>
          </View>
        </View>
        <TransportStatusBadge status={vehicle.status} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{vehicle.driverName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="speedometer-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{vehicle.speed} km/h</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>ETA: {vehicle.eta}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{vehicle.assignedStudents} / {vehicle.capacity} students</Text>
        </View>
      </View>

      <Text style={styles.lastUpdate}>Updated {vehicle.lastUpdate}</Text>
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
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  headerText: {
    gap: 2,
  },
  name: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  number: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
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
  lastUpdate: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
    textAlign: 'right',
  },
});
