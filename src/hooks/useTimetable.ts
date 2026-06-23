import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { timetableApi } from '../api/timetable';
import { PeriodItem, TimetableDay } from '../types';

export const useTodayTimetable = (): UseQueryResult<{
  day: TimetableDay;
  currentPeriod: PeriodItem | null;
  nextPeriod: PeriodItem | null;
}, Error> => {
  return useQuery({
    queryKey: ['timetable', 'today'],
    queryFn: async () => {
      const response = await timetableApi.getTodayTimetable();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
};

export const useWeeklyTimetable = (): UseQueryResult<TimetableDay[], Error> => {
  return useQuery({
    queryKey: ['timetable', 'week'],
    queryFn: async () => {
      const response = await timetableApi.getWeeklyTimetable();
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const usePeriodDetail = (
  periodId: string
): UseQueryResult<PeriodItem, Error> => {
  return useQuery({
    queryKey: ['timetable', 'period', periodId],
    queryFn: async () => {
      const response = await timetableApi.getPeriodDetail(periodId);
      return response.data;
    },
    enabled: !!periodId,
    staleTime: 5 * 60 * 1000,
  });
};
