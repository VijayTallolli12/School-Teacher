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
};

export type MainTabParamList = {
  Dashboard: undefined;
  Attendance: undefined;
  Homework: undefined;
  Profile: undefined;
};
