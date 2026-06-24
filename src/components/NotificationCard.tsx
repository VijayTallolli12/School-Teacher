import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem, NotificationType } from '../types';
import { theme } from '../theme';
import { AppCard } from './AppCard';
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

const typeIcons: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  attendance: 'checkmark-circle',
  homework: 'create-outline',
  exam: 'grid-outline',
  fee: 'cash-outline',
  transport: 'bus-outline',
  system: 'settings-outline',
  ai_agent: 'sparkles-outline',
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
  <AppCard
    variant="interactive"
    onPress={onPress}
    style={notification.isRead ? undefined : styles.unreadCard}
    accessibilityLabel={`${notification.isRead ? 'Read' : 'Unread'} ${notification.title}`}
  >
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons name={typeIcons[notification.type]} size={20} color={theme.colors.primary} />
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
    </View>
  </AppCard>
);

const styles = StyleSheet.create({
  unreadCard: {
    borderColor: theme.colors.primaryLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
  },
  unreadTitle: {
    fontWeight: theme.typography.weight.bold,
  },
  message: {
    color: theme.colors.textSecondary,
    ...theme.typography.hierarchy.caption,
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
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
  },
  date: {
    color: theme.colors.textLight,
    ...theme.typography.hierarchy.caption,
  },
});
