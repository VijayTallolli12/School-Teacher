import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
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

export const useHomeworkById = (id: string): UseQueryResult<HomeworkItem, Error> => {
  return useQuery({
    queryKey: ['homework', id],
    queryFn: async () => {
      const response = await homeworkApi.getHomeworkById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateHomework = (): UseMutationResult<
  HomeworkResponse,
  Error,
  HomeworkPayload
> => {
  return useMutation({
    mutationFn: async (payload: HomeworkPayload) => {
      const response = await homeworkApi.createHomework(payload);
      return response;
    },
  });
};

export const useUpdateHomework = (): UseMutationResult<
  HomeworkResponse,
  Error,
  { id: string; payload: HomeworkPayload }
> => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await homeworkApi.updateHomework(id, payload);
      return response;
    },
  });
};
