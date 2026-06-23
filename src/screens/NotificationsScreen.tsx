import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppHeader,
  NotificationCard,
  NotificationEmptyState,
  NotificationFilter,
  ScreenContainer,
} from '../components';
import {
  useMarkAllAsRead,
  useNotifications,
} from '../hooks/useNotifications';
import {
  NotificationFilterValue,
  NotificationItem,
  NotificationsStackParamList,
} from '../types';
import { theme } from '../theme';

type Props = NativeStackScreenProps<NotificationsStackParamList, 'NotificationsList'>;

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const [filter, setFilter] = useState<NotificationFilterValue>('all');
  const { data = [], isLoading, isRefetching, error, refetch } = useNotifications();
  const markAllAsRead = useMarkAllAsRead();

  const filteredNotifications = useMemo(
    () =>
      data.filter((notification) => {
        if (filter === 'unread') return !notification.isRead;
        if (filter === 'read') return notification.isRead;
        return true;
      }),
    [data, filter],
  );

  const hasUnread = data.some((notification) => !notification.isRead);

  const openNotification = (notification: NotificationItem) => {
    navigation.navigate('NotificationDetail', { notification });
  };

  if (error && data.length === 0) {
    return (
      <ScreenContainer scrollable={false}>
        <AppHeader title="Notifications" />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Unable to load notifications</Text>
          <Text style={styles.errorMessage}>
            {error.message || 'Check your network connection and try again.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader
        title="Notifications"
        rightComponent={
          hasUnread ? (
            <TouchableOpacity
              onPress={() =>
                markAllAsRead.mutate(undefined, {
                  onError: () => {
                    Alert.alert(
                      'Unable to mark all as read',
                      'Check your connection and try again.',
                    );
                  },
                })
              }
              disabled={markAllAsRead.isPending}
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
            >
              {markAllAsRead.isPending ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <Text style={styles.markAllText}>Read all</Text>
              )}
            </TouchableOpacity>
          ) : undefined
        }
      />
      <NotificationFilter value={filter} onChange={setFilter} />
      {isLoading ? (
        <NotificationListSkeleton />
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationCard notification={item} onPress={() => openNotification(item)} />
          )}
          contentContainerStyle={[
            styles.listContent,
            filteredNotifications.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={<NotificationEmptyState filter={filter} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </ScreenContainer>
  );
};

const NotificationListSkeleton: React.FC = () => (
  <View style={styles.skeletonContainer}>
    {[1, 2, 3, 4, 5].map((item) => (
      <View key={item} style={styles.skeletonCard}>
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.skeletonShortLine]} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  errorMessage: {
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  retryText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
  markAllText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  skeletonContainer: {
    paddingTop: theme.spacing.xs,
  },
  skeletonCard: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
  },
  skeletonIcon: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.md,
  },
  skeletonContent: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  skeletonTitle: {
    width: '55%',
    height: 16,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.border,
  },
  skeletonLine: {
    width: '100%',
    height: 12,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.border,
  },
  skeletonShortLine: {
    width: '70%',
  },
});
