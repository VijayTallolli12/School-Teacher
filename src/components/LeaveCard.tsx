import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { LeaveItem } from '../types';
import { LeaveStatusBadge } from './LeaveStatusBadge';

interface LeaveCardProps {
  leave: LeaveItem;
  onPress?: () => void;
}

export const LeaveCard: React.FC<LeaveCardProps> = ({ leave, onPress }) => {
  const content = (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.leaveType} numberOfLines={1}>
          {leave.leaveType}
        </Text>
        <LeaveStatusBadge status={leave.status} />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Dates</Text>
          <Text style={styles.detailValue}>
            {leave.fromDate} → {leave.toDate}
          </Text>
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
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  leaveType: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
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
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: 1,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  daysValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  reason: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
  appliedDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
});
