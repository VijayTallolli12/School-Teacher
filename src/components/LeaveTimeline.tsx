import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { LeaveTimelineEntry, LeaveStatus } from '../types';

interface LeaveTimelineProps {
  entries: LeaveTimelineEntry[];
}

const statusColors: Record<LeaveStatus, string> = {
  pending: theme.colors.warning,
  approved: theme.colors.secondary,
  rejected: theme.colors.error,
  cancelled: theme.colors.textLight,
};

const statusLabels: Record<LeaveStatus, string> = {
  pending: 'Applied',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const statusIcons: Record<LeaveStatus, keyof typeof Ionicons.glyphMap> = {
  pending: 'hourglass-outline',
  approved: 'checkmark-circle',
  rejected: 'close-circle',
  cancelled: 'close-circle',
};

export const LeaveTimeline: React.FC<LeaveTimelineProps> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <View style={styles.container} accessibilityRole="list" accessibilityLabel="Status Timeline">
      <Text style={styles.title}>
        <Ionicons name="hourglass-outline" size={14} color={theme.colors.textLight} /> Status Timeline
      </Text>
      <View style={styles.timeline}>
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;
          const color = statusColors[entry.status];

          return (
            <View key={index} style={styles.entry} accessibilityRole="text">
              <View style={styles.dotContainer}>
                <Ionicons
                  name={statusIcons[entry.status]}
                  size={14}
                  color={color}
                  style={styles.dotIcon}
                />
                {!isLast && (
                  <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
                )}
              </View>
              <View style={styles.content}>
                <Text style={styles.statusText}>
                  {statusLabels[entry.status]}
                </Text>
                <Text style={styles.dateText}>{entry.date}</Text>
                {entry.remark && (
                  <Text style={styles.remarkText}>{entry.remark}</Text>
                )}
                {entry.updatedBy && (
                  <Text style={styles.updatedByText}>by {entry.updatedBy}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  timeline: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  entry: {
    flexDirection: 'row',
    minHeight: 50,
  },
  dotContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  dotIcon: {
    marginTop: 3,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing.md,
  },
  statusText: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  dateText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  remarkText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },
  updatedByText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    marginTop: 2,
  },
});
