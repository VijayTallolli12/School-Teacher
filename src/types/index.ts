import { NavigatorScreenParams } from '@react-navigation/native';

export interface TeacherClassAssignment {
  className: string;
  section: string;
  subject: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher';
  schoolId: string;
  phone?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  classTeacherAssignments?: TeacherClassAssignment[];
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
  student_id: number;
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
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Profile: undefined;
  Exams: undefined;
  ExamDetail: { examId: string };
  MarksEntry: { examId: string };
  ExamSchedule: { examId: string };
  HomeworkCreate: { homeworkId?: string; initialData?: HomeworkPayload } | undefined;
  HomeworkDetail: { homeworkId: string };
  PeriodDetail: { period: PeriodItem };
  Leave: undefined;
  LeaveApply: { leaveType?: string } | undefined;
  LeaveDetail: { leaveId: string };
  Students: undefined;
  StudentDetail: { studentId: string };
  Transport: undefined;
  VehicleTracking: { vehicleId: string };
  RouteDetail: { routeId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Attendance: undefined;
  Homework: undefined;
  Notifications: undefined;
  More: undefined;
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

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
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

export interface ExamItem {
  id: string;
  name: string;
  subject: string;
  className: string;
  section: string;
  date: string;
  duration: number;
  totalMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  resultPublished: boolean;
  marksEntered: boolean;
}

export interface ExamDetail extends ExamItem {
  schedule: ExamScheduleItem[];
  resultSummary?: ExamResultSummary;
  marksEntryStatus: 'pending' | 'partial' | 'completed';
}

export interface ExamScheduleItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  className: string;
  section: string;
  maxMarks: number;
}

export interface ExamResultSummary {
  totalStudents: number;
  appeared: number;
  passed: number;
  failed: number;
  passPercentage: number;
  highestScore: number;
  averageScore: number;
}

export interface MarksEntry {
  studentId: string;
  studentName: string;
  rollNumber: string;
  marks: number | null;
  maxMarks: number;
  isDraft: boolean;
  remarks?: string;
}

export interface MarksPayload {
  examId: string;
  classId: string;
  subjectId: string;
  marks: Array<{
    studentId: string;
    marks: number;
    remarks?: string;
  }>;
  isDraft: boolean;
}

export interface ExamListResponse {
  data: ExamItem[];
}

export interface ExamDetailResponse {
  data: ExamDetail;
}

export interface ExamScheduleResponse {
  data: ExamScheduleItem[];
}

export interface ExamClassesResponse {
  data: Array<{ id: string; name: string; section: string }>;
}

export interface ExamSubjectsResponse {
  data: Array<{ id: string; name: string; code: string }>;
}

export interface MarksResponse {
  data: MarksEntry[];
}

export interface SaveMarksResponse {
  success: boolean;
  message: string;
  data?: { savedCount: number };
}

export interface PublishResultResponse {
  success: boolean;
  message: string;
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

export type StudentStatus = 'active' | 'inactive' | 'transferred';

export interface StudentItem {
  id: string;
  name: string;
  admissionNo: string;
  photo?: string;
  className: string;
  section: string;
  status: StudentStatus;
}

export interface ParentInfo {
  fatherName: string;
  motherName: string;
  fatherPhone: string;
  motherPhone: string;
  fatherEmail?: string;
  motherEmail?: string;
  address: string;
}

export interface AttendanceSummaryData {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface TransportInfo {
  route: string;
  stop: string;
  pickupTime: string;
  dropTime: string;
  driverName?: string;
  driverPhone?: string;
}

export interface FeeStatusInfo {
  totalFee: number;
  paid: number;
  due: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
}

export interface HomeworkSummaryItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: string;
}

export interface StudentDetail {
  id: string;
  name: string;
  admissionNo: string;
  photo?: string;
  className: string;
  section: string;
  rollNumber: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup?: string;
  status: StudentStatus;
  parentInfo: ParentInfo;
  attendance: AttendanceSummaryData;
  transport?: TransportInfo;
  feeStatus?: FeeStatusInfo;
  recentHomework: HomeworkSummaryItem[];
}

export interface StudentListResponse {
  data: StudentItem[];
  meta?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface StudentDetailResponse {
  data: StudentDetail;
}

export interface StudentAttendanceResponse {
  data: AttendanceSummaryData;
}

export interface PeriodItem {
  id: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  className: string;
  section: string;
  room: string;
  teacher: string;
  studentCount: number;
}

export type PeriodStatus = 'current' | 'upcoming' | 'completed';

export interface TimetableDay {
  day: string;
  date: string;
  periods: PeriodItem[];
}

export interface TodayTimetableResponse {
  data: {
    day: TimetableDay;
    currentPeriod: PeriodItem | null;
    nextPeriod: PeriodItem | null;
  };
}

export interface WeeklyTimetableResponse {
  data: TimetableDay[];
}

export interface PeriodDetailResponse {
  data: PeriodItem;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveType {
  id: string;
  name: string;
  description: string;
  defaultDays: number;
  maxConsecutiveDays: number;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveItem {
  id: string;
  leaveType: string;
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approver?: string;
  remarks?: string;
  approvalDate?: string;
  attachment?: string;
  timeline?: LeaveTimelineEntry[];
}

export interface LeaveTimelineEntry {
  status: LeaveStatus;
  date: string;
  remark?: string;
  updatedBy?: string;
}

export interface LeavePayload {
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  attachment?: string;
}

export interface LeaveListResponse {
  data: LeaveItem[];
}

export interface LeaveBalanceResponse {
  data: LeaveBalance[];
}

export interface LeaveTypesResponse {
  data: LeaveType[];
}

export interface LeaveDetailResponse {
  data: LeaveItem;
}

export interface ApplyLeaveResponse {
  success: boolean;
  message?: string;
  data?: LeaveItem;
}

export interface CancelLeaveResponse {
  success: boolean;
  message?: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

export interface MarkAttendancePayload {
  class_section_id: number;
  attendance_date: string;
  students: AttendanceMarkingRecord[];
}

export interface MarkAttendanceRecord {
  id: number;
  student_id: number;
  status: 'present' | 'absent' | 'late';
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    attendance_date: string;
    class_section_id: number;
    marked_count: number;
    records: MarkAttendanceRecord[];
  };
}

export interface ClassesResponse {
  data: TeacherClass[];
}

export interface StudentsResponse {
  data: AttendanceStudent[];
}

// ── Transport ──────────────────────────────────────────────

export type TransportStatusType = 'on_time' | 'arriving' | 'delayed' | 'completed';

export interface Vehicle {
  id: string;
  name: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: TransportStatusType;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  speed: number;
  lastUpdate: string;
  eta: string;
  routeName: string;
  capacity: number;
  assignedStudents: number;
}

export interface RouteStop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
  departureTime: string;
  studentCount: number;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  status: TransportStatusType;
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  stops: RouteStop[];
  assignedStudents: number;
  estimatedArrivalTimes: string;
}

export interface VehicleLocation {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  driverName: string;
  latitude: number;
  longitude: number;
  speed: number;
  lastUpdate: string;
  eta: string;
  status: TransportStatusType;
  routeName: string;
}

export interface ETAData {
  routeName: string;
  vehicleName: string;
  driverName: string;
  currentStop: string;
  nextStop: string;
  estimatedArrival: string;
  remainingStops: number;
  status: TransportStatusType;
}

export interface LiveTransportStatus {
  activeRoutes: number;
  vehiclesInTransit: number;
  upcomingArrivals: number;
  delayedRoutes: number;
  routes: Route[];
  vehicles: VehicleLocation[];
}

export interface RoutesResponse {
  data: Route[];
}

export interface VehiclesResponse {
  data: Vehicle[];
}

export interface VehicleLocationResponse {
  data: VehicleLocation;
}

export interface LiveTransportStatusResponse {
  data: LiveTransportStatus;
}

export interface RouteDetailResponse {
  data: Route;
}
