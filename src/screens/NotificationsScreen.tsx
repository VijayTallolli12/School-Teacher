import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppButton,
  AppHeader,
  EmptyState,
  NotificationCard,
  NotificationEmptyState,
  NotificationFilter,
  ScreenContainer,
  SkeletonList,
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
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to load notifications"
          message={error.message || 'Check your network connection and try again.'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader
        title="Notifications"
        rightComponent={
          hasUnread ? (
            <AppButton
              title="Read all"
              variant="ghost"
              loading={markAllAsRead.isPending}
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
              accessibilityLabel="Mark all notifications as read"
            />
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
    <SkeletonList count={5} />
  </View>
);

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  skeletonContainer: {
    paddingTop: theme.spacing.xs,
  },
});
