import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { studentsApi, StudentQueryParams } from '../api/students';
import { StudentItem, StudentDetail, AttendanceSummaryData } from '../types';

export const useStudents = (
  params?: StudentQueryParams
): UseQueryResult<StudentItem[], Error> => {
  return useQuery<StudentItem[], Error>({
    queryKey: ['students', params],
    queryFn: async () => {
      const response = await studentsApi.getStudents(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStudentDetail = (
  studentId: string
): UseQueryResult<StudentDetail, Error> => {
  return useQuery({
    queryKey: ['students', studentId],
    queryFn: async () => {
      const response = await studentsApi.getStudentDetail(studentId);
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStudentAttendance = (
  studentId: string
): UseQueryResult<AttendanceSummaryData, Error> => {
  return useQuery({
    queryKey: ['students', studentId, 'attendance'],
    queryFn: async () => {
      const response = await studentsApi.getStudentAttendance(studentId);
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};
