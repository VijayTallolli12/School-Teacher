import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface AttendanceSummaryCardProps {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  totalDays,
  present,
  absent,
  late,
  percentage,
}) => {
  const getColor = (pct: number) => {
    if (pct >= 90) return theme.colors.secondary;
    if (pct >= 75) return theme.colors.warning;
    return theme.colors.error;
  };

  const color = getColor(percentage);

  return (
    <View style={styles.container}>
      <View style={styles.percentageRow}>
        <Text style={[styles.percentageValue, { color }]}>
          {percentage.toFixed(1)}%
        </Text>
        <Text style={styles.percentageLabel}>Attendance</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalDays}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.secondary }]}>
            {present}
          </Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.warning }]}>
            {late}
          </Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.error }]}>
            {absent}
          </Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  percentageRow: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  percentageValue: {
    fontSize: theme.typography.fontSize.huge,
    fontWeight: theme.typography.fontWeight.bold,
  },
  percentageLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: -4,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.radius.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 1,
  },
});
