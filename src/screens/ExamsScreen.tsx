import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, ScreenContainer } from '../components';
import { ExamCard } from '../components/ExamCard';
import { ExamEmptyState } from '../components/ExamEmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { useExams } from '../hooks/useExams';
import { theme } from '../theme';
import { AppStackParamList, ExamItem } from '../types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const ExamsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: exams, isLoading, isError, refetch, isRefetching } = useExams();

  const handleExamPress = useCallback(
    (exam: ExamItem) => {
      navigation.navigate('ExamDetail', { examId: exam.id });
    },
    [navigation]
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
        <AppHeader title="Exams" />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Exams" />
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
          <View style={styles.summaryRow}>
            {summary.map((item, index) => (
              <View key={index} style={styles.summaryCard}>
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
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
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  skeletonList: {
    padding: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  summaryValue: {
    ...theme.typography.hierarchy.title,
    fontWeight: theme.typography.weight.bold,
  },
  summaryLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
