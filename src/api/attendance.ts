import apiClient from '../utils/axios';
import {
  ClassesResponse,
  StudentsResponse,
  MarkAttendancePayload,
  MarkAttendanceResponse,
} from '../types';

export const attendanceApi = {
  async getClasses(): Promise<ClassesResponse> {
    const response = await apiClient.get<ClassesResponse>('/api/v1/teacher/attendance/classes');
    return response.data;
  },

  async getStudents(classId: string): Promise<StudentsResponse> {
    const response = await apiClient.get<StudentsResponse>(`/api/v1/teacher/attendance/students/${classId}`);
    return response.data;
  },

  async markAttendance(payload: MarkAttendancePayload): Promise<MarkAttendanceResponse> {
    const response = await apiClient.post<MarkAttendanceResponse>('/api/v1/teacher/attendance/mark', payload);
    return response.data;
  },
};
