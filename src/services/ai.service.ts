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

type CampaignSummaryItem = {
  name: string;
  status: string;
  budget: number;
  description?: string;
};

type GenerateSummaryRequest = {
  campaigns: CampaignSummaryItem[];
};

export const aiService = {
  getStatus: () => api.get<{ available: boolean }>('/ai/status'),

  generateInsights: (data: GenerateInsightsRequest) =>
    api.post<{ insights: string }>('/ai/insights', data),

  generateDescription: (data: GenerateDescriptionRequest) =>
    api.post<{ description: string }>('/ai/generate-description', data),

  generateSummary: (data: GenerateSummaryRequest) =>
    api.post<{ summary: string; tips: string[] }>('/ai/summary', data),
};
