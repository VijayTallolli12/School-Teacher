import apiClient from '../utils/axios';
import {
  TodayTimetableResponse,
  WeeklyTimetableResponse,
  PeriodDetailResponse,
  PeriodItem,
  TimetableDay,
} from '../types';

interface ApiSlot {
  id: number;
  period_label: string;
  start_time: string;
  end_time: string;
  subject: { id: number; name: string; code: string } | null;
  class_section: { id: number; class: string; section: string } | null;
  room: string | null;
}

interface ApiDayGroup {
  day_of_week: number;
  day_name: string;
  slots: ApiSlot[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function mapSlot(item: ApiSlot): PeriodItem {
  return {
    id: String(item?.id ?? ''),
    periodNumber: parsePeriodNumber(item?.period_label),
    startTime: item?.start_time ?? '--:--',
    endTime: item?.end_time ?? '--:--',
    subject: item?.subject?.name ?? 'Unnamed Period',
    className: item?.class_section?.class ?? '',
    section: item?.class_section?.section ?? '',
    room: item?.room ?? 'Room Not Assigned',
    teacher: 'Not assigned',
    studentCount: 0,
  };
}

function parsePeriodNumber(label: string | undefined): number {
  if (!label) return 0;
  const match = label.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function getTodayDayOfWeek(): number {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const timetableApi = {
  async getTodayTimetable(): Promise<TodayTimetableResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: { timetable: ApiDayGroup[] };
    }>('/api/v1/teacher/timetable');
    const groups = response.data?.data?.timetable ?? [];
    const today = getTodayDayOfWeek();
    const todayGroup = groups.find((g) => g.day_of_week === today);

    const periods = Array.isArray(todayGroup?.slots) ? todayGroup.slots.map(mapSlot) : [];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let currentPeriod: PeriodItem | null = null;
    let nextPeriod: PeriodItem | null = null;

    for (const p of periods) {
      const startParts = p.startTime.split(':');
      const endParts = p.endTime.split(':');
      const start = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
      const end = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

      if (currentTime >= start && currentTime < end) {
        currentPeriod = p;
      } else if (currentTime < start && !nextPeriod) {
        nextPeriod = p;
      }
    }

    return {
      data: {
        day: {
          day: todayGroup?.day_name ?? DAY_NAMES[now.getDay()],
          date: formatDate(now),
          periods,
        },
        currentPeriod,
        nextPeriod,
      },
    };
  },

  async getWeeklyTimetable(): Promise<WeeklyTimetableResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: { timetable: ApiDayGroup[] };
    }>('/api/v1/teacher/timetable');
    const groups = response.data?.data?.timetable ?? [];

    const days: TimetableDay[] = groups.map((g) => ({
      day: g.day_name ?? 'Unknown',
      date: '',
      periods: Array.isArray(g.slots) ? g.slots.map(mapSlot) : [],
    }));

    return { data: days };
  },

  async getPeriodDetail(periodId: string): Promise<PeriodDetailResponse> {
    const today = await this.getTodayTimetable();
    const period = today.data.day.periods.find((p) => p.id === periodId) ?? {
      id: periodId,
      periodNumber: 0,
      startTime: '--:--',
      endTime: '--:--',
      subject: 'Unnamed Period',
      className: '',
      section: '',
      room: 'Room Not Assigned',
      teacher: 'Not assigned',
      studentCount: 0,
    };
    return { data: period };
  },
};
