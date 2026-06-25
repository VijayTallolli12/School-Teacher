import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { AppHeader, ScreenContainer, SkeletonList } from '../components';
import { TimetableHeader } from '../components/TimetableHeader';
import { CurrentPeriodBanner } from '../components/CurrentPeriodBanner';
import { DaySelector } from '../components/DaySelector';
import { PeriodCard } from '../components/PeriodCard';
import { EmptyTimetableState } from '../components/EmptyTimetableState';
import { useTodayTimetable, useWeeklyTimetable } from '../hooks/useTimetable';
import { theme } from '../theme';
import { PeriodItem } from '../types';
import { useNavParamStore } from '@/store/navParams.store';

const getPeriodStatus = (
  period: PeriodItem,
  currentPeriodId?: string | null,
  nextPeriodId?: string | null
): 'current' | 'upcoming' | 'completed' => {
  if (!period?.id) return 'completed';
  if (currentPeriodId && period.id === currentPeriodId) return 'current';
  if (nextPeriodId && period.id === nextPeriodId) return 'upcoming';
  return 'completed';
};

export const TimetableScreen: React.FC = () => {
  const [mode, setMode] = useState<'today' | 'week'>('today');

  const {
    data: todayData,
    isLoading: todayLoading,
    isError: todayError,
    refetch: refetchToday,
    isRefetching: todayRefetching,
  } = useTodayTimetable();

  const {
    data: weekData,
    isLoading: weekLoading,
    isError: weekError,
    refetch: refetchWeek,
    isRefetching: weekRefetching,
  } = useWeeklyTimetable();

  const [selectedDay, setSelectedDay] = useState<string>('');

  React.useEffect(() => {
    if (weekData && weekData.length > 0 && !selectedDay) {
      const firstDay = weekData[0]?.day;
      if (firstDay) {
        setSelectedDay(firstDay);
      }
    }
  }, [weekData, selectedDay]);

  const weekDayMap = useMemo(() => {
    const map = new Map<string, PeriodItem[]>();
    if (weekData) {
      weekData.forEach((d) => {
        if (d?.day && d?.periods) {
          map.set(d.day, d.periods);
        }
      });
    }
    return map;
  }, [weekData]);

  const selectedDayPeriods = useMemo(
    () => weekDayMap.get(selectedDay) ?? [],
    [weekDayMap, selectedDay]
  );

  const availableDays = useMemo(
    () => (weekData ?? []).map((d) => d?.day).filter(Boolean) as string[],
    [weekData]
  );

  const setNavParams = useNavParamStore((s) => s.setParams);

  const handlePeriodPress = useCallback(
    (period: PeriodItem) => {
      setNavParams('period', period);
      router.push('/(tabs)/more/period-detail');
    },
    [setNavParams]
  );

  const isRefreshing =
    (mode === 'today' && todayRefetching) ||
    (mode === 'week' && weekRefetching);

  const onRefresh = useCallback(() => {
    if (mode === 'today') refetchToday();
    else refetchWeek();
  }, [mode, refetchToday, refetchWeek]);

  const weekDayName = useMemo(() => {
    const names = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday',
    ];
    return names[new Date().getDay()] ?? 'Unknown';
  }, []);

  const renderTodayContent = () => {
    if (todayLoading) {
      return (
        <View style={styles.centeredContainer}>
          <SkeletonList count={4} />
        </View>
      );
    }

    if (todayError) {
      return (
        <EmptyTimetableState message="Could not load today's timetable. Pull down to retry." />
      );
    }

    if (!todayData?.day?.periods || todayData.day.periods.length === 0) {
      return <EmptyTimetableState />;
    }

    const day = todayData.day;
    const currentPeriod = todayData.currentPeriod ?? null;
    const nextPeriod = todayData.nextPeriod ?? null;

    return (
      <>
        <CurrentPeriodBanner
          currentPeriod={currentPeriod}
          nextPeriod={nextPeriod}
          onCurrentPress={
            currentPeriod
              ? () => handlePeriodPress(currentPeriod)
              : undefined
          }
        />
        {day.periods.map((period, index) => (
          <PeriodCard
            key={period?.id ?? `period-${index}`}
            period={period}
            status={getPeriodStatus(period, currentPeriod?.id, nextPeriod?.id)}
            onPress={() => handlePeriodPress(period)}
          />
        ))}
      </>
    );
  };

  const renderWeekContent = () => {
    if (weekLoading) {
      return (
        <View style={styles.centeredContainer}>
          <SkeletonList count={4} />
        </View>
      );
    }

    if (weekError) {
      return (
        <EmptyTimetableState
          isWeekView
          message="Could not load weekly timetable. Pull down to retry."
        />
      );
    }

    if (!weekData || weekData.length === 0) {
      return <EmptyTimetableState isWeekView />;
    }

    const periods = selectedDayPeriods;

    return (
      <>
        <DaySelector
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          availableDays={availableDays}
        />
        {periods.length === 0 ? (
          <EmptyTimetableState
            isWeekView
            message={`No classes on ${selectedDay || 'selected day'}`}
          />
        ) : (
          periods.map((period, index) => (
            <PeriodCard
              key={period?.id ?? `period-${index}`}
              period={period}
              status="upcoming"
              onPress={() => handlePeriodPress(period)}
            />
          ))
        )}
      </>
    );
  };

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.screen}>
      <AppHeader title="Timetable" showBackButton onBackPress={() => router.back()} />
      <TimetableHeader
        mode={mode}
        onModeChange={setMode}
        dayInfo={mode === 'today' ? weekDayName : undefined}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {mode === 'today' ? renderTodayContent() : renderWeekContent()}
      </ScrollView>
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
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
});
