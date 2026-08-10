import apiClient from '../utils/axios';
import { CircularItem, CircularsResponse } from '../types';

interface ApiCircularItem {
  id: number | string;
  title?: string | null;
  message?: string | null;
  description?: string | null;
  sent_at?: string | null;
  date?: string | null;
  attachment_url?: string | null;
  type?: string | null;
}

export const circularsApi = {
  async getCirculars(): Promise<CircularsResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiCircularItem[];
    }>('/api/v1/teacher/circulars');

    const items = response.data.data ?? [];
    return {
      data: items.map((circular, index): CircularItem => ({
        id: String(circular?.id ?? `circular-${index}`),
        title: circular?.title ?? 'Circular',
        message: circular?.message ?? circular?.description ?? '',
        date: circular?.sent_at ?? circular?.date ?? '',
        attachmentUrl: circular?.attachment_url ?? null,
        type: circular?.type ?? 'system',
      })),
    };
  },
};

export default circularsApi;
