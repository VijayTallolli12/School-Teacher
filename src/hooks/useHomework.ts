import { useQuery, UseQueryResult, useQueryClient, useMutation, UseMutationResult } from '@tanstack/react-query';
import { homeworkApi } from '../api/homework';
import { HomeworkItem, HomeworkPayload, HomeworkResponse } from '../types';

export const useHomework = (): UseQueryResult<HomeworkItem[], Error> => {
  return useQuery({
    queryKey: ['homework'],
    queryFn: async () => {
      const response = await homeworkApi.getHomework();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHomeworkDetail = (id: string): UseQueryResult<HomeworkItem, Error> => {
  return useQuery({
    queryKey: ['homework', id],
    queryFn: async () => {
      const response = await homeworkApi.getHomeworkDetail(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHomeworkById = useHomeworkDetail;

export const useCreateHomework = (): UseMutationResult<
  HomeworkResponse,
  Error,
  HomeworkPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: HomeworkPayload) => {
      const response = await homeworkApi.createHomework(payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
  });
};

export const useUpdateHomework = (): UseMutationResult<
  HomeworkResponse,
  Error,
  { id: string; payload: HomeworkPayload }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await homeworkApi.updateHomework(id, payload);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
      queryClient.setQueryData(['homework', data.data.id], data.data);
    },
  });
};
