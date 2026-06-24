import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { transportApi } from '../api/transport';
import {
  Route,
  Vehicle,
  VehicleLocation,
  LiveTransportStatus,
} from '../types';

export const useAssignedRoutes = (): UseQueryResult<Route[], Error> => {
  return useQuery({
    queryKey: ['transport', 'routes'],
    queryFn: async () => {
      const response = await transportApi.getAssignedRoutes();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useVehicles = (): UseQueryResult<Vehicle[], Error> => {
  return useQuery({
    queryKey: ['transport', 'vehicles'],
    queryFn: async () => {
      const response = await transportApi.getVehicles();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useVehicleLocation = (
  vehicleId: string
): UseQueryResult<VehicleLocation, Error> => {
  return useQuery({
    queryKey: ['transport', 'vehicles', vehicleId, 'location'],
    queryFn: async () => {
      const response = await transportApi.getVehicleLocation(vehicleId);
      return response.data;
    },
    enabled: !!vehicleId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
};

export const useLiveTransportStatus = (): UseQueryResult<
  LiveTransportStatus,
  Error
> => {
  return useQuery({
    queryKey: ['transport', 'live-status'],
    queryFn: async () => {
      const response = await transportApi.getLiveTransportStatus();
      return response.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
};

export const useRouteDetail = (
  routeId: string
): UseQueryResult<Route, Error> => {
  return useQuery({
    queryKey: ['transport', 'routes', routeId],
    queryFn: async () => {
      const response = await transportApi.getRouteDetail(routeId);
      return response.data;
    },
    enabled: !!routeId,
    staleTime: 5 * 60 * 1000,
  });
};
