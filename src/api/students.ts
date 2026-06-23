import apiClient from '../utils/axios';
import {
  StudentListResponse,
  StudentDetailResponse,
  StudentAttendanceResponse,
} from '../types';

export interface StudentQueryParams {
  search?: string;
  class?: string;
  section?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export const studentsApi = {
  async getStudents(params?: StudentQueryParams): Promise<StudentListResponse> {
    const response = await apiClient.get<StudentListResponse>(
      '/api/v1/teacher/students',
      { params }
    );
    return response.data;
  },

  async getStudentDetail(studentId: string): Promise<StudentDetailResponse> {
    const response = await apiClient.get<StudentDetailResponse>(
      `/api/v1/teacher/students/${studentId}`
    );
    return response.data;
  },

  async getStudentAttendance(studentId: string): Promise<StudentAttendanceResponse> {
    const response = await apiClient.get<StudentAttendanceResponse>(
      `/api/v1/teacher/students/${studentId}/attendance`
    );
    return response.data;
  },

  async getStudentProfile(studentId: string): Promise<StudentDetailResponse> {
    const response = await apiClient.get<StudentDetailResponse>(
      `/api/v1/teacher/students/${studentId}/profile`
    );
    return response.data;
  },
};
