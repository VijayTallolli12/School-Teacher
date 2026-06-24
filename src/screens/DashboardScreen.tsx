import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenContainer, DashboardHeader, DashboardCard, DashboardSection } from '../components';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard, SkeletonList } from '../components/SkeletonLoader';
import { useDashboard } from '../hooks/useDashboard';
import { useUnreadCount } from '../hooks/useNotifications';
import { theme } from '../theme';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, error, refetch } = useDashboard();
  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useUnreadCount();

  const handleRefresh = () => {
    refetch();
    refetchUnreadCount();
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load Dashboard"
          message={error.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      </ScreenContainer>
    );
  }

  if (isLoading || !data) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <View style={styles.skeletonHeader}>
            <SkeletonCard lines={2} />
          </View>
          <SkeletonList count={2} style={styles.skeletonList} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <DashboardHeader teacherName={data.teacherName} date={data.date} />

        <DashboardSection title="Today's Overview">
          <DashboardCard
            icon="library-outline"
            value={data.todaysClasses}
            label="Today's Classes"
            color={theme.colors.primary}
          />
          <DashboardCard
            icon="checkmark-circle-outline"
            value={data.attendancePending}
            label="Attendance Pending"
            color={theme.colors.warning}
          />
          <DashboardCard
            icon="create-outline"
            value={data.homeworkPending}
            label="Homework Pending"
            color={theme.colors.secondary}
          />
          <DashboardCard
            icon="calendar-outline"
            value={data.upcomingExams}
            label="Upcoming Exams"
            color={theme.colors.error}
          />
        </DashboardSection>

        <DashboardSection title="Notifications">
          <DashboardCard
            icon="notifications-outline"
            value={unreadCount}
            label="New Notifications"
            color={theme.colors.info}
            onPress={() => navigation.navigate('Notifications')}
          />
        </DashboardSection>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xl,
  },
  skeletonHeader: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  skeletonList: {
    paddingHorizontal: theme.spacing.md,
  },
});
