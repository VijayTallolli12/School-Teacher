import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NotificationItem, NotificationType } from '../types';
import { theme } from '../theme';
import { NotificationBadge } from './NotificationBadge';

interface NotificationCardProps {
  notification: NotificationItem;
  onPress: () => void;
}

const typeLabels: Record<NotificationType, string> = {
  attendance: 'Attendance',
  homework: 'Homework',
  exam: 'Exam',
  fee: 'Fee',
  transport: 'Transport',
  system: 'System',
  ai_agent: 'AI Agent',
};

const typeIcons: Record<NotificationType, string> = {
  attendance: '✓',
  homework: '✎',
  exam: '▣',
  fee: '$',
  transport: '▰',
  system: '⚙',
  ai_agent: '✦',
};

const formatCreatedAt = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.card, !notification.isRead && styles.unreadCard]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${notification.isRead ? 'Read' : 'Unread'} ${notification.title}`}
  >
    <View style={styles.icon}>
      <Text style={styles.iconText}>{typeIcons[notification.type]}</Text>
    </View>
    <View style={styles.content}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, !notification.isRead && styles.unreadTitle]} numberOfLines={1}>
          {notification.title}
        </Text>
        {!notification.isRead && <NotificationBadge label="New" />}
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {notification.message}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.type}>{typeLabels[notification.type]}</Text>
        <Text style={styles.date}>{formatCreatedAt(notification.createdAt)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
  },
  unreadCard: {
    borderColor: theme.colors.primaryLight,
    backgroundColor: '#F5F3FF',
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    marginRight: theme.spacing.md,
  },
  iconText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  unreadTitle: {
    fontWeight: theme.typography.fontWeight.bold,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
    marginTop: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  type: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  date: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.xs,
  },
});
