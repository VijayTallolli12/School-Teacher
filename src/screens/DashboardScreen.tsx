import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native';
import { ScreenContainer, DashboardHeader, DashboardCard, AppHeader } from '../components';
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

  if (error) {
    return (
      <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
        <AppHeader title="Dashboard" showNotification />
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load Dashboard"
          message={error.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={handleRefresh}
        />
      </ScreenContainer>
    );
  }

  if (isLoading || !data) {
    return (
      <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
        <AppHeader title="Dashboard" showNotification />
        <View style={styles.container}>
          <View style={styles.skeletonHeader}>
            <SkeletonCard lines={2} />
          </View>
          <SkeletonList count={2} style={styles.skeletonList} />
        </View>
      </ScreenContainer>
    );
  }

  const kpiCards = [
    { icon: 'school-outline' as const, value: data.todaysClasses, label: "Today's Classes", color: theme.colors.primary },
    { icon: 'checkmark-circle-outline' as const, value: data.attendancePending, label: 'Attendance Pending', color: theme.colors.warning },
    { icon: 'document-text-outline' as const, value: data.homeworkPending, label: 'Homework Pending', color: theme.colors.secondary },
    { icon: 'calendar-outline' as const, value: data.upcomingExams, label: 'Upcoming Exams', color: theme.colors.error },
  ];

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Dashboard" showNotification />
      <DashboardHeader teacherName={data.teacherName} date={data.date} unreadCount={unreadCount} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.kpiGrid}>
          {kpiCards.map((card, index) => (
            <View key={index} style={styles.kpiCell}>
              <DashboardCard
                icon={card.icon}
                value={card.value}
                label={card.label}
                color={card.color}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <DashboardCard
            icon="notifications-outline"
            value={unreadCount}
            label="New Notifications"
            color={theme.colors.info}
            onPress={() => navigation.navigate('Notifications')}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  kpiCell: {
    width: '48%',
  },
  section: {
    marginTop: theme.spacing.sm,
  },
  skeletonHeader: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  skeletonList: {
    paddingHorizontal: theme.spacing.md,
  },
});
