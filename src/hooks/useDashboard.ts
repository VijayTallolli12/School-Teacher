import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { DashboardData } from '../types';

export const useDashboard = (): UseQueryResult<DashboardData, Error> => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardApi.getDashboard();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
