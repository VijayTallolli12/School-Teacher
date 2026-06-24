import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

type ExamStatus = 'upcoming' | 'ongoing' | 'completed';

const statusConfig: Record<
  ExamStatus,
  { color: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  upcoming: { color: theme.colors.info, label: 'Upcoming', icon: 'calendar-outline' },
  ongoing: { color: theme.colors.warning, label: 'Ongoing', icon: 'hourglass-outline' },
  completed: { color: theme.colors.success, label: 'Completed', icon: 'checkmark-circle' },
};

interface ExamStatusBadgeProps {
  status: ExamStatus;
}

export const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.color + '18' }]}>
      <Ionicons name={config.icon} size={12} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.semibold,
  },
});
