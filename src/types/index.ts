export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher';
  schoolId: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface AttendanceMarkingRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  dueDate: string;
  createdAt: string;
}

export interface HomeworkItem extends Homework {
  status: 'pending' | 'submitted' | 'overdue';
}

export interface HomeworkPayload {
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  dueDate: string;
}

export interface HomeworkResponse {
  data: HomeworkItem;
}

export interface HomeworkListResponse {
  data: HomeworkItem[];
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  class: string;
  section: string;
  date: string;
  duration: number;
  totalMarks: number;
}

export interface NavigationParams {
  [key: string]: object | undefined;
}

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  Exams: undefined;
  HomeworkCreate: { homeworkId?: string; initialData?: HomeworkPayload } | undefined;
  HomeworkDetail: { homeworkId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Attendance: undefined;
  Homework: undefined;
  Profile: undefined;
};

export interface DashboardData {
  todaysClasses: number;
  attendancePending: number;
  homeworkPending: number;
  upcomingExams: number;
  notificationCount: number;
  teacherName: string;
  date: string;
}

export interface DashboardResponse {
  data: DashboardData;
}

export interface TeacherClass {
  id: string;
  name: string;
  section: string;
  subject: string;
  academicYear: string;
}

export interface AttendanceStudent {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

export interface MarkAttendancePayload {
  classId: string;
  date: string;
  attendance: AttendanceMarkingRecord[];
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    processedCount: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
  };
}

export interface ClassesResponse {
  data: TeacherClass[];
}

export interface StudentsResponse {
  data: AttendanceStudent[];
}
