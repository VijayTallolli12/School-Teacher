import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, AppHeader } from '../components';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { SkeletonList } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { theme } from '../theme';

interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  maxMarks: number;
  status: 'upcoming' | 'completed' | 'ongoing';
}

const MOCK_EXAMS: Exam[] = [
  { id: '1', name: 'Mid Term Exam', subject: 'Mathematics', date: '2026-07-15', maxMarks: 100, status: 'upcoming' },
  { id: '2', name: 'Unit Test', subject: 'Science', date: '2026-06-20', maxMarks: 50, status: 'completed' },
  { id: '3', name: 'Final Exam', subject: 'English', date: '2026-08-10', maxMarks: 100, status: 'upcoming' },
];

const statusConfig: Record<string, { color: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  upcoming: { color: theme.colors.info, label: 'Upcoming', icon: 'calendar-outline' },
  completed: { color: theme.colors.success, label: 'Completed', icon: 'checkmark-circle' },
  ongoing: { color: theme.colors.warning, label: 'Ongoing', icon: 'hourglass-outline' },
};

export const ExamsScreen: React.FC = () => {
  const [exams] = useState<Exam[]>(MOCK_EXAMS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Exams" />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Exams" />
      {exams.length === 0 ? (
        <EmptyState
          icon="school-outline"
          title="No Exams"
          message="No exams or assessments scheduled."
          actionLabel="Create Exam"
          onAction={() => {}}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        >
          <View style={styles.summaryRow}>
            <AppCard variant="stat" style={styles.summaryCard} contentStyle={styles.summaryCardContent}>
              <Ionicons name="school-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.summaryValue}>{exams.length}</Text>
              <Text style={styles.summaryLabel}>Total Exams</Text>
            </AppCard>
            <AppCard variant="stat" style={styles.summaryCard} contentStyle={styles.summaryCardContent}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.info} />
              <Text style={styles.summaryValue}>{exams.filter(e => e.status === 'upcoming').length}</Text>
              <Text style={styles.summaryLabel}>Upcoming</Text>
            </AppCard>
            <AppCard variant="stat" style={styles.summaryCard} contentStyle={styles.summaryCardContent}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              <Text style={styles.summaryValue}>{exams.filter(e => e.status === 'completed').length}</Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </AppCard>
          </View>

          {exams.map((exam) => {
            const config = statusConfig[exam.status];
            return (
              <AppCard key={exam.id} variant="default" accentColor={config.color} style={styles.examCard}>
                <View style={styles.examHeader}>
                  <View style={styles.examHeaderLeft}>
                    <Text style={styles.examName}>{exam.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
                      <Ionicons name={config.icon} size={12} color={config.color} />
                      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.examMarks}>Marks: {exam.maxMarks}</Text>
                </View>
                <View style={styles.examDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="book-outline" size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.detailText}>{exam.subject}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.detailText}>{exam.date}</Text>
                  </View>
                </View>
              </AppCard>
            );
          })}

          <AppButton
            title="Add Exam"
            variant="primary"
            leftIcon={<Ionicons name="add" size={18} color={theme.colors.primaryContrast} />}
            onPress={() => {}}
            style={styles.addButton}
            accessibilityLabel="Add new exam"
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skeletonList: {
    padding: theme.spacing.md,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    flex: 1,
  },
  summaryCardContent: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  summaryValue: {
    ...theme.typography.hierarchy.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  summaryLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  examCard: {
    marginBottom: theme.spacing.sm,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  examHeaderLeft: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  examName: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
  },
  examMarks: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  examDetails: {
    gap: theme.spacing.xs,
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
  addButton: {
    marginTop: theme.spacing.lg,
  },
});
