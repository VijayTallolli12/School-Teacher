import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface AttendanceSummaryProps {
  processedCount: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  processedCount,
  presentCount,
  absentCount,
  lateCount,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Summary</Text>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{processedCount}</Text>
          <Text style={styles.summaryLabel}>Processed</Text>
        </View>
        <View style={[styles.summaryItem, styles.presentItem]}>
          <Text style={[styles.summaryValue, styles.presentValue]}>{presentCount}</Text>
          <Text style={[styles.summaryLabel, styles.presentLabel]}>Present</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryItem, styles.absentItem]}>
          <Text style={[styles.summaryValue, styles.absentValue]}>{absentCount}</Text>
          <Text style={[styles.summaryLabel, styles.absentLabel]}>Absent</Text>
        </View>
        <View style={[styles.summaryItem, styles.lateItem]}>
          <Text style={[styles.summaryValue, styles.lateValue]}>{lateCount}</Text>
          <Text style={[styles.summaryLabel, styles.lateLabel]}>Late</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    marginHorizontal: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  presentItem: {
    backgroundColor: `${theme.colors.success}20`,
  },
  presentValue: {
    color: theme.colors.successDark,
  },
  presentLabel: {
    color: theme.colors.successDark,
  },
  absentItem: {
    backgroundColor: `${theme.colors.error}20`,
  },
  absentValue: {
    color: theme.colors.errorDark,
  },
  absentLabel: {
    color: theme.colors.errorDark,
  },
  lateItem: {
    backgroundColor: `${theme.colors.warning}20`,
  },
  lateValue: {
    color: theme.colors.warningDark,
  },
  lateLabel: {
    color: theme.colors.warningDark,
  },
});
