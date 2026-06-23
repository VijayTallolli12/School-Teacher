import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NotificationFilterValue } from '../types';
import { theme } from '../theme';

interface NotificationEmptyStateProps {
  filter: NotificationFilterValue;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({ filter }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>🔔</Text>
    <Text style={styles.title}>No notifications</Text>
    <Text style={styles.message}>
      {filter === 'all'
        ? 'New school updates will appear here.'
        : `There are no ${filter} notifications.`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
  },
});
