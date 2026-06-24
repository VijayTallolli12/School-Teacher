import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { LeaveItem } from '../types';
import { LeaveStatusBadge } from './LeaveStatusBadge';
import { AppCard } from './AppCard';

interface LeaveCardProps {
  leave: LeaveItem;
  onPress?: () => void;
}

export const LeaveCard: React.FC<LeaveCardProps> = ({ leave, onPress }) => {
  return (
    <AppCard variant="interactive" onPress={onPress} style={styles.card} contentStyle={styles.cardContent}>
      <View style={styles.topRow}>
        <Text style={styles.leaveType} numberOfLines={1}>
          {leave.leaveType}
        </Text>
        <LeaveStatusBadge status={leave.status} />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Dates</Text>
          <View style={styles.dateRow}>
            <Text style={styles.detailValue}>{leave.fromDate}</Text>
            <Ionicons name="chevron-forward" size={12} color={theme.colors.textLight} style={styles.arrowIcon} />
            <Text style={styles.detailValue}>{leave.toDate}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Days</Text>
          <Text style={styles.daysValue}>{leave.days}</Text>
        </View>
      </View>

      {leave.reason && (
        <Text style={styles.reason} numberOfLines={2}>
          {leave.reason}
        </Text>
      )}

      <Text style={styles.appliedDate}>Applied: {leave.appliedDate}</Text>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  leaveType: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    marginBottom: 1,
  },
  detailValue: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginHorizontal: 2,
  },
  daysValue: {
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  reason: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
  appliedDate: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
  },
});
