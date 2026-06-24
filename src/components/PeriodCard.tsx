import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { theme } from '../theme';
import { PeriodItem, PeriodStatus } from '../types';

interface PeriodCardProps {
  period: PeriodItem;
  status: PeriodStatus;
  onPress?: () => void;
  compact?: boolean;
}

const statusColors: Record<PeriodStatus, { bg: string; dot: string; label: string }> = {
  current: { bg: '#EEF2FF', dot: theme.colors.primary, label: 'Current' },
  upcoming: { bg: '#F0FDF4', dot: theme.colors.secondary, label: 'Upcoming' },
  completed: { bg: '#F9FAFB', dot: theme.colors.textLight, label: 'Completed' },
};

export const PeriodCard: React.FC<PeriodCardProps> = ({
  period,
  status,
  onPress,
  compact = false,
}) => {
  const colors = statusColors[status];
  const subject = period?.subject ?? 'Unnamed Period';
  const periodNumber = period?.periodNumber ?? '?';
  const startTime = period?.startTime ?? '--:--';
  const endTime = period?.endTime ?? '--:--';
  const className = period?.className ?? '';
  const section = period?.section ?? '';
  const room = period?.room ?? 'Room Not Assigned';

  return (
    <AppCard
      variant="interactive"
      onPress={onPress}
      style={{ backgroundColor: colors.bg }}
    >
      <View style={styles.container}>
        <View style={[styles.timelineDot, { backgroundColor: colors.dot }]} />

        <View style={styles.timeColumn}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textLight} />
          <Text style={styles.periodNumber}>P{periodNumber}</Text>
          <Text style={styles.timeText}>{startTime}</Text>
          <Text style={styles.timeSeparator}>|</Text>
          <Text style={styles.timeText}>{endTime}</Text>
        </View>

        <View style={styles.detailsColumn}>
          <View style={styles.topRow}>
            <Text style={styles.subject} numberOfLines={1}>
              {subject}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.dot + '20' }]}>
              <Text style={[styles.statusText, { color: colors.dot }]}>
                {colors.label}
              </Text>
            </View>
          </View>
          {!compact && (
            <>
              <Text style={styles.detailText}>
                {className}{section ? ` - ${section}` : ''}
              </Text>
              <Text style={styles.detailText}>Room: {room}</Text>
            </>
          )}
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    left: -21,
    top: theme.spacing.xs + 2,
    zIndex: 1,
  },
  timeColumn: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    minWidth: 48,
  },
  periodNumber: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  timeText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  timeSeparator: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    lineHeight: 10,
  },
  detailsColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subject: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
