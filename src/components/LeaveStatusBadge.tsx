import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { LeaveStatus } from '../types';

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
}

const statusConfig: Record<LeaveStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
  approved: { bg: '#D1FAE5', text: '#059669', label: 'Approved' },
  rejected: { bg: '#FEE2E2', text: '#DC2626', label: 'Rejected' },
  cancelled: { bg: '#F3F4F6', text: '#6B7280', label: 'Cancelled' },
};

export const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <View
      style={[styles.badge, { backgroundColor: config.bg }]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${config.label}`}
    >
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  text: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
  },
});
