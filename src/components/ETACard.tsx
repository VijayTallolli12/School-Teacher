import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { TransportStatusBadge } from './TransportStatusBadge';
import { theme } from '../theme';
import { ETAData } from '../types';

interface ETACardProps {
  eta: ETAData;
}

export const ETACard: React.FC<ETACardProps> = ({ eta }) => {
  return (
    <AppCard variant="default" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.routeName}>{eta.routeName}</Text>
        <TransportStatusBadge status={eta.status} />
      </View>

      <View style={styles.vehicleRow}>
        <Ionicons name="bus-outline" size={16} color={theme.colors.primary} />
        <Text style={styles.vehicleName}>{eta.vehicleName}</Text>
        <Text style={styles.driverName}>— {eta.driverName}</Text>
      </View>

      <View style={styles.etaContainer}>
        <View style={styles.etaBlock}>
          <Text style={styles.etaLabel}>Current Stop</Text>
          <Text style={styles.etaValue}>{eta.currentStop}</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={theme.colors.textTertiary} />
        <View style={styles.etaBlock}>
          <Text style={styles.etaLabel}>Next Stop</Text>
          <Text style={styles.etaValue}>{eta.nextStop}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.footerText}>ETA: {eta.estimatedArrival}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="flag-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.footerText}>{eta.remainingStops} stops remaining</Text>
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
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  routeName: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    flex: 1,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  vehicleName: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
  },
  driverName: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  etaBlock: {
    flex: 1,
  },
  etaLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  etaValue: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
});
