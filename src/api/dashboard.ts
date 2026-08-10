import apiClient from '../utils/axios';
import { DashboardData } from '../types';

interface ApiDashboardData {
  teacher: { id: number; full_name: string; photo_url: string | null };
  today_classes: unknown[];
  my_attendance_today: { status: string; status_label: string; remarks: string | null };
  pending_homework_count: number;
  upcoming_exams: unknown[];
  notifications: { unread_count: number };
}

export const dashboardApi = {
  async getDashboard(): Promise<{ data: DashboardData }> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiDashboardData;
    }>('/api/v1/teacher/dashboard');
    const d = response.data.data;
    return {
      data: {
        todaysClasses: (d?.today_classes ?? []).length,
        attendancePending: d?.my_attendance_today?.status === 'absent' ? 1 : 0,
        homeworkPending: d?.pending_homework_count ?? 0,
        upcomingExams: (d?.upcoming_exams ?? []).length,
        notificationCount: d?.notifications?.unread_count ?? 0,
        teacherName: d?.teacher?.full_name ?? '',
        date: new Date().toISOString().split('T')[0],
      },
    };
  },
};
