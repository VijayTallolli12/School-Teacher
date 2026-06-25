import React, { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader, EmptyState, ScreenContainer, SkeletonList } from '../components';
import { Card } from '../components/ui/Card';
import { ExamCard } from '../components/ExamCard';
import { useExams } from '../hooks/useExams';
import { theme } from '../theme';
import { ExamItem } from '../types';

export const ResultsScreen: React.FC = () => {
  const { data: exams, isLoading, isError, refetch, isRefetching } = useExams();

  const resultExams = useMemo(
    () => (exams ?? []).filter((exam) => exam?.status === 'completed' || exam?.resultPublished),
    [exams]
  );

  const summary = useMemo(() => {
    const published = resultExams.filter((exam) => exam?.resultPublished).length;
    const pending = resultExams.length - published;
    return { total: resultExams.length, published, pending };
  }, [resultExams]);

  const handleExamPress = useCallback((exam: ExamItem) => {
    router.push({ pathname: '/(tabs)/more/exam-detail', params: { examId: exam?.id ?? '' } });
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
        <AppHeader title="Results" showBackButton onBackPress={() => router.back()} />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Results" showBackButton onBackPress={() => router.back()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {!isError && resultExams.length > 0 && (
          <View style={styles.summaryRow}>
            <ResultMetric icon="trophy-outline" label="Completed" value={summary.total} color="#BE185D" />
            <ResultMetric icon="checkmark-circle-outline" label="Published" value={summary.published} color="#16A34A" />
            <ResultMetric icon="create-outline" label="Pending" value={summary.pending} color="#D97706" />
          </View>
        )}

        {isError ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Unable to Load Results"
            message="Pull down to retry."
          />
        ) : resultExams.length === 0 ? (
          <EmptyState
            icon="trophy-outline"
            title="No results found"
            message="Completed exams and published results will appear here."
          />
        ) : (
          resultExams.map((exam) => (
            <ExamCard key={exam?.id ?? exam?.name} exam={exam} onPress={() => handleExamPress(exam)} />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

function ResultMetric({ icon, label, value, color }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card padding="md" className="flex-1">
      <View style={styles.metricContent}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
        <Text style={styles.metricLabel} numberOfLines={1}>{label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  skeletonList: {
    padding: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  metricContent: {
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
  },
  metricLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
});
