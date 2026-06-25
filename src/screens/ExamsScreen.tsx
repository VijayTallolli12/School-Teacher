import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader, ScreenContainer } from '../components';
import { Card } from '../components/ui/Card';
import { ExamCard } from '../components/ExamCard';
import { ExamEmptyState } from '../components/ExamEmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { useExams } from '../hooks/useExams';
import { theme } from '../theme';
import { ExamItem } from '../types';

export const ExamsScreen: React.FC = () => {
  const { data: exams, isLoading, isError, refetch, isRefetching } = useExams();

  const handleExamPress = useCallback(
    (exam: ExamItem) => {
      router.push({ pathname: '/(tabs)/more/exam-detail', params: { examId: exam.id } });
    },
    []
  );

  const summary = useMemo(() => {
    if (!exams) return [];
    const total = exams.length;
    const upcoming = exams.filter((e) => e.status === 'upcoming').length;
    const completed = exams.filter((e) => e.status === 'completed').length;
    const published = exams.filter((e) => e.resultPublished).length;
    const pendingMarks = exams.filter(
      (e) => e.status === 'completed' && !e.marksEntered
    ).length;
    return [
      { icon: 'calendar-outline' as const, value: upcoming, label: 'Upcoming', color: theme.colors.info },
      { icon: 'checkmark-circle' as const, value: completed, label: 'Completed', color: theme.colors.success },
      { icon: 'megaphone-outline' as const, value: published, label: 'Published', color: theme.colors.primary },
      { icon: 'create-outline' as const, value: pendingMarks, label: 'Pending Marks', color: theme.colors.warning },
    ];
  }, [exams]);

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
        <AppHeader title="Exams" showBackButton onBackPress={() => router.back()} />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Exams" showBackButton onBackPress={() => router.back()} />
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
        {exams && exams.length > 0 && (
          <View style={styles.summaryGrid}>
            <View style={styles.summaryRow}>
              {summary.slice(0, 2).map((item, index) => (
                <Card key={index} padding="md" className="flex-1">
                  <View className="items-center">
                    <Text
                      className="text-slate-900 text-2xl font-bold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ lineHeight: 30 }}
                    >
                      {item.value}
                    </Text>
                    <View className="flex-row items-center gap-1 mt-1.5">
                      <View
                        className="w-5 h-5 rounded-md items-center justify-center"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        <Ionicons name={item.icon} size={12} color={item.color} />
                      </View>
                      <Text className="text-slate-500 text-[11px] font-medium" numberOfLines={1}>
                        {item.label}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
            <View style={styles.summaryRow}>
              {summary.slice(2, 4).map((item, index) => (
                <Card key={index} padding="md" className="flex-1">
                  <View className="items-center">
                    <Text
                      className="text-slate-900 text-2xl font-bold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ lineHeight: 30 }}
                    >
                      {item.value}
                    </Text>
                    <View className="flex-row items-center gap-1 mt-1.5">
                      <View
                        className="w-5 h-5 rounded-md items-center justify-center"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        <Ionicons name={item.icon} size={12} color={item.color} />
                      </View>
                      <Text className="text-slate-500 text-[11px] font-medium" numberOfLines={1}>
                        {item.label}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        )}

        {isError ? (
          <ExamEmptyState message="Could not load exams. Pull down to retry." />
        ) : !exams || exams.length === 0 ? (
          <ExamEmptyState />
        ) : (
          exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onPress={() => handleExamPress(exam)} />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

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
  summaryGrid: {
    gap: 10,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
