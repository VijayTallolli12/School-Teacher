import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { VehicleLocation } from '../types';

interface LiveTrackingHeaderProps {
  vehicle: VehicleLocation;
}

export const LiveTrackingHeader: React.FC<LiveTrackingHeaderProps> = ({ vehicle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.vehicleInfo}>
          <Ionicons name="bus-outline" size={24} color={theme.colors.primary} />
          <View style={styles.vehicleText}>
            <Text style={styles.vehicleName}>{vehicle.vehicleName}</Text>
            <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
          </View>
        </View>
        <View style={styles.speedContainer}>
          <Text style={styles.speedValue}>{vehicle.speed}</Text>
          <Text style={styles.speedUnit}>km/h</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{vehicle.driverName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="navigate-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{vehicle.routeName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>ETA: {vehicle.eta}</Text>
        </View>
      </View>

      <Text style={styles.lastUpdate}>Last updated: {vehicle.lastUpdate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  vehicleText: {
    gap: 2,
  },
  vehicleName: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  vehicleNumber: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  speedContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  speedValue: {
    ...theme.typography.hierarchy.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary,
  },
  speedUnit: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.primary,
  },
  infoGrid: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  lastUpdate: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    textAlign: 'right',
  },
});
