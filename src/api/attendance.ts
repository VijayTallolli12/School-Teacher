import apiClient from '../utils/axios';
import {
  ClassesResponse,
  StudentsResponse,
  MarkAttendancePayload,
  MarkAttendanceResponse,
  TeacherClass,
  AttendanceStudent,
} from '../types';

interface ApiClass {
  id: number;
  class: string;
  section: string;
  is_class_teacher: boolean;
}

export const attendanceApi = {
  async getClasses(): Promise<ClassesResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: { classes: ApiClass[]; subjects: { id: number; name: string; code: string }[] };
    }>('/api/v1/teacher/attendance/classes');
    const apiClasses = response.data.data.classes;
    const mapped: TeacherClass[] = apiClasses.map((c) => ({
      id: String(c.id),
      name: c.class,
      section: c.section,
      subject: '',
      academicYear: '',
    }));
    return { data: mapped };
  },

  async getStudents(classId: string): Promise<StudentsResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        class_section: { id: number; class: string; section: string };
        date: string;
        total_students: number;
        students: Array<{
          student_id: number;
          uuid: string;
          admission_no: string;
          full_name: string;
          roll_no: string;
          photo_url: string | null;
          attendance: null | { status: string };
        }>;
      };
    }>(`/api/v1/teacher/attendance/students/${classId}`);
    const apiStudents = response.data.data.students;
    const mapped: AttendanceStudent[] = apiStudents.map((s) => ({
      id: String(s.student_id),
      name: s.full_name,
      rollNumber: s.roll_no,
      class: response.data.data.class_section.class,
      section: response.data.data.class_section.section,
    }));
    return { data: mapped };
  },

  async markAttendance(payload: MarkAttendancePayload): Promise<MarkAttendanceResponse> {
    const response = await apiClient.post<MarkAttendanceResponse>('/api/v1/teacher/attendance/mark', payload);
    return response.data;
  },
};
