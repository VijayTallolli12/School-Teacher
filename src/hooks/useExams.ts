import { useQuery, UseQueryResult, useMutation, UseMutationResult } from '@tanstack/react-query';
import { examsApi } from '../api/exams';
import {
  ExamItem,
  ExamDetail,
  ExamScheduleItem,
  MarksEntry,
  SaveMarksResponse,
  MarksPayload,
  PublishResultResponse,
} from '../types';

export const useExams = (): UseQueryResult<ExamItem[], Error> => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const response = await examsApi.getExams();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useExamDetail = (
  examId: string
): UseQueryResult<ExamDetail, Error> => {
  return useQuery({
    queryKey: ['exams', examId],
    queryFn: async () => {
      const response = await examsApi.getExamDetail(examId);
      return response.data;
    },
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useExamSchedule = (
  examId: string
): UseQueryResult<ExamScheduleItem[], Error> => {
  return useQuery({
    queryKey: ['exams', examId, 'schedule'],
    queryFn: async () => {
      const response = await examsApi.getExamSchedule(examId);
      return response.data;
    },
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMarks = (
  examId: string,
  classId: string,
  subjectId: string
): UseQueryResult<MarksEntry[], Error> => {
  return useQuery({
    queryKey: ['exams', examId, 'marks', classId, subjectId],
    queryFn: async () => {
      const response = await examsApi.getMarks(examId, classId, subjectId);
      return response.data;
    },
    enabled: !!examId && !!classId && !!subjectId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSaveMarks = (): UseMutationResult<
  SaveMarksResponse,
  Error,
  MarksPayload
> => {
  return useMutation({
    mutationFn: async (payload: MarksPayload) => {
      const response = await examsApi.saveMarks(payload);
      return response;
    },
  });
};

export const usePublishResults = (): UseMutationResult<
  PublishResultResponse,
  Error,
  string
> => {
  return useMutation({
    mutationFn: async (examId: string) => {
      const response = await examsApi.publishResultsStatus(examId);
      return response;
    },
  });
};
