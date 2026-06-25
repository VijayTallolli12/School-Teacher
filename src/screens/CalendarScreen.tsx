import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader, EmptyState, ScreenContainer, SkeletonList } from '../components';
import { Card } from '../components/ui/Card';
import { useWeeklyTimetable } from '../hooks/useTimetable';
import { theme } from '../theme';

export const CalendarScreen: React.FC = () => {
  const { data: weekData, isLoading, isError, refetch, isRefetching } = useWeeklyTimetable();

  const days = useMemo(() => weekData ?? [], [weekData]);

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
        <AppHeader title="Calendar" showBackButton onBackPress={() => router.back()} />
        <SkeletonList count={5} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Calendar" showBackButton onBackPress={() => router.back()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.primary} />
        }
      >
        {isError ? (
          <EmptyState icon="cloud-offline-outline" title="Unable to Load Calendar" message="Pull down to retry." />
        ) : days.length === 0 ? (
          <EmptyState icon="calendar-outline" title="No calendar items found" message="Your timetable calendar will appear here." />
        ) : (
          days.map((day, index) => {
            const periods = day?.periods ?? [];
            return (
              <TouchableOpacity
                key={day?.day ?? `day-${index}`}
                activeOpacity={0.72}
                onPress={() => router.push('/(tabs)/more/timetable')}
                accessibilityRole="button"
                accessibilityLabel={`Open timetable for ${day?.day ?? 'day'}`}
              >
                <Card padding="md" className="mb-3">
                  <View style={styles.dayRow}>
                    <View style={styles.iconBox}>
                      <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
                    </View>
                    <View style={styles.dayText}>
                      <Text style={styles.dayTitle}>{day?.day ?? 'Unknown Day'}</Text>
                      <Text style={styles.daySubtitle}>
                        {periods.length === 0 ? 'No classes scheduled' : `${periods.length} period${periods.length > 1 ? 's' : ''} scheduled`}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxl },
  skeletonList: { padding: theme.spacing.md },
  dayRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
    marginRight: theme.spacing.md,
  },
  dayText: { flex: 1 },
  dayTitle: { ...theme.typography.hierarchy.bodySmall, fontWeight: theme.typography.weight.bold, color: theme.colors.text },
  daySubtitle: { ...theme.typography.hierarchy.caption, color: theme.colors.textSecondary, marginTop: 2 },
});
