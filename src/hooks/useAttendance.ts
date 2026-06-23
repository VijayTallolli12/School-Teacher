import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance';
import { TeacherClass, AttendanceStudent, MarkAttendancePayload, MarkAttendanceResponse } from '../types';

export const useClasses = (): UseQueryResult<TeacherClass[], Error> => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await attendanceApi.getClasses();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStudents = (classId: string): UseQueryResult<AttendanceStudent[], Error> => {
  return useQuery({
    queryKey: ['students', classId],
    queryFn: async () => {
      const response = await attendanceApi.getStudents(classId);
      return response.data;
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMarkAttendance = (): UseMutationResult<
  MarkAttendanceResponse,
  Error,
  MarkAttendancePayload
> => {
  return useMutation({
    mutationFn: async (payload: MarkAttendancePayload) => {
      const response = await attendanceApi.markAttendance(payload);
      return response;
    },
  });
};
