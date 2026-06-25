import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { ExamStatusBadge } from '../components/ExamStatusBadge';
import { MarksSummaryCard } from '../components/MarksSummaryCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useExamDetail, usePublishResults } from '../hooks/useExams';
import { theme } from '../theme';

export const ExamDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const { data: exam, isLoading, error, refetch } = useExamDetail(examId);
  const publishMutation = usePublishResults();

  const handleEnterMarks = useCallback(() => {
    router.push({ pathname: '/(tabs)/more/marks-entry', params: { examId } });
  }, [examId]);

  const handleViewSchedule = useCallback(() => {
    router.push({ pathname: '/(tabs)/more/exam-schedule', params: { examId } });
  }, [examId]);

  const handlePublishResults = useCallback(() => {
    Alert.alert(
      'Publish Results',
      'Are you sure you want to publish the results for this exam? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          style: 'destructive',
          onPress: () => {
            publishMutation.mutate(examId, {
              onSuccess: (response) => {
                Alert.alert('Success', response.message || 'Results published successfully');
                refetch();
              },
              onError: (err) => {
                Alert.alert('Error', err.message || 'Failed to publish results');
              },
            });
          },
        },
      ]
    );
  }, [examId, publishMutation, refetch]);

  if (error) {
    return (
      <ScreenContainer>
        <AppHeader variant="secondary" title="Exam Details" showBackButton onBackPress={() => navigation.goBack()} />
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load Exam"
          message={error.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  if (isLoading || !exam) {
    return (
      <ScreenContainer>
        <AppHeader variant="secondary" title="Exam Details" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.container}>
          <SkeletonCard lines={5} style={styles.skeletonCard} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppHeader variant="secondary" title="Exam Details" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <AppCard variant="elevated">
          <View style={examHeaderStyles.topRow}>
            <Text style={examHeaderStyles.name}>{exam.name}</Text>
            <ExamStatusBadge status={exam.status} />
          </View>
          <View style={examHeaderStyles.detailsGrid}>
            <View style={examHeaderStyles.detailItem}>
              <Ionicons name="book-outline" size={16} color={theme.colors.textSecondary} />
              <View>
                <Text style={examHeaderStyles.detailLabel}>Subject</Text>
                <Text style={examHeaderStyles.detailValue}>{exam.subject}</Text>
              </View>
            </View>
            <View style={examHeaderStyles.detailItem}>
              <Ionicons name="school-outline" size={16} color={theme.colors.textSecondary} />
              <View>
                <Text style={examHeaderStyles.detailLabel}>Class</Text>
                <Text style={examHeaderStyles.detailValue}>{exam.className} - {exam.section}</Text>
              </View>
            </View>
            <View style={examHeaderStyles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
              <View>
                <Text style={examHeaderStyles.detailLabel}>Date</Text>
                <Text style={examHeaderStyles.detailValue}>{exam.date}</Text>
              </View>
            </View>
            <View style={examHeaderStyles.detailItem}>
              <Ionicons name="stats-chart-outline" size={16} color={theme.colors.textSecondary} />
              <View>
                <Text style={examHeaderStyles.detailLabel}>Marks</Text>
                <Text style={examHeaderStyles.detailValue}>{exam.totalMarks}</Text>
              </View>
            </View>
          </View>
        </AppCard>

        {exam.resultSummary && (
          <View style={styles.section}>
            <MarksSummaryCard summary={exam.resultSummary} />
          </View>
        )}

        <View style={styles.section}>
          <AppCard variant="default">
            <Text style={styles.sectionTitle}>Exam Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{exam.duration} minutes</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Marks Entry</Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        exam.marksEntryStatus === 'completed'
                          ? theme.colors.success
                          : exam.marksEntryStatus === 'partial'
                          ? theme.colors.warning
                          : theme.colors.textTertiary,
                    },
                  ]}
                />
                <Text style={styles.infoValue}>
                  {exam.marksEntryStatus === 'completed'
                    ? 'Completed'
                    : exam.marksEntryStatus === 'partial'
                    ? 'Partial'
                    : 'Pending'}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Results</Text>
              <View style={styles.statusRow}>
                <Ionicons
                  name={exam.resultPublished ? 'checkmark-circle' : 'time-outline'}
                  size={16}
                  color={exam.resultPublished ? theme.colors.success : theme.colors.textTertiary}
                />
                <Text
                  style={[
                    styles.infoValue,
                    { color: exam.resultPublished ? theme.colors.success : theme.colors.textSecondary },
                  ]}
                >
                  {exam.resultPublished ? 'Published' : 'Not Published'}
                </Text>
              </View>
            </View>
          </AppCard>
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Enter Marks"
            variant="primary"
            leftIcon={<Ionicons name="create-outline" size={18} color={theme.colors.primaryContrast} />}
            onPress={handleEnterMarks}
            style={styles.actionButton}
          />
          <AppButton
            title="View Schedule"
            variant="secondary"
            leftIcon={<Ionicons name="calendar-outline" size={18} color={theme.colors.text} />}
            onPress={handleViewSchedule}
            style={styles.actionButton}
          />
          {exam.status === 'completed' && !exam.resultPublished && (
            <AppButton
              title="Publish Results"
              variant="ghost"
              leftIcon={<Ionicons name="megaphone-outline" size={18} color={theme.colors.primary} />}
              onPress={handlePublishResults}
              loading={publishMutation.isPending}
              style={styles.actionButton}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const examHeaderStyles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  name: {
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  detailsGrid: {
    gap: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
  },
  detailValue: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    fontWeight: theme.typography.weight.medium,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  skeletonCard: {
    margin: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    fontWeight: theme.typography.weight.medium,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
});
