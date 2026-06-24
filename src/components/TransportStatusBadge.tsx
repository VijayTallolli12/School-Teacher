import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { TransportStatusType } from '../types';

const statusConfig: Record<
  TransportStatusType,
  { color: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  on_time: { color: theme.colors.success, label: 'On Time', icon: 'checkmark-circle' },
  arriving: { color: theme.colors.info, label: 'Arriving', icon: 'time-outline' },
  delayed: { color: theme.colors.warning, label: 'Delayed', icon: 'alert-circle-outline' },
  completed: { color: theme.colors.textTertiary, label: 'Completed', icon: 'flag-outline' },
};

interface TransportStatusBadgeProps {
  status: TransportStatusType;
}

export const TransportStatusBadge: React.FC<TransportStatusBadgeProps> = ({ status }) => {
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
