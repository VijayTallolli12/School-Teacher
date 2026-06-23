import apiClient from '../utils/axios';
import { DashboardResponse } from '../types';

export const dashboardApi = {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>('/api/v1/teacher/dashboard');
    return response.data;
  },
};
