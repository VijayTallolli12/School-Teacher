import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { circularsApi } from '../api/circulars';
import { CircularItem } from '../types';

export const useCirculars = (): UseQueryResult<CircularItem[], Error> => {
  return useQuery({
    queryKey: ['circulars'],
    queryFn: async () => {
      const response = await circularsApi.getCirculars();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
