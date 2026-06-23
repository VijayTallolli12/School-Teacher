import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppHeader, ScreenContainer } from '../components';
import { useMarkAsRead } from '../hooks/useNotifications';
import { NotificationType, NotificationsStackParamList } from '../types';
import { theme } from '../theme';

type Props = NativeStackScreenProps<NotificationsStackParamList, 'NotificationDetail'>;

const typeLabels: Record<NotificationType, string> = {
  attendance: 'Attendance',
  homework: 'Homework',
  exam: 'Exam',
  fee: 'Fee',
  transport: 'Transport',
  system: 'System',
  ai_agent: 'AI Agent',
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(date);
};

export const NotificationDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { notification } = route.params;
  const markAsRead = useMarkAsRead();

  useEffect(() => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id, {
        onError: () => {
          Alert.alert('Unable to mark as read', 'Check your connection and try again.');
        },
      });
    }
  }, [notification.id, notification.isRead]);

  const isRead = notification.isRead || markAsRead.isSuccess;
  const readStatus = markAsRead.isPending ? 'Marking read…' : isRead ? 'Read' : 'Unread';

  return (
    <ScreenContainer backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Notification" showBackButton onBackPress={navigation.goBack} />
      <View style={styles.card}>
        <View style={styles.metaRow}>
          <Text style={styles.type}>{typeLabels[notification.type]}</Text>
          <Text style={[styles.status, !isRead && styles.unreadStatus]}>{readStatus}</Text>
        </View>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.date}>{formatDate(notification.createdAt)}</Text>
        <View style={styles.divider} />
        <Text style={styles.message}>{notification.message}</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  status: {
    color: theme.colors.successDark,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  unreadStatus: {
    color: theme.colors.warningDark,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.md,
  },
  date: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 25,
  },
});
