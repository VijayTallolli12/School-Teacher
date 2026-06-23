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
  Notifications: undefined;
  Profile: undefined;
};

export type NotificationType =
  | 'attendance'
  | 'homework'
  | 'exam'
  | 'fee'
  | 'transport'
  | 'system'
  | 'ai_agent';

export type NotificationFilterValue = 'all' | 'unread' | 'read';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
  data?: Record<string, unknown>;
}

export interface NotificationResponse {
  data: {
    unread_count: number;
    notifications: Array<{
      id: string | number;
      title: string;
      message: string;
      type: string;
      type_label: string;
      priority: string;
      is_read: boolean;
      sent_at: string | null;
      read_at: string | null;
    }>;
  };
}

export interface UnreadCountResponse {
  data: {
    unread_count: number;
  };
}

export interface NotificationMutationResponse {
  success: boolean;
  message?: string;
  data?: NotificationItem;
}

export interface RegisterDevicePayload {
  device_type: string;
  platform: 'android' | 'ios';
  device_token: string;
}

export interface RegisterDeviceResponse {
  success: boolean;
  message?: string;
  data?: {
    device: {
      id: string | number;
      device_type: string | null;
      platform: string | null;
      last_seen_at: string | null;
    };
  };
}

export type NotificationsStackParamList = {
  NotificationsList: undefined;
  NotificationDetail: { notification: NotificationItem };
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
