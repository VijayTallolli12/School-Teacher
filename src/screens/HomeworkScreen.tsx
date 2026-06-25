import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenContainer, AppHeader } from '../components';
import { SkeletonList } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { HomeworkCard, HomeworkEmptyState } from '../components';
import { useHomework } from '../hooks/useHomework';
import { HomeworkItem } from '../types';
import { getHomeworkStatusLabel } from '../utils/homework';

const filters = ['All', 'Due Today', 'Upcoming', 'Overdue'] as const;

type FilterOption = (typeof filters)[number];

export const HomeworkScreen: React.FC = () => {
  const { data: homework, isLoading, error, refetch } = useHomework();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const handleCreateHomework = () => {
    router.push('/(tabs)/homework/create');
  };

  const handleHomeworkPress = (homeworkItem: HomeworkItem) => {
    router.push({ pathname: '/(tabs)/homework/[id]', params: { id: homeworkItem.id } });
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
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load Homework"
          message={error.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Homework" />
        <View style={styles.container}>
          <SkeletonList count={4} style={styles.skeletonList} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppHeader title="Homework" subtitle={homework && homework.length > 0 ? `${homework.length} assignment${homework.length > 1 ? 's' : ''}` : undefined} />
      <View style={styles.filterBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by title or subject"
            placeholderTextColor="#94A3B8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
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
      <TouchableOpacity style={styles.fab} onPress={handleCreateHomework} accessibilityRole="button" accessibilityLabel="Create homework">
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const styles: Record<string, any> = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 90,
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  filterChips: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  skeletonList: {
    padding: 12,
  },
  fab: {
    position: 'absolute' as const,
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};
