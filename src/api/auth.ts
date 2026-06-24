import apiClient from '../utils/axios';
import { ChangePasswordPayload, UpdateProfilePayload, User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string | null;
  status: string;
  roles: string[];
  last_login_at?: string;
}

interface ApiClassSection {
  id: number;
  class: string;
  section: string;
  is_class_teacher: boolean;
}

interface ApiTeacher {
  id: number;
  employee_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  qualification?: string;
  experience_years?: number;
  subjects?: { id: number; name: string }[];
  class_sections?: ApiClassSection[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
}

function mapApiData(user: ApiUser, teacher: ApiTeacher, schoolId: string): User {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: 'teacher',
    schoolId,
    phone: teacher.phone || user.phone,
    employeeId: teacher.employee_id,
    classTeacherAssignments: teacher.class_sections?.map((cs) => ({
      className: cs.class,
      section: cs.section,
      subject: teacher.subjects?.[0]?.name ?? '',
    })),
  };
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { token: string; user: ApiUser; teacher: ApiTeacher; school_id: number };
    }>('/api/v1/teacher/login', credentials);
    const d = response.data.data;
    return {
      token: d.token,
      user: mapApiData(d.user, d.teacher, String(d.school_id)),
    };
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/v1/teacher/logout');
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: { user: ApiUser; teacher: ApiTeacher };
    }>('/api/v1/teacher/profile');
    const d = response.data.data;
    return {
      user: mapApiData(d.user, d.teacher, ''),
    };
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponse> {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: { user: ApiUser; teacher: ApiTeacher };
    }>('/api/v1/teacher/profile', payload);
    const d = response.data.data;
    return {
      user: mapApiData(d.user, d.teacher, ''),
    };
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post<{ success: boolean; message?: string }>(
      '/api/v1/teacher/change-password',
      payload
    );
    return response.data;
  },
};
