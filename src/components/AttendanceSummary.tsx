import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MetricCard } from './CardSystem';
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
    <MetricCard style={styles.cardWrapper} contentStyle={styles.cardContent}>
      <Text style={styles.title}>Attendance Summary</Text>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Ionicons name="people-outline" size={24} color={theme.colors.textSecondary} />
          <Text style={styles.summaryValue}>{processedCount}</Text>
          <Text style={styles.summaryLabel}>Processed</Text>
        </View>
        <View style={[styles.summaryItem, styles.presentItem]}>
          <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.success} />
          <Text style={[styles.summaryValue, styles.presentValue]}>{presentCount}</Text>
          <Text style={[styles.summaryLabel, styles.presentLabel]}>Present</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryItem, styles.absentItem]}>
          <Ionicons name="close-circle-outline" size={24} color={theme.colors.error} />
          <Text style={[styles.summaryValue, styles.absentValue]}>{absentCount}</Text>
          <Text style={[styles.summaryLabel, styles.absentLabel]}>Absent</Text>
        </View>
        <View style={[styles.summaryItem, styles.lateItem]}>
          <Ionicons name="time-outline" size={24} color={theme.colors.warning} />
          <Text style={[styles.summaryValue, styles.lateValue]}>{lateCount}</Text>
          <Text style={[styles.summaryLabel, styles.lateLabel]}>Late</Text>
        </View>
      </View>
    </MetricCard>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  cardContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
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
    width: '100%',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    marginHorizontal: theme.spacing.xs,
    minHeight: 112,
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  presentItem: {
    backgroundColor: `${theme.colors.success}20`,
  },
  presentValue: {
    color: theme.colors.success,
  },
  presentLabel: {
    color: theme.colors.success,
  },
  absentItem: {
    backgroundColor: `${theme.colors.error}20`,
  },
  absentValue: {
    color: theme.colors.error,
  },
  absentLabel: {
    color: theme.colors.error,
  },
  lateItem: {
    backgroundColor: `${theme.colors.warning}20`,
  },
  lateValue: {
    color: theme.colors.warning,
  },
  lateLabel: {
    color: theme.colors.warning,
  },
});
