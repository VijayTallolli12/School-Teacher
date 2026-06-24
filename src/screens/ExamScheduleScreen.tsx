import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, AppHeader } from '../components';
import { AppCard } from '../components/AppCard';
import { SkeletonList } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useExamSchedule, useExamDetail } from '../hooks/useExams';
import { theme } from '../theme';
import { AppStackParamList } from '../types';

type ScheduleRouteProp = RouteProp<AppStackParamList, 'ExamSchedule'>;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const ExamScheduleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScheduleRouteProp>();
  const { examId } = route.params;
  const { data: exam } = useExamDetail(examId);
  const { data: schedule, isLoading, error, refetch, isRefetching } = useExamSchedule(examId);

  if (error) {
    return (
      <ScreenContainer>
        <AppHeader title="Exam Schedule" showBackButton onBackPress={() => navigation.goBack()} />
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load Schedule"
          message={error.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Exam Schedule" showBackButton onBackPress={() => navigation.goBack()} />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <ScreenContainer>
      <AppHeader title="Exam Schedule" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {exam && (
          <View style={styles.examInfo}>
            <Ionicons name="school-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.examInfoText}>
              {exam.name} — {exam.className} {exam.section}
            </Text>
          </View>
        )}

        {!schedule || schedule.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No Schedule"
            message="No schedule entries found for this exam."
          />
        ) : (
          schedule.map((entry, index) => (
            <AppCard key={entry.id} variant="default" style={styles.scheduleCard}>
              <View style={styles.cardHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayNumber}>{index + 1}</Text>
                </View>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.subjectName}>{entry.subject}</Text>
                  <Text style={styles.className}>
                    {entry.className} - {entry.section}
                  </Text>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.detailText}>{entry.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {formatTime(entry.startTime)} — {formatTime(entry.endTime)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="stats-chart-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.detailText}>Max Marks: {entry.maxMarks}</Text>
                </View>
              </View>
            </AppCard>
          ))
        )}
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
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  skeletonList: {
    padding: theme.spacing.md,
  },
  examInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  examInfoText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  scheduleCard: {
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary,
  },
  cardHeaderContent: {
    flex: 1,
    gap: 2,
  },
  subjectName: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  className: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  cardDetails: {
    gap: theme.spacing.xs,
    marginLeft: 36 + theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
});
