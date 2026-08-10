import apiClient from '../utils/axios';
import {
  StudentListResponse,
  StudentDetailResponse,
  StudentAttendanceResponse,
  StudentItem,
  StudentDetail,
} from '../types';

export interface StudentQueryParams {
  search?: string;
  class_section_id?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

interface ApiStudentItem {
  id: number;
  uuid: string;
  admission_no: string;
  full_name: string;
  roll_no: string;
  photo_url: string | null;
  class_name: string;
  section: string;
  status: string;
}

interface ApiStudentDetailData {
  id: number;
  uuid: string;
  admission_no: string;
  full_name: string;
  roll_no: string;
  photo_url: string | null;
  class_name: string;
  section: string;
  gender: string;
  date_of_birth: string;
  blood_group: string | null;
  status: string;
  parent_info: {
    father_name: string;
    mother_name: string;
    father_phone: string;
    mother_phone: string;
    father_email: string | null;
    mother_email: string | null;
    address: string;
  };
  attendance: {
    total_days: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  transport: null;
  fee_status: null;
  recent_homework: Array<{ id: number; title: string; subject: string; due_date: string; status: string }>;
}

function mapStudentItem(item: ApiStudentItem): StudentItem {
  return {
    id: String(item.id),
    name: item.full_name ?? 'Unknown Student',
    admissionNo: item.admission_no ?? '',
    photo: item.photo_url ?? undefined,
    className: item.class_name ?? '',
    section: item.section ?? '',
    status: (item.status as StudentItem['status']) ?? 'active',
  };
}

function mapStudentDetail(data: ApiStudentDetailData): StudentDetail {
  return {
    id: String(data?.id ?? ''),
    name: data?.full_name ?? 'Unknown Student',
    admissionNo: data.admission_no ?? '',
    photo: data.photo_url ?? undefined,
    className: data.class_name ?? '',
    section: data.section ?? '',
    rollNumber: data.roll_no ?? '—',
    gender: data.gender ?? '',
    dateOfBirth: data.date_of_birth ?? '',
    bloodGroup: data.blood_group ?? undefined,
    status: (data.status as StudentItem['status']) ?? 'active',
    parentInfo: {
      fatherName: data.parent_info?.father_name ?? '',
      motherName: data.parent_info?.mother_name ?? '',
      fatherPhone: data.parent_info?.father_phone ?? '',
      motherPhone: data.parent_info?.mother_phone ?? '',
      fatherEmail: data.parent_info?.father_email ?? undefined,
      motherEmail: data.parent_info?.mother_email ?? undefined,
      address: data.parent_info?.address ?? '',
    },
    attendance: {
      totalDays: data.attendance?.total_days ?? 0,
      present: data.attendance?.present ?? 0,
      absent: data.attendance?.absent ?? 0,
      late: data.attendance?.late ?? 0,
      percentage: data.attendance?.percentage ?? 0,
    },
    transport: undefined,
    feeStatus: undefined,
    recentHomework: (data.recent_homework ?? []).map((hw) => ({
      id: String(hw.id),
      title: hw.title ?? '',
      subject: hw.subject ?? '',
      dueDate: hw.due_date ?? '',
      status: hw.status ?? '',
    })),
  };
}

export const studentsApi = {
  async getStudents(params?: StudentQueryParams): Promise<StudentListResponse> {
    const queryParams: Record<string, string | number> = {};
    if (params?.search) queryParams.search = params.search;
    if (params?.class_section_id) queryParams.class_section_id = params.class_section_id;
    if (params?.page) queryParams.page = params.page;
    if (params?.perPage) queryParams.per_page = params.perPage;
    if (params?.status) queryParams.status = params.status;

    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiStudentItem[];
      meta?: { total: number; page: number; perPage: number; totalPages: number };
    }>('/api/v1/teacher/students', { params: queryParams });
    const raw = response.data;
    return {
      data: (raw.data ?? []).map(mapStudentItem),
      meta: raw.meta ? {
        total: raw.meta.total,
        page: raw.meta.page,
        perPage: raw.meta.perPage,
        totalPages: raw.meta.totalPages,
      } : undefined,
    };
  },

  async getStudentDetail(studentId: string): Promise<StudentDetailResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiStudentDetailData;
    }>(`/api/v1/teacher/students/${studentId}`);
    return { data: mapStudentDetail(response.data?.data ?? ({} as ApiStudentDetailData)) };
  },

  async getStudentAttendance(studentId: string): Promise<StudentAttendanceResponse> {
    const response = await apiClient.get<StudentAttendanceResponse>(
      `/api/v1/teacher/students/${studentId}/attendance`
    );
    return response.data;
  },

  async getStudentProfile(studentId: string): Promise<StudentDetailResponse> {
    return this.getStudentDetail(studentId);
  },
};
