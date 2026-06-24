import apiClient from '../utils/axios';
import {
  RoutesResponse,
  VehiclesResponse,
  VehicleLocationResponse,
  LiveTransportStatusResponse,
  RouteDetailResponse,
} from '../types';

export const transportApi = {
  async getAssignedRoutes(): Promise<RoutesResponse> {
    const response = await apiClient.get<RoutesResponse>('/api/v1/teacher/transport/routes');
    return response.data;
  },

  async getVehicles(): Promise<VehiclesResponse> {
    const response = await apiClient.get<VehiclesResponse>('/api/v1/teacher/transport/vehicles');
    return response.data;
  },

  async getVehicleLocation(vehicleId: string): Promise<VehicleLocationResponse> {
    const response = await apiClient.get<VehicleLocationResponse>(
      `/api/v1/teacher/transport/vehicles/${vehicleId}/location`
    );
    return response.data;
  },

  async getLiveTransportStatus(): Promise<LiveTransportStatusResponse> {
    const response = await apiClient.get<LiveTransportStatusResponse>(
      '/api/v1/teacher/transport/live-status'
    );
    return response.data;
  },

  async getRouteDetail(routeId: string): Promise<RouteDetailResponse> {
    const response = await apiClient.get<RouteDetailResponse>(
      `/api/v1/teacher/transport/routes/${routeId}`
    );
    return response.data;
  },
};
