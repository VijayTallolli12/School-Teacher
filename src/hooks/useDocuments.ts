import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { documentsApi } from '../api/documents';
import { DocumentItem } from '../types';

export const useDocuments = (): UseQueryResult<DocumentItem[], Error> => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await documentsApi.getDocuments();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
