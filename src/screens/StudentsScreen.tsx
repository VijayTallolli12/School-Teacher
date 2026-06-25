import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenContainer, AppHeader } from '../components';
import { StudentCard } from '../components/StudentCard';
import { StudentSearchBar } from '../components/StudentSearchBar';
import { StudentFilterSheet } from '../components/StudentFilterSheet';
import { EmptyState } from '../components/EmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { useStudents } from '../hooks/useStudents';
import { theme } from '../theme';
import { StudentItem, StudentStatus } from '../types';

interface FilterState {
  classSectionId: string;
  status: StudentStatus | '';
}

export const StudentsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    classSectionId: '',
    status: '',
  });

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    if (search.trim()) params.search = search.trim();
    if (filters.classSectionId) params.class_section_id = filters.classSectionId;
    if (filters.status) params.status = filters.status;
    return params;
  }, [search, filters]);

  const {
    data: students,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useStudents(queryParams);

  const handleStudentPress = useCallback(
    (student: StudentItem) => {
      router.push({ pathname: '/(tabs)/more/student-detail', params: { studentId: student.id } });
    },
    []
  );

  const handleApplyFilters = useCallback(
    (newFilters: { classSectionId: string; status: StudentStatus | '' }) => {
      setFilters({ classSectionId: newFilters.classSectionId, status: newFilters.status });
    },
    []
  );

  const activeFilterCount = useMemo(
    () => [filters.classSectionId, filters.status].filter(Boolean).length,
    [filters]
  );

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.screen}>
      <AppHeader title="Students" showBackButton onBackPress={() => router.back()} />

      <StudentSearchBar
        value={search}
        onChangeText={setSearch}
        onFilterPress={() => setShowFilters(true)}
      />

      {/* Active filter indicators */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersRow}>
          <Text style={styles.activeFiltersText}>
            <Ionicons name="funnel-outline" size={12} color={theme.colors.primary} /> {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </Text>
          <Text
            style={styles.clearFiltersText}
            onPress={() => setFilters({ classSectionId: '', status: '' })}
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
          >
            Clear all
          </Text>
        </View>
      )}

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
        {isLoading ? (
          <SkeletonList count={4} />
        ) : isError ? (
          <EmptyState
            icon="alert-circle-outline"
            title="Something went wrong"
            message="Could not load students. Pull down to retry."
          />
        ) : students && students.length > 0 ? (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onPress={() => handleStudentPress(student)}
            />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No students found"
            message={
              search
                ? 'Try adjusting your search or filters'
                : 'No students are assigned to you'
            }
          />
        )}
      </ScrollView>

      <StudentFilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialClassSectionId={filters.classSectionId}
        initialStatus={filters.status}
      />
      </View>
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
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  activeFiltersText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.medium,
  },
  clearFiltersText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    textDecorationLine: 'underline',
  },
});
