import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader } from '../components';
import { StudentCard } from '../components/StudentCard';
import { StudentSearchBar } from '../components/StudentSearchBar';
import { StudentFilterSheet } from '../components/StudentFilterSheet';
import { useStudents } from '../hooks/useStudents';
import { theme } from '../theme';
import { AppStackParamList, StudentItem, StudentStatus } from '../types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface FilterState {
  class: string;
  section: string;
  status: StudentStatus | '';
}

export const StudentsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    class: '',
    section: '',
    status: '',
  });

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    if (search.trim()) params.search = search.trim();
    if (filters.class) params.class = filters.class;
    if (filters.section) params.section = filters.section;
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
      navigation.navigate('StudentDetail', { studentId: student.id });
    },
    [navigation]
  );

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const activeFilterCount = useMemo(
    () =>
      [filters.class, filters.section, filters.status].filter(Boolean).length,
    [filters]
  );

  return (
    <View style={styles.screen}>
      <AppHeader title="Students" />

      <StudentSearchBar
        value={search}
        onChangeText={setSearch}
        onFilterPress={() => setShowFilters(true)}
      />

      {/* Active filter indicators */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersRow}>
          <Text style={styles.activeFiltersText}>
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </Text>
          <Text
            style={styles.clearFiltersText}
            onPress={() => setFilters({ class: '', section: '', status: '' })}
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
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyText}>
              Could not load students. Pull down to retry.
            </Text>
          </View>
        ) : students && students.length > 0 ? (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onPress={() => handleStudentPress(student)}
            />
          ))
        ) : (
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No students found</Text>
            <Text style={styles.emptyText}>
              {search
                ? 'Try adjusting your search or filters'
                : 'No students are assigned to you'}
            </Text>
          </View>
        )}
      </ScrollView>

      <StudentFilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </View>
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
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  activeFiltersText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  clearFiltersText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textDecorationLine: 'underline',
  },
});
