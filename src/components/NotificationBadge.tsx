import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface NotificationBadgeProps {
  count?: number;
  label?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, label }) => {
  if (typeof count === 'number' && count <= 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label ?? (count && count > 99 ? '99+' : count)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
