import { useQuery, UseQueryResult, useMutation, UseMutationResult } from '@tanstack/react-query';
import { leaveApi } from '../api/leave';
import {
  LeaveItem,
  LeaveBalance,
  LeaveType,
  LeavePayload,
  ApplyLeaveResponse,
  CancelLeaveResponse,
} from '../types';

export const useLeaves = (): UseQueryResult<LeaveItem[], Error> => {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: async () => {
      const response = await leaveApi.getLeaves();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useLeaveBalance = (): UseQueryResult<LeaveBalance[], Error> => {
  return useQuery({
    queryKey: ['leaves', 'balance'],
    queryFn: async () => {
      const response = await leaveApi.getLeaveBalance();
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLeaveTypes = (): UseQueryResult<LeaveType[], Error> => {
  return useQuery({
    queryKey: ['leaves', 'types'],
    queryFn: async () => {
      const response = await leaveApi.getLeaveTypes();
      return response.data;
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useLeaveDetail = (
  leaveId: string
): UseQueryResult<LeaveItem, Error> => {
  return useQuery({
    queryKey: ['leaves', leaveId],
    queryFn: async () => {
      const response = await leaveApi.getLeaveDetail(leaveId);
      return response.data;
    },
    enabled: !!leaveId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApplyLeave = (): UseMutationResult<
  ApplyLeaveResponse,
  Error,
  LeavePayload
> => {
  return useMutation({
    mutationFn: async (payload: LeavePayload) => {
      const response = await leaveApi.applyLeave(payload);
      return response;
    },
  });
};

export const useCancelLeave = (): UseMutationResult<
  CancelLeaveResponse,
  Error,
  string
> => {
  return useMutation({
    mutationFn: async (leaveId: string) => {
      const response = await leaveApi.cancelLeave(leaveId);
      return response;
    },
  });
};
