import apiClient from '../utils/axios';
import {
  HomeworkListResponse,
  HomeworkResponse,
  HomeworkPayload,
  HomeworkItem,
} from '../types';

interface ApiHomeworkItem {
  id: number;
  title: string;
  description: string;
  subject: { id: number; name: string };
  class_section: { id?: number; class: string; section: string };
  assigned_date: string;
  due_date: string;
  attachment_url: string | null;
  status: string;
}

function mapHomeworkItem(item: ApiHomeworkItem): HomeworkItem {
  return {
    id: String(item?.id ?? ''),
    title: item?.title ?? '',
    description: item?.description ?? '',
    subject: item?.subject?.name ?? 'Unknown Subject',
    class: item?.class_section?.class ?? '',
    section: item?.class_section?.section ?? '',
    dueDate: item?.due_date ?? '',
    createdAt: item?.assigned_date ?? '',
    attachmentUrl: item?.attachment_url ?? null,
    status: item?.status === 'active' ? 'pending' : item?.status === 'overdue' ? 'overdue' : 'submitted',
  };
}

export const homeworkApi = {
  async getHomework(): Promise<HomeworkListResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiHomeworkItem[];
    }>('/api/v1/teacher/homework');
    return { data: (response.data.data ?? []).map(mapHomeworkItem) };
  },

  async getHomeworkDetail(id: string): Promise<HomeworkResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiHomeworkItem;
    }>(`/api/v1/teacher/homework/${id}`);
    return { data: mapHomeworkItem(response.data.data ?? ({} as ApiHomeworkItem)) };
  },

  async createHomework(payload: HomeworkPayload): Promise<HomeworkResponse> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: ApiHomeworkItem;
    }>('/api/v1/teacher/homework', payload);
    return { data: mapHomeworkItem(response.data.data) };
  },

  async updateHomework(id: string, payload: HomeworkPayload): Promise<HomeworkResponse> {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: ApiHomeworkItem;
    }>(`/api/v1/teacher/homework/${id}`, payload);
    return { data: mapHomeworkItem(response.data.data) };
  },

  async getHomeworkById(id: string): Promise<HomeworkResponse> {
    return this.getHomeworkDetail(id);
  },
};
