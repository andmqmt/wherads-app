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

type DesignCampaignRequest = {
  businessDescription: string;
  products?: string;
  targetRegion?: string;
  targetAudience?: string;
  budget?: number;
  objective?: string;
};

type CampaignDesign = {
  campaignName: string;
  regions: { name: string; reason: string }[];
  audience: { segment: string; ageRange: string; interests: string[] }[];
  priceRanges: {
    channel: string;
    minBudget: number;
    maxBudget: number;
    description: string;
  }[];
  channels: { name: string; priority: string; reason: string }[];
  timeline: { phase: string; duration: string; actions: string[] }[];
  kpis: { metric: string; target: string }[];
};

export const aiService = {
  getStatus: () => api.get<{ available: boolean }>('/ai/status'),

  generateInsights: (data: GenerateInsightsRequest) =>
    api.post<{ insights: string }>('/ai/insights', data),

  generateDescription: (data: GenerateDescriptionRequest) =>
    api.post<{ description: string }>('/ai/generate-description', data),

  generateSummary: (data: GenerateSummaryRequest) =>
    api.post<{ summary: string; tips: string[] }>('/ai/summary', data),

  designCampaign: (data: DesignCampaignRequest) =>
    api.post<CampaignDesign>('/ai/design-campaign', data),
};
