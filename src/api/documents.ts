import apiClient from '../utils/axios';
import { DocumentItem, DocumentsResponse } from '../types';

interface ApiDocumentItem {
  id: number | string;
  title?: string | null;
  file_name?: string | null;
  file_url?: string | null;
  file_type?: string | null;
  category?: string | null;
  size?: number | null;
  uploaded_at?: string | null;
}

export const documentsApi = {
  async getDocuments(): Promise<DocumentsResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiDocumentItem[];
    }>('/api/v1/teacher/documents');

    const items = response.data.data ?? [];
    return {
      data: items.map((doc, index): DocumentItem => ({
        id: String(doc?.id ?? `doc-${index}`),
        title: doc?.title ?? doc?.file_name ?? 'Untitled document',
        fileName: doc?.file_name ?? doc?.title ?? 'document',
        fileUrl: doc?.file_url ?? '',
        fileType: doc?.file_type ?? '',
        category: doc?.category ?? 'General',
        size: doc?.size ?? 0,
        uploadedAt: doc?.uploaded_at ?? '',
      })),
    };
  },
};

export default documentsApi;
