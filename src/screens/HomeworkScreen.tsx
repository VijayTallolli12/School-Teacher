import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenContainer } from '../components';
import { HomeworkHeader, HomeworkCard, HomeworkEmptyState } from '../components';
import { useHomework } from '../hooks/useHomework';
import { HomeworkItem } from '../types';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { getHomeworkStatusLabel } from '../utils/homework';

const filters = ['All', 'Due Today', 'Upcoming', 'Overdue'] as const;

type FilterOption = (typeof filters)[number];

export const HomeworkScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: homework, isLoading, error, refetch } = useHomework();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const handleCreateHomework = () => {
    (navigation as any).navigate('HomeworkCreate');
  };

  const handleHomeworkPress = (homeworkItem: HomeworkItem) => {
    (navigation as any).navigate('HomeworkDetail', { homeworkId: homeworkItem.id });
  };

  const handleRetry = () => {
    refetch();
  };

  const filteredHomework = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return (homework || []).filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.subject.toLowerCase().includes(normalizedSearch);

      if (!matchesQuery) {
        return false;
      }

      const statusLabel = getHomeworkStatusLabel(item);
      if (activeFilter === 'All') {
        return true;
      }
      return statusLabel === activeFilter;
    });
  }, [homework, searchQuery, activeFilter]);

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
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by title or subject"
          placeholderTextColor={theme.colors.textLight}
        />
        <View style={styles.filterChips}>
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {filteredHomework.length > 0 ? (
          filteredHomework.map((item) => (
            <HomeworkCard
              key={item.id}
              homework={item}
              onPress={() => handleHomeworkPress(item)}
            />
          ))
        ) : (
          <HomeworkEmptyState message={homework && homework.length > 0 ? 'No homework matches your search or filter.' : 'No homework assigned yet'} />
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
  filterBar: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.xs,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  filterChipTextActive: {
    color: theme.colors.background,
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
