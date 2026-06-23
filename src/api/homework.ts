import apiClient from '../utils/axios';
import {
  HomeworkListResponse,
  HomeworkResponse,
  HomeworkPayload,
} from '../types';

export const homeworkApi = {
  async getHomework(): Promise<HomeworkListResponse> {
    const response = await apiClient.get<HomeworkListResponse>('/api/v1/teacher/homework');
    return response.data;
  },

  async createHomework(payload: HomeworkPayload): Promise<HomeworkResponse> {
    const response = await apiClient.post<HomeworkResponse>('/api/v1/teacher/homework', payload);
    return response.data;
  },

  async updateHomework(id: string, payload: HomeworkPayload): Promise<HomeworkResponse> {
    const response = await apiClient.put<HomeworkResponse>(`/api/v1/teacher/homework/${id}`, payload);
    return response.data;
  },

  async getHomeworkById(id: string): Promise<HomeworkResponse> {
    const response = await apiClient.get<HomeworkResponse>(`/api/v1/teacher/homework/${id}`);
    return response.data;
  },
};
