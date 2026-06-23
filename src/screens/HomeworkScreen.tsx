import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../components';
import { HomeworkHeader, HomeworkCard, HomeworkEmptyState } from '../components';
import { useHomework } from '../hooks/useHomework';
import { useClasses } from '../hooks/useAttendance';
import { HomeworkItem } from '../types';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

export const HomeworkScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: homework, isLoading, error, refetch } = useHomework();
  const { data: classes } = useClasses();

  const handleCreateHomework = () => {
    (navigation as any).navigate('HomeworkCreate');
  };

  const handleHomeworkPress = (homeworkItem: HomeworkItem) => {
    (navigation as any).navigate('HomeworkDetail', { homeworkId: homeworkItem.id });
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Homework</Text>
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

  if (isLoading) {
    return (
      <ScreenContainer>
        <HomeworkHeader title="Homework" />
        <View style={styles.container}>
          <HomeworkListSkeleton />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <HomeworkHeader title="Homework" subtitle={homework && homework.length > 0 ? `${homework.length} assignments` : undefined} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {homework && homework.length > 0 ? (
          homework.map((item) => (
            <HomeworkCard
              key={item.id}
              homework={item}
              onPress={() => handleHomeworkPress(item)}
            />
          ))
        ) : (
          <HomeworkEmptyState />
        )}
      </ScrollView>
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleCreateHomework}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const HomeworkListSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skeletonCard} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: 80,
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
    padding: theme.spacing.md,
  },
  skeletonCard: {
    height: 120,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  fabText: {
    fontSize: 32,
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
