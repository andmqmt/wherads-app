import { api } from '@/lib/api';

type GenerateInsightsRequest = {
  campaignName: string;
  description?: string;
  status: string;
  budget: number;
  startDate?: string;
  endDate?: string;
};

type GenerateDescriptionRequest = {
  campaignName: string;
  keywords?: string;
  budget?: number;
};

export const aiService = {
  getStatus: () => api.get<{ available: boolean }>('/ai/status'),

  generateInsights: (data: GenerateInsightsRequest) =>
    api.post<{ insights: string }>('/ai/insights', data),

  generateDescription: (data: GenerateDescriptionRequest) =>
    api.post<{ description: string }>('/ai/generate-description', data),
};
