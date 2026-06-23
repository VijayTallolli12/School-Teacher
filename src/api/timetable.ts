import apiClient from '../utils/axios';
import {
  TodayTimetableResponse,
  WeeklyTimetableResponse,
  PeriodDetailResponse,
} from '../types';

export const timetableApi = {
  async getTodayTimetable(): Promise<TodayTimetableResponse> {
    const response = await apiClient.get<TodayTimetableResponse>(
      '/api/v1/teacher/timetable/today'
    );
    return response.data;
  },

  async getWeeklyTimetable(): Promise<WeeklyTimetableResponse> {
    const response = await apiClient.get<WeeklyTimetableResponse>(
      '/api/v1/teacher/timetable/week'
    );
    return response.data;
  },

  async getPeriodDetail(periodId: string): Promise<PeriodDetailResponse> {
    const response = await apiClient.get<PeriodDetailResponse>(
      `/api/v1/teacher/timetable/periods/${periodId}`
    );
    return response.data;
  },
};
