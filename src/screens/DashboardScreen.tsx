import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer, DashboardHeader, DashboardCard, DashboardSection } from '../components';
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Dashboard</Text>
          <Text style={styles.errorMessage}>
            {error.message || 'Please check your connection and try again'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading || !data) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <DashboardSkeleton />
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
            icon="📚"
            value={data.todaysClasses}
            label="Today's Classes"
            color={theme.colors.primary}
          />
          <DashboardCard
            icon="✅"
            value={data.attendancePending}
            label="Attendance Pending"
            color={theme.colors.warning}
          />
          <DashboardCard
            icon="📝"
            value={data.homeworkPending}
            label="Homework Pending"
            color={theme.colors.secondary}
          />
          <DashboardCard
            icon="📅"
            value={data.upcomingExams}
            label="Upcoming Exams"
            color={theme.colors.error}
          />
        </DashboardSection>

        <DashboardSection title="Notifications">
          <DashboardCard
            icon="🔔"
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

const DashboardSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader} />
      <View style={styles.skeletonSection}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonCards}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      </View>
      <View style={styles.skeletonSection}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonCards}>
          <View style={styles.skeletonCard} />
        </View>
      </View>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  skeletonContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  skeletonHeader: {
    height: 120,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
  },
  skeletonSection: {
    marginBottom: theme.spacing.lg,
  },
  skeletonTitle: {
    height: 24,
    width: 150,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
  },
  skeletonCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skeletonCard: {
    width: '45%',
    height: 120,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
});
