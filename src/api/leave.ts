import apiClient from '../utils/axios';
import {
  LeaveListResponse,
  LeaveBalanceResponse,
  LeaveTypesResponse,
  LeaveDetailResponse,
  ApplyLeaveResponse,
  CancelLeaveResponse,
  LeavePayload,
} from '../types';

export const leaveApi = {
  async getLeaves(): Promise<LeaveListResponse> {
    const response = await apiClient.get<LeaveListResponse>('/api/v1/teacher/leaves');
    return response.data;
  },

  async getLeaveBalance(): Promise<LeaveBalanceResponse> {
    const response = await apiClient.get<LeaveBalanceResponse>('/api/v1/teacher/leaves/balance');
    return response.data;
  },

  async getLeaveTypes(): Promise<LeaveTypesResponse> {
    const response = await apiClient.get<LeaveTypesResponse>('/api/v1/teacher/leaves/types');
    return response.data;
  },

  async getLeaveDetail(leaveId: string): Promise<LeaveDetailResponse> {
    const response = await apiClient.get<LeaveDetailResponse>(
      `/api/v1/teacher/leaves/${leaveId}`
    );
    return response.data;
  },

  async applyLeave(payload: LeavePayload): Promise<ApplyLeaveResponse> {
    const response = await apiClient.post<ApplyLeaveResponse>(
      '/api/v1/teacher/leaves',
      payload
    );
    return response.data;
  },

  async cancelLeave(leaveId: string): Promise<CancelLeaveResponse> {
    const response = await apiClient.post<CancelLeaveResponse>(
      `/api/v1/teacher/leaves/${leaveId}/cancel`
    );
    return response.data;
  },
};
